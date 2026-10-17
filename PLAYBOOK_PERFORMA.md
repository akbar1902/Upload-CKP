# Playbook Performa Web & Mobile — SIKAP

> Dokumen acuan praktis. Isinya **kumpulan pelajaran nyata** dari optimasi aplikasi
> SIKAP (Next.js 16 + React 19 + Supabase, deploy Vercel). Semua angka, skrip, dan
> contoh kode di sini sudah terbukti di produksi.
>
> Cara pakai: untuk proyek baru, langsung ke **Bab 10 — Checklist Hari Pertama**.
> Untuk proyek yang sudah jalan tapi terasa lambat, mulai dari **Bab 11 — Cara Mengukur**.

---

## Ringkasan: 5 hukum yang menentukan 90% kecepatan

1. **Jarak server ke database lebih penting daripada kode Anda.**
   Satu round-trip lintas benua = ~250 ms. Lima round-trip = 1,25 detik — walau
   datanya cuma 68 baris.
2. **Jumlah perjalanan bolak-balik (round-trip) lebih menentukan daripada jumlah data.**
   Kurangi jumlah panggilan, bukan sekadar memperbesar query.
3. **Jangan pernah mengunduh sesuatu yang belum dipakai.**
   Library berat harus diunduh saat benar-benar dipakai, bukan saat halaman dibuka.
4. **Sisi klien adalah separuh cerita.** Cache, prefetch, dan render ulang yang
   tidak perlu bisa lebih mahal daripada server.
5. **Ukur dulu, jangan menebak.** 15 menit mengukur bisa menghemat berhari-hari
   mengoptimalkan bagian yang salah.

---

## Bab 1 — Infrastruktur & Region (dampak terbesar, usaha terkecil)

### Masalah nyata di SIKAP
- Vercel Functions default = **`iad1` (Washington DC, USA)**
- Supabase project = **Singapore (`sin1`)**
- Akibatnya **setiap** panggilan server → database menyeberangi USA ↔ Singapura: ±250 ms.

Hasil pengukuran nyata (upload CKP):

| Fase server | Sebelum | Sesudah pindah region |
|---|---|---|
| auth | 296 ms | ~10 ms |
| baca data (3 query paralel) | 819 ms | ~30 ms |
| upload file ke storage | 642 ms | ~200 ms |
| tulis | 271 ms | ~20 ms |
| insert entries | 346 ms | ~30 ms |
| **total server** | **2.374 ms** | **~533 ms** |
| **total dari sisi pengguna** | **~3.575 ms** | **~811 ms** |

### Aturan
> **Fungsi server WAJIB berjalan di region yang sama (atau terdekat) dengan database.**

