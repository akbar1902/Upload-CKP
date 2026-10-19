"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';

/**
 * Transisi antar halaman.
 *
 * Konten lama tidak dianimasikan keluar — biarkan browser tyrant
 * menggantinya, lalu konten baru "naik" halus ke tempatnya. Ini
 * pola yang dipakai aplikasi modern (Linear, Vercel, Stripe):
 * keluar cepat, masuk lembut.
 *
 * Implementasi memakai Web Animations API (bukan key CSS) karena:
 *  - animasi otomatis terulang setiap pathname berubah, tanpa perlu
 *    remount (remount akan menghapus state client-side);
 *  - `useLayoutEffect` berjalan SEBELUM browser paint, jadi tidak ada
 *    frame "terang" yang berkedip sebelum animasi mulai.
 *
 * Hormati `prefers-reduced-motion`: kalau pengguna mematikan animasi
 * di sistem, halaman langsung tampil tanpa gerak sama sekali.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hostRef = React.useRef<HTMLDivElement>(null);
  const isFirst = React.useRef(true);

  React.useLayoutEffect(() => {
    // Render pertama: jangan animasikan, halaman baru saja dimuat.
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const el = hostRef.current;
    if (!el) return;

    if (
      typeof window === 'undefined' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const animation = el.animate(
      [
        { opacity: 0, transform: 'translate3d(0, 10px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ],
      {
        duration: 380,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      }
    );

    // Bersihkan setelah selesai supaya style element kembali normal
    // (mis. saat ada perubahan layout lain setelah transisi).
    animation.finished
      .then(() => animation.cancel())
      .catch(() => {
        /* dibatalkan — abaikan */
      });

    return () => animation.cancel();
  }, [pathname]);

  return (
    <div ref={hostRef} className="flex-1 min-w-0">
      {children}
    </div>
  );
}
