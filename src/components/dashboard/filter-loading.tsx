"use client";

import { Loader2 } from 'lucide-react';
import { useDelayedUnmount } from '@/hooks/use-delayed-unmount';

/**
 * Indeterminate progress bar yang muncul saat filter periode / refetch
 * sedang berjalan. Dipakai di atas konten dashboard.
 *
 * Kenapa perlu: perubahan filter kini hanya mengubah query key React Query
 * (tanpa navigasi server), sehingga TopLoader bawaan tidak ikut berjalan.
 * Bar ini memberi umpan balik visual yang jelas.
 *
 * Catatan performa: animasi memakai CSS (kelas `sikap-*`), bukan
 * framer-motion — supaya library animasi tidak ikut terunduh.
 */
export function FetchingBar({ show }: { show: boolean }) {
  const { mounted, leaving } = useDelayedUnmount(show, 200);

  if (!mounted) return null;

  return (
    <div
      className={`absolute top-0 left-0 right-0 z-30 h-[3px] overflow-hidden rounded-full ${leaving ? 'sikap-fade-out' : 'sikap-fade-in'}`}
      style={{ background: 'var(--primary-soft)' }}
      aria-hidden="true"
    >
      <div
        className="sikap-bar-inner absolute inset-y-0 left-0 w-1/3 rounded-full"
        style={{ background: 'var(--primary)' }}
      />
    </div>
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
  const { mounted, leaving } = useDelayedUnmount(show, 180);

  if (!mounted) return null;

  return (
    <div
      className={`absolute inset-0 z-20 flex items-start justify-center rounded-3xl pointer-events-none ${leaving ? 'sikap-fade-out' : 'sikap-fade-in'}`}
      style={{
        background: 'var(--overlay-scrim)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={`mt-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 ${leaving ? 'sikap-pop-out' : 'sikap-pop-in'}`}
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
      </div>
    </div>
  );
}
