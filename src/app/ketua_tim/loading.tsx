export default function Loading() {
  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center">
      <div className="relative w-12 h-12 flex items-center justify-center mb-6">
        {/* Elegant Glow Effect */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse" 
          style={{ backgroundColor: 'var(--primary, #0071E3)' }}
        />
        
        {/* Subtle Background Track */}
        <div 
          className="absolute inset-0 rounded-full border-[3px]"
          style={{ borderColor: 'var(--border, #e5e7eb)' }}
        />
        
        {/* Smooth Spinning Ring */}
        <div 
          className="absolute inset-0 rounded-full border-[3px] border-transparent animate-spin z-10"
          style={{ 
            borderTopColor: 'var(--primary, #0071E3)', 
            borderRightColor: 'var(--primary, #0071E3)' 
          }}
        />
        
        {/* Center Pulsing Dot */}
        <div 
          className="w-1.5 h-1.5 rounded-full animate-pulse z-20"
          style={{ backgroundColor: 'var(--primary, #0071E3)' }}
        />
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <p className="text-[14px] font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
          Memuat Data
        </p>
        <p className="text-[12px] font-medium animate-pulse" style={{ color: 'var(--text-tertiary)' }}>
          Menyiapkan informasi...
        </p>
      </div>
    </div>
  );
}
