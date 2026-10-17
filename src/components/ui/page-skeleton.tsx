import React from 'react';

/**
 * Skeleton halaman generik — dipakai oleh `loading.tsx` per rute.
 *
 * Tujuannya: saat pindah halaman, kerangka layout + sidebar tetap terlihat
 * dan hanya area konten yang menampilkan shimmer, bukan layar kosong.
 * Memakai kelas `.skeleton` dari globals.css (shimmer, sadar tema gelap).
 */
export function PageSkeleton({
  variant = 'dashboard',
}: {
  variant?: 'dashboard' | 'table' | 'form';
}) {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6" aria-busy="true" aria-live="polite">
      {/* Judul + subjudul */}
      <div className="space-y-2">
        <div className="h-7 w-56 skeleton rounded-lg" />
        <div className="h-4 w-80 skeleton rounded-md" />
      </div>

      {variant === 'dashboard' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 skeleton rounded-2xl" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 skeleton rounded-2xl" />
            ))}
          </div>
        </>
      )}

      {variant === 'table' && (
        <>
          <div className="h-11 skeleton rounded-full" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-xl" />
            ))}
          </div>
        </>
      )}

      {variant === 'form' && (
        <>
          <div className="h-40 skeleton rounded-2xl" />
          <div className="h-56 skeleton rounded-2xl" />
          <div className="h-11 w-48 skeleton rounded-full" />
        </>
      )}

      <span className="sr-only">Memuat halaman…</span>
    </div>
  );
}
