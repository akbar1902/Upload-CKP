import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, CKPEntry, Approval, User } from '@/types/database';
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
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/login');
  if (!upload_id) redirect('/');

  const paramBulan = resolvedParams.bulan as string | undefined;
  const paramTahun = resolvedParams.tahun as string | undefined;
  const isTriwulan = typeof paramBulan === 'string' && paramBulan.startsWith('T');

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ['penilaian-ckp-detail', upload_id, paramBulan || '', paramTahun || ''],
    queryFn: async () => {
      const { data: uploadData, error: uploadError } = await supabase
        .from('ckp_uploads')
        .select('*')
        .eq('id', upload_id)
        .single();

      if (uploadError) throw uploadError;
      if (!uploadData) throw new Error('Upload not found');

      let targetUploads: CKPUpload[] = [uploadData];
      let targetUploadIds = [upload_id];
      const targetYear = paramTahun ? parseInt(paramTahun, 10) : uploadData.tahun;

      if (isTriwulan) {
        const triwulanMap: Record<string, number[]> = {
          'T1': [1, 2, 3],
          'T2': [4, 5, 6],
          'T3': [7, 8, 9],
          'T4': [10, 11, 12],
        };
        const targetMonths = triwulanMap[paramBulan!] || [];

        const { data: qUploads } = await supabase
          .from('ckp_uploads')
          .select('*')
          .eq('user_id', uploadData.user_id)
          .eq('tahun', targetYear)
          .in('bulan', targetMonths)
          .order('bulan', { ascending: true });

        if (qUploads && qUploads.length > 0) {
          targetUploads = qUploads;
          targetUploadIds = qUploads.map(u => u.id);
        }
      }

      const [employeeRes, entriesRes, approvalsRes, currentUserRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', uploadData.user_id).single(),
        supabase.from('ckp_entries').select('*').in('upload_id', targetUploadIds).order('row_number'),
        supabase
          .from('approvals')
          .select('*, reviewer:reviewer_id(id, full_name)')
          .in('upload_id', targetUploadIds)
          .order('created_at', { ascending: false }),
        user ? supabase.from('users').select('role').eq('id', user.id).single() : Promise.resolve({ data: null }),
      ]);

      const uploadMonthMap = new Map(targetUploads.map(u => [u.id, u.bulan]));
      const rawEntries = ((entriesRes.data as CKPEntry[]) ?? []).map(e => ({
        ...e,
        bulan: uploadMonthMap.get(e.upload_id) ?? uploadData.bulan,
      }));
      let entriesData = rawEntries;
      const employeeData = employeeRes.data as User;
      const currentUserData = currentUserRes.data;

      if (source === 'ketua_tim' && currentUserData?.role === 'pimpinan' && employeeData.role === 'ketua_tim') {
        const { data: rkMapping } = await supabase
          .from('rk_ketua_tim_mapping')
          .select('rencana_kinerja')
          .or(`ketua_tim_id.eq.${employeeData.id},ketua_tim_id.eq.${user.id}`)
          .eq('is_active', true);
          
        if (rkMapping && rkMapping.length > 0) {
          const ownRks = rkMapping.map(m => m.rencana_kinerja);
          entriesData = entriesData.filter(e => e.rencana_kinerja && ownRks.includes(e.rencana_kinerja));
        } else {
          entriesData = [];
        }
      }

      let finalUpload = uploadData as CKPUpload;
      if (isTriwulan) {
        const totalEntries = entriesData.length;
        const avgProgres = targetUploads.reduce((sum, u) => sum + (u.avg_progres || 0), 0) / targetUploads.length;
        const scoredUploads = targetUploads.filter(u => u.rata_rata_nilai !== null && u.rata_rata_nilai !== undefined);
        const avgScore = scoredUploads.length > 0
          ? scoredUploads.reduce((sum, u) => sum + (u.rata_rata_nilai || 0), 0) / scoredUploads.length
          : null;

        let aggregatedStatus = targetUploads[targetUploads.length - 1].status;
        if (targetUploads.some(u => u.status === 'revision_required')) {
          aggregatedStatus = 'revision_required';
        } else if (targetUploads.some(u => u.status === 'submitted')) {
          aggregatedStatus = 'submitted';
        } else if (targetUploads.some(u => u.status === 'scored')) {
          aggregatedStatus = 'scored';
        } else if (targetUploads.every(u => u.status === 'approved')) {
          aggregatedStatus = 'approved';
        }

        finalUpload = {
          ...targetUploads[targetUploads.length - 1],
          id: upload_id,
          bulan: paramBulan as any,
          tahun: targetYear,
          total_entries: totalEntries,
          avg_progres: avgProgres,
          rata_rata_nilai: avgScore,
          status: aggregatedStatus,
        };
      }

      return {
        upload: finalUpload,
        employee: employeeData,
        entries: entriesData,
        calendarEntries: rawEntries,
        approvals: (approvalsRes.data ?? []).map((a: Record<string, unknown>) => ({
          ...a,
          reviewer: a.reviewer as User | undefined,
        })) as Approval[],
        targetUploadIds,
      };
    },
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
