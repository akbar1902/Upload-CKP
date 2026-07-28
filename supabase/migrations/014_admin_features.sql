-- ============================================================
-- CKP BPS Belitung - Admin Features Migration
-- ============================================================

-- 1. Create periode_ckp table
CREATE TABLE IF NOT EXISTS public.periode_ckp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bulan INT NOT NULL CHECK (bulan >= 1 AND bulan <= 12),
    tahun INT NOT NULL CHECK (tahun >= 2020 AND tahun <= 2100),
    is_locked BOOLEAN DEFAULT false,
    locked_at TIMESTAMPTZ,
    locked_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(bulan, tahun)
);

CREATE INDEX IF NOT EXISTS idx_periode_ckp_bt ON public.periode_ckp(bulan, tahun);

-- RLS for periode_ckp
ALTER TABLE public.periode_ckp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read periode_ckp"
    ON public.periode_ckp FOR SELECT
    USING (true);

CREATE POLICY "Only admin can insert/update/delete periode_ckp"
    ON public.periode_ckp FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 2. Update ckp_uploads policies to respect periode_ckp
-- We need to drop the old insert/update policies and recreate them with the check
DROP POLICY IF EXISTS "Pegawai can insert own uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pegawai can update own draft uploads" ON public.ckp_uploads;
DROP POLICY IF EXISTS "Pimpinan can update any upload" ON public.ckp_uploads;

CREATE POLICY "Pegawai can insert own uploads"
    ON public.ckp_uploads FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        NOT EXISTS (
            SELECT 1 FROM public.periode_ckp
            WHERE bulan = ckp_uploads.bulan AND tahun = ckp_uploads.tahun AND is_locked = true
        )
    );

CREATE POLICY "Pegawai can update own draft uploads"
    ON public.ckp_uploads FOR UPDATE
    USING (
        user_id = auth.uid() AND status IN ('draft', 'revision_required') AND
        NOT EXISTS (
            SELECT 1 FROM public.periode_ckp
            WHERE bulan = ckp_uploads.bulan AND tahun = ckp_uploads.tahun AND is_locked = true
        )
    )
    WITH CHECK (
        user_id = auth.uid() AND
        NOT EXISTS (
            SELECT 1 FROM public.periode_ckp
            WHERE bulan = ckp_uploads.bulan AND tahun = ckp_uploads.tahun AND is_locked = true
        )
    );

CREATE POLICY "Pimpinan can update any upload"
    ON public.ckp_uploads FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );

-- 3. Policy for Admin to read audit_logs
DROP POLICY IF EXISTS "Users can view own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admin can view all audit logs" ON public.audit_logs;

CREATE POLICY "Users can view own audit logs"
    ON public.audit_logs FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Admin can view all audit logs"
    ON public.audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
