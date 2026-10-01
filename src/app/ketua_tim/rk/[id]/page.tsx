import { Suspense } from 'react';
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
      // 1. Get RK mapping details to know the RK Name
      const { data: mappingData, error: mapError } = await supabase
        .from('rk_ketua_tim_mapping')
        .select('*')
        .eq('id', id)
        .single();
      
      if (mapError) throw mapError;
      if (!mappingData) throw new Error("Rencana Kinerja tidak ditemukan");

      const rkName = mappingData.rencana_kinerja;

      // 1.5 Fetch user_rk_assignments for this RK
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('user_rk_assignments')
        .select('user_id')
        .eq('rk_id', id);

      if (assignmentsError) throw assignmentsError;
      const assignedUserIds = new Set(assignmentsData?.map((a: any) => a.user_id) || []);

      // 2. Fetch all uploads for the selected month to get their statuses
      let uploadsQuery = supabase
        .from('ckp_uploads')
        .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
        .eq('tahun', tahun)
        .in('status', ['submitted', 'scored', 'approved', 'revision_required']); // Only consider active uploads

      if (typeof bulan === 'string' && bulan.startsWith('T')) {
        const triwulanMap: Record<string, number[]> = {
          'T1': [1, 2, 3],
          'T2': [4, 5, 6],
          'T3': [7, 8, 9],
          'T4': [10, 11, 12]
        };
        uploadsQuery = uploadsQuery.in('bulan', triwulanMap[bulan] || []);
      } else {
        uploadsQuery = uploadsQuery.eq('bulan', bulan);
      }
        
      const { data: uploadsData, error: uploadsError } = await uploadsQuery;
      if (uploadsError) throw uploadsError;
      
      const uploadIds = uploadsData?.map((u: any) => u.id) || [];

      if (uploadIds.length === 0) {
        return { rk: mappingData, entries: [], users: [], uploads: [] };
      }

      // 3. Fetch entries matching this RK (chunked to bypass 1000 row limit and avoid URL length overflow)
      let entriesData: any[] = [];
      const batchSize = 50;
      for (let i = 0; i < uploadIds.length; i += batchSize) {
        const batchIds = uploadIds.slice(i, i + batchSize);
        let from = 0;
        const limit = 999;
        while (true) {
          const { data: chunk, error: entriesError } = await supabase
            .from('ckp_entries')
            .select('*')
            .in('upload_id', batchIds)
            .eq('rencana_kinerja', rkName)
            .range(from, from + limit);

          if (entriesError) throw entriesError;
          if (chunk) entriesData.push(...chunk);
          if (!chunk || chunk.length <= limit) break;
          from += limit + 1;
        }
      }

      const { data: allMappingsForRK } = await supabase
        .from('rk_ketua_tim_mapping')
        .select('ketua_tim_id')
        .eq('rencana_kinerja', rkName);
      const validKetuaTimIds = new Set(allMappingsForRK?.map((m: any) => m.ketua_tim_id).filter(Boolean));
      
      const relevantUploadIds = new Set((entriesData || []).map((e: any) => e.upload_id));
      let relevantUploads = (uploadsData || []).filter((u: any) => {
        if (!relevantUploadIds.has(u.id)) return false;
        if (user.user_metadata?.role === 'pimpinan' || user.user_metadata?.role === 'admin') {
          if (mappingData.ketua_tim_id !== user.id) {
            return u.user_id === mappingData.ketua_tim_id;
          }
          return assignedUserIds.has(u.user_id) || validKetuaTimIds.has(u.user_id);
        }
        return assignedUserIds.has(u.user_id);
      });
      
      // Filter out the logged-in user themselves
      relevantUploads = relevantUploads.filter((u: any) => u.user_id !== user.id);

      const newUploads = relevantUploads.map((u: any) => ({
        ...u,
        user: u.user as User | undefined,
      })) as (CKPUpload & { user?: User })[];

      const finalUploadIds = new Set(newUploads.map(u => u.id));
      const finalEntries = (entriesData || []).filter(e => finalUploadIds.has(e.upload_id));

      return {
        rk: mappingData,
        entries: finalEntries,
        uploads: newUploads,
      };
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
