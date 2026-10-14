# MOTION SPEC EXPRESSIVE — Addendum Tier Ekspresif (SIKAP)

> **Status: USULAN — belum diimplementasi.** Ditulis sebagai jawaban atas feedback pemilik setelah
> mencoba branch `feat/motion-ux`: *"kenapa gua gak merasakan perbedaan yang gimana-gimana ya"*.
> Diagnosis: kode terpasang benar (server user menyajikan versi baru — terbukti dari HTML/CSS),
> setting animasi OS normal → **masalahnya motif motion yang terlalu kalem/terlalu halus**.
>
> Dokumen ini adalah **addendum** `design/MOTION-SPEC.md` (bukan pengganti): semua prinsip (§A),
> gate frekuensi, guardrail G1–G5, dan pola yang tidak disebut di sini **tetap berlaku apa adanya**.
> Untuk item yang disebut di sini, nilai di SPEC §B/§C **digantikan** (hanya untuk item tersebut).
> Kontrak 4 token lama (`--ease-apple`, `--ease-spring`, `--duration` 300ms, `--duration-fast` 180ms)
> **tidak diubah** — tier ini memutar token durasi/jarak ekstensi + menambah 4 token baru.
>
> Konteks tetap: aplikasi kerja instansi BPS. Tier ekspresif = **"terasa dalam 10 detik pemakaian
> normal pertama"**, bukan "landing page startup". Tanpa library baru (framer-motion v12 & CSS token
> yang ada). Semua nilai tunable lewat token (§C-3 "dial cepat").

---

## A. PRINSIP TIER EKSPRESIF

### A1. Empat pilar (alasan mengapa tier lama tidak terasa)

1. **Amplitudo dinaikkan 2–3×, durasi hanya +20–30%.**
   Persepsi gerak ∝ jarak × kecepatan. Menaikkan durasi saja = aplikasi terasa lambat (anti-pattern §A2
   lama); menaikkan **jarak** (rise, lift, scale, travel) = gerak terlihat tanpa terasa menunggu.
2. **Elemen yang "berpindah" (traveling), bukan hanya muncul/hilang.**
   Tanda tangan visual aplikasi modern yang paling murah & paling kerasa: indikator aktif sidebar yang
   **meluncur** antar item, highlight segmented/tab yang **menggeser**, angka KPI yang **berhitung**,
   bar yang **tumbuh**. Ini yang membedakan "ada fade" dari "hidup".
3. **Spring hanya di momen sesekali — tanpa bounce ramai.**
   Dialog/toast/pop memakai spring velocity (settle cepat, overshoot ≤ ~1% skala), bukan pantulan
   mainan. Bounce/overshoot besar tetap **hanya** di daftar momen langka (§B-12).
4. **Budget delight diperluas dari 5 → 8 momen, tetap terdaftar.**
   Di luar daftar: tetap **tidak ada** delight (anti-slop §A lama tetap berlaku).

### A2. Yang SENGAJA tetap subtle (jangan dinaikkan)

| Area | Tetap seperti sekarang | Alasan |
|---|---|---|
| Command palette: buka/tutup 160/120ms, item arrow/hover/Enter | **Nol perubahan** | Frekuensi 100+×/hari → gate §A: "tanpa animasi, titik" |
| Keyboard flow penilaian (Enter antar-skor), navigasi arrow, sort tabel | Nol animasi | Sama — beban kognitif |
| Hover baris tabel, hover warna item sidebar | Color-only 120–180ms | Dilihat puluhan×/hari; gerak di sini = bising |
| Skeleton shimmer, spinner, TopLoader, FetchingBar | Nilai existing | Feedback loading, bukan delight |
| Hover item sidebar (glide antar item) | **Tidak dibuat** | Hover ratusan×/hari; highlight yang mengejar kursor = mainan. Cukup indikator aktif yang meluncur (§B-7) |
| Drawer mobile, exit semua panel | Durasi exit tetap < enter (±60–65%) | Pelajaran §A3 lama — exit lambat = rasa lag |
| Print/export/screenshot (`#export-*`, `data-motion="none"`) | Nol motion baru | Guardrail G4 tetap utuh |

