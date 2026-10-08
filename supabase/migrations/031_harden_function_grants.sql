-- ============================================================
-- 031_harden_function_grants.sql
-- TINDAK LANJUT ADVISOR KEAMANAN SUPABASE (lint 0011 & 0028/0029).
--
-- BERISI:
--   1. Menetapkan search_path tetap untuk 4 fungsi lama yang masih
--      "mutable" (update_updated_at, update_upload_stats, handle_new_user,
--      sync_user_role_to_auth_metadata). Semua fungsi ini sudah
--      schema-qualified sehingga aman.
--   2. Mencabut EXECUTE via RPC publik untuk fungsi trigger & fungsi
--      reminder — fungsi trigger tidak perlu dipanggil lewat /rest/v1/rpc,
--      dan reminder hanya boleh dipicu pg_cron (berjalan sebagai postgres).
--
-- IDEMPOTENT: aman dijalankan berulang kali.
--
-- CATATAN: fungsi public.is_pimpinan_or_admin() dan public.get_user_role()
-- SENGAJA tidak dicabut karena dipakai di dalam policy RLS (policy
-- dievaluasi dengan hak pemanggil, jadi role authenticated/anon tetap
-- membutuhkan EXECUTE).
-- ============================================================


-- ============================================================
-- 1. SEARCH_PATH TETAP UNTUK FUNGSI LAMA
-- ============================================================
ALTER FUNCTION public.update_updated_at()               SET search_path = public;
ALTER FUNCTION public.update_upload_stats()             SET search_path = public;
ALTER FUNCTION public.handle_new_user()                 SET search_path = public;
ALTER FUNCTION public.sync_user_role_to_auth_metadata() SET search_path = public;


-- ============================================================
-- 2. CABUT EXECUTE PUBLIK UNTUK FUNGSI TRIGGER & REMINDER
-- ============================================================
-- Trigger tetap bekerja: hak EXECUTE pada fungsi trigger hanya diperiksa
-- saat CREATE TRIGGER, bukan saat trigger menyala. pg_cron berjalan sebagai
-- postgres (pemilik fungsi) sehingga jadwal harian tetap dieksekusi.
REVOKE EXECUTE ON FUNCTION public.log_ckp_entry_score_change()   FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.send_ckp_period_reminders()    FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at()            FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_upload_stats()          FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()              FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_user_role_to_auth_metadata() FROM PUBLIC, anon, authenticated;
