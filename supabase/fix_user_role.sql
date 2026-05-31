-- ============================================================
-- LANGKAH 1: Fix role user pimpinan
-- ============================================================

-- Lihat semua user yang ada
SELECT id, email, full_name, role FROM public.users;

-- Update role pimpinan (ganti nama dan NIP sesuai asli)
UPDATE public.users
SET 
  role = 'pimpinan',
  full_name = 'Kepala BPS Kabupaten Belitung',
  unit_kerja = 'Kepala BPS'
WHERE email = 'pimpinan@bps.go.id';

-- ============================================================
-- LANGKAH 2: Perbaiki RLS policy agar lebih eksplisit
-- Ini mengatasi issue browser client tidak bisa baca profil sendiri
-- ============================================================

-- Hapus policy yang ada
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Pimpinan can view all users" ON public.users;

-- Buat ulang dengan target role 'authenticated' yang eksplisit
CREATE POLICY "Authenticated users can view own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Pimpinan can view all users"
  ON public.users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
    )
  );

-- ============================================================
-- Verifikasi
-- ============================================================
SELECT id, email, full_name, role, unit_kerja FROM public.users;
