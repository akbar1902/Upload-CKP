import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() validates the JWT — required for cookie refresh.
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const publicRoutes = ['/login', '/'];

  // Not logged in → redirect to login
  if (!user && !publicRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user) {
    // Step 1: Try to read role from JWT metadata (instant, no DB call)
    let role = (user.user_metadata?.role as string | undefined);

    // Step 2: Fallback — query DB if JWT metadata doesn't have role
    // This fixes the case where user was created without role in metadata
    if (!role || role === 'pegawai') {
      try {
        // Use service role key for server-side DB query (bypasses RLS)
        const adminSupabase = serviceRoleKey
          ? createServerClient(supabaseUrl, serviceRoleKey, {
              cookies: {
                getAll() { return []; },
                setAll() {},
              },
              auth: { persistSession: false },
            })
          : supabase; // fallback to anon key (may fail due to RLS)

        const { data: dbUser } = await adminSupabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (dbUser?.role && dbUser.role !== 'pegawai') {
          role = dbUser.role;
          console.log(`[Middleware] DB role override: ${dbUser.role} for user ${user.email}`);
        } else if (dbUser?.role) {
          role = dbUser.role;
        }
      } catch (err) {
        console.warn('[Middleware] DB role lookup failed, using JWT fallback:', err);
      }
    }

    // Default to pegawai if role still not determined
    if (!role) role = 'pegawai';

    const isPimpinan = role === 'pimpinan' || role === 'admin';

    // Already logged in → redirect away from login/home
    if (pathname === '/login' || pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = isPimpinan ? '/pimpinan' : '/pegawai';
      return NextResponse.redirect(url);
    }

    // Protect pimpinan routes — redirect non-pimpinan to pegawai
    if (pathname.startsWith('/pimpinan') && !isPimpinan) {
      const url = request.nextUrl.clone();
      url.pathname = '/pegawai';
      return NextResponse.redirect(url);
    }

    // Redirect pimpinan/admin away from /pegawai* to pimpinan
    if (pathname.startsWith('/pegawai') && isPimpinan) {
      const url = request.nextUrl.clone();
      url.pathname = '/pimpinan';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
