# MOTION-TECH — Kajian Kelayakan Teknis & Rencana Eksekusi Motion App-Wide

**Repo:** SIKAP (Sistem Rekap Capaian Kinerja Pegawai — BPS Kabupaten Belitung)
**Branch:** `feat/motion-ux` · **Tanggal:** 14 Oktober 2026 · **Sifat:** READ-ONLY atas kode aplikasi (tidak ada perubahan kode dalam fase ini)

> Dokumen ini adalah lajur **teknis** (kelayakan + rencana eksekusi). Nilai visual/token baru
> didefinisikan di `design/MOTION-AUDIT.md` / `design/MOTION-SPEC.md` (lajur Noir).
> **Kontrak antar-lajur:** token gerak yang sudah ada — `--ease-apple`, `--ease-spring`,
> `--duration` (300ms), `--duration-fast` (180ms), `--overlay-scrim` — **dipertahankan** dan
> boleh di-*extend*, bukan diganti nama. `framer-motion@12.42.2` adalah library utama;
> tidak menambah dependency animasi baru.

---

## 0. Ringkasan Eksekutif

1. **Klaim "framer-motion hanya dipakai di 2 file" — TERVERIFIKASI.** Hanya
   `src/components/layout/route-transition.tsx:5` dan `src/components/dashboard/filter-loading.tsx:4`.
   Sisanya CSS murni (`globals.css`, 1231 baris).
2. **Temuan besar (Next 16.2.6 terpasang):** fitur **View Transitions sudah tersedia di runtime aplikasi ini**
   — flag `experimental.viewTransition` ada di config schema, komponen `<ViewTransition>` React
   **sudah diekspor oleh React yang benar-benar di-bundle** (React vendored Next = `19.3.0-canary-3f0b9e61-20260317`),
   dan plumbing navigasi (`React.addTransitionType`) sudah terpasang di client runtime.
   Lihat §1.9 untuk bukti lengkap. Artinya opsi "transisi halaman native" **nyata dan bisa dipakai**,
   bukan spekulasi.
3. **Tech-debt utama = overlay `RouteTransition`**: intercept klik global di `document` (capture),
   tanpa delay-threshold (flash pada navigasi cepat — padahal `staleTimes: 600` justru membuat
   navigasi makin instan, `next.config.ts:22-25`), scrim `backdrop-filter: blur(2px)` full-viewport,
   8 detik safety timeout, dan duplikasi pola dengan `FetchingOverlay`. Komponen ini **layak dirombak**;
   pengganti modern tersedia (`useLinkStatus`, `<ViewTransition>`, `onNavigate`).
4. **Reduced motion baru ditangani sebagian**: hanya satu blok di `globals.css:1224-1231`
   (mematikan `transform` hover pada 3 kelas kartu); **0 pemakaian** `useReducedMotion`/`motion-reduce`
   di seluruh `src`. Animasi masuk (`fadeUp`, `stagger`, `card-list`) dan spinner **tetap jalan**
   saat `prefers-reduced-motion: reduce`.
5. **Rekomendasi pendekatan: HYBRID** — (i) navigasi antar halaman → View Transitions bawaan Next 16
   (0 KB tambahan, native) dengan fallback CSS; (ii) komponen ber-mount/unmount (modal, panel, bell,
   palette) → framer-motion `AnimatePresence` + spring; (iii) mikro-interaksi (hover/press/focus) →
   perluasan sistem CSS token yang sudah ada. Alasan lengkap di §2.4.
6. **Estimasi scope:** inti 20–25 file (5 layout shell, 13 UI primitives, 7 layout rute, `globals.css`,
   `next.config.ts`, 1 util baru) + 10–15 halaman yang perlu disentuh bertahap = **±35–45 file**
   dari 91 `.tsx` (47 client components).

---

## 1. Inventaris Teknis Motion Saat Ini

### 1.1 framer-motion — verifikasi klaim & posisi pemakaian

`grep -rn "framer-motion" src/` → **tepat 2 file**:

| File | Anchor | Isi | Dipasang di |
| --- | --- | --- | --- |
| `src/components/layout/route-transition.tsx` | import `:5`; komponen `:46-151` | Overlay navigasi (scrim + pill "Memuat …") | **7 layout route-group** (`admin:3,9`, `analitik:3,9`, `ketua_tim:3,9`, `pegawai:3,9`, `penilaian:3,9`, `pimpinan:3,9`, `rencana_kinerja:3,9`) |
| `src/components/dashboard/filter-loading.tsx` | import `:4`; `FetchingBar` `:15-39`; `FetchingOverlay` `:48-88` | Indikator refetch filter periode | 9 titik pakai: `admin/export-penilaian/_client.tsx:337-338`, `analitik/_client.tsx:170`, `ketua_tim/_client.tsx:574,610`, `ketua_tim/_pimpinan_client.tsx:336,389`, `pimpinan/approval/_client.tsx:286,342`, `pimpinan/monitoring-penilaian/_client.tsx:188-189`, `pimpinan/_client.tsx:348,427` |

Konsekuensi teknis: `route-transition.tsx` di-import oleh **semua 7 layout route-group**, jadi
framer-motion sudah ikut ter-bundle di hampir setiap rute. **Menambah pemakaian framer-motion di
shell/komponen tidak menambah chunk baru secara signifikan** (shared chunk); risiko ukuran muncul
baru jika memakai fitur berat (`layout` projection, `drag`, `useScroll` pola kompleks).

Catatan dependency: `@tanstack/react-table@8.21.3` **terpasang tapi tidak terpakai** (grep 0 hasil) —
kandidat pembersihan (bukan bagian fase motion, keputusan user).

### 1.2 `RouteTransition` — anatomi & penilaian tech-debt

Cara kerja (anchor):
- Peta label rute hardcoded `ROUTE_LABELS :9-30` + `labelFor()` prefix-terpanjang `:32-39`.
- State `pending` `:48`; ditutup saat `pathname` berubah `:52-58`; watchdog 8 detik `:97`.
- **Intercept klik global**: `document.addEventListener('click', onClick, true)` `:100` — memeriksa
  `closest('a')`, memfilter href eksternal/anchor/download/target `:65-79`, bandingkan
  `dest === pathname` `:87` (perubahan query saja **tidak** memicu overlay), ambil label dari
  `data-nav-label` → map → teks link `:89-93`.
- Overlay: `AnimatePresence` `:112-113`; scrim `background: var(--overlay-scrim)` +
  `backdropFilter: blur(2px)` `:121-125`; pill spring `stiffness 380, damping 30` `:134`;
  `pointer-events-none` `:120`; `role="status" aria-live="polite" aria-busy` `:126-128`.

**Tech-debt (7 butir):**

1. **Intercept global tidak menangkap semua navigasi.** 16 lokasi `router.push()/replace()` di `src`
   (mis. setelah login `src/app/login/page.tsx`, submit form, tombol aksi) **tidak** memicu overlay —
   feedback tidak konsisten antar-jalur navigasi.
2. **Tidak ada delay-threshold → "flash of loading".** Dengan `staleTimes: 600` (`next.config.ts:22-25`)
   dan prefetch, navigasi sering selesai < 200ms; overlay tetap muncul sekejap (in+out 180ms/0.18s).
   Pola yang benar: tampilkan indikator hanya bila navigasi > ~150ms.
3. **Blur full-viewport.** `backdrop-filter: blur(2px)` menutupi seluruh viewport — biaya paint nyata
   di perangkat low-end; bertentangan dengan target "terasa instan".
4. **Watchdog 8s salah arah.** Overlay hilang sendiri pukul 8s walau navigasi masih berjalan, dan
   tidak ada mekanisme retry/cancel aktual (hanya UI).
5. **Duplikasi.** Pola scrim+pill+spinner di `route-transition.tsx:111-150` **identik** dengan
   `FetchingOverlay` `filter-loading.tsx:48-88` (dua implementasi paralel yang harus dijaga sinkron).
6. **Mounted 7× (satu per route-group layout).** Saat lintas-group (mis. `/admin` → `/pimpinan`),
   dua layout bisa sempat ter-mount bersamaan → dua instance overlay (listener ganda, tumpukan pill).
7. **Nilai gerak di-inline, bukan token.** `transition={{ duration: 0.18 }}` `:119` dan bezier
   `cubic-bezier(0.25,0.1,0.25,1)` di `dialog.tsx:147,154` & `command-palette.tsx:478,486` —
   duplikasi angka token `--ease-apple`/`--duration-fast` yang harusnya satu sumber.

**Bisa digantikan pendekatan modern? YA.** Dua jalur pengganti (bukan kerja sama user):
- **`useLinkStatus`** (`next/link`, resmi sejak v15.3; dokumen lokal
  `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-link-status.md`;
  type export `next/dist/client/app-dir/link.d.ts:200`) — pending state **per-link** yang benar
  (berbasis navigasi React sebenarnya, bukan heuristik klik), plus pola "hint muncul setelah 100ms" dari docs.
- **`<ViewTransition>`** + CSS `::view-transition-*` (jalur §1.9/§2.3) untuk transisi halaman natif.
- Properti `onNavigate` pada `<Link>` (`link.d.ts:160`) juga tersedia bila ingin tetap overlay global
  tapi tanpa listener `document`.

### 1.3 `filter-loading.tsx` (FetchingBar/FetchingOverlay)

- `FetchingBar :15-39` — bar 3px indeterminate; animasi digerakkan framer `animate={{ x: ['-120%','360%'] }}`
  `:32` `duration 1.05 repeat Infinity` `:33`. Rasional tertulis di komentar `:7-14` (refetch React Query
  tanpa navigasi → TopLoader tidak jalan). **Reusable**, tapi bisa disederhanakan jadi CSS keyframe
  (menghindari JS animation loop) tanpa mengubah tampilan.
- `FetchingOverlay :48-88` — pola yang sama dengan route-transition; **stay** (ini untuk fetch data
  dalam halaman, bukan navigasi) tetapi sebaiknya di-refactor memakai satu primitive bersama.

### 1.4 Feedback navigasi & loading lainnya

- **`nextjs-toploader@3.9.17`** — `src/app/layout.tsx:59-69` (2px teal `#0F766E`, `showSpinner=false`).
  Tetap kompatibel; keputusan "Tetap bersama View Transitions?" ada di §5.
