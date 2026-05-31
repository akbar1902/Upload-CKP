# CKP Digital — BPS Kabupaten Belitung

Sistem Rekap Capaian Kinerja Pegawai (CKP) digital untuk BPS Kabupaten Belitung. Aplikasi web internal untuk upload, review, dan kelola kinerja pegawai.

## Fitur Utama

### Pegawai
- ✅ Login dengan email & password
- ✅ Upload file Excel CKP per bulan
- ✅ Preview data sebelum submit
- ✅ Lihat status upload dan approval
- ✅ Upload ulang jika draft/revisi
- ✅ Export data ke Excel

### Pimpinan
- ✅ Dashboard ringkasan semua pegawai
- ✅ Filter bulan, tahun, status, dan nama pegawai
- ✅ Review detail kegiatan harian
- ✅ Approve / Reject / Minta Revisi dengan catatan
- ✅ Buka link bukti dukung (Google Drive)
- ✅ Export rekap ke Excel
- ✅ Lihat riwayat approval
- ✅ Notifikasi pegawai yang belum upload

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS v3
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Excel**: xlsx (SheetJS)
- **UI**: Custom components (shadcn/ui style)
- **Icons**: Lucide React
- **Notifications**: Sonner

## Setup

### 1. Prerequisites
- Node.js 18+
- npm
- Akun Supabase (gratis di [supabase.com](https://supabase.com))

### 2. Buat Project Supabase
1. Buka [supabase.com](https://supabase.com) dan buat project baru
2. Buka **SQL Editor** dan jalankan file `supabase/migrations/001_initial_schema.sql`
3. (Opsional) Jalankan `supabase/seed.sql` untuk data contoh
4. Buat Storage Bucket bernama `ckp-files` (private)
5. Catat URL dan Keys dari **Settings > API**

### 3. Buat User di Supabase
Buka **Authentication > Users** dan buat user manual:
- Pimpinan: `pimpinan@bps.go.id` (set metadata: `{"full_name": "Nama Pimpinan", "role": "pimpinan", "nip": "..."}`)
- Pegawai: `pegawai@bps.go.id` (set metadata: `{"full_name": "Nama Pegawai", "role": "pegawai", "nip": "..."}`)

### 4. Setup Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Install & Run
```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Struktur Folder

```
src/
├── app/              # Pages (App Router)
│   ├── login/        # Halaman login
│   ├── pegawai/      # Halaman pegawai
│   └── pimpinan/     # Halaman pimpinan
├── components/       # React components
│   ├── ui/           # Base UI components
│   ├── layout/       # Sidebar, header
│   ├── dashboard/    # Stat cards, filters
│   └── ckp/          # CKP-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utilities & helpers
│   ├── supabase/     # Supabase clients
│   └── excel/        # Parser, exporter, mapping
└── types/            # TypeScript types
```

## Format Excel CKP

File Excel harus memiliki minimal kolom **Kegiatan**. Kolom yang dikenali:
- No
- Tanggal Mulai / Tanggal Selesai
- Jam Mulai / Jam Selesai
- Rencana Kinerja
- Kegiatan *(wajib)*
- Progres (%)
- Capaian
- Data Dukung (link Google Drive)

Kolom tambahan akan disimpan sebagai data ekstra.
