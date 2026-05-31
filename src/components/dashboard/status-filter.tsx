"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { UploadStatus } from '@/types/database';
import { getStatusLabel } from '@/lib/utils';

interface StatusFilterProps {
  selected: UploadStatus | 'all';
  onChange: (status: UploadStatus | 'all') => void;
  counts?: Record<string, number>;
}

const statuses: { value: UploadStatus | 'all'; color: string }[] = [
  { value: 'all', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { value: 'submitted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'rejected', color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'revision_required', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'draft', color: 'bg-slate-50 text-slate-600 border-slate-200' },
];

export function StatusFilter({ selected, onChange, counts }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {statuses.map(({ value, color }) => {
        const isActive = selected === value;
        const count = value === 'all' ? undefined : counts?.[value];

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
              isActive
                ? cn(color, "ring-2 ring-offset-1 ring-blue-500/30 shadow-sm")
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            )}
          >
            {value === 'all' ? 'Semua' : getStatusLabel(value)}
            {count !== undefined && (
              <span className={cn(
                "inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full text-[10px] font-bold",
                isActive ? "bg-white/50" : "bg-slate-100"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
