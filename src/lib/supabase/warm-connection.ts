import { createClient } from '@/lib/supabase/client';

/**
 * "Bangunkan" koneksi Supabase sebelum benar-benar dibutuhkan.
 *
 * PostgREST/Postgres bisa idle setelah beberapa menit tanpa aktivitas. Query
 * pertama setelah idle kemudian menanggung biaya bangun koneksi (sering
 * 1–3 detik) — persis saat pengguna baru selesai login dan dashboard memuat
 * data. Dengan mengirim satu query ringan saat halaman login dibuka (dan saat
 * pengguna mulai mengetik password), koneksi sudah hangat ketika dashboard
 * meminta data, sehingga skeleton tidak terasa lama.
 *
 * Query ini memakai anon key yang memang publik. RLS tetap berlaku; kita tidak
 * peduli hasilnya (boleh kosong / ditolak) — yang penting query sampai ke
 * database dan membangunkan koneksi.
 */
const WARM_TTL_MS = 60_000;

let lastWarmAt = 0;
let inflight: Promise<void> | null = null;

export function warmSupabaseConnection(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  const now = Date.now();
  if (inflight) return inflight;
  if (now - lastWarmAt < WARM_TTL_MS) return Promise.resolve();

  lastWarmAt = now;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  inflight = Promise.resolve(
    createClient()
      .from('users')
      .select('id', { head: true })
      .limit(1)
      .abortSignal(controller.signal)
  )
    .then(() => undefined)
    .catch(() => undefined)
    .finally(() => {
      clearTimeout(timeout);
      inflight = null;
    });

  return inflight;
}
