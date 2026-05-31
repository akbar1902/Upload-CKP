-- ============================================================
-- FIX SEMUA MASALAH: RLS + Performance + Data
-- Jalankan SELURUH script ini di: Supabase > SQL Editor > Run
-- ============================================================

-- ============================================================
-- LANGKAH 1: HAPUS SEMUA POLICY LAMA (bersih total)
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
DROP POLICY IF EXISTS "Pegawai can view own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pegawai can insert own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pegawai can update own draft uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pimpinan can view all uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pimpinan can update any upload" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Authenticated users can insert own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Users can view own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Users can delete own draft uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pimpinan can update upload status" ON public.ckp_uploads;
DROP POLICY IF EXISTS "uploads_insert_own" ON public.ckp_uploads;
DROP POLICY IF EXISTS "uploads_select_own" ON public.ckp_uploads;
DROP POLICY IF EXISTS "uploads_select_pimpinan" ON public.ckp_uploads;
DROP POLICY IF EXISTS "uploads_delete_own_draft" ON public.ckp_uploads;
DROP POLICY IF EXISTS "uploads_update_pimpinan" ON public.ckp_uploads;

-- public.ckp_entries
DROP POLICY IF EXISTS "Pegawai can view own entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "Pimpinan can view all entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "Pegawai can insert entries for own uploads" ON public.ckp_entries;
DROP POLICY IF EXISTS "Pegawai can delete entries for own draft uploads" ON public.ckp_entries;
DROP POLICY IF EXISTS "Users can view own entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "entries_insert_own" ON public.ckp_entries;
DROP POLICY IF EXISTS "entries_select_own" ON public.ckp_entries;
DROP POLICY IF EXISTS "entries_select_pimpinan" ON public.ckp_entries;
DROP POLICY IF EXISTS "entries_delete_own" ON public.ckp_entries;

-- public.approvals
DROP POLICY IF EXISTS "Users can view approvals for own uploads" ON public.approvals;
DROP POLICY IF EXISTS "Pimpinan can manage approvals" ON public.approvals;
DROP POLICY IF EXISTS "approvals_select_own" ON public.approvals;
DROP POLICY IF EXISTS "approvals_all_pimpinan" ON public.approvals;

-- public.audit_logs
DROP POLICY IF EXISTS "Users can view own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Pimpinan can view all audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Anyone can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_insert_own" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_select_pimpinan" ON public.audit_logs;

-- storage.objects
DROP POLICY IF EXISTS "Pegawai can upload own files" ON storage.objects;
DROP POLICY IF EXISTS "Pegawai can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Pimpinan can view all files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own CKP files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own CKP files" ON storage.objects;
DROP POLICY IF EXISTS "Pimpinan can read all CKP files" ON storage.objects;
DROP POLICY IF EXISTS "storage_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "storage_select_own" ON storage.objects;
DROP POLICY IF EXISTS "storage_select_pimpinan" ON storage.objects;
DROP POLICY IF EXISTS "storage_update_own" ON storage.objects;
DROP POLICY IF EXISTS "storage_delete_own" ON storage.objects;

-- ============================================================
-- LANGKAH 2: BUAT SECURITY DEFINER FUNCTION (anti-recursion)
-- ============================================================

DROP FUNCTION IF EXISTS public.is_pimpinan_or_admin();
DROP FUNCTION IF EXISTS public.get_user_role();

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.users
  WHERE id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

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
-- LANGKAH 3: POLICY TABEL public.users
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
-- LANGKAH 4: POLICY TABEL ckp_uploads
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

-- Pegawai bisa delete upload miliknya sendiri (draft/revision)
CREATE POLICY "uploads_delete_own_draft"
  ON public.ckp_uploads FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND status IN ('draft', 'revision_required'));

-- Pegawai bisa update upload miliknya (untuk resubmit)
CREATE POLICY "uploads_update_own"
  ON public.ckp_uploads FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Pimpinan bisa update status apapun
CREATE POLICY "uploads_update_pimpinan"
  ON public.ckp_uploads FOR UPDATE
  TO authenticated
  USING (public.is_pimpinan_or_admin());

-- ============================================================
-- LANGKAH 5: POLICY TABEL ckp_entries
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
-- LANGKAH 6: POLICY TABEL approvals
-- ============================================================

CREATE POLICY "approvals_select_own"
  ON public.approvals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ckp_uploads
      WHERE id = upload_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "approvals_all_pimpinan"
  ON public.approvals FOR ALL
  TO authenticated
  USING (public.is_pimpinan_or_admin())
  WITH CHECK (public.is_pimpinan_or_admin());

-- ============================================================
-- LANGKAH 7: POLICY TABEL audit_logs
-- ============================================================

CREATE POLICY "audit_insert_own"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "audit_select_own"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "audit_select_pimpinan"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_pimpinan_or_admin());

-- ============================================================
-- LANGKAH 8: STORAGE BUCKET + POLICY
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ckp-files',
  'ckp-files',
  false,
  10485760,
  ARRAY[
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760;

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

CREATE POLICY "storage_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'ckp-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "storage_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'ckp-files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- LANGKAH 9: PERFORMANCE INDEX (jika belum ada)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_ckp_uploads_user ON public.ckp_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_ckp_uploads_period ON public.ckp_uploads(bulan, tahun);
CREATE INDEX IF NOT EXISTS idx_ckp_uploads_status ON public.ckp_uploads(status);
CREATE INDEX IF NOT EXISTS idx_ckp_uploads_user_period ON public.ckp_uploads(user_id, bulan, tahun);
CREATE INDEX IF NOT EXISTS idx_ckp_entries_upload ON public.ckp_entries(upload_id);
CREATE INDEX IF NOT EXISTS idx_approvals_upload ON public.approvals(upload_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role) WHERE is_active = true;

-- ============================================================
-- LANGKAH 10: ENABLE REALTIME (untuk live updates dashboard)
-- ============================================================

-- Enable realtime on uploads table
ALTER TABLE public.ckp_uploads REPLICA IDENTITY FULL;
ALTER TABLE public.users REPLICA IDENTITY FULL;

-- Tambahkan ke realtime publication (jalankan sebagai superuser)
-- Jika error, skip bagian ini — tidak wajib
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.ckp_uploads;
  EXCEPTION WHEN duplicate_object THEN
    NULL; -- already exists, ignore
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END;
$$;

-- ============================================================
-- VERIFIKASI: Cek semua policy aktif
-- ============================================================

SELECT
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
