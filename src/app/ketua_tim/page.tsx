import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, User } from '@/types/database';
import KetuaTimDashboardClient from './_client';

export default async function KetuaTimPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const resolvedParams = await searchParams;
  const qBulan = resolvedParams.bulan ? parseInt(resolvedParams.bulan as string) : undefined;
  const qTahun = resolvedParams.tahun ? parseInt(resolvedParams.tahun as string) : undefined;

  const now = new Date();
  const bulan = qBulan || now.getMonth() + 1;
  const tahun = qTahun || now.getFullYear();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 2 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ['ketua-tim-uploads', bulan, tahun],
    queryFn: async () => {
      // 1. Get RKs for this ketua tim
      const { data: mappingData, error: mapError } = await supabase
        .from('rk_ketua_tim_mapping')
        .select('*')
        .eq('ketua_tim_id', user.id);
      
      if (mapError) throw mapError;
      
      if (!mappingData || mappingData.length === 0) {
        return { rks: [], uploads: [], entries: [], users: [] };
      }
      
      const rkNames = mappingData.map((m: any) => m.rencana_kinerja);
      
      // 2. Get uploads for the selected month that are submitted or approved
      const { data: uploadsData, error: uploadsError } = await supabase
        .from('ckp_uploads')
        .select('id, user_id, status, uploaded_at')
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .in('status', ['submitted', 'approved', 'revision_required']); // Include all non-draft statuses
        
      if (uploadsError) throw uploadsError;
      const uploadIds = uploadsData?.map((u: any) => u.id) || [];
      
      if (uploadIds.length === 0) {
        return { rks: mappingData, uploads: [], entries: [], users: [] };
      }
      
      // 3. Get entries for these uploads that match the RKs
      const { data: entriesData, error: entriesError } = await supabase
        .from('ckp_entries')
        .select('*')
        .in('upload_id', uploadIds)
        .in('rencana_kinerja', rkNames);
        
      if (entriesError) throw entriesError;
      
      const relevantUploadIds = new Set((entriesData || []).map((e: any) => e.upload_id));
      const relevantUploads = (uploadsData || []).filter((u: any) => relevantUploadIds.has(u.id));
      const relevantUserIds = Array.from(new Set(relevantUploads.map((u: any) => u.user_id)));
      
      let usersData: any[] = [];
      if (relevantUserIds.length > 0) {
        const { data: uData, error: uError } = await supabase
          .from('users')
          .select('*')
          .in('id', relevantUserIds);
        if (uError) throw uError;
        usersData = uData || [];
      }

      return {
        rks: mappingData,
        uploads: relevantUploads,
        entries: entriesData || [],
        users: usersData,
      };
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <KetuaTimDashboardClient />
    </HydrationBoundary>
  );
}
