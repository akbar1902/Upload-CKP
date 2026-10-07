"use client";

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Mengubah query param `bulan` / `tahun` memakai native History API.
 *
 * Next.js mengintegrasikan `window.history.pushState` dengan router-nya,
 * sehingga `useSearchParams()` tetap sinkron TANPA memicu request RSC ke
 * server. Inilah kunci agar ganti periode terasa instan: filter hanya
 * mengganti query key React Query di client, bukan render ulang server
 * component (yang dulu menjalankan prefetch Supabase berulang).
 */
export function usePeriodParams() {
  const pathname = usePathname();

  return useCallback(
    (next: { bulan: string | number; tahun: number }) => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      params.set('bulan', String(next.bulan));
      params.set('tahun', String(next.tahun));
      window.history.pushState(null, '', `${pathname}?${params.toString()}`);
    },
    [pathname]
  );
}
