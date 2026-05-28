-- ============================================================
-- CKP BPS Belitung - Supabase Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================
CREATE TYPE user_role AS ENUM ('pegawai', 'pimpinan', 'admin');
CREATE TYPE upload_status AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'revision_required');
CREATE TYPE approval_action AS ENUM ('approved', 'rejected', 'revision_required', 'reopened');

-- ============================================================
-- TABLES
-- ============================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    nip TEXT UNIQUE,
    role user_role NOT NULL DEFAULT 'pegawai',
    unit_kerja TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee profiles (additional info)
CREATE TABLE public.employee_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    jabatan TEXT,
    golongan TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CKP Uploads (one per employee per month per version)
CREATE TABLE public.ckp_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bulan INT NOT NULL CHECK (bulan >= 1 AND bulan <= 12),
    tahun INT NOT NULL CHECK (tahun >= 2020 AND tahun <= 2100),
    status upload_status NOT NULL DEFAULT 'draft',
    version INT NOT NULL DEFAULT 1,
    file_name TEXT,
    file_url TEXT,
    storage_path TEXT,
    total_entries INT DEFAULT 0,
    avg_progres FLOAT DEFAULT 0,
    catatan_pimpinan TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES public.users(id),
    UNIQUE(user_id, bulan, tahun, version)
);

-- CKP Entries (parsed rows from Excel)
CREATE TABLE public.ckp_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upload_id UUID NOT NULL REFERENCES public.ckp_uploads(id) ON DELETE CASCADE,
    row_number INT NOT NULL,
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    jam_mulai TIME,
    jam_selesai TIME,
    rencana_kinerja TEXT,
    kegiatan TEXT,
    progres FLOAT DEFAULT 0 CHECK (progres >= 0 AND progres <= 100),
    capaian TEXT,
    data_dukung TEXT,
    extra_columns JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approvals (history of approval actions)
CREATE TABLE public.approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upload_id UUID NOT NULL REFERENCES public.ckp_uploads(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.users(id),
    action approval_action NOT NULL,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_ckp_uploads_user ON public.ckp_uploads(user_id);
CREATE INDEX idx_ckp_uploads_period ON public.ckp_uploads(bulan, tahun);
CREATE INDEX idx_ckp_uploads_status ON public.ckp_uploads(status);
CREATE INDEX idx_ckp_entries_upload ON public.ckp_entries(upload_id);
CREATE INDEX idx_approvals_upload ON public.approvals(upload_id);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ckp_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ckp_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Pimpinan can view all users"
    ON public.users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Employee profiles policies
CREATE POLICY "Users can view own employee profile"
    ON public.employee_profiles FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Pimpinan can view all employee profiles"
    ON public.employee_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );

-- CKP Uploads policies
CREATE POLICY "Pegawai can view own uploads"
    ON public.ckp_uploads FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Pimpinan can view all uploads"
    ON public.ckp_uploads FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );

CREATE POLICY "Pegawai can insert own uploads"
    ON public.ckp_uploads FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Pegawai can update own draft uploads"
    ON public.ckp_uploads FOR UPDATE
    USING (user_id = auth.uid() AND status IN ('draft', 'revision_required'))
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Pimpinan can update any upload"
    ON public.ckp_uploads FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );

-- CKP Entries policies
CREATE POLICY "Pegawai can view own entries"
    ON public.ckp_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.ckp_uploads
            WHERE id = upload_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Pimpinan can view all entries"
    ON public.ckp_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );

CREATE POLICY "Pegawai can insert entries for own uploads"
    ON public.ckp_entries FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ckp_uploads
            WHERE id = upload_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Pegawai can delete entries for own draft uploads"
    ON public.ckp_entries FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.ckp_uploads
            WHERE id = upload_id AND user_id = auth.uid()
            AND status IN ('draft', 'revision_required')
        )
    );

-- Approvals policies
CREATE POLICY "Users can view approvals for own uploads"
    ON public.approvals FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.ckp_uploads
            WHERE id = upload_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Pimpinan can manage approvals"
    ON public.approvals FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );

-- Audit logs policies
CREATE POLICY "Users can view own audit logs"
    ON public.audit_logs FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Pimpinan can view all audit logs"
    ON public.audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );

CREATE POLICY "Anyone can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, nip, role, unit_kerja)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'nip',
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'pegawai'),
        NEW.raw_user_meta_data->>'unit_kerja'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update upload stats when entries change
CREATE OR REPLACE FUNCTION public.update_upload_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_upload_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_upload_id := OLD.upload_id;
    ELSE
        target_upload_id := NEW.upload_id;
    END IF;

    UPDATE public.ckp_uploads
    SET
        total_entries = (SELECT COUNT(*) FROM public.ckp_entries WHERE upload_id = target_upload_id),
        avg_progres = (SELECT COALESCE(AVG(progres), 0) FROM public.ckp_entries WHERE upload_id = target_upload_id)
    WHERE id = target_upload_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_entry_change
    AFTER INSERT OR UPDATE OR DELETE ON public.ckp_entries
    FOR EACH ROW EXECUTE FUNCTION public.update_upload_stats();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_employee_profiles_updated_at
    BEFORE UPDATE ON public.employee_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Run this in Supabase Dashboard > Storage
-- Create bucket: ckp-files (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('ckp-files', 'ckp-files', false);

-- Storage policies
CREATE POLICY "Pegawai can upload own files"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'ckp-files'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Pegawai can view own files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'ckp-files'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Pimpinan can view all files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'ckp-files'
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );
