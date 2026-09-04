import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User } from '@/types/database';
import AdminPegawaiClient from './_client';

// Note: cookies() already makes this page dynamic — force-dynamic is not needed

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

  const [{ data, error }, { data: profiles }, { data: mappings }] = await Promise.all([
    supabase
      .from('users')
      .select('id, email, full_name, nip, role, unit_kerja, is_active, created_at, updated_at')
      .order('full_name'),
    supabase
      .from('employee_profiles')
      .select('user_id, jabatan, golongan'),
    supabase
      .from('rk_ketua_tim_mapping')
      .select('ketua_tim_id, tim_kerja')
      .not('ketua_tim_id', 'is', null),
  ]);

  if (error) {
    console.error('Error fetching users (SSR):', error);
  }

  const profileMap = new Map<string, { jabatan: string | null; golongan: string | null }>();
  (profiles || []).forEach((p: any) => {
    profileMap.set(p.user_id, p);
  });

  const initialUsers = (data as (User & { managed_teams?: string })[]) ?? [];
  if (initialUsers.length > 0) {
    initialUsers.forEach(u => {
      const p = profileMap.get(u.id);
      if (p) {
        u.jabatan = p.jabatan;
        u.golongan = p.golongan;
      }
      if (mappings && u.role === 'ketua_tim') {
        const tims = mappings.filter((m: any) => m.ketua_tim_id === u.id).map((m: any) => m.tim_kerja).filter(Boolean);
        if (tims.length > 0) {
          u.managed_teams = [...new Set(tims)].join(', ');
        }
      }
    });
  }

  return <AdminPegawaiClient initialUsers={initialUsers as User[]} />;
}
