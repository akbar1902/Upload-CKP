import React from 'react';
import { ViewTransition } from 'react';

/**
 * PageTransition — transisi konten halaman antar-rute (Fase 1).
 *
 * Mekanisme: `<ViewTransition>` React (native browser View Transitions,
 * diaktifkan `experimental.viewTransition` di next.config.ts — keputusan spike
 * ada di design/MOTION-TECH.md '## Hasil Fase 0'). `default="none"` membuat
 * transisi ini tidak ikut berjalan pada transisi lain (mis. morph elemen
 * bersama di masa depan) — hanya saat kontennya sendiri mount/unmount.
 *
 * Dipasang di `template.tsx` tiap route-group (di dalam layout, di luar shell,
 * dan di-remount tiap navigasi — semantik template Next) sehingga entrance
 * konten halaman berjalan per navigasi tanpa menyentuh shell.
 *
 * Kelas animasi `page-enter`/`page-exit` didefinisikan di globals.css
 * (`::view-transition-new(.page-enter)` = fade + rise 6px 210ms,
 * `::view-transition-old(.page-exit)` = fade 150ms) — nilai dari token §B1.
 *
 * FALLBACK (bila flag VT dicabut/digagalkan di kemudian hari): ganti isi
 * komponen ini menjadi `<div className="motion-page-enter">{children}</div>`
 * (CSS entrance .motion-page-enter sudah tersedia di globals.css) — jangan
 * pakai keduanya sekaligus (dobel animasi).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition default="none" enter="page-enter" exit="page-exit">
      {children}
    </ViewTransition>
  );
}
