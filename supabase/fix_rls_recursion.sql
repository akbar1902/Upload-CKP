-- ============================================================
-- FIX: Infinite recursion in RLS policies
-- Jalankan di: Supabase > SQL Editor > Run
-- ============================================================

-- ============================================================
-- LANGKAH 1: Hapus SEMUA policy yang ada (bersih total)
-- ============================================================

-- public.users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Pimpinan can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Pimpinan can update any user" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_select_pimpinan" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;

-- public.ckp_uploads
DROP POLICY IF EXISTS "Pegawai can insert own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Authenticated users can insert own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Users can view own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pimpinan can view all uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Users can delete own draft uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pimpinan can update upload status" ON public.ckp_uploads;
DROP POLICY IF EXISTS "uploads_insert_own" ON public.ckp_uploads;
DROP POLICY IF EXISTS "uploads_select_own" ON public.ckp_uploads;
DROP POLICY IF EXISTS "uploads_select_pimpinan" ON public.ckp_uploads;
DROP POLICY IF EXISTS "uploads_delete_own_draft" ON public.ckp_uploads;
DROP POLICY IF EXISTS "uploads_update_pimpinan" ON public.ckp_uploads;

-- public.ckp_entries
DROP POLICY IF EXISTS "Users can view own entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "Pimpinan can view all entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "entries_insert_own" ON public.ckp_entries;
DROP POLICY IF EXISTS "entries_select_own" ON public.ckp_entries;
DROP POLICY IF EXISTS "entries_select_pimpinan" ON public.ckp_entries;
DROP POLICY IF EXISTS "entries_delete_own" ON public.ckp_entries;

-- public.audit_logs
DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Pimpinan can view all audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_insert_own" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_select_pimpinan" ON public.audit_logs;

-- storage.objects
DROP POLICY IF EXISTS "Users can upload own CKP files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own CKP files" ON storage.objects;
DROP POLICY IF EXISTS "Pimpinan can read all CKP files" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "storage_select_own" ON storage.objects;
DROP POLICY IF EXISTS "storage_select_pimpinan" ON storage.objects;

-- ============================================================
-- LANGKAH 2: Buat SECURITY DEFINER helper function
-- (syntax yang benar: AS $$ ... $$ LANGUAGE sql)
-- ============================================================

DROP FUNCTION IF EXISTS public.is_pimpinan_or_admin();

CREATE OR REPLACE FUNCTION public.is_pimpinan_or_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role IN ('pimpinan', 'admin')
      AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- ============================================================
-- LANGKAH 3: Policy tabel public.users
-- ============================================================

CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_select_pimpinan"
  ON public.users FOR SELECT
  TO authenticated
  USING (public.is_pimpinan_or_admin());

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- LANGKAH 4: Policy tabel ckp_uploads
-- ============================================================

CREATE POLICY "uploads_insert_own"
  ON public.ckp_uploads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "uploads_select_own"
  ON public.ckp_uploads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "uploads_select_pimpinan"
  ON public.ckp_uploads FOR SELECT
  TO authenticated
  USING (public.is_pimpinan_or_admin());

CREATE POLICY "uploads_delete_own_draft"
  ON public.ckp_uploads FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND status IN ('draft', 'revision_required'));

CREATE POLICY "uploads_update_pimpinan"
  ON public.ckp_uploads FOR UPDATE
  TO authenticated
  USING (public.is_pimpinan_or_admin());

-- ============================================================
-- LANGKAH 5: Policy tabel ckp_entries
-- ============================================================

CREATE POLICY "entries_insert_own"
  ON public.ckp_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ckp_uploads
      WHERE id = upload_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "entries_select_own"
  ON public.ckp_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ckp_uploads
      WHERE id = upload_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "entries_select_pimpinan"
  ON public.ckp_entries FOR SELECT
  TO authenticated
  USING (public.is_pimpinan_or_admin());

CREATE POLICY "entries_delete_own"
  ON public.ckp_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ckp_uploads
      WHERE id = upload_id AND user_id = auth.uid()
    )
  );

-- ============================================================
-- LANGKAH 6: Policy tabel audit_logs
-- ============================================================

CREATE POLICY "audit_insert_own"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "audit_select_pimpinan"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_pimpinan_or_admin());

-- ============================================================
-- LANGKAH 7: Storage bucket + policy
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('ckp-files', 'ckp-files', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "storage_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'ckp-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "storage_select_own"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'ckp-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "storage_select_pimpinan"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'ckp-files'
    AND public.is_pimpinan_or_admin()
  );

-- ============================================================
-- VERIFIKASI: Cek semua policy aktif
-- ============================================================

SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