- **Sonner 2.0.7** — `src/app/layout.tsx:79-93` (`position top-right`, `closeButton`, style token).
  Styling token di `globals.css:1019-1047`; Sonner punya animasi enter/exit sendiri dan sudah
  menghormati `prefers-reduced-motion` (ada di `node_modules/sonner/dist/styles.css`).
  **121 pemanggilan `toast.*` di 21 file** — tidak perlu diapa-apakan kecuali penyelarasan visual.
- **Loading states halaman:** **0 `loading.tsx`**, 0 `template.tsx`, 26 `page.tsx`, 18 pemakaian
  `<Suspense>`. Tidak ada fallback route-level App Router — inilah alasan historis overlay dibuat.
  Ini juga celah yang bisa dieksploitasi implementasi berikutnya (prefetch + fallback per rute).
- **`staleTimes: { dynamic: 600, static: 600 }`** `next.config.ts:22-25` — navigasi yang pernah
  dimuat = instan dari cache client. Semua desain indikator harus mengasumsikan **navigasi umumnya cepat**.
- PWA `@ducanh2912/next-pwa` 10.2.9 — `next.config.ts:4-11` (`disable` di dev `:6`,
  `cacheOnFrontEndNav: true`, `aggressiveFrontEndNavCaching: true`, `reloadOnOnline: true`),
  artefak `public/sw.js`.

### 1.5 Sistem CSS (globals.css) — mana reusable, mana dirombak

**Reusable (pertahankan, jadikan fondasi):**
- Token timing `:297-301` — `--ease-apple` `:298`, `--ease-spring` `:299`, `--duration` 300ms `:300`,
  `--duration-fast` 180ms `:301`.
- Token scrim `--overlay-scrim` `:219` (light) & `:322` (dark).
- Keyframes `:413-442` — `fadeUp :414`, `fadeIn :419`, `slideDown :424` (⚠️ memakai `max-height`
  `:425-426` — properti layout, layak diganti skala/opacity), `scaleIn :429`, `shimmer :434`, `pulse-ring :439`.
- Kelas utilitas `:444-471` — `.animate-fade-up :444`, `.animate-fade-in :448`, `.animate-scale-in :452`,
  `.stagger :457-462` (hanya 6 anak), `.card-list :465-471` (n+7 fallback).
- Pola hover/press CSS: `.kpi-card/.activity-card :479-515`, `.filter-btn :555-589`,
  `.btn-primary/.btn-secondary :690-734` (+ layer neumorfik `:1079-1103`), `.sidebar-nav-item :737-770`,
  `.card-hover :778-785`, focus ring `:788-796`, `.header-glass :828-847` (backdrop blur + `@supports`),
  `.skeleton :849-859`, `.table-row :882-893`.
- Layar neumorfik `:1049-1222` — semua override presentasional, aman dilanjutkan.
- Penyesuaian dark-mode utility `:895-1017` — tidak menyentuh motion; jangan diutak-atik di fase motion.

**Perlu perombakan/perhatian:**
- Blok reduced-motion `:1224-1231` **tidak lengkap** (hanya 3 kelas hover; animasi masuk, stagger,
  shimmer, dan `slideDown` tetap jalan). Harus diperluas (lihat §3.4).
- `@keyframes slideDown :424-427` memakai `max-height: 0 → 600px` (animasi properti layout;
  jank risk) — ganti ke teknik modern (grid-template-rows atau scale/opacity + clip) saat dirombak.
- Angka transisi yang di-hardcode di komponen (`duration-200`, `duration-300`,
  `cubic-bezier(0.25,0.1,0.25,1)`) sebaiknya dipetakan ke token.

**Distribusi pemakaian:** 21 file `.tsx` memakai kelas `animate-*`/`stagger`/`card-list`
(mayoritas halaman `_client.tsx` + `notification-bell.tsx` + `login/page.tsx`).

### 1.6 Komponen yang "belum selesai" secara motion (enter-only, tanpa exit)

| Komponen | Anchor | Masalah |
| --- | --- | --- |
| `ui/dialog.tsx` | `:139` (`return null`), `:143-157` (inline `fadeIn`/`scaleIn`), `:183` | Exit instan (unmount ⇒ hilang tanpa animasi). Kandidat `AnimatePresence` — **hati-hati**: focus-trap & body scroll-lock `:67-137` tidak boleh berubah perilakunya. |
| `layout/notification-bell.tsx` | `:151`, `:175` (`animate-scale-in`) | Dropdown muncul beranimasi, menutup mendadak. |
| `layout/command-palette.tsx` | `:478` (fadeIn backdrop), `:486` (scaleIn panel), `:556` | Idem; tanpa stagger item & tanpa exit. |
| `layout/sidebar.tsx` | `:327, :359 (rotate-180), :375, :422, :573-574, :602, :611` | Drawer mobile pakai `transition-transform` sederhana; indikator aktif `:396/:449` statis (bisa `layoutId` framer); collapse width inline style `:602/:611` (tulis ulang pakai token). |
| `layout/header.tsx` | `:229` | Hanya `transition-all duration-200`. |
| `theme-toggle.tsx` | `:18-19` | Sudah CSS rapi (rotate/scale 300ms via `dark:`) — cukup diselaraskan token. |
| `ui/data-table.tsx` | `:38-59` (skeleton rows), `:95` (row `transition-colors`) | Belum ada entrance untuk baris; animasi baris tabel berisiko (lihat §4). |
| `dashboard/charts.tsx` | `:160-196` (polyline+circle), `:219+` (StatusDonut) | SVG manual 404 baris, tanpa animasi masuk (draw-in) — peluang, tapi wajib uji performa. |
| `ui/input.tsx:10`, `ui/select.tsx:16`, `ui/button.tsx:6`, `ui/card.tsx:9`, `ui/badge.tsx:6` | — | `transition-all` → sebaiknya dipersempit (transform/opacity/color) agar tidak meng-animasikan properti mahal. |

### 1.7 Fitur transisi bawaan Next 16.2.6 + React — HASIL CEK DOKUMENTASI LOKAL (bukan dari ingatan)

Sesuai peringatan `AGENTS.md` (root, 5 baris), semua klaim di bawah diverifikasi ke instalasi lokal repo ini:

**a) Dokumentasi yang ada di `node_modules/next/dist/docs/`:**
- `01-app/02-guides/view-transitions.md` — panduan lengkap: 4 pola (shared-element morph,
  Suspense reveal, directional slide, same-route crossfade), CSS `::view-transition-old/new/group`,
  respek reduced-motion (`:327-336`), catatan "Safari dapat berbeda; tanpa dukungan browser aplikasi
  tetap berjalan normal" (`:40-41`). Syarat: `experimental.viewTransition: true` (`:26-38`).
- `01-app/03-api-reference/05-config/01-next-config-js/viewTransition.md` — flag `experimental.viewTransition`
  (`version: experimental`; "enables Next.js integration, such as triggering transitions during route navigations").
- `01-app/03-api-reference/02-components/link.md:503-527` — prop **`transitionTypes?: string[]`** pada `<Link>`.
- `01-app/03-api-reference/04-functions/use-router.md:44-45` — `router.push/replace(href, { transitionTypes })`.
- `01-app/03-api-reference/04-functions/use-link-status.md` — hook `useLinkStatus` (pola hint 100ms di `:199-236`).
- `01-app/02-guides/upgrading/version-16.md:398-406` — "Next.js 16 App Router uses the latest React
  **Canary** release… Highlights include **View Transitions**".

**b) Kode Next terpasang (bukti, bukan asumsi):**
- Flag ada di schema & default: `node_modules/next/dist/server/config-shared.d.ts:684-687`
  ("Enables view transitions by using the ViewTransition Component"), default `false` di `:1404`;
  `node_modules/next/dist/server/config-schema.js:316`.
- Client runtime **sudah memanggil** `React.addTransitionType` saat navigasi ber-`transitionTypes`:
  `node_modules/next/dist/client/components/app-router-instance.js:211-217`; `<Link>` meneruskan
  `transitionTypes` ke jalur ini (`app-dir/link.js:86`; type di `link.d.ts:173,183`).
- RSC renderer server mendukung atribut `vt-name`/`viewTransitionName`/`viewTransitionClass`
  (`next/dist/compiled/next-server/app-page.runtime.dev.js`).

**c) React yang BENAR-BENAR di-bundle aplikasi ini = React vendored Next (canary), bukan `node_modules/react@19.2.4`:**
- `next/dist/esm/build/create-compiler-aliases.js:160+` (`createVendoredReactAliases`) + `webpack-config.js:225`
  (`bundledReactChannel`) meng-alias `react`/`react-dom` → `next/dist/compiled/react*`, diterapkan juga pada
  layer **`appPagesBrowser`** (`webpack-config.js:1231`) dan layer server RSC (`:1145/:1205/:1217/:1281/:1296`).
- Versi vendored = **`19.3.0-canary-3f0b9e61-20260317`** dan **mengekspor `ViewTransition` + `addTransitionType`**
  (verified via `require('next/dist/compiled/react/cjs/react.production.js')`).
- Verifikasi empiris di output build repo: `.next/dev/static/chunks/main-app.js` memuat modul
  `node_modules/next/dist/compiled/react/cjs/react.development.js`; chunk produksi
  `.next/static/chunks/framework-*.js` memuat mesin `waitingForViewTransition` react-dom.
- `node_modules/react@19.2.4` (stable, terpasang) **tidak** mengekspor `ViewTransition` — tetapi ia
  bukan React yang dipakai aplikasi; ia relevan hanya via **types**.

**d) Implikasi TypeScript:** `@types/react@19.2.15` menaruh `ViewTransition` di
`node_modules/@types/react/canary.d.ts:109` dan `addTransitionType` di `:114` (index.d.ts biasa **tidak**
memuatnya). Untuk memakai `<ViewTransition>` di TS perlu opt-in kanary, salah satu:
`"types": ["react/canary", …]` di tsconfig, `import {} from 'react/canary'`, atau triple-slash
`/// <reference types="react/canary" />` — lihat header `canary.d.ts`.

**e) Yang TIDAK dapat saya verifikasi tanpa menjalankan dev/build (jujur):** titik persis konsumsi
`config.experimental.viewTransition` di kode JS (tidak ditemukan pembacaan eksplisit di `next/dist` non-minified;
kemungkinan di runtime/bundler terkompilasi), dan **perilaku runtime flag** di `next dev --webpack`
(dev server tidak boleh dijalankan — dipakai Noir). Karena itu **Fase 0 wajib menyertakan spike kecil**
(§3) di branch scratch sebelum komitmen besar. Fallback bila flag bermasalah: crossfade CSS biasa +
framer-motion (tetap tanpa overlay intercept).