### A3. Aturan konversi (batas yang disepakati di tier ini)

- Durasi interaktif maksimum **≤ 350ms** (enter modal); halaman/entrance bertahap ≤ **650ms** (hanya
  paint pertama, konten langsung interaktif); count-up angkat ≤ **650ms** (teks, bukan gerak UI).
  Pengecualian lama tetap: hold sukses upload 800ms, float login (loop lambat).
- Rasio exit : enter selalu **≤ 65%**.
- Hanya `transform`/`opacity` (+ `stroke-dashoffset` untuk draw-in & `grid-template-rows` yang sudah
  diizinkan). **Satu pengecualian baru**: `width` pada **indikator geser** (elemen absolute di dalam
  toolbar kecil) — dampak layout lokal 1 elemen, pola yang sudah dipakai underline tab
  `admin/rk/import` (`page.tsx:283`, `transition-[transform,width]`) dan pengecualian sidebar collapse
  di G2.
- Tidak menambah easing baru; spring/overshoot memakai `--ease-spring` & `SPRING.*` yang ada (+1 preset
  baru `settle`).
- Setiap item §B **wajib** punya mapping reduced-motion (§D) — tanpa kecuali.

---

## B. TABEL PERUBAHAN PER POLA (SEKARANG → USULAN)

Kolom **Dampak** = perkiraan persepsi di pemakaian normal pertama; **P** = prioritas (§F).

