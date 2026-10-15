"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Indeterminate progress bar yang muncul saat filter periode / refetch
 * sedang berjalan. Dipakai di atas konten dashboard.
 *
 * Kenapa perlu: perubahan filter kini hanya mengubah query key React Query
 * (tanpa navigasi server), sehingga TopLoader bawaan tidak ikut berjalan.
 * Bar ini memberi umpan balik visual yang jelas.
 */
export function FetchingBar({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="fetching-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-0 left-0 right-0 z-30 h-[3px] overflow-hidden rounded-full"
          style={{ background: 'var(--primary-soft)' }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-y-0 left-0 w-1/3 rounded-full"
            style={{ background: 'var(--primary)' }}
            animate={{ x: ['-120%', '360%'] }}
            transition={{ duration: 1.05, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Overlay lembut di atas area data saat periode berganti. Data lama tetap
 * terlihat (keepPreviousData) sehingga tidak ada "flash" skeleton, tapi ada
 * gerakan/spinner yang menandakan sedang memuat.
 *
 * Parent WAJIB memiliki `position: relative`.
 */
export function FetchingOverlay({ show, label }: { show: boolean; label?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="fetching-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 z-20 flex items-start justify-center rounded-3xl pointer-events-none"
          style={{
            background: 'var(--overlay-scrim)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <motion.div
            initial={{ y: -10, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="mt-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2.5"
            style={{
              background: 'var(--card-bg)',
              boxShadow: 'var(--neu-raised-sm)',
              border: '1px solid var(--border-soft)',
            }}
          >
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--primary)' }} />
            <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              {label || 'Memuat data…'}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
