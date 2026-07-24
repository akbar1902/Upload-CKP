import React from 'react';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function Logo({ size = 40, className = '', ...props }: LogoProps) {
  // SVG new viewBox is 1000x440 which is roughly 2.27:1 ratio.
  const w = size * 2.25;
  const h = size;

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
