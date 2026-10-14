# MOTION SPEC — SIKAP (BPS Kabupaten Belitung)

> Sistem motion implementable untuk **seluruh** interaksi SIKAP: setiap perpindahan menu, setiap klik
> tombol, setiap buka-tutup panel. Ditulis sebagai kontrak implementasi (Homelander) dan rujukan review.
> **Prinsip ekstensi**: dokumen ini **memperluas** token yang sudah ada di `src/app/globals.css`
> (`--ease-apple`, `--ease-spring`, `--duration: 300ms`, `--duration-fast: 180ms`) — bukan menggantinya,
> bukan sistem paralel. Nilai lama dipertahankan; yang baru hanya menambal celah.
>
> Dokumen pendamping: `design/MOTION-AUDIT.md` (temuan + anchor), `design/MOTION-REFERENCES.md` (rasional).

---

## A. PRINSIP

1. **Motion untuk orientasi & kepercayaan, bukan pamer.**
   Konteks aplikasi kerja instansi: gerakan harus terbaca sebagai "rapi dan cepat", bukan "bermain".
   Tidak ada bounce di alur kerja, tidak ada parallax scroll, tidak ada animasi dekoratif berulang.
   Delight hanya di **momen langka** (sukses upload, persetujuan, first-run) — satu per alur.

2. **Halus itu cepat dan masuk akal.**
   Mikro-interaksi 100–200ms; modal/drawer 200–300ms; maksimum **tidak pernah > 500ms** untuk UI.
   Durasi panjang hanya membuat aplikasi terasa lambat (persepsi > realita).

3. **Setiap masuk punya keluar.**
   Enter dari arah X → exit ke arah X. Exit **selalu lebih cepat** dari enter (≈70–80% durasi).
   Ini perbaikan terbesar yang dibutuhkan SIKAP saat ini (audit §S-1).

4. **Instan untuk frekuensi tinggi.**
   Aksi keyboard-driven dan >100×/hari (Enter antar input skor, ketik di command palette, arrow
   navigation) **tanpa animasi**. Animasi pada frekuensi ini terasa seperti beban kognitif.

5. **Konsistensi > kejutan.**
   Satu bahasa easing, satu skala durasi, satu bahasa skeleton. Token adalah kontrak — nilai
   hardcoded yang menyimpang dianggap defect.

6. **Animasi tidak pernah menahan pengguna.**
   Selalu interruptible: klik kedua = langsung (tidak menunggu animasi selesai); animasi tidak pernah
   memblokir input; konten tidak pernah disembunyikan menunggu gerakan.

7. **Performa dan accessibility sama pentingnya dengan estetika.**
   Hanya `transform`/`opacity` untuk animasi berat, blur hemat, `prefers-reduced-motion` wajib
   (di-ship bersama animasinya, bukan follow-up).

### Gate frekuensi (wajib dijawab sebelum menambah animasi apa pun)

| Frekuensi aksi | Keputusan |
|---|---|
| 100+×/hari (shortcut, Enter antar-skor, command palette, arrow navigation) | **Tanpa animasi. Titik.** |
| Puluhan×/hari (hover item list, expand baris, buka filter) | Nyaris tak terasa: ≤120–180ms, atau tidak sama sekali |
| Sesekali (modal, drawer, dropdown, toast, ganti periode) | Animasi standar (180–300ms) |
| Langka / first-time (sukses upload, approve terakhir, empty-state pertama) | Budget delight ada di sini |

---

## B. TOKEN

### B1. Blok extension (tambahkan ke `:root` di `globals.css`, tepat setelah token timing lama)

```css
:root {
  /* ── EXISTING — DIPERTAHANKAN (nilai jangan diubah) ─────────────── */
  --ease-apple:      cubic-bezier(0.25, 0.1, 0.25, 1);   /* default lama: hover, warna, state kecil */
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);  /* pop mikro — HEMAT, hanya momen langka */
  --duration:        300ms;  /* modal, drawer, expand besar */
  --duration-fast:   180ms;  /* hover, tombol, dropdown, input */

  /* ── EXTEND — BARU (menambal celah; ekstensi dari sistem yang ada) ── */
  --ease-out-strong:    cubic-bezier(0.23, 1, 0.32, 1);   /* entrance & exit elemen */
  --ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);  /* gerakan posisi antar view */
  --ease-drawer:        cubic-bezier(0.32, 0.72, 0, 1);   /* drawer/sheet mobile (rasa iOS) */
  --duration-press:     120ms;  /* feedback tekan tombol */
  --duration-slow:      480ms;  /* progres/width/bar chart (dulu 0.3–0.7s tak seragam) */
  --stagger-step:       50ms;   /* jeda antar anak list (ganti 60ms lama agar konsisten) */
  --motion-rise:        6px;    /* jarak rise konten halaman */
  --motion-rise-sm:     4px;    /* jarak rise menu/dropdown */
}
```

