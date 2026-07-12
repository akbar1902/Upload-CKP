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
    <div className="kpi-card p-7 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em]"
           style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </p>
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: unifiedIconBg }}
        >
          {unifiedIcon}
        </div>
      </div>
      {loading
        ? <div className="skeleton h-10 w-20 rounded-xl" />
        : <div className="text-[36px] font-bold tracking-tight leading-none"
             style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {value}
          </div>
      }
      {sub && (
        <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>
      )}
    </div>
  );
}
