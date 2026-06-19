import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, CKPEntry, Approval, User } from '@/types/database';
import CKPDetailClient from './_client';

export default async function PegawaiCKPDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  if (!id) redirect('/pegawai');

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ['ckp-detail', id],
    queryFn: async () => {
      const [uploadRes, entriesRes, approvalsRes] = await Promise.all([
        supabase.from('ckp_uploads').select('*').eq('id', id).single(),
        supabase.from('ckp_entries').select('*').eq('upload_id', id).order('row_number'),
        supabase
          .from('approvals')
          .select('*, reviewer:reviewer_id(full_name)')
          .eq('upload_id', id)
          .order('created_at', { ascending: false }),
      ]);

      if (uploadRes.error) throw uploadRes.error;

      return {
        upload: uploadRes.data as CKPUpload,
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
      <CKPDetailClient />
    </HydrationBoundary>
  );
}