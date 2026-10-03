# SIKAP — BPS Kabupaten Belitung

Sistem Rekap Capaian Kinerja Pegawai (CKP) internal BPS Kabupaten Belitung.
Menggantikan proses manual berbasis file dengan alur terpusat:
pegawai upload CKP bulanan → ketua tim menilai per Rencana Kinerja (RK) →
pimpinan memberi approval final → rekap/export PDF, Excel, ZIP.

## Peran & Akses Rute

| Role | Rute utama | Wewenang |
|---|---|---|
| `anggota` | `/pegawai` | Upload CKP sendiri, kelola RK sendiri, unduh evaluasi PDF sendiri |
| `ketua_tim` | `/ketua_tim`, `/ketua_tim/rk/[id]`, `/penilaian/[upload_id]` | Menilai entri CKP **hanya untuk RK miliknya** (`rk_ketua_tim_mapping.ketua_tim_id = uid`); juga bisa buka `/pegawai` untuk CKP sendiri |
| `pimpinan` | `/pimpinan`, `/pimpinan/approval`, `/pimpinan/monitoring-penilaian`, `/pimpinan/pegawai`, `/penilaian/[upload_id]`, `/admin/export-penilaian` | Lihat + nilai semua upload, satu-satunya yang bisa approve final / buka kembali; juga bisa `/ketua_tim` dan `/pegawai` |
| `admin` | `/admin/*` (monitoring, pegawai, RK, periode, logs, export-penilaian, monitoring-penilaian) | Kelola user, RK, kunci periode, lihat audit log; di middleware dihitung sebagai pimpinan |

Catatan: role lama `pegawai` otomatis dikonversi ke `anggota` oleh middleware.
Rute `/rencana_kinerja` bisa diakses semua role (tab managed/my_rk menyesuaikan).
Rute `/` selalu redirect ke `/login`; middleware yang memutuskan tujuan akhir per role.

## Fitur Utama

### Anggota (pegawai)
- Login email & password
- Dashboard: sapaan + jabatan/golongan/NIP, alert CKP bulan ini & revisi, 4 KPI (Total Upload, Rata-rata Progres, Disetujui, Menunggu Review), riwayat + search/filter/sort + toggle list/grid
- Upload Excel CKP per bulan (drag-drop `.xlsx/.xls`, maks 5MB) dengan preview tabel + preview kalender
- Resolusi RK otomatis: exact master → sub-RK lokal → fuzzy kegiatan (>0.90) → fuzzy RK bigram (>0.95); RK tak dikenal dipetakan manual via modal tim
- Upload ulang berversi (v+1, versi lama jadi `superseded`); **nilai yang sudah diberikan ikut terbawa** bila himpunan kegiatan per-RK sama persis
- Upload ulang & hapus dilarang bila status `approved`
- Detail CKP: rincian entri, riwayat approval, catatan koreksi reviewer, kalender cakupan, search, export Excel, hapus
- Evaluasi penilaian: unduh PDF evaluasi sendiri (`/pegawai/evaluasi-penilaian`)

### Ketua tim
- Dashboard agregasi kartu per RK (hanya RK miliknya; entri milik sendiri dibuang)
- Detail RK: nilai N pegawai sekaligus dalam 1 round-trip (optimistic update + rollback)
- Halaman penilaian per upload (`/penilaian/[upload_id]`): nilai per-RK 0-100, beri catatan koreksi per entri (otomatis ubah `submitted` → `revision_required`), pindah entri antar-RK
- Dukung mode triwulan (T1-T4, agregasi N upload)
- Kelola RK tim via `/rencana_kinerja` (tambah/edit, self-assign, hapus; tiap mutasi tercatat di audit log)

### Pimpinan
- Dashboard semua pegawai + filter bulan/tahun/status/nama + agregasi triwulan T1-T4 + realtime
- Quick approval (`/pimpinan/approval`): list `submitted/scored` + gate `allScored`
- Approval final di halaman penilaian: `approved / rejected / revision_required / reopened` + catatan (wajib kecuali approved); `reopened` menghitung ulang `scored/submitted` dari nilai; tiap aksi tulis `approvals` + `audit_logs`
- Monitoring pending scoring (`/pimpinan/monitoring-penilaian`): siapa ketua tim menunggak nilai apa, fallback ke pimpinan bila RK tak bermapping/milik ketua itu sendiri
- Detail per pegawai (`/pimpinan/pegawai`, `/pimpinan/pegawai/[userId]`)
- Export: rekap Excel, PDF evaluasi, bulk ZIP PDF, ZIP berkas asli, screenshot PNG
- Akses `/admin/export-penilaian` (satu-satunya rute admin yang boleh pimpinan)

### Admin
- Monitoring CKP (reuse dashboard pimpinan)
- Kepegawaian (`/admin/pegawai`): buat user (auth + users + profile), edit (+sync `user_metadata`), hapus (bersihkan uploads/entries/approvals/assignments/logs/profile + `auth.admin.deleteUser`), reset password → `Password123!`, nonaktifkan (ban 10 tahun), ganti ketua tim (pindah mapping + demote/promote + warisi unit_kerja + sync JWT)
- Rencana Kinerja (`/admin/rk` + `/admin/rk/import`): bulk upsert, tambah/pindah/hapus RK & sub-RK
- Periode (`/admin/periode`): kunci/buka 12 bulan per tahun (tanpa baris = Terbuka); pegawai diblokir insert/update saat terkunci, pimpinan tetap bisa approve
- Log (`/admin/logs`): 200 audit log terbaru + search/filter entitas
- Export-penilaian + monitoring-penilaian

## Status Upload Lifecycle

`draft` → `submitted` (Menunggu Review) → `scored` (Sudah Dinilai, semua entri bernilai) →
`approved` (Disetujui, terkunci) / `rejected` (Ditolak) / `revision_required` (Perlu Revisi).
Upload ulang: versi lama → `superseded` (Diganti/Arsip), versi baru → `submitted`.
Reviewer memberi catatan koreksi pada entri `submitted` → otomatis `revision_required`.

## Tech Stack (aktual, per `package.json`)

- **Framework**: Next.js `16.2.6` (App Router) + React `19.2.4` + TypeScript `5` (script `dev`/`build` pakai flag `--webpack`)
- **Styling**: Tailwind CSS `v4` + `@tailwindcss/postcss`, font Poppins (`next/font`), `next-themes`, komponen custom gaya shadcn/ui
- **Backend**: Supabase (`supabase-js ^2.106.2`, `@supabase/ssr ^0.10.3`) — Auth, PostgreSQL, Storage (bucket privat `ckp-files`)
- **Data**: `@tanstack/react-query ^5.101.0` (+devtools), `@tanstack/react-table ^8.21.3`, `react-hook-form + zod`
- **Dokumen**: `xlsx` (parse + export Excel), `jspdf + jspdf-autotable` (PDF evaluasi A4), `jszip + file-saver` (bulk ZIP), `html-to-image` (screenshot PNG)
- **Lainnya**: `framer-motion`, `lucide-react`, `date-fns`, `sonner` (toast), `nextjs-toploader`, `@ducanh2912/next-pwa` (PWA, `dest: public`, nonaktif saat dev)

## Setup

### 1. Prerequisites
- Node.js 18+, npm, akun Supabase

