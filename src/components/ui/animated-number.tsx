"use client";

import * as React from 'react';

/**
 * Angka yang menghitung naik dari 0 ke nilai akhir.
 *
 * Memberi kesan "data hidup" saat halaman dashboard terbuka — angka
 * tidak muncul mendadak, tapi naik seperti dihitung di depan mata.
 *
 * Hormati `prefers-reduced-motion`: kalau animasi dimatikan di
 * sistem, angka langsung tampil final.
 */
export interface AnimatedNumberProps {
  value: number;
  /** Format akhir (default: bulat dengan pemisah ribuan id-ID). */
  format?: (n: number) => string;
  durationMs?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  format,
  durationMs = 650,
  className,
}: AnimatedNumberProps) {
  const [display, setDisplay] = React.useState(0);
  const frameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      const raf = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(raf);
    }

    // Nilai awal = nilai yang sedang ditampilkan, supaya perubahan
    // angka berikutnya menyambung dari posisi sekarang, bukan melompat.
    const from = display;
    const delta = value - from;
    if (delta === 0) {
      const raf = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(raf);
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutExpo — cepat di awal, melambat halus di akhir.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(from + delta * eased);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
    // `display` sengaja tidak jadi dependency — kalau tidak, animasi
    // akan berputar sendiri setiap frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  const formatted = format
    ? format(display)
    : Math.round(display).toLocaleString('id-ID');

  return (
    <span className={className} aria-label={format ? format(value) : value.toLocaleString('id-ID')}>
      {formatted}
    </span>
  );
}
