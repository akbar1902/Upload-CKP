-- ============================================================
-- 030_analytics_and_reminders.sql
-- ------------------------------------------------------------------
-- BERISI:
--   1. Tabel riwayat nilai  : ckp_entry_score_history (+ trigger)
--   2. Reminder in-app      : fungsi send_ckp_period_reminders()
--                             + penjadwalan harian via pg_cron
--   3. View analitik        : v_ckp_monthly_stats
--
-- Sifat migrasi: IDEMPOTENT — aman dijalankan berulang kali
-- (CREATE ... IF NOT EXISTS / CREATE OR REPLACE / DROP ... IF EXISTS).
-- ============================================================


-- ============================================================
-- 1. RIWAYAT PERUBAHAN NILAI (AUDIT TRACE)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ckp_entry_score_history (
    id                    BIGSERIAL PRIMARY KEY,
    entry_id              UUID NOT NULL REFERENCES public.ckp_entries(id) ON DELETE CASCADE,
    upload_id             UUID REFERENCES public.ckp_uploads(id) ON DELETE CASCADE,
    nilai_lama            NUMERIC,
    nilai_baru            NUMERIC,
    catatan_koreksi_lama  TEXT,
    catatan_koreksi_baru  TEXT,
    changed_by            UUID REFERENCES public.users(id) ON DELETE SET NULL,
    changed_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.ckp_entry_score_history IS
    'Riwayat perubahan nilai & catatan koreksi pada ckp_entries (diisi otomatis oleh trigger).';

CREATE INDEX IF NOT EXISTS idx_ckp_entry_score_history_entry
    ON public.ckp_entry_score_history(entry_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_ckp_entry_score_history_upload
    ON public.ckp_entry_score_history(upload_id);

-- Trigger function: catat perubahan bila nilai ATAU catatan_koreksi berubah.
-- SECURITY DEFINER + search_path=public agar trigger berjalan sebagai pemilik
-- fungsi (postgres) dan tidak terhambat RLS tabel riwayat.
CREATE OR REPLACE FUNCTION public.log_ckp_entry_score_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF (NEW.nilai IS DISTINCT FROM OLD.nilai)
       OR (NEW.catatan_koreksi IS DISTINCT FROM OLD.catatan_koreksi) THEN
        INSERT INTO public.ckp_entry_score_history (
            entry_id, upload_id,
            nilai_lama, nilai_baru,
            catatan_koreksi_lama, catatan_koreksi_baru,
            changed_by, changed_at
        ) VALUES (
            NEW.id, NEW.upload_id,
            OLD.nilai, NEW.nilai,
            OLD.catatan_koreksi, NEW.catatan_koreksi,
            -- Penilaian di aplikasi berjalan lewat service role (tanpa auth.uid()),
            -- jadi fallback ke kolom dinilai_oleh yang diisi server action.
            COALESCE(auth.uid(), NEW.dinilai_oleh), NOW()
        );
    END IF;
    RETURN NEW;
END;
$$;

-- Pastikan fungsi dimiliki postgres (trigger definer). Dibungkus exception
-- agar tetap sukses di lingkungan tanpa role postgres (self-hosted).
DO $$
BEGIN
    BEGIN
        ALTER FUNCTION public.log_ckp_entry_score_change() OWNER TO postgres;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Tidak bisa mengubah owner fungsi riwayat nilai ke postgres: %', SQLERRM;
    END;
END;
$$;

DROP TRIGGER IF EXISTS trg_ckp_entry_score_history ON public.ckp_entries;
CREATE TRIGGER trg_ckp_entry_score_history
    AFTER UPDATE OF nilai, catatan_koreksi ON public.ckp_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.log_ckp_entry_score_change();

-- RLS tabel riwayat.
-- INSERT dilakukan lewat trigger SECURITY DEFINER (tidak butuh policy INSERT).
-- Kebijakan baca: pimpinan/admin melihat semua; pegawai melihat riwayat
-- upload miliknya sendiri. Hapus policy ini bila ingin hanya service-role
-- yang bisa membaca (lihat catatan di laporan integrasi).
ALTER TABLE public.ckp_entry_score_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pimpinan_admin_read_score_history" ON public.ckp_entry_score_history;
CREATE POLICY "pimpinan_admin_read_score_history"
    ON public.ckp_entry_score_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('pimpinan', 'admin')
        )
    );

DROP POLICY IF EXISTS "owners_read_score_history" ON public.ckp_entry_score_history;
CREATE POLICY "owners_read_score_history"
    ON public.ckp_entry_score_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.ckp_uploads
            WHERE id = upload_id AND user_id = auth.uid()
        )
    );


-- ============================================================
-- 2. REMINDER OTOMATIS CKP (IN-APP NOTIFICATIONS)
-- ============================================================

-- CATATAN PENTING:
-- Tabel notifications (migrasi 021) membatasi kolom `type` lewat CHECK.
-- Reminder memakai type baru 'reminder', jadi constraint perlu diperluas.
-- Ini SATU-SATUNYA perubahan pada objek lama di migrasi ini.
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
    CHECK (type IN (
        'approved', 'rejected', 'revision_required', 'reopened',
        'scored', 'submitted', 'comment', 'reminder'
    ));

