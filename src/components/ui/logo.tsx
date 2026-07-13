import React from 'react';
import { Shrikhand } from 'next/font/google';

const shrikhand = Shrikhand({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function Logo({ size = 40, className, ...props }: LogoProps) {
  return (
    <div 
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 120 120" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {/* Simple Modern Folder Shape */}
        <path 
          d="M10 40 
             C10 28, 18 20, 28 20 
             H45 
             C52 20, 56 22, 60 27 
             L65 33 
             C69 38, 73 40, 78 40 
             H92 
             C103 40, 110 48, 110 58 
             V92 
             C110 103, 103 110, 92 110 
             H28 
             C18 110, 10 103, 10 92 
             Z" 
          fill="var(--primary)" 
          className="drop-shadow-sm"
        />
        
        {/* CKP Text inside Folder */}
        <text
          x="60"
          y="88"
          textAnchor="middle"
          fill="white"
          className={shrikhand.className}
          fontSize="42"
          letterSpacing="1"
        >
          CKP
        </text>
      </svg>
    </div>
  );
}