**f) Flag eksperimental lain yang relevan** (sekadar catatan): `experimental.transitionIndicator`
(`config-shared.d.ts:435-438`, indikator navigasi bawaan React) dan `experimental.gestureTransition` —
keduanya **memicu downgrade channel React ke `-experimental`** (`next/dist/esm/lib/needs-experimental-react.js:2-4`);
`viewTransition` **tidak** (channel tetap, jadi risiko lebih kecil).

---

## 2. Opsi Pendekatan & Rekomendasi

### 2.1 Opsi A — Perluas sistem CSS (token + keyframes)

- **Cocok untuk:** mikro-interaksi (hover/press/focus), entrance opacity/transform ringan,
  shimmer, indikator, reduced-motion via media query.
- **Pro:** 0 JS, 0 bundle, otomatis SSR-safe, mudah di-audit; sudah jadi basis 90% motion lama.
- **Kontra:** tidak bisa exit-animation (butuh komponen tetap ter-mount), tidak bisa spring asli,
  orchestration manual (delay n-th child), tidak bisa mengikuti state React tanpa class tambahan.
- **Verdict:** **fondasi wajib**, bukan solusi tunggal.

### 2.2 Opsi B — framer-motion v12.42.2 (AnimatePresence, springs, layout)

- **Cocok untuk:** modal/dropdown/bell/palette (enter+exit), orchestration (stagger terkontrol),
  spring halus, `layoutId`/`layout` untuk indikator aktif sidebar & segmen.
- **Pro:** terpasang & sudah dipakai; peer `react ^18 || ^19` (verified `framer-motion/package.json`)
  → aman dengan React 19 (dan React vendored canary — framer tidak menyentuh API canary);
  exit-animation satu-satunya cara bersih di komponen React (tanpa gimmick).
- **Kontra:** ukuran. Perkiraan gzip bundle penuh (`motion` + `AnimatePresence` + spring) **≈ 32–36 KB**;
  `LazyMotion` + `domAnimation` memangkas ke **≈ 15–18 KB** (angka industri, bukan hasil ukur di repo ini);
  fitur berat `layout`/`drag` menambah lagi. Karena file shell sudah meng-import framer di semua rute,
  **biaya marginal menambah pemakaian kecil** — tapi jangan memboroskan (`layout` di list panjang = projection churn).
- **Verdict:** **dipakai, dibatasi pada kelas komponen yang butuh exit/orchestration.**

### 2.3 Opsi C — View Transitions API / fitur transisi Next 16.2.6

- **Status di repo ini: tersedia** (§1.9). Aktivasi = `experimental: { viewTransition: true }` di
  `next.config.ts` (1 baris) + `<ViewTransition>` dari `react` (runtime sudah punya) + CSS `::view-transition-*`.
- **Cocok untuk:** (1) transisi antar-halaman (crossfade halus default), (2) **morph elemen bersama**
  (mis. identitas pegawai dari tabel → halaman detail, avatar → header), (3) Suspense reveal
  (skeleton → konten), (4) crossfade konten dalam satu rute (filter periode!) via `key` + `name`.
- **Pro:** animasi dilakukan browser (snapshot compositor-level) → sangat halus, **0 KB JS tambahan**;
  deklaratif (tidak menyentuh router internals); mematuhi `::view-transition-*` + media reduced-motion.
- **Kontra/risiko:** flag masih `experimental` (bisa berubah antar-upgrade Next — repo ini pernah kena
  breaking change Next 16); **types React canary perlu opt-in** (§1.9d); Safari: "animations may behave
  differently" (docs `:40-41`) — perlu uji; navigasi back/forward browser tidak membawa `transitionTypes`
  (arah slide tidak jalan — sengaja desainnya begitu); durasi/curve hanya CSS (tidak bisa spring) —
  batasi pemakaiannya pada transisi global, bukan mikro-interaksi; elemen ber-`view-transition-name`
  harus unik (nama ganda = transisi gagal senyap).
- **Verdict:** **jalur utama untuk NAVIGASI.** Tanpa ini, transisi antar-halaman tetap tidak mungkin
  dilakukan bersih di App Router (lihat §3.3 soal AnimatePresence page-level).

### 2.4 Opsi D — HYBRID (REKOMENDASI FINAL)

**Aturan pembagian per jenis interaksi:**

| Jenis interaksi | Teknologi | Contoh di SIKAP |
| --- | --- | --- |
| Pindah halaman/menu | **View Transitions** (CSS `::view-transition-*`, durasi dari token) + fallback crossfade CSS | klik sidebar, breadcrumb, tombol "Lihat Tabel" |
| Elemen bersama antar-halaman | **View Transitions shared element** (`name`) — dipakai hemat | identitas pegawai → detail; KPI → halaman analitik |
| Refetch data dalam halaman (filter periode) | **CSS/framer ringan** (`FetchingBar` dipertahankan; overlay disederhanakan) | `filter-loading.tsx` |
| Modal/panel/dropdown/toast-adjacent | **framer-motion `AnimatePresence`** (+ spring token) | `dialog.tsx`, `notification-bell.tsx`, `command-palette.tsx`, sidebar mobile |
| Indikator aktif & segmen | **framer `layoutId`** atau CSS token | sidebar `:396/:449`, view-toggle `.view-toggle` |
| Hover/press/focus/mikro | **CSS token** (`--duration-fast`, `--ease-apple`) | button/card/input/table-row |
| Skeleton & shimmer | CSS (sudah ada) + varian reduce-motion | `.skeleton`, `data-table.tsx:38-59` |

**Alasan memilih hybrid (bukan salah satu murni):**
1. Navigasi adalah 70% keluhan "kaku" di app seperti ini; View Transitions menyelesaikannya **tanpa
   menambah JS** dan sekaligus **menghapus tech-debt overlay** (intercept global → mekanisme router natif).
2. Komponen mount/unmount (modal, bell, palette) tidak bisa diselesaikan CSS; framer-motion sudah ada
   dan sudah bayar biayanya di bundle.
3. Mikro-interaksi tidak butuh JS; ini menjaga bundle & menjaga SSR bersih.
4. Menghindari dua mesin yang bertabrakan: **tidak** menganimasikan properti yang sama dengan VT
   dan framer sekaligus pada elemen yang sama (aturan implementasi, §4.1).

**Dampak bundle (perkiraan):** +0 KB untuk navigasi (VT native); +0–2 KB CSS baru; framer-motion tetap
seperti sekarang (sudah ter-load di semua rute) — jangan aktifkan fitur `layout` besar-besaran;
`LazyMotion` opsional bila tim ingin disiplin. Tidak ada dependency baru.

**Kompatibilitas React 19.2.4:** runtime aplikasi = React vendored Next canary 19.3.0 (§1.9c) yang sudah
mendukung VT; React stable 19.2.4 hanya berperan via types — tambahan `react/canary` types adalah
opt-in TypeScript murni, tidak mengubah runtime. framer-motion 12.42.2 resmi mendukung React 19.

### 2.5 Matriks keputusan singkat

- `(a)` CSS saja → **tidak cukup** (0 exit-animation; transisi halaman tak tersentuh).
- `(b)` framer saja → **bisa**, tapi transisi halaman di App Router jebakan (AnimatePresence atas
  `{children}` RSC = subtree lama tertahan / double-render) dan tetap menyisakan tech-debt overlay.
- `(c)` VT saja → **bisa**, tapi perjalanan mikro-interaksi & modal akan lambat dibangun dgn CSS manual.
- `(d)` **hybrid → REKOMENDASI.**

---

## 3. Rencana Implementasi Bertahap

> Semua fase: read-only dulu → patch kecil → verifikasi manual (repo tidak punya test suite;
> `package.json` hanya `dev/build/lint/start`). Verifikasi memakai `npm run lint` + QA manual + build produksi
> (khususnya untuk PWA & VT).

### Fase 0 — Fondasi (1 PR kecil, tanpa perubahan perilaku)

File:
- `src/app/globals.css` — perluas **token** (tanpa menghapus 4 token lama): mis. tambahan durasi & easing
  baru yang disepakati dengan Noir (kandidat: `--duration-exit: 150ms`, `--duration-enter: 210ms` —
  persis nilai dari panduan Next `view-transitions.md:160-197`), keyframes baru (slide-soft, fade-blur),
  rapikan `slideDown` (`:424-427`) agar tidak memakai `max-height`.
- **Baru** `src/lib/motion.ts` (atau `src/hooks/use-motion-prefs.ts`) — konstanta durasi/easing JS yang
  memetakan token CSS + hook `useMotionSafe()` (bungkus `useReducedMotion`).
- **Baru** `src/components/providers/motion-provider.tsx` — `<MotionConfig reducedMotion="user">` (framer)
  dibungkus di root `src/app/layout.tsx` (client boundary kecil baru; verified `MotionConfig` diekspor framer 12.42.2).
- **Baru (hanya jika VT disetujui)** `src/types/react-canary.d.ts` — `/// <reference types="react/canary" />`
  atau `import {} from 'react/canary'`.
- `next.config.ts` — **1 baris** `experimental.viewTransition: true` (PR terpisah di balik spike).
- **Spike (branch scratch / PR throwaway):** aktifkan flag + `<ViewTransition>` di 1 alur
  (login → dashboard) + `::view-transition-*` CSS → uji di dev **dan** `npm run build && npm start`
  (SW PWA aktif di prod), uji Safari/Firefox/Edge. Cek: tidak ada konflik dengan TopLoader, modal, sonner.
  Jika gagal → fallback: crossfade CSS via `<ViewTransition>` ditiadakan, navigasi pakai CSS biasa + framer.

### Fase 1 — Layout shell & navigasi (area paling terlihat)

File (9):
- `src/components/layout/route-transition.tsx` — **rombak**: (opsi utama) hapus overlay & intercept klik;
  transisi halaman diserahkan ke `<ViewTransition>` yang dipasang di 7 layout rute; (opsi fallback)
  overlay dipertahankan tapi dengan delay-threshold ≥150ms, tanpa blur, tanpa listener global —
  dipicu dari `onNavigate`/`useLinkStatus`.
