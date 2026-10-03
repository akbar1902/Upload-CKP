# Penjelasan Lengkap: SIKAP — BPS Kabupaten Belitung

Dokumen ini menjelaskan secara menyeluruh tentang sistem **SIKAP (Sistem Rekap Capaian Kinerja Pegawai) — BPS Kabupaten Belitung**: tujuan aplikasi, aktor dan fitur per peran, alur kerja end-to-end (upload → penilaian → approval → export), arsitektur teknis aktual, standar format Excel, struktur codebase, skema database, dan status lifecycle.

---

## 1. Pendahuluan

**SIKAP** adalah aplikasi web internal BPS Kabupaten Belitung untuk mendigitalisasi pelaporan, rekapitulasi, dan penilaian Capaian Kinerja Pegawai (CKP) bulanan.

Masalah yang diselesaikan: pelaporan kinerja manual berbasis file Excel yang berserakan, sulit dipantau, sulit dinilai per Rencana Kinerja (RK), dan sulit direkap. SIKAP memusatkan semuanya ke database: satu file upload menjadi baris-baris `ckp_entries` yang bisa dinilai per-RK oleh ketua tim yang tepat, di-approve final oleh pimpinan, lalu diekspor sebagai PDF evaluasi / rekap Excel / ZIP.

---

## 2. Pengguna Sistem (Aktor)

Sistem memiliki **4 role** (`src/types/database.ts:5`):

1. **Anggota** (`anggota`, dulu bernama `pegawai`): pegawai yang melaporkan kegiatan harian/bulanan. Upload CKP sendiri di `/pegawai`, kelola RK sendiri di `/rencana_kinerja`, unduh PDF evaluasi sendiri.
2. **Ketua tim** (`ketua_tim`): menilai entri CKP **hanya untuk RK miliknya** (`rk_ketua_tim_mapping.ketua_tim_id = uid`). Dashboard `/ketua_tim`, detail per-RK `/ketua_tim/rk/[id]`, halaman penilaian `/penilaian/[upload_id]`. Juga bisa buka `/pegawai` untuk CKP sendiri.
3. **Pimpinan** (`pimpinan`): memantau semua pegawai, menilai semua upload, dan **satu-satunya yang bisa approval final** (`approved / rejected / revision_required / reopened`). Rute `/pimpinan`, `/pimpinan/approval`, `/pimpinan/monitoring-penilaian`, `/pimpinan/pegawai`, plus `/admin/export-penilaian`.
4. **Admin** (`admin`): mengelola user (`/admin/pegawai`), RK (`/admin/rk`), kunci periode (`/admin/periode`), audit log (`/admin/logs`), dan export. Di middleware (`src/lib/supabase/middleware.ts:118`) admin dihitung sebagai pimpinan untuk guard rute.

Hierarki guard: `isPimpinan = pimpinan || admin`; `isKetuaTim = ketua_tim || isPimpinan`; semua role bisa akses `/pegawai`.

---

## 3. Fitur Utama Berdasarkan Peran

### A. Anggota
- **Login** email & password (`/login`); sesi di-cache + refresh otomatis (`src/hooks/use-auth.tsx`).
- **Dashboard** (`/pegawai`): sapaan + jabatan/golongan/NIP, alert "CKP bulan ini belum diupload" dan "n CKP Perlu Revisi", 4 KPI (Total Upload, Rata-rata Progres, Disetujui, Menunggu Review — dihitung dari versi terbaru per bulan-tahun), riwayat dengan search/filter status/sort + toggle list/grid, hapus optimistik (dilarang bila `approved`).
- **Upload CKP** (`/pegawai/upload`): drag-drop `.xlsx/.xls` maks 5MB, pilih bulan/tahun (dicek kunci periode + upload versi terakhir), preview tabel + preview kalender cakupan triwulan, resolusi RK otomatis (exact → sub-RK → fuzzy kegiatan >0.90 → fuzzy RK bigram >0.95; RK asing dipetakan manual via modal tim), submit berversi (lama → `superseded`, baru → `submitted`) dengan **preservasi nilai** bila himpunan kegiatan per-RK sama persis.
- **Detail CKP** (`/pegawai/ckp/[id]`): rincian entri (RK/kegiatan/capaian/nilai/progres/bukti dukung/catatan koreksi), riwayat approval, kalender, search, export Excel, hapus.
- **Evaluasi** (`/pegawai/evaluasi-penilaian`): unduh PDF evaluasi sendiri (reuse UI admin).