| # | Pola (anchor) | Sekarang | Usulan (persis) | Alasan (1 baris) | Dampak | P |
|---|---|---|---|---|---|---|
| 1 | **Transisi halaman VT** — enter `::view-transition-new(.page-enter)` + exit old (`globals.css:1431-1436`) | fade + rise **6px**, **210ms** `--ease-out-strong`; exit **fade saja 150ms** | Enter: fade + rise **14px** + **scale 0.992→1**, **260ms** `--ease-out-strong`. Exit: fade + **translateY(-8px)** (naik), **170ms** `--ease-apple`. Keyframe baru `pageExit` | Travel 2,3× + arah keluar membuat "konten bertukar", bukan berkedip | **Tinggi** (tiap navigasi) | P0 |
| 2 | **Stagger list/kartu** — `.stagger`/`.card-list` (`globals.css:654-668`), keyframe `fadeUp` (`:429-432`) | translateY **12px**, **210ms**, step **50ms**, cap 6 (delay 300ms) | translateY **16px** (`--motion-rise-card`), **260ms**, step **65ms**, cap tetap 6 → delay akhir **390ms** (total selesai ±650ms) | Entri bertahap yang benar-benar terbaca sebagai "berdatangan" | **Tinggi** (tiap buka halaman) | P0 |
| 3 | **Hover kartu** — `.kpi-card/.activity-card/.pegawai-card/.card-hover` (`globals.css:683-691, 699-708, 977-984, 1072-1078`) + `ui/card.tsx:9` | lift **-2px** + shadow, transform **300ms** `--ease-apple` | lift **-4px** + shadow tetap 300ms; transform **240ms** `--ease-out-strong`; **+ border-color → `var(--border-hover)`** | 2× jarak + settle lebih cepat = lift jelas terbaca | **Tinggi** (semua halaman) | P0 |
| 4 | **Tekan tombol** — `ui/button.tsx:6`, `.btn-primary/.btn-secondary` (`globals.css:908-910, 931-934`) | scale **0.97** (ui) / **0.98** (btn) transisi 180ms dua arah | scale **0.96** seragam; masuk (**:active**) **100ms** `--ease-out-strong` (`--duration-press-in`); lepas **180ms** `--ease-apple` | Feedback taktil "masuk" tanpa goyang | Sedang–Tinggi (tiap klik) | P0 |
| 5 | **Dialog/modal** — `dialog.tsx:160-176` (spring) + backdrop | panel fade + scale **0.97**, tween **220ms**; exit scale→**0.98** 150ms; backdrop **black/40** fade 180/150ms | panel fade + scale **0.94** + **`SPRING.settle {stiffness 400, damping 24, mass 1}`** (ζ≈0.6, settle ≤350ms, overshoot ~0,6% skala); exit scale→**0.96** **170ms** apple; backdrop **black/50**, enter **220ms** / exit **170ms** | Amplitude + spring halus = momen "mahal"; backdrop lebih terasa | **Tinggi** (modal sering dibuka) | P0 |
| 6 | **Toast (sonner)** — override `node_modules/sonner` base (`--y: translateY(100%)`, `transform 400ms`) di `globals.css` | travel **100%** tinggi toast, **400ms** easing default | travel **130%** (`--y`), transform **320ms** `--ease-out-strong`, opacity 240ms; exit transform **260ms**. Di-gate `@media (prefers-reduced-motion: no-preference)` | Slide masuk lebih panjang & berkecepatan; toast jadi "menyusul" dari kanan-atas | Sedang | P1 |
| 7 | **Indikator aktif sidebar — GESER** — `sidebar.tsx:400,454`, `indicatorIn` (`globals.css:488-492, 554-556`) | Span 3×20px **muncul di tempat** (scaleY 0.6→1, 120ms); tidak pernah berpindah | **Satu elemen indikator per rail** yang **meluncur** antar item: transform translateY + height terukur, **280ms** `--ease-out-strong` (`--duration-glide`); ukuran **3×24px**; re-measure saat collapse/submenu berubah (durasi 200ms); reduced-motion → lompat instan. Opsi framer `{stiffness 420, damping 32}` bila ingin rasa spring | Elemen navigasi paling sering dilihat: bergerak = aplikasi "hidup" | **Tinggi** (nav-heavy) | P0 |
| 8 | **Submenu Dashboard** — `motion-collapse-wrap` (`globals.css:632-643`), chevron `sidebar.tsx:359` | grid-rows **180ms**; chevron 180ms; item submenu tanpa animasi | expand **240ms** `--ease-out-strong`; chevron **220ms** apple; **item submenu masuk fade + translateX(-8px→0) 200ms, stagger 25ms/item (maks 4 step)** hanya saat dibuka | Submenu terasa "terurai", bukan membuka kaku | Sedang | P1 |
| 9 | **Glide segmented & underline** — `.view-toggle` (`globals.css:791-821`), underline tab import (`admin/rk/import/page.tsx:280-286`) | active swap instan (color 180ms); underline slide 180ms | view-toggle: **highlight geser 260ms** `--ease-out-strong` (satu elemen absolute, width lokal); underline tab import: **180 → 260ms** | Perpindahan pilihan terlihat mengalir (signature modern) | Sedang | P1 |
| 10 | **Count-up KPI** — `KPICard` (`kpi-card.tsx`), dipakai pegawai/ketua_tim/pimpinan/penilaian | Angka tampil statis | Komponen `CountUp` + hook: 0→nilai **650ms** `EASE.outStrong`, `Intl.NumberFormat('id-ID')`, `tabular-nums` (sudah); mulai saat **data pertama tersedia**; refetch/update berikutnya instan; non-numerik dilewati | Angka = elemen pertama yang dilihat; berhitung = terasa hidup, tetap akurat | **Tinggi** | P1 |
| 11 | **Bar/meter grow dashboard pegawai** — `.motion-progress` (`pegawai/_client.tsx:151`, `ckp/[id]/_client.tsx:328`, `activity-card.tsx:151`) | Tanpa grow saat mount (hanya transisi nilai 480ms) | `.motion-bar-grow` (480ms) pada **8 bar pertama** saat paint pertama; **dilarang** di dalam `#export-*` (`pegawai-card.tsx` tetap tanpa motion — G4) | Bar "tumbuh" = progres terbaca sebagai pencapaian | Sedang | P2 |
| 12 | **Pop badge/sukses/allScored** — `.motion-pop` (`globals.css:478-481, 548-550`), `notification-bell.tsx:209`, `penilaian:1066` | scale **0.92→1**, **180ms** `--ease-spring` | scale **0.86→1** (`--motion-pop-scale`), **240ms** (`--duration-pop`), easing `--ease-spring` tetap | Pop terlihat jelas di ekor pandangan, tetap ≤1 momen/alur | Sedang | P2 |
| 13 | **Checkmark draw (BARU)** — momen sukses upload/approve/simpan | Tidak ada (check muncul statis via pop) | `stroke-dashoffset` draw **320ms** `--ease-out-strong` → settle + pop; reduced-motion → langsung tampil | "Berhasil" yang memuaskan, sekali per alur | Sedang | P2 |
| 14 | **Status "Tersimpan"** — `.motion-status-fade` (`globals.css:573-576`) | fade **150ms** | fade + rise **8px→0** **170ms** (`--duration-exit`) `--ease-out-strong` (pakai keyframe `alertIn` yang ada) | Teks status "datang", bukan berkedip | Rendah–Sedang | P2 |
| 15 | **Exit baris/kartu (hapus/approve)** — `collapseOut` (`globals.css:483-486`), batch `pimpinan/approval` | translateY **-4px** + fade 200ms; batch stagger 40ms | translateY **-8px** (`--motion-rise-sm`) + fade 200ms tetap; batch stagger **60ms** | Item yang pergi lebih jelas "terangkat keluar" | Sedang | P2 |
| 16 | **Float panel login** — `.motion-float` (`globals.css:558-566`) | ±5px / 7s | ±8px / 9s (opsional, hanya bila tidak mengganggu) | Amplitudo lebih terbaca, tempo tetap tenang | Rendah | P2 |
| 17 | **Drawer mobile + scrim** — `sidebar.tsx:565-575` | enter 300ms / exit 250ms `--ease-drawer`; scrim 180/150ms | **Tidak diubah** (sudah terasa & proporsional) | — | — | — |