### Cara menerapkan (Vercel)
`vercel.json` di root:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "regions": ["sin1"]
}
```
Kode region: `sin1` Singapura, `hnd1` Tokyo, `iad1` Washington DC, `fra1` Frankfurt,
`gru1` São Paulo, `syd1` Sydney (daftar lengkap di dokumentasi region Vercel).

> Catatan: paket Hobby hanya boleh 1 region. Cukup tulis satu.

### Cara mengetahui region database
```bash
curl -sI https://<project-ref>.supabase.co/rest/v1/ | findstr cf-ray
# cf-ray: a4b436873a3093d2-SIN   <- SIN = Singapore
```

### Cara mengetahui region fungsi server (setelah deploy)
Lihat header respons `x-vercel-id`, contoh: `sin1::abc-123`. Kalau bukan region
yang diharapkan, `vercel.json`-nya belum terbaca.

### Selain Vercel
- Cloudflare Workers → `placement` / Durable Objects dekat DB
- VPS → pilih lokasi server = lokasi DB (mis. keduanya Singapura)
- Supabase → bisa juga pindah project ke region server Anda, tapi biasanya lebih
  mudah memindahkan server

---

## Bab 2 — Database

### 2.1 Audit wajib: Supabase Advisor
Di dashboard Supabase → **Advisors** (atau lewat MCP `get_advisors`). Yang perlu
dibereskan, urut dari paling berdampak:

| Lint | Arti | Perbaikan |
|---|---|---|
| **Auth RLS Initialization Plan** | Policy memanggil `auth.uid()` **per baris** | Bungkus jadi `(select auth.uid())` |
| **Unindexed foreign keys** | FK tanpa index penutup | `CREATE INDEX` per kolom FK |
| **Multiple Permissive Policies** | Banyak policy untuk role+aksi sama | Gabung, atau hapus yang benar-benar duplikat |
| **Unused Index** | Index tak terpakai | Hapus (kecuali tabel kecil/lintas musim) |
| **SECURITY DEFINER bisa dipanggil anon** | Celah keamanan | Cabut `EXECUTE` — **kecuali** dipakai di policy RLS |
| **Leaked Password Protection** | Tidak cek password bocor | Nyalakan di Auth settings |

### 2.2 RLS init-plan — contoh nyata
Sebelum (dijalankan per baris → lambat sekali saat tabel besar):
```sql
USING (user_id = auth.uid())
```
Sesudah (dijalankan sekali per query):
```sql
USING (user_id = (select auth.uid()))
```
Di SIKAP: **33 policy** diperbaiki sekaligus lewat satu blok `DO $$` yang menulis
ulang policy otomatis (lihat `supabase/migrations/033_perf_rls_initplan_and_indexes.sql`).

> ⚠️ **Jangan cabut hak `EXECUTE`** dari fungsi yang dipakai di dalam policy RLS.
> Policy dievaluasi dengan hak **pemanggil**, jadi role `anon`/`authenticated` tetap
> butuh `EXECUTE`. Kalau dicabut, RLS-nya rusak.

### 2.3 Index
- **Selalu** beri index pada kolom foreign key (untuk join dan `ON DELETE`).
- Index komposit `(user_id, rk_id)` **tidak** bisa melayani pencarian `rk_id` saja —
  butuh index terpisah.
- Index duplikat = beban tulis. Audit berkala.

### 2.4 Selalu jalankan perubahan DB sebagai migration
Simpan di `supabase/migrations/NNN_nama.sql`, **idempotent** (`IF NOT EXISTS`,
`DROP ... IF EXISTS`), dan sertakan blok **ROLLBACK** sebagai komentar.

---

## Bab 3 — Jaringan & Round-trip

### 3.1 Paralelkan yang independen
```ts
// ❌ 3 round-trip berurutan
const periode = await cekPeriode();
const master  = await ambilMaster();
const lama    = await ambilVersiLama();

// ✅ 1 round-trip (yang terlama yang menentukan)
const [periode, master, lama] = await Promise.all([
  cekPeriode(), ambilMaster(), ambilVersiLama(),
]);
```

### 3.2 Jangan bertahap kalau bisa bersamaan
Contoh nyata di SIKAP: membuat record upload baru **dan** menandai versi lama
"superseded" dulu dijalankan berurutan. Dengan **UUID yang dibuat di server**,
keduanya bisa jalan bersamaan:
```ts
const uploadId = crypto.randomUUID();
await Promise.all([
  db.from('ckp_uploads').insert({ id: uploadId, /* ... */ }),
  db.from('uploads').update({ status: 'superseded' }).eq('id', lama.id),
  db.from('entries').insert(entries.map(e => ({ upload_id: uploadId, ...e }))),
]);
```

### 3.3 Insert banyak baris: batch + paralel terbatas
```ts
const CHUNK = 200, CONCURRENCY = 6;
const chunks = [];
for (let i = 0; i < rows.length; i += CHUNK) chunks.push(rows.slice(i, i + CHUNK));

for (let i = 0; i < chunks.length; i += CONCURRENCY) {
  const hasil = await Promise.all(
    chunks.slice(i, i + CONCURRENCY).map(c => db.from('entries').insert(c))
  );
  const gagal = hasil.find(r => r.error);
  if (gagal) throw new Error(gagal.error.message);
}
```

### 3.4 Pindahkan pekerjaan non-kritis ke `after()`
```ts
import { after } from 'next/server';

// ... simpan data utama ...
revalidatePath('/pegawai');

after(async () => {
  // audit log, notifikasi, mapping — pengguna TIDAK menunggu ini
  await tulisAuditLog();
  await kirimNotifikasiKeReviewer();
});

