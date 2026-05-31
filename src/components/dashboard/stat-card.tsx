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
  blue:    { icon: 'bg-blue-50 text-blue-600' },
  emerald: { icon: 'bg-emerald-50 text-emerald-600' },
  amber:   { icon: 'bg-amber-50 text-amber-600' },
  red:     { icon: 'bg-red-50 text-red-600' },
  purple:  { icon: 'bg-purple-50 text-purple-600' },
  slate:   { icon: 'bg-slate-100 text-slate-600' },
};

export function StatCard({ title, value, subtitle, icon: Icon, color, trend, loading }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{title}</p>
          {loading ? (
            <div className="h-8 w-20 bg-slate-100 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-semibold text-slate-800 tabular-nums">{value}</p>
          )}
          {subtitle && (
            <p className="text-xs text-slate-400">{subtitle}</p>
          )}
          {trend && !loading && (
            <div className="flex items-center gap-1">
              {trend.value >= 0
                ? <TrendingUp className="h-3 w-3 text-emerald-500" />
                : <TrendingDown className="h-3 w-3 text-red-400" />
              }
              <span className={cn(
                "text-xs font-medium",
                trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'
              )}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-slate-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn("flex-shrink-0 p-2.5 rounded-lg", colors.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
