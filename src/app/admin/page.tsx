import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, User } from '@/types/database';
import { getDefaultPeriod } from '@/lib/utils';
import PimpinanDashboardClient from '@/app/pimpinan/_client';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/login');

  // Defense-in-depth (middleware sudah menjaga): session.user.role dari Supabase
  // berisi 'authenticated', BUKAN role aplikasi. Baca user_metadata.role dulu,
  // fallback ke tabel users — pola yang sama dengan halaman admin lain.
  const metadataRole = user.user_metadata?.role;
  let appRole: string | null = typeof metadataRole === 'string' ? metadataRole : null;

  if (appRole !== 'admin') {
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    appRole = dbUser?.role ?? null;
  }

  if (appRole !== 'admin') redirect('/login');

  const resolvedParams = await searchParams;
  const rawBulan = resolvedParams.bulan as string | undefined;
  const rawTahun = resolvedParams.tahun as string | undefined;
  const defaultPeriod = getDefaultPeriod(10);

  // Dukung mode triwulan ('T1'..'T4') agar queryKey prefetch SAMA PERSIS
  // dengan useQuery di client — tanpa ini prefetch selalu meleset.
  const bulan: string | number = rawBulan
    ? (rawBulan.startsWith('T') ? rawBulan : parseInt(rawBulan, 10))
    : defaultPeriod.bulan;
  const tahun = rawTahun ? parseInt(rawTahun, 10) : defaultPeriod.tahun;

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ['pimpinan-uploads', bulan, tahun],
    queryFn: async () => {
      let uploadsQuery = supabase
        .from('ckp_uploads')
        .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
        .eq('tahun', tahun)
        .order('uploaded_at', { ascending: false });

      if (typeof bulan === 'string' && bulan.startsWith('T')) {
        const triwulanMap: Record<string, number[]> = {
          'T1': [1, 2, 3],
          'T2': [4, 5, 6],
          'T3': [7, 8, 9],
          'T4': [10, 11, 12],
        };
        uploadsQuery = uploadsQuery.in('bulan', triwulanMap[bulan] || []);
      } else {
        uploadsQuery = uploadsQuery.eq('bulan', bulan);
      }

      const [uploadsRes, usersRes] = await Promise.all([
        uploadsQuery,
        supabase
          .from('users')
          .select('*')
          .in('role', ['anggota', 'ketua_tim'])
          .eq('is_active', true)
          .order('full_name'),
      ]);

      if (uploadsRes.error) throw uploadsRes.error;
      if (usersRes.error) throw usersRes.error;

      const newUploads = (uploadsRes.data ?? []).map((u: Record<string, unknown>) => ({
        ...u,
        user: u.user as User | undefined,
      })) as (CKPUpload & { user?: User })[];

      return {
        uploads: newUploads,
        users: (usersRes.data as User[]) ?? [],
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PimpinanDashboardClient />
    </HydrationBoundary>
  );
}
