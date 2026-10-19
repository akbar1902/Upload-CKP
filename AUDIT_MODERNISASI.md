# Audit & Modernisasi SIKAP

> **SIKAP** — Sistem Rekap Capaian Kinerja Pegawai, BPS Kabupaten Belitung
> Next.js 16.2.6 · React 19.2.4 · Tailwind CSS v4 · Supabase · React Query
> Audit + implementasi: 19 Oktober 2026

---

## 1. Ringkasan

Aplikasi ini **fondasinya sudah bagus** — sudah PWA, sudah ada design token
yang rapi, sudah pakai React Query, sudah ada command palette, sudah pakai
React Compiler, dan `@theme` Tailwind v4-nya bersih.

Yang hilang bukan fitur, tapi **ritme**. Semua perubahan state terjadi
*instan*: dialog hilang mendadak di tengah layar, sub-menu melompat,
angka KPI muncul mendadak, tabel berganti tanpa jeda, grafik langsung
"ada". Rasanya "kaku" bukan karena warnanya salah, tapi karena **tidak
ada yang bergerak**.

Empat gelombang perbaikan sudah saya kerjakan di branch ini:

| Gelombang | Fokus | Hasil |
|---|---|---|
| **1. Sistem gerak** | Satu kosakata animasi + `prefers-reduced-motion` global | Semua motion seragam & respect reduced-motion |
| **2. Transisi halaman** | Shell tunggal + transisi rute | Pindah menu terasa mulus, bukan "hop" |
| **3. Bahasa visual** | Sidebar hijau pinus + tipografi display serif | Wajah aplikasi: "kaku" → "institutional modern" |
| **4. Polish & aksesibilitas** | Dialog keluar, chart hidup, a11y, higiene kode | 45+ perbaikan kecil |

