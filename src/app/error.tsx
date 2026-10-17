'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Error boundary tingkat akar (menangkap error pada children root layout).
 *
 * Sebelumnya aplikasi tidak punya error boundary sama sekali: bila render
 * server gagal, pengguna melihat layar putih tanpa penjelasan. Sekarang
 * muncul kartu yang ramah + tombol "Coba Lagi" (reset boundary) dan
 * "Muat Ulang Halaman".
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div
        className="w-full max-w-md rounded-3xl p-8 text-center"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
      >
        <div
          className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--danger-soft)' }}
        >
          <AlertTriangle className="h-7 w-7" style={{ color: 'var(--danger)' }} />
        </div>

        <h1 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Terjadi Kesalahan
        </h1>
        <p className="text-[14px] mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Halaman ini gagal dimuat. Coba lagi — bila masih gagal, muat ulang halaman.
        </p>

        {error?.message && (
          <details className="mb-6 text-left">
            <summary className="text-[13px] cursor-pointer" style={{ color: 'var(--text-tertiary)' }}>
              Detail teknis
            </summary>
            <pre
              className="mt-2 p-3 rounded-xl text-[12px] overflow-auto font-mono"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
            >
              {error.message}
              {error.digest ? `\n\ndigest: ${error.digest}` : ''}
            </pre>
          </details>
        )}

        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary text-[14px]">
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary text-[14px]"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    </div>
  );
}