### B2. Tabel mapping LAMA → BARU (semua nilai yang harus diseragamkan)

| Nilai lama (drift) | Lokasi contoh | Nilai baru | Catatan |
|---|---|---|---|
| `transition-all duration-200` (Tailwind 200ms) | 20+ file (`admin/pegawai`, `sidebar`, `pimpinan` dll.) | `transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-[var(--duration-fast)]` | 200→180ms; **nama propertinya spesifik**, bukan `all` |
| `duration-300` ikon mikro | `theme-toggle.tsx:18-19` | `duration-[var(--duration-fast)]` (180ms) | ikon mikro tak butuh 300ms |
| `duration-300` hover kartu | `components/ui/card.tsx:9` | tetap `var(--duration)` via kelas `.card-hover`/CSS | kartu boleh 300ms |
| `duration-300` bar chart | `charts.tsx:388` | `var(--duration-slow)` (480ms) | bar tumbuh, bukan blink |
| `duration-500` progres | `penilaian:1065`, `pegawai/_client.tsx:129`, `upload:1025` | `var(--duration-slow)` (480ms) + `--ease-out-strong` | satu nilai untuk semua progres |
| `.progress-bar { transition: width 0.7s }` | `globals.css:475` | 480ms + `--ease-out-strong`; idealnya `scaleX` (lihat guardrail G2) | |
| inline `fadeIn 0.2s` / `scaleIn 0.25s` | `dialog.tsx:147,154`, `command-palette.tsx:478,486`, `change-password-modal.tsx:101` | kelas bersama baru: `animate-overlay-in` (180ms) / `animate-panel-in` (220ms) via `--ease-out-strong` | satu sumber, bukan inline per file |
| `slideDown` max-height 0→600px | `globals.css:424-427, 511-515` | pola `grid-template-rows: 0fr→1fr` (G2) | perbaikan bug potong konten + jank |
| stagger 60ms | `globals.css:457-462` | `--stagger-step` (50ms) | konsisten dengan `.card-list` |
| spring `380/30` | `route-transition.tsx:134`, `filter-loading.tsx:72` | **dipertahankan** = preset kanonik `spring-crisp` | jangan ganti; pakai sebagai referensi preset lain |

### B3. Preset spring (framer-motion — dipakai hanya bila JS motion diperlukan)

| Preset | Config | Karakter (ζ ≈ damping ratio) | Pakai untuk |
|---|---|---|---|
| `spring-crisp` *(existing)* | `{ type:'spring', stiffness: 380, damping: 30 }` | ζ≈0.77 — settle cepat, overshoot minim | pill loading, overlay fetching (sudah dipakai) |
| `spring-soft` | `{ type:'spring', stiffness: 260, damping: 30 }` | ζ≈0.93 — hampir tanpa overshoot | elemen besar yang bergerak (mis. bar/pill baru) |
| `spring-pop` | `{ type:'spring', stiffness: 500, damping: 28, mass: 0.8 }` | ζ≈0.62 — sedikit "hidup" | HANYA momen langka: check sukses, badge notif |

Aturan: **bounce hanya di `spring-pop`**, dan `spring-pop` hanya di momen langka (≤3 tempat se-aplikasi).
Sisanya CSS transition — lebih murah dan lebih mudah di-reduced-motion.

### B4. Skala jarak (untuk rise/slide)

| Token | Nilai | Pemakaian |
|---|---|---|
| `--motion-rise` | 6px | entrance konten halaman, list item (jangan lebih — ingin "terasa mengalir", bukan melompat) |
| `--motion-rise-sm` | 4px | dropdown/menu/popover |
| translateY(12px) lama (`animate-fade-up`) | — | turunkan penggunaannya: hanya untuk first-run/empty state, bukan setiap render |

### B5. Aturan stagger

- Langkah: `--stagger-step` = **50ms**; **maksimum 6 anak** (anak ke-7+ delay tetap 300ms atau tanpa delay).
- Total delay maksimum: **300ms** — lebih dari itu = pengguna menunggu.
- Stagger **hanya saat mount pertama** (first paint data). Ganti filter/periode **tidak** re-stagger —
  gunakan crossfade list 150ms (audit §K-1, L10).
- Alert kondisional: animasi hanya pada transisi state false→true, bukan tiap re-render.

