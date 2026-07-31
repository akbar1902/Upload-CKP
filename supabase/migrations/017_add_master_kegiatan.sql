-- 1. Membuat tabel master kegiatan anggota
CREATE TABLE public.master_kegiatan_anggota (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rk_id UUID NOT NULL REFERENCES public.rk_ketua_tim_mapping(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    kegiatan_nama TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rk_id, user_id, kegiatan_nama)
);

-- 2. Indexes untuk performa pencarian yang cepat
CREATE INDEX idx_master_kegiatan_user ON public.master_kegiatan_anggota(user_id);
CREATE INDEX idx_master_kegiatan_rk ON public.master_kegiatan_anggota(rk_id);
CREATE INDEX idx_master_kegiatan_nama ON public.master_kegiatan_anggota(kegiatan_nama);

-- 3. Mengaktifkan Row Level Security
ALTER TABLE public.master_kegiatan_anggota ENABLE ROW LEVEL SECURITY;

-- 4. Policies agar bisa diakses oleh aplikasi
CREATE POLICY "Anyone can read master_kegiatan_anggota"
    ON public.master_kegiatan_anggota FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can insert master_kegiatan_anggota"
    ON public.master_kegiatan_anggota FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can update delete master_kegiatan_anggota"
    ON public.master_kegiatan_anggota FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can delete master_kegiatan_anggota"
    ON public.master_kegiatan_anggota FOR DELETE
    USING (auth.uid() IS NOT NULL);