return { success: true, uploadId };
```

### 3.5 Kalau masih lambat: gabung jadi satu RPC
Kalau ada 4-5 panggilan DB berurutan, buat **satu fungsi Postgres** yang melakukan
semuanya lalu panggil dengan `db.rpc('nama_fungsi', {...})`. Dari 5 round-trip
menjadi 1.

### 3.6 Hindari mengirim file lewat server action
File yang dikirim ke server action menempuh **dua kali** perjalanan
(browser → server → storage). Untuk file > ~1 MB, upload **langsung dari browser
ke storage** memakai signed upload URL, lalu kirim hanya path-nya ke server action.
Di SIKAP file < 500 KB sehingga tidak perlu — tapi ini penting untuk file besar.

---

## Bab 4 — Bundle JavaScript

### 4.1 Library berat WAJIB lazy
Ini temuan terbesar saat audit: **tidak ada satu pun dynamic import** di proyek SIKAP,
sehingga semua library ikut terunduh saat halaman dibuka.

| Library | Ukuran | Cara |
|---|---|---|
| `xlsx` (SheetJS) | **402 KB** | `await import('xlsx')` di dalam fungsi yang memproses Excel |
| `jspdf` + `jspdf-autotable` | **351 KB** | lazy saat mencetak PDF |
| `jszip` | 94 KB | lazy saat membuat ZIP |
| `html-to-image` | 44 KB | lazy saat tombol screenshot dipakai |
| `framer-motion` | 122 KB | **dihapus** — animasi CSS saja sudah cukup |

**Total ~1 MB JS tidak lagi terunduh di awal.**

### 4.2 Pola lazy-load yang aman
```ts
// Sebelum
import * as XLSX from 'xlsx';
export function exportExcel() { XLSX.utils.book_new(); /* ... */ }

