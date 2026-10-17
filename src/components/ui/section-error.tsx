'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Kartu error untuk dipakai oleh `error.tsx` tingkat bagian (segment).
 *
 * Berbeda dari error boundary akar, boundary di tingkat bagian dirender
 * DI DALAM layout bagian tersebut — sehingga sidebar & header tetap terlihat
 * dan pengguna tidak kehilangan konteks navigasi saat satu halaman gagal.
 */
export function SectionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('[Section Error]', error);
  }, [error]);

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <div
        className="rounded-3xl p-8 text-center"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--danger-soft)' }}
        >
          <AlertTriangle className="h-7 w-7" style={{ color: 'var(--danger)' }} />
        </div>

        <h1 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Halaman Gagal Dimuat
        </h1>
        <p className="text-[14px] mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Data halaman ini gagal diambil. Coba lagi, atau pindah ke menu lain — bagian aplikasi
          yang lain tetap bisa dipakai.
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

        <button onClick={reset} className="btn-primary text-[14px]">
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
