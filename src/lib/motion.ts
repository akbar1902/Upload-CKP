import { useReducedMotion } from 'framer-motion';

/**
 * Konstanta motion untuk JS — cerminan token di `src/app/globals.css` (§B1
 * design/MOTION-SPEC.md). Gunakan nilai dari sini, jangan menulis angka baru:
 * token adalah kontrak, angka hardcoded dianggap defect.
 */

/** Durasi (ms) — sama dengan token CSS terkait. */
export const MOTION = {
  /** --duration-press: feedback tekan tombol */
  press: 120,
  /** --duration-fast: hover, tombol, dropdown, input */
  fast: 180,
  /** --duration-enter: pola handoff entrance */
  enter: 210,
  /** --duration: modal, drawer, expand besar */
  base: 300,
  /** --duration-slow: progres/bar chart */
  slow: 480,
  /** --duration-exit: pola handoff exit */
  exit: 150,
} as const;

type Bezier = [number, number, number, number];

/** Easing cubic-bezier — sama dengan token CSS terkait. */
export const EASE = {
  /** --ease-apple */
  apple: [0.25, 0.1, 0.25, 1] as Bezier,
  /** --ease-spring */
  spring: [0.34, 1.56, 0.64, 1] as Bezier,
  /** --ease-out-strong */
  outStrong: [0.23, 1, 0.32, 1] as Bezier,
  /** --ease-in-out-strong */
  inOutStrong: [0.77, 0, 0.175, 1] as Bezier,
  /** --ease-drawer */
  drawer: [0.32, 0.72, 0, 1] as Bezier,
} as const;

/**
 * Preset spring kanonik (SPEC §B3). `crisp` = preset lama 380/30 yang
 * DIPERTAHANKAN (pill loading/fetching) — jangan diganti. `pop` hanya untuk
 * momen langka (≤3 tempat se-aplikasi).
 */
export const SPRING = {
  crisp: { type: 'spring' as const, stiffness: 380, damping: 30 },
  soft: { type: 'spring' as const, stiffness: 260, damping: 30 },
  pop: { type: 'spring' as const, stiffness: 500, damping: 28, mass: 0.8 },
} as const;

/**
 * Hook: apakah aman menganimasikan gerak? (`false` saat pengguna meminta
 * reduced motion — bungkus `useReducedMotion` agar konsisten & SSR-safe).
 */
export function useMotionSafe(): boolean {
  return useReducedMotion() !== true;
}
