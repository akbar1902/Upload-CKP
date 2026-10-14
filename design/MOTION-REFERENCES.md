# MOTION REFERENCES — Riset Referensi Motion UX untuk SIKAP

> 8 sumber dengan motion UX terbaik, diverifikasi via pembacaan langsung (Oktober 2026).
> Fokus pemilihan: **aplikasi kerja** (navigasi, micro-interaction, orchestration) — bukan animasi
> marketing/landing page. Setiap referensi: kenapa bagus → 2–3 pola konkret → timing/easing kasar →
> cara adopsi ke SIKAP. Nilai "kasar" ditandai ~; angka yang dikutip dari sumber ditulis eksplisit.

---

## 1. animations.dev — Emil Kowalski *(paling operasional)*

**Sumber**: https://animations.dev/ + skill publik penulisnya
(https://github.com/emilkowalski/skills → `skills/animate/SKILL.md`). Emil membangun Sonner (library
toast yang dipakai SIKAP) dan Vaul; kursusnya fokus ke *decision-making* motion, bukan trik.

**Kenapa bagus**: satu-satunya sumber yang mengubah "selera" menjadi **tabel keputusan**: kapan
TIDAK menganimasi, easing mana untuk situasi apa, durasi per komponen, dan daftar "never ship".
Langsung bisa dipakai sebagai standar review.

**Pola konkret**:
1. **Frequency gate** — 100+×/hari (shortcut, command palette, arrow-nav): **tanpa animasi**. Puluhan×:
   nyaris tak terasa. Sesekali: standar. Langka: budget delight. Raycast disebut sebagai contoh benar
   (tidak ada animasi buka/tutup command menu).
2. **Easing yang kuat, bukan `ease-out` bawaan** — `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` untuk
   entrance/exit; `cubic-bezier(0.77, 0, 0.175, 1)` untuk gerak antar posisi; drawer
   `cubic-bezier(0.32, 0.72, 0, 1)` (rasa iOS — "Ionic curve").
3. **Durasi per komponen**: press feedback 100–160ms; tooltip/popover kecil 125–200ms; dropdown
   150–250ms; modal/drawer 200–500ms; **semua UI < 300ms**.
4. **Spring**: Apple-style `{ type:'spring', duration: 0.5, bounce: 0.2 }` (mudah dinalar) atau fisik
   tradisional `{ mass:1, stiffness:100, damping:10 }`; **bounce 0.1–0.3, hindari di sebagian besar UI**.
5. **Exit aturan**: keluar dari arah yang sama dengan masuk; transisi (retarget) untuk elemen yang
   dipicu cepat 2×, keyframes hanya untuk gerakan satu arah; entrance dari `scale(0.95–0.97)+opacity`,
   **jangan `scale(0)`**.

**Timing/easing kasar**: lihat poin 3–4 (nilai eksak — ini yang paling presisi di antara semua referensi).

**Adopsi ke SIKAP**:
- Tabel durasi → menjadi dasar skala token SPEC §B (press 120ms, micro 180ms, modal 300ms).
- `cubic-bezier(0.23, 1, 0.32, 1)` → token baru `--ease-out-strong` (entrance semua elemen).
- Frequency gate → dijadikan gate resmi di SPEC §A + aturan keyboard flow (Enter antar-skor tetap inert).
- Daftar "never ship" → adopsi hampir utuh sebagai anti-pattern SPEC §G5 (`transition: all`,
  `scale(0)`, `ease-in`, max-height, re-stagger).
- Sonner (toast) sudah dari ekosistem yang sama — cukup atur durasi per tipe (SPEC §C6).

---

## 2. rauno.me — "Invisible Details of Interaction Design"

**Sumber**: https://rauno.me/craft/interaction-design (Rauno Freiberg, design engineer Vercel;
pengalaman iOS/Arc). “Craft” essays-nya adalah referensi klasik detail interaksi.

**Kenapa bagus**: menjelaskan **mengapa** movemen terasa benar lewat contoh konkret (bukan guideline
abstrak): konsistensi metafora (gerakan mengajari model mental), momentum, konsistensi spasial
(dari mana sesuatu muncul menentukan ke mana ia pergi), dan — sangat relevan — **kapan tidak menganimasi**.

**Pola konkret**:
1. **Frequency & novelty** — animasi pada interaksi yang dieksekusi ratusan kali/hari menjadi beban
   kognitif: "removed motion from core interactions and suddenly felt like I was moving much faster"
   (kasus bmrks.com). Command menu, context menu macOS, App Switcher macOS **muncul tanpa animasi**;
   context menu justru *fade halus saat keluar* + item terpilih "blink" warna aksen sebagai konfirmasi.
2. **Spatial consistency** — arah/asal gerakan harus konsisten dengan asal elemen (app launch dari
   ikon vs dari Dynamic Island); gerakan yang salah arah = disorientasi.
3. **Responsive gestures** — delta terasa *segera* saat gesture dimulai; animasi baru mengambil alih
   melewati ambang; interruptible.

**Timing/easing kasar**: tidak menyebut angka; karakternya: ~100–200ms untuk UI hits, kecepatan lebih
penting dari keindahan.

**Adopsi ke SIKAP**:
- Pembenaran prinsip "instan untuk frekuensi tinggi" (SPEC §A4) — khususnya: jangan animasikan
  highlight item command palette, jangan animasikan perpindahan fokus antar input skor.
- Exit-side refinement dari context menu (fade keluar daripada "pop" hilang) →
  persis pola exit dropdown/tooltip di SPEC §C5.
- Spatial consistency → modal tidak anchored tetap `center` (tidak boleh scale dari pojok sebarang);
  dropdown/popover origin **di trigger** (bell = kanan-atas).
- "Konfirmasi halus pada seleksi" (blink item) → inspirasi use case untuk arah aktif sidebar yang
  tidak perlu layout-shared yang mahal.

---

## 3. Apple HIG — Motion + WWDC23 “Animate with springs”

**Sumber**: https://developer.apple.com/design/human-interface-guidelines/motion dan
https://developer.apple.com/videos/play/wwdc2023/10158/

**Kenapa bagus**: definisi paling otoritatif tentang **motion sebagai komunikasi** (status, feedback,
instruksi) dengan rambu aksesibilitas yang tegas; bahasa spring Apple adalah standar emas "terasa hidup
tapi tidak berlebihan".

**Pola konkret**:
1. **Purpose over decoration** — “Don’t add motion for the sake of adding motion”; dalam apps, hindari
   menambah motion pada interaksi yang sering terjadi; feedback harus *brief and precision*, ringan
   dan tak mengganggu.
2. **Jangan pernah membuat pengguna menunggu animasi** — “let people cancel motion”, animasi tidak
   boleh memblokir tindakan berikutnya (korelasinya: interruptible & non-blocking).
3. **Springs** (WWDC23): spring punya *settling duration* — lebih pendek dari yang diduga; konsep
   `duration + bounce` (Apple API) alih-alih mass/stiffness membuat tuning lebih terprediksi.

**Timing/easing kasar**: spring default Apple-style ≈ `{ duration: ~0.5s, bounce: ~0.2 }`; feedback
interaktif ~0.15–0.35s; sistem memakai easing terpasang otomatis (jangan menandingi sistem).

**Adopsi ke SIKAP**:
- Prinsip "motion tidak boleh menahan" → aturan SPEC §A6 + exit cepat (75% durasi enter).
- Bahasa spring `duration+bounce` → preset `spring-pop` disetel mendekati (ζ≈0.62 ≈ bounce ~0.2) dan
  dibatasi hanya di 5 momen (SPEC §C9, §B3).
- "Hindari motion pada interaksi sering" → konsisten dengan gate frekuensi; memperkuat keputusan
  tidak menganimasikan hover tabel, keyboard, dan loading bar yang sering dilihat.
- Ramu aksesibilitas Apple (motion opsional) → landasan blok `prefers-reduced-motion` lengkap (SPEC §G1).

---

## 4. Linear — “A calmer interface for a product in motion”

**Sumber**: https://linear.app/now/behind-the-latest-design-refresh

**Kenapa bagus**: Linear adalah tolok ukur aplikasi kerja "cepat tapi tenang"; refresh terbaru mereka
enumerasi prinsip yang persis dibutuhkan SIKAP — mengurangi noise visual, mempertegas hierarki, tanpa
pernah mengorbankan kecepatan.

