import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function Logo({ size = 40, className = '', ...props }: LogoProps) {
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
        <defs>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap');
              .logo-text { font-family: 'Fredoka', sans-serif; font-weight: 700; }
              .logo-sub { font-family: 'Fredoka', sans-serif; font-weight: 600; }
            `}
          </style>
          
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Abstract background ripples (light green) */}
        <g fill="none" stroke="#CDE1D4" strokeLinecap="round">
           <path d="M 30 140 Q 200 210 370 120" strokeWidth="18" />
           <path d="M 10 110 Q 200 180 390 80" strokeWidth="6" />
        </g>

        {/* Dark Green Folder Icon */}
        <path 
          d="M 80 60 
             Q 80 40, 100 40
             H 140
             C 170 40, 170 65, 190 65
             H 290
             Q 310 65, 310 85
             V 145
             Q 310 165, 290 165
             H 100
             Q 80 165, 80 145
             Z" 
          fill="#1C5C4B" 
        />

        {/* Yellow Sparks Left */}
        <g stroke="#F5B041" strokeWidth="6" strokeLinecap="round">
          <line x1="85" y1="35" x2="75" y2="15" />
          <line x1="60" y1="45" x2="40" y2="30" />
          <line x1="50" y1="70" x2="25" y2="65" />
        </g>

        {/* Yellow Sparks Right */}
        <g stroke="#F5B041" strokeWidth="6" strokeLinecap="round">
          <line x1="305" y1="50" x2="320" y2="30" />
          <line x1="325" y1="75" x2="350" y2="65" />
          <line x1="315" y1="95" x2="340" y2="110" />
        </g>
        
        {/* Massive SIKAP Text with thick stroke overlapping everything */}
        <text 
          x="200" 
          y="135" 
          textAnchor="middle" 
          className="logo-text"
          fontSize="110"
          letterSpacing="-1"
          fill="#FFFFFF"
          stroke="#1C5C4B"
          strokeWidth="22"
          strokeLinejoin="round"
          paintOrder="stroke fill"
          filter="url(#shadow)"
        >
          SIKAP
        </text>

        {/* Pill base for subtitle */}
        <rect 
          x="65" 
          y="152" 
          width="270" 
          height="28" 
          rx="14" 
          fill="#1C5C4B" 
        />
        
        {/* Text inside Pill */}
        <text 
          x="200" 
          y="171" 
          textAnchor="middle" 
          className="logo-sub"
          fontSize="13"
          letterSpacing="0.3"
          fill="#FFFFFF"
        >
          Sistem Informasi Rekap CKP
        </text>
      </svg>
    </div>
  );
}
