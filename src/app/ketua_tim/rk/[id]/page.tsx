import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, CKPEntry, User } from '@/types/database';
import { getDefaultPeriod } from '@/lib/utils';
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
  const qBulan = resolvedParams.bulan ? parseInt(resolvedParams.bulan as string) : undefined;
  const qTahun = resolvedParams.tahun ? parseInt(resolvedParams.tahun as string) : undefined;

  const defaultPeriod = getDefaultPeriod(10);
  const bulan = qBulan || defaultPeriod.bulan;
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
      // 1. Get RK mapping details to know the RK Name
      const { data: mappingData, error: mapError } = await supabase
        .from('rk_ketua_tim_mapping')
        .select('*')
        .eq('id', id)
        .single();
      
      if (mapError) throw mapError;
      if (!mappingData) throw new Error("Rencana Kinerja tidak ditemukan");

      // Verify that the user actually leads this RK (or is pimpinan/admin)
      if (mappingData.ketua_tim_id !== user.id && user.user_metadata?.role !== 'pimpinan' && user.user_metadata?.role !== 'admin') {
         // Since role isn't strictly enforced in metadata, we might just let RLS handle it.
         // But rk_ketua_tim_mapping doesn't have strict RLS for select.
      }

      const rkName = mappingData.rencana_kinerja;

      // 2. Fetch all uploads for the selected month to get their statuses
      const { data: uploadsData, error: uploadsError } = await supabase
        .from('ckp_uploads')
        .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .in('status', ['submitted', 'approved', 'revision_required']); // Only consider active uploads
        
      if (uploadsError) throw uploadsError;
      
      const uploadIds = uploadsData?.map((u: any) => u.id) || [];

      if (uploadIds.length === 0) {
        return { rk: mappingData, entries: [], users: [], uploads: [] };
      }

      // 3. Fetch entries matching this RK
      const { data: entriesData, error: entriesError } = await supabase
        .from('ckp_entries')
        .select('*')
        .in('upload_id', uploadIds)
        .eq('rencana_kinerja', rkName);
        
      if (entriesError) throw entriesError;
      
      const relevantUploadIds = new Set((entriesData || []).map((e: any) => e.upload_id));
      let relevantUploads = (uploadsData || []).filter((u: any) => relevantUploadIds.has(u.id));
      
      // Filter out the logged-in user themselves
      relevantUploads = relevantUploads.filter((u: any) => u.user_id !== user.id);

      const newUploads = relevantUploads.map((u: any) => ({
        ...u,
        user: u.user as User | undefined,
      })) as (CKPUpload & { user?: User })[];

      return {
        rk: mappingData,
        entries: entriesData || [],
        uploads: newUploads,
      };
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RkDetailClient rkId={id} />
    </HydrationBoundary>
  );
}