Catatan implementasi tabel:
- **#2**: `useStaggerOnce` (`src/lib/motion.ts:81`) — timer kelas `card-list` **700 → 800ms** agar > total stagger baru (390+260=650ms).
- **#3**: `ui/card.tsx` ganti Tailwind `hover:-translate-y-0.5` → kelas `.card-hover` (satu sumber + otomatis ikut blok reduced-motion).
- **#4**: trik dua durasi: default transition = **lepas** (180ms apple); `:active { transition-duration: var(--duration-press-in) }` = **masuk** (100ms).
- **#5**: `MOTION.panelEnter` tetap dipakai panel non-dialog (`.motion-panel-in` upload, `.motion-rise-in` login) → tokennya **220 → 280ms**.
- **#7**: pengukuran via ref + `ResizeObserver`/`rAF` sekali per perubahan; **jangan** `layoutId`/layout-projection framer untuk menghindari konflik transisi `width` collapse (TECH §4.5 no.3) — kecuali memilih varian spring opsional dengan teknik yang sama (transform terukur, bukan proyeksi).

---

## C. TOKEN — DIUBAH & BARU

### C1. Nilai token diubah (nama tetap, kontrak lama utuh)

| Token | Sekarang | **Usulan** | Dampak konsumen (periksa semua) |
|---|---|---|---|
| `--duration-enter` | 210ms | **260ms** | `::view-transition-new(.page-enter)`, `.stagger > *`, `.card-list > *` |
| `--duration-exit` | 150ms | **170ms** | `.motion-panel-out`, `.motion-overlay-out`, exit VT halaman, `.motion-status-fade`→#14 (rasio tetap < enter) |
| `--duration-panel-enter` | 220ms | **280ms** | `.motion-panel-in` (modal upload), `.motion-rise-in` (kartu login) |
| `--motion-rise` | 6px | **14px** | `pageEnter` (VT halaman, fallback `.motion-page-enter`, `.motion-rise-in`) |
| `--motion-rise-sm` | 4px | **8px** | `dropdownIn` (bell), `alertIn`, exit baris (`collapseOut`), slide item submenu |
| `--stagger-step` | 50ms | **65ms** | jeda anak `.stagger`/`.card-list` (cap 6 anak tetap) |

