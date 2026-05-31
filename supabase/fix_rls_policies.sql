-- ============================================================
-- FIX SEMUA RLS POLICY + STORAGE BUCKET
-- Jalankan seluruh script ini di: Supabase > SQL Editor > Run
-- ============================================================

-- ============================================================
-- LANGKAH 1: Buat storage bucket 'ckp-files' jika belum ada
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ckp-files',
  'ckp-files',
  false,
  10485760, -- 10 MB
  ARRAY['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: izinkan user upload/baca file miliknya sendiri
DROP POLICY IF EXISTS "Users can upload own CKP files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own CKP files" ON storage.objects;
DROP POLICY IF EXISTS "Pimpinan can read all CKP files" ON storage.objects;

CREATE POLICY "Users can upload own CKP files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'ckp-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can read own CKP files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'ckp-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Pimpinan can read all CKP files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'ckp-files'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
    )
  );

-- ============================================================
-- LANGKAH 2: Fix RLS policy tabel public.users
-- ============================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Pimpinan can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Pimpinan can update any user" ON public.users;

CREATE POLICY "Authenticated users can view own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Pimpinan can view all users"
  ON public.users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u2
      WHERE u2.id = auth.uid() AND u2.role IN ('pimpinan', 'admin')
    )
  );

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- LANGKAH 3: Fix RLS policy tabel ckp_uploads
-- ============================================================

DROP POLICY IF EXISTS "Pegawai can insert own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Users can view own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pimpinan can view all uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Users can delete own draft uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pimpinan can update upload status" ON public.ckp_uploads;

CREATE POLICY "Authenticated users can insert own uploads"
  ON public.ckp_uploads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own uploads"
  ON public.ckp_uploads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Pimpinan can view all uploads"
  ON public.ckp_uploads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
    )
  );

CREATE POLICY "Users can delete own draft uploads"
  ON public.ckp_uploads FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND status IN ('draft', 'revision_required'));

CREATE POLICY "Pimpinan can update upload status"
  ON public.ckp_uploads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
    )
  );

-- ============================================================
-- LANGKAH 4: Fix RLS policy tabel ckp_entries
-- ============================================================

DROP POLICY IF EXISTS "Users can view own entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "Pimpinan can view all entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON public.ckp_entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON public.ckp_entries;

CREATE POLICY "Users can view own entries"
  ON public.ckp_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ckp_uploads
      WHERE id = upload_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Pimpinan can view all entries"
  ON public.ckp_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
    )
  );

CREATE POLICY "Users can insert own entries"
  ON public.ckp_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ckp_uploads
      WHERE id = upload_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own entries"
  ON public.ckp_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ckp_uploads
      WHERE id = upload_id AND user_id = auth.uid()
    )
  );

-- ============================================================
-- LANGKAH 5: Fix RLS policy tabel audit_logs
-- ============================================================

DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Pimpinan can view all audit logs" ON public.audit_logs;

CREATE POLICY "Users can insert own audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Pimpinan can view all audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
    )
  );

-- ============================================================
-- VERIFIKASI: Cek semua policy yang aktif
-- ============================================================

SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
