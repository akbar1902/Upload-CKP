-- 1. Berikan akses Ketua Tim untuk melihat semua ckp_uploads (read-only) agar dashboard bisa menampilkan nama anggota
CREATE POLICY "Ketua Tim can view all uploads"
    ON public.ckp_uploads FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('ketua_tim', 'pimpinan', 'admin')
        )
    );

-- 2. Berikan akses Ketua Tim untuk melihat ckp_entries (baris kegiatan) yang HANYA merupakan RK miliknya
CREATE POLICY "Ketua Tim can view entries in their RK"
    ON public.ckp_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('ketua_tim', 'pimpinan', 'admin')
        )
        AND
        (
            EXISTS (
                SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
            )
            OR
            EXISTS (
                SELECT 1 FROM public.rk_ketua_tim_mapping
                WHERE rencana_kinerja = public.ckp_entries.rencana_kinerja
                AND ketua_tim_id = auth.uid()
            )
        )
    );