Tidak diubah: `--ease-*` (semua), `--duration` 300ms, `--duration-fast` 180ms, `--duration-slow`
480ms, `--duration-row-out` 200ms, `--duration-drawer-out` 250ms, dan **`--duration-press` 120ms**
(token ini dipakai exit dropdown/palette — SPEC §C1/§C5 menetapkan 120ms; jangan ikut berubah,
press-in tombol memakai token baru di §C2).

### C2. Token baru

| Token | Nilai | Pakai untuk |
|---|---|---|
| `--motion-rise-card` | **16px** | travel item/kartu pada keyframe `fadeUp` (#2) |
| `--duration-press-in` | **100ms** | press-in tombol (#4) — terpisah dari `--duration-press` 120ms (exit dropdown/palette) |
| `--duration-glide` | **280ms** | indikator sidebar, highlight view-toggle, underline tab (#7, #9) |
| `--duration-pop` | **240ms** | `.motion-pop` & pop delight (#12) |
| `--motion-pop-scale` | **0.86** | skala awal `motionPop` (badge/check/allScored); boleh di-override per kasus via inline var |

### C3. Konstanta JS — `src/lib/motion.ts`

| Konstanta | Sekarang | Usulan |
|---|---|---|
| `MOTION.press` | 120 | **120 (tidak berubah** — dipakai timer exit palette `command-palette.tsx:226` & bell `notification-bell.tsx:78`, sinkron `--duration-press`) |
| `MOTION.pressIn` | — | **100** (baru — press-in tombol) |
| `MOTION.panelEnter` | 220 | **280** |
| `MOTION.exit` | 150 | **170** |
| `MOTION.pop` | — | **240** (baru) |
| `MOTION.countUp` | — | **650** (baru) |
| `SPRING.settle` | — | **`{ type:'spring', stiffness: 400, damping: 24 }`** (baru — dialog; ζ≈0.6) |
| `SPRING.glide` (opsional) | — | `{ type:'spring', stiffness: 420, damping: 32 }` (varian indikator versi framer) |
| `useStaggerOnce` timer | 700ms | **800ms** |

`SPRING.crisp/soft/pop` **tidak diubah**.

### C4. "Dial cepat" — memutar intensitas naik/turun tanpa membongkar pola

| Mau lebih… | Putar token |
|---|---|
| Semua entrance lebih berasa | `--duration-enter` (260→300) + `--motion-rise-card` (16→20px) |
| Ritme stagger | `--stagger-step` (65→80ms) — ingat naikkan timer `useStaggerOnce` |
| Lift hover lebih dramatis | nilai translateY `-4px` di blok kartu (dan `--motion-rise-sm`) |
| Halaman terasa lebih "Travel" | `--motion-rise` (14→18px) + `--duration-enter`; scale VT (0.992 → 0.99 atau 1 = mati) |
| Pop lebih hidup | `--motion-pop-scale` (0.86→0.8) + `--duration-pop` |
| Turunkan kembali (mode tenang) | `--stagger-step` 50ms, `--motion-rise` 6px, `--motion-rise-card` 12px, `--motion-rise-sm` 4px — struktur tidak berubah |

---

## D. REDUCED-MOTION MAPPING PER ITEM (wajib, per baris §B)

| # | Item | Perilaku `prefers-reduced-motion: reduce` |
|---|---|---|
| 1 | VT halaman | Sudah dinolkan blok VT existing (`::view-transition-*` `animation-duration: 0s`) — **tetap**; fallback `.motion-page-enter` → fadeIn 100ms linear |
| 2 | Stagger list | Delay → 0 (existing) **+ perbaiki**: `.stagger > *, .card-list > *` juga `animation: fadeIn 100ms linear` (sekarang mereka masih translate 12px — celah yang ditutup; naik ke 16px tanpa perbaikan ini = pelanggaran G1) |
| 3 | Hover lift | Existing blok mematikan `transform` untuk `.kpi-card/.activity-card/.pegawai-card/.card-hover`; `ui/card.tsx` ikut lewat kelas `.card-hover` (bukan Tailwind translate lagi) → coverage 100%; border-color tetap (warna, bukan gerak) |
| 4 | Press tombol | Tambah rule: `:active { transform: none }` untuk `button` primitif, `.btn-primary/.btn-secondary`, `.sidebar-nav-item` — feedback warna/opacity tetap |
| 5 | Dialog | `MotionConfig reducedMotion="user"` (sudah terpasang, `motion-provider.tsx`) → framer skip transform/scale, opacity fade tetap; framer memakai nilai final (tidak ada frame tertinggal di skala 0.94) |
| 6 | Toast | Override **di-gate** `@media (prefers-reduced-motion: no-preference)`; blok RM bawaan sonner (`transition:none`) tetap berlaku |
| 7 | Indikator sidebar | `transition: none` → indikator **lompat instan** ke posisi (posisi tetap benar, tanpa gerak) |
| 8 | Submenu | Grid-rows sudah `transition: none` (existing); item submenu → `animation: none` (muncul bersamaan) |
| 9 | Glide segmented/underline | `transition: none` (langsung di posisi baru) |
| 10 | Count-up | Hook `useMotionSafe()` → langsung nilai final |
| 11 | Bar grow pegawai | `.motion-bar-grow` sudah `animation: none` (existing) → langsung penuh |
| 12 | Pop badge/check/allScored | `.motion-pop` sudah `animation: none`; `.motion-indicator-in` juga (existing) |
| 13 | Checkmark draw | Tambah selector kelas draw ke blok RM → ikon tampil utuh tanpa menggambar |
| 14 | "Tersimpan" | Blok RM: `.motion-status-fade` → fadeIn 100ms linear (tanpa rise) — samakan dengan kelas status lain |
| 15 | Exit baris | `.motion-remove` existing → fadeOut 100ms linear |
| 16 | Float login | Existing `.motion-float { animation: none }` — tetap |

Tambahan blok RM yang harus ditulis (ringkas):

```css
@media (prefers-reduced-motion: reduce) {
  .stagger > *, .card-list > * { animation: fadeIn var(--duration-press) linear both !important; }
  .motion-check-draw { animation: none !important; }
  button:active, .btn-primary:active, .btn-secondary:active, .sidebar-nav-item:active { transform: none !important; }
  .motion-glide, .sidebar-indicator { transition: none !important; }
}
```

---

## E. FILE YANG BAKAL TERSENTUH (titik utama saja)

| Area | File | Perubahan |
|---|---|---|
| Sistem | `src/app/globals.css` | Tokens §C1/C2; keyframe `pageExit` baru; `fadeUp`/`motionPop`/`collapseOut`/`dropdownIn` nilai; nilai blok kartu & tombol; rule VT; CSS toast; `.motion-glide` + kelas submenu; blok RM tambahan (§D) |
| Sistem | `src/lib/motion.ts` | `MOTION.pressIn/panelEnter/exit/pop/countUp` (`MOTION.press` tetap 120), `SPRING.settle` (+`glide` opsional), timer `useStaggerOnce` 800ms, hook `useCountUp` |
| Shell | `src/components/layout/sidebar.tsx` | Indikator geser (1 elemen, re-measure), item submenu stagger, chevron 220ms, press nav item |
| Shell | `src/components/ui/dialog.tsx` | Spring settle + scale 0.94/0.96, backdrop black/50, durasi 220/170 |
| Shell | `src/components/ui/button.tsx` | scale 0.96 + durasi press dua arah |
| Shell | `src/components/ui/card.tsx` | `hover:-translate-y-0.5` → kelas `.card-hover` |
| Komponen baru | `src/components/dashboard/count-up.tsx` | Komponen + pemakaian di `kpi-card.tsx` (nilai numerik/strip `nn%`) |
| Halaman (KPI) | `pegawai/_client.tsx`, `ketua_tim/_client.tsx`, `pimpinan/_client.tsx`, `penilaian/[upload_id]/_client.tsx`, `analitik/_client.tsx` | Count-up via KPICard; verifikasi bukan di dalam `#export-*` |
| Halaman (bar) | `pegawai/_client.tsx`, `pegawai/ckp/[id]/_client.tsx`, `components/dashboard/activity-card.tsx` | `.motion-bar-grow` 8 bar pertama (paint pertama) |
| Halaman (glide) | `src/app/admin/rk/import/page.tsx` | Underline 180→260ms |
| Halaman (delight) | `pegawai/upload/page.tsx`, `pimpinan/approval/_client.tsx`, `penilaian/[upload_id]/_client.tsx` | Checkmark draw, batch 60ms, allScored pop |
| Guard | `pimpinan/_client.tsx`, `pimpinan/monitoring-penilaian/_client.tsx` | **Tidak disentuh** — justru titik verifikasi larangan (G4) |

---

## F. RISIKO, MITIGASI & URUTAN IMPLEMENTASI

### F1. Risiko

| Risiko | Mitigasi |
|---|---|
| Terasa **lebih lambat** setelah durasi naik | Kenaikan durasi ≤30%; exit ≤65% enter; keyboard flow tetap nol animasi; uji "kesan 10 detik" dengan pemilik setelah P0 |
| VT scale → teks tampak lembut saat transisi (snapshot) | Scale sangat kecil (0.992) & hanya 260ms; dial: set ke 1 = mati; uji di layar mono/DPI rendah |
| Indikator sidebar: race/ukur ulang saat collapse & submenu | Satu rAF + `ResizeObserver`, tanpa layout-projection; transisi hanya `transform`+`height` elemen absolute; reduced → instan |
| Count-up: angka intermediate di-reader/SSR mismatch | Mulai hanya client-side **saat data pertama tersedia** (setelah hydration); tanpa `aria-live`; nilai final di DOM akhir; `tabular-nums` wajib; **dilarang** di dalam target screenshot/export (capture non-deterministik) |
| Stagger lebih panjang (650ms) dianggap lambat | Hanya paint pertama (`useStaggerOnce`, timer 800ms); cap 6 anak; item pertama muncul instan; tidak diulang saat filter |
| Ekspresif "bocor" ke alur frekuensi tinggi | Checklist §G + grep guardrail existing (SPEC §F) dijalankan ulang |
| Overshoot terasa murah | Overshoot hanya di 4 momen §B-12/13 (+ dialog settle ≤0,6% skala); page/kartu/sidebar/tekan = tanpa overshoot |
| Perubahan token domino (`--duration-enter`, `--duration-exit`) | Daftar konsumen di §C1 diperiksa satu per satu (`--duration-press` sengaja tidak disentuh agar exit palette/bell tetap 120ms); smoke visual per area (6 titik) |
| Override `--y` sonner bentrok antar versi sonner | Gate `no-preference`; fallback = hanya ubah durasi/easing transition (tanpa `--y`) |
| Menambah beban blur/compositing | Tidak ada blur baru; VT/snapshot adalah compositor-level; semua item tetap transform/opacity |

### F2. Urutan implementasi (paling kerasa per effort)

1. **P0-1 — VT halaman (§B-1).** 2 rule + 3 nilai token. Terlihat setiap navigasi. *(≤30 menit)*
2. **P0-2 — Stagger & entrance kartu (§B-2 + timer 800ms).** 1 keyframe + 2 token. Setiap buka halaman. *(≤30 menit)*
3. **P0-3 — Hover lift & press tombol (§B-3, §B-4).** globals + `ui/card.tsx` + `ui/button.tsx`. Terasa di tiap interaksi, risiko nol. *(≤45 menit)*
4. **P0-4 — Dialog spring + backdrop (§B-5).** 1 file. Momen "mahal" pertama yang dirasakan pemilik. *(≤45 menit)*
5. **P0-5 — Indikator sidebar geser (§B-7).** 1 file + CSS. Aplikasi ini nav-heavy — ini kandidat "wow" terkuat. *(≤2 jam)*
   → **checkpoint**: minta pemilik mencoba; putar dial §C4 sesuai selera sebelum lanjut.
6. **P1-6 — Count-up KPI (§B-10).** Komponen baru + 4–5 titik pakai. *(≤2 jam)*
7. **P1-7 — Submenu hidup (§B-8).** *(≤1 jam)*
8. **P1-8 — Toast slide (§B-6) + glide segmented/underline (§B-9).** *(≤1,5 jam)*
9. **P2-9 — Poles: bar grow (§B-11), checkmark draw + "Tersimpan" + pop (§B-12/13/14), exit baris (§B-15), float login (§B-16).** *(≤2 jam)*

Gate tiap tahap: `npx tsc --noEmit` + `npm run build` hijau, audit reduced-motion §D, grep guardrail G4
(`#export-*` bersih dari kelas motion baru), dan smoke visual 6 titik (pindah menu, buka-tutup modal,
klik tombol, hapus item, buka submenu, toast).

---

## G. YANG TIDAK BOLEH IKUT DINAIKKAN (larangan tegas)

1. **Command palette** — enter 160ms / exit 120ms **tidak berubah**; item (arrow/hover/Enter) tetap
   instan. Gate §A: frekuensi 100+×/hari.
2. **Keyboard-first flows** — Enter antar input skor, navigasi arrow, Tab, sort tabel: nol animasi.
3. **Alur print / export / screenshot** — tidak ada motion baru di dalam `#export-pegawai-section` &
   `#export-monitoring-section`; `[data-motion="none"]` dan blok `@media print` **tetap utuh**;
   count-up/bar-grow/checkmark **dilarang** di dalam target capture (angka & stroke berubah =
   hasil non-deterministik).
4. **Loading feedback** — skeleton shimmer 1.8s, spinner tombol, TopLoader, FetchingBar/FetchingOverlay:
   nilai existing, bukan kandidat ekspresif.
5. **Drawer mobile, scrim, header glass, skeleton** — tidak disentuh.
6. **Hover item sidebar & hover baris tabel** — tetap color-only (tidak dibuat bergerak).
7. **Blur** — tidak ada layer blur baru (G3 tetap: maksimum 1 layer aktif).
8. **Easing** — tidak ada easing baru di luar yang terdaftar §C3; bounce/overshoot di luar momen
   §B-12/13 dilarang (page, kartu, sidebar, tombol = tanpa overshoot).
9. **Exit** — tidak boleh lebih lambat dari enter; tidak ada durasi interaktif >350ms (kecuali entrance
   bertahap & count-up ≤650ms pada A3).
10. **Reduced-motion** — tidak ada item yang boleh lolos tanpa mapping §D; perbaikan celah stagger
    (item #2) adalah bagian dari pekerjaan ini, bukan opsional.
