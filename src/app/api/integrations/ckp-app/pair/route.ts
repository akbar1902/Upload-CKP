import { createAdminClient } from '@/lib/supabase/server';
import {
  generatePairingCode,
  generatePairingSecret,
  hashPairingSecret,
} from '@/lib/integration/pairing.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(key, list);
    return true;
  }
  list.push(now);
  hits.set(key, list);
  return false;
}

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim()
    || request.headers.get('x-real-ip')
    || 'lokal';
  if (rateLimited(ip)) {
    return json({ success: false, error: 'Terlalu banyak percobaan. Tunggu satu menit.' }, 429);
  }

  try {
    const admin = createAdminClient();
    const asal = new URL(request.url);
    const proto = request.headers.get('x-forwarded-proto') || asal.protocol.replace(':', '');
    const host = request.headers.get('x-forwarded-host') || asal.host;
    const origin = `${proto}://${host}`;
    const secret = generatePairingSecret();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Bersihkan pairing lama agar tabel tidak menumpuk.
    await admin
      .from('integration_pairings')
      .delete()
      .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    let inserted: { id: string; code: string } | null = null;
    let lastError = '';
    for (let attempt = 0; attempt < 5 && !inserted; attempt += 1) {
      const code = generatePairingCode();
      const { data, error } = await admin
        .from('integration_pairings')
        .insert({
          code,
          secret_hash: hashPairingSecret(secret),
          status: 'pending',
          expires_at: expiresAt,
        })
        .select('id, code')
        .single();
      if (!error && data) {
        inserted = data;
      } else {
        lastError = error?.message || 'Gagal membuat kode pairing.';
        // 23505 = unique violation → coba kode lain.
        if (error && error.code !== '23505') break;
      }
    }

    if (!inserted) {
      console.error('[pairing start]', lastError);
      return json({ success: false, error: 'Gagal membuat kode pairing. Coba lagi.' }, 500);
    }

    return json({
      success: true,
      pairingId: inserted.id,
      code: inserted.code,
      secret,
      pairUrl: `${origin}/pegawai/integrasi/pair/${inserted.code}`,
      expiresAt,
    });
  } catch (error) {
    console.error('[pairing start] Error:', error);
    return json({ success: false, error: 'Terjadi kesalahan saat memulai pairing.' }, 500);
  }
}
