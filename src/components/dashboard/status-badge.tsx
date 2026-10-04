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
export const STATUS_CONFIG = {
  submitted:         { label: 'Menunggu Review', cls: 'badge-submitted', dot: '#0F766E' },
  scored:            { label: 'Sudah Dinilai',   cls: 'badge-scored',    dot: '#6B5A44' },
  approved:          { label: 'Disetujui',       cls: 'badge-approved',  dot: '#46583E' },
  rejected:          { label: 'Ditolak',         cls: 'badge-rejected',  dot: '#A8442F' },
  revision_required: { label: 'Perlu Revisi',    cls: 'badge-revision',  dot: '#B97A1A' },
  draft:             { label: 'Draft',           cls: 'badge-draft',     dot: '#A89C86' },
  superseded:        { label: 'Diganti (Arsip)', cls: 'badge-draft',     dot: '#A89C86' },
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
    draft:             { label: 'Draft',          bg: 'var(--bg-secondary)',    color: 'var(--text-secondary)' },
    submitted:         { label: 'Menunggu Review', bg: 'var(--primary-soft)',    color: 'var(--primary)' },
    scored:            { label: 'Sudah Dinilai',   bg: '#EFE7DD', color: '#6B5A44' },
    approved:          { label: 'Disetujui',       bg: 'var(--success-soft)',    color: 'var(--success-text)' },
    rejected:          { label: 'Ditolak',         bg: 'var(--danger-soft)',     color: 'var(--danger-text)' },
    revision_required: { label: 'Perlu Revisi',    bg: 'var(--warning-soft)',    color: 'var(--warning-text)' },
    superseded:        { label: 'Diganti (Arsip)', bg: 'var(--bg-secondary)',    color: 'var(--text-tertiary)' },
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
