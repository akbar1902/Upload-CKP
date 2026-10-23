'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { generateIntegrationToken } from '@/lib/integration/tokens.mjs';
import { isPairingCode } from '@/lib/integration/pairing.mjs';

const MAX_ACTIVE_TOKENS = 10;

export interface IntegrationTokenRow {
  id: string;
  name: string;
  token_prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

async function requireSessionUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

async function buatTokenIntegrasi(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  nama: string,
): Promise<{ ok: true; token: string; id: string; prefix: string } | { ok: false; error: string }> {
  const { count, error: countError } = await admin
    .from('integration_tokens')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('revoked_at', null);
  if (countError) throw countError;
  if ((count ?? 0) >= MAX_ACTIVE_TOKENS) {
    return {
      ok: false,
      error: `Maksimal ${MAX_ACTIVE_TOKENS} token aktif. Cabut token lama dulu.`,
    };
  }

  const generated = generateIntegrationToken();
  const { data, error } = await admin
    .from('integration_tokens')
    .insert({
      user_id: userId,
      name: nama,
      token_hash: generated.hash,
      token_prefix: generated.prefix,
    })
    .select('id')
    .single();
  if (error) throw error;

  const { error: auditError } = await admin.from('audit_logs').insert({
    user_id: userId,
    action: 'integration_token_created',
    entity_type: 'integration_tokens',
    entity_id: data.id,
    new_data: { name: nama, prefix: generated.prefix },
  });
  if (auditError) console.warn('[buatTokenIntegrasi] Audit log warning:', auditError.message);

  return { ok: true, token: generated.token, id: data.id, prefix: generated.prefix };
}

export async function listIntegrationTokensAction(): Promise<{
  success: boolean;
  tokens?: IntegrationTokenRow[];
  error?: string;
}> {
  const user = await requireSessionUser();
  if (!user) return { success: false, error: 'Sesi berakhir. Silakan login ulang.' };

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('integration_tokens')
      .select('id, name, token_prefix, created_at, last_used_at, revoked_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return { success: true, tokens: (data ?? []) as IntegrationTokenRow[] };
  } catch (error) {
    console.error('[listIntegrationTokensAction]', error);
    return { success: false, error: 'Gagal memuat token integrasi.' };
  }
}

export async function createIntegrationTokenAction(name: string): Promise<{
  success: boolean;
  token?: string;
  id?: string;
  prefix?: string;
  error?: string;
}> {
  const user = await requireSessionUser();
  if (!user) return { success: false, error: 'Sesi berakhir. Silakan login ulang.' };

  const nama = String(name || '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'CKP App';

  try {
    const admin = createAdminClient();
    const hasil = await buatTokenIntegrasi(admin, user.id, nama);
    if (!hasil.ok) return { success: false, error: hasil.error };
    revalidatePath('/pegawai/integrasi');
    return { success: true, token: hasil.token, id: hasil.id, prefix: hasil.prefix };
  } catch (error) {
    console.error('[createIntegrationTokenAction]', error);
    return { success: false, error: 'Gagal membuat token integrasi. Pastikan migrasi 035 sudah dijalankan.' };
  }
}

/**
 * Setujui pairing dari CKP App. Kode pairing hanya bisa dipakai sekali dan
 * hanya oleh user yang sedang login. Token plaintext disimpan sementara di
 * integration_pairings sampai CKP App mengambilnya (maks 10 menit).
 */
export async function approveIntegrationPairingAction(code: string): Promise<{
  success: boolean;
  nama?: string;
  error?: string;
}> {
  const user = await requireSessionUser();
  if (!user) return { success: false, error: 'Sesi berakhir. Silakan login ulang.' };

  const kode = String(code || '').trim().toUpperCase();
  if (!isPairingCode(kode)) return { success: false, error: 'Kode pairing tidak valid.' };

  try {
    const admin = createAdminClient();
    const { data: pair, error } = await admin
      .from('integration_pairings')
      .select('id, status, expires_at')
      .eq('code', kode)
      .maybeSingle();

    if (error) throw error;
    if (!pair) return { success: false, error: 'Kode pairing tidak ditemukan.' };
    if (pair.status === 'approved') return { success: false, error: 'Kode pairing sudah dipakai.' };
    if (pair.status === 'expired' || new Date(pair.expires_at).getTime() < Date.now()) {
      await admin
        .from('integration_pairings')
        .update({ status: 'expired' })
        .eq('id', pair.id)
        .eq('status', 'pending');
      return { success: false, error: 'Kode pairing sudah kedaluwarsa. Buat koneksi baru dari CKP App.' };
    }

    // Satu perangkat aktif: cabut token pairing lama agar tidak menumpuk.
    await admin
      .from('integration_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('name', 'CKP App (pairing)')
      .is('revoked_at', null);

    const token = await buatTokenIntegrasi(admin, user.id, 'CKP App (pairing)');
    if (!token.ok) return { success: false, error: token.error };

    const now = new Date().toISOString();
    const { data: paired, error: pairError } = await admin
      .from('integration_pairings')
      .update({
        status: 'approved',
        user_id: user.id,
        token_id: token.id,
        token_plain: token.token,
        approved_at: now,
      })
      .eq('id', pair.id)
      .eq('status', 'pending')
      .select('id')
      .maybeSingle();

    if (pairError || !paired) {
      // Jangan tinggalkan token yatim bila kode keburu dipakai request lain.
      await admin
        .from('integration_tokens')
        .update({ revoked_at: now })
        .eq('id', token.id);
      return { success: false, error: 'Kode pairing sudah dipakai. Buat koneksi baru dari CKP App.' };
    }

    const { error: auditError } = await admin.from('audit_logs').insert({
      user_id: user.id,
      action: 'integration_pairing_approved',
      entity_type: 'integration_pairings',
      entity_id: pair.id,
      new_data: { code: kode, token_prefix: token.prefix },
    });
    if (auditError) console.warn('[approveIntegrationPairingAction] Audit log warning:', auditError.message);

    revalidatePath('/pegawai/integrasi');
    return {
      success: true,
      nama: (user.user_metadata?.full_name as string | undefined) || user.email || 'Pegawai',
    };
  } catch (error) {
    console.error('[approveIntegrationPairingAction]', error);
    return { success: false, error: 'Gagal menyetujui pairing. Pastikan migrasi 037 sudah dijalankan.' };
  }
}

export async function revokeIntegrationTokenAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const user = await requireSessionUser();
  if (!user) return { success: false, error: 'Sesi berakhir. Silakan login ulang.' };

  const tokenId = String(id || '').trim();
  if (!tokenId) return { success: false, error: 'Token tidak valid.' };

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('integration_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', tokenId)
      .eq('user_id', user.id)
      .is('revoked_at', null)
      .select('id, name')
      .maybeSingle();

    if (error) throw error;
    if (!data) return { success: false, error: 'Token tidak ditemukan atau sudah dicabut.' };

    const { error: auditError } = await admin.from('audit_logs').insert({
      user_id: user.id,
      action: 'integration_token_revoked',
      entity_type: 'integration_tokens',
      entity_id: data.id,
      old_data: { name: data.name },
    });
    if (auditError) console.warn('[revokeIntegrationTokenAction] Audit log warning:', auditError.message);

    revalidatePath('/pegawai/integrasi');
    return { success: true };
  } catch (error) {
    console.error('[revokeIntegrationTokenAction]', error);
    return { success: false, error: 'Gagal mencabut token integrasi.' };
  }
}
