-- Fitur "Buat CKP" (Fase 1): draft CKP per pegawai per bulan + pengaturan
-- penyusun draft (kamus singkatan & kata kunci RK).
--
-- Kedua tabel hanya diakses server (service role) setelah sesi pegawai
-- diverifikasi di server action, sama seperti integration_tokens (035/036).
-- Draft TIDAK disimpan di ckp_uploads agar dashboard, KPI, pengingat, dan
-- antrean penilaian tidak ikut membaca CKP yang belum disubmit.

CREATE TABLE IF NOT EXISTS public.ckp_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bulan SMALLINT NOT NULL,
    tahun SMALLINT NOT NULL,
    -- Baris draft: [{ id, namaFile, fileId, link, tanggalMulai, tanggalSelesai,
    --                kegiatan, rk, usulan[], rkManual, perluReview, alasan }]
    rows JSONB NOT NULL DEFAULT '[]'::jsonb,
    drive_folder_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ckp_drafts_bulan CHECK (bulan BETWEEN 1 AND 12),
    CONSTRAINT ckp_drafts_tahun CHECK (tahun BETWEEN 2020 AND 2100),
    CONSTRAINT ckp_drafts_rows_array CHECK (jsonb_typeof(rows) = 'array'),
    CONSTRAINT ckp_drafts_rows_size CHECK (pg_column_size(rows) < 2000000),
    CONSTRAINT ckp_drafts_unique UNIQUE (user_id, bulan, tahun)
);

CREATE TABLE IF NOT EXISTS public.user_ckp_settings (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    -- [{ singkatan, ekspansi }]
    kamus JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- [{ rk, kunci: [] }]
    rk_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_ckp_settings_kamus_array CHECK (jsonb_typeof(kamus) = 'array'),
    CONSTRAINT user_ckp_settings_keywords_array CHECK (jsonb_typeof(rk_keywords) = 'array')
);

ALTER TABLE public.ckp_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ckp_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ckp_drafts deny client access" ON public.ckp_drafts;
CREATE POLICY "ckp_drafts deny client access"
    ON public.ckp_drafts
    FOR ALL
    TO authenticated, anon
    USING (false)
    WITH CHECK (false);

DROP POLICY IF EXISTS "user_ckp_settings deny client access" ON public.user_ckp_settings;
CREATE POLICY "user_ckp_settings deny client access"
    ON public.user_ckp_settings
    FOR ALL
    TO authenticated, anon
    USING (false)
    WITH CHECK (false);

COMMENT ON TABLE public.ckp_drafts IS
    'Draft CKP fitur Buat CKP (belum disubmit). Hanya untuk server.';
COMMENT ON TABLE public.user_ckp_settings IS
    'Kamus singkatan & kata kunci RK per pegawai untuk Buat CKP. Hanya untuk server.';
