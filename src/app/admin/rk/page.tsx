import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminRencanaKinerjaClient from './_client';

export const dynamic = 'force-dynamic';

export default async function AdminRencanaKinerjaPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase
    .from('rk_ketua_tim_mapping')
    .select('*, ketua_tim:users!ketua_tim_id(full_name)')
    .order('rencana_kinerja');

  if (error) {
    console.error('Error fetching RKs (SSR):', error);
  }

  const initialRks = data ?? [];

  return <AdminRencanaKinerjaClient initialRks={initialRks} />;
}
