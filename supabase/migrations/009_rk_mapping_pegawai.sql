-- 1. Tambah kolom created_by di rk_ketua_tim_mapping
ALTER TABLE public.rk_ketua_tim_mapping ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Hapus policy lama pada rk_ketua_tim_mapping agar bisa dibuat ulang (jika ada)
DROP POLICY IF EXISTS "Only admin/pimpinan can insert/update/delete rk mapping" ON public.rk_ketua_tim_mapping;
DROP POLICY IF EXISTS "Ketua Tim can insert/update/delete own rk mapping" ON public.rk_ketua_tim_mapping;
DROP POLICY IF EXISTS "Anyone can insert rk mapping" ON public.rk_ketua_tim_mapping;
DROP POLICY IF EXISTS "Creators can update delete rk mapping" ON public.rk_ketua_tim_mapping;

-- 2. Aturan baru untuk rk_ketua_tim_mapping (Kamus Global)
-- Semua orang bisa melihat (sudah ada "Anyone can read rk_ketua_tim_mapping")
-- Semua orang yang login bisa menambah RK baru
CREATE POLICY "Anyone can insert rk mapping"
    ON public.rk_ketua_tim_mapping FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- User bisa update/delete RK jika: dia pimpinan/admin, ATAU dia yang membuat RK tersebut, ATAU dia ditunjuk sebagai ketua timnya
CREATE POLICY "Authorized users can update delete rk mapping"
    ON public.rk_ketua_tim_mapping FOR ALL
    USING (
        auth.uid() = created_by 
        OR auth.uid() = ketua_tim_id
        OR EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );


-- 3. Membuat tabel penugasan RK (user_rk_assignments)
CREATE TABLE public.user_rk_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rencana_kinerja TEXT NOT NULL REFERENCES public.rk_ketua_tim_mapping(rencana_kinerja) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rencana_kinerja, user_id)
);

CREATE INDEX idx_user_rk_assignments_user ON public.user_rk_assignments(user_id);
CREATE INDEX idx_user_rk_assignments_rk ON public.user_rk_assignments(rencana_kinerja);

-- 4. RLS untuk user_rk_assignments
ALTER TABLE public.user_rk_assignments ENABLE ROW LEVEL SECURITY;

-- Semua orang bisa melihat penugasan mereka sendiri, dan Ketua Tim bisa melihat penugasan untuk RK mereka, dan Pimpinan bisa melihat semuanya.
-- Untuk simpelnya (karena daftar RK tidak rahasia): Semua pegawai bisa melihat penugasan semua orang.
CREATE POLICY "Anyone can read user_rk_assignments"
    ON public.user_rk_assignments FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Pegawai bisa menugaskan dirinya sendiri, Ketua Tim bisa menugaskan anggotanya, Pimpinan bisa menugaskan siapapun.
-- Untuk simpelnya: Pegawai yang login bebas melakukan INSERT dan DELETE pada tabel ini, karena ini sifatnya memudahkan administrasi CKP.
CREATE POLICY "Anyone can insert user_rk_assignments"
    ON public.user_rk_assignments FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can update delete user_rk_assignments"
    ON public.user_rk_assignments FOR UPDATE
    USING (auth.uid() IS NOT NULL);
    
CREATE POLICY "Anyone can delete user_rk_assignments"
    ON public.user_rk_assignments FOR DELETE
    USING (auth.uid() IS NOT NULL);