```css
/* implementasi stagger yang mengikuti aturan (menggantikan .stagger/.card-list lama).
   Cara paling sederhana & benar: delay eksplisit per anak, step dari token. */
.stagger > *:nth-child(1) { animation-delay: calc(0 * var(--stagger-step)); }
.stagger > *:nth-child(2) { animation-delay: calc(1 * var(--stagger-step)); }
.stagger > *:nth-child(3) { animation-delay: calc(2 * var(--stagger-step)); }
.stagger > *:nth-child(4) { animation-delay: calc(3 * var(--stagger-step)); }
.stagger > *:nth-child(5) { animation-delay: calc(4 * var(--stagger-step)); }
.stagger > *:nth-child(6) { animation-delay: calc(5 * var(--stagger-step)); }
.stagger > *:nth-child(n+7) { animation-delay: calc(6 * var(--stagger-step)); } /* cap: 300ms */
```

Delay stagger dinolkan pada `prefers-reduced-motion` (G1 poin 2), sehingga seluruh stagger otomatis
hilang. Ganti nilai 60ms/50ms yang lama dengan token ini di `.stagger` dan `.card-list`
(`globals.css:456-471`).

---

## C. POLA PER JENIS INTERAKSI (nilai persis + contoh)

### C1. Navigasi & pindah menu

**Keputusan besar: pensiunkan overlay scrim+blur `route-transition` untuk navigasi antar halaman.**

Alasan (evaluasi menyeluruh, audited di §S-2):
- Rute di-prefetch (`sidebar.tsx:177-207`) → mayoritas navigasi selesai <150ms → overlay hanya **berkedip**.
- `blur(2px)` layar penuh pada tiap navigasi = compositing GPU penuh di PC kantor kelas bawah.
- TopLoader sudah memberi sinyal; dua indikator untuk satu aksi = bising.

**Penggantinya (2 lapis saja):**

1. **TopLoader** (existing, `layout.tsx:59-69`) — biarkan sebagai satu-satunya indikator bar. Tidak diubah.
2. **Entrance konten halaman** via `template.tsx` per route group (baru):

```tsx
// src/app/(group)/template.tsx  — contoh: src/app/pegawai/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-page-enter">{children}</div>;
}
```

```css
/* globals.css — ditambahkan */
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(var(--motion-rise)); }
  to   { opacity: 1; transform: translateY(0); }
}
.motion-page-enter {
  animation: pageEnter 200ms var(--ease-out-strong) both;
}
@media (prefers-reduced-motion: reduce) {
  .motion-page-enter { animation: pageEnter 120ms linear both; } /* fade saja */
}
```

3. **Pill "Memuat (tujuan)…"** (opsional, hanya jika tetap diinginkan): tampil **setelah delay 300ms**
   sejak klik, **tanpa scrim, tanpa blur** — pill melayang pojok atas konten; hilang saat pathname berubah
   atau 8s. Ini menjaga manfaat feedback lama tanpa biaya kedipan.

**Sisa perilaku navigasi:**

| Elemen | Motion | Nilai |
|---|---|---|
| Sidebar item — hover | transisi warna/bg | `var(--duration-fast)` `--ease-apple` (token yang ada) |
| Sidebar item — aktif (indikator terracotta) | scaleY 0.6→1 + opacity 0→1 saat mount | 120ms `--ease-out-strong` (tidak perlu layout-shared, cukup muncul halus) |
| Submenu Dashboard expand/collapse | `grid-template-rows 0fr ⇄ 1fr` | 180ms `--ease-out-strong`; chevron rotate 180ms `--ease-apple` |
| Mobile drawer | slide translateX, `--ease-drawer` | enter 300ms; exit 250ms; scrim fade 180ms masuk & keluar |
| Sidebar collapse (desktop) | transisi width (layout, 1 elemen — diterima) | 240ms `--ease-apple` (dari 0.25s hardcode `sidebar.tsx:602`) |
| Command palette open | fade + scale 0.98→1, origin atas-tengah | 160ms `--ease-out-strong`; exit 120ms fade-only |
| Command palette item (arrow/hover) | **tanpa transisi** (instant) | ini keyboard-flow 100+×/hari |

```css
/* grid-rows expand — kunci untuk semua accordion di aplikasi */
.motion-collapse-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 180ms var(--ease-out-strong); }
.motion-collapse-wrap[data-open="true"] { grid-template-rows: 1fr; }
.motion-collapse-wrap > * { overflow: hidden; min-height: 0; }
```

### C2. Entrance konten halaman

