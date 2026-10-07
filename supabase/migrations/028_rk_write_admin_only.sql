-- Migration 028: Hanya ADMIN yang boleh mengubah struktur Rencana Kinerja.
-- ------------------------------------------------------------
-- Semua penulisan dari aplikasi sudah lewat server action memakai SERVICE ROLE
-- (bypass RLS), jadi mengetatkan RLS di sini hanya menutup celah akses langsung.
-- Baca (SELECT) tetap terbuka untuk pengguna yang login.

-- ============ rk_ketua_tim_mapping ============
DROP POLICY IF EXISTS "Anyone can insert rk mapping" ON public.rk_ketua_tim_mapping;
DROP POLICY IF EXISTS "Authorized users can update delete rk mapping" ON public.rk_ketua_tim_mapping;
DROP POLICY IF EXISTS "Only admin/pimpinan can insert/update/delete rk mapping" ON public.rk_ketua_tim_mapping;

DROP POLICY IF EXISTS "Admin can write rk mapping" ON public.rk_ketua_tim_mapping;
CREATE POLICY "Admin can write rk mapping"
    ON public.rk_ketua_tim_mapping FOR ALL
    USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- ============ master_kegiatan_anggota ============
DROP POLICY IF EXISTS "Anyone can insert master_kegiatan_anggota" ON public.master_kegiatan_anggota;
DROP POLICY IF EXISTS "Anyone can update delete master_kegiatan_anggota" ON public.master_kegiatan_anggota;
DROP POLICY IF EXISTS "Anyone can delete master_kegiatan_anggota" ON public.master_kegiatan_anggota;

DROP POLICY IF EXISTS "Admin can write master_kegiatan_anggota" ON public.master_kegiatan_anggota;
CREATE POLICY "Admin can write master_kegiatan_anggota"
    ON public.master_kegiatan_anggota FOR ALL
    USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- ============ user_rk_assignments ============
DROP POLICY IF EXISTS "Anyone can insert user_rk_assignments" ON public.user_rk_assignments;
DROP POLICY IF EXISTS "Anyone can update delete user_rk_assignments" ON public.user_rk_assignments;
DROP POLICY IF EXISTS "Anyone can delete user_rk_assignments" ON public.user_rk_assignments;

DROP POLICY IF EXISTS "Admin can write user_rk_assignments" ON public.user_rk_assignments;
CREATE POLICY "Admin can write user_rk_assignments"
    ON public.user_rk_assignments FOR ALL
    USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- Catatan: baca tetap terbuka (policy SELECT lama dibiarkan).