### B. Ketua tim
- **Dashboard** (`/ketua_tim`): kartu agregasi per RK miliknya (entri milik sendiri dibuang; pimpinan yang membuka halaman ini hanya menilai ketua tim itu untuk RK tim lain).
- **Detail RK** (`/ketua_tim/rk/[id]`): menilai N pegawai sekaligus dalam 1 round-trip (`gradeRencanaKinerjaAction` dengan array upload IDs), optimistic update + rollback, navigasi Enter antar-input.
- **Halaman penilaian** (`/penilaian/[upload_id]`): nilai per-RK 0-100, catatan koreksi per entri (otomatis `submitted` → `revision_required`), pindah entri antar-RK (`moveEntriesAction`). Dukung mode triwulan T1-T4 (agregasi N upload satu pegawai). Nilai terkunci saat `approved`.
- **Kelola RK** (`/rencana_kinerja`): tab managed/my_rk, tambah/edit, self-assign, hapus; setiap mutasi menulis `audit_logs`.

### C. Pimpinan
- **Dashboard** (`/pimpinan`): ringkasan semua pegawai + filter bulan/tahun/status/nama + agregasi triwulan + realtime `ckp_uploads`.
- **Quick approval** (`/pimpinan/approval`): antrean `submitted/scored` + gate tombol (tidak bisa approve sebelum `allScored`).
- **Approval final** (modal di halaman penilaian): `approved / rejected / revision_required / reopened` + catatan (wajib kecuali approved). `approved` mengunci + mencatat `approved_at/by`; `reopened` membuka kembali + menghitung ulang `scored/submitted` dari nilai. Setiap aksi menulis `approvals` + `audit_logs`.
- **Monitoring penilaian** (`/pimpinan/monitoring-penilaian` via `getPendingScoringKetuaTim`): ketua tim mana menunggak nilai RK apa, per pegawai per RK; fallback ke pimpinan bila RK tak bermapping atau milik ketua itu sendiri.
- **Detail pegawai** (`/pimpinan/pegawai`, `/pimpinan/pegawai/[userId]`).
- **Export**: rekap Excel (`exportRekapToExcel`), PDF evaluasi per pegawai (`generateEvaluationPdf`: badge ≥99 Diatas hijau / 80-98 Sesuai biru / <80 Dibawah merah), bulk ZIP PDF, ZIP berkas asli dari bucket `ckp-files`, screenshot PNG (`html-to-image`).
- **Notifikasi kepatuhan**: daftar pegawai yang belum upload pada periode berjalan.

### D. Admin
- **Monitoring** (`/admin`): reuse dashboard pimpinan.
- **Kepegawaian** (`/admin/pegawai`): buat user (auth + users + profile), edit (+sync `user_metadata`), hapus tuntas (uploads/entries/approvals/assignments/logs/profile + `auth.admin.deleteUser`), reset password → `Password123!`, nonaktifkan (ban 10 tahun), ganti ketua tim (pindah mapping + demote/promote + warisi unit_kerja + sync JWT).
- **Rencana Kinerja** (`/admin/rk`, `/admin/rk/import`): bulk upsert `onConflict (rencana_kinerja, tim_kerja)`, tambah/pindah/hapus RK & sub-RK.
- **Periode** (`/admin/periode`): kunci/buka 12 bulan per tahun; tanpa baris = Terbuka. RLS memblokir insert/update pegawai saat terkunci; pimpinan tetap bisa approve.
- **Log** (`/admin/logs`): 200 `audit_logs` terbaru + search nama/aksi + filter entitas.
- **Export & monitoring penilaian**: sama seperti pimpinan (satu-satunya rute admin yang boleh dibuka pimpinan: `/admin/export-penilaian`).

