-- ============================================================
-- Fix: Hapus akun admin manual dan jadikan akun existing sebagai admin
-- ============================================================

-- 1. Hapus akun admin buatan manual yang menyebabkan error "Database error querying schema"
-- (Karena insert manual ke auth.users sering kali kurang lengkap untuk versi Supabase terbaru, misalnya kurang data di tabel auth.identities)
DELETE FROM auth.users WHERE email = 'admin@bps.go.id';

-- 2. Ganti email di bawah ini dengan email akun Anda sendiri yang sudah ada dan BISA login dengan normal.
-- (Contoh: baiqk@bps.go.id)
-- Hapus tanda komentar (--) pada baris di bawah ini dan ubah emailnya sebelum di-Run:

-- UPDATE public.users SET role = 'admin' WHERE email = 'email_anda_yg_bisa_login@bps.go.id';
