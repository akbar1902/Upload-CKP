import { createAdminClient } from '@/lib/supabase/server';
import { hashPairingSecret } from '@/lib/integration/pairing.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return json({ success: false, error: 'Pairing tidak valid.' }, 400);

  const secret = new URL(request.url).searchParams.get('secret') || '';
  if (!secret || secret.length < 20) {
    return json({ success: false, error: 'Secret pairing tidak valid.' }, 400);
  }
  const secretHash = hashPairingSecret(secret);

  try {
    const admin = createAdminClient();
    const { data: pair, error } = await admin
      .from('integration_pairings')
      .select('id, status, secret_hash, token_plain, expires_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[pairing poll]', error.message);
      return json({ success: false, error: 'Gagal membaca pairing.' }, 500);
    }
    if (!pair || pair.secret_hash !== secretHash) {
      return json({ success: false, error: 'Pairing tidak ditemukan.' }, 404);
    }

    const kedaluwarsa = new Date(pair.expires_at).getTime() < Date.now();
    if (pair.status === 'pending' && kedaluwarsa) {
      await admin
        .from('integration_pairings')
        .update({ status: 'expired' })
        .eq('id', id)
        .eq('status', 'pending');
      return json({ status: 'expired', success: false, error: 'Kode pairing sudah kedaluwarsa.' });
    }

    if (pair.status === 'pending') {
      return json({ status: 'pending', success: true, expiresAt: pair.expires_at });
    }

    if (pair.status === 'expired') {
      return json({ status: 'expired', success: false, error: 'Kode pairing sudah kedaluwarsa.' });
    }

    if (pair.status === 'approved' && pair.token_plain) {
      // Klaim atomik: update hanya berhasil bila token_plain masih sama.
      // Dua polling bersamaan tidak akan sama-sama mendapat token.
      const { data: claimed, error: claimError } = await admin
        .from('integration_pairings')
        .update({ token_plain: null, consumed_at: new Date().toISOString() })
        .eq('id', id)
        .eq('secret_hash', secretHash)
        .eq('token_plain', pair.token_plain)
        .eq('status', 'approved')
        .select('id')
        .maybeSingle();

      if (claimError) {
        console.error('[pairing poll claim]', claimError.message);
        return json({ success: false, error: 'Gagal mengambil token pairing.' }, 500);
      }
      if (claimed) {
        return json({ status: 'approved', success: true, token: pair.token_plain });
      }
      return json({ status: 'consumed', success: false, error: 'Token pairing sudah diambil.' });
    }

    return json({ status: 'consumed', success: false, error: 'Token pairing sudah diambil.' });
  } catch (error) {
    console.error('[pairing poll] Error:', error);
    return json({ success: false, error: 'Terjadi kesalahan saat memeriksa pairing.' }, 500);
  }
}
