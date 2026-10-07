-- ============================================================
-- BERSIHKAN DATA UJI "Dataset RK - Uji 2027" (VERSI BEDAH / AMAN)
-- ------------------------------------------------------------
-- Temuan: dari 11 baris tahun 2027, 1 baris adalah RK 2026 yang
-- "dipakai ulang" saat impor uji (id: 9e801fe9-3597-48f4-bb0d-64f05feeb454,
-- "Terlaksananya Pembangunan Zona Integritas yang Baik" / Reformasi Birokrasi).
-- Baris itu memiliki 211 entri CKP lama -> TIDAK boleh dihapus.
-- 10 baris lainnya murni baru (0 entri) -> aman dihapus.
--
-- Jalankan di Supabase SQL Editor, SATU BLOK PER SATU.
-- ============================================================


-- =========================================================
-- STEP 0 — PREVIEW (jalankan dulu)
-- =========================================================
SELECT 'RK 2027' AS item, COUNT(*) AS jumlah FROM public.rk_ketua_tim_mapping WHERE tahun = 2027
UNION ALL SELECT 'Sub-RK 2027', COUNT(*) FROM public.master_kegiatan_anggota s JOIN public.rk_ketua_tim_mapping m ON m.id = s.rk_id WHERE m.tahun = 2027
UNION ALL SELECT 'Penugasan 2027', COUNT(*) FROM public.user_rk_assignments a JOIN public.rk_ketua_tim_mapping m ON m.id = a.rk_id WHERE m.tahun = 2027
UNION ALL SELECT 'RK 2026', COUNT(*) FROM public.rk_ketua_tim_mapping WHERE tahun = 2026;


-- =========================================================
-- STEP 1 — KEMBALIKAN baris reused ke tahun 2026
-- =========================================================
UPDATE public.rk_ketua_tim_mapping
SET tahun = 2026, is_active = true
WHERE id = '9e801fe9-3597-48f4-bb0d-64f05feeb454';


-- =========================================================
-- STEP 2 — HAPUS 6 Sub-RK yang ditambahkan impor uji pada baris reused
-- (sub lama tidak tersentuh)
-- =========================================================
DELETE FROM public.master_kegiatan_anggota
WHERE rk_id = '9e801fe9-3597-48f4-bb0d-64f05feeb454'
  AND created_at >= '2026-10-07T09:02:00Z';


-- =========================================================
-- STEP 3 — HAPUS 10 RK baru tahun 2027
-- (Sub-RK & penugasan ikut terhapus otomatis via ON DELETE CASCADE)
-- =========================================================
DELETE FROM public.rk_ketua_tim_mapping WHERE tahun = 2027;


-- =========================================================
-- STEP 4 — AKTIFKAN kembali 2026, nonaktifkan tahun lain
-- =========================================================
UPDATE public.rk_ketua_tim_mapping SET is_active = true  WHERE tahun = 2026;
UPDATE public.rk_ketua_tim_mapping SET is_active = false WHERE tahun <> 2026;


-- =========================================================
-- STEP 5 — VERIFIKASI
-- =========================================================
SELECT tahun, is_active, COUNT(*) AS jumlah_rk
FROM public.rk_ketua_tim_mapping
GROUP BY tahun, is_active
ORDER BY tahun DESC;

-- Pastikan 211 entri CKP lama tetap utuh:
SELECT COUNT(*) AS entri_zona_integritas
FROM public.ckp_entries
WHERE rk_ketua_tim_id = '9e801fe9-3597-48f4-bb0d-64f05feeb454';
