-- ============================================================
-- 032_reminder_schedule_25th.sql
-- Mengubah jadwal reminder CKP dari harian (030) menjadi BULANAN:
-- setiap TANGGAL 25 pukul 15:00 WIB.
--
-- pg_cron Supabase berjalan pada zona waktu UTC.
-- 15:00 WIB (Asia/Jakarta, UTC+7) = 08:00 UTC.
-- Maka ekspresi cron: '0 8 25 * *'
--   menit 0, jam 8 UTC, tanggal 25, setiap bulan, setiap hari kerja.
--
-- IDEMPOTENT: aman dijalankan berulang kali.
-- ============================================================

DO $$
BEGIN
    -- Hapus jadwal lama (harian) bila masih ada.
    BEGIN
        PERFORM cron.unschedule('ckp-period-reminder-daily');
        RAISE NOTICE 'Jadwal lama (harian) dihapus.';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Tidak ada jadwal lama bernama ckp-period-reminder-daily (%).', SQLERRM;
    END;

    -- Hindari duplikat bila migrasi dijalankan ulang.
    BEGIN
        PERFORM cron.unschedule('ckp-period-reminder-25th');
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- Jadwal baru: tanggal 25 setiap bulan, 15:00 WIB.
    PERFORM cron.schedule(
        'ckp-period-reminder-25th',
        '0 8 25 * *',
        $cron$ SELECT public.send_ckp_period_reminders(); $cron$
    );
    RAISE NOTICE 'Jadwal reminder CKP baru aktif: setiap tanggal 25 pukul 15:00 WIB (08:00 UTC).';
END;
$$;
