-- Migration 024: Update RLS policies on ckp_entries untuk mendukung Sub-RK (rk_ketua_tim_id)
-- Masalah sebelumnya: Policy hanya mengecek `rk_ketua_tim_mapping.rencana_kinerja = ckp_entries.rencana_kinerja`
-- Ketika pegawai upload Sub-RK (RK Anggota), ckp_entries.rencana_kinerja berisi nama Sub-RK,
-- sedangkan RK Ketua Tim tersimpan di ckp_entries.rk_ketua_tim_id.
-- Hal ini membuat PostgreSQL RLS memblokir Ketua Tim sehingga data tampil kosong (0 pegawai).

-- 1. Update SELECT Policy pada public.ckp_entries
DROP POLICY IF EXISTS "Ketua Tim can view entries in their RK" ON public.ckp_entries;

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
                WHERE (
                    -- Data baru: cocokkan via rk_ketua_tim_id
                    id = public.ckp_entries.rk_ketua_tim_id
                    -- Data lama: cocokkan via nama RK (backward compatibility)
                    OR rencana_kinerja = public.ckp_entries.rencana_kinerja
                )
                AND ketua_tim_id = auth.uid()
            )
        )
    );

-- 2. Update UPDATE Policy pada public.ckp_entries
DROP POLICY IF EXISTS "Ketua Tim can update entries in their RK" ON public.ckp_entries;

CREATE POLICY "Ketua Tim can update entries in their RK"
    ON public.ckp_entries FOR UPDATE
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
                WHERE (
                    -- Data baru: cocokkan via rk_ketua_tim_id
                    id = public.ckp_entries.rk_ketua_tim_id
                    -- Data lama: cocokkan via nama RK (backward compatibility)
                    OR rencana_kinerja = public.ckp_entries.rencana_kinerja
                )
                AND ketua_tim_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('ketua_tim', 'pimpinan', 'admin')
        )
    );
