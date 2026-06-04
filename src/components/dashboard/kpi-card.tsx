import React from 'react';

export interface KPICardProps {
  icon: React.ReactNode;
  value: string | number | React.ReactNode;
  label: string;
  sub?: string | React.ReactNode;
  iconBg: string;
  loading?: boolean;
}

export function KPICard({ icon, value, label, sub, iconBg, loading }: KPICardProps) {
  return (
    <div className="kpi-card p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </p>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
      </div>
      {loading
        ? <div className="skeleton h-9 w-20 rounded-xl" />
        : <p className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
      }
      {sub && <div className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{sub}</div>}
    </div>
  );
}
