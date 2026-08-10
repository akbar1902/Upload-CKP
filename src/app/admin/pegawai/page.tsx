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

  const { data: mappings } = await supabase.from('rk_ketua_tim_mapping').select('ketua_tim_id, tim_kerja').not('ketua_tim_id', 'is', null);

  const initialUsers = (data as (User & { managed_teams?: string })[]) ?? [];
  if (mappings && initialUsers.length > 0) {
    initialUsers.forEach(u => {
      if (u.role === 'ketua_tim') {
        const tims = mappings.filter((m: any) => m.ketua_tim_id === u.id).map((m: any) => m.tim_kerja).filter(Boolean);
        if (tims.length > 0) {
          u.managed_teams = [...new Set(tims)].join(', ');
        }
      }
    });
  }

  return <AdminPegawaiClient initialUsers={initialUsers as User[]} />;
}
