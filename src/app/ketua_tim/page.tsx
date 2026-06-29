import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, User } from '@/types/database';
import KetuaTimDashboardClient from './_client';

export default async function KetuaTimPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ['ketua-tim-uploads', bulan, tahun],
    queryFn: async () => {
      // 1. Get RKs for this ketua tim
      const { data: mappingData, error: mapError } = await supabase
        .from('rk_ketua_tim_mapping')
        .select('rencana_kinerja')
        .eq('ketua_tim_id', user.id);
      
      if (mapError) throw mapError;
      const rkList = mappingData?.map(m => m.rencana_kinerja) || [];

      if (rkList.length === 0) {
        return { uploads: [], users: [] };
      }

      // 2. Find upload_ids that contain these RKs
      const { data: entries, error: entriesError } = await supabase
        .from('ckp_entries')
        .select('upload_id')
        .in('rencana_kinerja', rkList);

      if (entriesError) throw entriesError;
      const uploadIds = Array.from(new Set((entries || []).map(e => e.upload_id)));

      if (uploadIds.length === 0) {
        return { uploads: [], users: [] };
      }

      // 3. Get the actual uploads
      const { data: uploadsData, error: uploadsError } = await supabase
        .from('ckp_uploads')
        .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
        .in('id', uploadIds)
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .order('uploaded_at', { ascending: false });

      if (uploadsError) throw uploadsError;

      const userIds = Array.from(new Set((uploadsData || []).map((u: any) => u.user_id)));
      
      let usersData: any[] = [];
      if (userIds.length > 0) {
        const { data: uData, error: uError } = await supabase
          .from('users')
          .select('*')
          .in('id', userIds)
          .order('full_name');
        if (uError) throw uError;
        usersData = uData || [];
      }

      const newUploads = (uploadsData || []).map((u: any) => ({
        ...u,
        user: u.user as User | undefined,
      })) as (CKPUpload & { user?: User })[];

      return {
        uploads: newUploads,
        users: usersData as User[],
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <KetuaTimDashboardClient />
    </HydrationBoundary>
  );
}
