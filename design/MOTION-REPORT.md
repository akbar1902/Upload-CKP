# MOTION REPORT — SIKAP (BPS Kabupaten Belitung)

> Laporan penutup proyek peningkatan motion aplikasi SIKAP di branch `feat/motion-ux`
> (14 commit proyek di atas `main` `71e53c0` + 1 commit laporan ini; belum di-push). Ditulis ringkas untuk pemilik & kolega —
> angka verifikasi diambil apa adanya dari hasil QA dan gate final.
> Dokumen pendukung: `MOTION-AUDIT.md` (temuan), `MOTION-SPEC.md` (kontrak implementasi),
> `MOTION-REFERENCES.md` (riset 8 referensi), `MOTION-TECH.md` (kajian teknis + apendiks hasil per fase).

---

## (a) Ringkasan Eksekutif

**Tujuan.** Menghapus rasa "kaku" aplikasi: sebelumnya semua elemen hanya "masuk" tanpa pernah
"keluar", token gerak tidak seragam, dan transisi halaman menimpa konten dengan overlay blur.

**Pendekatan.** Audit menyeluruh (ber-anchor baris kode) → spec implementable + riset 8 referensi
motion kerja (Emil Kowalski, Apple, Linear, Stripe, Mercury, dll.) → implementasi hybrid 2 gelombang:
navigasi antar halaman memakai View Transitions bawaan Next 16 (0 KB tambahan), komponen yang
muncul/hilang (modal, dropdown, overlay) memakai satu mekanisme exit bersama, mikro-interaksi lewat
token CSS. Tiap gelombang ditutup QA ronde tersendiri, lalu gate final (tsc, eslint, build produksi).

**Hasil.** Semua temuan P1 (exit animation, navigasi, reduced-motion, drift token) tuntas; tidak ada
P1 tersisa dan tidak ada backlog motion. Setiap elemen yang masuk punya jalur keluar, pindah menu
mengalir tanpa kedipan, gerak bisa dikekang lewat preferensi reduced-motion, dan tidak ada angka
gerak liar tersisa di kode.

**Status: SELESAI & siap direview.** Branch `feat/motion-ux` belum di-push — restore kapan pun
dengan `git checkout main` (bagian e). Halaman terautentikasi belum bisa dites live oleh tim
(login wall tanpa kredensial) — karena itu checklist uji manual untuk pemilik disediakan di bagian (d).

---

## (b) Apa yang Berubah per Area

### Navigasi
- Pindah menu memakai **View Transitions bawaan Next 16** (`template.tsx` di 7 route group): konten
  baru masuk halus (fade + rise), shell/sidebar tetap diam; header di-anchor agar tidak ikut beranimasi.
- Overlay "Memuat…" lama (scrim + blur layar penuh) **dipensiunkan total** — dulu penyebab kedipan pada
  navigasi yang sudah cepat (rute di-prefetch). Umpan balik navigasi kini satu saja: TopLoader di atas.
- Command palette: buka 160ms / tutup 120ms; item saat navigasi keyboard tetap instan (prinsip:
  interaksi frekuensi tinggi tanpa animasi).

### Komponen / modal
- **Exit animation bersama**: semua modal/dialog/dropdown/overlay kini punya animasi keluar (dulu
  hilang mendadak). Aturan: exit selalu lebih cepat dari enter, arah konsisten; backdrop blur dihapus.
- **11 titik pemakaian modal bermigrasi ke `Dialog` bersama**: 4 modal admin pegawai, modal pindah RK
  (penilaian), "Tandai Perlu Diperbaiki" (ketua tim), dan 5 modal manajemen RK. Modal yang dulu
  di-mount kondisional diperbaiki agar animasi keluarnya benar-benar tampil.
- Tombol: feedback tekan halus, spinner tidak menggeser layout; pola "Tersimpan" dijadikan standar
  semua aksi simpan inline.

### Dashboard
- Indikator refetch (`FetchingBar`) pindah ke CSS keyframe (loop JS dihapus, tampilan identik);
  overlay fetching memakai spring kanonik yang sudah ada.
