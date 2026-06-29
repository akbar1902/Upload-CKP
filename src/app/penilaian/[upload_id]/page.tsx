import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, CKPEntry, Approval, User } from '@/types/database';
import PenilaianCKPDetailClient from './_client';

export default async function PenilaianCKPDetailPage({
  params,
}: {
  params: Promise<{ upload_id: string }>;
}) {
  const { upload_id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  if (!upload_id) redirect('/');

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ['penilaian-ckp-detail', upload_id],
    queryFn: async () => {
      const { data: uploadData, error: uploadError } = await supabase
        .from('ckp_uploads')
        .select('*')
        .eq('id', upload_id)
        .single();

      if (uploadError) throw uploadError;
      if (!uploadData) throw new Error('Upload not found');

      const [employeeRes, entriesRes, approvalsRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', uploadData.user_id).single(),
        supabase.from('ckp_entries').select('*').eq('upload_id', upload_id).order('row_number'),
        supabase
          .from('approvals')
          .select('*, reviewer:reviewer_id(id, full_name)')
          .eq('upload_id', upload_id)
          .order('created_at', { ascending: false }),
      ]);

      return {
        upload: uploadData as CKPUpload,
        employee: employeeRes.data as User,
        entries: (entriesRes.data as CKPEntry[]) ?? [],
        approvals: (approvalsRes.data ?? []).map((a: Record<string, unknown>) => ({
          ...a,
          reviewer: a.reviewer as User | undefined,
        })) as Approval[],
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PenilaianCKPDetailClient uploadId={upload_id} />
    </HydrationBoundary>
  );
}
