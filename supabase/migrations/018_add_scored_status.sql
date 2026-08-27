-- ============================================================
-- Migration 018: Add 'scored' status to upload_status enum
-- Triggered automatically when all RKs of an upload are scored.
-- Sits between 'submitted' and 'approved' in the approval flow.
-- ============================================================

ALTER TYPE upload_status ADD VALUE IF NOT EXISTS 'scored' AFTER 'submitted';
