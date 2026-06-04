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

function getAvatarGradient(name: string): string {
  return 'linear-gradient(135deg, #475569 0%, #1e293b 100%)';
}

export function PegawaiCard({ row }: { row: PegawaiRow }) {
  const { user, upload } = row;
  const initials = user.full_name
    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const avgProgres = upload?.avg_progres ?? 0;
  const totalEntries = upload?.total_entries ?? 0;
  const hasUpload = upload !== null;

  const barColor = avgProgres >= 80 ? '#22c55e'
    : avgProgres >= 50 ? '#f59e0b'
    : '#94a3b8';

  const progressLabel = avgProgres >= 80 ? 'Sangat Baik'
    : avgProgres >= 60 ? 'Baik'
    : avgProgres >= 40 ? 'Cukup'
    : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
      {/* Header kartu */}
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
          style={{ background: getAvatarGradient(user.full_name) }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-[14px] leading-snug truncate" title={user.full_name}>{user.full_name}</p>
              <p className="text-[12px] text-slate-500 mt-0.5 truncate">{user.nip || '—'}</p>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <StatusLabel status={upload?.status ?? null} />
            </div>
          </div>
        </div>
      </div>

      {/* Statistik in a unified block */}
      <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-200">
          <div>
            <p className="text-[11px] text-slate-500 font-medium mb-1">Kegiatan</p>
            <p className="text-[15px] font-bold text-slate-800">{totalEntries}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium mb-1">Capaian</p>
            <p className={`text-[15px] font-bold ${hasUpload ? (avgProgres >= 80 ? 'text-emerald-600' : avgProgres >= 50 ? 'text-amber-600' : 'text-slate-800') : 'text-slate-400'}`}>
              {hasUpload ? `${avgProgres.toFixed(0)}%` : '0%'}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium mb-1">Skor</p>
            <p className="text-[15px] font-bold text-slate-800">
              {hasUpload ? avgProgres.toFixed(0) : '—'}
            </p>
          </div>
        </div>

        {/* Progress bar placed closely with stats */}
        {hasUpload && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.min(avgProgres, 100)}%`, backgroundColor: barColor }}
              />
            </div>
            {progressLabel && (
              <span className="text-[10px] font-semibold text-slate-500">{progressLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Tombol detail */}
      <div className="mt-auto pt-1">
        {hasUpload ? (
          <Link
            href={`/pimpinan/ckp/${upload!.id}`}
            className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-lg py-2 transition-colors w-full"
          >
            Lihat Detail Log <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-slate-400 bg-slate-50 border border-slate-100 rounded-lg py-2 cursor-not-allowed w-full"
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
    <div className="pegawai-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-2.5 w-20 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
      </div>
      <Skeleton className="h-1.5 rounded-full" />
      <Skeleton className="h-9 rounded-lg" />
    </div>
  );
}
