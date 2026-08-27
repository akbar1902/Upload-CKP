-- ============================================================
-- Migration 019: Add catatan_koreksi and superseded status
-- ============================================================

-- Tambahkan kolom catatan_koreksi untuk Ketua Tim memberikan feedback spesifik per kegiatan
ALTER TABLE public.ckp_entries
ADD COLUMN catatan_koreksi TEXT;

-- Tambahkan status 'superseded' untuk menandai versi CKP yang sudah diganti oleh versi baru
ALTER TYPE upload_status ADD VALUE IF NOT EXISTS 'superseded';