// Sesudah
export async function exportExcel() {
  const XLSX = await import('xlsx');   // baru diunduh di sini
  XLSX.utils.book_new(); /* ... */
}
```
Pemanggilnya harus `await exportExcel()` dan berada di fungsi `async`.

### 4.3 Hati-hati interop CommonJS vs ESM
Kalau paket **tidak punya field `module`** di `package.json`, hasil
`await import('paket')` bisa menaruh isinya di `.default`. Buat helper:
```ts
export async function loadJSZip() {
  const mod = await import('jszip');
  const interop = mod as unknown as { default?: typeof mod };
  return interop.default ?? mod;
}
```
Verifikasi hasilnya benar dengan memeriksa chunk hasil build (lihat Bab 11.4).

### 4.4 Jangan pakai library animasi untuk efek sederhana
Fade, slide, dan "pop" sederhana cukup dengan CSS:
```css
@keyframes popIn {
  from { opacity: 0; transform: translateY(-10px) scale(0.96); }
  60%  { opacity: 1; transform: translateY(1px) scale(1.005); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.pop-in { animation: popIn 0.28s cubic-bezier(0.22, 1.2, 0.36, 1) both; }
```
Untuk animasi **keluar** (yang biasanya ditangani `AnimatePresence`), pakai hook kecil:
```ts
export function useDelayedUnmount(show: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(show);
  useEffect(() => {
    if (show) { setMounted(true); return; }
    const t = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(t);
  }, [show, exitMs]);
  return { mounted, leaving: mounted && !show };
}
```

### 4.5 Kurangi panggilan `<img>` mentah
- Logo SVG: tidak perlu `next/image`.
- Foto raster: pakai `next/image` (AVIF/WebP otomatis, lazy, tanpa layout shift).
- Kalau ada kolom `photo_url` di database tapi **tidak pernah dipakai di UI**,
  jangan unduh sama sekali — di SIKAP justru ini yang terjadi.

### 4.6 Aktifkan fitur compiler Next
```ts
// next.config.ts
const nextConfig: NextConfig = {
  reactCompiler: true,   // re-render otomatis dioptimalkan
  typedRoutes: true,     // salah ketik href langsung ketahuan saat build
  experimental: {
    viewTransition: true, // transisi halaman native browser
  },
};
```
`typedRoutes` di SIKAP **langsung menemukan 7 tautan bertipe salah** saat pertama
diaktifkan — inilah gunanya.

---

## Bab 5 — PWA & Service Worker

### 5.1 Jangan precache seluruh aset build
Temuan di SIKAP: service worker mengunduh **3,45 MB** aset build (chunk untuk
**semua** rute yang belum tentu dibuka) tepat saat web pertama dibuka.
Setelah dipangkas: **0,13 MB**.

```ts
// next.config.ts — next-pwa
workboxOptions: {
  manifestTransforms: [
    (entries: Array<{ url: string; revision: string | null; size: number }>) => ({
      manifest: entries.filter(e => !e.url.startsWith('/_next/static/')),
      warnings: [] as string[],
    }),
  ],
},
```
Aset tetap tercache **saat dipakai** lewat runtime caching bawaan
(`next-static-js-assets`, `static-style-assets`, `static-font-assets`), jadi
kunjungan berikutnya tetap instan. Offline berkurang, tapi untuk aplikasi yang
butuh jaringan (login + database) itu tidak masalah.

### 5.2 Jangan lewatkan panggilan API ke caching service worker
Bawaan plugin membuat **semua** request lintas-origin (database/API) lewat
`NetworkFirst` — menambah lapisan di setiap query dan berisiko menyajikan data
lama. Ganti jadi `NetworkOnly`:
```ts
extendDefaultRuntimeCaching: true,
runtimeCaching: [
  {
    urlPattern: ({ sameOrigin }: { sameOrigin: boolean }) => !sameOrigin,
    handler: 'NetworkOnly',          // nama cache "cross-origin" -> menimpa bawaan
    options: { cacheName: 'cross-origin' },
  },
],
```

### 5.3 Kecualikan file publik berat
```ts
publicExcludes: [
  '!noprecache/**/*',
  '!**/*.zip',
  '!logo.png',
  '!Logo Website SIKAP*/**',
],
```
Di SIKAP ini membuang ~2,5 MB (ZIP logo, logo 700 KB, folder PNG alternatif) yang
tidak pernah dipakai di UI.

### 5.4 Jangan jalankan middleware untuk file statis
Bug nyata: `manifest.webmanifest` selalu kena **307 redirect** ke `/login` karena
lolos ke middleware. Perbaiki matcher-nya:
```ts
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|workbox-|swe-worker-|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|webmanifest)$).*)',
  ],
};
```

### 5.5 Sediakan halaman offline & tombol install
- `app/~offline/page.tsx` → fallback yang rapi, bukan layar error browser.
- Tombol install yang hanya tampil kalau browser mendukung:
```ts
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); setDeferred(e); });
// tampilkan tombol hanya jika `deferred` ada; panggil deferred.prompt() saat diklik
```

---

## Bab 6 — Aset & Gambar

### 6.1 Favicon & ikon PWA — periksa ukurannya!
Dua temuan paling "murah" di SIKAP:

| Aset | Sebelum | Sesudah | Cara |
|---|---|---|---|
| Favicon `app/icon.png` | **191 KB** (1875×2344) | **1,2 KB** (77×96) | `sharp().resize({ width: 96, height: 96, fit: 'inside' })` |
| Ikon PWA `logo-sikap.png` | **187 KB** | **28 KB** (2 file 192 & 512, persegi) | resize + pad ke canvas persegi |

Favicon diunduh **setiap** kunjungan pertama. 191 KB untuk sebuah ikon 16px itu
pemborosan besar.

### 6.2 Mask CSS hanya butuh alpha
Kalau gambar dipakai sebagai `mask-image`, yang terbaca hanya kanal alpha. Tapi
tetap perhatikan jumlah warna saat mengompres — di SIKAP, kompresi palette hanya
menghemat 43 KB dengan risiko artefak tepi, jadi **tidak** dilakukan.

### 6.3 Bekukan ukuran gambar
Selalu beri `width`/`height` (atau bungkus dalam kontainer ber-aspect-ratio) supaya
tidak ada pergeseran tata letak (CLS).

---

## Bab 7 — Pengambilan Data di Klien

### 7.1 Jangan buang hasil render server
Anti-pattern yang ditemukan di SIKAP:
```ts
// ❌ hasil prefetchQuery di server langsung dibuang
staleTime: 0,
refetchOnMount: 'always',
```
Artinya: server sudah merender data, lalu klien **query ulang** ke database —
satu round-trip terbuang setiap kali halaman dibuka. Ganti:
```ts
staleTime: 30_000,               // biarkan data hasil render server dipakai
// biarkan refetchOnMount default (hanya kalau benar-benar basi)
```

### 7.2 Tentukan kebijakan `staleTime` sekali, di root
```ts
// QueryProvider
defaultOptions: {
  queries: {
    staleTime: 1000 * 60 * 10,      // 10 menit
    gcTime:    1000 * 60 * 60,      // 60 menit
    refetchOnWindowFocus: false,    // recovery terpusat, bukan per-fokus
    refetchOnReconnect: false,
  },
}
```
Lalu satu `RecoveryManager` yang menangani `visibilitychange` + `online` dan
menandai cache basi **tanpa** langsung refetch (agar tidak muncul skeleton).

### 7.3 Hindari flash skeleton
```ts
useQuery({
  queryKey: [...],
  placeholderData: keepPreviousData,   // tampilkan data lama saat refetch
  retry: false,
});
// skeleton HANYA kalau benar-benar belum ada data:
const isLoading = authLoading || (!data && isPending);
```

### 7.4 Cache navigasi router
```ts
// next.config.ts
experimental: {
  staleTimes: { dynamic: 600, static: 600 },  // halaman yang pernah dibuka = instan
}
```
Efek samping: data bisa basi sampai 10 menit. Karena itu setiap aksi yang mengubah
data **wajib** memanggil `revalidatePath(...)` yang tepat sasaran.

> Di SIKAP ada `revalidatePath('/', 'layout')` yang membersihkan cache SELURUH
> aplikasi. Itu **sengaja dipertahankan** karena dipakai untuk kesegaran data lintas
> peran. Kalau memakai `staleTimes` panjang, jangan hapus invalidation — ganti
> dengan daftar rute yang tepat.

---

## Bab 8 — Auth & Middleware

### 8.1 Middleware jalan di SETIAP request
Setiap `await` di middleware adalah tambahan waktu sebelum halaman apa pun muncul.

### 8.2 Cache role, jangan query terus
```ts
// Coba cache cookie dulu (5 menit) -> lalu metadata JWT (instan, tanpa jaringan)
// -> baru terakhir query DB. Di SIKAP ini memangkas middleware dari ~300 ms ke ~10 ms.
const cacheKey = `ckp-role-${user.id}`;
let role = request.cookies.get(cacheKey)?.value;
if (!role) {
  role = user.user_metadata?.role;                       // instan
  if (!role) role = (await ambilRoleDariDB(user.id));    // jaringan, terakhir
  response.cookies.set(cacheKey, role, { httpOnly: true, maxAge: 60 * 5, path: '/' });
}
```

### 8.3 Redirect sekali, bukan dua kali
`/` → redirect ke dashboard = **dua** kali middleware + render. Kalau aman,
sajikan langsung dengan `NextResponse.rewrite()` (URL tetap `/`) → satu perjalanan.

> ⚠️ Untuk halaman yang **berisi data pribadi**, hati-hati: respons bisa ter-cache
> CDN. Pastikan header `Cache-Control: private` sebelum memakai rewrite. Karena
> alasan ini, redirect `/` → dashboard di SIKAP sengaja **tidak** diubah.

### 8.4 Login: jangan menunggu query profil
```ts
const { data } = await supabase.auth.signInWithPassword({ email, password });
document.cookie = 'sikap-session=1; path=/; samesite=lax';  // WAJIB sebelum navigasi
// Langsung arahkan memakai role dari metadata sesi; profil DB menyusul di latar.
const target = roleRoutes[data.user.user_metadata?.role];
if (target) router.replace(target);
```
Verifikasi dulu bahwa metadata dan kolom role di DB **konsisten** (`SELECT role, raw_user_meta_data->>'role' FROM ...` — di SIKAP semuanya cocok).
Middleware tetap memvalidasi dan mengoreksi bila ternyata berbeda.

### 8.5 Verifikasi sesi
`auth.getUser()` = panggilan jaringan. Ini pilihan sadar demi keamanan. Kalau mau
lebih cepat, `getClaims()` memverifikasi JWT secara lokal — tapi pahami
konsekuensinya sebelum mengubah.

---

## Bab 9 — Persepsi Kecepatan (UX)

Kecepatan **yang dirasakan** sering berbeda dari kecepatan teknis.

1. **Progres harus mulai dari 0 dan naik.** Bug nyata di SIKAP: nilai progres
   di-set langsung ke 5 → 15 → 30 → 50 → 75 dalam satu batch React, sehingga frame
   pertama yang terlihat sudah **75%**. Perbaikan: set nilai awal 0, lalu beri
   browser satu frame untuk melukisnya:
   ```ts
   setUploadStep(0);
   setUploadProgress(0);
   await new Promise<void>(r =>
     requestAnimationFrame(() => requestAnimationFrame(() => r()))
   );
   // baru kerjakan tugas berat / panggil server
   ```
   Biarkan **animasi** yang menaikkan angkanya, bukan lompatan nilai.

2. **Optimistic UI dengan rollback.** Aksi yang jelas hasilnya jangan menunggu jaringan:
   ```ts
   const sebelum = queryClient.getQueryData(key);
   queryClient.setQueryData(key, (old) => old.filter(x => x.id !== id));  // langsung hilang
   try {
     const res = await aksi(id);
     if (!res.success) throw new Error(res.error);
   } catch (e) {
     if (sebelum !== undefined) queryClient.setQueryData(key, sebelum);   // kembalikan
     toast.error(e.message);
   }
   ```

3. **Skeleton yang menyerupai tata letak akhir.** Tambahkan `loading.tsx` per bagian
   agar sidebar tetap terlihat saat pindah halaman.

4. **Error boundary sejak awal.** Tanpa `error.tsx`, kegagalan render = **layar
   putih**. Sediakan: `error.tsx` (root + per bagian), `global-error.tsx`, dan
   `not-found.tsx`.

5. **Animasi singkat.** 150-300 ms sudah cukup. Jangan pernah memblokir interaksi
   demi animasi.

---

## Bab 10 — Checklist Hari Pertama (proyek baru)

### Infrastruktur
- [ ] Tentukan region database lebih dulu, lalu **set region server = region database**
- [ ] `x-vercel-id` (atau padanannya) sudah menunjukkan region yang benar
- [ ] Aktifkan proteksi password bocor (HaveIBeenPwned) di penyedia auth

### Database
- [ ] Nyalakan RLS sejak tabel pertama dibuat
- [ ] Semua policy pakai `(select auth.uid())`, bukan `auth.uid()`
- [ ] Index untuk semua kolom foreign key
- [ ] Jalankan **Advisors** dan bersihkan peringatannya
- [ ] Semua perubahan skema lewat file migration + blok ROLLBACK

### Kode
- [ ] `typedRoutes`, `reactCompiler`, `staleTimes` aktif di `next.config.ts`
- [ ] `loading.tsx` + `error.tsx` + `not-found.tsx` sejak rute pertama
- [ ] Library berat (Excel/PDF/ZIP/gambar) hanya lewat `await import()`
- [ ] Kebijakan `staleTime` ditentukan di satu tempat (provider)
- [ ] `revalidatePath` yang tepat sasaran setiap aksi yang mengubah data

### PWA & aset
- [ ] Service worker **tidak** mem-precache seluruh aset build
- [ ] Panggilan API lintas-origin lewat `NetworkOnly`
- [ ] Middleware melewati file statis (`sw.js`, manifest, robots)
- [ ] Favicon ≤ 5 KB, ikon PWA dibuat pada ukuran sebenarnya (192 & 512)
- [ ] Setiap gambar punya `width`/`height`

### Proses
- [ ] CI: `tsc --noEmit` + `next build`
- [ ] Ukur sebelum & sesudah setiap optimasi (Bab 11)
- [ ] Perubahan desain dibuat di commit terpisah agar mudah dibalik

---

## Bab 11 — Cara Mengukur (resep siap pakai)

### 11.1 Ukur fase di server — jangan menebak
Tambahkan penanda waktu sementara di server action, lalu **kembalikan ke klien**
supaya bisa dibaca tanpa membuka log server:
```ts
const t0 = Date.now();
// ... fase 1 ...
const tAuth = Date.now();
// ... fase 2 ...
const tRead = Date.now();

