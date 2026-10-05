-- Migration 022: Tambah kolom rk_ketua_tim_id ke ckp_entries
-- Ini menyimpan referensi ke RK Ketua Tim (parent RK) secara terpisah,
-- sehingga rencana_kinerja bisa tetap berisi nama sub-RK asli dari Excel pegawai.

ALTER TABLE public.ckp_entries
ADD COLUMN IF NOT EXISTS rk_ketua_tim_id UUID REFERENCES public.rk_ketua_tim_mapping(id) ON DELETE SET NULL;

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_ckp_entries_rk_ketua_tim_id
ON public.ckp_entries(rk_ketua_tim_id);

-- Backfill: Isi rk_ketua_tim_id untuk data lama
-- Untuk data lama, rencana_kinerja = nama RK Ketua Tim, jadi bisa langsung cocokkan
UPDATE public.ckp_entries e
SET rk_ketua_tim_id = m.id
FROM public.rk_ketua_tim_mapping m
WHERE e.rk_ketua_tim_id IS NULL
  AND e.rencana_kinerja IS NOT NULL
  AND LOWER(e.rencana_kinerja) = LOWER(m.rencana_kinerja);

-- Catatan: Data lama akan tetap berfungsi karena rencana_kinerja = nama RK Ketua Tim
-- (bukan sub-RK). Untuk data baru setelah migration ini, rencana_kinerja akan berisi
-- nama sub-RK asli dan rk_ketua_tim_id akan berisi UUID RK Ketua Tim.
