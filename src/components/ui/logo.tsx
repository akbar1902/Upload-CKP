import React from 'react';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tinggi logo (px). Lebar mengikuti rasio lockup ikon + caption. */
  size?: number;
  /** Sumber logo untuk latar terang (ikon hijau). */
  src?: string;
  /** Sumber logo untuk latar gelap (ikon krem). Diganti otomatis saat tema gelap. */
  darkSrc?: string;
}

/** Rasio lockup /sikap-logo.svg (ikon + caption): 1264 × 313. */
const RATIO = 1264 / 313;

export function Logo({
  size = 40,
  className = '',
  src = '/sikap-logo.svg',
  darkSrc = '/sikap-logo-dark.svg',
  ...props
}: LogoProps) {
  const w = size * RATIO;
  const h = size;

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: w, height: h }}
      {...props}
    >
      <img
        src={src}
        alt="SIKAP — Sistem Informasi Rekap CKP"
        className={darkSrc ? 'dark:hidden' : ''}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      {darkSrc && (
        <img
          src={darkSrc}
          alt="SIKAP — Sistem Informasi Rekap CKP"
          className="hidden dark:block"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      )}
    </div>
  );
}
