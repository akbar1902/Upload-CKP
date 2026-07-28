import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User } from '@/types/database';
import AdminPegawaiClient from './_client';

export const dynamic = 'force-dynamic';

export default async function AdminPegawaiPage() {
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
    .from('users')
    .select('*')
    .order('full_name');

  if (error) {
    console.error('Error fetching users (SSR):', error);
  }

  const initialUsers = (data as User[]) ?? [];

  return <AdminPegawaiClient initialUsers={initialUsers} />;
}
