-- Menambahkan kolom nilai_pimpinan pada ckp_entries
ALTER TABLE public.ckp_entries
ADD COLUMN nilai_pimpinan INT CHECK (nilai_pimpinan >= 0 AND nilai_pimpinan <= 100);

-- Menambahkan kolom rata_rata_nilai pada ckp_uploads
ALTER TABLE public.ckp_uploads
ADD COLUMN rata_rata_nilai FLOAT DEFAULT 0;

-- Memperbarui fungsi update_upload_stats agar menghitung rata_rata_nilai
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
        rata_rata_nilai = (SELECT COALESCE(AVG(nilai_pimpinan), 0) FROM public.ckp_entries WHERE upload_id = target_upload_id AND nilai_pimpinan IS NOT NULL)
    WHERE id = target_upload_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Menambahkan policy UPDATE untuk Pimpinan agar bisa mengisi nilai_pimpinan
CREATE POLICY "Pimpinan can update entries"
    ON public.ckp_entries FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );
