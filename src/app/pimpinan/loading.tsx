import { Logo } from '@/components/ui/logo';

export default function Loading() {
  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center">
      <div className="relative mb-8">
        {/* Glow effect behind the logo */}
        <div 
          className="absolute inset-0 blur-xl opacity-30 animate-pulse rounded-full"
          style={{ backgroundColor: 'var(--primary, #0071E3)', transform: 'scale(1.2)' }}
        />
        
        {/* The pulsating logo */}
        <div className="animate-pulse drop-shadow-sm w-64 max-w-[80vw]">
          <img 
            src="/SIKAP-text-and-tagline.svg" 
            alt="Loading..." 
            className="w-full h-auto object-contain dark:brightness-0 dark:invert"
          />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1.5 mt-2">
        <p className="text-[15px] font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
          Memuat Data
        </p>
        <p className="text-[13px] font-medium animate-pulse" style={{ color: 'var(--text-tertiary)' }}>
          Menyiapkan informasi...
        </p>
      </div>
    </div>
  );
}
