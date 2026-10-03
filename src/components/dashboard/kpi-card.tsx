import React from 'react';

export interface KPICardProps {
  icon: React.ReactNode;
  value: string | number | React.ReactNode;
  label: string;
  sub?: string | React.ReactNode;
  iconBg?: string;
  loading?: boolean;
}

export function KPICard({ icon, value, label, sub, iconBg, loading }: KPICardProps) {
  const unifiedIconBg = 'var(--primary-soft)';
  const unifiedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        style: { color: 'var(--primary)' },
        className: ''
      })
    : icon;

  return (
    <div className="kpi-card p-6 sm:p-7 flex flex-col gap-4 min-w-0 overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <p
          className="flex-1 min-w-0 text-[13px] font-semibold uppercase leading-snug"
          style={{ color: 'var(--text-tertiary)', letterSpacing: '0.04em', textWrap: 'balance' }}
        >
          {label}
        </p>
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: unifiedIconBg }}
        >
          {unifiedIcon}
        </div>
      </div>
      {loading
        ? <div className="skeleton h-10 w-20 rounded-xl" />
        : <div
            className="font-bold tracking-tight leading-none tabular-nums break-words"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', fontSize: 'clamp(28px, 4vw, 38px)' }}
          >
            {value}
          </div>
      }
      {sub && (
        <p className="text-[14px] leading-snug" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>
      )}
    </div>
  );
}
