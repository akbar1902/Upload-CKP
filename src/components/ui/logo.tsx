import React from 'react';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  /** Sumber logo untuk mode terang */
  src?: string;
  /** Sumber logo untuk mode gelap. Jika diisi, logo diganti otomatis saat tema gelap. */
  darkSrc?: string;
}

export function Logo({
  size = 40,
  className = '',
  src = '/logo-sikap.svg?v=2',
  darkSrc,
  ...props
}: LogoProps) {
  // SVG new viewBox is exactly 2.5:1 ratio.
  const w = size * 2.5;
  const h = size;

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: w, height: h }}
      {...props}
    >
      <img
        src={src}
        alt="SIKAP Logo"
        className={darkSrc ? 'dark:hidden' : ''}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      {darkSrc && (
        <img
          src={darkSrc}
          alt="SIKAP Logo"
          className="hidden dark:block"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      )}
    </div>
  );
}