return {
  success: true,
  timing: { total: Date.now() - t0, auth: tAuth - t0, baca: tRead - tAuth },
};
```
Tampilkan di UI selama investigasi, **lalu hapus** setelah selesai:
```
prep 3ms · jaringan 811ms · server 533ms
```
Perhatikan: selisih `jaringan − server` = waktu yang dipakai untuk transfer
payload + cold start + respons. Kalau selisih itu besar, masalahnya **bukan** di
kode server.

### 11.2 Cari region & cache
```bash
curl -sI https://<ref>.supabase.co/rest/v1/ | findstr cf-ray     # region DB (akhiran -SIN/-IAD/...)
curl -sI https://<aplikasi>            | findstr x-vercel-id     # region fungsi
curl -sI https://<aplikasi>            | findstr x-vercel-cache  # HIT = dilayani CDN
```

### 11.3 Ukur apa yang benar-benar diunduh (browser)
DevTools → **Network** → reload. Yang dicari:
- Kolom **Size** besar pada file `.js` → kandidat lazy-load
- Banyak entri `/_next/static/chunks/app/**` → mungkin ter-precache berlebihan
- Entri API yang tampil **dua kali** (baris ganda `workbox`) → panggilan lewat service worker
- `(failed)` pada request RSC → biasanya redirect tak terduga dari middleware

### 11.4 Peta chunk: library berat ada di file mana?
Simpan sebagai `scripts/chunk-map.js` lalu `node scripts/chunk-map.js` setelah build:
```js
const fs = require('fs'), path = require('path');
const dir = '.next/static/chunks';
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p) : e.name.endsWith('.js') && files.push(p);
  }
})(dir);

const marker = {
  'xlsx': ['SheetJS'], 'jspdf': ['jsPDF'], 'jszip': ['JSZip'],
  'html-to-image': ['toPng'], 'framer-motion': ['AnimatePresence'],
};
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const hit = Object.entries(marker).filter(([, k]) => k.some(s => src.includes(s))).map(([n]) => n);
  if (hit.length) console.log(`${Math.round(fs.statSync(f).size/1024)} KB  ${f}  -> ${hit.join(', ')}`);
}
```
**Cara membaca nama chunk Next:** `nama-<hash>.js` (tanda **strip**) = chunk
sinkron/awal; `nama.<hash>.js` (tanda **titik**) = chunk **async** (lazy). Kalau
setelah di-lazy nama chunk berubah dari strip ke titik, berarti berhasil.

> ⚠️ **Waspadai positif palsu.** Penanda berbasis string bisa cocok dengan kode
> Anda sendiri. Contoh nyata di SIKAP: chunk `3722` (40 KB) terdeteksi "jspdf"
> padahal isinya modul `pdf-generator.ts` milik sendiri yang memuat baris
> `let { jsPDF } = await import('jspdf')`. Library-nya sendiri justru ada di chunk
> async terpisah. **Selalu buka 1-2 kandidat terbesar** dan periksa konteksnya
> (`Select-String`/`grep` di sekitar kemunculan) sebelum menyimpulkan.

### 11.5 Hitung ukuran precache service worker
```js
const fs = require('fs');
const sw = fs.readFileSync('public/sw.js', 'utf8');
const body = (sw.match(/precacheAndRoute\(\[(.*?)\]\)/s) || [, ''])[1];
const urls = [...body.matchAll(/url:"([^"]+)"/g)].map(m => m[1]);
let total = 0;
for (const u of urls) {
  const p = u.startsWith('/_next/') ? '.next/' + u.slice(7) : 'public' + u;
  try { total += fs.statSync(p).size; } catch {}
}
console.log(`${urls.length} entri, ${(total/1048576).toFixed(2)} MB akan diunduh saat kunjungan pertama`);
```
Target: **jauh di bawah 1 MB**. Di SIKAP: 3,58 MB → 0,13 MB.

---

## Bab 12 — Daftar Anti-pattern (hasil temuan nyata)

| # | Anti-pattern | Akibat | Perbaikan |
|---|---|---|---|
| 1 | Server & database beda benua | ±250 ms × setiap round-trip | Set region server |
| 2 | **Nol** dynamic import di seluruh proyek | Semua library berat diunduh di awal | `await import()` di dalam handler |
| 3 | `staleTime: 0` + `refetchOnMount: 'always'` | Hasil render server dibuang, 1 round-trip terbuang | `staleTime: 30s`, biarkan default |
| 4 | Service worker mem-precache semua aset build | 3,45 MB diunduh di kunjungan pertama | `manifestTransforms` menyaring `/_next/static/` |
| 5 | API lewat `NetworkFirst` service worker | Lapisan tambahan + risiko data lama | `NetworkOnly` |
| 6 | Favicon 191 KB, ikon PWA 187 KB | Unduhan sia-sia setiap kunjungan | Resize ke ukuran sebenarnya |
| 7 | Library animasi untuk fade sederhana | 122 KB JS | CSS keyframes + hook unmount |
| 8 | Middleware memproses file statis | Manifest kena 307 | Perbaiki `matcher` |
| 9 | `auth.uid()` di dalam policy RLS | Dievaluasi per baris | `(select auth.uid())` |
| 10 | FK tanpa index | Query join melambat | `CREATE INDEX` |
| 11 | Nilai progres di-set lompat (5→15→75) | Pengguna melihat 75% sejak awal | Mulai dari 0 + 1 frame untuk melukis |
| 12 | Tidak ada `error.tsx` | Error = layar putih | Error boundary berlapis |
| 13 | File besar lewat server action | Dua kali perjalanan | Upload langsung dari browser |
| 14 | Redirect berantai di middleware | 2× middleware + 2× render | `rewrite` (dengan hati-hati soal cache) |

---

## Bab 13 — Studi Kasus SIKAP (angka nyata)

Ringkasan seluruh optimasi, dari keluhan "upload terasa 4-5 detik" sampai
"buka web sangat cepat":

| # | Perubahan | Dampak |
|---|---|---|
| 1 | Region fungsi → `sin1` (sama dengan Supabase) | Upload **3,6 s → 0,8 s** |
| 2 | Precache PWA 3,58 MB → 0,13 MB | Buka pertama jauh lebih ringan |
| 3 | Favicon 191 KB → 1,2 KB | −190 KB per kunjungan |
| 4 | Ikon PWA 187 KB → 28 KB | −159 KB per kunjungan |
| 5 | `/` disajikan langsung (bukan redirect) | −1 perjalanan saat membuka web |
| 6 | Login tak menunggu query profil | Tombol "Masuk" lebih responsif |
| 7 | Dashboard tak query ulang data render server | −1 round-trip tiap buka dashboard |
| 8 | API Supabase lewat `NetworkOnly` | Query lebih stabil & tidak basi |
| 9 | Lazy-load xlsx/jspdf/jszip/html-to-image + hapus framer-motion | **−1 MB JS** di awal |
| 10 | RLS init-plan (33 policy) + 9 index FK | Query DB lebih cepat saat data membesar |
| 11 | `loading.tsx`/`error.tsx`/`not-found.tsx` | Tidak ada lagi layar kosong/putih |
| 12 | Optimistic UI + tombol Install PWA + autodesain modern | Terasa lebih hidup & modern |

Urutan pengerjaan yang terbukti paling efektif:
**region → jumlah round-trip → precache PWA → aset besar → bundle JS → DB → UX.**

---

## Bab 14 — Catatan untuk Aplikasi Mobile

Kalau nanti membuat aplikasi mobile, prinsipnya sama, hanya teknisnya berbeda:

1. **Region tetap hukum pertama.** API server harus sedekat mungkin dengan database.
   Mobile di Indonesia + server Singapura = latensi rendah.
2. **Jangan kirim payload besar.** Untuk aplikasi mobile, JSON yang dikirim ke
   server action sebaiknya dipadatkan (gzip) atau dipecah.
3. **Aset gambar paling menentukan.** Di mobile, semuanya lewat jaringan seluler:
   gunakan WebP/AVIF, ukuran sesuai tampilan, dan placeholder berukuran tetap.
4. **Optimistic UI wajib.** Notifikasi/jaringan mobile lebih sering putus; aksi
   yang langsung berubah lalu disinkronkan di latar terasa jauh lebih baik.
5. **Cache offline yang benar.** Simpan data terakhir di penyimpanan lokal, tampilkan
   lebih dulu, lalu segarkan di latar. Jangan tampilkan spinner untuk data yang
   sudah pernah diunduh.
6. **Alternatif satu basis kode:** jadikan PWA (seperti SIKAP) sehingga web dan
   mobile memakai kode yang sama, plus tombol "Pasang Aplikasi". Cocok untuk
   aplikasi internal seperti ini.
7. **Kalau memilih React Native/Expo:** pakai React Query dengan kebijakan
   `staleTime` yang sama, dan `expo-image` untuk gambar (setara `next/image`).

---

## Penutup

Kalau hanya boleh mengingat lima hal dari dokumen ini:

1. **Set region server = region database.**
2. **Kurangi jumlah round-trip, bukan cuma ukuran data.**
3. **Unduh sesuatu hanya saat dipakai (lazy-load library berat).**
4. **Jangan precache seluruh aset build di service worker.**
5. **Ukur dulu, baru optimalkan.**

Sisanya (mikro-optimasi, animasi, radius, warna) hanya menyempurnakan.
