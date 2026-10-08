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

const statuses: { value: UploadStatus | 'all' }[] = [
  { value: 'all' },
  { value: 'submitted' },
  { value: 'scored' },
  { value: 'approved' },
  { value: 'rejected' },
  { value: 'revision_required' },
  { value: 'draft' },
];

export function StatusFilter({ selected, onChange, counts }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {statuses.map(({ value }) => {
        const isActive = selected === value;
        const count = value === 'all' ? undefined : counts?.[value];

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200",
              !isActive && "hover:bg-[var(--sand-subtle)]"
            )}
            style={isActive
              ? { background: 'var(--primary-soft)', color: 'var(--primary-bright)', border: '1px solid var(--primary-ring)' }
              : { background: 'var(--card-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
            }
          >
            {value === 'all' ? 'Semua' : getStatusLabel(value)}
            {count !== undefined && (
              <span
                className="inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full text-[10px] font-bold"
                style={{
                  background: 'var(--card-bg)',
                  border: isActive ? '1px solid var(--primary-ring)' : '1px solid var(--sand-border)',
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
