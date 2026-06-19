import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { User } from '@/types/database';
import PimpinanPegawaiPageClient from './_client';

/**
 * Server Component: fetches pegawai list on the server before sending HTML.
 *
 * The data is injected into the React Query cache via HydrationBoundary so that
 * when the client component mounts, it finds data already available — no fetch,
 * no loading state, no skeleton.
 */
export default async function PimpinanPegawaiPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  });

  // Prefetch: mirrors the exact queryKey used in _client.tsx
  await queryClient.prefetchQuery({
    queryKey: ['pimpinan-pegawai'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'pegawai')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      return (data as User[]) ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PimpinanPegawaiPageClient />
    </HydrationBoundary>
  );
}
