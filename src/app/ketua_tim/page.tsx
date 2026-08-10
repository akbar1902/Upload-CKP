import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { CKPUpload, User } from '@/types/database';
import KetuaTimDashboardClient from './_client';
import { getDefaultPeriod } from '@/lib/utils';
import PimpinanKetuaTimDashboardClient from './_pimpinan_client';

export default async function KetuaTimPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/');
  }

  // Try JWT metadata first (instant, no DB call) — proxy writes role to JWT on login
  let userRole = user.user_metadata?.role as string | undefined;
  if (!userRole || userRole === 'pegawai') {
    // Fallback: fetch from DB (only needed on first session or after role change)
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
    userRole = userData?.role;
  }
  const isPimpinan = userRole === 'pimpinan' || userRole === 'admin';

  const resolvedParams = await searchParams;
  const qBulan = resolvedParams.bulan ? parseInt(resolvedParams.bulan as string) : undefined;
  const qTahun = resolvedParams.tahun ? parseInt(resolvedParams.tahun as string) : undefined;

  const defaultPeriod = getDefaultPeriod(10);
  const bulan = qBulan || defaultPeriod.bulan;
  const tahun = qTahun || defaultPeriod.tahun;

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 2 } },
  });

  if (isPimpinan) {
    await queryClient.prefetchQuery({
      queryKey: ['pimpinan-ketua-tim-uploads', bulan, tahun],
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
            .select('*, rk_ketua_tim_mapping!rk_ketua_tim_mapping_ketua_tim_id_fkey(tim_kerja)')
            .eq('role', 'ketua_tim')
            .eq('is_active', true)
            .order('full_name'),
        ]);

        const newUploads = (uploadsRes.data ?? []).map((u: Record<string, unknown>) => ({
          ...u,
          user: u.user as User | undefined,
        })) as (CKPUpload & { user?: User })[];

        const mappedUsers = (usersRes.data as any[] ?? []).map((u) => {
          // Fallback unit_kerja to tim_kerja from mapping if empty
          let timKerja = null;
          if (u.rk_ketua_tim_mapping && u.rk_ketua_tim_mapping.length > 0) {
            timKerja = u.rk_ketua_tim_mapping.find((m: any) => m.tim_kerja)?.tim_kerja || u.rk_ketua_tim_mapping[0].tim_kerja;
          }
          return {
            ...u,
            unit_kerja: u.unit_kerja || timKerja || null,
          };
        });

        return {
          uploads: newUploads,
          users: mappedUsers as User[],
        };
      },
      staleTime: 1000 * 60 * 5,
    });
  } else {
    await queryClient.prefetchQuery({
      // KEY must match exactly what _client.tsx uses: ['ketua-tim-uploads', bulan, tahun]
      queryKey: ['ketua-tim-uploads', bulan, tahun],
      queryFn: async () => {
        // 1. Get RKs for this ketua tim
        const { data: mappingData, error: mapError } = await supabase
          .from('rk_ketua_tim_mapping')
          .select('*')
          .eq('ketua_tim_id', user.id);
        
        if (mapError) throw mapError;
        
        if (!mappingData || mappingData.length === 0) {
          return { rks: [], uploads: [], entries: [], users: [], assignments: [] };
        }
        
        const rkNames = mappingData.map((m: any) => m.rencana_kinerja);
        const rkIds = mappingData.map((m: any) => m.id);
        
        // 2. Fetch uploads + assignments in parallel (independent queries)
        const [uploadsRes, assignmentsRes] = await Promise.all([
          supabase
            .from('ckp_uploads')
            .select('id, user_id, status, uploaded_at')
            .eq('bulan', bulan)
            .eq('tahun', tahun)
            .in('status', ['submitted', 'approved', 'revision_required']),
          supabase
            .from('user_rk_assignments')
            .select('user_id, rk_id')
            .in('rk_id', rkIds),
        ]);
          
        if (uploadsRes.error) throw uploadsRes.error;
        const uploadIds = uploadsRes.data?.map((u: any) => u.id) || [];
        
        if (uploadIds.length === 0) {
          return { rks: mappingData, uploads: [], entries: [], users: [], assignments: assignmentsRes.data || [] };
        }
        
        // 3. Get entries for these uploads that match the RKs (chunked to bypass 1000 row limit)
        let entriesData: any[] = [];
        let from = 0;
        const limit = 999;
        while (true) {
          const { data: chunk, error: entriesError } = await supabase
            .from('ckp_entries')
            .select('*')
            .in('upload_id', uploadIds)
            .in('rencana_kinerja', rkNames)
            .range(from, from + limit);
            
          if (entriesError) throw entriesError;
          if (chunk) entriesData.push(...chunk);
          if (!chunk || chunk.length <= limit) break;
          from += limit + 1;
        }
        
        const relevantUploadIds = new Set((entriesData || []).map((e: any) => e.upload_id));
        const relevantUploads = (uploadsRes.data || []).filter((u: any) => relevantUploadIds.has(u.id));
        const relevantUserIds = Array.from(new Set(relevantUploads.map((u: any) => u.user_id)));
        
        let usersData: any[] = [];
        if (relevantUserIds.length > 0) {
          const { data: uData, error: uError } = await supabase
            .from('users')
            .select('id, email, full_name, nip, role, unit_kerja, is_active')
            .in('id', relevantUserIds);
          if (uError) throw uError;
          usersData = uData || [];
        }

        return {
          rks: mappingData,
          uploads: relevantUploads,
          entries: entriesData || [],
          users: usersData,
          assignments: assignmentsRes.data || [],
        };
      },
      staleTime: 1000 * 60 * 2,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {isPimpinan ? <PimpinanKetuaTimDashboardClient /> : <KetuaTimDashboardClient />}
    </HydrationBoundary>
  );
}
