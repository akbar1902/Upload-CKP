-- Migration 025: Harden ckp_entries UPDATE (WITH CHECK scoping tim + guard rk_ketua_tim_id)
-- JANGAN ubah 022-024. File ini hanya mengencangkan policy 024.
--
-- Masalah 024: WITH CHECK UPDATE hanya cek role (ketua_tim/pimpinan/admin),
-- sehingga caller bisa memindah baris ke RK tim lain (lintas tim) selama lolos USING.
-- Perbaikan: WITH CHECK memakai scoping tim yg sama kyk USING (cek NEW row).
--
-- CATATAN backward-compat: cabang name-match
--   (rk_ketua_tim_mapping.rencana_kinerja = ckp_entries.rencana_kinerja)
-- JANGAN di-drop dulu — data lama (pre-022) masih butuh karena
-- rencana_kinerja mereka = nama RK Ketua Tim dan rk_ketua_tim_id bisa NULL.
-- Hapus cabang ini hanya setelah backfill 022 terverifikasi 100%.

-- 1. Ketatkan WITH CHECK policy UPDATE ckp_entries (scoping tim sama kyk USING)
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
                    -- Data lama: cocokkan via nama RK (backward compatibility — JANGAN drop dulu)
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
        AND
        (
            EXISTS (
                SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
            )
            OR
            EXISTS (
                SELECT 1 FROM public.rk_ketua_tim_mapping
                WHERE (
                    -- NEW row scoping: id merujuk mapping milik caller
                    id = public.ckp_entries.rk_ketua_tim_id
                    -- Data lama: cocokkan via nama RK (backward compatibility — JANGAN drop dulu)
                    OR rencana_kinerja = public.ckp_entries.rencana_kinerja
                )
                AND ketua_tim_id = auth.uid()
            )
        )
    );

-- 2. Guard: data baru wajib rk_ketua_tim_id NOT NULL.
-- Implementasi aman tanpa lock/scan tabel lama: CHECK kondisional berbasis
-- created_at + NOT VALID. Baris lama (created_at < cutoff) dikecualikan total —
-- termasuk saat di-UPDATE (mis. penilaian nilai) — sehingga constraint ini TIDAK
-- memblokir operasi pada data legacy yg rk_ketua_tim_id-nya masih NULL.
-- Hanya baris yg dibuat setelah cutoff yg wajib rk_ketua_tim_id NOT NULL.
-- NOT VALID = existing rows tidak divalidasi saat migration jalan (tanpa table lock lama).
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ckp_entries_new_rk_id_required'
    ) THEN
        ALTER TABLE public.ckp_entries
        ADD CONSTRAINT ckp_entries_new_rk_id_required
        CHECK (
            created_at < TIMESTAMPTZ '2026-10-06 00:00:00+07'
            OR rk_ketua_tim_id IS NOT NULL
        )
        NOT VALID;
    END IF;
END
$$;
