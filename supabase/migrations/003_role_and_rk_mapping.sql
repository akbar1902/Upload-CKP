-- 1. Mengubah ENUM user_role: mengubah 'pegawai' menjadi 'anggota' dan menambahkan 'ketua_tim'
ALTER TYPE public.user_role RENAME VALUE 'pegawai' TO 'anggota';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'ketua_tim' AFTER 'anggota';

-- 2. Membuat tabel mapping Rencana Kinerja ke Ketua Tim
CREATE TABLE public.rk_ketua_tim_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rencana_kinerja TEXT NOT NULL UNIQUE,
    ketua_tim_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    tim_kerja TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes untuk mapping
CREATE INDEX idx_rk_ketua_tim_mapping_rk ON public.rk_ketua_tim_mapping(rencana_kinerja);
CREATE INDEX idx_rk_ketua_tim_mapping_ketua ON public.rk_ketua_tim_mapping(ketua_tim_id);

-- RLS untuk rk_ketua_tim_mapping
ALTER TABLE public.rk_ketua_tim_mapping ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rk_ketua_tim_mapping"
    ON public.rk_ketua_tim_mapping FOR SELECT
    USING (true);

CREATE POLICY "Only admin/pimpinan can insert/update/delete rk mapping"
    ON public.rk_ketua_tim_mapping FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );

-- 3. Modifikasi ckp_entries untuk menyimpan nilai dan siapa yang menilai
ALTER TABLE public.ckp_entries RENAME COLUMN nilai_pimpinan TO nilai;
ALTER TABLE public.ckp_entries ADD COLUMN dinilai_oleh UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- 4. Memperbarui fungsi update_upload_stats karena perubahan nama kolom
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
        avg_progres = (SELECT COALESCE(AVG(progres), 0) FROM public.ckp_entries WHERE upload_id = target_upload_id),
        rata_rata_nilai = (SELECT COALESCE(AVG(nilai), 0) FROM public.ckp_entries WHERE upload_id = target_upload_id AND nilai IS NOT NULL)
    WHERE id = target_upload_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Tambahkan policy untuk Ketua Tim agar bisa update nilai
CREATE POLICY "Ketua Tim can update entries in their RK"
    ON public.ckp_entries FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('ketua_tim', 'pimpinan', 'admin')
        )
        AND
        -- Pastikan rencana_kinerja ini milik ketua_tim tersebut (atau user adalah pimpinan)
        (
            EXISTS (
                SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
            )
            OR
            EXISTS (
                SELECT 1 FROM public.rk_ketua_tim_mapping
                WHERE rencana_kinerja = public.ckp_entries.rencana_kinerja
                AND ketua_tim_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('ketua_tim', 'pimpinan', 'admin')
        )
    );