- Entrance chart (fade garis, draw-in donut, grow bar) bersifat **opt-in** — hanya hidup di halaman
  analitik sesuai peta spec.
- Hapus kartu/baris: **collapse-out 200ms sebelum data dihapus** (jelas item mana yang pergi), plus
  guard klik ganda agar tidak ada mutasi/toast dobel.
- Stagger (kemunculan bertahap kartu) hanya di paint pertama (`useStaggerOnce`) — ganti filter/periode
  tidak lagi mengulang animasi.

### Halaman
- Expand/collapse (detail CKP, RK ketua tim, kartu RK penilaian, accordion monitoring, sub-RK) memakai
  pola `grid-rows` yang aman — tidak lagi berpotensi memotong konten — dan panel tertutup diberi `inert`.
- Sticky bar penilaian: bebas blur (solid 97%), entrance hanya sekali, progres halus 480ms, pop kecil
  saat semua skor terisi ("siap approve").
- Wizard upload: perpindahan step crossfade tanpa kehilangan state; modal progres tanpa blur; momen
  sukses ditahan ±800ms sebelum redirect.
- Login/reset-password: kartu masuk halus; panel ilustrasi mengambang lembut.

### Aksesibilitas / reduced-motion
- Blok `prefers-reduced-motion` kini lengkap: entrance jadi fade ≤120ms, stagger dimatikan, loop
  dekoratif mati, skeleton statis, progress tanpa animasi, View Transitions dinolkan; spinner & toast
  tetap jalan (feedback esensial).
- Pembedaan masuk/keluar benar di mode reduce (masuk = fade in, keluar = fade out — tidak terbalik).
- a11y: panel collapse tertutup `inert` (tidak bisa di-tab); Dialog memakai `aria-labelledby` otomatis
  ke judulnya.

### Pembersihan
- Drift token **nol** di seluruh komponen `src/**/*.tsx`: `transition-all` dan durasi hardcoded
  (`duration-200/300/500`) tidak tersisa.
- Kode mati dihapus: `route-transition.tsx` (overlay lama) dihapus beserta pemasangannya; animasi
  dekoratif (dot kalender) dihilangkan; 5 import tak terpakai dibersihkan.
- Token durasi/easing diperluas terpusat (panel/drawer/row/progress) + cerminan konstanta di
  `src/lib/motion.ts`.

---

## (c) Bukti & Verifikasi

- **QA ronde 1 — LULUS DENGAN CATATAN; semua temuan ditutup** (fix round gelombang 1).
- **QA ronde 2 — LULUS DENGAN CATATAN; semua perbaikan terbukti runtime**; 1 temuan P2 + sisa P3
  ditutup di cleanup round (tanpa mengubah logika bisnis).
- **Gate final (koordinator):**
  - `npx tsc --noEmit` → **exit 0** (nol error TypeScript).
  - eslint → **0 error baru** di file yang disentuh; total repo **turun 284 → 270** error (sisanya
    error lama, seluruhnya di luar scope motion).
  - `npm run build` produksi → **exit 0**, 22/22 static pages, ringkasan fitur `✓ viewTransition`.
- **Tidak ada temuan P1 tersisa; tidak ada backlog motion tersisa.** Semua commit terverifikasi.

**Yang BELUM bisa diverifikasi tim (jujur):**
1. **Halaman terautentikasi secara live** — ada login wall dan tim tidak memegang kredensial;
   pengalaman rasa akhir diuji oleh user (lihat checklist bagian (d)).
2. **Safari & Firefox** — pengujian hanya di Chrome. Next 16 menjamin degradasi anggun (tanpa
   dukungan, transisi dimatikan tapi aplikasi tetap berjalan normal), namun tetap layak dicek user.

---

## (d) Cara Mencoba Manual (checklist pemilik)

1. Jalankan `npm run dev`, buka aplikasi, lalu login.
2. **Pindah-pindah menu** dari sidebar — konten masuk halus; tidak ada lapisan gelap/blur berkedip;
   bar tipis di atas layar = indikator navigasi (TopLoader).
3. **Buka lalu tutup modal** (tombol Tutup / ESC / klik area gelap) — perhatikan ada animasi keluar
   yang halus, bukan langsung lenyap.
