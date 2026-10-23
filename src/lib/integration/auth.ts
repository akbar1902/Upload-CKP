import { createAdminClient } from '@/lib/supabase/server';
import {
  extractBearerToken,
  hashIntegrationToken,
  isIntegrationToken,
} from './tokens.mjs';

export interface IntegrationUser {
  id: string;
  email: string | null;
  full_name: string | null;
  nip: string | null;
  role: string | null;
  unit_kerja: string | null;
  is_active: boolean | null;
}

export type IntegrationAuthResult =
  | { ok: true; userId: string; user: IntegrationUser; tokenId: string }
  | { ok: false; status: number; error: string };

/**
 * Autentikasi request CKP App lewat `Authorization: Bearer <token>`.
 * Hanya hash token yang disimpan; plaintext tidak pernah dibaca dari DB.
 */
export async function authenticateIntegrationRequest(
  request: Request,
): Promise<IntegrationAuthResult> {
  const token = extractBearerToken(request.headers.get('authorization'));
  if (!isIntegrationToken(token)) {
    return { ok: false, status: 401, error: 'Token integrasi tidak valid.' };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (error) {
    console.error('[integration-auth] Admin client gagal dibuat:', error);
    return { ok: false, status: 500, error: 'Konfigurasi server integrasi belum lengkap.' };
  }

  const { data: tokenRow, error: tokenError } = await admin
    .from('integration_tokens')
    .select('id, user_id, revoked_at')
    .eq('token_hash', hashIntegrationToken(token))
    .maybeSingle();

  if (tokenError) {
    console.error('[integration-auth] Gagal membaca token:', tokenError.message);
    return { ok: false, status: 500, error: 'Gagal memverifikasi token integrasi.' };
  }
  if (!tokenRow || tokenRow.revoked_at) {
    return { ok: false, status: 401, error: 'Token integrasi tidak berlaku atau sudah dicabut.' };
  }

  const { data: user, error: userError } = await admin
    .from('users')
    .select('id, email, full_name, nip, role, unit_kerja, is_active')
    .eq('id', tokenRow.user_id)
    .maybeSingle();

  if (userError) {
    console.error('[integration-auth] Gagal membaca user:', userError.message);
    return { ok: false, status: 500, error: 'Gagal membaca profil pemilik token.' };
  }
  if (!user || user.is_active === false) {
    return { ok: false, status: 403, error: 'Akun pemilik token tidak aktif.' };
  }

  // Catat pemakaian terakhir; kegagalan update tidak boleh menggagalkan request.
  const { error: touchError } = await admin
    .from('integration_tokens')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', tokenRow.id);
  if (touchError) {
    console.warn('[integration-auth] Gagal update last_used_at:', touchError.message);
  }

  return {
    ok: true,
    userId: user.id,
    user: user as IntegrationUser,
    tokenId: tokenRow.id,
  };
}