- 7 layout rute (`src/app/{admin,analitik,ketua_tim,pegawai,penilaian,pimpinan,rencana_kinerja}/layout.tsx`)
  — ganti `<RouteTransition />` (`:3,:9`) dengan wrapper `<ViewTransition>` (nama + default `none` utk
  initial load) atau kelas fallback.
- `src/components/layout/sidebar.tsx` — indikator aktif `layoutId`; drawer mobile → `AnimatePresence`
  (`:573-574`); collapse width `:602/:611` → token; `rotate-180` chevron `:359` → token.
- `src/components/layout/header.tsx` — fade halus elemen breadcrumb + `viewTransitionName: 'site-header'`
  (agar header tidak ikut slide saat VT arah — pola dari panduan `:290-315`).
- `src/components/layout/notification-bell.tsx` — enter+**exit** via AnimatePresence (`:175`).
- `src/components/layout/command-palette.tsx` — enter+exit panel (`:486`) + stagger item (`:556`) hemat.
- `src/components/theme-toggle.tsx` — selaraskan ke token (perilaku tetap).

Definisi selesai: lintas-rute (semua 7 group + lintas-group) terasa halus tanpa overlay; navigasi
cepat (<200ms) **tidak** menampilkan indikator apa pun; navigasi lambat tetap ada umpan balik
(TopLoader / `useLinkStatus` hint).

### Fase 2 — UI primitives (`src/components/ui/*`, 13 file)

- `dialog.tsx` — `AnimatePresence` untuk backdrop & panel (target: exit 150ms / enter 210ms pola docs);
  **jangan menyentuh** logic focus-trap & scroll-lock (`:67-137`); pastikan ESC/backdrop klik tetap jalan.
- `button.tsx:6` — ganti `transition-all` → properti spesifik (transform, box-shadow, colors);
  press `active:scale-[0.98]` dipertahankan (sudah Apple-ish).
- `card.tsx:9`, `badge.tsx:6`, `input.tsx:10`, `select.tsx:16`, `textarea.tsx` — token & properti spesifik.
- `skeleton.tsx` + `.skeleton` — tambah varian reduced-motion; animasi shimmer ke `opacity` di mode reduce.
- `empty-state.tsx` — entrance halus (fade-up kecil, token).
- `data-table.tsx` — entrance baris **opsional & terbatas** (≤10 baris pertama, transform/opacity saja);
  header/toolbar tidak dianimasikan saat filter berubah (hindari flash).
- `error-boundary.tsx` — halaman error fade-in; `screenshot-button.tsx` — tunggu animasi settle
  sebelum `htmlToImage.capture` (lihat risiko §4.6).
- `logo.tsx` — biarkan (statis).

### Fase 3 — Dashboard (`src/components/dashboard/*`, 11 file)

- `kpi-card.tsx`, `stat-card.tsx`, `activity-card.tsx`, `pegawai-card.tsx` — hover/press token (sudah CSS);
  tambahan entrance pada mount di dalam `.stagger`/`.card-list` (sudah ada — cukup distandardkan).
- `charts.tsx` — entrance SVG: `stroke-dashoffset` draw-in untuk polyline/donut (`:160-196`, `:219+`),
  transition `--duration`; **hati-hati jumlah node**; sediakan prop `animateEnter` agar halaman berat
  bisa mematikannya.
- `filter-loading.tsx` — `FetchingBar` → CSS keyframe (sama visual); `FetchingOverlay` → primitive
  bersama; keduanya hormati reduced-motion.
- `period-filter.tsx`, `status-filter.tsx` — micro feedback saat nilai berubah (bukan animasi layout).

### Fase 4 — `ckp/` + `rk/` + halaman berat (bertahap per rute)

Urutan berdasar risiko/ukuran (baris file):
1. `src/app/pegawai/_client.tsx` (540) & `pegawai/ckp/[id]/_client.tsx` (780) — stagger KPI & card-list sudah ada; selaraskan token.
2. `src/app/pimpinan/_client.tsx` (521), `_pimpinan_client.tsx` (473) + `pimpinan/approval` (487) + `pimpinan/pegawai` (323) + `monitoring-penilaian` (275).
3. `src/app/ketua_tim/_client.tsx` (696), `ketua_tim/rk/[id]/_client.tsx` (956).
4. `src/app/admin/pegawai/_client.tsx` (746), `admin/export-penilaian/_client.tsx` (757),
   `admin/logs` (tabel), `admin/periode`, `admin/rk/import/page.tsx` (stepper/progress import).
5. **Terakhir & paling hati-hati:** `src/app/penilaian/[upload_id]/_client.tsx` (1197 baris — halaman terberat).
6. `src/rk/rk-management-view.tsx` + komponen `ckp/*` (5 file).
   `login/page.tsx` & `reset-password` — entrance halaman publik (sudah `animate-fade-in`; selaraskan).

### Fase 5 — Verifikasi & pembersihan

- Audit reduced-motion menyeluruh (lihat §3.4) + uji di OS-level setting.
- Build produksi + uji PWA (SW) + Lighthouse (INP/TBT), uji Safari/Edge/Firefox.
- Putuskan TopLoader vs `useLinkStatus` hint vs keduanya; hapus kode mati (`ROUTE_LABELS` di route-transition
  jika overlay dihapus); evaluasi hapus `@tanstack/react-table` (dep mati).
- Dokumentasi token motion final + contoh pola di `design/`.

### 3.3 Pola aman untuk App Router

1. **Client boundary tetap tipis.** Motion hanya di client component (repo sudah 47 file
   `"use client"`); jangan mengubah `page.tsx` server menjadi client — buat wrapper kecil
   (mis. `<PageEnter>`) di dalam `_client.tsx` yang sudah ada.
2. **JANGAN membungkus `{children}` layout dengan `AnimatePresence`.** Subtree lama (RSC) tidak
   disimpan React saat navigasi → exit-animation halaman tidak akan berjalan, dan memaksa
   penahanan subtree berisiko double-render/double-fetch (berinteraksi buruk dengan React Query
   di `QueryProvider` + `KeepAliveManager`/`RecoveryManager`, `src/components/providers/*`).
   Gunakan **View Transitions** untuk lintas-rute, **enter-only** untuk konten halaman.
3. **Keyed remount hanya untuk wrapper kecil:** jika perlu memicu enter-animation per rute,
   `key={pathname}` dipasang pada div konten kecil — **jangan** di sekitar provider (QueryClient/
   Auth) karena akan me-remount seluruh tree (refetch semua query).
4. **Hydration-safe:** entrance memakai CSS/animation (bukan state `useEffect`-set-mounted) untuk
   konten SSR; hindari inline style yang berbeda server vs client; `suppressHydrationWarning` sudah
   ada di `<html>` (`layout.tsx:57`) — jangan menambah dependensi padanya.
5. **Portal & overlay:** `AnimatePresence` ditaruh **di dalam** komponen yang memiliki portal
   (`dialog.tsx` mem-portal ke `document.body` `:141-161`); exit harus tetap membersihkan
   listener (kunci ESC/focus restore) — pakai callback `onExitComplete` bila necessario.
6. **Sheet/drawer sidebar mobile:** tetap satu instance (bukan portal ganda) agar tidak bentrok
   dengan `RouteTransition`/VT snapshot.
7. **Jangan animasikan `{children}` di root `layout.tsx`;** header/sidebar shell dipertahankan
   persisten (sudah begitu) → hanya area konten yang ber-transisi.

### 3.4 Menghormati `prefers-reduced-motion` secara konsisten (3 lapis)

1. **CSS global (lapis utama).** Perluas `globals.css:1224-1231` menjadi blok menyeluruh:
   matikan `animation` masuk & transisi transform (`.animate-*`, `.stagger > *`, `.card-list > *`,
   `.skeleton`, hover lifts), sisakan fade opacity tipis; tambahkan override View Transitions:
   `::view-transition-old(*), ::view-transition-new(*), ::view-transition-group(*) { animation-duration: 0s !important; animation-delay: 0s !important; }`
   (resep resmi di `view-transitions.md:321-336`).
2. **JS (lapis koordinasi).** `<MotionConfig reducedMotion="user">` di root → framer otomatis
   menonaktifkan animasi transform/`x/y/scale` sambil mempertahankan opacity. Untuk logika
   kondisional (skip stagger delay, skip draw-in chart), pakai `useReducedMotion()` (verified
   diekspor framer 12.42.2) via hook `useMotionSafe()` Fase 0.
3. **View Transitions.** CSS lapis 1 sudah menetralkan; bila ingin lebih rapi, gunakan varian
   `@media (prefers-reduced-motion: no-preference)` untuk mendefinisikan animasi VT, bukan sebaliknya.
4. **Test:** DevTools Rendering → "Emulate prefers-reduced-motion" + setelan OS Windows
   (Animation effects OFF). Kriteria lulus: tidak ada elemen bergeser, tidak ada blur-anim, halaman
   tetap tampil benar.

---

## 4. Risiko & Constraint

### 4.1 Aturan properti animasi (wajib)

- **Animasikan hanya `transform` & `opacity`** (+ `filter` untuk kasus khusus kecil seperti blur crossfade;
  + warna/box-shadow untuk state tombol — murah, tapi hindari pada list panjang).
- **Dilarang/batasi:** `width/height/max-height` (`slideDown :424-427` saat ini melanggar), `top/left/margin/padding`,
  `box-shadow` besar berulang pada banyak elemen, `backdrop-filter` setelah ukuran besar (scrim full-viewport
  di route-transition = kandidat hapus).
- View Transitions: snapshot full-page — aman (compositor), **tapi** animasikan konten dengan transform kecil
  (≤60px per panduan `:288`) supaya tidak terasa "berat".
- `will-change` hanya sesaat, jangan permanen di banyak elemen.

### 4.2 Performa & halaman terberat (uji khusus)

| File | Baris | Kenapa berisiko |
| --- | --- | --- |
| `src/app/penilaian/[upload_id]/_client.tsx` | 1197 | Halaman terberat: KPI + daftar RK + tabel entri + drawer penilaian; banyak node |
| `src/app/ketua_tim/rk/[id]/_client.tsx` | 956 | Tabel lebar + aksi; sering re-render saat skor diisi |
| `src/app/pegawai/ckp/[id]/_client.tsx` | 780 | card-list + tabel; animasi entrance berlapis |
| `src/app/admin/export-penilaian/_client.tsx` | 757 | FetchingOverlay + tabel besar; filter cepat |
| `src/app/admin/pegawai/_client.tsx` | 746 | Tabel + dialog + filter |
| `src/components/dashboard/charts.tsx` | 404 | Ratusan node SVG; draw-in animation harus diuji throttle 4× CPU |
| `src/app/admin/logs/_client.tsx` | — | Tabel log panjang (pagination) |