**Pola konkret**:
1. **“Don’t compete for attention you haven’t earned”** — sidebar diredupkan agar konten utama jadi
   fokus; ikon diperkecil & dikurangi; tab dibuat kompak. Statis, tapi menentukan *di mana* motion
   boleh hidup (hanya di elemen fokus — sisanya diam).
2. **“Structure should be felt not seen”** — border/divider dilembutkan; struktur dibawa oleh whitespace
   dan bayangan halus, bukan garis tebal.
3. **Kecepatan sebagai fitur** — interaksi keyboard-first (Cmd+K), navigasi near-instant; animasi tidak
   pernah menjadi "hiasan" yang menambah latensi.

**Timing/easing kasar (estimasi observasi umum, bukan angka resmi)**: ~120–200ms untuk micro-transition;
easing ringan hampir-linear; tanpa bounce; menu/palette praktis instan.

**Adopsi ke SIKAP**:
- Arah "menu yang mengalah pada konten" → sidebar SIKAP boleh sedikit diredupkan pada label non-aktif
  (sejalan dengan token `--sidebar-text-muted` yang sudah ada) — perubahan kecil, dampak "tenang" besar.
- Prinsip kecepatan → prioritas #1 SIKAP tetap *smoothness tanpa menambah latensi*: semua rekomendasi
  SPEC menghindari animasi >300ms dan re-animate pada filter.
- Command palette SIKAP (sudah ada, bergaya sama) → jangan tambah animasi per-item; cukup enter/exit
  ringan (SPEC §C1).

---

## 5. Stripe — disiplin motion di produk yang dipercaya

**Sumber**: breakdown token-level https://uiscanner.com/blog/stripe-design-system-broken-down
(mengonfirmasi prinsip yang sudah lama dikenal dari stripe.com).

**Kenapa bagus**: Stripe menunjukkan bahwa "terasa mahal" datang dari **pembatasan**, bukan banyak
gerakan: satu momen bergerak (hero gradient WebGL ~10KB, GPU-bound, dibatasi satu elemen), sisanya
statis; transisi form state didorong CSS murni (tanpa JS drama).

**Pola konkret**:
1. **Motion mahal dikurung** — hero gradient adalah satu-satunya elemen bergerak besar di seluruh
   halaman; kontras antara satu gerakan besar dan sekitarnya yang tenang membuatnya spesial
   (bukan dekorasi di mana-mana).
2. **Transisi state form dari CSS** — interaksi form-state murni CSS transition (bukan JS), cepat dan
   deterministik (cocok untuk semua field & validasi).
3. **Konsistensi token** (warna/shadows/type) menciptakan "satu objek" — motion mengikutinya: apa pun
   yang bergerak, terasa dari sistem yang sama.

**Timing/easing kasar (estimasi)**: ~150–250ms; cubic-bezier lembut "ease"; tanpa bounce; no blur besar.

**Adopsi ke SIKAP**:
- **Kurung gerakan besar**: SIKAP punya "momen" alami (progress upload, approval) — jaga agar yang
  lain tetap tenang; jangan pasang loop/gerakan dekoratif di dashboard (SPEC §A1, §C9).
- Form-state via CSS transition (bukan framer) → sesuai SPEC §C7 (focus/invalid/disabled semua CSS,
  cepat, dan otomatis reduced-motion-able).
- Tagline adopsi: "satu momen besar per layar, sisanya tenang" — dipakai sebagai rambu review akhir.

---

## 6. Vercel — Design Engineering (polish yang terukur)

**Sumber**: https://vercel.com/blog/design-engineering-at-vercel (dan karya tim: Geist, toolbar, dashboard)

**Kenapa bagus**: mendefinisikan standar "polish" yang bisa dikejar aplikasi internal: interaksi
menyenangkan **+** kecepatan halaman **+** menghormati preferensi pengguna (reduced motion, input mode)
sebagai satu paket — bukan trade-off satu sama lain. Rauno (no. 2) ada di tim ini.

**Pola konkret**:
1. **“Some animations are unnecessary because they are not the main focus”** — keputusan animasi
   diukur dari biaya-implementasi vs dampak-ke-eksperience, bukan dari kerennya.
2. **Respecting user preferences & input modes** — eksplisit menghormati reduced motion dan
   touch/pointer; polish tidak pernah mengorbankan aksesibilitas.
3. **Detail kecil berulang** — delighter di dashboard (mis. hints saat membuat env var) dibangun
   sebagai satu-dua gerakan kecil yang tepat sasaran, bukan animasi besar.

**Timing/easing kasar (estimasi)**: rentang umum web-UI 100–250ms; kurva ease-out; kecepatan dianggap
bagian dari desain.

**Adopsi ke SIKAP**:
- "Biaya vs dampak" → checklist implementasi SPEC §F diprioritaskan supaya gerakan besar (exit modal,
  route transition) tidak jadi proyek terbengkalai; P1 dulu, poles kemudian.
- "Respecting preferences" → `prefers-reduced-motion` bukan opsional; hover pakai gating
  `@media (hover: hover) and (pointer: fine)` untuk elemen non-esensial (mis. opacity reveal) agar
  tablet tidak kena hover palsu.
- "Delighter kecil & tepat" → pola "Tersimpan" dan pop badge notifikasi sebagai contoh kandidat
  (SPEC §C9), bukan animasi dashboard baru.

---

## 7. Mercury — tenang total (banking UI)

**Sumber**: analisis design-language https://ai2.design/inspiration/mercury (tanggal akses Okt 2026)

**Kenapa bagus**: Mercury adalah contoh "premium" untuk **aplikasi kerja serius**: canvas hampir
monokrom, satu aksen lavender dipakai hemat (<3% area), elevasi dari bayangan lembut bertingkat,
dan — penting — **vocabulary motion yang deselerasi, tidak pernah spring/snap**: "settling over
bouncing... the whole language is designed to feel safe around money". Untuk aplikasi keuangan/birokrasi,
rasa "aman" mengalahkan rasa "hidup".

**Pola konkret**:
1. **Satu kurva**: `cubic-bezier(0, 0, 0.2, 1)` (ease-out deselerasi) **0.15–0.3 dtk** untuk semua;
   tanpa spring, tanpa bounce, tanpa overshoot.
2. **Restraint visual** — elevasi lewat multi-layer shadow opasitas single-digit, bukan border/bayangan
   keras; radius generous (32–40px hero, 4–12px kontrol).
3. **Radius & spacing sebagai bagian motion** — transisi terasa mulus karena elemen bergerak kecil
   (shadow opacity + 1–4px), bukan karena animasi mencolok.

**Timing/easing kasar**: 0.15–0.3s, satu kurva ease-out `(0, 0, 0.2, 1)` — *angkanya dinyatakan eksplisit di sumber*.

**Adopsi ke SIKAP**:
- SIKAP bukan bank, tapi konteksnya **instansi pemerintah + data kinerja pegawai**: warna rasa "aman
  dan kredibel" itu tepat. Jadikan Mercury sebagai **rezim default**: hampir semua interaksi pakai
  `--ease-out-strong`/`--ease-apple` 120–220ms, **tanpa** overshoot.
- `--ease-spring` (SIKAP) — `cubic-bezier(0.34, 1.56, 0.64, 1)` — punya overshoot ~5%: setara
  "sedikit hidup". Keputusan: **pertahankan tokennya tapi kurangi pemakaiannya** ke 5 momen SPEC §C9;
  jangan sampai aplikasi kerja terasa "kenyal".
- "Satu kurva untuk semua" versi Mercury → SIKAP memakai 3 kurva (apple/out-strong/drawer) tetapi
  dengan divisi fungsi yang jelas dan didokumentasikan (SPEC §B2) — deviasi disengaja karena SIKAP
  punya drawer mobile + hover states yang Mercury tidak prioritaskan.

---

## 8. Raycast — presisi command palette

**Sumber**: https://designbycurio.com/learn/raycast-2024 + pengamatan ekosistem Raycast
(termasuk catatan Emil Kowalski: "Raycast has no open/close animation — that is correct")

**Kenapa bagus**: Raycast membuktikan **tool produktivitas bisa terasa premium tanpa animasi pembuka**:
yang membuatnya "mahal" adalah feedback instan (hover/keys/selection), konsistensi shortcut
(⌘K-style badges), dan kecepatan murni. Ini contoh terdekat untuk command palette SIKAP dan alur
keyboard-first penilaian.

