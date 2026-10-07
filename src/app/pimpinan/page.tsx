import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, User } from '@/types/database';
import { getDefaultPeriod } from '@/lib/utils';
import PimpinanDashboardClient from './_client';

export default async function PimpinanPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/login');

  const resolvedParams = await searchParams;
  const rawBulan = resolvedParams.bulan as string | undefined;
  const qTahun = resolvedParams.tahun ? parseInt(resolvedParams.tahun as string) : undefined;

  const defaultPeriod = getDefaultPeriod(10);
  // Dukung mode bulan (number) dan triwulan T1–T4 (string) agar queryKey
  // prefetch cocok dengan _client.tsx: ['pimpinan-uploads', bulan, tahun].
  let bulan: string | number = defaultPeriod.bulan;
  if (rawBulan && rawBulan.startsWith('T')) {
    bulan = rawBulan;
  } else if (rawBulan) {
    const parsed = parseInt(rawBulan);
    if (!Number.isNaN(parsed)) bulan = parsed;
  }
  const tahun = qTahun || defaultPeriod.tahun;

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ['pimpinan-uploads', bulan, tahun],
    queryFn: async () => {
      const triwulanMap: Record<string, number[]> = {
        T1: [1, 2, 3],
        T2: [4, 5, 6],
        T3: [7, 8, 9],
        T4: [10, 11, 12],
      };
      let uploadsQuery = supabase
        .from('ckp_uploads')
        .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
        .eq('tahun', tahun)
        .order('uploaded_at', { ascending: false });
      uploadsQuery =
        typeof bulan === 'string' && bulan.startsWith('T')
          ? uploadsQuery.in('bulan', triwulanMap[bulan] || [])
          : uploadsQuery.eq('bulan', bulan);

      const [uploadsRes, usersRes] = await Promise.all([
        uploadsQuery,
        supabase
          .from('users')
          .select('id, email, full_name, nip, role, unit_kerja, is_active')
          .in('role', ['anggota', 'ketua_tim'])
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
      <Suspense fallback={null}>
        <PimpinanDashboardClient />
      </Suspense>
    </HydrationBoundary>
  );
}