---

## 4. Alur Kerja (Workflow) Sistem

1. **Persiapan**: pegawai mencatat kegiatan harian di template Excel CKP.
2. **Upload**: login → `/pegawai/upload` → pilih bulan/tahun (sistem cek `periode_ckp.is_locked` + versi terakhir via `checkPeriodStatusAction`) → drag-drop file → sistem parse client-side (`src/lib/excel/parser.ts`: sheet pertama, deteksi header, mapping kolom fleksibel, filter baris di luar periode triwulan) → preview tabel + kalender.
3. **Resolusi RK**: tiap baris dicocokkan ke kamus `rk_ketua_tim_mapping` (exact → sub-RK lokal → fuzzy). RK tak dikenal wajib dipetakan manual ke tim/RK sebelum submit.
4. **Submit**: `submitCkpUploadAction` (`src/app/actions/ckp.ts`): tolak bila versi terakhir `approved`; upload file ke Storage `ckp-files:{userId}/{tahun}/{bulan}/v{n}_{ts}_{file}`; versi lama → `superseded`; versi baru → `submitted` (v+1) + preservasi nilai + insert entries chunk 200 + catat audit. Redirect ke detail CKP.
5. **Penilaian ketua tim**: ketua tim membuka `/ketua_tim` → kartu RK → beri nilai 0-100 per RK (`gradeRencanaKinerjaAction`, `UPDATE ckp_entries ... WHERE upload_id IN (...) AND rencana_kinerja = X`). Status sinkron via admin client (bypass RLS): masih ada entry null → `submitted`; semua bernilai → `scored`. Opsional: catatan koreksi per entri (→ `revision_required`) atau pindah entri ke RK yang benar.
6. **Approval pimpinan**: pimpinan cek antrean → buka detail → pastikan semua RK bernilai (`allScored`) → `approved` (terkunci + `approved_at/by`) / `rejected` / `revision_required` + catatan. Semua aksi tercatat di `approvals` + `audit_logs`.
7. **Revisi / buka kembali**: pegawai upload ulang versi baru (nilai lama terbawa bila kegiatan sama); pimpinan bisa `reopened` CKP yang sudah approved untuk dinilai ulang.
8. **Rekap & export**: pimpinan/admin unduh rekap Excel, PDF evaluasi per pegawai atau bulk ZIP, ZIP berkas asli, atau screenshot PNG.

### Status lifecycle

`draft` → `submitted` (Menunggu Review) → `scored` (Sudah Dinilai) → `approved` (Disetujui, terkunci) / `rejected` (Ditolak) / `revision_required` (Perlu Revisi). Upload ulang: lama → `superseded` (Arsip), baru → `submitted`.

---

## 5. Arsitektur Teknis (aktual, per `package.json`)

- **Frontend**:
  - **Next.js `16.2.6` (App Router)** + React `19.2.4` + TypeScript `5` (script `dev`/`build` memakai flag `--webpack`, menghindari Turbopack default Next 16).
  - **Tailwind CSS `v4`** (+ `@tailwindcss/postcss`), font **Poppins** via `next/font`, `next-themes` (default light).
  - Komponen custom gaya shadcn/ui (`src/components/ui`), ikon **Lucide**, toast **Sonner**, top loader.
  - **React Query** (`@tanstack/react-query ^5.101`): stale 2 mnt, gc 30 mnt, tanpa refetch-on-focus; **React Table** (`^8.21`) untuk tabel kompleks.
  - **PWA** (`@ducanh2912/next-pwa`, `dest: public`, nonaktif saat dev) + `src/app/manifest.ts` (standalone, start `/`).
  - Providers (`src/app/layout.tsx`): `ErrorBoundary > QueryProvider > AuthProvider > ThemeProvider > RecoveryManager + KeepAliveManager`. Recovery: `visibilitychange/online` → `ensureSession` + invalidate tanpa skeleton flash. KeepAlive: ping `users limit 1` tiap 4 menit agar Supabase tidak cold-start.
