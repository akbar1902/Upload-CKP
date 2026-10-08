import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

import { createClient } from '@supabase/supabase-js';

/**
 * Klien service role (bypass RLS) untuk kebutuhan server.
 *
 * FAIL CLOSED: bila `SUPABASE_SERVICE_ROLE_KEY` belum diset, fungsi ini
 * melempar error — BUKAN diam-diam jatuh ke anon key. Fallback lama
 * (service key → anon key) berbahaya karena operasi admin seolah berjalan
 * padahal RLS tetap aktif, sehingga bisa gagal separuh jalan tanpa jejak.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL belum diset. Atur environment variable Supabase sebelum menjalankan operasi server.'
    );
  }

  if (!supabaseServiceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY belum diset. Operasi server yang membutuhkan akses admin tidak dapat dijalankan tanpa service role key.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
