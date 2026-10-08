-- ============================================================
-- 029_security_hardening.sql
-- KEAMANAN SIKAP — jalankan MANUAL di Supabase SQL Editor.
-- IDEMPOTENT: aman dijalankan berulang kali.
--
-- BERISI:
--   1. Trigger proteksi kolom sensitif public.users
--      (role, is_active, email, nip) dari perubahan non-service-role.
--   2. RLS ketat untuk ckp_uploads (UPDATE/INSERT/DELETE milik sendiri:
--      hormati status & periode terkunci).
--   3. Cabut policy INSERT audit_logs yang permisif (kini hanya service role).
--   4. Kunci policy tulis rk_ketua_tim_mapping / master_kegiatan_anggota /
--      user_rk_assignments ke admin (mengulang migrasi 028 secara idempotent).
--   5. Index performa (IF NOT EXISTS).
--   6. Partial unique index: satu user satu upload AKTIF per bulan-tahun.
--
-- VERIFIKASI MANUAL (opsional, jalankan terpisah setelah migrasi):
--   SELECT tablename, policyname, cmd, roles
--   FROM pg_policies
--   WHERE schemaname = 'public'
--     AND tablename IN ('ckp_uploads','audit_logs','master_kegiatan_anggota',
--                       'user_rk_assignments','rk_ketua_tim_mapping')
--   ORDER BY tablename, cmd;
-- ============================================================


-- ============================================================
-- 1. TRIGGER: PROTEKSI KOLOM SENSITIF public.users
-- ============================================================
-- Mencegah user menaikkan dirinya menjadi admin (atau mengaktifkan kembali
-- akun / mengganti email & NIP) lewat PostgREST dengan JWT miliknya sendiri.
-- Hanya service_role (server actions aplikasi) dan role admin database
-- (SQL Editor: postgres) yang boleh mengubah kolom tersebut.
CREATE OR REPLACE FUNCTION public.protect_user_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    -- current_user = 'authenticated'/'anon' untuk request PostgREST biasa;
    -- 'service_role' untuk service key; 'postgres' saat SQL Editor.
    IF COALESCE(auth.role(), '') <> 'service_role'
       AND current_user NOT IN ('postgres', 'supabase_admin') THEN
        IF NEW.role      IS DISTINCT FROM OLD.role
           OR NEW.is_active IS DISTINCT FROM OLD.is_active
           OR NEW.email   IS DISTINCT FROM OLD.email
           OR NEW.nip     IS DISTINCT FROM OLD.nip THEN
            RAISE EXCEPTION 'Perubahan kolom sensitif (role, is_active, email, nip) hanya dapat dilakukan oleh admin melalui server.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_user_sensitive_columns ON public.users;
CREATE TRIGGER protect_user_sensitive_columns
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_user_sensitive_columns();


-- ============================================================
-- 2. RLS KETAT: public.ckp_uploads (PEMILIK)
-- ============================================================
-- Policy lama "uploads_update_own" hanya cek user_id tanpa status/lock,
-- sehingga pemilik bisa mengubah upload yang sudah approved / periode
-- terkunci langsung via PostgREST. Ganti dengan versi ketat (tiru gaya 014).

DROP POLICY IF EXISTS "uploads_update_own" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pegawai can update own draft uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Authenticated users can update own uploads" ON public.ckp_uploads;

CREATE POLICY "uploads_update_own"
    ON public.ckp_uploads FOR UPDATE
    TO authenticated
    USING (
        user_id = auth.uid()
        AND status NOT IN ('approved', 'superseded')
        AND NOT EXISTS (
            SELECT 1 FROM public.periode_ckp p
            WHERE p.bulan = ckp_uploads.bulan
              AND p.tahun = ckp_uploads.tahun
              AND p.is_locked = true
        )
    )
    WITH CHECK (
        user_id = auth.uid()
        AND status NOT IN ('approved', 'superseded')
    );

-- INSERT milik sendiri juga harus menghormati periode terkunci.
DROP POLICY IF EXISTS "uploads_insert_own" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Authenticated users can insert own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pegawai can insert own uploads" ON public.ckp_uploads;

CREATE POLICY "uploads_insert_own"
    ON public.ckp_uploads FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid()
        AND NOT EXISTS (
            SELECT 1 FROM public.periode_ckp p
            WHERE p.bulan = ckp_uploads.bulan
              AND p.tahun = ckp_uploads.tahun
              AND p.is_locked = true
        )
    );

-- DELETE milik sendiri: hormati status & periode terkunci.
DROP POLICY IF EXISTS "uploads_delete_own_draft" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pegawai can delete own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Users can delete own draft uploads" ON public.ckp_uploads;

