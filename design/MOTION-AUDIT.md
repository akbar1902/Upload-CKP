# MOTION AUDIT — SIKAP (BPS Kabupaten Belitung)

> Audit menyeluruh UI/UX motion aplikasi SIKAP di branch `feat/motion-ux`.
> Baseline: pembacaan langsung kode (anchor `file:line`), motion token & kelas di `src/app/globals.css`,
> dokumen `.impeccable/noir-*.md` sebagai konteks kerja sebelumnya.
> Batasan: verifikasi live browser tidak dapat dilakukan pada sesi ini (profil browser terkunci);
> seluruh temuan di-anchor dari kode. Dev server lokal terverifikasi `HTTP 200` di `/login`.

---

## 0. Ringkasan Eksekutif

SIKAP sudah punya **fondasi motion yang lebih baik dari rata-rata aplikasi internal**: token easing/durasi,
kelas entrance (`animate-fade-in`, `stagger`, `card-list`), overlay fetching dengan spring, micro-feedback
"Tersimpan", prefetch rute, dan `keepPreviousData` yang menghindari skeleton flash. Arah desain
(Earthy Neumorphism + teal BPS) konsisten dan `prefers-reduced-motion` sudah "disadari" (walau baru 1 blok).

Masalah utamanya bukan "kurang animasi", melainkan **3 hal sistemik**:

1. **Tidak ada satu pun exit/close animation** — dialog, dropdown, modal, kartu yang dihapus, semua
   hilang secara instan (unmount langsung). Semua motion hanya "masuk", tidak ada "keluar". Inilah sumber
   utama kesan *abrupt/kaku*.
2. **Token tidak dipatuhi** — `duration-200/300` hardcoded tersebar di 20+ file, `transition-all` dipakai
   ±80×, durasi progres 3 nilai berbeda (0.3s/0.5s/0.7s), dan skeleton punya 3 bahasa berbeda
   (shimmer / `animate-pulse` / spinner). Ritme aplikasi tidak seragam.
3. **Overlay transisi rute menimpa konten** (scrim + `blur(2px)` layar penuh) sementara rute sudah
   di-prefetch → pada navigasi cepat terjadi kedipan lapisan gelap; tidak ada entrance motion pada
   konten halaman baru, jadi perpindahan terasa "ditimpa" bukan "mengalir". Ditambah TopLoader yang
   berjalan bersamaan = dua sinyal loading untuk satu navigasi.

Prioritas untuk branch ini: **exit animations (P1) → konsolidasi token (P1) → reduced-motion lengkap (P1)
→ ganti strategi transisi rute (P1) → micro-interactions menu/theme (P2)**. Detail implementasi ada di
`design/MOTION-SPEC.md`.

---

## 1. Inventaris Motion yang ADA (baseline)

### 1.1 Token (src/app/globals.css)

| Token | Nilai | Lokasi |
|---|---|---|
| `--ease-apple` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | `globals.css:298` |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `globals.css:299` |
| `--duration` | `300ms` | `globals.css:300` |
| `--duration-fast` | `180ms` | `globals.css:301` |

### 1.2 Keyframes & kelas

| Nama | Detail | Lokasi |
|---|---|---|
| `fadeUp` | opacity + translateY(12px→0), 0.4s | `globals.css:414-417` |
| `fadeIn` | opacity 0→1, 0.35s | `globals.css:419-422` |
| `slideDown` | translateY(-6px) + **max-height 0→600px** | `globals.css:424-427` |
| `scaleIn` | scale(0.96→1) + opacity, 0.3s | `globals.css:429-432` |
| `shimmer` | background-position, 1.8s infinite | `globals.css:434-437` |
| `pulse-ring` | didefinisikan | `globals.css:439-442` |
| `.animate-fade-up` | `fadeUp 0.4s var(--ease-apple) both` | `globals.css:444-446` |
| `.animate-fade-in` | `fadeIn 0.35s both` | `globals.css:448-450` |
| `.animate-scale-in` | `scaleIn 0.3s both` | `globals.css:452-454` |
| `.stagger` | anak 1-6, jeda 60ms bertingkat | `globals.css:456-462` |
| `.card-list` | anak 1-6 jeda 50ms; anak ≥7 delay 300ms | `globals.css:464-471` |
| `.progress-bar` | `transition: width 0.7s` | `globals.css:473-476` |
| `.card-expanded-content` | `slideDown 0.3s` + `overflow: hidden` | `globals.css:511-515` |
| `.skeleton` | shimmer 1.8s, inset shadow | `globals.css:849-859` |
| Hover `.kpi-card/.activity-card/.pegawai-card` | `translateY(-2px)` + shadow, `var(--duration)` | `globals.css:478-492, 495-509, 867-879` |
| `.filter-btn`, `.view-toggle-btn`, `.search-input` focus | `transition all/colors var(--duration-fast)` | `globals.css:555-589, 591-622, 624-652` |
| `.btn-primary/.btn-secondary` | `:active { scale(0.98) / translateY(1px) }` | `globals.css:689-734, 1078-1103` |
| `.sidebar-nav-item` + indikator aktif `::before` | statis (bukan animasi) | `globals.css:736-770` |
| `.header-glass` | `backdrop-filter: saturate(180%) blur(20px)` | `globals.css:827-847` |
| `.table-row` hover | `transition background-color var(--duration-fast)` | `globals.css:881-888` |
| Gaya toast Sonner | warna/ikon token | `globals.css:1019-1047` |
| Reduced motion | **hanya** mematikan transform hover 3 kartu | `globals.css:1224-1231` |

### 1.3 framer-motion (baru di 2 file)

| Komponen | Motion | Lokasi |
|---|---|---|
| `RouteTransition` | overlay scrim + `blur(2px)` full-screen, fade 0.18s; pill spring `stiffness 380 / damping 30` | `route-transition.tsx:111-149` |
| `FetchingBar` | opacity bar 0.2s + loop `x: -120%→360%` 1.05s easeInOut | `filter-loading.tsx:15-39` |
| `FetchingOverlay` | scrim + `blur(2px)`, pill spring 380/30 identik | `filter-loading.tsx:48-89` |

`FetchingBar/FetchingOverlay` adalah **pola motion terbaik di repo** (dipakai di `ketua_tim`, `pimpinan`,
`approval`, `admin/export-penilaian`, `analitik`) — jadikan acuan, bukan pengecualian.

### 1.4 Motion inline per komponen (tanpa token)

| Tempat | Motion | Lokasi |
|---|---|---|
| Theme toggle | ikon sun/moon `rotate/scale transition duration-300` | `theme-toggle.tsx:18-19` |
| Notifikasi | dropdown `animate-scale-in`; badge tanpa animasi | `notification-bell.tsx:163-175` |
| Command palette | backdrop `fadeIn 0.18s`; panel `scaleIn 0.2s` (inline) | `command-palette.tsx:476-486` |
| Dialog | backdrop `fadeIn 0.2s` + `backdrop-blur-xl`; panel `scaleIn 0.25s` (inline) | `dialog.tsx:143-158` |
| Change password modal | `scaleIn 0.3s` inline | `change-password-modal.tsx:101` |
| Upload progress | ring `transition-all duration-500 ease-out` + arc spin; sukses `animate-scale-in` | `upload/page.tsx:1014-1047` |
| Sidebar | drawer mobile `translate -x, duration-300`; desktop `width 0.25s cubic-bezier(0.25,0.1,0.25,1)` hardcoded | `sidebar.tsx:573, 602, 611` |
| Kartu pegawai (staff) | `animate-fade-up` + `animationDelay` inline 40ms×index | `pimpinan/pegawai/_client.tsx:31-37` |
| Baris RK — skor | micro-feedback "Menyimpan… → Tersimpan" fade 2 dtk | `ketua_tim/rk/[id]/_client.tsx:292-301` |
| Kartu statis lain | `animate-fade-in` pada wrapper halaman | 20+ `_client.tsx` (mis. `pegawai/_client.tsx:331`) |

### 1.5 Indikator loading (3 bahasa berbeda)

| Bahasa | Contoh | Lokasi |
|---|---|---|
| Top loader global | `NextTopLoader` teal, height 2, speed 200 | `layout.tsx:59-69` |
| Shimmer skeleton `.skeleton` | KPI card, ActivityCardSkeleton, DataTable | `kpi-card.tsx:41`, `activity-card.tsx:271-293`, `data-table.tsx:38-54` |
| `animate-pulse` slate | skeleton tabel approval | `pimpinan/approval/_client.tsx:357-360` |
| Spinner `animate-spin` tengah | admin pegawai, admin periode, palette, dsb. | `admin/pegawai/_client.tsx:368`, `admin/periode/_client.tsx:124-128`, `command-palette.tsx:522-526` |

---

## 2. Temuan per Area

Format tiap temuan: **dampak ke pengguna → prioritas (P1/P2/P3) → arah perbaikan singkat**.
Arah teknis detail ada di `MOTION-SPEC.md` (§ pola per interaksi + peta per route).

### 2.1 Layout Shell

#### S-1. Tidak ada exit animation di seluruh overlay/dropdown/modal (sistemik)
- **Lokasi**: `dialog.tsx:139` (`if (!open || !mounted) return null` — unmount instan), `notification-bell.tsx:173`,
  `command-palette.tsx:194`, `admin/pegawai/_client.tsx:450/503/559/590`, `upload/page.tsx:1011`,
  `penilaian/_client.tsx:1146`, `rk-management-view.tsx:863`, `change-password-modal.tsx:101`.
- **Dampak**: setiap tutup modal/dropdown terasa "dipotong" — ini penyebab #1 rasa kaku. Pengguna
  tidak mendapat kesan elemen "pergi" dengan sopan; layar seolah tersentak.
- **Prioritas: P1.**
- **Perbaikan**: satu mekanisme exit bersama (150–200ms, `ease-out` lebih cepat dari enter; enter dari
  arah yang sama dengan exit) — lihat SPEC § pola modal/dropdown. Dialog masuk akal memakai AnimatePresence
  atau state `closing` + timeout; dropdown/popover cukup CSS transition opacity+translate.

#### S-2. Route-transition overlay: scrim + blur full-screen menimpa konten, dobel dengan TopLoader
- **Lokasi**: `route-transition.tsx:119-125` (`background: var(--overlay-scrim)`, `backdropFilter: blur(2px)`,
  `z-40`, `opacity 0.18s`), timeout 8s di `:97`; TopLoader aktif di `layout.tsx:59-69`.
- **Dampak**: rute di-prefetch (sidebar `:177-207`, `onMouseEnter` prefetch RK `_client.tsx:503`) sehingga
  banyak navigasi selesai <150ms — overlay hanya **berkedip**. Pada navigasi lambat, layar penuh jadi buram
  + gelap (blur 2px di seluruh viewport = biaya compositing di PC kantor kelas bawah). Dua indikator
  loading serentak (top bar + overlay) membingungkan.
- **Prioritas: P1.**
- **Perbaikan**: pensiunkan scrim+blur untuk navigasi; pertahankan TopLoader + tambah entrance motion
  konten via `app/*/template.tsx` (fade 160-200ms + rise 4-6px). Bila tetap ingin pill "Memuat …", beri
  **progressive delay 300ms** tanpa blur/scrim. Evaluasi lengkap: SPEC § navigasi.

#### S-3. Navigasi internal: konten halaman baru muncul tanpa entrance motion
- **Lokasi**: tidak ada `template.tsx`/`loading.tsx` di `src/app/*`; konten diganti RSC setelah overlay hilang.
- **Dampak**: perpindahan menu terasa seperti "potong tempel" — tidak ada kesinambungan visual antara
  halaman lama → baru.
- **Prioritas: P1** (ini separuh dari perbaikan S-2).
- **Perbaikan**: `template.tsx` per route group dengan `animate-fade-in` halus (`opacity + translateY(4px)`,
  180ms, `--ease-out-strong`), hormati reduced motion.

#### S-4. Sidebar: submenu Dashboard expand instan, kolom collapse hardcoded, indikator aktif statis
- **Lokasi**: submenu conditional render tanpa animasi `sidebar.tsx:365-403`; desktop width transition
  `0.25s cubic-bezier(0.25,0.1,0.25,1)` hardcoded `:602, 611`; item aktif hanya `style` statis `:425-453`;
  chevron `transition-transform duration-200` `:359`.
- **Dampak**: aksi paling sering (buka submenu, pindah menu, collapse) justru paling "tebal" — submenu
  melompat muncul, indikator aktif tidak pernah "berpindah" (langsung nyala).
- **Prioritas: P2** (submenu + indikator), **P3** (collapse width — sudah berjalan, cukup diganti ke token).
- **Perbaikan**: submenu pakai grid-rows expand 180-200ms + chevron sinkron; indikator aktif pakai satu
  elemen yang di-`layout`/tidak animasi lintas item (cukup fade/scaleY saat muncul); ganti `0.25s` →
  `var(--duration)` `--ease-apple`.

#### S-5. Theme toggle: hanya ikon berputar, seluruh warna aplikasi ganti seketika
- **Lokasi**: `theme-toggle.tsx:18-19` (ikon rotate/scale `duration-300`); tidak ada transition warna
  global; `next-themes` `attribute="class"` di `layout.tsx:73`.
- **Dampak**: klik toggle terasa seperti "flash" — halaman berubah warna instan tanpa jembatan; ini
  interaksi yang dilakukan sesekali dan layak dibungkus gerakan halus.
- **Prioritas: P2.**
- **Perbaikan**: transisi warna terbatas pada permukaan utama (body/card/header) 200-250ms saat
  `html.theme-transition` aktif (dipasang ±300ms lalu dilepas; cara ini hanya men-transition 1× klik,
  tidak membebani interaksi lain) + tekan ikon `active:scale(0.9)`.

#### S-6. Notification bell: dropdown, badge, dan item realtime tanpa bahasa gerak
- **Lokasi**: dropdown `animate-scale-in` mount-only `notification-bell.tsx:173-175`; badge unread tanpa
  animasi `:163-170`; notifikasi realtime masuk langsung "nempel" `:77-97`.
- **Dampak**: notifikasi baru (realtime) muncul tanpa sinyal — pengguna bisa melewatkannya. Badge angka
  berubah tanpa "pop" yang menandakan hal baru.
- **Prioritas: P2** (pop badge + item baru), **P3** (exit dropdown).
- **Perbaikan**: badge pop `scale 0.8→1` spring halus saat jumlah naik; item baru `<li>` fade+rise 180ms
  sekali (guard agar tidak re-animate saat reopen).

#### S-7. Command palette: mount-only, tanpa exit; item keyboard tanpa motion (sudah benar)
- **Lokasi**: `command-palette.tsx:476-486` (backdrop `fadeIn 0.18s`, panel `scaleIn 0.2s` inline),
  mount via `{isOpen && ...}` `:194`.
- **Dampak**: buka terasa cepat (bagus), tapi tutup/Escape langsung lenyap; mikro-jank saat panel
  besar (blur-md backdrop `:477`).
- **Prioritas: P3** (exit saja). Jangan tambah animasi pada highlight/arrow-key — frekuensi tinggi,
  sesuai prinsip "no animation for keyboard-driven, 100+×/hari".
- **Perbaikan**: backdrop tanpa blur-md (atau blur 8px) + exit 120ms; enter tetap 160-180ms.

#### S-8. Top loader + RouteTransition + FetchingBar: tiga bar progres di 1 layar
- **Lokasi**: `layout.tsx:59-69` (fixed topbar), `route-transition.tsx` (pill+scrim), `filter-loading.tsx`
  (bar di atas konten, `:25`).
- **Dampak**: pada ganti periode di dashboard ketua tim (navigasi tidak terjadi), TopLoader tidak jalan
  (bagus, baru `FetchingBar`) — tapi saat klik link dari halaman yang sedang refetch, 2-3 indikator
  bisa tampil bersamaan. Hirarki feedback kabur.
- **Prioritas: P2.**
- **Perbaikan**: satu aturan ownership — TopLoader untuk navigasi rute; FetchingBar/Overlay untuk refetch
  data in-place; pensiunkan overlay scrim (S-2). Dokumentasikan di SPEC.

### 2.2 /pegawai

#### P-1. Dashboard: entrance bagus, tapi re-animate alert & list pada setiap perubahan state
- **Lokasi**: alert "belum upload"/"perlu revisi" `animate-fade-in` dirender kondisional `_client.tsx:367-403`;
  `card-list` re-trigger saat filter berubah `:524-534`; grid card `animate-scale-in` `:104`.
- **Dampak**: mengubah filter/search memicu animasi masuk untuk semua baris → list terasa "berkedip
  berat" untuk aksi mikro (mengetik 1 huruf). Alert yang muncul menghilang saat data refetch terasa
  seperti re-mount.
- **Prioritas: P2.**
- **Perbaikan**: entrance list hanya pada paint pertama (guard `hasAnimatedOnce` / `key` berbasis query
  terakhir), filter berikutnya tanpa stagger; alert animasi hanya saat benar-benar transisi
  false→true (state transition, bukan re-render).

#### P-2. Delete: optimistic tanpa motion keluar, kartu "menghilang mendadak"
- **Lokasi**: `_client.tsx:80-84` dan `activity-card.tsx:37-41` (filter cache langsung).
- **Dampak**: pengguna menekan "Ya, Hapus" → kartu lenyap instan; tanpa collapse/fade, tidak ada
  konfirmasi visual bahwa *item yang benar* terhapus (hanya toast).
- **Prioritas: P2.**
- **Perbaikan**: pre-remove animation 180-220ms (collapse height + fade) sebelum mutasi cache;
  sediakan pola umum untuk daftar (SPEC § pola tabel/list).
- **Catatan**: setelah dihapus dan berhasil, tidak perlu "undo toast" — di luar scope motion.

#### P-3. Upload — wizard step berpindah tanpa transisi & kontainer step-3 berbeda bentuk
- **Lokasi**: step 1 ⇄ 2 swap kondisional `upload/page.tsx:642-779` vs `:781-929` (instan);
  step 3 ("Petakan RK") dirender sebagai blok besar non-fixed `:932-1008` `animate-fade-in`.
- **Dampak**: alur inti (upload) terasa berpindah "tab" — konten lompat tinggi (stepper tetap, konten
  ganti total). Step 3 muncul tiba-tiba seperti halaman lain.
- **Prioritas: P2.**
- **Perbaikan**: satu wrapper animasi per step (crossfade 180ms + rise 6px, direction mengikuti
  maju/mundur); step 3 dipertahankan sebagai bagian alur (bukan overlay) tapi dengan kontainer seragam.

#### P-4. Upload — dropzone: hover/dragover minim bahasa gerak (border+scale 1.01)
- **Lokasi**: `upload-dropzone.tsx:74-81` (`transition-all duration-300`, `transform: scale(1.01)`,
  border/bg swap warna penuh).
- **Dampak**: tarik-drop file adalah momen "fisik" — feedback saat `dragover` terlalu halus (1.01 tidak
  terasa) padahal state berubah warna keras; tidak ada gerakan ikon upload saat aktif.
- **Prioritas: P2.**
- **Perbaikan**: dragover: scale 1.015-1.02 + shadow naik 180ms; ikon `translateY(-2px)` saat dragover;
  saat file terpilih, transisi konten ringan (fade isi, 180ms) alih-alih swap instan `:91-129`.

#### P-5. Upload — progress modal: blur berat, transisi konten instan, tepat sebelum redirect
- **Lokasi**: `upload/page.tsx:1011-1093` (`backdrop-blur-md`, `animate-fade-in`, ring
  `transition-all duration-500 ease-out` `:1025`, langkah checklist ganti ikon instan `:1054-1077`,
  sukses → redirect 300ms `:553-556`).
- **Dampak**: modal muncul di atas backdrop gelap+blur (GPU), checklist "kaku" saat ganti langkah;
  momen sukses (paling penting) hanya 300ms — terlalu cepat untuk "dilihat".
- **Prioritas: P2.**
- **Perbaikan**: hapus blur-md (scrim 45% cukup); checklist transisi ikon 150ms; setelah 100% tahan
  ±700-900ms dengan check pop (spring halus) sebelum push — tetap hormati reduced motion.

#### P-6. CKP detail: expand pakai `card-expanded-content` (max-height 600px — berpotensi memotong konten)
- **Lokasi**: `globals.css:511-515` (animasi max-height 0→600px, `overflow: hidden` permanen) dipakai di
  `pegawai/ckp/[id]/_client.tsx:284-286` dan `activity-card.tsx:167-171`.
- **Dampak**: panel dengan konten >600px akan **terpotong setelah animasi** (max-height menetap).
  Motion max-height juga memicu layout tiap frame (jank). Saat ini aman karena konten <600px, tapi ini
  bom waktu untuk data entry panjang.
- **Prioritas: P2** (bug laten + performa).
- **Perbaikan**: ganti pola ke `grid-template-rows: 0fr→1fr` + `overflow hidden` pada child (didukung
  semua browser modern) atau `clip-path`; easing `--ease-out-strong`, 200ms.

#### P-7. Evaluasi-penilaian (anggota): reuse penuh UI admin export — tanpa penyesuaian motion konteks
- **Lokasi**: `pegawai/evaluasi-penilaian/page.tsx:29-36` (reuse `admin/export-penilaian/_client.tsx`),
  `FetchingBar/Overlay` `:350-351`, tombol-tombol dengan spinner `:363-394`, `print:hidden` untuk print.
- **Dampak**: tidak ada masalah besar; hanya memastikan semua perubahan motion (exit dialog, dsb.) ikut
  terpakai. **Guardrail print** harus diuji di sini (lihat SPEC § guardrails).
- **Prioritas: P3.**

### 2.3 /ketua_tim

#### K-1. Dashboard: list RK re-stagger setiap ganti filter/periode
- **Lokasi**: `card-list` dengan `key={bulan-tahun}` `_client.tsx:679`; Skeleton h-40 `:664-667`;
  card hover + arrow translate `:504, 561`.
- **Dampak**: ganti periode → 6+ kartu ber-stagger ulang; pada filter cepat (triwulan⇄bulan) terasa
  lambat/berat padahal data lama masih tampil (keepPreviousData).
- **Prioritas: P2.**
- **Perbaikan**: stagger hanya saat mount pertama; ganti periode cukup crossfade list 150ms.

#### K-2. RK detail (`rk/[id]`) — hasil desain per-baris Noir: solid, sisa 2 catatan motion
- **Lokasi**: baris expand instan `rk/[id]/_client.tsx:322`; chevron hardcode `bg-slate-50`
  `:314`; badge "Tersimpan" fade `:298` (pola bagus).
- **Dampak**: expand detail (aksi utama halaman penilaian) "melompat" tanpa gerak; kontras tema pada
  chevron menabrak dark-mode (temuan Noir yang masih ada).
