-- ============================================================
-- BERSIHKAN DATA CKP YANG MASUK TANPA ENTRI
-- Jalankan di: Supabase > SQL Editor > Run
-- ============================================================

-- Lihat upload yang ada entri kosong (total_entries > 0 tapi ckp_entries kosong)
SELECT 
  u.id,
  u.bulan,
  u.tahun,
  u.status,
  u.total_entries,
  u.file_name,
  COUNT(e.id) AS actual_entries
FROM public.ckp_uploads u
LEFT JOIN public.ckp_entries e ON e.upload_id = u.id
GROUP BY u.id, u.bulan, u.tahun, u.status, u.total_entries, u.file_name
ORDER BY u.tahun DESC, u.bulan DESC;

-- Hapus upload yang actual_entries-nya 0 (data tidak lengkap)
-- Jalankan SELECT dulu, lalu uncomment DELETE di bawah jika sudah yakin:

-- DELETE FROM public.ckp_uploads
-- WHERE id IN (
--   SELECT u.id FROM public.ckp_uploads u
--   LEFT JOIN public.ckp_entries e ON e.upload_id = u.id
--   GROUP BY u.id
--   HAVING COUNT(e.id) = 0
-- );
