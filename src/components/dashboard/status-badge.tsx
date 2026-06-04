import React from 'react';
import type { UploadStatus } from '@/types/database';

export const STATUS_CONFIG = {
  submitted:         { label: 'Menunggu Review', cls: 'badge-submitted', dot: '🟡' },
  approved:          { label: 'Disetujui',        cls: 'badge-approved',  dot: '🟢' },
  rejected:          { label: 'Ditolak',          cls: 'badge-rejected',  dot: '🔴' },
  revision_required: { label: 'Perlu Revisi',     cls: 'badge-revision',  dot: '🟠' },
  draft:             { label: 'Draft',             cls: 'badge-draft',     dot: '⚪' },
} as const;

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
    ?? { label: status, cls: 'badge-draft', dot: '⚪' };
  
  return (
    <span className={`badge-pill ${cfg.cls}`} role="status" aria-label={`Status: ${cfg.label}`}>
      <span aria-hidden="true">{cfg.dot}</span>
      {cfg.label}
    </span>
  );
}

export function StatusLabel({ status }: { status: UploadStatus | null }) {
  if (!status) {
    return (
      <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
        Belum Lapor
      </span>
    );
  }
  
  const map: Record<UploadStatus, { label: string; cls: string }> = {
    draft:             { label: 'Draft',          cls: 'text-slate-500 bg-slate-100' },
    submitted:         { label: 'Menunggu Review', cls: 'text-amber-700 bg-amber-50' },
    approved:          { label: 'Disetujui',       cls: 'text-emerald-700 bg-emerald-50' },
    rejected:          { label: 'Ditolak',         cls: 'text-red-600 bg-red-50' },
    revision_required: { label: 'Perlu Revisi',    cls: 'text-orange-700 bg-orange-50' },
  };
  
  const s = map[status] ?? { label: status, cls: 'text-slate-500 bg-slate-100' };
  return (
    <span
      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${s.cls}`}
      role="status"
      aria-label={`Status: ${s.label}`}
    >
      {s.label}
    </span>
  );
}
