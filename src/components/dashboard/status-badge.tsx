import React from 'react';
import type { UploadStatus } from '@/types/database';

export const STATUS_CONFIG = {
  submitted:         { label: 'Menunggu Review', cls: 'badge-submitted', dot: '#FF9500' },
  approved:          { label: 'Disetujui',        cls: 'badge-approved',  dot: '#34C759' },
  rejected:          { label: 'Ditolak',          cls: 'badge-rejected',  dot: '#FF3B30' },
  revision_required: { label: 'Perlu Revisi',     cls: 'badge-revision',  dot: '#FF9500' },
  draft:             { label: 'Draft',             cls: 'badge-draft',     dot: '#AEAEB2' },
} as const;

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
    ?? { label: status, cls: 'badge-draft', dot: '#AEAEB2' };
  
  return (
    <span className={`badge-pill ${cfg.cls}`} role="status" aria-label={`Status: ${cfg.label}`}>
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: cfg.dot }}
        aria-hidden="true"
      />
      {cfg.label}
    </span>
  );
}

export function StatusLabel({ status }: { status: UploadStatus | null }) {
  if (!status) {
    return (
      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
        Belum Lapor
      </span>
    );
  }
  
  const map: Record<UploadStatus, { label: string; bg: string; color: string }> = {
    draft:             { label: 'Draft',          bg: 'var(--bg-secondary)',    color: 'var(--text-secondary)' },
    submitted:         { label: 'Menunggu Review', bg: 'var(--primary-soft)',    color: 'var(--primary)' },
    approved:          { label: 'Disetujui',       bg: 'var(--success-soft)',    color: 'var(--success)' },
    rejected:          { label: 'Ditolak',         bg: 'var(--danger-soft)',     color: 'var(--danger)' },
    revision_required: { label: 'Perlu Revisi',    bg: 'var(--warning-soft)',    color: 'var(--warning)' },
  };
  
  const s = map[status] ?? { label: status, bg: 'var(--bg-secondary)', color: 'var(--text-secondary)' };
  return (
    <span
      className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}
      role="status"
      aria-label={`Status: ${s.label}`}
    >
      {s.label}
    </span>
  );
}