-- Fungsi: kirim pengingat untuk periode BERJALAN (bulan & tahun CURRENT_DATE)
-- ke semua user aktif (anggota/ketua_tim) yang BELUM punya upload CKP.
-- Duplikat dicegah: satu notifikasi per user per hari.
CREATE OR REPLACE FUNCTION public.send_ckp_period_reminders()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_bulan       INTEGER := EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER;
    v_tahun       INTEGER := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;
    v_bulan_nama  TEXT;
    v_inserted    INTEGER := 0;
BEGIN
    -- Nama bulan Indonesia (CASE lebih aman daripada locale to_char).
    v_bulan_nama := CASE v_bulan
        WHEN 1  THEN 'Januari'
        WHEN 2  THEN 'Februari'
        WHEN 3  THEN 'Maret'
        WHEN 4  THEN 'April'
        WHEN 5  THEN 'Mei'
        WHEN 6  THEN 'Juni'
        WHEN 7  THEN 'Juli'
        WHEN 8  THEN 'Agustus'
        WHEN 9  THEN 'September'
        WHEN 10 THEN 'Oktober'
        WHEN 11 THEN 'November'
        ELSE 'Desember'
    END;

    -- SATU statement INSERT ... SELECT (sesuai spesifikasi).
    INSERT INTO public.notifications (user_id, type, title, body)
    SELECT
        u.id,
        'reminder',
        'CKP ' || v_bulan_nama || ' belum diupload',
        'Batas pengisian CKP ' || v_bulan_nama || ' ' || v_tahun
            || ' adalah tanggal 25. Mohon segera lengkapi dan unggah CKP Anda sebelum batas waktu.'
    FROM public.users u
    WHERE u.role IN ('anggota', 'ketua_tim')
      AND u.is_active = TRUE
      -- Belum punya upload apa pun (selain versi arsip/superseded) periode ini.
      AND NOT EXISTS (
          SELECT 1
          FROM public.ckp_uploads c
          WHERE c.user_id = u.id
            AND c.bulan = v_bulan
            AND c.tahun = v_tahun
            AND c.status <> 'superseded'
      )
      -- Hindari duplikat: sudah dinotifikasi hari ini.
      AND NOT EXISTS (
          SELECT 1
          FROM public.notifications n
          WHERE n.user_id = u.id
            AND n.type = 'reminder'
            AND n.upload_id IS NULL
            AND n.created_at::date = CURRENT_DATE
      );

    GET DIAGNOSTICS v_inserted = ROW_COUNT;
    RETURN v_inserted;
END;
$$;

COMMENT ON FUNCTION public.send_ckp_period_reminders() IS
    'Mengirim notifikasi in-app pengingat CKP bulan berjalan ke pegawai/ketua tim yang belum upload. Dipanggil harian oleh pg_cron (atau manual).';

-- ── Penjadwalan pg_cron ─────────────────────────────────────
-- Jadwal '0 1 * * *' = 01:00 UTC = 08:00 WIB (Asia/Jakarta, UTC+7).
-- Bila pg_cron tidak tersedia / hak kurang, migrasi TETAP SUKSES
-- (hanya menampilkan NOTICE). Cara menjadwalkan manual di Supabase
-- SQL Editor:
--   SELECT cron.schedule(
--     'ckp-period-reminder-daily',
--     '0 1 * * *',
--     $$ SELECT public.send_ckp_period_reminders(); $$
--   );
-- Cek jadwal: SELECT * FROM cron.job;
-- Hapus jadwal: SELECT cron.unschedule('ckp-period-reminder-daily');
-- Uji manual: SELECT public.send_ckp_period_reminders();
DO $$
BEGIN
    BEGIN
        CREATE EXTENSION IF NOT EXISTS pg_cron;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'pg_cron tidak dapat diaktifkan (%). Reminder belum terjadwal — jadwalkan manual via SQL Editor.', SQLERRM;
    END;

    BEGIN
        PERFORM cron.schedule(
            'ckp-period-reminder-daily',
            '0 1 * * *',
            $cron$ SELECT public.send_ckp_period_reminders(); $cron$
        );
        RAISE NOTICE 'Jadwal reminder CKP harian aktif: 01:00 UTC (08:00 WIB).';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Gagal menjadwalkan reminder CKP (%). Jadwalkan manual via SQL Editor.', SQLERRM;
    END;
END;
$$;


-- ============================================================
-- 3. VIEW AGREGAT BULANAN (OPSIONAL, UNTUK QUERY MANUAL / BI)
-- ============================================================
-- Hanya membaca kolom yang benar-benar ada:
--   ckp_uploads: tahun, bulan, status, avg_progres, rata_rata_nilai.
-- security_invoker = ON agar RLS tabel di bawahnya tetap berlaku bagi
-- pemanggil (view tidak menjadi celah baca data).
CREATE OR REPLACE VIEW public.v_ckp_monthly_stats
WITH (security_invoker = TRUE) AS
SELECT
    tahun,
    bulan,
    COUNT(*)::INTEGER                                         AS jumlah_upload,
    COUNT(*) FILTER (WHERE status = 'approved')::INTEGER      AS jumlah_approved,
    ROUND(AVG(avg_progres)::NUMERIC, 2)                       AS rata_rata_progres,
    ROUND((AVG(rata_rata_nilai) FILTER (WHERE rata_rata_nilai > 0))::NUMERIC, 2) AS rata_rata_nilai
FROM public.ckp_uploads
WHERE status <> 'superseded'
GROUP BY tahun, bulan;

COMMENT ON VIEW public.v_ckp_monthly_stats IS
    'Agregat bulanan CKP (jumlah upload, approved, rata-rata progres/nilai) — status superseded dikecualikan.';
