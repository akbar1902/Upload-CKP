# SIKAP — Pratinjau Redesign Antarmuka

Prototipe HTML statis untuk merombak tampilan **SIKAP (Sistem Informasi Capaian Kinerja Pegawai) — BPS Kabupaten Belitung**. Semua informasi dan fungsi aplikasi lama tetap diwakili, hanya tampilan, hierarki, dan alur visualnya yang dirapikan.

> Berkas utama: **`preview/index.html`** — buka langsung di browser (klik dua kali) atau lewat server lokal:
> `python -m http.server 5199 --directory preview` lalu buka `http://localhost:5199/index.html`

> **Branch:** `ui/login-refresh` — berisi baseline 23 layar + penyempurnaan halaman login ("CKP sudah diunggah, Hati Tenang") dan tombol pasang PWA di sidebar.

---

## 0. Catatan revisi branch `ui/login-refresh`

- **Halaman login** mengikuti komposisi panel gelap: logo SIKAP + label "Portal Internal", dua kartu laporan mengambang (Capaian Kinerja & Sudah Dinilai), seal progres 26/32 dengan cincin 81%, orbit berputar halus, kartu melayang, dan bar yang terisi saat dibuka.
- **Slogan panel login hanya satu kalimat**: *"CKP sudah diunggah, Hati Tenang"* — tanpa teks tambahan apa pun di area itu. Di layar kecil panel ilustrasi disembunyikan dan slogan muncul di atas kartu login.
- **Tombol pasang PWA ada di sidebar** (`Pasang Aplikasi · PWA · Gratis · App`) — selalu terlihat, berubah jadi ikon saja saat sidebar diciutkan.

---

## 1. Ringkas: apa yang berubah

| Aspek | Sebelum | Pratinjau ini |
|---|---|---|
| **Arah visual** | Neumorphism earthy, kartu putih tebal, banyak pil | Editorial-institusional: kanvas kertas hangat, kartu tipis ber-garis rambut, sidebar hijau pinus |
| **Tipografi** | Poppins untuk semua | `Instrument Serif` untuk angka/judul + `Plus Jakarta Sans` untuk UI |
| **Palet** | Teal + sage + terracotta (dipertahankan) | Teal tetap jadi primary, coral untuk perhatian, gold untuk skor, ditata ulang jadi token konsisten |
| **Navigasi** | Sidebar putih, menu datar | Sidebar gelap dengan grup menu per peran + pencarian cepat `Ctrl+K` + drawer di layar kecil |
| **Dashboard** | KPI + daftar panjang | Hero ringkas, KPI tegas, badge distribusi status, panel fokus, dan rail aktivitas |
| **Tabel & kartu** | Padat, banyak gaya berbeda | Satu bahasa komponen: `.card`, `.stat`, `.badge`, `.data`, `.btn` dengan dark mode penuh |

Yang **dipertahankan**: logo SIKAP, warna teal BPS, frasa "CKP sudah diupload, Hati Tenang", istilah teknis (RK, Sub-RK, periode triwulan, gate penilaian), serta seluruh label status.

---

## 2. Kontrol pratinjau (bilah hitam di atas)

- **Anggota / Ketua Tim / Pimpinan / Admin** — ganti persona & menu sesuai peran (persona ikut berubah).
- **Cari (Ctrl+K)** — command palette: cari semua layar + aksi (ganti tema, ganti password, keluar).
- **Semua Layar** — indeks 23 layar; membukanya otomatis memindah peran yang sesuai.
- **Ikon bulan/matahari** — tema terang/gelap (tersimpan di `localStorage`).
- Di dalam aplikasi: `Esc` menutup modal/palette, klik backdrop juga menutup.

---

## 3. Peta 23 layar pratinjau ↔ rute aplikasi