Patokan: **tidak ada animasi >1 varian berjalan bersamaan** pada satu interaksi; animasi list
dibatasi elemen pertama (mis. ≤10–12); semua entrance harus selesai ≤400ms.

### 4.3 PWA / service worker

- `@ducanh2912/next-pwa` **nonaktif di dev** (`next.config.ts:6`) → semua uji animasi navigasi **wajib**
  juga dilakukan di `npm run build && npm start` (SW + cache RSC aktif).
- `aggressiveFrontEndNavCaching`/`cacheOnFrontEndNav` (`:8-9`) mempercepat navigasi (baik untuk motion);
  tidak ada interaksi teknis dengan View Transitions, tapi perlu regression test.
- `reloadOnOnline: true` (`:10`) — saat koneksi pulih, SW dapat reload halaman; animasi yang sedang
  berjalan akan terpotong. Ini perilaku lama; pastikan tidak menambah animasi berbasis `online` event.
- Update service worker (deploy baru) bisa memicu reload; jangan mengaitkan state animasi ke lifecycle SW.

### 4.4 Estimasi scope file

| Area | File | Jumlah |
| --- | --- | --- |
| Layout shell | `components/layout/*` + `theme-toggle.tsx` | 5–6 |
| UI primitives | `components/ui/*` | 13 |
| Layout rute | 7 `layout.tsx` route-group | 7 |
| Sistem | `globals.css`, `next.config.ts`, util motion baru, motion-provider, types canary | 4–5 |
| Halaman/klien bertahap | `_client.tsx` terpilih + login/reset/import | 10–15 |
| **Total realistis** | | **±35–45 dari 91 `.tsx` (47 client)** |

### 4.5 Titik paling rawan regresi

1. **Menghapus overlay tanpa pengganti** → navigasi lambat tanpa umpan balik. Mitigasi: pasang
   pengukuran (TopLoader tetap; `useLinkStatus` utk link ke rute dinamis) **sebelum** overlay dicabut.
2. **`dialog.tsx`** — focus-trap, scroll-lock, ESC stack (`:77-137`) mudah rusak jika dibungkus
   `AnimatePresence` dengan salah (harus keluar dari tree setelah exit, bukan langsung).
3. **Sidebar collapse** (width inline `:602/:611`) — konflik antara transition CSS dan framer
   `layout` bila keduanya aktif; pilih satu.
4. **Lintas route-group** — dua layout sempat mounted bersamaan; VT menangani ini natif, pola overlay
   tidak; jangan campur keduanya.
5. **`screenshot-button.tsx`** — `html-to-image` memotret DOM saat animasi berjalan → hasil blur/geser;
   tunggu settle atau matikan animasi sesaat.
6. **Charts tooltip/interaksi** (`charts.tsx`) — entrance `stroke-dashoffset` bisa konflik dengan hover
   marker; sediakan kill-switch per halaman.
7. **Reduced-motion** — jangan sampai animasi baru lolos dari lapis 1 (audit wajib di Fase 5).
8. **Regresi visual dark/light** — semua token scrim/blur harus dicek di dua tema (token overlay sudah
   terpisah `:219`/`:322`).

### 4.6 Constraint lingkungan

- Dev server sedang dipakai agen lain (Noir) → **validasi runtime VT harus di branch/burst terpisah**.
- Repo tanpa test otomatis → verifikasi = `npm run lint` + QA manual + build produksi.
- Jangan menyentuh artefak lajur lain (`design/MOTION-AUDIT.md`, `design/MOTION-SPEC.md`,
  `design/MOTION-REFERENCES.md`) dan folder `.impeccable/`.

---

## 5. Perlu Diputuskan User

1. **Intensitas motion & durasi.** Token lama (`--duration` 300ms, `--duration-fast` 180ms) dipertahankan?
   Tambahan usulan teknis: `--duration-exit` 150ms / `--duration-enter` 210ms untuk pola handoff
   (angka dari panduan Next). Setuju/ubah?
2. **`RouteTransition` overlay: rombak total (hapus) atau pertahankan dengan delay-threshold ≥150ms?**
   (Rekomendasi teknis: hapus & ganti VT/`useLinkStatus`; overlay hanya jika ingin indikator eksplisit.)
3. **Aktifkan `experimental.viewTransition` sekarang?** Trade-off: pengalaman navigasi terbaik + 0 KB,
   tapi menambah ketergantungan pada flag eksperimental Next (risiko upgrade) + types canary opt-in.
   Alternatif: tunda, pakai framer/CSS dulu (hasil lebih lemah untuk lintas-rute).
4. **Batas scope Fase 1:** hanya shell+primitives, atau sekaligus dashboard? (Rekomendasi: shell dulu
   untuk mengunci pola & ukur dampak.)
5. **Animasi konten "showy"** — draw-in chart, count-up angka KPI, morph identitas pegawai: ya/tidak?
   (Konteks pemerintahan: rekomendasi minimalis, hanya 1–2 morph "hotspot".)
6. **TopLoader** dipertahankan berdampingan dengan View Transitions, atau diganti `useLinkStatus` hint?
7. **Pembersihan:** hapus `@tanstack/react-table` (dep terpasang tapi 0 pemakaian)?
8. **Target perangkat/browser minimum** (Safari iOS? Android low-end?) → menentukan batas blur,
   cakupan VT, dan threshold animasi.
9. **Kepemilikan token final:** perubahan/penambahan token harus dikoordinasikan dengan lajur Noir
   (MOTION-SPEC) — siapa yang menjadi pemutus akhir nilai visual?

---

## Lampiran A — Bukti verifikasi (reproducible)

```bash
# 1) Klaim framer-motion = 2 file
grep -rn "framer-motion" src/ --include="*.tsx" --include="*.ts"
# → route-transition.tsx:5, filter-loading.tsx:4 (hanya ini)

# 2) Flag Next 16.2.6
grep -n "viewTransition" node_modules/next/dist/server/config-shared.d.ts   # :687 (tipe), :1404 (default false)
grep -n "viewTransition" node_modules/next/dist/server/config-schema.js    # :316

# 3) React yang benar-benar dipakai = vendored canary
node -e "console.log(require('next/dist/compiled/react/cjs/react.production.js').version,
                       typeof require('next/dist/compiled/react/cjs/react.production.js').ViewTransition)"
# → 19.3.0-canary-3f0b9e61-20260317  symbol
grep -o "node_modules/next/dist/compiled/react/cjs/react.development.js" .next/dev/static/chunks/main-app.js | head -1

# 4) Plumbing navigasi
grep -n "addTransitionType" node_modules/next/dist/client/components/app-router-instance.js  # :211-217
grep -n "transitionTypes" node_modules/next/dist/client/app-dir/link.d.ts                    # :173,183

# 5) Docs lokal
ls node_modules/next/dist/docs/01-app/02-guides/view-transitions.md
sed -n '321,336p' node_modules/next/dist/docs/01-app/02-guides/view-transitions.md   # reduced-motion VT
```

## Lampiran B — Referensi internal utama

- Tokens: `src/app/globals.css:297-301` · Scrim: `:219`, `:322` · Keyframes: `:413-442` · Kelas: `:444-471` ·
  Reduced-motion (kini): `:1224-1231` · Sonner: `:1019-1047` · Neumorphism layer: `:1049-1222`
- Shell: `src/app/layout.tsx:59-69` (TopLoader), `:79-93` (Toaster) · 7 route-group layout (RouteTransition `:3,:9`)
- Overlay: `src/components/layout/route-transition.tsx:100` (listener global), `:111-150` (UI)
- Fetching: `src/components/dashboard/filter-loading.tsx:15-39`, `:48-88`
- Dialog: `src/components/ui/dialog.tsx:67-137` (a11y), `:143-157` (animasi kini)
- Next lokal: `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`,
  `.../03-api-reference/05-config/01-next-config-js/viewTransition.md`,
  `.../03-api-reference/02-components/link.md:503-527`,
  `.../03-api-reference/04-functions/use-router.md:44-45`,
  `.../03-api-reference/04-functions/use-link-status.md`,
  `.../02-guides/upgrading/version-16.md:398-406`

---

## Hasil Fase 0

> Diisi oleh pelaksana gelombang 1 (branch `feat/motion-ux`, Fase 0–2) sebagai penutup
> spike `experimental.viewTransition` (§1.7 / §3) + catatan jalur yang dipilih.

### Keputusan: **GO — `experimental.viewTransition: true` DIPERTAHANKAN**

Spike dijalankan di branch ini pada rute publik (`/reset-password → /login` — satu-satunya
navigasi SPA antar-rute tanpa kredensial) dengan instrumentasi CDP (Chrome headless):
`document.startViewTransition` terpanggil per navigasi SPA, layer bernama
(`::view-transition-old/new(…)`) terbentuk dan beranimasi, **tanpa error JS** — di
**dev (`next dev --webpack`)** maupun **build produksi (`npm run build && npm start`, PWA/sw aktif)**.
Build hijau di kedua kondisi; ringkasan fitur build menampilkan `✓ viewTransition`.
Emulasi `prefers-reduced-motion: reduce` juga aman (tanpa error, animasi dinolkan CSS Fase 0).

**Fallback (tersedia, tidak terpakai):** ganti isi `src/components/layout/page-transition.tsx`
menjadi `<div className="motion-page-enter">{children}</div>` (kelas CSS sudah ada sejak Fase 0),
lalu hapus flag — tanpa perubahan pada 7 `template.tsx`.

### Jalur implementasi final (Fase 1)

- `src/app/{admin,analitik,ketua_tim,pegawai,penilaian,pimpinan,rencana_kinerja}/template.tsx` (baru)
  → `<PageTransition>` (`<ViewTransition default="none" enter="page-enter" exit="page-exit">`).
  Template di-remount per navigasi (semantik template Next) → entrance konten per pindah halaman;
  layout/shell (Sidebar) berada di luar template sehingga persisten. Catatan: navigasi yang tidak
  mengubah child-segment level group (mis. `/pegawai/ckp/A → /pegawai/ckp/B`) tidak remount —
  edge case diterima, dicatat untuk koordinator.
