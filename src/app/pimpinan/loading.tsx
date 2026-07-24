import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
      <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: 'var(--primary, #0071E3)' }} />
      <p className="text-[14px] font-medium animate-pulse" style={{ color: 'var(--text-secondary, #6b7280)' }}>Memuat data...</p>
    </div>
  );
}