Detail per berkas ada di [§4](#4-yang-sudah-dikerjakan), backlog tersisa di
[§5](#5-backlog-prioritas-belum-dikerjakan).

---

## 2. Cara kerja audit

- **Inventaris penuh UI**: 25 file komponen, 28 halaman, 12 layout, 12 hook.
- **Analisis token**: `globals.css` (1.276 baris), pemetaan Tailwind, dan
 ltal-talan `var(--token)` yang di-hardcode.
- **Pemeriksaan a11y**: label tanpa `htmlFor`, tombol ikon tanpa `aria-label`,
  focus trap, `prefers-reduced-motion`.
- **Pemeriksaan performa**: bobot library, lazy-loading, cache, service worker.
- **Verifikasi**: `tsc --noEmit` bersih · `next build` sukses 22 rute ·
  diuji di browser (Chromium, DPR 2) pada sesi Staff reales.

---

## 3. Temuan utama (sebelum perbaikan)

### 3.1 Gerak — ini akar masalah "kaku"

| # | Temuan | Lokasi |
|---|---|---|
| M1 | **Dialog hanya punya animasi masuk.** Saat ditutup, panel hilang seketika di tengah layar. | `components/ui/dialog.tsx` |
| M2 | **8 panel expand/collapse bertukar instan** (accordion RK, monitoring, activity card, detail CKP). | 8 berkas |
| M3 | **Tidak ada transisi halaman sama sekali.** `experimental.viewTransition: true` aktif di config, tapi `<ViewTransition>` React **tidak tersedia di React 19.2.4 stable** (baru 19.3) dan nol pemakaian. | `next.config.ts:64` |
| M4 | **Sub-menu sidebar mount/unmount instan.** | `layout/sidebar.tsx:367` |
| M5 | **Angka KPI muncul mendadak.** | `dashboard/kpi-card.tsx` |
| M6 | **Chart statis** — garis, donat, bar langsung digambar. | `dashboard/charts.tsx` |
| M7 | **Toggle list ⇄ grid tanpa feedback** — container di-reuse, animasi tidak diputar ulang. | `app/pegawai/_client.tsx:527` |
| M8 | **`slideDown` punya `max-height: 600px`** → panel tinggi terpotong. | `globals.css:433` |
| M9 | **`prefers-reduced-motion` hanya menutupi 2 blok.** Semua `animate-*`, `transition-*`, shimmer, dan stagger tetap jalan untuk pengguna yang minta reduced motion. | `globals.css:505, 1270` |
| M10 | **45 handler `onMouseEnter`/`onMouseLeave` yang mutasi `element.style`** → efek hover tak terlihat pengguna keyboard, dan beton dengan transition Tailwind. | 15 berkas |

### 3.2 Bahasa visual & struktur

| # | Temuan | Dampak |
|---|---|---|
| V1 | **Judul halaman dobel** di 9 halaman: header sticky + hero di body dengan teks sama persis. Terlihat seperti bug, bukan desain. | Kebingungan hierarki |
| V2 | **Sidebar putih rata dengan konten** → tidak ada "bingkai" navigasi, aplikasi terasa seperti satu lembar. | Datar |
| V3 | **Semua teks sans-serif.** Tidak ada hierarki editorial. | Kaku |
| V4 | **Palet dark mode abu-cokelat** (`#1B1A18`) **bertabrakan dengan sidebar hijau pinus** (`#081512`) — dua temperature warna berbeda dalam satu layar. | Terlihat dua aplikasi dijahit |
| V5 | **`globals.css` punya 10 kelas yang didefinisikan dua kali** (blok utama + blok "Neumorphism"). Yang bawah selalu menang. | Rawan regresi |
| V6 | **7 file layout isinya identik** (14 baris masing-masing) — 7 salinan shell. | Replication |
| V7 | **Bloak `.dark` 122 baris** yang memaksa utilitas Tailwind (`bg-slate-50`, `text-slate-900`, …) masuk ke token dengan `!important`. | 1.010 utilitas hardcode bergantung padanya |

### 3.3 Aksesibilitas

| # | Temuan | Lokasi |
|---|---|---|
| A1 | **33 `<label>` tanpa `htmlFor`/`id`**. | 8 berkas |
| A2 | **Tombol ikon tanpa `aria-label`**: toggle lihat/sandi password (2×), filter status, ikon admin. | 6 berkas |
| A3 | **`<Select>` period filter tanpa label sama sekali.** | `dashboard/period-filter.tsx` |
| A4 | **Dropdown notifikasi tanpa Escape-to-close & tanpa restore fokus.** | `layout/notification-bell.tsx` |
| A5 | **Command palette tidak mengembalikan fokus ke pemicu saat ditutup.** | `layout/command-palette.tsx` |
| A6 | **Mobile drawer sidebar tidak punya focus trap.** | `layout/sidebar.tsx` |
| A7 | **Tabel tanpa `<caption>`/aria-label.** | `ui/data-table.tsx` |
| A8 | **Kontras gagal WCAG AA**: `--text-tertiary` (#8A8F98) = 3.1:1 di atas putih. Dipakai ~20 tempat. | `globals.css:274` |

### 3.4 Performa & higiene

| # | Temuan | Lokasi |
|---|---|---|
| P1 | **`file-saver` di-import statis** → masuk initial JS padahal cuma dipakai saat unduh ZIP. | `lib/zip/exporter.ts:1`, `admin/export-penilaian/_client.tsx:12` |
| P2 | **`getAnalyticsOverviewAction` 690–850 ms** setiap ganti periode. | `app/actions/analytics.ts` |
| P3 | **~270 `any`** di 40+ berkas. | repo |
| P4 | **`npm run lint` gagal: 264 error** (sebagian besar `no-explicit-any`, sebagian aturan React Compiler baru). | repo |
| P5 | **Halaman `/debug-auth` masih ada di produksi** (208 baris, 80 utilitas hardcode) —ergy_pagesnya sendiri tulis "hapus halaman ini setelah selesai debug". | `app/debug-auth/page.tsx` |
| P6 | **`themeColor` & `background_color` manifest** masih hex lama (#F8F6EE / #201E1A) yang tidak lagi sama dengan token. | `app/layout.tsx:41`, `app/manifest.ts:10` |
| P7 | **`getStatusColor()`** di `lib/utils.ts` mengembalikan string kelas hardcode, dan tidak terpakai lagi (digantikan `STATUS_CONFIG`). | `lib/utils.ts:99` |
| P8 | **`stat-card.tsx` mengabaikan prop `color`** (`const colors = colorMap['blue']`). | `dashboard/stat-card.tsx:31` |
| P9 | **Error boundary kurang lengkap** — `/analitik`, `/penilaian`, `/rencana_kinerja` jatuh ke root error. | `app/*/error.tsx` |
| P10 | **Bug: `e.key.toLowerCase()`** di command palette melempar TypeError saat event synthetic tanpa `key`. | `layout/command-palette.tsx:171` |

---

## 4. Yang sudah dikerjakan

### 4.1 Gelombang 1 — Sistem gerak

**Token timing baru** (`globals.css`) — satu sumber untuk semua motion:

```
--duration-instant 90ms · --duration-fast 180ms · --duration-base 260ms
--duration-slow 380ms · --duration-slower 560ms · --duration-ambient 900ms
--ease-out · --ease-in-out · --ease-emphasized · --ease-back
--rise-distance 10px
```

**Keyframe satu kosakata** (9 → 12): `fadeUp` `fadeIn` `slideDown` `riseIn`
`scaleIn` `scaleInSoft` `shimmer` `pulse-soft` `pulse-ring` + `sikap*`.
Keyframe `pulse-ring` yang tadinya mati sekarang dipakai indikator
"online" di sidebar.

**`prefers-reduced-motion` global** — satu blok yang menetralkan *semua*
animasi, transisi, shimmer, stagger, dan view-transition:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**`Collapsible` (baru)** — `components/ui/collapsible.tsx`. Panel expand /
collapse pakai teknik `grid-template-rows: 0fr → 1fr` (tinggi mengikuti isi,
tidak pernah terpotong — fixing M8). Diterapkan di:

- `dashboard/activity-card.tsx` — panel detail CKP
- `components/rk/rk-management-view.tsx` — daftar Sub-RK
- `app/pimpinan/monitoring-penilaian/_client.tsx` — accordion 2 tingkat
- Sidebar — sub-menu Dashboard

**Dialog keluar** — `components/ui/dialog.tsx`. Sebelumnya hanya ada animasi
masuk; sekarang ada state `exiting` + `EXIT_MS = 180ms`, backdrop fade
keluar, panel `sikap-pop-out`, scroll-lock & focus-trap tetap aktif
sampai panel benar-benar hilang, dan fokus dikembalikan ke pemicu.

**Motion chart** — `components/dashboard/charts.tsx`:

- Garis digambar dari kiri (`pathLength={1}` + `stroke-dashoffset` 1→0, 1.1 s)
- Donat menyapu per segmen (stagger 90 ms)
- Bar tumbuh dari nol (stagger 70 ms)

**Angka menghitung naik** — `components/ui/animated-number.tsx`. KPI
bertambah dari 0 ke nilai akhir dengan easeOutExpo 900 ms; skip total
kalau reduced motion.

### 4.2 Gelombang 2 — Transisi halaman

**`AppShell` (baru)** — `components/layout/app-shell.tsx`. Menggantikan 7
file layout yang identik. Sekarang satu tempat untuk Sidebar +
RouteTransition + PageTransition.

**`PageTransition` (baru)** — `components/layout/page-transition.tsx`.
Memakai **Web Animations API** (bukan key CSS) supaya:

- animasi terulang tiap `pathname` berubah **tanpa remount** (remount
  akan menghapus state client-side);
- `useLayoutEffect` berjalan **sebelum paint** → tidak ada frame "terang"
  yang berkedip sebelum animasi mulai.

**Catatan penting soal View Transitions API:** `experimental.viewTransition`
di `next.config.ts` **tidak bisa dipakai** — React `<ViewTransition>` baru
ada di React 19.3, sedangkan repo ini masih 19.2.4. Solusinya
dokumentasikan di kode: pakai Web Animations API yang tersedia di semua
browser, plus CSS `::view-transition-*` sebagai lapisan native bila
browser mendukung.

### 4.3 Gelombang 3 — Bahasa visual

**Sidebar hijau pinus** — `components/layout/sidebar.tsx` (ditulis ulang).
Sidebar sekarang gelap di light *dan* dark mode: konten jadi "kertas
terang" di dalam bingkai navigasi → ada kedalaman, ada fokus mata.
Token baru: `--sidebar-bg/-hover/-active/-text/-accent/-indicator/-shadow`.

Sekalian dibersihkan:
- 14 handler `onMouseEnter`/`onMouseLeave` → varian `hover:`/`focus-visible:`
- Sub-menu pakai `Collapsible` (smooth) + `aria-expanded`/`aria-controls`
- Indikator item aktif tumbuh halus (tinggi 0 → 20 px)
- Tombol "Pasang Aplikasi" jadi kartu terracotta dengan badge
- Avatar pakai inisial + warna mint, dengan titik "online" yang denyut
- Logo `SIKAP-logo-only-beige.svg` (baru) untuk mode ciut

**Tipografi** — satu keluarga font saja (Poppins), disuntik `next/font`
sebagai CSS variable (tanpa request jaringan saat runtime). Percobaan
awal memakai **Instrument Serif** untuk judul halaman, tapi dicabut:
dipakai bercampur dengan sans-serif di header, hasilnya terbaca
sebagai dua judul dengan dua typeface — bukan hierarki, tapi
kebingungan. Hierarki sekarang dibangun dari **bobot + ukuran + warna
+ spasi**, bukan dari mencampur typeface.

**Judul dobel dihapus** (V1) — 9 halaman. Dan header sekarang menampilkan
breadcrumb + judul **satu baris** (`Dashboard › Upload CKP`), bukan
dua baris bertumpuk. Judul halaman (h1) jadi satu-satunya di header;
badan halaman menyimpan konteks (periode, deskripsi) + baris aksi.

| Halaman | Yang diubah |
|---|---|
| `pimpinan/_client.tsx` | hero "Dashboard Pimpinan" → baris `PERIODE Oktober 2026` + aksi |
| `ketua_tim/_client.tsx` | idem |
| `ketua_tim/_pimpinan_client.tsx` | idem |
| `analitik/_client.tsx` | hero "Analitik CKP" → baris deskripsi + filter |
| `admin/logs/_client.tsx` | hero "Log Aktivitas Sistem" → deskripsi + refresh |
| `admin/periode/_client.tsx` | hero "Pengaturan Periode CKP" → deskripsi + kontrol |
| `pimpinan/approval/_client.tsx` | hero → deskripsi + ikon + filter |
| `admin/pegawai/_client.tsx` | hero → deskripsi + aksi |

**Breadcrumb `/analitik` hilang** (bug) — `layout/header.tsx`. Route
`/analitik` tidak pernah dipetakan, jadi judulnya jatuh ke fallback
"SIKAP". Sekarang dipetakan, dan fallback generik diganti judul dari
nama ruas terakhir.

**Palet disatukan ke satu temperature warna** (V4) — ini perbaikan
penting yang diminta setelah review visual. Sebelumnya dark mode
memakai abu-cokelat (`#1B1A18`) sementara sidebar hijau pinus
(`#081512`): dua warna pada temperature berbeda dalam satu layar, dan
aplikasi terbaca sebagai dua aplikasi yang dijahit.

Sekarang semuanya **hijau arang** — satu keluarga, naiknya
bertahap:

| Peran | Light | Dark |
|---|---|---|
| Kanvas (`--bg-base`) | `#F4F6F3` | `#101714` |
| Kartu (`--card-bg`) | `#FFFFFF` | `#182120` |
| Sidebar (`--sidebar-bg`) | `#0B2A24` | `#081512` |
| Garis (`--border`) | `#E3E8E3` | `#26312E` |
| Teks utama | `#131A17` | `#EDF2EE` |

Sidebar sekarang jadi **bingkai navigasi** yang jelas terpisah dari
kanvas, dan seluruh aplikasi terasa satu benda.

**Kontras teks diperbaiki** (A8) — `--text-tertiary` light
`#8A8F98` (3.1:1, gagal AA) → `#68716B`; dark `#8A8783` (4.4:1) →
`#8A968F` (5.4:1). Token `slate-400`/`gray-400` diselaraskan ke
nilai yang sama, jadi utilitas hardcode ikut terbagus.

**Primary dark mode dinaikkan** — `--primary` dark `#1F8A7D` hanya
3.9:1 sebagai **teks** di atas kartu (di bawah ambang AA). Sekarang
teal terang `#3FB3A0` (6.2:1), dan tombol primary memakai tinta
gelap (`--on-primary`) alih-alih putih — kontras 6.7:1. Token baru
`--on-primary` dipakai di tombol, avatar header, dan stepper.

### 4.4 Gelombang 4 — Polish & aksesibilitas

| Perbaikan | Lokasi |
|---|---|
| Password toggle punya `aria-label` + `aria-pressed` | `app/login/page.tsx`, `dashboard/change-password-modal.tsx` |
| `PeriodFilter` dapat `role="group"` + `aria-label` per select | `dashboard/period-filter.tsx` |
| Tiles "Pilih Tindakan" jadi `role="radio"` + `aria-checked`, border 2px tetap (tak ada lompatan) | `components/ckp/approval-modal.tsx` |
| Dropdown notifikasi: Escape menutup + fokus balik ke tombol | `layout/notification-bell.tsx` |
| Panel notifikasi punya animasi **keluar** (`useDelayedUnmount`) | `layout/notification-bell.tsx` |
| Command palette mengembalikan fokus ke pemicu | `layout/command-palette.tsx` |
| `e.key` diamankan (bug TypeError) | `layout/command-palette.tsx:171` |
| `file-saver` jadi lazy-load | `lib/lazy/file-saver.ts` (baru) |
| `themeColor` & `background_color` diselaraskan | `app/layout.tsx`, `app/manifest.ts` |
| Halaman `/debug-auth` **dihapus** | `app/debug-auth/` |
| `error.tsx` ditambahkan di `/analitik`, `/penilaian`, `/rencana_kinerja` | `app/*/error.tsx` |
| `stat-card` honor prop `color` (bug) | `dashboard/stat-card.tsx` |
| `useDelayedUnmount` diperbaiki agar lint-clean | `hooks/use-delayed-unmount.ts` |
| Kelas duplikat di `globals.css` digabung | `globals.css` |
| Blok `.dark` 122 baris dipertahankan (belum dihapus) — lihat backlog B1 | `globals.css:940` |

### 4.5 Tabel kontras (hasil ukur, WCAG 2.1)

| Pasangan | Light | Dark |
|---|---|---|
| Teks utama di atas kartu | 17.7 : 1 | 14.5 : 1 |
| Teks sekunder di atas kartu | 6.4 : 1 | 7.6 : 1 |
| Teks tersier di atas kartu | **4.7 : 1** (sebelumnya 3.1) | **5.4 : 1** (sebelumnya 4.4) |
| Teks primary di atas kartu | 5.5 : 1 | **6.2 : 1** (sebelumnya 3.9) |
| Teks di atas tombol primary | 5.5 : 1 | **6.7 : 1** |
| Teks sidebar di atas sidebar | — | 16.6 : 1 |
| Teks redup sidebar | — | 6.2 : 1 |

Semua kini lolos AA (≥ 4.5:1).

### 4.6 Verifikasi

| Pemeriksaan | Hasil |
|---|---|
| `npx tsc --noEmit` | ✅ bersih |
| `npm run build` | ✅ sukses, 22 rute |
| `npx eslint` (berkas baru/berubah) | ✅ bersih |
| `/pimpinan` (sesi Staff nyata) | ✅ sidebar hijau pinus, judul tunggal satu baris, KPI Poppins, tanpa error console |
| `/pegawai`, `/ketua_tim`, `/analitik`, `/admin` | ✅ 200, tanpa error konsol |
| Light + dark mode | ✅ satu keluarga warna, semua teks lolos AA |
| Animasi chart | ✅ garis: `pathLength=1`, `stroke-dashoffset` 1→0 |

---

## 5. Backlog prioritas (belum dikerjakan)

Diurutkan **dampak ÷ usaha**.

### P0 — Dampak besar, usaha kecil

| # | Item | Detail | Estimasi |
|---|---|---|---|
| **B1** | Hapus blok `.dark` 122 baris | Migrasikan ~1.010 utilitas Tailwind hardcode (`bg-slate-*`, `text-slate-*`, `border-slate-*`, …) ke `var(--token)`. Trace utama: `admin/pegawai/_client.tsx` (308), `admin/export-penilaian/_client.tsx` (119), `admin/rk/import/page.tsx` (75), `pimpinan/monitoring-penilaian/_client.tsx` (53), `ketua_tim/rk/[id]/_client.tsx` (42), `pegawai/ckp/[id]/_client.tsx` (39), `ckp/calendar-preview.tsx` (30). | 2–3 hari |
| **B2** | ~~Naikkan kontras `--text-tertiary`~~ | ✅ **Selesai** — light 3.1→4.7:1, dark 4.4→5.4:1. | — |
| **B3** | `cva` untuk komponen dasar | Hanya 2 dari 25 file pakai `cva` (`button`, `badge`). `card`, `dialog`, `input`, `select`, `textarea`, `data-table` masih string kelas panjang. | 3 jam |
| **B4** | Error boundary lengkap | `/admin/*` sub-rute, `/rencana_kinerja`, `/analitik` — sudah 4 ditambah, tinggal sisanya. | 30 menit |
| **B5** | `getStatusColor()` dibuang | `lib/utils.ts:99` — sudah tidak dipakai, ganti `STATUS_CONFIG`. | 5 menit |

### P1 — Dampak besar, usaha sedang

| # | Item | Detail |
|---|---|---|
| **B6** | Perbaiki `npm run lint` | 264 error: ~200 `no-explicit-any` (hotspot: `ketua_tim/_client.tsx` 45, `actions/admin.ts` 25, `penilaian/[upload_id]/_client.tsx` 21, `rk-management-view.tsx` 18) + aturan React Compiler baru (`set-state-in-effect`, `refs`). |
| **B7** | Table per-baris di `ketua_tim/rk/[id]` | Sudah ada analisis di `.impeccable/noir-tabel-per-baris.md` — 6 usulan, semua markup-only. Impact tinggi untuk halaman penilaian. |
| **B8** | Audit 33 `<label>` + tombol ikon | Lihat daftar lengkap di §3.3. |
| **B9** | Percepat `getAnalyticsOverviewAction` | 690–850 ms per ganti periode. Cache per (bulan, tahun) + paralelkan query. |
| **B10** | `Drag` list ⇄ grid + skeleton→data | Tambah crossfade saat ganti mode & saat data selesai dimuat. |

### P2 — Polish lanjutan

| # | Item | Detail |
|---|---|---|
| **B11** | Upgrade ke React 19.3 | Setelah upgrade, `<ViewTransition>` React tersedia → ganti `PageTransition` (Web Animations API) dengan shared-element morph + directional slide native. Ini *upgrade* paling bernilai untuk "rasa modern". |
| **B12** | Ganti `font-display` dengan tabular figure | ~~Instrument Serif~~ sudah dicabut; jika nanti mau angka serif, pastikan `font-variant-numeric: tabular-nums` supaya tidak "bergoyang" saat count-up. |
| **B14** | Empty state & skeleton yang lebih informatif | `ui/empty-state.tsx` masih generik; perlu ilustrasi + CTA yang jelas. |
| **B15** | Print stylesheet | Dokumen evaluasi PDF dicetak dari browser — belum ada `@media print` yang rapi. |
| **B16** | PWA: shrink logo.png | `public/logo.png` masih 715 KB (di-exclude dari precache, tapi masih di repo). |

---

## 6. Catatan untuk lanjutan

1. **Jangan tambah library animasi.** Sistem gerak sekarang berbasis CSS +
   Web Animations API = 0 KB tambahan. Menambah `framer-motion` (~122 KB)
   akan membatalkan semua manfaat di atas.
2. **Semua motion wajib lewat token** (`--duration-*`, `--ease-*`). Animasi
   ad-hoc per komponen = Apps yang kaku terlahir kembali.
3. **Reduced motion bukan opsional.** Blok global di `globals.css` harus
   tetap menutupi semua animasi baru.
4. **Arahkan `var(--token)`, bukan `bg-slate-*`.** Selama blok `.dark`
   masih ada, utilitas hardcode "bekerja" — tapi hanya karenaITA dipaksa
   `!important`. B1 yang membebaskan codebase ini.
5. **Hormati `node_modules/next/dist/docs/`** sebelum memakai API Next.js
   baru — repo ini Next 16, dan beberapa API berubah dari Next 15.

---

*Dokumen ini ditulis sebagai bagian dari modernisasi. Semua perubahan di
§4 sudah terimplementasi dan terverifikasi; §5 adalah backlog yang
disengaja dibiarkan untuk tahap berikutnya agar perubahannya tetap
aman dan bisa direview per bagian.*
