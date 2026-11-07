# Setup Google Drive untuk "Buat CKP"

Halaman **`/pegawai/buat-ckp`** mengunggah bukti dukung langsung dari browser
ke Google Drive pribadi pegawai. Halaman ini butuh satu **Google OAuth Client
ID** (bukan rahasia; aman ada di browser). Dibuat sekali oleh admin.

## 1. Buat Client ID (± 10 menit)

1. Buka <https://console.cloud.google.com/> dengan akun Google admin → buat
   project baru, mis. **SIKAP**.
2. **APIs & Services → Library** → cari **Google Drive API** → **Enable**.
3. **Google Auth Platform** (dulu "OAuth consent screen"):
   - **Branding**: nama aplikasi `SIKAP`, email dukungan, email developer,
     home page `https://sikap-ckp.vercel.app`, authorized domain
     `sikap-ckp.vercel.app`. Jangan unggah logo (memicu verifikasi brand).
   - **Audience**: **External**. Selama uji coba biarkan **Testing** dan
     tambahkan email Google pribadi pegawai di **Test users** (maks. 100).
   - **Data access**: scope `https://www.googleapis.com/auth/drive.file`
     (non-sensitif: aplikasi hanya melihat file yang ia buat sendiri).
4. **Clients → Create client** → **Web application**:
   - **Authorized JavaScript origins**:
     - `https://sikap-ckp.vercel.app`
     - `http://localhost:3000` (untuk pengembangan)
   - Redirect URI **tidak perlu** (login memakai popup token).
5. Salin **Client ID** (`xxxxx.apps.googleusercontent.com`).

## 2. Pasang di SIKAP

- **Lokal**: `.env.local` → `NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com`,
  lalu restart `npm run dev`.
- **Vercel**: Project → Settings → Environment Variables → tambah
  `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (Production + Preview), lalu redeploy.
  Nilainya dibaca saat request, jadi mengganti Client ID cukup redeploy.

## 3. Database

Jalankan `supabase/migrations/038_buat_ckp.sql` (tabel `ckp_drafts` dan
`user_ckp_settings`, hanya diakses server).

## 4. Rilis ke semua pegawai (sudah dilakukan 8 Nov 2026)

Status aplikasi: **In production** — semua akun Google bisa login.

- Kebijakan privasi publik: `https://sikap-ckp.vercel.app/privasi`
  (diisi di **Branding → Application privacy policy link**; halaman ini
  dikecualikan dari login di `src/lib/supabase/middleware.ts`).
- Scope hanya `drive.file` (non-sensitif), jadi tidak perlu verifikasi
  keamanan. Bila Google meminta verifikasi brand, ajukan lewat
  **Verification Center**; selama menunggu, pegawai mungkin melihat
  "Google belum memverifikasi aplikasi ini" dan bisa lanjut lewat **Lanjutan**.
- Jangan menambah scope lain tanpa meninjau ulang dampaknya: scope sensitif
  memicu verifikasi keamanan dan bisa memblokir login semua pegawai.

## Catatan

- Login Google berlaku ± 1 jam. Bila kedaluwarsa di tengah unggah, klik
  **Hubungkan ulang** lalu **Ulangi yang gagal**; file yang selesai tidak diulang.
- Token Google hanya disimpan di memori tab, tidak dikirim ke server SIKAP.
- Foto disimpan di Drive pegawai: `CKP SIKAP/<tahun>-<bulan> <Nama Bulan>/`,
  bisa dibuka siapa saja yang punya link (untuk penilai).