| Konten | Motion | Nilai |
|---|---|---|
| Wrapper halaman | `pageEnter` (template.tsx) | 200ms `--ease-out-strong`, rise 6px |
| KPI cards (4) | stagger fade+rise | 220ms, step `--stagger-step`, **hanya mount pertama** |
| List/kartu data | stagger maks 6 anak | 50ms/step; setelah itu tanpa delay; **tidak diulang saat filter berubah** |
| Ganti konten via filter/periode (data lama tampil) | **crossfade list** 150ms + `FetchingBar` existing | jangan re-animate; jangan skeleton (keepPreviousData sudah) |
| Skeleton → konten | crossfade 150ms, posisi identik (tanpa layout shift) | skeleton tidak ikut `pageEnter` |

Catatan: `animate-fade-in` pada 20+ wrapper halaman saat ini memberi efek masuk per halaman — setelah
`template.tsx` ada, **hapus** `animate-fade-in` dari wrapper (double animation).

### C3. Tombol (hover / press / loading / sukses)

| State | Motion | Nilai persis |
|---|---|---|
| Hover | transisi warna/bg/shadow (bukan transform) | `140ms` `--ease-apple` |
| Press | `transform: scale(0.97)` (`active:`) | `90–120ms` `--ease-out-strong`; lepas = kembali cepat |
| Loading | spinner **mengganti** ikon kiri (bukan menambah), label tetap, `disabled` tanpa ubah lebar | spinner 800ms/rev linear; tombol tidak bergerak (no layout shift) |
| Sukses | ikon check "pop" + label "Tersimpan" | `180ms` `spring-pop` (atau `.motion-pop` CSS scale .92→1), auto-reset 2 dtk |
| Destructif | tint danger pada hover; press feedback sama | tanpa flash merah penuh, tanpa shake |

```css
.motion-pop { animation: motionPop 180ms var(--ease-spring) both; }
@keyframes motionPop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
```

Pola "Tersimpan" yang sudah ada di `ketua_tim/rk/[id]/_client.tsx:292-301` **dijadikan standar** untuk
semua aksi simpan inline (skor, catatan, toggle): teks status fade 150ms → auto reset 2 dtk.

### C4. Tabel & list

| Interaksi | Motion | Nilai |
|---|---|---|
| Row hover | background-color | 120ms `--ease-apple` (existing `.table-row`) |
| Row masuk (paint pertama) | tanpa animasi per-row (hindari 50 baris × delay) | cukup list crossfade 150ms |
| Row **keluar** (hapus/approve) | collapse tinggi + fade **sebelum** mutasi cache | 200ms `--ease-out-strong`; baru kemudian hapus dari state |
| Expand/collapse row | pola `grid-rows` (C1) | 200ms `--ease-out-strong`; chevron rotate 180ms |
| Search/filter berubah | **tanpa** stagger ulang; row berubah tanpa animasi (instant) | kecuali highlight opsional 400ms bg-flash pada baris yang berubah (hemat, opsional) |
| Sort | instant | — |

Combo motion untuk hapus/approve (pola umum):

```tsx
// pada tombol konfirmasi hapus:
setRemoving(id);                        // → beri kelas motion-collapse-out pada wrapper row/kartu
setTimeout(() => mutate(id), 200);      // mutasi SETELAH collapse selesai (atau optimistic + delay)
```

```css
@keyframes collapseOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-4px); }
}
.motion-remove { animation: collapseOut 200ms var(--ease-out-strong) both; }
```
*(Untuk collapse tinggi penuh: bungkus dengan `grid-template-rows 1fr→0fr` 200ms; untuk daftar panjang
cukup fade+rise keluar — lebih murah dan tetap terasa "pergi".)*

### C5. Modal / dialog / drawer / dropdown / popover

**Aturan emas: enter dan exit berpasangan; exit = ±75% durasi enter; blur maksimal 1 layer.**

| Komponen | Enter | Exit | Catatan |
|---|---|---|---|
| **Dialog (center, tidak anchored)** — mis. konfirmasi, `dialog.tsx` | backdrop fade 180ms; panel fade + scale 0.97→1 **220ms** `--ease-out-strong` | backdrop fade 150ms; panel fade + scale 1→0.98 **150ms** `--ease-apple` | `transform-origin: center` (modal dikecualikan dari origin-trigger rule) |
| **Dropdown/popover (anchored)** — mis. notif bell, menu | fade + translateY(-4px) + scale 0.98→1, origin di trigger (bell = kanan-atas) — **180ms** `--ease-out-strong` | fade saja **120ms** | jangan slide dari center |
| **Drawer (mobile sidebar)** | translateX + `--ease-drawer` **300ms**; scrim fade 180ms | translateX out **250ms**; scrim fade 150ms | ESC & klik scrim = jalur exit sama |
| **Command palette (overlay)** | lihat C1 — 160ms | 120ms | frekuensi tinggi: jangan lebih lambat |
| **Toast (sonner)** | default sonner (biarkan), ±200ms | default | cukup atur durasi (C6) |