**Pola konkret**:
1. **No open/close animation** untuk window yang dipanggil ratusan kali sehari; performa = rasa.
2. **Interaction states presisi** — hover/selection pada list item memberi feedback seketika
   (perubahan warna/ikon, tanpa transisi panjang); "feels like operating a precision instrument".
3. **Kbd badges** — shortcut di-render sebagai elemen monospace ber-badge; keyboard dijadikan
   first-class citizen, bukan aksesori.

**Timing/easing kasar**: hover/selection ≈ instan (0–80ms); window appear ≈ instan; tanpa easing
dramatis sama sekali.

**Adopsi ke SIKAP**:
- Command palette SIKAP: pertahankan enter ringan 160ms (karena dibuka <50×/hari, bukan 500×) tapi
  **jangan** tambah stagger/highlight animation; arrow-key = instan (SPEC §C1).
- Prinsip "kbd badges" sudah dipakai SIKAP (footer palette, tombol Ctrl K di header) — pertahankan
  dan konsistenkan gaya `kbd` di tempat baru.
- Model mental: halaman `/penilaian/[upload_id]` alur skor = "precision instrument": feedback simpan
  instan ("Tersimpan" sudah ada), Enter antar input inert (SPEC §C4) — Raycast sebagai pembenaran
  untuk menahan diri.

---

## Tabel ringkas: apa yang diambil dari mana

| Sumber | Ambil untuk SIKAP | Jangan ambil |
|---|---|---|
| animations.dev (Emil) | Tabel durasi & easing, frequency gate, spring bounce 0.1–0.3, daftar "never ship" | Instalasi library tambahan (SIKAP cukup CSS + framer yang sudah ada) |
| rauno.me | Instan untuk keyboard flow; exit fade untuk context menu; origin di trigger; spatial consistency | Eksperimen gesture/SwiftUI (iOS-oriented) |
| Apple HIG | Prinsip purpose-over-decoration; animasi tidak menahan; bahasa spring duration+bounce | Motion Liquid Glass/visionOS (tidak relevan web) |
| Linear | "Menu mengalah pada konten"; kecepatan sebagai fitur; palette tanpa animasi item | Perombakan visual menyeluruh (di luar scope motion) |
| Stripe | Kurung gerakan besar; form transition CSS-murni; token discipline | Hero gradient WebGL (marketing) |
| Vercel | Biaya-vs-dampak untuk polish; respecting preferences; delighter kecil tepat sasaran | Proyek eksperimental (shader/3D) |
| Mercury | Rezim "aman": ease-out deselerasi 0.15–0.3s, tanpa spring untuk default | Kanvas gelap lavender (brand mereka) |
| Raycast | Presisi untuk command palette & keyboard flow; kbd badges | Keybindings platform mereka |

**Kandidat yang dipertimbangkan namun tidak dipilih:**
- **Framer (situs)** — bahasa motion-nya milik *marketing site* (scroll-driven, hero cinematik);
  porsi bermanfaatnya (spring di framer-motion) sudah tercakup via animations.dev/Apple. Library
  `framer-motion` sendiri tetap dipakai di SIKAP (route-transition, filter-loading).
- **Sentry/PostHog/GitHub** — bagus untuk pola dashboard padat data, tapi tidak menambah pola baru
  di luar 8 referensi ini.

## Cara memakai daftar ini

1. Saat ragu soal durasi/easing → **animations.dev** (angka eksak).
2. Saat ragu "apakah perlu dianimasikan" → **rauno.me + Apple HIG + Linear** (gate frekuensi).
3. Saat membangun interaksi besar (modal/drawer/route) → **rauno.me (exit & origin) + Mercury (rezim
   tenang) + Emil (durasi)**.
4. Saat mengukur "cukup polish belum" → **Vercel (biaya vs dampak) + Stripe (satu momen besar per layar)**.
5. Semua keputusan di 1–4 sudah dikompilasi menjadi aturan siap-implementasi di `design/MOTION-SPEC.md`.

---

*Semua tautan diakses & diverifikasi pada sesi audit ini (Oktober 2026). Nilai yang diberi tanda ~
adalah estimasi observasi, bukan kutipan; nilai tanpa ~ dikutip dari sumber.*
