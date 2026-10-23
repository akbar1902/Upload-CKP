import { redirect } from 'next/navigation';
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server';
import PairClient from './_client';

export const dynamic = 'force-dynamic';

export default async function PairPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const kode = String(code || '').trim().toUpperCase();
  let status: 'pending' | 'approved' | 'expired' | 'invalid' = 'invalid';
  let expiresAt = '';
  let error = '';

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('integration_pairings')
      .select('status, expires_at')
      .eq('code', kode)
      .maybeSingle();

    if (!data) {
      status = 'invalid';
    } else if (data.status === 'approved') {
      status = 'approved';
    } else if (data.status === 'expired') {
      status = 'expired';
    } else {
      status = 'pending';
      expiresAt = data.expires_at;
    }
  } catch (e) {
    console.error('[PairPage]', e);
    error = 'Gagal membaca kode pairing. Pastikan migrasi 037 sudah dijalankan.';
  }

  return <PairClient kode={kode} status={status} expiresAt={expiresAt} initialError={error} />;
}