- **Auth & routing**:
  - Klien singleton (`src/lib/supabase/client.ts`) + `createFreshClient()` untuk operasi pasca-idle; server cookie-based + `createAdminClient()` service-role bypass RLS (`src/lib/supabase/server.ts`).
  - `AuthProvider` (`src/hooks/use-auth.tsx`): fast path `getSession()` + fallback user dari JWT metadata, fetch profil background (join `users` + `employee_profiles`), refresh token didedup + timeout, safety timeout 15 dtk.
  - Guard terpusat di `src/proxy.ts` → `src/lib/supabase/middleware.ts`: validasi JWT tiap request, cache role di cookie `ckp-role-{uid}` 5 menit (±300ms → ±10ms), redirect per role, proteksi `/admin`, `/pimpinan`, `/ketua_tim`.
- **Backend (Supabase)**:
  - **PostgreSQL**: 10 tabel (lihat §6 struktur codebase / daftar di bawah): users, employee_profiles, ckp_uploads, ckp_entries, approvals, audit_logs, rk_ketua_tim_mapping, user_rk_assignments, periode_ckp, master_kegiatan_anggota. Skema final = hasil **20 migrasi** `001`→`020` (bukan cuma `001`).
  - **Auth**: email+password, JWT metadata (`full_name`, `role`, `nip`) sebagai fast path; trigger `handle_new_user` sinkron ke `users`.
  - **Storage**: bucket privat `ckp-files`, path `{userId}/{tahun}/{bulan}/v{n}_{ts}_{file}`; RLS: pemilik akses foldernya, pimpinan view all.
  - **RLS inti**: users/profile view semua bila login; uploads: pemilik + ketua/pimpinan view all, insert/update pemilik diblokir saat periode locked, pimpinan update bebas, hapus kecuali `approved`; entries: ketua scoped ke RK miliknya; approvals: pemilik view, pimpinan kelola; periode: baca bebas, tulis admin saja.
- **Server actions** (`src/app/actions/`): `ckp.ts` (upload/versioning/preservasi, pindah RK, catatan koreksi, hapus), `penilaian.ts` (grading per-RK + approval + audit), `pimpinan.ts` (wrapper tipis), `monitoring.ts` (`getPendingScoringKetuaTim`), `rencana-kinerja.ts` (CRUD RK + audit), `export.ts` (data PDF/rekap, batch 50 + paginasi 999), `admin.ts` (service-role: user, RK bulk, kunci periode), `auth.ts` (reset password langsung via `auth.admin`).
- **Pemrosesan dokumen**:
  - **SheetJS (`xlsx`)**: parse upload + export Excel detail/rekap.
  - **`jspdf + jspdf-autotable`**: PDF evaluasi A4 (profil pegawai vs penilai, hasil kerja grup per RK, badge warna, link bukti dukung aktif).
  - **`jszip + file-saver`**: bulk ZIP PDF + ZIP berkas asli.
  - **`html-to-image`**: screenshot PNG komponen.
  - **Zod + React Hook Form**: validasi form (login, RK, dsb).

---

## 6. Standar Format File Excel

Satu-satunya kolom wajib: **Kegiatan**. Kolom dikenali fleksibel (case-insensitive, exact → startsWith → contains); kolom asing masuk `extra_columns` + warning:

- No → nomor baris
- Tanggal Mulai / Tanggal Selesai (serial Excel + format Indonesia: `1-3 September 2026`, `01/09/2026 s/d 03/09/2026`)
- Jam Mulai / Jam Selesai (`HH:MM`)
- Rencana Kinerja
- Kegiatan / Uraian *(wajib)*
- Progres / % (angka, di-clamp 0-100 + warning bila dikoreksi)
- Capaian / Hasil / Output
- Data Dukung / Bukti Dukung / Link (Google Drive, bisa diklik di UI)

Filter periode triwulan (baris di luar periode di-skip; bila kosong, error menyebut bulan yang ditemukan di file):
- Bulan ke-1 triwulan (Jan/Apr/Jul/Okt): 1-25
- Bulan ke-2 (Feb/Mei/Agu/Nov): 26 bulan lalu - 25
- Bulan ke-3 (Mar/Jun/Sep/Des): 26 bulan lalu - akhir bulan

Kalender cakupan (`src/lib/ckp-calendar-utils.ts`): grid Senin-Minggu, badge `Lengkap` vs `n belum terisi`, tab bulan triwulan, dialog per-hari, libur nasional 2024-2027, weekend bukan hari kerja.

---

## 7. Struktur Proyek Codebase (aktual)

- `src/app/`: rute — `/` (redirect), `login/`, `pegawai/` (dashboard, `upload/`, `ckp/[id]/`, `evaluasi-penilaian/`), `ketua_tim/` (dashboard, `rk/[id]/`), `pimpinan/` (dashboard, `approval/`, `monitoring-penilaian/`, `pegawai/`, `pegawai/[userId]/`), `penilaian/[upload_id]/` (nilai + approval, dipakai ketua_tim & pimpinan), `rencana_kinerja/`, `admin/` (`pegawai/`, `rk/` + `rk/import/`, `periode/`, `logs/`, `export-penilaian/`, `monitoring-penilaian/`), `debug-auth/`, `actions/` (8 server actions), `layout.tsx`, `manifest.ts`.
- `src/components/`: `ui/` (button, card, badge, dialog, input, select, textarea, skeleton, logo, screenshot-button, error-boundary), `layout/` (sidebar, header), `dashboard/` (kpi-card, stat-card, activity-card, pegawai-card, status-badge, filter), `ckp/` (upload-dropzone, calendar-preview, approval-modal, approval-history, data-dukung-link), `providers/` (query, theme, recovery, keepalive).
- `src/lib/`: `supabase/` (client, server, middleware), `excel/` (parser, column-mapping, exporter), `export/` (pdf-generator, evaluasi-helper), `zip/` (exporter), `ckp-calendar-utils.ts`, `utils.ts`.
- `src/hooks/use-auth.tsx`: auth context global.
- `src/types/database.ts`: `UserRole`, `UploadStatus` (7 varian), `ApprovalAction` + tipe semua tabel.
- `supabase/migrations/001-020`: skema + RLS + seed (urutan: init → nilai → role+RK mapping → seed → RLS fixes → assignments → delete policies → admin/periode → admin account → cleanup → master kegiatan → scored → catatan koreksi → profiles).
- `supabase/*.sql`: skrip perbaikan ad-hoc (RLS, role sync, cleanup).
- `scripts/` + `*.js` di root: util node ad-hoc (cleanup/dedup RK, seed dari `Rekap_RK_Gabungan_14_Tim.xlsx`, cek agregat, debug mapping) — layak diarsipkan, bukan bagian aplikasi.
- `public/`: logo SIKAP (SVG/PNG), `sw.js`/workbox hasil build PWA.

---

**Ringkasan**: SIKAP adalah solusi terpadu berbasis database yang mengubah administrasi CKP manual menjadi alur terstruktur — upload berversi dengan preservasi nilai, penilaian per-RK oleh ketua tim yang tepat, approval final terkunci oleh pimpinan, monitoring tunggakan real-time, audit trail penuh, dan export PDF/Excel/ZIP — dibangun di atas Next.js 16 + React 19 + Tailwind v4 + Supabase.