Implementasi exit yang andal (tanpa library baru untuk yang sederhana):

```tsx
// Pola state: komponen tetap ter-mount selama exit
const [closing, setClosing] = React.useState(false);
const requestClose = () => {
  if (prefersReducedMotion()) { onClose(); return; }
  setClosing(true);
  setTimeout(onClose, 150);           // = durasi exit
};
// wrapper: className={closing ? 'motion-panel-out' : 'motion-panel-in'}
```

```css
.motion-panel-in  { animation: panelIn 220ms var(--ease-out-strong) both; }
.motion-panel-out { animation: panelOut 150ms var(--ease-apple) both; }
@keyframes panelIn  { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
@keyframes panelOut { from { opacity: 1; transform: scale(1); }    to { opacity: 0; transform: scale(0.98); } }
```

Catatan khusus SIKAP:
- `Dialog` (`dialog.tsx`) dipakai di banyak tempat → cukup tambahkan exit di komponen itu; semua pemakai
  (periode, reopen, approval bulk) langsung ikut standar.
- 4 modal custom admin pegawai (`admin/pegawai/_client.tsx:450/503/559/590`) → migrasikan ke `Dialog`.
- Modal pindah RK (`penilaian:1146`) → migrasikan ke `Dialog` (sekaligus membereskan tombol slate hardcode).

### C6. Toast (sonner)

| Tipe | Durasi | Catatan |
|---|---|---|
| success | 3 dtk | jangan tumpuk >1 untuk aksi yang sama (pakai `id` — sudah dipakai di beberapa tempat) |
| info | 4 dtk | |
| error | 6 dtk (kritis 8 dtk — pattern existing di upload) | error jangan menutup sendiri terlalu cepat bila berisi instruksi |
| loading→selesai | pakai `id` yang sama (sudah dipraktikkan) | spinner→check crossfade bawaan sonner cukup |

Aturan: **jangan toast untuk aksi berfrekuensi keyboard** (mis. setiap save skor sudah punya "Tersimpan"
inline — toast tambahan akan mengganggu). Sonner animations dibiarkan default (sudah halus), hanya
durasi & `id` yang diatur. Style warna sudah selaras via `globals.css:1019-1047`.

### C7. Feedback form & validasi

| Interaksi | Motion | Nilai |
|---|---|---|
| Focus field | border + ring (transisi) | 160ms `--ease-apple` (existing `.neu-field:focus`, `.search-input:focus-within`) |
| Error muncul | fade + rise kecil | 180ms; field border→danger 120ms |
| Error hilang | fade 120ms | — |
| Shake | **JANGAN** (anti-slop di konteks kerja) | — |
| Toggle password (eye) | crossfade ikon | 120ms |
| Disabled | opacity 120ms | — |
| Submit → disabled+loading | lihat C3 | — |

### C8. Skeleton & state loading

| Situasi | Gunakan | Nilai |
|---|---|---|
| First-load list/kartu/tabel | `.skeleton` shimmer (existing, 1.8s) | **satu bahasa skeleton**; hapus `animate-pulse` slate (`approval:357-360`) dan spinner-tengah untuk first-load |
| Refetch/ganti filter (data lama tampil) | `FetchingBar` / `FetchingOverlay` existing | jangan skeleton (tidak ada flash) |
| Aksi in-place (tombol simpan/download) | spinner di dalam tombol | C3 |
| Skeleton→konten | crossfade 150ms | tanpa layout shift |
| Progres (bar/ring) | nilai saja yang bertransisi | 480ms `--duration-slow` `--ease-out-strong` (atau `scaleX`) |

### C9. Micro-delights (anggaran terbatas — hanya di 5 tempat aplikasi)

1. **Upload sukses** — check `spring-pop` + tahan layar 700–900ms sebelum redirect (sekarang 300ms).
2. **Approve/persetujuan** — baris collapse 200ms + toast; batch: baris keluar bertahap 30–50ms.
3. **"Tersimpan"** inline (sudah ada) — standarkan.
4. **Badge notifikasi** — pop saat jumlah naik (`spring-pop`, hanya bila naik, bukan saat turun).
5. **Login panel ilustrasi** — float halus 4–6px / 6–8 detik (loop lambat, mati di reduced motion);
   opsional, hanya kalau tidak terasa mengganggu.

Di luar 5 ini: **tidak ada** delight. Tambahan animasi dekoratif = AI-slop.

---

## D. GUARDRAILS (wajib)

### G1. `prefers-reduced-motion` — daftar persis apa yang dimatikan

Reduced motion = **lebih sedikit dan lebih halus**, bukan nol (transisi yang membantu pemahaman tetap ada).

