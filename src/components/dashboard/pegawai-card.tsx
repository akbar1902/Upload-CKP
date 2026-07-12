import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CKPUpload, User } from '@/types/database';
import { StatusLabel } from './status-badge';
import { Skeleton } from '@/components/ui/skeleton';

export interface PegawaiRow {
  user: User;
  upload: (CKPUpload & { user?: User }) | null;
}

export function PegawaiCard({ row }: { row: PegawaiRow }) {
  const { user, upload } = row;
  const initials = user.full_name
    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const avgProgres = upload?.avg_progres ?? 0;
  const totalEntries = upload?.total_entries ?? 0;
  const hasUpload = upload !== null;

  const barColor = avgProgres >= 80 ? 'var(--success)'
    : avgProgres >= 50 ? 'var(--warning)'
    : 'var(--text-tertiary)';

  const progressLabel = avgProgres >= 80 ? 'Sangat Baik'
    : avgProgres >= 60 ? 'Baik'
    : avgProgres >= 40 ? 'Cukup'
    : null;

  return (
    <div className="kpi-card p-3 sm:p-5 flex flex-col gap-3 sm:gap-4">
      {/* Header kartu */}
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0"
          style={{ background: 'var(--primary)' }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-[13px] sm:text-[14px] leading-snug truncate"
                 style={{ color: 'var(--text-primary)' }}
                 title={user.full_name}>{user.full_name}</p>
              <p className="text-[11px] sm:text-[12px] mt-0.5 truncate"
                 style={{ color: 'var(--text-tertiary)' }}>{user.nip || '—'}</p>
            </div>
            <div className="flex-shrink-0">
              <StatusLabel status={upload?.status ?? null} />
            </div>
          </div>
        </div>
      </div>

      {/* Statistik in a unified block */}
      <div className="rounded-xl sm:rounded-2xl p-2 sm:p-3.5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
          <div>
            <p className="text-[9px] sm:text-[11px] font-medium mb-0.5 sm:mb-1 truncate" style={{ color: 'var(--text-tertiary)' }}>Kegiatan</p>
            <p className="text-[12px] sm:text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>{totalEntries}</p>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
            <p className="text-[9px] sm:text-[11px] font-medium mb-0.5 sm:mb-1 truncate" style={{ color: 'var(--text-tertiary)' }}>Capaian</p>
            <p className="text-[12px] sm:text-[16px] font-bold" style={{ color: hasUpload ? (avgProgres >= 80 ? 'var(--success)' : avgProgres >= 50 ? 'var(--warning)' : 'var(--text-primary)') : 'var(--text-tertiary)' }}>
              {hasUpload ? `${avgProgres.toFixed(0)}%` : '0%'}
            </p>
          </div>
          <div>
            <p className="text-[9px] sm:text-[11px] font-medium mb-0.5 sm:mb-1 truncate" style={{ color: 'var(--text-tertiary)' }}>Skor</p>
            <p className="text-[12px] sm:text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
              {hasUpload && upload.rata_rata_nilai != null ? upload.rata_rata_nilai.toFixed(1) : '—'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {hasUpload && (
          <div className="mt-3.5 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(avgProgres, 100)}%`, backgroundColor: barColor }}
              />
            </div>
            {progressLabel && (
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{progressLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Tombol detail */}
      <div className="mt-auto pt-1">
        {hasUpload ? (
          <Link
            href={`/penilaian/${upload!.id}`}
            className="flex items-center justify-center gap-1.5 text-[12px] sm:text-[13px] font-semibold rounded-full py-2 sm:py-2.5 transition-all duration-200 w-full"
            style={{
              color: 'var(--text-secondary)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--primary-soft)';
              (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,113,227,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            }}
          >
            Lihat Detail Log <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center justify-center gap-1.5 text-[12px] sm:text-[13px] font-semibold rounded-full py-2 sm:py-2.5 cursor-not-allowed w-full"
            style={{
              color: 'var(--text-tertiary)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
            aria-disabled="true"
          >
            Belum ada data
          </button>
        )}
      </div>
    </div>
  );
}

export function PegawaiCardSkeleton() {
  return (
    <div className="kpi-card p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-2.5 w-20 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
      </div>
      <Skeleton className="h-1 rounded-full" />
      <Skeleton className="h-10 rounded-full" />
    </div>
  );
}