- `route-transition.tsx` **dihapus** (overlay scrim+blur, intercept klik global, `ROUTE_LABELS`) —
  termasuk dari 7 layout rute; umpan balik navigasi = TopLoader (MOTION-SPEC §C1).
- `globals.css`: `::view-transition-old(.page-exit)` fade 150ms `--ease-apple`;
  `::view-transition-new(.page-enter)` fade+rise 210ms `--ease-out-strong`; **root di-`animation: none`**
  (shell statis saat transisi); **header di-anchor** `viewTransitionName: 'site-header'` (resep panduan
  lokal `view-transitions.md`, agar tidak ikut fade/rise konten); blok reduced-motion VT Fase 0 berlaku.
- `src/types/react-canary.d.ts` — opt-in types canary (type-level saja; runtime = React vendored Next).

### Catatan deviasi / keputusan (untuk koordinator)

1. **Entrance baris per-row tabel tidak ditambahkan** — SPEC §C4 menyebut "tanpa animasi per-row";
   `data-table.tsx` hanya diselaraskan token hover-nya.
2. **Command palette item: tanpa animasi** (gate frekuensi SPEC A: "Tanpa animasi. Titik.") — saran
   "stagger item hemat" di TECH tidak diambil. Enter panel `.motion-dropdown-in` (180ms, mendekati 160ms
   SPEC), exit 120ms fade-only; backdrop tanpa blur (G3).
3. **Sidebar indikator aktif**: animasi CSS mount (scaleY 0.6→1 + opacity, `.motion-indicator-in`) per
   SPEC §C1 — bukan `layoutId` framer (SPEC eksplisit "tidak perlu layout-shared"; menghindari konflik
   dengan transisi `width` collapse desktop — TECH §4.5 no.3).
4. **Tombol `active:scale`**: 0.98 → **0.97** (nilai visual ikut SPEC §C3).
5. **Drawer mobile**: enter `--duration` (300ms) / exit 250ms literal (SPEC §C5; belum ada token 250ms —
   kandidat token baru bila disepakati); scrim fade 180ms/150ms dari token.
6. **Dialog**: `AnimatePresence` (mekanisme TECH) — backdrop fade 180/150ms, panel enter 220ms / exit
   150ms (SPEC §C5); `backdrop-blur-xl` dihapus total (G3 "0–8px" → dipilih 0). Focus-trap/ESC/scroll-lock
   tidak disentuh.
7. **`animate-fade-in` pada wrapper halaman (38 kemunculan) belum dihapus** — file halaman adalah scope
   gelombang berikutnya; efek dobel (fade template + fade halaman) ringan; pembersihan menyusul per-halaman.
8. **Migrasi 4 modal custom `admin/pegawai` + modal pindah RK (`penilaian`) → `Dialog` belum dikerjakan**
   di gelombang ini (file halaman; tidak dapat diverifikasi live tanpa kredensial). `Dialog` sudah
   dipusatkan (exit bersama) sehingga migrasi tinggal mengganti markup pemakai.
9. **Known issue pre-existing (bukan dampak motion)**: `proxy.ts` tidak mengecualikan `*.js` di matcher →
   `/sw.js` ter-redirect 307 ke `/login` saat belum login → registrasi Service Worker gagal (dev & prod).
   Perlu keputusan terpisah (mis. kecualikan `sw.js`/`workbox-*` di matcher).
10. **Lint**: 284 error repo-wide berada di file **di luar** scope motion (contoh: `hooks/use-auth.tsx`,
    `lib/export/pdf-generator.ts`); seluruh file yang disentuh gelombang ini **0 error** (7 warning lama).
    `tsc --noEmit` dan build produksi hijau.
11. **Belum terverifikasi live**: halaman terautentikasi (tanpa kredensial), Safari/Firefox/Edge
    (hanya Chrome tersedia — docs menjamin degradasi anggun), kualitas visual (sesi tanpa screenshot).
12. **Koreksi contoh di SPEC §G1 (fix round QA)**: contoh blok reduced-motion di MOTION-SPEC §G1
    memetakan kelas **exit** (`.motion-panel-out` dkk.) ke `animation: fadeIn` — keliru (elemen yang
    menutup jadi kedip 0→1). Implementasi di `globals.css` memisahkan ENTER (`fadeIn`, 120ms linear)
    dan EXIT (`fadeOut`, 120ms linear). MOTION-SPEC.md **tidak** diubah dari lajur ini; koreksi teks
    SPEC dijadwalkan lewat lajur Noir. Sumber kebenaran perilaku = implementasi.

### Cara cepat membatalkan

1. `next.config.ts`: hapus `viewTransition: true`.
2. `page-transition.tsx`: ganti isi menjadi `<div className="motion-page-enter">{children}</div>`.
3. Opsional: hapus blok `::view-transition-*` di `globals.css` + `src/types/react-canary.d.ts`.

---

## Hasil Gelombang 2 (fix round + Fase 3–5)

> Diisi oleh pelaksana gelombang 2 (branch `feat/motion-ux`). Ringkas: yang selesai,
> deviasi/keputusan, dan sisa yang belum bisa diverifikasi live.

### Fix round gelombang 1 (commit paling awal gelombang 2)

1. **Bug reduced-motion exit diperbaiki** — kelas EXIT (`.motion-panel-out`, `.motion-overlay-out`,
   `.motion-dropdown-out`, `.motion-remove`) kini `fadeOut`, kelas ENTER tetap `fadeIn`
   (lihat butir 12 apendiks Fase 0).
2. **Command palette enter 160ms** via kelas baru `.motion-palette-in`/`.motion-palette-out`
   (SPEC §C1); `.motion-dropdown-in/out` tetap 180/120ms untuk bell (SPEC §C5) — kelas dipisah,
   nilai elemen lain tidak diubah.
3. **Token baru mengikuti konvensi §B1**: `--duration-panel-enter: 220ms`, `--duration-drawer-out:
   250ms` (+ `--duration-row-out: 200ms` untuk collapse-out baris/kartu) dan cerminannya di
   `src/lib/motion.ts` (`MOTION.panelEnter/drawerOut/rowOut`) — nilai visual tidak berubah.
4. **Dropdown notification-bell** diberi `origin-top-right` (SPEC §C5 — origin di trigger).

### Fase 3 — Dashboard (`src/components/dashboard/*`)

- `filter-loading.tsx`: gerak `FetchingBar` kini CSS keyframe `.fetching-bar-track` (loop JS framer
  dihapus; durasi 1.05s dan rentang geser identik); `FetchingOverlay` memakai preset kanonik
  `SPRING.crisp` + token durasi §B1; offset transform mati saat reduced-motion.
- `charts.tsx`: entrance SVG **opt-in** lewat prop `animateEnter` (default `false`; sebelumnya
  default `true` — dikoreksi di cleanup ronde 2, butir 6) — TrendLines fade 200ms
  (`.motion-chart-fade`), StatusDonut draw-in `stroke-dasharray` per slice + stagger 50ms
  (`.motion-donut-draw`), MiniBars grow `scaleX` 480ms (`.motion-bar-grow` + `.motion-progress`, G2).
  Satu-satunya pemakai yang memang meminta animasi per SPEC §E = `analitik/_client.tsx`
  (ketiga komponen kini pass `animateEnter` eksplisit).
- `activity-card.tsx`: expand memakai pola grid-rows (`.motion-collapse-wrap`, 200ms) menggantikan
  max-height `card-expanded-content`; hapus kartu = collapse-out 200ms **sebelum** mutasi cache
  (+rollback tetap); chevron rotate 180ms; progress bar → scaleX.
- `pegawai-card.tsx`: progress bar → scaleX + token — sengaja **tanpa** kelas `motion-*` karena
  kartu ini ikut target screenshot `#export-pegawai-section` (G4).
- `change-password-modal.tsx`: entri sukses memakai `.motion-pop` (bukan inline `scaleIn 0.3s`).
- `status-filter.tsx`, `kpi-card.tsx`: penyelarasan token + type-safety
  (tanpa perubahan visual). **Koreksi (cleanup ronde 2)**: `stat-card.tsx` **tidak** ikut
  diselaraskan di gelombang 2 — file itu tidak pernah tersentuh commit motion
  (verifikasi `git log -- src/components/dashboard/stat-card.tsx`; sentuhan terakhirnya = commit
  tema, di luar scope motion). Kalimat awal yang menyebutnya keliru.

### Fase 4 — halaman per route group (SPEC §E)

- **Migrasi ke `Dialog` bersama**: 4 modal `admin/pegawai` (tambah / ganti ketua tim / edit /
  konfirmasi), modal pindah RK `penilaian/[upload_id]`, modal "Tandai Perlu Diperbaiki"
  `ketua_tim/rk/[id]`, dan helper `Modal` di `components/rk/rk-management-view.tsx` (dipakai 5 modal).
  Backdrop `backdrop-blur-sm` di semuanya hilang (G3) dan exit animasi mengikuti Dialog.
  Exit-animation kini berjalan penuh di **semua** modal — call-site kondisional diperbaiki di
  cleanup ronde 2 (butir 1).
