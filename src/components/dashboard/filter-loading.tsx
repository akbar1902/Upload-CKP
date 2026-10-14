"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { MOTION, SPRING, useMotionSafe } from '@/lib/motion';

/**
 * Indeterminate progress bar yang muncul saat filter periode / refetch
 * sedang berjalan. Dipakai di atas konten dashboard.
 *
 * Kenapa perlu: perubahan filter kini hanya mengubah query key React Query
 * (tanpa navigasi server), sehingga TopLoader bawaan tidak ikut berjalan.
 * Bar ini memberi umpan balik visual yang jelas.
 *
 * Fase 3 (motion): gerak bar digerakkan CSS keyframe (`fetching-bar-track`) —
 * bukan animation loop JS framer; visual, durasi (1.05s), dan rentang geser
 * (-120% → 360%) dipertahankan persis. Fade wrapper tetap via AnimatePresence
 * dengan token durasi §B1.
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
          transition={{ duration: MOTION.fast / 1000 }}
          className="absolute top-0 left-0 right-0 z-30 h-[3px] overflow-hidden rounded-full"
          style={{ background: 'var(--primary-soft)' }}
          aria-hidden="true"
        >
          <div
            className="fetching-bar-track absolute inset-y-0 left-0 w-1/3 rounded-full"
            style={{ background: 'var(--primary)' }}
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
 * Pattern ini adalah primitive bersama untuk seluruh halaman (route-transition
 * lama sudah dipensiunkan di Fase 1 — tidak ada implementasi paralel lagi).
 * Nilai gerak memakai token/preset kanonik: `spring-crisp` (SPEC §B3) + durasi
 * `--duration-fast`; offset transform dimatikan saat reduced-motion (G1 —
 * fade tetap).
 *
 * Parent WAJIB memiliki `position: relative`.
 */
export function FetchingOverlay({ show, label }: { show: boolean; label?: string }) {
  const motionSafe = useMotionSafe();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="fetching-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: MOTION.fast / 1000 }}
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
            initial={{ y: motionSafe ? -10 : 0, opacity: 0, scale: motionSafe ? 0.96 : 1 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: motionSafe ? -10 : 0, opacity: 0 }}
            transition={SPRING.crisp}
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
