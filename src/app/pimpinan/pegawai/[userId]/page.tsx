import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, User } from '@/types/database';
import PimpinanPegawaiDetailClient from './_client';

export default async function PimpinanPegawaiDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  if (!userId) redirect('/pimpinan/pegawai');

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ['pimpinan-pegawai-detail', userId],
    queryFn: async () => {
      const [userRes, uploadsRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).single(),
        supabase
          .from('ckp_uploads')
          .select('*')
          .eq('user_id', userId)
          .order('tahun', { ascending: false })
          .order('bulan', { ascending: false }),
      ]);

      if (userRes.error) throw userRes.error;

      return {
        employee: userRes.data as User,
        uploads: (uploadsRes.data as CKPUpload[]) ?? [],
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PimpinanPegawaiDetailClient />
    </HydrationBoundary>
  );
}
