import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, User } from '@/types/database';
import PimpinanDashboardClient from './_client';

export default async function PimpinanPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Prefetch current month data — the most common view
  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ['pimpinan-uploads', bulan, tahun],
    queryFn: async () => {
      const [uploadsRes, usersRes] = await Promise.all([
        supabase
          .from('ckp_uploads')
          .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
          .eq('bulan', bulan)
          .eq('tahun', tahun)
          .order('uploaded_at', { ascending: false }),
        supabase
          .from('users')
          .select('*')
          .eq('role', 'pegawai')
          .eq('is_active', true)
          .order('full_name'),
      ]);

      if (uploadsRes.error) throw uploadsRes.error;
      if (usersRes.error) throw usersRes.error;

      const newUploads = (uploadsRes.data ?? []).map((u: Record<string, unknown>) => ({
        ...u,
        user: u.user as User | undefined,
      })) as (CKPUpload & { user?: User })[];

      return {
        uploads: newUploads,
        users: (usersRes.data as User[]) ?? [],
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PimpinanDashboardClient />
    </HydrationBoundary>
  );
}