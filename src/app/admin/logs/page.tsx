import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminLogsClient from './_client';

// Note: cookies() already makes this page dynamic — force-dynamic is not needed

export default async function AdminLogsPage() {
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

  const { data, error } = await supabase
    .from('audit_logs')
    .select('*, user:users(full_name, role)')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching logs (SSR):', error);
  }

  const initialLogs = data ?? [];

  return <AdminLogsClient initialLogs={initialLogs} />;
}
