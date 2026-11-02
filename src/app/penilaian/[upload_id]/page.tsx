import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchPenilaianDetail } from '@/lib/penilaian-detail';
import { canViewMonitoringScores } from '@/lib/monitoring-rekap';
import PenilaianCKPDetailClient from './_client';

export default async function PenilaianCKPDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ upload_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { upload_id } = await params;
  const resolvedParams = await searchParams;
  const source = resolvedParams.source as string | undefined;
  // Dibuka dari menu Monitoring CKP → baca lewat service-role agar SEMUA RK
  // pegawai tampil (RLS membatasi ketua tim & menutup data pegawai lain).
  const readonly = resolvedParams.readonly === '1';

  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/login');
  if (!upload_id) redirect('/');

  const paramBulan = resolvedParams.bulan as string | undefined;
  const paramTahun = resolvedParams.tahun as string | undefined;

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

  let dataClient: SupabaseClient = supabase;
  let stripScores = false;
  if (readonly) {
    try {
      dataClient = createAdminClient();
      stripScores = !canViewMonitoringScores(appRole);
    } catch {
      // Service role tidak tersedia → tetap pakai sesi (RLS).
      dataClient = supabase;
    }
  }

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ['penilaian-ckp-detail', upload_id, paramBulan || '', paramTahun || ''],
    queryFn: () =>
      fetchPenilaianDetail(dataClient, upload_id, {
        paramBulan,
        paramTahun,
        source,
        viewer: { id: user.id, role: appRole },
        stripScores,
      }),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <PenilaianCKPDetailClient uploadId={upload_id} />
      </Suspense>
    </HydrationBoundary>
  );
}
