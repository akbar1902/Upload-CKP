import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload } from '@/types/database';
import { getDefaultPeriod } from '@/lib/utils';
import PegawaiDashboardClient from './_client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PegawaiPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/login');

  const resolvedParams = await searchParams;
  const qBulan = resolvedParams.bulan ? parseInt(resolvedParams.bulan as string) : undefined;
  const qTahun = resolvedParams.tahun ? parseInt(resolvedParams.tahun as string) : undefined;

  const defaultPeriod = getDefaultPeriod(10);
  const bulan = qBulan || defaultPeriod.bulan;
  const tahun = qTahun || defaultPeriod.tahun;

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 0 } },
  });

  // queryKey must match exactly: ['pegawai-uploads', user.id]
  await queryClient.prefetchQuery({
    queryKey: ['pegawai-uploads', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ckp_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('tahun', { ascending: false })
        .order('bulan', { ascending: false })
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return (data as CKPUpload[]) ?? [];
    },
    staleTime: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PegawaiDashboardClient />
    </HydrationBoundary>
  );
}