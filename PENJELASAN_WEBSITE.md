# Penjelasan Lengkap: CKP Digital — BPS Kabupaten Belitung

Dokumen ini menjelaskan secara menyeluruh tentang sistem **CKP Digital — BPS Kabupaten Belitung**, mulai dari tujuan aplikasi, fitur-fitur yang tersedia, alur penggunaan, hingga arsitektur teknis yang digunakan untuk membangun sistem ini.

---

## 1. Pendahuluan

**CKP Digital** adalah sebuah aplikasi web internal yang dirancang khusus untuk Badan Pusat Statistik (BPS) Kabupaten Belitung. Tujuan utama dari aplikasi ini adalah untuk mendigitalisasi proses pelaporan, rekapitulasi, dan penilaian Capaian Kinerja Pegawai (CKP). 

Dengan aplikasi ini, proses pelaporan kinerja yang sebelumnya mungkin memakan waktu dan melibatkan banyak dokumen fisik/tercecer kini menjadi terpusat, transparan, dan mudah dipantau baik oleh pegawai maupun pimpinan.

---

## 2. Pengguna Sistem (Aktor)

Sistem ini dirancang untuk dua jenis pengguna utama, yaitu:

1. **Pegawai**: Staf atau pegawai BPS yang bertugas untuk melaporkan kegiatan kinerja harian/bulanan mereka.
2. **Pimpinan**: Atasan atau pimpinan BPS yang bertugas untuk memantau, mereview, dan memberikan persetujuan (approval) atau penilaian terhadap laporan kinerja pegawai.

---

## 3. Fitur Utama Berdasarkan Peran

### A. Fitur untuk Pegawai
- **Autentikasi Aman**: Login menggunakan email dan password yang telah didaftarkan.
- **Upload Laporan CKP**: Pegawai dapat mengunggah file Excel berisi data CKP bulanan mereka.
- **Preview Data**: Sebelum data benar-benar disubmit (dikirim), pegawai dapat mempratinjau data dari file Excel untuk memastikan tidak ada kesalahan.
- **Pantau Status**: Melihat status laporan yang telah diunggah (misalnya: *Draft*, *Menunggu Persetujuan*, *Disetujui*, atau *Perlu Revisi*).
- **Upload Ulang & Revisi**: Jika laporan masih berstatus draft atau dikembalikan oleh pimpinan untuk direvisi, pegawai dapat mengunggah ulang perbaikannya.
- **Export Data**: Mengunduh kembali data laporan ke dalam format Excel.

### B. Fitur untuk Pimpinan
- **Dashboard Eksekutif**: Halaman ringkasan yang menampilkan statistik pelaporan seluruh pegawai.
- **Pencarian & Filter**: Memudahkan pimpinan mencari data berdasarkan bulan, tahun, status pelaporan, atau nama pegawai tertentu.
- **Review Detail**: Pimpinan dapat melihat secara rinci rincian kegiatan harian yang dilaporkan oleh setiap pegawai.
- **Sistem Approval (Persetujuan)**: Pimpinan memiliki kewenangan untuk:
  - **Approve (Setujui)**: Menerima laporan CKP.
  - **Reject (Tolak)**: Menolak laporan (jika tidak sesuai).
  - **Minta Revisi**: Mengembalikan laporan ke pegawai beserta catatan perbaikan.
- **Akses Bukti Dukung**: Pimpinan dapat langsung membuka tautan/link bukti dukung pekerjaan (biasanya berupa link Google Drive) yang dilampirkan pegawai.
- **Riwayat Approval**: Melacak riwayat persetujuan yang telah dilakukan.
- **Notifikasi Kepatuhan**: Melihat pegawai mana saja yang belum mengunggah laporan CKP mereka pada periode tertentu.
- **Export Rekapitulasi**: Mengunduh seluruh rekap data CKP ke dalam format Excel untuk keperluan pelaporan lebih lanjut.

---

## 4. Alur Kerja (Workflow) Sistem

1. **Persiapan Data**: Pegawai mencatat kegiatan sehari-hari di template Excel CKP yang telah disediakan.
2. **Upload**: Pegawai login ke aplikasi dan mengunggah file Excel tersebut untuk bulan yang bersangkutan.
3. **Pengecekan Sistem**: Sistem akan membaca file Excel (memproses kolom seperti Kegiatan, Tanggal, Jam, Progres, Bukti Dukung) dan menampilkannya di layar (Preview).
4. **Submit**: Pegawai menyetujui preview dan mengirim data. Status berubah menjadi *Menunggu Persetujuan*.
5. **Review Pimpinan**: Pimpinan login, melihat adanya laporan baru yang masuk, lalu memeriksa detail pekerjaan dan mengeklik tautan bukti dukung.
6. **Keputusan**: 
   - Jika disetujui, status menjadi *Selesai/Disetujui*.
   - Jika ada yang kurang, pimpinan memberikan catatan revisi, status berubah menjadi *Perlu Revisi*, dan pegawai harus mengunggah perbaikan.

