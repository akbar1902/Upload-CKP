import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getDefaultPeriod } from '@/lib/utils';
import { fetchMonitoringRekap, canViewMonitoringScores, stripMonitoringScores } from '@/lib/monitoring-rekap';
import PimpinanDashboardClient from '@/app/pimpinan/_client';

/**
 * Monitoring CKP untuk SEMUA peran.
 *
 * Halaman ini menampilkan rekap CKP per pegawai (sama seperti dashboard
 * pimpinan/admin). Hak akses:
 *  - pimpinan  → boleh menilai & menyetujui, boleh melihat nilai.
 *  - admin     → hanya melihat (view only), boleh melihat nilai.
 *  - ketua_tim, anggota → hanya melihat, nilai (skor) disembunyikan.
 *
 * Data dibaca lewat klien service-role (setelah sesi diverifikasi) karena
 * RLS `ckp_uploads` hanya membuka baris milik sendiri untuk anggota.
 */
export default async function MonitoringPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/login');

  // Role aplikasi: metadata JWT dulu, fallback ke tabel users.
  const metadataRole = user.user_metadata?.role;
  let appRole: string | null = typeof metadataRole === 'string' ? metadataRole : null;
  if (!appRole || appRole === 'pegawai') {
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    appRole = dbUser?.role ?? appRole;
  }
  const role = appRole ?? 'anggota';

  const resolvedParams = await searchParams;
  const rawBulan = resolvedParams.bulan as string | undefined;
  const qTahun = resolvedParams.tahun ? parseInt(resolvedParams.tahun as string) : undefined;

  const defaultPeriod = getDefaultPeriod(10);
  // Dukung mode bulan (number) dan triwulan T1–T4 (string) agar queryKey
  // prefetch cocok dengan _client.tsx: ['pimpinan-uploads', bulan, tahun].
  let bulan: string | number = defaultPeriod.bulan;
  if (rawBulan && rawBulan.startsWith('T')) {
    bulan = rawBulan;
  } else if (rawBulan) {
    const parsed = parseInt(rawBulan);
    if (!Number.isNaN(parsed)) bulan = parsed;
  }
  const tahun = qTahun || defaultPeriod.tahun;

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  try {
    const admin = createAdminClient();
    const showScores = canViewMonitoringScores(role);
    await queryClient.prefetchQuery({
      queryKey: ['pimpinan-uploads', bulan, tahun],
      queryFn: async () => {
        const data = await fetchMonitoringRekap(admin, bulan, tahun);
        return showScores ? data : stripMonitoringScores(data);
      },
      staleTime: 1000 * 60 * 5,
    });
  } catch {
    // Prefetch bersifat optimisasi: bila gagal, client tetap memuat sendiri.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <PimpinanDashboardClient readOnly={role !== 'pimpinan'} viewerRole={role} serverData />
      </Suspense>
    </HydrationBoundary>
  );
}
