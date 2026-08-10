import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminPeriodeClient from './_client';

// Note: cookies() already makes this page dynamic — force-dynamic is not needed

export default async function AdminPeriodePage() {
  const cookieStore = await cookies();
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

  const currentYear = new Date().getFullYear();
  const { data, error } = await supabase
    .from('periode_ckp')
    .select('*')
    .eq('tahun', currentYear);

  if (error && error.code !== '42P01') {
    console.error('Error fetching periode (SSR):', error);
  }

  const initialPeriode = data ?? [];

  return <AdminPeriodeClient initialPeriode={initialPeriode} />;
}
