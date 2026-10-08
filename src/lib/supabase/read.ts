import { createBrowserClient } from '@supabase/ssr';

/**
 * Batas waktu satu percobaan operasi baca (ms).
 * Query normal selesai < 1s, jadi 8s sudah sangat longgar.
 */
export const READ_TIMEOUT_MS = 8000;

/**
 * Ambil SEMUA baris dari query Supabase dengan paginasi `range`.
 *
 * Supabase/PostgREST membatasi jumlah baris per request (default 1000).
 * Tanpa loop paginasi, query besar terpotong DIAM-DIAM — sehingga data
 * penilaian/ekspor bisa tidak lengkap. Helper ini memanggil `build(from, to)`
 * berulang (range inklusif, ukuran `pageSize`) sampai halaman terakhir,
 * lalu melempar error bila salah satu request gagal.
 *
 * Pemakaian:
 *   const rows = await fetchAllRows((from, to) =>
 *     supabase.from('tabel').select('*').order('id').range(from, to)
 *   );
 */
export async function fetchAllRows<T>(
  build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>,
  pageSize = 1000
): Promise<T[]> {
  const size = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 1000;
  const rows: T[] = [];
  let from = 0;

  // Guard: cegah loop tak berujung bila server mengabaikan parameter range.
  const MAX_PAGES = 100000;
  for (let page = 0; page < MAX_PAGES; page++) {
    const { data, error } = await build(from, from + size - 1);
    if (error) {
      if (error instanceof Error) throw error;
      const message = (error as { message?: unknown })?.message;
      throw new Error(
        typeof message === 'string' && message ? message : 'Gagal memuat data.'
      );
    }
    const chunk = data ?? [];
    rows.push(...chunk);
    if (chunk.length < size) return rows;
    from += size;
  }
  throw new Error('Paginasi data melebihi batas wajar — periksa filter query.');
}

/**
 * fetch yang memberi batas waktu pada request yang belum punya signal.
 *
 * Request query Supabase sudah membawa signal (via `.abortSignal()`), jadi
 * signal itu dihormati apa adanya. Request internal auth (mis. refresh token)
 * TIDAK punya signal — di sinilah timeout dipasang. Tanpa ini, refresh token
 * yang "nyangkut" setelah tab lama idle bisa menggantung selamanya dan
 * membuat seluruh request data ikut macet (hanya refresh halaman yang bisa
 * memulihkannya).
 */
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (init?.signal) return fetch(input, init);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), READ_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/**
 * Client Supabase sekali-pakai khusus operasi BACA.
 *
 * `isSingleton: false` itu WAJIB: tanpa itu, `createBrowserClient` akan
 * mengembalikan singleton yang sama (yang bisa jadi "zombie" setelah tab lama
 * idle — penyebab loading menggantung). Client baru = koneksi + state auth
 * yang segar, dan tidak ikut mewarisi refresh token yang macet.
 */
export function createReadClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be set in environment variables');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    isSingleton: false,
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: true,
      lock: <R>(_name: string, _acquireTimeout: number, fn: () => Promise<R>) => fn(),
    },
    global: { fetch: fetchWithTimeout as typeof fetch },
  });
}

// Error yang tidak ada gunanya diulang (masalah auth/izin/query).
const NON_RETRYABLE = [
  'jwt',
  'permission',
  'row-level security',
  'unauthorized',
  'forbidden',
  'pgrst',
  'does not exist',
];

function isTransient(err: unknown, signal: AbortSignal): boolean {
  if (signal.aborted) return true;
  if (err instanceof Error) {
    const name = err.name.toLowerCase();
    if (name === 'aborterror' || name === 'timeouterror') return true;
    const msg = err.message.toLowerCase();
    if (NON_RETRYABLE.some((k) => msg.includes(k))) return false;
  }
  return true;
}

function friendlyError(err: unknown): Error {
  if (err instanceof Error) {
    if (err.name === 'AbortError' || err.name === 'TimeoutError') {
      return new Error('Koneksi ke server timeout. Data gagal dimuat — silakan coba lagi.');
    }
    return err;
  }
  return new Error('Gagal memuat data.');
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Konfigurasi `retry` React Query untuk operasi baca: ulangi error transient
 * (timeout/network) hingga 2 kali. Karena queryFn membuat client baru setiap
 * percobaan, retry selalu memakai koneksi segar sehingga request yang
 * menggantung pasca-idle akan pulih otomatis.
 */
export function retryReadQuery(failureCount: number, error: Error): boolean {
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  if (NON_RETRYABLE.some((k) => msg.includes(k))) return false;
  return failureCount < 2;
}

/**
 * Menjalankan operasi async apa pun dengan batas waktu keras.
 * `Promise` yang tidak peduli signal pun akan ditolak saat timeout.
 */
export async function withTimeout<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) {
    throw signal.reason instanceof Error ? signal.reason : new DOMException('Aborted', 'AbortError');
  }
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => {
      reject(signal.reason instanceof Error ? signal.reason : new DOMException('Aborted', 'AbortError'));
    };
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener('abort', onAbort);
        resolve(value);
      },
      (err) => {
        signal.removeEventListener('abort', onAbort);
        reject(err);
      }
    );
  });
}

/**
 * Menjalankan operasi async dengan batas waktu + retry.
 * Cocok untuk operasi yang tidak menerima AbortSignal (mis. server action).
 */
export async function withTimeoutRetry<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  { attempts = 3, timeoutMs = READ_TIMEOUT_MS }: { attempts?: number; timeoutMs?: number } = {}
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await withTimeout(operation(controller.signal), controller.signal);
    } catch (err) {
      lastError = err;
      if (!isTransient(err, controller.signal)) throw friendlyError(err);
      if (attempt < attempts - 1) await sleep(300 * (attempt + 1));
    } finally {
      clearTimeout(timer);
    }
  }
  throw friendlyError(lastError);
}

/**
 * Operasi baca Supabase yang tahan terhadap koneksi zombie pasca-idle:
 * client baru tiap percobaan + batas waktu keras + retry.
 */
export function runSafeRead<T>(
  operation: (supabase: ReturnType<typeof createReadClient>, signal: AbortSignal) => Promise<T>,
  options?: { attempts?: number; timeoutMs?: number }
): Promise<T> {
  return withTimeoutRetry(async (signal) => {
    const supabase = createReadClient();
    try {
      return await operation(supabase, signal);
    } finally {
      // Client sekali-pakai: bersihkan listener agar tidak menumpuk.
      try { await supabase.auth.stopAutoRefresh(); } catch { /* ignore */ }
      try { void supabase.removeAllChannels(); } catch { /* ignore */ }
    }
  }, options);
}