- **Prioritas: P2** (expand), **P3** (chevron — sudah masuk daftar Noir).
- **Perbaikan**: expand 180-200ms grid-rows + chevron rotate; pernah dibahas di `.impeccable/noir-poles-tabel.md`
  (usulan #5) — sejalan.

#### K-3. Input skor: navigasi Enter tanpa animasi (BENAR — jangan diubah) + `transition-shadow` tunggal
- **Lokasi**: `:279` `transition-shadow`; `:142-152` Enter→fokus berikutnya.
- **Dampak**: positif — keyboard flow sudah instan. Jangan tambahkan motion di sini (frekuensi tinggi).
- **Prioritas: — (pertahankan).**

### 2.4 /pimpinan

#### PR-1. Approval: baris hilang tanpa motion, skeleton memakai bahasa berbeda (`animate-pulse` slate)
- **Lokasi**: cache filter optimistis `approval/_client.tsx:191-199, 218-223`; skeleton `:357-360`.
- **Dampak**: setelah "Setujui", baris lenyap instan — pengguna cepat kehilangan jejak "yang mana yang
  baru diproses" (toast menutupi, tapi baris bisa berubah urutan). Skeleton pulse-slate tidak sewarna
  shimmer `.skeleton` (bahasa visual kedua).
- **Prioritas: P2.**
- **Perbaikan**: baris collapse+fade 200ms sebelum remov; skeleton pakai `.skeleton`; bulk approve
  biarkan satu toast progres (sudah) + baris yang sukses animate keluar bertahap 30-50ms.

#### PR-2. Dashboard: FetchingOverlay bagus; tombol ZIP pakai `animate-pulse` pada ikon
- **Lokasi**: `_client.tsx:412` (`Archive animate-pulse opacity-50` `isZipping`), `:427` FetchingOverlay.
- **Dampak**: pulse pada ikon (opacity berdenyut) bukan bahasa SIKAP; di reduced-motion tetap berdenyut.
- **Prioritas: P3.**
- **Perbaikan**: ganti ke spinner kecil atau dot-ellipsis konsisten dengan skeleton/progress tokens.

#### PR-3. Monitoring penilaian & Pegawai/[userId]: halaman-halaman "diam" (statis) siap diberi entrance minimal
- **Lokasi**: `monitoring-penilaian/_client.tsx:186` (fade-in wrapper), accordion per ketua tim tanpa
  animasi expand `:74`; `pimpinan/pegawai/[userId]/_client.tsx:127-128`.
- **Dampak**: konsisten tapi tanpa "hidup" — setelah §navigasi diperbaiki (template.tsx), halaman ini
  otomatis ikut; accordion monitoring layak dapat expand motion seperti K-2.
- **Prioritas: P3.**

### 2.5 /penilaian/[upload_id]

#### N-1. Sticky grading bar: blur + entrance berulang + progress mewah
- **Lokasi**: `_client.tsx:1045-1093` (`backdrop-blur-md` + `animate-fade-in`, progress
  `transition-all duration-500` `:1065`, tombol Approve disabled sebelum `allScored` `:1078-1085`).
- **Dampak**: bar ini sticky di atas konten yang discroll — blur full-width = biaya repaint tiap frame
  scroll di laptop kantor; `animate-fade-in` re-trigger setiap kali kondisi render ulang (mis. setelah
  setiap penilaian, `scoredRks` berubah). Bar muncul berkedip-kedip = mengganggu reviewer.
- **Prioritas: P1** (halaman paling intensif bagi ketua tim/pimpinan).
- **Perbaikan**: ganti blur dengan warna solid 96% (`color-mix` sudah ada — cukup naikkan ke 96-98% dan
  hapus backdrop-filter); `animate-fade-in` hanya sekali mount; progress transition 480ms `--ease-out-strong`;
  saat `allScored` berubah true, momen kecil (check icon pop) menandai "siap approve".

#### N-2. Modal "Pindah/Koreksi RK" & Dialog "Buka Kembali": mount-only, tombol hardcode slate
- **Lokasi**: `_client.tsx:1146-1194` (modal custom `animate-fade-in`, tombol `hover:bg-slate-200`
  `:1185` — dark mode janggal); Dialog reopen `:1110-1143` (pakai sistem Dialog → kena S-1 exit).
- **Dampak**: konsistensi warna + exit (ikut S-1).
- **Prioritas: P2.**
- **Perbaikan**: migrasikan modal pindah RK ke komponen `Dialog` bersama (satu sistem).

#### N-3. Row expand per RK (activity-card) — sama dengan P-6 (max-height)
- **Lokasi**: `_client.tsx:166` `activity-card`, detail `:260-...` (kondisional), riwayat approval statis.
- **Prioritas: P2** (ikut P-6 fixing).

### 2.6 /rencana_kinerja

#### R-1. Manajemen RK: accordion team→RK→sub tanpa animasi; hover reveal sub-row
- **Lokasi**: `rk-management-view.tsx` — expanded `Set` `:75, 495-599` (conditional render), chevron
  rotate `:508, 594`, aksi sub-row `opacity-0 group-hover/sub:opacity-100` `:628`, modal
  `:863` (`animate-fade-in`).
- **Dampak**: halaman CRUD dengan struktur 3 level — expand/collapse adalah interaksi utamanya, semua
  tanpa motion = terasa spreadsheet kaku. Modal tutup instan (S-1).
- **Prioritas: P2.**
- **Perbaikan**: expand/collapse 160-180ms grid-rows per level; hover reveal boleh pakai opacity 120ms
  (sudah ada, tinggal token); modal → sistem Dialog.

### 2.7 /admin/*

#### A-1. Admin pegawai: 4 modal custom identik & duplikat (fade-in + backdrop-blur-sm), exit instan
- **Lokasi**: `admin/pegawai/_client.tsx:450, 503, 559, 590`.
- **Dampak**: kandidat konsolidasi paling jelas (4 modal dengan pola sama manual). Blur-sm + scrim di
  tiap modal; tutup = lenyap instan.
- **Prioritas: P1** (dampak struktural: menghilangkan 4 sumber inkonsistensi sekaligus).
- **Perbaikan**: ganti ke `Dialog` sistem (satu enter/exit), pertahankan layout form.

#### A-2. Admin pegawai list: hover-only aksi dengan scale 105/95 (over-animated & tak keyboard-visible)
- **Lokasi**: `:409-424` (`group-hover` translate + `hover:scale-105 active:scale-95` di 5 tombol).
- **Dampak**: beberapa micro-interaction ini justru "ingin terlihat"; scale 1.05 pada ikon 16px =
  goyang berlebih untuk aplikasi kerja. Fokus keyboard tidak memunculkan aksi (hanya hover).
- **Prioritas: P3.**
- **Perbaikan**: scale maksimal 1.03/0.97, transition 120ms; tampilkan group aksi juga saat
  `focus-within` (bukan hanya hover).

#### A-3. Admin periode: Dialog sistem (bagus), kartu toggle tanpa feedback transisi status
- **Lokasi**: `admin/periode/_client.tsx:88` (fade-in), `:163-195` Dialog, kartu status kunci/buka.
- **Dampak**: menekan "Kunci" → status di kartu berganti instan setelah round-trip (tanpa indikator
  in-card selain `isProcessing`?). Verifikasi `:112-119` per-bulan processing.
- **Prioritas: P3.**
- **Perbaikan**: badge status crossfade 150ms saat berubah + spinner inline sudah ada — cukup standarkan
  ke tokens.

#### A-4. Admin RK import: tab tanpa indikator gerak, refresh list tanpa flash highlight
- **Lokasi**: `admin/rk/import/page.tsx:274-286` (tab border-b-2 `transition-colors`).
- **Dampak**: tab switch = teks ganti gaya; tidak ada indikator geser. Fungsi utama halaman (preview
  simpan dataset) sudah punya spinner di tombol-tombol `:400, 457-462`.
- **Prioritas: P3.**
- **Perbaikan**: indikator tab (underline) slide 160-200ms `--ease-apple` (simple translate) + konten
  tab crossfade 150ms. Hindari library.

#### A-5. Admin logs: halaman statis (fade-in wrapper) — cukup diikutkan template.tsx
- **Lokasi**: `admin/logs/_client.tsx:90`.
- **Prioritas: P3.**

#### A-6. Export penilaian (admin+pimpinan+anggota): bar progres in-place + `print:hidden` flow
- **Lokasi**: `admin/export-penilaian/_client.tsx:335-345` (`print:hidden`, FetchingBar/Overlay), tombol
  download dengan spinner `:363-394`, `handlePrint`.
- **Dampak**: tidak ada masalah besar. **Wajib guardrail**: entri animasi baru tidak boleh diterapkan
  pada area `#export-...`/printable; html-to-image (ScreenshotButton) menyalin computed style — animasi
  `both` yang belum selesai = hasil screenshot transparan/tergeser (lihat SPEC guardrails).
- **Prioritas: P1 untuk guardrail, P3 untuk polish.**

### 2.8 /login (+ reset-password, analitik)

#### L-1. Login: kartu & panel tidak punya entrance; hanya form yang fade-in
- **Lokasi**: `login/page.tsx:94` (`animate-fade-in` pada form), panel kanan statis `:195-245`,
  error alert fade-in `:108`; tombol `hover:opacity-90 transition-opacity` `:169`.
- **Dampak**: halaman pertama yang dilihat pengguna setiap hari — impresi pertama "diam". Panel
  ilustrasi tanpa gerak halus (mis. float lembut) padahal satu-satunya tempat "playful" yang aman.
- **Prioritas: P2.**
- **Perbaikan**: kartu form rise+fade 220ms saat mount; panel kanan parallax/float sangat halus
  (translate 4-6px, 6-8s loop, reduced-motion off) — atau minimal fade bertahap. Error shake JANGAN —
  gunakan fade + border transition (anti-slop).

#### L-2. Reset-password: pola sama dengan login (fade-in per state)
- **Lokasi**: `reset-password/page.tsx:161, 179, 206, 220`.
- **Prioritas: P3** (ikut L-1).

#### L-3. Analitik: FetchingBar konsisten; chart statis tanpa entrance
- **Lokasi**: `analitik/_client.tsx:169-170` (fade-in + FetchingBar), charts `charts.tsx` (TrendLines/
  StatusDonut statis; BarList `transition-all duration-300` `:388` tanpa entrance).
- **Dampak**: chart "muncul jadi" — tidak mengganggu, tapi melewatkan micro-moment; bar chart bisa
  dianimasikan dengan murah.
- **Prioritas: P3.**
- **Perbaikan**: bar chart grow `scaleX/width` dari 0 saat mount (480ms, hanya pertama); line chart
  cukup fade 200ms. Jangan animasi pada setiap re-render data.

---

## 3. Masalah Lintas Aplikasi (akar, bukan gejala)

| # | Masalah | Bukti | Prioritas |
|---|---|---|---|
| L1 | **Semua motion mount-only; exit tidak ada** | `dialog.tsx:139`, `notification-bell.tsx:173`, `command-palette.tsx:194`, 4 modal admin, dll. | **P1** |
| L2 | **Token drift durasi/easing** — `duration-200`/`duration-300` hardcoded | 23 file (grep `duration-[0-9]*`: 32× `duration-200`, 9× `duration-300`, 3× `duration-500`); vs token `--duration-fast 180ms` | **P1** |
| L3 | **`transition-all` 85×** — memicu transisi properti tak perlu (jank) | `admin/pegawai` 25×, `sidebar` 6×, dll. | **P1** |
| L4 | **Reduced-motion hampir kosong** — hanya matikan hover 3 kartu | `globals.css:1224-1231` | **P1** |
| L5 | **Skeleton 3 bahasa**: shimmer `.skeleton`, `animate-pulse` slate, spinner tengah | `data-table.tsx:46` vs `approval:357-360` vs `admin/pegawai:368` | P2 |
| L6 | **Durasi progress inkonsisten**: 0.3s / 0.5s / 0.7s | `globals.css:475` (0.7s), `penilaian:1065` (0.5s), `charts.tsx:388` (0.3s) | P2 |
| L7 | **Konten bisa terpotong** — animasi `max-height: 600px` permanen | `globals.css:424-427, 511-515` + pemakaian | P2 |
| L8 | **Hover via JS inline style** (~30 tempat) — konsisten jalan tapi lepas dari token & tanpa `:focus-visible` | `sidebar.tsx:335-346`, `notification-bell.tsx:220-227`, `activity-card.tsx:150-157`, dll. | P3 |
| L9 | **Blur bertumpuk**: header glass 20px + dialog blur-xl + modal blur-md/sm + overlay blur 2px + sticky bar | `globals.css:832-847`, `dialog.tsx:146`, `upload:1012`, `penilaian:1047`, `route-transition:123` | P2 |
| L10 | **Stagger re-trigger** saat filter/state berubah (list & alert re-animate) | `pegawai/_client.tsx:367-403, 524`, `ketua_tim/_client.tsx:679` | P2 |

---

## 4. Top-10 Temuan (urut dampak)

| # | Temuan | Area | Prioritas |
|---|---|---|---|
| 1 | Tidak ada exit animation di semua modal/dropdown/overlay | Shell, semua halaman | **P1** |
| 2 | RouteTransition scrim+blur full-screen & dobel TopLoader → kedip saat navigasi prefetch | Shell | **P1** |
| 3 | Tidak ada entrance motion konten rute baru (tidak ada `template.tsx`) | Shell | **P1** |
| 4 | Reduced-motion hampir tidak diakomodasi (1 blok vs sistem penuh) | Global | **P1** |
| 5 | Token drift `duration-200/300` + `transition-all` masif | Global | **P1** |
| 6 | Sticky grading bar penilaian: blur + re-animate + progress 0.5s | /penilaian | **P1** |
| 7 | 4 modal custom duplikat di admin pegawai (blur, tidak konsisten, exit instan) | /admin/pegawai | **P1** |
| 8 | Delete/approve optimistis tanpa motion keluar (baris & kartu lenyap mendadak) | /pegawai, /pimpinan/approval | P2 |
| 9 | Wizard upload berpindah step instan; step-3 muncul sebagai blok lepas | /pegawai/upload | P2 |
| 10 | Expand/collapse pakai max-height 600px (bug laten potong konten + jank) | activity-card, ckp/[id], rk/[id] | P2 |

**Micro-feedback yang harus dipertahankan & dijadikan standar**: badge "Tersimpan" (`rk/[id]:292-301`),
`FetchingBar/Overlay` (`filter-loading.tsx`), `usePeriodParams` (filter instan tanpa navigasi),
stagger KPI dashboard, prefetch menu & hover-prefetch.

---

## 5. Yang Tidak Diaudit / Keterbatasan

- Verifikasi live (browser) tidak tersedia pada sesi ini (profil browser terkunci; kredensial tidak
  tersedia → tidak ada akses halaman terautentikasi). Semua anchor dari pembacaan kode; dev server
  lokal terbukti `HTTP 200` di `/login`.
- Folder `docs`, `debug-auth`, dan alur OAuth/SSO tidak relevan motion.
- Tidak ada file `template.tsx`/`loading.tsx` — memengaruhi rekomendasi S-3 (dibuat baru di SPEC).

> Lanjutan implementasi & nilai persis: **`design/MOTION-SPEC.md`**.
> Referensi arah rasa (rasional + angka): **`design/MOTION-REFERENCES.md`**.
