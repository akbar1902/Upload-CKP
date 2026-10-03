SIKAP — Sistem Rekap Capaian Kinerja Pegawai, aplikasi web internal BPS Kabupaten Belitung.
Menggantikan proses manual berbasis file dengan alur terpusat: anggota upload CKP bulanan (Excel, berversi, preservasi nilai) → ketua tim menilai per Rencana Kinerja miliknya → pimpinan memberi approval final yang terkunci + tercatat di audit log → rekap/export PDF, Excel, ZIP.

Untuk Anggota (`/pegawai`):

Upload Excel CKP per bulan (drag-drop, maks 5MB) dengan preview tabel + kalender cakupan triwulan
Resolusi RK otomatis (exact → fuzzy) + pemetaan manual bila tak dikenal
Dashboard KPI + riwayat + filter, detail CKP + riwayat approval + catatan koreksi
Upload ulang berversi (nilai lama terbawa bila kegiatan sama); terkunci bila sudah approved
Unduh PDF evaluasi sendiri + export Excel

Untuk Ketua tim (`/ketua_tim`, `/penilaian/[upload_id]`, `/rencana_kinerja`):

Menilai CKP hanya untuk RK miliknya (0-100 per RK, 1 round-trip untuk N pegawai)
Catatan koreksi per entri (otomatis → revision_required), pindah entri antar-RK
Mode triwulan T1-T4, nilai terkunci saat approved
Mengelola Rencana Kinerja (RK) tim + self-assign (tercatat di audit log)
Export penilaian (PDF/ZIP)

Untuk Pimpinan (`/pimpinan`, `/pimpinan/approval`, `/pimpinan/monitoring-penilaian`, `/admin/export-penilaian`):

Dashboard semua pegawai + filter (bulan, tahun, status, nama) + agregasi triwulan + realtime
Quick approval dengan gate allScored; approval final (approved/rejected/revision_required/reopened) + catatan
Monitoring tunggakan penilaian per ketua tim → pegawai → RK
Detail per pegawai, riwayat approval, notifikasi belum-submit
Export rekap Excel, PDF evaluasi, bulk ZIP, ZIP berkas asli

Untuk Admin (`/admin/*`):

Monitoring CKP, Kepegawaian (CRUD user + reset password + ban + ganti ketua tim)
Rencana Kinerja + import bulk, kunci/buka Periode (RLS blokir pegawai saat locked)
Audit log (200 terbaru + filter), export & monitoring penilaian

Tech Stack (aktual): Next.js 16.2.6 + React 19.2.4 + TypeScript 5 + Tailwind CSS v4 + Supabase (Auth/Postgres/Storage `ckp-files`) + React Query + xlsx + jspdf + jszip + PWA