- **Expand/collapse → grid-rows (P2#10)**: activity-card, `pegawai/ckp/[id]`, `ketua_tim/rk/[id]`,
  RKCard `penilaian/[upload_id]`, accordion `monitoring-penilaian` (2 level), sub-RK
  `rk-management-view`; konten panel yang tertutup diberi `inert` (a11y keyboard).
- **Exit (P2#8)**: baris approval collapse-out sebelum mutasi; batch approve keluar bertahap 40ms
  (C9 #2); kartu hapus di `pegawai` (grid card) & activity-card collapse-out 200ms.
- **Wizard upload (P2#9)**: step crossfade 180ms (`.motion-crossfade`), progress modal tanpa blur
  (scrim 45%), momen sukses `.motion-pop` + tahan 800ms sebelum redirect (C9 #1, `MOTION.successHold`).
- **Sticky bar penilaian (P1#6)**: blur dihapus (soliditas `color-mix` 92%→97%), entrance sekali
  (`motion-page-enter`), progres scaleX 480ms, pop saat `allScored` (keyed span).
- **Stagger sekali-paint**: hook baru `useStaggerOnce` (`src/lib/motion.ts`) dipakai di dashboard
  `pegawai`, `ketua_tim` (+`_pimpinan_client`), `pimpinan/pegawai` — kelas `card-list` dilepas 700ms
  setelah paint pertama, jadi ganti filter/periode tidak re-stagger (SPEC §B5/C2).
- **Guardrail G4 / export (TEMUAN-3)**: `animate-fade-in` dihapus dari **semua** wrapper halaman
  (dobel dengan entrance `template.tsx`) dan dari `#export-monitoring-section`; `card-list` dihapus
  dari grid di dalam `#export-pegawai-section`; `ScreenshotButton` kini membekukan seluruh
  animasi/transisi target via `data-motion="none"` selama capture.
- `admin/rk/import`: indikator underline tab slide 180ms + konten tab crossfade.
- `admin/periode`: crossfade status "Terkunci/Terbuka" 150ms (teks + ikon).
- `login`/`reset-password`: kartu form rise 220ms (`.motion-rise-in`), alert error fade+rise 4px
  (`.motion-alert-in`), panel ilustrasi login float ±5px/7s (C9 #5, `.motion-float`).
- Badge notifikasi: pop saat jumlah naik, tanpa animasi saat turun (C9 #4).
- Kerapian: `animate-pulse` dekoratif di dot kalender dihapus; sweep `transition-all` &
  `duration-200/300/500` di `src/**/*.tsx` → **0 kemunculan** (target SPEC §F tercapai).

### Fase 5 — verifikasi

- `npx tsc --noEmit` → **0 error**.
- `npm run build` → **hijau** — run final dijalankan tanpa pipe (`BUILD_EXIT=0`, ✓ Compiled successfully, 22/22 static pages). Catatan: satu run antara pernah merah (`useStaggerOnce` undefined) karena source sedang diedit saat build berjalan — bukan keadaan final; state final hijau.
- `npm run lint` → **270 error** repo-wide (baseline gelombang 1: 284) — tidak ada error **baru** di
  file yang disentuh; beberapa file justru turun (mis. `admin/pegawai` 9→1, `pegawai/_client` 1→0,
  `pegawai/upload` 26→25). Sisa error seluruhnya di file luar scope motion.
- Smoke publik (dev/prod, port 3001): `/login`, `/reset-password` merender tanpa error konsol.

### Deviasi / keputusan (untuk koordinator)

1. **Donut draw-in** memakai grow `stroke-dasharray` (bukan `stroke-dashoffset` — offset sudah
   terpakai untuk posisi slice); nilai akhir identik dengan atribut elemen.
2. **Crossfade list eksplisit** tidak dipasang di dashboard yang filternya client-side (ubah filter
   = instant, sesuai §C4); yang dipatuhi adalah "tidak re-stagger" (§B5/C2). Halaman ber-refetch
   (approval, monitoring, ketua_tim, pimpinan) tetap memakai `FetchingBar`/`FetchingOverlay`.
3. **Spinner `animate-spin`** milik tombol refresh tetap ada di dalam `#export-monitoring-section` —
   feedback loading esensial (G1), dibekukan saat capture via `data-motion="none"`; entrance
   section-nya sendiri sudah dihapus.
4. **`rk-management-view` Modal — [TUNTAS di cleanup ronde 2]**: dulu sudah memakai `Dialog`
   bersama, namun exit-animation belum berjalan penuh karena call-site meng-unmount modal secara
   kondisional. Kini semua modal selalu-render + prop `open` (rk-management-view 5 call-site &
   modal ketua_tim — lihat "Cleanup round — penutupan QA ronde 2" butir 1). Transparansi: butir
   deviasi awal ini hanya menyebut `rk-management-view`, padahal pola kondisional identik juga ada
   di modal "Tandai Perlu Diperbaiki" `ketua_tim/rk/[id]`; keduanya diperbaiki di ronde yang sama.
5. **TopLoader** dipertahankan (indikator navigasi tunggal, §C1). `@tanstack/react-table` (dep mati)
   belum dihapus — keputusan user, di luar scope motion.
6. **`proxy.ts` / `sw.js`** tidak disentuh (isu pre-existing, menunggu keputusan user).
7. **Belum terverifikasi live**: semua halaman terautentikasi (tanpa kredensial), Safari/Firefox/Edge,
   dan kualitas visual (sesi tanpa screenshot).

### Cleanup round — penutupan QA ronde 2

> Verdict QA ronde 2: LULUS DENGAN CATATAN (tanpa P1). Seluruh butir P2/P3 ditutup di ronde ini
> tanpa mengubah logika bisnis — hanya animasi, guard, a11y, dan hygiene.

1. **[P2] Exit Dialog untuk modal kondisional — TUNTAS.** Modal yang dulu di-mount kondisional
   (`{state && <Modal …/>}`) kini **selalu ter-render + prop `open`** sehingga exit-animation Dialog
   berjalan penuh (SPEC §C5/§A3 "setiap masuk punya keluar"):
   - `components/rk/rk-management-view.tsx` — 5 call-site (Tambah RK, Tambah Sub-RK, Konfirmasi
     Hapus, Pindah Sub-RK, Hapus Tahun); helper `Modal` kini menerima prop `open`. Konten dibuat
     null-safe (`deleteConfirm?.name`, `selectedRkForSub?.…`, dst.) sehingga aman saat state
     penutupnya `null`; handler/submit tidak berubah (hanya animasi yang berubah).
   - `ketua_tim/rk/[id]/_client.tsx` — modal "Tandai Perlu Diperbaiki": outer conditional
     `{entryToMark && …}` dihapus (ia melepas mount sebelum exit), konten `entryToMark?.kegiatan`.
   **Transparansi**: butir deviasi awal (No. 4) hanya menyebut `rk-management-view` padahal pola
   kondisional identik juga ada di modal `ketua_tim`; keduanya baru diperbaiki di ronde ini.
2. **[P3] Guard double-click hapus.** `activity-card.tsx` & `pegawai/_client.tsx`: `handleDelete`
   kini idempoten (`if (removing) return;`) + tombol "Ya, Hapus" `disabled` selama jendela
   collapse-out 200ms — klik kedua tidak lagi memicu mutasi/toast duplikat (pola mengikuti guard
   approve di `pimpinan/approval/_client.tsx`).
3. **[P3] Unused import sisa penggantian ikon dihapus (5)** — `ChevronUp` + `XCircle`
   (`ketua_tim/rk/[id]`), `ChevronUp` (`pegawai/ckp/[id]`), `XCircle` (`penilaian/[upload_id]`),
   `ChevronUp` (`pimpinan/monitoring-penilaian`); warning eslint kembali ke baseline.
4. **[P3] Celah 12px accordion Sub-RK (`rk-management-view`).** `mt-3` dipindah dari wrapper
   `.motion-collapse-wrap` (margin wrapper bocor 12px saat panel tertutup) ke konten di dalamnya
   yang ikut ter-collapse — tertutup = gap 0, terbuka = tetap 12px. Diverifikasi empiris di
   headless Chrome: margin di direct child mematahkan collapse, margin/padding di konten dalam
   tidak.
5. **[P3] a11y Dialog (`dialog.tsx`).** `DialogTitle` kini mendaftarkan id-nya lewat context
   (`labelledById`) dan container `role="dialog"` otomatis memakai `aria-labelledby` ke judul;
   modal `ketua_tim` memakai id eksplisit `mark-entry-modal-title` (parity dengan modal lama).
   Dialog tanpa `DialogTitle` (4 modal `admin/pegawai`) tidak diberi label menggantung.
6. **[P3] `animateEnter` benar-benar opt-in.** Default di `charts.tsx` diubah `true` → `false`
   (framing di butir Fase 3 dikoreksi); `analitik/_client.tsx` — satu-satunya pemakai yang memang
   meminta animasi per SPEC §E — kini pass `animateEnter` eksplisit di ketiga komponen.
7. **[P3] Koreksi apendiks `stat-card.tsx`.** Kalimat Fase 3 yang menyebut `stat-card.tsx` ikut
   diselaraskan di gelombang 2 **keliru** — verifikasi `git log` menunjukkan file itu tidak pernah
   tersentuh commit motion (sentuhan terakhir = commit tema, di luar scope motion); daftar file
   Fase 3 dikoreksi.

**Keputusan sadar koordinator (dipertahankan, tidak diubah):**
- (a) Badge notifikasi tetap pop saat muat-pertama 0→N (sekali, halus, informatif — C9 #4).
- (b) Dua layer blur sisa dipertahankan: `filter-loading.tsx` `blur(2px)` (FetchingOverlay) &
  `sidebar.tsx` `backdrop-blur-sm` (scrim drawer mobile) — intermiten, area kecil, tidak muncul
  bersamaan.

**Verifikasi ronde ini:** `npx tsc --noEmit` → 0 error; eslint 10 file terkait: 0 error baru
(51→51 error; warning 47→42 — 5 unused hilang); `npm run build` → hijau (exit 0, tanpa pipe,
22/22 static pages). Catatan: exit-animation modal tetap belum diverifikasi live (halaman
terautentikasi) — jaminan = pola referensi `penilaian/[upload_id]` yang sudah benar + tsc/build.

---

## Implementasi Tier Ekspresif P0 (gelombang 3)

> Diisi oleh pelaksana gelombang 3 (branch `feat/motion-ux`). Kontrak = `design/MOTION-SPEC-EXPRESSIVE.md`
> (addendum). Ruang lingkup = **item P0 saja** (§F2 P0-1…P0-5) + token §C + blok reduced-motion §D.
> P1–P2 **tidak** dikerjakan (gelombang berikutnya). Wiring navigasi (View Transitions:
> `page-transition.tsx`, `template.tsx`, `next.config.ts`) **tidak disentuh** sesuai permintaan
> koordinator (diagnosis mekanisme navigasi berjalan paralel).

### Yang selesai (nilai persis addendum)

| # | Item | Implementasi | File |
|---|---|---|---|
| P0-1 | §B-1 VT halaman (nilai saja) | enter fade + rise **14px** + **scale 0.992→1** **260ms**; exit fade + naik **8px** **170ms** via keyframe baru `pageExit`; fallback `.motion-page-enter` pakai token `--duration-enter` | `globals.css` |
| P0-2 | §B-2 stagger/entrance kartu | `fadeUp` travel **16px** (`--motion-rise-card`), **260ms**, step **65ms** (cap 6 → delay akhir 390ms, total ±650ms); timer `useStaggerOnce` **800ms** | `globals.css`, `lib/motion.ts` |
| P0-3 | §B-3 hover lift kartu | lift **-4px**, transform **240ms** `--ease-out-strong`, shadow tetap 300ms, **border → `--border-hover`**; `ui/card.tsx` pakai kelas `.card-hover` | `globals.css`, `ui/card.tsx` |
| P0-3 | §B-4 tekan tombol | scale **0.96** seragam; masuk **100ms** `--ease-out-strong` (`--duration-press-in`), lepas **180ms** `--ease-apple`; `--duration-press` **tetap 120ms** | `globals.css`, `ui/button.tsx`, `lib/motion.ts` |
| P0-4 | §B-5 dialog spring | panel `SPRING.settle {400, 24, mass 1}` + scale **0.94→1**; exit scale→**0.96** **170ms** apple; backdrop **black/50** enter **220ms** / exit **170ms** | `ui/dialog.tsx`, `lib/motion.ts` |
| P0-5 | §B-7 indikator sidebar geser | satu elemen `.sidebar-indicator` per track (`[data-nav-track]`) yang meluncur via `transform` terukur, **3×24px**, **280ms** `--duration-glide`, re-measure **200ms**, penempatan pertama lompat instan | `layout/sidebar.tsx`, `globals.css` |
| — | §C token & konstanta | §C1: `--duration-enter` 260ms, `--duration-exit` 170ms, `--duration-panel-enter` 280ms, `--motion-rise` 14px, `--motion-rise-sm` 8px, `--stagger-step` 65ms. §C2: `--motion-rise-card` 16px, `--duration-press-in` 100ms, `--duration-glide` 280ms. §C3: `MOTION.pressIn` 100, `MOTION.enter` 260, `MOTION.panelEnter` 280, `MOTION.exit` 170, `SPRING.settle`; `useStaggerOnce` 800ms | `globals.css`, `lib/motion.ts` |
| — | §D reduced-motion | anak `.stagger`/`.card-list` → **fadeIn 120ms** (celah ditutup: tidak lagi translate 16px); press `:active` → tanpa transform; `.sidebar-indicator`/`.motion-glide` → lompat instan; `.motion-check-draw` disiapkan (P2) | `globals.css` |

### Temuan smoke (prod lokal port 3001, sesi login nyata) & perbaikannya

1. **Lapisan NEUMORPHISM menimpa nilai eksekutif §B-3/§B-4.** Blok soft-UI di akhir `globals.css`
   menulis `transform: translateY(-2px)` pada `.kpi-card/.activity-card/.pegawai-card:hover` dan
   `translateY(1px)` pada `.btn-primary/.btn-secondary:active` — menang karena berada paling akhir →
   lift **-4px** & press **scale 0.96** tidak akan pernah terlihat. Transform dihapus dari lapisan
   soft-UI (single source = blok motion §B-3/§B-4); shadow neu/cekung tetap.
2. **ResizeObserver tidak melaporkan track `display:none` → visible.** Terbukti di Chrome (0 callback
   saat viewport melewati breakpoint `lg`) → indikator tak muncul di rail yang baru terlihat.
   Ditambah pemicu `window.resize`.
3. **Perubahan tinggi item saat webfont swap tak terdeteksi.** Saat submenu tertutup (track ter-clip
   tinggi 0), tinggi item berubah setelah Poppins dimuat tanpa mengubah ukuran track → penempatan
   stale (indikator meleset ±6px). Ditambah observasi container item (`[data-nav-track-items]`).
4. **Tailwind v4 memakai properti `scale`, bukan `transform`.** Utility `active:scale-[…]` menulis
   `scale: .96`: (a) press tidak teranimasi karena `scale` tak ada di daftar transisi, dan (b) aturan
   RM `transform: none` (§D #4) tidak menjangkaunya; `scale: … !important` dari `globals.css` juga
   **dibuang minifier CSS Next** (lightningcss menggabungkannya menjadi `transform: scale(1)`).
   Solusi: tombol primitif §B-4 memakai `[transform:scale(0.96)]` + easing di daftar transisi →
   `transform: none` RM berlaku penuh (terverifikasi live).

### Verifikasi (dijalankan di tree final)

- `npx tsc --noEmit` → **0 error**; `npm run build` (`next build --webpack`) → **hijau, exit 0**
  (✓ Compiled successfully, 22/22 static pages).
- eslint file yang disentuh → **0 error baru** (`sidebar.tsx` 7 warning baseline; lainnya 0).
- Smoke produksi `next start -p 3001` (dev server pemilik di :3000 **tidak disentuh**):
  - VT halaman: `pageEnter` **260ms** + `pageExit` **170ms** teramati sebagai animasi pseudo-element
    (`::view-transition-new/-old`) saat navigasi.
  - Indikator sidebar: posisi pas (selisih pusat vs item **-0,07px**), `3×24px`, `left:12px` di track
    submenu; navigasi antar item → transisi `transform: 280ms` teramati (9px → 16,8 → … → 55px),
    termasuk setelah viewport melewati breakpoint (fix #2) dan saat submenu dibuka (fix #3).
  - Dialog: skala panel **0.94 → 1**, overshoot puncak **1,00568** (≈ +0,57% ≈ "overshoot ~0,6%"
    addendum), settle ±350ms; backdrop `bg-black/50` dengan animasi opacity **220ms**.
  - Hover kartu `.card-hover`: `translateY(-4px)` + border `--border-hover`; transisi
    `box-shadow 300ms / border-color 300ms / transform 240ms`.
  - Press tombol: `scale(0.96)`, durasi **0.1s** (`--duration-press-in`) + `--ease-out-strong`;
    lepas 180ms `--ease-apple`.
  - **Reduced-motion (emulasi CDP)**: anak `.stagger` → `fadeIn 120ms` (bukan translate), indikator
    `transition: none`, press `transform: none`, hover kartu `transform: none` (border-color tetap),
    VT `pageEnter/pageExit` **0ms**, dialog tanpa scale (opacity tetap berjalan).

### Deviasi / keputusan (untuk koordinator)

1. **`pageEnter` menyertakan `scale(0.992)`.** Addendum menamai hanya satu keyframe baru (`pageExit`)
   dan scale VT tidak bisa dipasang tanpa keyframe, jadi scale masuk ke keyframe bersama `pageEnter`
   sehingga `::view-transition-new(.page-enter)`, fallback `.motion-page-enter`, **dan**
   `.motion-rise-in` (kartu login — konsumen keyframe yang sama, §C1) mendapat scale 0.992.
   Untuk kartu login efeknya praktis tak terlihat (0,8% skala, 280ms). Dial §C4 ("scale VT … 1 = mati")
   tetap berlaku.
2. **Dua elemen indikator per rail** (track nav utama + track submenu), bukan satu elemen yang pindah
   antar keduanya: §B-7 hanya memutar `translateY`+`height`, sedangkan submenu ber-indent (`pl-3`)
   sehingga x berbeda. Indikator submenu otomatis tak terlihat saat submenu tertutup (ter-clip grid 0fr).
3. **Durasi literal yang memang tak punya token** (dipakai persis seperti addendum): transform hover
   kartu **240ms** (§B-3) dan enter backdrop dialog **220ms** (§B-5 — `--duration-panel-enter` naik ke
   280ms untuk panel non-dialog).
4. **`MOTION.enter` 210 → 260** (cermin token `--duration-enter`) walau saat ini tanpa konsumen, agar
   file konstanta tetap jujur sebagai cerminan token.
5. **Token/konstanta P1–P2 sengaja belum ditulis** (menunggu konsumen): `--duration-pop`,
   `--motion-pop-scale`, `MOTION.pop`, `MOTION.countUp`, `SPRING.glide` — menghindari token mati.
   `SPRING.glide` (opsional §C3) juga tidak dipakai karena indikator memakai transisi CSS `transform`,
   bukan framer (larangan `layoutId`/layout-projection).
6. **`.motion-indicator-in` kini tanpa pemakai** (span indikator per-item dihapus dari sidebar). Kelas
   + aturan reduced-motion-nya dibiarkan karena disebut §D #12; kandidat pembersihan setelah P2.
7. **Glide antar route-group belum terlihat**: tiap route-group punya `layout.tsx` sendiri sehingga
   `<Sidebar>` remount saat pindah group (indikator ikut mount ulang → lompat, bukan meluncur). Di dalam
   satu group (`/pegawai/*`) glide berjalan. Ingin glide lintas group? Perlu keputusan memindahkan
   `<Sidebar>` ke root layout — di luar scope P0 (menyentuh wiring).
8. **Celah sisa (bukan regresi baru, dicatat):** tombol lama di file halaman yang memakai
   `active:scale-[0.97/0.98]` Tailwind (mis. `admin/pegawai`, `pimpinan/approval`, `pegawai/upload`,
   `status-filter`) tetap memakai properti `scale` → getaran press masih berjalan pada reduced-motion
   dan tidak ikut `--duration-press-in` (properti `scale` tak ada di daftar transisinya). Tombol
   primitif (`ui/Button`, `.btn-primary`, `.btn-secondary`) sudah bersih. Menyeragamkan seluruh tombol
   = kandidat gelombang berikutnya.
9. **Belum diverifikasi live**: halaman per-role lain (admin/pimpinan/ketua_tim) di luar alur
   `/pegawai/*` yang diuji; Safari/Firefox/Edge (hanya Chrome tersedia); penilaian visual subjektif
   ("kesan 10 detik pemakaian normal") = checkpoint pemilik (§F2 no.5).

### Sisa gelombang berikutnya (P1–P2, belum dikerjakan)

- **P1:** count-up KPI (§B-10), submenu hidup (§B-8: expand 240ms, chevron 220ms, stagger item 25ms),
  toast slide (§B-6), glide segmented & underline (§B-9 — kelas `.motion-glide` sudah disiapkan di blok
  reduced-motion).
- **P2:** bar grow (§B-11), pop badge/check/allScored (§B-12/13 — kelas `.motion-check-draw` sudah
  disiapkan di blok reduced-motion), "Tersimpan" rise 8px (§B-14), exit baris -8px + batch 60ms
  (§B-15), float login ±8px/9s (§B-16).
