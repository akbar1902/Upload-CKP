-- Migration 026: Dukungan RK multi-tahun (arsip per tahun)
--
-- Tujuan:
--   * Setiap awal tahun, admin bisa upload "Dataset RK.zip" baru.
--   * RK tahun lama TIDAK dihapus, hanya ditandai is_active = false (arsip).
--   * Aplikasi hanya memakai RK yang is_active = true.
--
-- Catatan: constraint lama UNIQUE(rencana_kinerja, tim_kerja) TETAP dipakai.
-- Saat impor tahun baru, nama RK+tim yang sama akan "dipakai ulang"
-- (baris yang sama di-update tahun & is_active-nya), sedangkan RK lama yang
-- tidak ada lagi di dataset baru akan ditandai is_active = false.

ALTER TABLE public.rk_ketua_tim_mapping
  ADD COLUMN IF NOT EXISTS tahun INTEGER NOT NULL DEFAULT 2026,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Backfill data lama sebagai tahun 2026 & aktif (kondisi saat ini).
UPDATE public.rk_ketua_tim_mapping SET tahun = 2026 WHERE tahun IS NULL;
UPDATE public.rk_ketua_tim_mapping SET is_active = true WHERE is_active IS NULL;

-- Index untuk filter RK aktif per tahun.
CREATE INDEX IF NOT EXISTS idx_rk_mapping_active_tahun
  ON public.rk_ketua_tim_mapping(is_active, tahun);

COMMENT ON COLUMN public.rk_ketua_tim_mapping.tahun IS
  'Tahun RK. RK lama tetap disimpan sebagai arsip.';
COMMENT ON COLUMN public.rk_ketua_tim_mapping.is_active IS
  'Hanya RK dengan is_active = true yang dipakai aplikasi. Impor tahun baru menonaktifkan tahun lama.';