| # | Layar pratinjau | Peran | Rute lama |
|---|---|---|---|
| 1 | `login` | publik | `/login` |
| 2 | `reset-password` | publik | `/reset-password` |
| 3 | `dashboard-anggota` | anggota | `/pegawai` |
| 4 | `upload-ckp` | anggota/ketua | `/pegawai/upload` |
| 5 | `detail-ckp` | anggota | `/pegawai/ckp/[id]` |
| 6 | `dashboard-ketua` | ketua tim | `/ketua_tim` |
| 7 | `detail-rk` | ketua tim | `/ketua_tim/rk/[id]` |
| 8 | `penilaian-ckp` | ketua/pimpinan | `/penilaian/[upload_id]` |
| 9 | `dashboard-pimpinan` | pimpinan | `/pimpinan` |
| 10 | `persetujuan-cepat` | pimpinan | `/pimpinan/approval` |
| 11 | `monitoring-penilaian` | pimpinan/admin | `/pimpinan/monitoring-penilaian` |
| 12 | `data-pegawai` | pimpinan | `/pimpinan/pegawai` |
| 13 | `detail-pegawai` | pimpinan | `/pimpinan/pegawai/[userId]` |
| 14 | `monitoring-admin` | admin | `/admin` |
| 15 | `kepegawaian` | admin | `/admin/pegawai` |
| 16 | `manajemen-rk` | admin | `/admin/rk` |
| 17 | `import-rk` | admin | `/admin/rk/import` |
| 18 | `pengaturan-periode` | admin | `/admin/periode` |
| 19 | `log-aktivitas` | admin | `/admin/logs` |
| 20 | `analitik` | pimpinan/admin | `/analitik` |
| 21 | `evaluasi-penilaian` | semua | `/admin/export-penilaian`, `/pegawai/evaluasi-penilaian` |
| 22 | `rencana-kinerja` | semua | `/rencana_kinerja` |
| 23 | `komponen` | referensi | — (halaman panduan visual baru) |

Halaman teknis `debug-auth` dan `~offline` tidak dibuat ulang karena bukan bagian alur pengguna (hanya utilitas debug & fallback PWA). Pola fallback offline tetap tersedia lewat komponen *empty state*/error yang sama.

---

## 4. Matriks cakupan fungsi (tidak ada yang hilang)

### 4.1 Autentikasi & akun
| Fungsi lama | Lokasi di pratinjau |
|---|---|
| Login email + password, validasi, pesan error | `login` (submit berfungsi → dashboard; alert error tersedia di panduan visual) |
| Tampilkan/sembunyikan password | `login`, `reset-password`, modal Ganti Password |
| Catatan "Lupa password? Hubungi Admin" | `login` |
| Reset password dari tautan email + validasi 6 karakter | `reset-password` |
| Ganti password (modal), sukses state | Modal **Ganti Password** (`Panduan Visual`, bilah sidebar) |
| Ganti tema, keluar, pasang PWA | Bilah pratinjau, sidebar footer, `Panduan Visual` |
| Command palette Ctrl+K (navigasi + aksi) | Semua layar ber-shell |

### 4.2 Anggota
| Fungsi lama | Lokasi |
|---|---|
| Sapaan + jabatan/golongan/NIP | `dashboard-anggota` |
| Alert "CKP bulan ini belum diunggah" + CTA | `dashboard-anggota` |
| Alert "n CKP perlu revisi" | `dashboard-anggota` |
| 4 KPI (Total Upload, Rata-rata Progres, Disetujui, Menunggu Review) | `dashboard-anggota` |
| Riwayat + search + filter status + urutkan + toggle list/grid | `dashboard-anggota` (semuanya berfungsi) |
| Hapus CKP optimistik + konfirmasi + guard status approved | Baris riwayat & `detail-ckp` (modal konfirmasi) |
| Upload wizard: periode + kunci periode + status versi + drag-drop 5 MB | `upload-ckp` langkah 1 |
| Preview tabel 10 baris + total baris | `upload-ckp` langkah 2 |
| Preview kalender cakupan hari kerja + badge Lengkap/n belum terisi | `upload-ckp` langkah 2, `detail-ckp`, `penilaian-ckp` |
| Mapping RK tak dikenal (tim + RK master) | `upload-ckp` langkah 3 |
| Progress upload bertahap + batal | Modal **Progress Upload** |
| Detail entri: RK/kegiatan/capaian/nilai/progres/bukti/catatan koreksi | `detail-ckp` |
| Export Excel, upload ulang, hapus | `detail-ckp` |
| Riwayat review (approved/rejected/revisi/reopened) | `detail-ckp`, `penilaian-ckp` |
| Unduh PDF evaluasi sendiri | `evaluasi-penilaian` (mode pegawai menyembunyikan pemilih pegawai & bulk) |

