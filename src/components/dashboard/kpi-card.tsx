import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/components/ui/animated-number';

export interface KPICardProps {
  icon: React.ReactNode;
  value: string | number | React.ReactNode;
  label: string;
  sub?: string | React.ReactNode;
  /**
   * @deprecated Tidak dipakai lagi — warna ikon ditentukan oleh `tone`
   * (default = teal, attention = terracotta). Dipertahankan supaya
   * pemanggil lama tidak error.
   */
  iconBg?: string;
  loading?: boolean;
  /** 'attention' → ikon terracotta tint (butuh perhatian, mis. Menunggu Review) */
  tone?: 'default' | 'attention';
  className?: string;
}

export function KPICard({
  icon,
  value,
  label,
  sub,
  loading,
  tone = 'default',
  className,
}: KPICardProps) {
  const unifiedIconBg = tone === 'attention' ? 'var(--accent-soft)' : 'var(--primary-soft)';
  const unifiedIconColor = tone === 'attention' ? 'var(--accent-strong)' : 'var(--primary)';
  const unifiedIcon = React.isValidElement(icon)
    ? React.cloneElement(
        icon as React.ReactElement<{ style?: React.CSSProperties; className?: string }>,
        { style: { color: unifiedIconColor }, className: '' }
      )
    : icon;

  // Angka bulat → hitung naik. Angka non-bulat (mis. "95,5%") tetap statis.
  const isNumeric = typeof value === 'number';
  const numericValue = typeof value === 'number' ? value : Number.NaN;

  return (
    <div className={cn('kpi-card p-6 sm:p-7 flex flex-col gap-4 min-w-0 overflow-hidden', className)}>
      <div className="flex items-start justify-between gap-2.5">
        <p
          className="flex-1 min-w-0 text-[11px] font-semibold uppercase leading-snug"
          style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em', textWrap: 'balance' }}
        >
          {label}
        </p>
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-110"
          style={{ background: unifiedIconBg }}
        >
          {unifiedIcon}
        </div>
      </div>
      {loading ? (
        <div className="skeleton h-10 w-20 rounded-xl" />
      ) : (
        <div
          className="font-bold tracking-[-0.03em] leading-none tabular-nums break-words"
          style={{ color: 'var(--text-primary)', fontSize: 'clamp(30px, 4.4vw, 44px)' }}
        >
          {isNumeric && Number.isFinite(numericValue) ? (
            <AnimatedNumber value={numericValue} />
          ) : (
            value
          )}
        </div>
      )}
      {sub && (
        <p className="text-[14px] leading-snug" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>
      )}
    </div>
  );
}
