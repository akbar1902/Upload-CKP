import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload } from '@/types/database';
import PegawaiDashboardClient from './_client';

export default async function PegawaiPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
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
    staleTime: 1000 * 60 * 5,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PegawaiDashboardClient />
    </HydrationBoundary>
  );
}