### 2. Buat project Supabase
1. Buat project di [supabase.com](https://supabase.com)
2. Di **SQL Editor**, jalankan migrasi **berurutan** `supabase/migrations/001_*.sql` → `020_*.sql`
   (bukan cuma `001`; skema final hasil 20 migrasi: users, employee_profiles,
   ckp_uploads, ckp_entries, approvals, audit_logs, rk_ketua_tim_mapping,
   user_rk_assignments, periode_ckp, master_kegiatan_anggota)
3. (Opsional) Jalankan `supabase/seed.sql` untuk data contoh
4. Buat Storage bucket privat bernama `ckp-files`
5. Catat URL + keys dari **Settings > API**

### 3. Buat user
- Via panel **Admin → Kepegawaian** (disarankan), atau manual di **Authentication > Users**
  dengan `user_metadata: {"full_name": "...", "role": "anggota|ketua_tim|pimpinan|admin", "nip": "..."}`
- Role pertama (admin/pimpinan awal) dibuat manual, sisanya bisa dari panel admin

### 4. Environment
Buat file `.env.local` di root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Install & run
```bash
npm install
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000). Verifikasi: `npm run lint`, `npm run build`.

## Struktur Folder (aktual)

```
src/
├── app/                    # Routes (App Router)
│   ├── login/              # Login
│   ├── pegawai/            # Dashboard, upload, ckp/[id], evaluasi-penilaian
│   ├── ketua_tim/          # Dashboard, rk/[id]
│   ├── pimpinan/           # Dashboard, approval, monitoring-penilaian, pegawai
│   ├── penilaian/[upload_id]/  # Halaman nilai + approval (dipakai ketua_tim & pimpinan)
│   ├── rencana_kinerja/    # Kelola RK (semua role)
│   ├── admin/              # pegawai, rk (+import), periode, logs, export-penilaian, monitoring-penilaian
│   ├── debug-auth/         # Bandingkan JWT role vs DB role
│   └── actions/            # Server actions: admin, auth, ckp, export, monitoring, penilaian, pimpinan, rencana-kinerja
├── components/
│   ├── ui/                 # button, card, badge, dialog, input, select, textarea, skeleton, logo, screenshot-button, error-boundary
│   ├── layout/             # sidebar, header
│   ├── dashboard/          # kpi-card, stat-card, activity-card, pegawai-card, status-badge, filter
│   ├── ckp/                # upload-dropzone, calendar-preview, approval-modal, approval-history, data-dukung-link
│   └── providers/          # query-provider, theme-provider, recovery-manager, keepalive-manager
├── hooks/use-auth.tsx      # Auth context (session cache + refresh + fallback profile)
├── lib/
│   ├── supabase/           # client (singleton + fresh), server (cookie + admin), middleware (role guard + cookie cache 5 mnt)
│   ├── excel/              # parser, column-mapping, exporter
│   ├── export/             # pdf-generator, evaluasi-helper
│   ├── zip/                # exporter (ZIP berkas asli)
│   ├── ckp-calendar-utils.ts  # Aturan triwulan + libur nasional 2024-2027
│   └── utils.ts
├── types/database.ts       # UserRole, UploadStatus, ApprovalAction + semua tabel
supabase/migrations/        # 001-020 (skema + RLS + seed)
scripts/                    # Util node ad-hoc (cleanup RK, seed dari Excel, cek agregat)
```

## Format Excel CKP

Kolom yang dikenali (fleksibel, case-insensitive, exact → startsWith → contains);
**satu-satunya kolom wajib: Kegiatan**. Kolom asing disimpan ke `extra_columns`:

- No → nomor baris
- Tanggal Mulai / Tanggal Selesai (dukung serial Excel + format Indonesia, mis. `1-3 September 2026`, `01/09/2026 s/d 03/09/2026`)
- Jam Mulai / Jam Selesai (`HH:MM`)
- Rencana Kinerja
- Kegiatan / Uraian *(wajib)*
- Progres / % (angka, di-clamp 0-100)
- Capaian / Hasil / Output
- Data Dukung / Bukti Dukung / Link (link Google Drive, bisa diklik)

Aturan filter periode triwulan (baris di luar periode di-skip):
- Bulan ke-1 triwulan (Jan/Apr/Jul/Okt): tanggal 1-25
- Bulan ke-2 (Feb/Mei/Agu/Nov): tanggal 26 bulan lalu - 25
- Bulan ke-3 (Mar/Jun/Sep/Des): tanggal 26 bulan lalu - akhir bulan