### 4.3 Ketua Tim
| Fungsi lama | Lokasi |
|---|---|
| Kartu agregasi per RK + status Selesai/Perlu Dinilai/Belum Ada | `dashboard-ketua` |
| Search RK/tim, filter status, dropdown lompat ke RK, export rekap | `dashboard-ketua` |
| Nilai per RK 0–100, simpan Enter + pindah baris, indikator tersimpan | `detail-rk`, `penilaian-ckp` |
| Tandai kegiatan "perlu diperbaiki" + catatan | Modal **Tandai Perlu Diperbaiki** (`detail-rk`) |
| Pindah kegiatan antar-RK (koreksi RK) | Modal **Pindah/Koreksi RK** (`penilaian-ckp`) |
| Mode triwulan T1–T4: agregasi bulanan + nilai terkunci | `Panduan Visual` (kartu Mode Triwulan) + filter periode triwulan di semua dashboard |
| Gate "semua RK dinilai" sebelum approve | Sticky bar `penilaian-ckp`, `persetujuan-cepat` (baris non-siap: tombol disabled + "n RK belum dinilai") |

### 4.4 Pimpinan
| Fungsi lama | Lokasi |
|---|---|
| Dashboard semua pegawai + filter bulan/tahun/status/nama | `dashboard-pimpinan` |
| Agregasi triwulan + realtime (indikator "diperbarui via realtime") | `dashboard-pimpinan` |
| Kartu pegawai: kegiatan, capaian, skor, progres, status, belum lapor | `dashboard-pimpinan` |
| Persetujuan cepat: antrean, gate, setujui semua yang siap | `persetujuan-cepat` + modal konfirmasi bulk |
| Approval final 4 aksi: setujui / tolak / minta revisi / buka kembali + catatan wajib | Modal **Review CKP** & **Buka Kembali Penilaian** |
| Monitoring ketua tim menunggak (per pegawai per RK) | `monitoring-penilaian` (accordion 2 tingkat) |
| Direktori pegawai + detail pegawai + riwayat CKP | `data-pegawai`, `detail-pegawai` |
| Export rekap Excel, ZIP berkas asli, screenshot bagian | Tombol aksi di `dashboard-pimpinan` |
| Notifikasi kepatuhan (belum upload) | Chip **Belum Lapor 5** + kartu "Belum ada data" |
| Riwayat notifikasi + tandai dibaca | Panel lonceng di header |

### 4.5 Admin
| Fungsi lama | Lokasi |
|---|---|
| Monitoring CKP (dashboard pimpinan versi admin) | `monitoring-admin` |
| Kepegawaian: tambah, edit profil & jabatan, hapus tuntas, reset password default, nonaktifkan/aktifkan, ganti ketua tim | `kepegawaian` + 5 modal terkait |
| RK: statistik tim/RK/Sub-RK, grup per tim, tambah RK, tambah/hapus/pindah Sub-RK, hapus RK, arsip tahun | `manajemen-rk` |
| Import dataset ZIP / Excel / JSON, unduh template, dry-run, simpan ke database, laporan impor | `import-rk` |
| Kunci/buka 12 periode per tahun + dialog konfirmasi | `pengaturan-periode` |
| Log aktivitas 200 terbaru + cari + filter entitas | `log-aktivitas` |
| Analitik: 5 KPI, tren 12 bulan, distribusi status, SLA, tunggakan per ketua tim, tabel beban | `analitik` |
| Export & monitoring penilaian | `evaluasi-penilaian`, `monitoring-penilaian` |