```css
@media (prefers-reduced-motion: reduce) {
  /* 1) Semua entrance berbasis gerak → fade ≤120ms */
  .animate-fade-up, .animate-scale-in, .motion-page-enter, .motion-pop { animation: none !important; }
  .motion-page-enter { animation: fadeIn 120ms linear both !important; }

  /* 2) Stagger delay → 0 (semua anak muncul bersamaan) */
  .stagger > *, .card-list > * { animation-delay: 0ms !important; }

  /* 3) Hover transform (sudah ada) + tambah list lengkap */
  .kpi-card:hover, .activity-card:hover, .pegawai-card:hover { transform: none; }

  /* 4) Loop dekoratif → mati total */
  .motion-float, .animate-pulse { animation: none !important; }

  /* 5) Accordion/drawer/modal: fade saja, tanpa translate/scale */
  .motion-collapse-wrap { transition: none; }
  .motion-panel-in, .motion-panel-out { animation: fadeIn 120ms linear both !important; }

  /* 6) Skeleton: statis (tanpa shimmer) */
  .skeleton { animation: none; }

  /* 7) Progress: tidak ada animasi nilai — update langsung agar angka tetap akurat */
  .progress-bar, .motion-progress { transition: none; }
}
```

Yang **tetap berjalan** di reduced-motion: spinner loading (feedback esensial), toast masuk/keluar
(bawaan sonner), perubahan warna/hover tint, fokus ring. Yang wajib dicek juga di JS/`framer-motion`:

```tsx
import { useReducedMotion } from 'framer-motion';
const reduce = useReducedMotion();
const offset = reduce ? 0 : '-100%';   // pattern untuk komponen motion
```

Saat ini hanya `globals.css:1224-1231` yang mengakomodasi reduced motion (matikan hover 3 kartu) —
blok di atas menggantikannya.

### G2. Hanya `transform`/`opacity` untuk animasi berat

- **Dilarang menganimasikan**: `width`, `height`, `margin`, `padding`, `top/left`, `max-height` (kecuali
  accordion — itupun ganti ke `grid-template-rows`, lihat mapping B2). Ini memicu layout+paint tiap frame.
- **Progres bar**: ganti animasi `width` → `transform: scaleX(var(--p)); transform-origin: left` — GPU,
  dan nilai `aria-valuenow` tetap di-set dari state (bukan dari visual).
- **Pengecualian yang diterima**: transisi `width` pada collapse/expand sidebar desktop (reflow memang
  diperlukan; batasi 1 elemen, 240ms). Semua yang lain: transform/opacity.
- `box-shadow` hover kartu (existing) boleh dipertahankan — jumlahnya sedikit dan tidak per-frame.
- `will-change` hanya pada elemen yang benar-benar sering dianimasikan; jangan pasang global.

### G3. Kebijakan backdrop-blur (evaluasi + keputusan)

| Layer blur | Saat ini | Keputusan | Alasan |
|---|---|---|---|
| `header-glass` blur(20px) saturate(180%) | `globals.css:832-847` | **PERTAHANKAN** | statis, satu elemen, kontribusi besar ke rasa premium |
| Route-transition scrim + blur(2px) full-screen | `route-transition.tsx:123-124` | **HAPUS** (ganti template.tsx, lihat C1) | layar penuh × setiap navigasi = compositing konstan; bikin kedip pada rute prefetch |
| Dialog backdrop `backdrop-blur-xl` (24px) | `dialog.tsx:146` | **TURUNKAN**: tanpa blur atau maksimum blur(8px) | scrim 40% sudah cukup; blur-xl di tengah layar mahal |
| Upload progress modal `blur-md` | `upload/page.tsx:1012` | **HAPUS blur** (scrim 45%) | konten di belakang tidak informatif; hemat GPU |
| Sticky grading bar `blur-md` | `penilaian:1047` | **HAPUS blur** (naikkan soliditas `color-mix` ke 96–98%) | sticky + blur = repaint tiap frame scroll |
| Admin modal `blur-sm` ×4 | `admin/pegawai/_client.tsx:450 dll.` | **HAPUS** (ikut migrasi ke Dialog) | konsistensi + hemat |
| Command palette `blur-md` | `command-palette.tsx:477` | Turunkan ke 0–8px | dibuka sesekali; blur bukan pembeda di sini |

**Aturan umum**: maksimum **satu layer blur aktif** dalam satu frame. Scrim datar adalah default.

### G4. Melindungi alur print / export (Excel, PDF, ZIP) & screenshot — JANGAN diganggu

