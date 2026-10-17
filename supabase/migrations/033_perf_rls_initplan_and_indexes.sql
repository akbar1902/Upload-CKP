-- ============================================================
-- 033_perf_rls_initplan_and_indexes.sql
-- OPTIMASI PERFORMA & KEBERSIHAN DATABASE
-- (tindak lanjut audit Supabase Advisor)
--
-- BERISI:
--   1. RLS "init plan": setiap policy di schema `public` yang memanggil
--      auth.uid() / is_pimpinan_or_admin() dibungkus menjadi sub-select
--      -- (select auth.uid()) -- sehingga Postgres mengevaluasinya SEKALI
--      per query (InitPlan), bukan sekali PER BARIS.
--      Angka dari advisor: 33 policy terdampak. Semantik policy TIDAK
--      berubah sama sekali — hanya cara evaluasinya.
--   2. Index penutup untuk 9 foreign key yang belum punya index
--      (menghindari sequential scan saat join/cascade).
--   3. Hapus 1 index duplikat di tabel `users` (idx_users_role identik
--      dengan idx_users_role_active: keduanya partial (role) WHERE is_active).
--
-- IDEMPOTENT: aman dijalankan berulang kali.
--
-- CATATAN PENTING: fungsi public.get_user_role() dan
-- public.is_pimpinan_or_admin() SENGAJA tetap SECURITY DEFINER dan tetap
-- memberi EXECUTE ke anon/authenticated — keduanya dipakai DI DALAM policy
-- RLS, dan policy dievaluasi dengan hak pemanggil. Ini trade-off yang sudah
-- didokumentasikan di migration 031. Yang diperbaiki di sini adalah cara
-- pemanggilannya (sekali per query), bukan haknya.
--
-- ROLLBACK: lihat blok di paling bawah file.
-- ============================================================


-- ============================================================
-- 1. RLS INIT-PLAN (auth.uid() / is_pimpinan_or_admin() -> sub-select)
-- ============================================================
DO $$
DECLARE
  r          record;
  new_qual   text;
  new_check  text;
  stmt       text;
  changed    int := 0;
  wrap_uid   constant text := '(select auth.uid())';
  wrap_admin constant text := '(select is_pimpinan_or_admin())';
  rx_uid     constant text := '(^|[^[:alnum:]_.])auth\.uid\(\)';
  rx_admin   constant text := '(^|[^[:alnum:]_.])(public\.)?is_pimpinan_or_admin\(\)';
BEGIN
  FOR r IN
    SELECT tablename, policyname, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    new_qual  := r.qual;
    new_check := r.with_check;

    -- selagi belum pernah dibungkus, lakukan penggantian
    IF new_qual IS NOT NULL AND position(wrap_uid IN new_qual) = 0 THEN
      new_qual := regexp_replace(new_qual, rx_uid, '\1' || wrap_uid, 'g');
    END IF;
    IF new_qual IS NOT NULL AND position(wrap_admin IN new_qual) = 0 THEN
      new_qual := regexp_replace(new_qual, rx_admin, '\1' || wrap_admin, 'g');
    END IF;

    IF new_check IS NOT NULL AND position(wrap_uid IN new_check) = 0 THEN
      new_check := regexp_replace(new_check, rx_uid, '\1' || wrap_uid, 'g');
    END IF;
    IF new_check IS NOT NULL AND position(wrap_admin IN new_check) = 0 THEN
      new_check := regexp_replace(new_check, rx_admin, '\1' || wrap_admin, 'g');
    END IF;

    IF new_qual IS DISTINCT FROM r.qual OR new_check IS DISTINCT FROM r.with_check THEN
      stmt := format('ALTER POLICY %I ON public.%I', r.policyname, r.tablename);
      IF new_qual IS NOT NULL THEN
        stmt := stmt || format(' USING (%s)', new_qual);
      END IF;
      IF new_check IS NOT NULL THEN
        stmt := stmt || format(' WITH CHECK (%s)', new_check);
      END IF;
      EXECUTE stmt;
      changed := changed + 1;
      RAISE NOTICE 'policy diperbarui: %.%', r.tablename, r.policyname;
    END IF;
  END LOOP;
  RAISE NOTICE 'RLS init-plan: % policy diperbarui', changed;
END $$;


-- ============================================================
-- 2. INDEX UNTUK FOREIGN KEY YANG BELUM TERINDEKS
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ckp_entries_dinilai_oleh        ON public.ckp_entries (dinilai_oleh);
CREATE INDEX IF NOT EXISTS idx_ckp_score_history_changed_by    ON public.ckp_entry_score_history (changed_by);
CREATE INDEX IF NOT EXISTS idx_ckp_uploads_approved_by         ON public.ckp_uploads (approved_by);
CREATE INDEX IF NOT EXISTS idx_notifications_actor_id          ON public.notifications (actor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_upload_id         ON public.notifications (upload_id);
CREATE INDEX IF NOT EXISTS idx_periode_ckp_locked_by           ON public.periode_ckp (locked_by);
CREATE INDEX IF NOT EXISTS idx_rk_ktm_created_by               ON public.rk_ketua_tim_mapping (created_by);
CREATE INDEX IF NOT EXISTS idx_user_rk_assignments_assigned_by ON public.user_rk_assignments (assigned_by);
CREATE INDEX IF NOT EXISTS idx_user_rk_assignments_rk          ON public.user_rk_assignments (rk_id);


-- ============================================================
-- 3. BUANG INDEX DUPLIKAT DI `users`
--    idx_users_role dan idx_users_role_active sama-sama
--    (role) WHERE is_active -> cukup satu.
-- ============================================================
DROP INDEX IF EXISTS public.idx_users_role;


-- ============================================================
-- ROLLBACK (jalankan manual bila perlu kembali ke kondisi awal):
--
--   -- 1) lepas pembungkusan sub-select pada semua policy public
--   DO $$
--   DECLARE r record; q text; c text; s text;
--   BEGIN
--     FOR r IN SELECT tablename, policyname, qual, with_check FROM pg_policies WHERE schemaname='public' LOOP
--       q := replace(r.qual,      '(select auth.uid())', 'auth.uid()');
--       q := replace(q,           '(select is_pimpinan_or_admin())', 'is_pimpinan_or_admin()');
--       c := replace(r.with_check,'(select auth.uid())', 'auth.uid()');
--       c := replace(c,           '(select is_pimpinan_or_admin())', 'is_pimpinan_or_admin()');
--       IF q IS DISTINCT FROM r.qual OR c IS DISTINCT FROM r.with_check THEN
--         s := format('ALTER POLICY %I ON public.%I', r.policyname, r.tablename);
--         IF q IS NOT NULL THEN s := s || format(' USING (%s)', q); END IF;
--         IF c IS NOT NULL THEN s := s || format(' WITH CHECK (%s)', c); END IF;
--         EXECUTE s;
--       END IF;
--     END LOOP;
--   END $$;
--
--   -- 2) hapus index yang ditambahkan
--   DROP INDEX IF EXISTS public.idx_ckp_entries_dinilai_oleh,
--                        public.idx_ckp_score_history_changed_by,
--                        public.idx_ckp_uploads_approved_by,
--                        public.idx_notifications_actor_id,
--                        public.idx_notifications_upload_id,
--                        public.idx_periode_ckp_locked_by,
--                        public.idx_rk_ktm_created_by,
--                        public.idx_user_rk_assignments_assigned_by,
--                        public.idx_user_rk_assignments_rk;
--
--   -- 3) pulihkan index duplikat (bila memang diinginkan)
--   CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role) WHERE is_active = true;
-- ============================================================
