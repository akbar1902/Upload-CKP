-- Hapus policy sebelumnya yang menyebabkan infinite recursion
DROP POLICY IF EXISTS "Ketua Tim can view all users" ON public.users;
DROP POLICY IF EXISTS "Pimpinan can view all users" ON public.users;

-- Ganti dengan policy sederhana: Semua pegawai yang login bisa melihat daftar pengguna (karena ini web internal perusahaan, tidak ada data rahasia di tabel users, hanya nama dan NIP)
CREATE POLICY "Authenticated users can view all users"
    ON public.users FOR SELECT
    USING (auth.uid() IS NOT NULL);
