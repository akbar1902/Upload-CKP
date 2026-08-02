import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminRencanaKinerjaClient from './_client';

export const dynamic = 'force-dynamic';

export default async function AdminRencanaKinerjaPage() {
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

  const [rksRes, subsRes, usersRes] = await Promise.all([
    supabase.from('rk_ketua_tim_mapping').select('*, ketua_tim:users!ketua_tim_id(full_name)').order('rencana_kinerja'),
    supabase.from('master_kegiatan_anggota').select('*').order('kegiatan_nama'),
    supabase.from('users').select('id, full_name, unit_kerja').in('role', ['ketua_tim', 'pimpinan', 'admin'])
  ]);

  if (rksRes.error) console.error('Error fetching RKs (SSR):', rksRes.error);
  if (subsRes.error) console.error('Error fetching Subs (SSR):', subsRes.error);
  
  const rks = rksRes.data || [];
  const subs = subsRes.data || [];
  const ketuaTims = usersRes.data || [];

  const subsByRk = subs.reduce((acc: any, sub: any) => {
    if (!acc[sub.rk_id]) acc[sub.rk_id] = [];
    acc[sub.rk_id].push(sub);
    return acc;
  }, {});

  const initialData = { rks, subsByRk, ketuaTims };

  return <AdminRencanaKinerjaClient initialData={initialData} />;
}
