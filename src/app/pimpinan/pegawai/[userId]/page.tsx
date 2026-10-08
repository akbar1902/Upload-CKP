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
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/login');
  if (!userId) redirect('/pimpinan/pegawai');

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  await queryClient.prefetchQuery({
    // HARUS sama persis dengan useQuery di _client.tsx (queryKey, select,
    // dan transformasi) — kalau tidak, data hasil prefetch terbuang dan
    // jabatan/golongan dari employee_profiles hilang saat pertama dibuka.
    queryKey: ['pimpinan-pegawai-detail', userId],
    queryFn: async () => {
      const [userRes, profileRes, uploadsRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).single(),
        supabase.from('employee_profiles').select('*').eq('user_id', userId).maybeSingle(),
        supabase
          .from('ckp_uploads')
          .select('*')
          .eq('user_id', userId)
          .order('tahun', { ascending: false })
          .order('bulan', { ascending: false }),
      ]);

      if (userRes.error) throw userRes.error;

      const employee: User = {
        ...(userRes.data as User),
        jabatan: profileRes?.data?.jabatan || null,
        golongan: profileRes?.data?.golongan || null,
        profile: profileRes?.data || null,
      };

      return {
        employee,
        uploads: (uploadsRes.data as CKPUpload[]) || [],
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