---

## 5. Arsitektur Teknis (Tech Stack)

Aplikasi ini dibangun menggunakan teknologi web modern dan berkinerja tinggi, yang memastikan aplikasi berjalan cepat, responsif, dan aman:

- **Frontend (Tampilan Utama)**:
  - **Next.js 14 (App Router)**: Framework React modern yang memungkinkan performa tinggi dan rendering yang optimal.
  - **TypeScript**: Bahasa pemrograman yang memastikan kode lebih aman dari bug dan mudah dipelihara.
  - **Tailwind CSS**: Framework styling untuk membangun antarmuka pengguna yang modern, responsif (mendukung desktop & mobile), dan rapi.
  - **Komponen UI**: Menggunakan pendekatan komponen *headless* dan custom (gaya *shadcn/ui*) agar seragam dan mudah disesuaikan.
  - **Lucide React**: Untuk kumpulan ikon yang konsisten.
  - **Sonner**: Sistem notifikasi interaktif di layar (*toast notifications*).
  - **React Query (@tanstack/react-query)**: Digunakan untuk manajemen state pengambilan data (fetching) secara efisien dan caching.
  - **React Table (@tanstack/react-table)**: Untuk menampilkan tabel data yang kompleks, interaktif, dan mudah di-filter.

- **Backend & Database (Infrastruktur)**:
  - **Supabase**: Bertindak sebagai "Backend-as-a-Service".
    - **PostgreSQL**: Database relasional tangguh tempat menyimpan seluruh data user dan catatan CKP.
    - **Supabase Auth**: Menangani proses login dan manajemen sesi (aman dan berstandar industri).
    - **Supabase Storage**: Tempat penyimpanan file yang diunggah oleh user (seperti file Excel).

- **Pemrosesan Data**:
  - **SheetJS (xlsx)**: Pustaka yang sangat tangguh untuk membaca (parsing) data dari file Excel yang diunggah pegawai, dan mengubah data dari web menjadi file Excel saat fitur Export digunakan.
  - **Zod & React Hook Form**: Untuk validasi formulir guna memastikan data yang dimasukkan (misalnya saat login atau submit) sudah benar formatnya sebelum diproses.

---

## 6. Standar Format File Excel

Agar aplikasi dapat membaca laporan kinerja dengan benar, file Excel yang diunggah pegawai memiliki standar kolom minimal, yaitu:
- No
- Tanggal Mulai / Tanggal Selesai
- Jam Mulai / Jam Selesai
- Rencana Kinerja
- **Kegiatan** *(wajib)*
- Progres (%)
- Capaian
- Data Dukung (berupa link, misalnya Google Drive)

Setiap kolom tambahan di luar daftar di atas tetap akan dibaca dan disimpan sebagai *extra data*.

---

## 7. Struktur Proyek Codebase

Bagi pengembang (developer), proyek ini tersusun secara modular:
- `src/app/`: Berisi rute halaman. Terbagi menjadi halaman utama (`/`), halaman `login/`, ruang lingkup `/pegawai/`, dan ruang lingkup `/pimpinan/`.
- `src/components/`: Tempat komponen antar-muka yang bisa didaur ulang. Seperti kartu statistik (`dashboard`), tabel (`ckp`), dan komponen dasar tombol atau input (`ui`).
- `src/lib/`: Kode logika untuk menghubungkan aplikasi ke database Supabase dan fungsi untuk memproses Excel.
- `src/hooks/`: Kode bantuan *React hook* buatan sendiri untuk mempermudah logika berulang.
- `src/types/`: Definisi bentuk data agar konsisten dan menghindari *error* (*TypeScript Types*).
- `supabase/`: Skema database dan fungsi otomatisasi awal jika baru mendeploy sistem.

---

**Ringkasan**: CKP Digital BPS Belitung adalah solusi modern terpadu yang membebaskan proses administrasi pegawai dari kerja manual berbasis kertas dan file yang berserakan, menjadi alur yang terstruktur, berbasis data (*database-driven*), mudah dilaporkan, dan dapat diandalkan oleh pimpinan untuk pengambilan keputusan yang lebih baik.
