import React from 'react';
import { AlertTriangle, Archive, CheckCircle2, Clock, FileText, Sparkles, XCircle } from 'lucide-react';
import type { UploadStatus } from '@/types/database';

const STATUS_META = {
  submitted:         { label: 'Menunggu Review', cls: 'badge-submitted', Icon: Clock },
  scored:            { label: 'Sudah Dinilai',   cls: 'badge-scored',    Icon: Sparkles },
  approved:          { label: 'Disetujui',       cls: 'badge-approved',  Icon: CheckCircle2 },
  rejected:          { label: 'Ditolak',         cls: 'badge-rejected',  Icon: XCircle },
  revision_required: { label: 'Perlu Revisi',    cls: 'badge-revision',  Icon: AlertTriangle },
  draft:             { label: 'Draft',           cls: 'badge-draft',     Icon: FileText },
  superseded:        { label: 'Diganti (Arsip)', cls: 'badge-draft',     Icon: Archive },
};

// Backward-compat untuk modul yang butuh lookup label/kelas.
// Warna dot memakai token semantik agar sama dengan pill-nya di light & dark.
export const STATUS_CONFIG = {
  submitted:         { label: 'Menunggu Review', cls: 'badge-submitted', dot: 'var(--accent-strong)' },
  scored:            { label: 'Sudah Dinilai',   cls: 'badge-scored',    dot: 'var(--tertiary-text)' },
  approved:          { label: 'Disetujui',       cls: 'badge-approved',  dot: 'var(--success)' },
  rejected:          { label: 'Ditolak',         cls: 'badge-rejected',  dot: 'var(--danger)' },
  revision_required: { label: 'Perlu Revisi',    cls: 'badge-revision',  dot: 'var(--danger)' },
  draft:             { label: 'Draft',           cls: 'badge-draft',     dot: 'var(--text-tertiary)' },
  superseded:        { label: 'Diganti (Arsip)', cls: 'badge-draft',     dot: 'var(--text-tertiary)' },
} as const;

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as keyof typeof STATUS_META]
    ?? { label: status, cls: 'badge-draft', Icon: FileText };
  const { Icon } = meta;

  return (
    <span className={`badge-pill ${meta.cls}`} role="status" aria-label={`Status: ${meta.label}`}>
      <Icon size={12} strokeWidth={2.5} aria-hidden="true" />
      {meta.label}
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
    draft:             { label: 'Draft',          bg: 'var(--sand-subtle)',    color: 'var(--text-secondary)' },
    submitted:         { label: 'Menunggu Review', bg: 'var(--accent-soft)',    color: 'var(--accent-strong)' },
    scored:            { label: 'Sudah Dinilai',   bg: 'var(--sand-strong)', color: 'var(--tertiary-text)' },
    approved:          { label: 'Disetujui',       bg: 'var(--success-soft)',    color: 'var(--success-text)' },
    rejected:          { label: 'Ditolak',         bg: 'var(--danger-soft)',     color: 'var(--danger-text)' },
    revision_required: { label: 'Perlu Revisi',    bg: 'var(--danger-soft)',    color: 'var(--danger-text)' },
    superseded:        { label: 'Diganti (Arsip)', bg: 'var(--sand-subtle)',    color: 'var(--text-tertiary)' },
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
