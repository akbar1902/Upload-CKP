import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <div 
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`} 
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-sikap.png"
        alt="Logo SIKAP"
        fill
        className="object-contain drop-shadow-sm"
        sizes={`${size}px`}
        priority
      />
    </div>
  );
}
