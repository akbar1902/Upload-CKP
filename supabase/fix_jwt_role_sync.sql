-- ============================================================
-- FIX: Sinkronisasi role di JWT metadata dengan tabel public.users
-- Jalankan di: Supabase > SQL Editor > Run
--
-- MASALAH: Akun pimpinan masuk ke /pegawai karena middleware
-- membaca role dari JWT metadata, tapi role hanya ada di DB.
-- SOLUSI: Update JWT metadata agar sama dengan role di DB.
-- ============================================================

-- ============================================================
-- LANGKAH 1: Lihat user mana yang rolenya belum sync
-- ============================================================
SELECT
  u.id,
  u.email,
  u.full_name,
  u.role AS db_role,
  au.raw_user_meta_data->>'role' AS jwt_role,
  CASE
    WHEN au.raw_user_meta_data->>'role' = u.role::text THEN '✅ Sinkron'
    ELSE '❌ TIDAK SINKRON — perlu update'
  END AS status
FROM public.users u
JOIN auth.users au ON au.id = u.id
ORDER BY u.role, u.full_name;

-- ============================================================
-- LANGKAH 2: Update JWT metadata untuk SEMUA user
-- (sinkronkan role dari public.users ke auth.users metadata)
-- ============================================================
UPDATE auth.users au
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
  'role',       u.role::text,
  'full_name',  u.full_name,
  'nip',        u.nip,
  'unit_kerja', u.unit_kerja
)
FROM public.users u
WHERE au.id = u.id;

-- ============================================================
-- LANGKAH 3: Verifikasi — cek setelah update
-- ============================================================
SELECT
  u.id,
  u.email,
  u.full_name,
  u.role AS db_role,
  au.raw_user_meta_data->>'role' AS jwt_role,
  CASE
    WHEN au.raw_user_meta_data->>'role' = u.role::text THEN '✅ Sinkron'
    ELSE '❌ Masih tidak sinkron'
  END AS status
FROM public.users u
JOIN auth.users au ON au.id = u.id
ORDER BY u.role, u.full_name;

-- ============================================================
-- LANGKAH 4 (OPSIONAL): Buat trigger agar otomatis sync di masa depan
-- Setiap kali role di public.users berubah, JWT metadata ikut update
-- ============================================================

CREATE OR REPLACE FUNCTION public.sync_user_role_to_auth_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Hanya update jika role berubah
  IF OLD.role IS DISTINCT FROM NEW.role
     OR OLD.full_name IS DISTINCT FROM NEW.full_name
     OR OLD.nip IS DISTINCT FROM NEW.nip
     OR OLD.unit_kerja IS DISTINCT FROM NEW.unit_kerja THEN

    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
      'role',       NEW.role::text,
      'full_name',  NEW.full_name,
      'nip',        NEW.nip,
      'unit_kerja', NEW.unit_kerja
    )
    WHERE id = NEW.id;

  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger jika ada
DROP TRIGGER IF EXISTS sync_role_to_jwt ON public.users;

-- Buat trigger baru
CREATE TRIGGER sync_role_to_jwt
  AFTER UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_role_to_auth_metadata();

-- ============================================================
-- VERIFIKASI AKHIR
-- ============================================================
SELECT
  au.email,
  au.raw_user_meta_data->>'full_name'  AS jwt_full_name,
  au.raw_user_meta_data->>'role'       AS jwt_role,
  u.full_name                          AS db_full_name,
  u.role::text                         AS db_role,
  CASE
    WHEN au.raw_user_meta_data->>'role' = u.role::text THEN '✅ Sinkron'
    ELSE '❌ Tidak sinkron'
  END AS status
FROM auth.users au
JOIN public.users u ON u.id = au.id
ORDER BY u.role, au.email;
