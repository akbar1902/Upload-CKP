import React from 'react';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function Logo({ size = 40, className = '', ...props }: LogoProps) {
  // SVG original viewBox was 1000x800 which is 5:4 ratio.
  // The original Logo used size*2 width and size height (2:1).
  // I'll adjust the wrapper to maintain a sensible aspect ratio.
  const w = size * 1.5;
  const h = size * 1.2;

  return (
    <div 
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`} 
      style={{ width: w, height: h }}
      {...props}
    >
      <img 
        src="/logo-sikap.svg" 
        alt="SIKAP Logo"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}
