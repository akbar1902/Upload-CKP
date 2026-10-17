'use client';

import React from 'react';

/**
 * Fallback terakhir bila ROOT LAYOUT sendiri gagal dirender.
 *
 * File ini menggantikan root layout, jadi CSS global (Tailwind) belum tentu
 * tersedia — seluruh gaya di sini memakai inline style agar tampilannya tetap
 * utuh dalam kondisi apa pun.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAFAF5',
          color: '#2B2A26',
          fontFamily: 'Poppins, ui-sans-serif, system-ui, sans-serif',
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: '100%',
            textAlign: 'center',
            background: '#EFEAE2',
            border: '1px solid rgba(169,146,118,0.33)',
            borderRadius: 24,
            padding: 32,
            boxShadow: '8px 8px 18px rgba(163,145,116,0.5), -8px -8px 18px rgba(255,255,255,0.95)',
          }}
        >
          <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 12 }}>⚠️</div>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Aplikasi Gagal Dimuat</h1>
          <p style={{ fontSize: 14, color: '#6E6759', margin: '0 0 20px', lineHeight: 1.6 }}>
            Terjadi kesalahan pada aplikasi. Silakan muat ulang halaman.
          </p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <button
            onClick={reset}
            style={{
              background: '#0F766E',
              color: '#fff',
              border: 'none',
              borderRadius: 980,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
