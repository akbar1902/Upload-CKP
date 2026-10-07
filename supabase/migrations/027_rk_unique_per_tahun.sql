-- Migration 027: Kunci unik RK per TAHUN
-- ------------------------------------------------------------
-- Masalah: constraint lama UNIQUE(rencana_kinerja, tim_kerja) TIDAK memuat tahun,
-- sehingga impor tahun baru dengan nama RK+tim yang sama akan MENIMPA
-- (meng-update tahun & is_active) baris tahun lama -> RK lama "tercuri"
-- dan entri CKP lama ikut menunjuk baris tahun baru.
--
-- Solusi: jadikan tahun bagian dari kunci unik, agar tiap tahun punya
-- baris RK sendiri dan tahun lama tidak pernah tersentuh.
--
-- CATATAN: kode aplikasi (importer & bulk import) diubah memakai
-- onConflict 'rencana_kinerja,tim_kerja,tahun'. Jadi migrasi ini WAJIB
-- dijalankan sebelum memakai fitur impor.

-- 1. Lihat constraint saat ini (opsional, untuk memastikan namanya):
--    SELECT conname, pg_get_constraintdef(oid)
--    FROM pg_constraint
--    WHERE conrelid = 'public.rk_ketua_tim_mapping'::regclass AND contype = 'u';

-- 2. Hapus constraint unik lama (nama historis dari migrasi 003 & 012).
ALTER TABLE public.rk_ketua_tim_mapping
  DROP CONSTRAINT IF EXISTS rk_ketua_tim_mapping_rk_tim_unique;
ALTER TABLE public.rk_ketua_tim_mapping
  DROP CONSTRAINT IF EXISTS rk_ketua_tim_mapping_rencana_kinerja_key;

-- 3. (Jaga-jaga) bila pernah ada duplikat (rk,tim,tahun) karena constraint lama
--    hilang, hapus duplikatnya kecuali satu (paling awal dibuat).
DELETE FROM public.rk_ketua_tim_mapping a
USING public.rk_ketua_tim_mapping b
WHERE a.id <> b.id
  AND a.rencana_kinerja = b.rencana_kinerja
  AND a.tim_kerja IS NOT DISTINCT FROM b.tim_kerja
  AND a.tahun = b.tahun
  AND a.created_at > b.created_at;

-- 4. Tambahkan constraint unik baru per tahun.
ALTER TABLE public.rk_ketua_tim_mapping
  ADD CONSTRAINT rk_ketua_tim_mapping_rk_tim_tahun_unique
  UNIQUE (rencana_kinerja, tim_kerja, tahun);

-- 5. Verifikasi.
SELECT conname, pg_get_constraintdef(oid) AS definisi
FROM pg_constraint
WHERE conrelid = 'public.rk_ketua_tim_mapping'::regclass AND contype = 'u';
