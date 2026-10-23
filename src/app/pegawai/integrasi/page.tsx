import { redirect } from 'next/navigation';
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server';
import IntegrasiClient from './_client';

export const dynamic = 'force-dynamic';

export default async function IntegrasiCkpAppPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  let initialTokens: Array<{
    id: string;
    name: string;
    token_prefix: string;
    created_at: string;
    last_used_at: string | null;
    revoked_at: string | null;
  }> = [];
  let initialError = '';

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('integration_tokens')
      .select('id, name, token_prefix, created_at, last_used_at, revoked_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    initialTokens = data ?? [];
  } catch (error) {
    console.error('[IntegrasiCkpAppPage] Gagal memuat token:', error);
    initialError = 'Gagal memuat token integrasi. Pastikan migrasi 035/036 sudah dijalankan.';
  }

  return <IntegrasiClient initialTokens={initialTokens} initialError={initialError} />;
}
