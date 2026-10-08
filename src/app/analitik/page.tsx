import { Suspense } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AnalitikClient from './_client';

export const dynamic = 'force-dynamic';

/**
 * Halaman Analitik — hanya untuk pimpinan & admin.
 *
 * Pengecekan role mengikuti pola /admin/export-penilaian:
 * role dari tabel users (paling akurat), fallback ke user_metadata.role
 * (JWT) bila baris users belum tersedia.
 */
export default async function AnalitikPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/login');

  // 1) Cepat: role dari JWT metadata. 2) Fallback: tabel users.
  let role = user.user_metadata?.role as string | undefined;
  if (role !== 'pimpinan' && role !== 'admin') {
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    role = dbUser?.role ?? undefined;
  }

  if (role !== 'pimpinan' && role !== 'admin') redirect('/login');

  return (
    <Suspense fallback={null}>
      <AnalitikClient />
    </Suspense>
  );
}
