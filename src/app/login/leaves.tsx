import type { CSSProperties } from 'react';
import s from './login.module.css';

/**
 * Daun ketapang gugur tertiup angin (kanan → kiri).
 *
 * Performa: setiap daun = 2 elemen HTML yang HANYA dianimasikan lewat
 * `transform` + `opacity` → dijalankan compositor (GPU), tanpa layout/paint,
 * stabil 60 fps. Posisi memakai unit container query (cqw/cqh) dari `.scene`.
 *
 * [x0, y0, xMid, yMid, x1, y1] dalam % lebar/tinggi adegan,
 * dur & delay (detik; delay negatif = sudah melayang saat halaman dibuka),
 * size (px), tone (indeks warna), sway (detik ayunan).
 */
const LEAVES: ReadonlyArray<{
  path: readonly [number, number, number, number, number, number];
  dur: number;
  delay: number;
  size: number;
  tone: 1 | 2 | 3 | 4;
  sway: number;
}> = [
  { path: [104, 6, 62, 28, -8, 64], dur: 14, delay: -1, size: 15, tone: 1, sway: 1.9 },
  { path: [108, 22, 70, 44, 6, 92], dur: 17, delay: -6, size: 12, tone: 3, sway: 2.4 },
  { path: [101, -4, 52, 20, -10, 52], dur: 12, delay: -9, size: 13, tone: 2, sway: 1.6 },
  { path: [107, 34, 60, 52, 12, 98], dur: 16, delay: -3, size: 16, tone: 4, sway: 2.2 },
  { path: [104, 12, 48, 38, -12, 78], dur: 19, delay: -12, size: 11, tone: 1, sway: 2.8 },
  { path: [110, 26, 76, 38, 22, 84], dur: 15, delay: -7.5, size: 14, tone: 3, sway: 2 },
  { path: [102, 2, 40, 24, -10, 44], dur: 13, delay: -4.5, size: 12, tone: 2, sway: 1.7 },
];

const TONE_CLASS = { 1: s.leafTone1, 2: s.leafTone2, 3: s.leafTone3, 4: s.leafTone4 } as const;

export function FallingLeaves() {
  return (
    <div className={s.leaves} aria-hidden="true">
      {LEAVES.map((l, i) => {
        const [x0, y0, xm, ym, x1, y1] = l.path;
        const style = {
          '--x0': x0, '--y0': y0, '--xm': xm, '--ym': ym, '--x1': x1, '--y1': y1,
          '--dur': `${l.dur}s`, '--delay': `${l.delay}s`, '--sway': `${l.sway}s`,
        } as CSSProperties;
        return (
          <span key={i} className={s.leafPath} style={style}>
            <span className={`${s.leafSpin} ${TONE_CLASS[l.tone]}`}>
              <svg width={l.size} height={l.size} viewBox="0 0 20 20">
                <path d="M10 1 C 16.5 5 17.5 13 10 19 C 2.5 13 3.5 5 10 1 Z" fill="currentColor" />
                <path d="M10 3 L 10 18" stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
              </svg>
            </span>
          </span>
        );
      })}
    </div>
  );
}