4. **Klik tombol** (feedback tekan halus), **ganti filter/tab** (instan — daftar tidak berkedip atau
   mengulang animasi), dan perhatikan **toast** di pojok kanan atas.
5. **Wizard upload** — pindah step terasa mengalir (crossfade); saat sukses, layar menahan sebentar
   sebelum pindah halaman.
6. **Halaman penilaian** — scroll (bar bawah solid, tanpa blur), isi skor (progres halus; saat semua
   terisi muncul pop kecil siap-approve), coba approve/hapus satu item (baris "mengecil" keluar dulu).
7. *(Opsional)* **Uji pengekangan gerak**: Windows → Pengaturan → Aksesibilitas → Efek visual →
   **Efek animasi: OFF** — aplikasi tetap enak dipakai, hanya tanpa gerakan.

---

## (e) Cara Restore

- Belum ada yang di-push. Branch `feat/motion-ux` adalah wadah eksperimen di atas `main` (`71e53c0`).
- Kembali sepenuhnya seperti semula: **`git checkout main`**. Branch eksperimen tetap ada di lokal;
  hapus dengan `git branch -D feat/motion-ux` bila sudah tidak diperlukan.

---

## (f) Keputusan & Catatan Tersisa

- **Dipertahankan secara sadar (keputusan koordinator):**
  1. Badge notifikasi tetap "pop" saat muat pertama (0→N) — sekali, halus, informatif.
  2. Dua blur kecil sisa: overlay filter-loading (2px) & scrim drawer mobile sidebar — keduanya
     intermiten, area kecil, dan tidak pernah tampil bersamaan.
- **Isu pre-existing di luar scope motion (kandidat pekerjaan terpisah):**
  1. `/sw.js` & `/manifest.webmanifest` ter-redirect 307 oleh `src/proxy.ts` saat belum login →
     registrasi Service Worker/PWA gagal (bukan dampak motion; perlu keputusan pengecualian matcher).
  2. Dependency `@tanstack/react-table` terpasang tapi 0 pemakaian — kandidat dihapus.
- **Tidak ada backlog motion tersisa.**

---

## (g) Daftar 14 Commit (`git log --oneline 71e53c0..HEAD`, terbaru → terlama)

```
ad5e041 docs(motion): apendiks gelombang 2 — cleanup round QA ronde 2
10492a6 fix(motion): penutupan QA ronde 2 — exit modal kondisional, guard hapus, a11y Dialog, hygiene
e0bda84 docs(motion): perjelas catatan verifikasi build fase 5
372a0d4 refactor(motion): pakai useStaggerOnce bersama di dashboard pegawai
b22195b docs(motion): fase 5 — verifikasi, crossfade status periode, badge notif pop + apendiks 'Hasil Gelombang 2'
7df1a48 feat(motion): fase 4 — halaman route group (modal→Dialog, grid-rows, exit collapse-out, guardrail export, crossfade wizard)
a003037 feat(motion): fase 3 — dashboard (FetchingBar CSS keyframe, chart entrance, expand grid-rows, collapse-out hapus)
23bcadf fix(motion): fix round gelombang 1 — RM exit fadeOut, palette 160ms, token panel/drawer, origin bell
b3b9679 docs(motion): apendiks 'Hasil Fase 0' — keputusan spike View Transitions
cc7aa84 feat(motion): fase 2 — UI primitives (exit bersama + konsolidasi token)
76859e4 feat(motion): fase 1 — shell & navigasi (View Transitions per route-group, pensiunkan RouteTransition)
8503c12 feat(motion): fase 0 — token extension + reduced-motion foundation
407810f docs(motion): audit UI/motion menyeluruh + spec implementable + 8 referensi motion
46f2d52 docs(motion): tambah MOTION-TECH — kajian kelayakan teknis & rencana eksekusi motion app-wide
```

*Catatan: daftar di atas = 14 commit proyek (kondisi saat penutupan QA); commit ke-15 di branch
adalah commit yang membawa laporan ini (`docs(motion): laporan penutup proyek + koreksi contoh G1 SPEC`).*