CREATE POLICY "uploads_delete_own_draft"
    ON public.ckp_uploads FOR DELETE
    TO authenticated
    USING (
        user_id = auth.uid()
        AND status NOT IN ('approved', 'superseded')
        AND NOT EXISTS (
            SELECT 1 FROM public.periode_ckp p
            WHERE p.bulan = ckp_uploads.bulan
              AND p.tahun = ckp_uploads.tahun
              AND p.is_locked = true
        )
    );


-- ============================================================
-- 3. audit_logs: CABUT POLICY INSERT PERMISIF
-- ============================================================
-- Semua penulisan audit_logs dilakukan server action memakai SERVICE ROLE
-- (bypass RLS). Jangan biarkan user biasa menyisipkan/memalsukan log.
DROP POLICY IF EXISTS "Anyone can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_insert_own" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.audit_logs;
-- Tidak dibuat policy INSERT baru — hanya service role yang boleh insert.


-- ============================================================
-- 4. KUNCI TULIS STRUKTUR RK & PENUGASAN KE ADMIN
-- ============================================================
-- Mengulang migrasi 028 agar tetap aman bila urutan run berbeda.
-- Semua penulisan aplikasi memakai service role; policy ini menutup
-- celah tulis langsung via PostgREST.

-- 4a. rk_ketua_tim_mapping
DROP POLICY IF EXISTS "Anyone can insert rk mapping" ON public.rk_ketua_tim_mapping;
DROP POLICY IF EXISTS "Authorized users can update delete rk mapping" ON public.rk_ketua_tim_mapping;
DROP POLICY IF EXISTS "Only admin/pimpinan can insert/update/delete rk mapping" ON public.rk_ketua_tim_mapping;
DROP POLICY IF EXISTS "Admin can write rk mapping" ON public.rk_ketua_tim_mapping;

CREATE POLICY "Admin can write rk mapping"
    ON public.rk_ketua_tim_mapping FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- 4b. master_kegiatan_anggota
DROP POLICY IF EXISTS "Anyone can insert master_kegiatan_anggota" ON public.master_kegiatan_anggota;
DROP POLICY IF EXISTS "Anyone can update delete master_kegiatan_anggota" ON public.master_kegiatan_anggota;
DROP POLICY IF EXISTS "Anyone can delete master_kegiatan_anggota" ON public.master_kegiatan_anggota;
DROP POLICY IF EXISTS "Admin can write master_kegiatan_anggota" ON public.master_kegiatan_anggota;

CREATE POLICY "Admin can write master_kegiatan_anggota"
    ON public.master_kegiatan_anggota FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- 4c. user_rk_assignments
DROP POLICY IF EXISTS "Anyone can insert user_rk_assignments" ON public.user_rk_assignments;
DROP POLICY IF EXISTS "Anyone can update delete user_rk_assignments" ON public.user_rk_assignments;
DROP POLICY IF EXISTS "Anyone can delete user_rk_assignments" ON public.user_rk_assignments;
DROP POLICY IF EXISTS "Admin can write user_rk_assignments" ON public.user_rk_assignments;

CREATE POLICY "Admin can write user_rk_assignments"
    ON public.user_rk_assignments FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- Catatan: policy SELECT lama (read-only) sengaja TIDAK diubah.


-- ============================================================
-- 5. INDEX PERFORMA
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ckp_entries_upload_nilai_null
    ON public.ckp_entries(upload_id) WHERE nilai IS NULL;

CREATE INDEX IF NOT EXISTS idx_ckp_entries_rencana_kinerja
    ON public.ckp_entries(rencana_kinerja);

CREATE INDEX IF NOT EXISTS idx_ckp_uploads_status_tahun_bulan
    ON public.ckp_uploads(status, tahun, bulan);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
    ON public.audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_approvals_reviewer
    ON public.approvals(reviewer_id);

CREATE INDEX IF NOT EXISTS idx_users_role_active
    ON public.users(role) WHERE is_active;


-- ============================================================
-- 6. SATU UPLOAD AKTIF PER USER PER BULAN-TAHUN
-- ============================================================
-- status <> 'superseded' = upload "aktif" (draft/submitted/scored/approved/
-- rejected/revision_required). Versi lama harus ditandai 'superseded'
-- sebelum versi baru dibuat (sudah dilakukan server action).
--
-- Bila data lama melanggar, index TIDAK dibuat dan migrasi tetap sukses —
-- pesan NOTICE memberi tahu untuk bereskan duplikat lalu jalankan ulang blok ini.
DO $$
BEGIN
    BEGIN
        CREATE UNIQUE INDEX IF NOT EXISTS uniq_ckp_uploads_active_per_period
            ON public.ckp_uploads(user_id, bulan, tahun)
            WHERE status <> 'superseded';
        RAISE NOTICE 'Index unik upload aktif per periode siap (atau sudah ada).';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Index unik upload aktif TIDAK dibuat: %. Periksa duplikat ckp_uploads (user_id, bulan, tahun) dengan status <> ''superseded'', bereskan, lalu jalankan ulang blok DO ini.', SQLERRM;
    END;
END
$$;
