"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'slate';
  trend?: {
    value: number;
    label: string;
  };
  loading?: boolean;
}

const colorMap = {
  blue:    { bg: 'var(--primary-soft)',  text: 'var(--primary)' },
  emerald: { bg: 'var(--success-soft)',  text: 'var(--success)' },
  amber:   { bg: 'var(--warning-soft)',  text: 'var(--warning)' },
  red:     { bg: 'var(--danger-soft)',   text: 'var(--danger)' },
  purple:  { bg: 'rgba(175,82,222,0.08)', text: '#AF52DE' },
  slate:   { bg: 'var(--bg-secondary)',  text: 'var(--text-secondary)' },
};

export function StatCard({ title, value, subtitle, icon: Icon, color, trend, loading }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className="kpi-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em]"
             style={{ color: 'var(--text-tertiary)' }}>{title}</p>
          {loading ? (
            <div className="skeleton h-8 w-20 rounded-xl" />
          ) : (
            <p className="text-2xl font-bold tabular-nums tracking-tight"
               style={{ color: 'var(--text-primary)' }}>{value}</p>
          )}
          {subtitle && (
            <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{subtitle}</p>
          )}
          {trend && !loading && (
            <div className="flex items-center gap-1.5">
              {trend.value >= 0
                ? <TrendingUp className="h-3 w-3" style={{ color: 'var(--success)' }} />
                : <TrendingDown className="h-3 w-3" style={{ color: 'var(--danger)' }} />
              }
              <span className="text-[12px] font-medium"
                    style={{ color: trend.value >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{trend.label}</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 p-2.5 rounded-2xl"
             style={{ background: colors.bg }}>
          <Icon className="h-5 w-5" style={{ color: colors.text }} />
        </div>
      </div>
    </div>
  );
}