| Jalur | Risiko | Aturan |
|---|---|---|
| **Export data** (Excel `exporter.ts`, PDF `pdf-generator`, ZIP `zip/`) | Tidak menyentuh DOM animasi — aman | Jangan menambah `await`/delay ke handler; jangan ubah signature handler |
| **Print** (`handlePrint` di `admin/export-penilaian`, `print:hidden` blocks) | Entrance animation yang belum selesai (opacity<1) bisa tercetak bila user print secepatnya | Animasi entrance ≤220ms dan berakhir pada state final; tambahkan `@media print { .motion-page-enter, .animate-fade-in, .animate-fade-up { animation: none !important; opacity: 1 !important; transform: none !important; } }` |
| **Screenshot** (`ScreenshotButton` → `html-to-image`, target `#export-pegawai-section` & `#export-monitoring-section`) | html-to-image menyalin computed style — animasi berjalan/mount-animation akan ter-capture mid-state (transparan/tergeser); infinite animation (pulse dot kalender) = hasil tak deterministik | 1) **Dilarang** ada kelas entrance (`animate-*`, `motion-*`) pada elemen dalam target screenshot dan semua anaknya. 2) **Dilarang** infinite animation di dalam target. 3) Sediakan util aman: `[data-motion="none"], [data-motion="none"] * { animation: none !important; transition: none !important; }` untuk dibungkus target bila diperlukan |
| **Guard posisi target**: `#export-pegawai-section` (`pimpinan/_client.tsx:426`), `#export-monitoring-section` (`monitoring-penilaian:186`) | — | Saat menambahkan motion baru, cek kedua id ini: tidak boleh ada animasi di dalamnya |

### G5. Anti-pattern (DILARANG di SIKAP)

| Jangan | Ganti dengan |
|---|---|
| `transition: all` (90× di repo) | properti spesifik: `color, background-color, border-color, box-shadow, opacity, transform` |
| Animasi pada keyboard flow (Enter antar skor, palette arrows) | tanpa animasi |
| `scale(0)` entrance | `scale(0.92–0.97)` + `opacity: 0` |
| `ease-in` untuk UI | `--ease-out-strong` (masuk) / `--ease-apple` (hover) |
| Exit tanpa animasi (kondisi sekarang!) | pasangan masuk/keluar (C5) |
| Animasi `max-height: 600px` | `grid-template-rows` (C1) |
| Keyframes pada toast/toggle/elemen yang dipicu cepat 2× | CSS transition |
| Delay total entrance > 300ms | cap stagger 6 anak × 50ms |
| Re-animate list saat filter/ketik | stagger hanya mount pertama (B5) |
| Blur bertumpuk > 1 layer | scrim datar default (G3) |
| Animasi pada elemen dalam target screenshot/export | data-motion="none" + larangan (G4) |

---

## E. PETA PENERAPAN PER ROUTE GROUP

| Route group | Entrance | Komponen kunci → motion yang diterapkan | Prioritas |
|---|---|---|---|
| **Shell (semua rute)** | — | `sidebar.tsx` (submenu grid-rows, hover token, drawar exit), `header.tsx` (tidak ada perubahan besar), `theme-toggle` (transisi warna sekali + press), `notification-bell` (dropdown enter/exit + badge pop), `command-palette` (enter 160ms/exit 120ms, item instant), `route-transition` (pensiunkan scrim → template.tsx), `dialog.tsx` (exit + blur turun) | **P1** |
| `/login`, `/reset-password` | kartu form rise 220ms | panel ilustrasi float (opsional); error fade | P2 |
| `/pegawai` (dashboard) | template.tsx | alert transisi state, list crossfade (bukan re-stagger), kartu hapus collapse-out | P2 |
| `/pegawai/upload` | template.tsx | wizard step crossfade 180ms, dropzone dragover feedback, progress modal tanpa blur + sukses pop & tahan 800ms | P2 |
| `/pegawai/ckp/[id]`, `/pegawai/evaluasi-penilaian` | template.tsx | expand grid-rows (ganti max-height), hapus collapse-out; evaluasi: nol perubahan (guard print) | P2/P3 |
| `/ketua_tim` (dashboard) | template.tsx | list crossfade, card hover token | P2 |
| `/ketua_tim/rk/[id]` | template.tsx | expand baris grid-rows (K-2), "Tersimpan" jadi standar, chevron ikut token (fix Noir) | P2 |
| `/pimpinan` (dashboard) | template.tsx | kartu pegawai stagger cap 6, ZIP button spinner seragam | P2 |
| `/pimpinan/approval` | template.tsx | skeleton `.skeleton`, baris approve collapse-out + batch stagger 30–50ms | P2 |
| `/pimpinan/monitoring-penilaian`, `/pimpinan/pegawai/[userId]` | template.tsx | accordion grid-rows | P3 |
| `/penilaian/[upload_id]` | template.tsx | sticky bar: hapus blur + entrance sekali + progress 480ms + momen `allScored` pop; modal pindah RK → Dialog | **P1** |
| `/rencana_kinerja` | template.tsx | accordion 3 level grid-rows 160–180ms; modal → Dialog | P2 |
| `/admin/pegawai` | template.tsx | 4 modal → Dialog; hover aksi scale 1.03 + focus-within reveal | P1 (modal) / P3 |
| `/admin/rk`, `/admin/rk/import` | template.tsx | tab underline slide 160–200ms + konten crossfade 150ms | P3 |
| `/admin/periode` | template.tsx | status badge crossfade 150ms | P3 |
| `/admin/logs` | template.tsx | tanpa motion tambahan | P3 |
| `/admin/export-penilaian` (+ reuse pegawai) | template.tsx | guardrail print/screenshot; FetchingBar existing | P3 |
| `/analitik` | template.tsx | bar chart grow scaleX 480ms sekali; line chart fade 200ms | P3 |

