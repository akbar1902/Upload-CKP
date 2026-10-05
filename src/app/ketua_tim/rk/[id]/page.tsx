import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, CKPEntry, User } from '@/types/database';
import { getDefaultPeriod } from '@/lib/utils';
import { getRkDetailAction } from '@/app/actions/penilaian';
import RkDetailClient from './_client';

export default async function RkDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params;
  const resolvedParams = await searchParams;
  const rawBulan = resolvedParams.bulan as string | undefined;
  const qTahun = resolvedParams.tahun ? parseInt(resolvedParams.tahun as string, 10) : undefined;

  const defaultPeriod = getDefaultPeriod(10);
  const bulan: string | number = rawBulan && rawBulan.startsWith('T')
    ? rawBulan
    : (rawBulan ? parseInt(rawBulan, 10) : defaultPeriod.bulan);
  const tahun = qTahun || defaultPeriod.tahun;

  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/login');
  }

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 2 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ['rk-detail', id, bulan, tahun],
    queryFn: async () => {
      const res = await getRkDetailAction(id, bulan, tahun);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={null}>
        <RkDetailClient rkId={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
