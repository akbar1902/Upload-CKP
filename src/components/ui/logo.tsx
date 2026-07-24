import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function Logo({ size = 40, className = '', ...props }: LogoProps) {
  // Logo SIKAP memanjang (wide), sehingga lebarnya kita set sekitar 2x tingginya
  const w = size * 2;
  const h = size;

  return (
    <div 
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`} 
      style={{ width: w, height: h }}
    >
      <svg 
        viewBox="0 0 400 200" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {/* Abstract background ripples (light green) */}
        <g fill="none" stroke="#D1E5DA" strokeLinecap="round">
           <path d="M 40 150 Q 200 220 360 130" strokeWidth="18" />
           <path d="M 20 130 Q 200 190 380 100" strokeWidth="10" />
           <path d="M 70 170 Q 200 230 330 150" strokeWidth="8" />
        </g>

        {/* Dark Green Folder Icon */}
        <path 
          d="M 90 50 
             H 150
             L 170 70
             H 310
             C 320 70, 330 80, 330 90
             V 150
             C 330 160, 320 170, 310 170
             H 90
             C 80 170, 70 160, 70 150
             V 70
             C 70 60, 80 50, 90 50
             Z" 
          fill="#1C5C4B" 
        />

        {/* Yellow Sparks Left */}
        <g stroke="#F9C23C" strokeWidth="6" strokeLinecap="round">
          <line x1="85" y1="75" x2="60" y2="50" />
          <line x1="105" y1="65" x2="95" y2="35" />
          <line x1="70" y1="95" x2="40" y2="85" />
        </g>

        {/* Yellow Sparks Right */}
        <g stroke="#F9C23C" strokeWidth="6" strokeLinecap="round">
          <line x1="315" y1="75" x2="340" y2="50" />
          <line x1="295" y1="65" x2="305" y2="35" />
          <line x1="330" y1="95" x2="360" y2="85" />
        </g>
        
        {/* Massive SIKAP Text with thick stroke overlapping everything */}
        <text 
          x="200" 
          y="145" 
          textAnchor="middle" 
          fontFamily="Arial Black, Impact, system-ui, sans-serif"
          fontWeight="900"
          fontSize="95"
          letterSpacing="-2"
          fill="#FFFFFF"
          stroke="#1C5C4B"
          strokeWidth="18"
          strokeLinejoin="round"
          paintOrder="stroke fill"
        >
          SIKAP
        </text>

        {/* Pill base for subtitle */}
        <rect 
          x="75" 
          y="160" 
          width="250" 
          height="28" 
          rx="14" 
          fill="#1C5C4B" 
        />
        
        {/* Text inside Pill */}
        <text 
          x="200" 
          y="179" 
          textAnchor="middle" 
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="14"
          letterSpacing="0.5"
          fill="#FFFFFF"
        >
          Sistem Informasi Rekap CKP
        </text>
      </svg>
    </div>
  );
}