---

## F. CHECKLIST IMPLEMENTASI (untuk Homelander)

**Fase 1 — Fondasi (P1, lakukan pertama):**
1. Tambah blok token extension (B1) + blok reduced-motion lengkap (G1) di `globals.css`.
2. Tambah utility classes: `.motion-page-enter`, `.motion-panel-in/.motion-panel-out`, `.motion-pop`,
   `.motion-collapse-wrap`, `.motion-remove`, `.motion-progress` + `@media print` reset.
3. Buat `template.tsx` per route group (`pegawai`, `ketua_tim`, `pimpinan`, `penilaian`,
   `rencana_kinerja`, `admin`, `analitik`) → hapus `animate-fade-in` dari wrapper halaman (hindari dobel).
4. `dialog.tsx`: tambah exit + turunkan blur; `notification-bell` + `command-palette`: exit.
5. `route-transition.tsx`: pensiunkan scrim+blur; pill opsional dengan delay 300ms (atau hapus total).

**Fase 2 — Perbaikan area (P2):**
6. `penilaian/_client.tsx`: sticky bar (blur→solid 96%, entrance sekali, progress 480ms).
7. Migrasi 4 modal admin pegawai + modal pindah RK (penilaian) ke `Dialog`.
8. Wizard upload: crossfade step; progress modal tanpa blur; sukses tahan 800ms.
9. Expand/collapse → `grid-rows` di: activity-card, ckp/[id], rk/[id], monitoring accordion,
   rk-management-view.
10. List entrance: guard stagger sekali-mount (pegawai, ketua_tim, pimpinan).
11. Hapus optimistis: collapse-out sebelum mutate (pegawai dashboard, approval).
12. Skeleton unifikasi: `.skeleton` menggantikan `animate-pulse` slate + spinner first-load.
13. Theme toggle: transisi warna sekali klik + press feedback.

**Fase 3 — Poles (P3):**
14. Tab underline import RK; status badge crossfade; bar chart grow; badge notif pop; login entrance.

**Verifikasi (wajib):**
- `npm run lint` & `tsc` hijau; `npm run build` sukses.
- Grep drift: `grep -rn "duration-200\|duration-300\|duration-500\|transition-all" src` → hanya boleh
  tersisa di tempat yang diizinkan (mis. `transition-all` pada komponen yang memang butuh multi-prop;
  target akhir: <10 kemunculan).
- Grep guardrail: `grep -rn "animate-\|motion-" src/app/pimpinan/_client.tsx src/app/pimpinan/monitoring-penilaian/_client.tsx`
  → pastikan TIDAK ada di dalam `#export-*` sections.
- Manual: emulasi `prefers-reduced-motion: reduce` di DevTools → tidak ada gerakan (hanya fade);
  keyboard-only pass (Tab/Enter di skor, palette); print preview `admin/export-penilaian` bersih;
  screenshot `#export-pegawai-section` & `#export-monitoring-section` tidak transparan/bergeser;
  test satu-satunya jalur pada low-end (CPU throttle 4×): tidak ada long-frame saat navigasi.

**Definition of done motion (rasa yang dituju):**
- Tidak ada elemen yang "lenyap mendadak" — semua yang masuk punya jalur keluar.
- Semua durasi/easing berasal dari token; nol angka hardcoded baru.
- Reduced-motion: aplikasi tetap enak dipakai, hanya tanpa gerakan.
- Tidak ada animasi yang membuat pengguna menunggu; keyboard flow instan.
- Screen recording 10 detik (pindah menu → buka detail → nilai → tutup modal): terlihat mulus,
  tanpa kedipan, tanpa lompatan.