### 4.6 Export & dokumen
| Fungsi lama | Lokasi |
|---|---|
| PDF evaluasi A4: profil pegawai vs penilai, hasil kerja per RK, badge umpan balik, link bukti dukung, tanda tangan | `evaluasi-penilaian` (dokumen persis) |
| Bulk ZIP PDF semua pegawai | Tombol **Download Semua (26 ZIP)** |
| Cetak/print (print CSS menyembunyikan chrome) | Tombol **Cetak / Print** |
| Keterangan batas nilai 99–100 / 80–98 / 0–79 | Di bawah dokumen evaluasi |
| Excel detail CKP & rekap nilai | Tombol Export di `detail-ckp`, `penilaian-ckp`, `dashboard-ketua`, header pimpinan |
| ZIP berkas asli dari Storage | Ikon ZIP di `dashboard-pimpinan` |
| Screenshot PNG | Ikon screenshot di rekap pegawai & monitoring |

### 4.7 Status lifecycle
`draft → submitted → scored → approved / rejected / revision_required / reopened / superseded` — semua badge, warna, dan contohnya ada di **`Panduan Visual` → Badge Status**, dan dipakai konsisten di seluruh layar.

---

## 5. Interaksi yang benar-benar berfungsi di prototipe

- Navigasi antar-layar (sidebar, indeks, command palette, tautan dalam halaman).
- Ganti peran → persona, menu, dan halaman awal ikut berubah.
- Tema terang/gelap (tersimpan).
- Modal: approval, bulk approve, buka kembali, ganti password, tambah/edit pegawai, ganti ketua tim, reset/toggle/hapus, tambah RK/Sub-RK, pindah Sub-RK, hapus tahun, kunci periode, pindah RK, tandai perbaikan, progress upload, konfirmasi impor.
- Pencarian, filter status (select & chip), urutkan, toggle list/grid/kalender, expand/collapse kartu & accordion.
- Stepper upload 3 langkah + wizard pane.
- Toast untuk aksi yang disimulasikan (export, simpan, kirim email, dsb.).
- Login → dashboard (loading singkat), logout, tandai notifikasi dibaca.
- Print dokumen evaluasi.

---

## 6. Struktur berkas

```
preview/
├─ index.html        # shell + ikon sprite + bilah pratinjau
├─ styles.css        # token warna/tipografi + komponen dasar
├─ screens.css       # gaya per layar (login, dashboard, kalender, dokumen, dll.)
├─ screens-core.js   # login, reset, dashboard anggota, upload, detail CKP, evaluasi
├─ screens-review.js # ketua tim, detail RK, penilaian, pimpinan, monitoring, pegawai
├─ screens-admin.js  # kepegawaian, RK, import, periode, log, analitik, panduan visual
├─ app.js            # navigasi per peran, modal, command palette, filter, tema
├─ _frame.html       # helper cek breakpoint (iframe lebar tetap, mis. ?w=1440&s=login)
└─ assets/           # logo SIKAP (versi terang & krem)
```

Tidak menyentuh kode aplikasi di `src/`. Semuanya statis: tanpa Supabase, tanpa Next.js, angka contoh (dummy) yang konsisten antar layar.

---

## 7. Langkah implementasi yang disarankan (setelah disetujui)

1. **Token dulu** — ganti isi `src/app/globals.css` dengan token dari `preview/styles.css` (warna, radius, shadow, font). Ini otomatis merombak seluruh halaman yang memakai variabel lama.
2. **Shell** — port `sidebar.tsx` + `header.tsx` + `command-palette.tsx` ke struktur baru (sidebar gelap, breadcrumb, pencarian pill).
3. **Komponen dasar** — `card`, `button`, `badge`, `input`, `dialog`, `stat`, `table` diselaraskan ke kelas komponen di `styles.css`.
4. **Halaman per halaman** — mulai dari `login`, `pegawai`, `upload`, lalu `penilaian`/`pimpinan`, terakhir admin & analitik.
5. **Verifikasi** — cek ulang RLS/guard tidak berubah; semua ini murni presentasi. Ikuti aturan repo: baca `node_modules/next/dist/docs/` sebelum menyentuh kode Next.js 16.

---

*Dibuat sebagai pratinjau desain — bukan build produksi. Data, nama, dan angka di dalamnya fiktif untuk keperluan demonstrasi.*
