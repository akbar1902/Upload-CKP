import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ArrowRight, FileCheck, FileText } from 'lucide-react';
import { getBulanName, formatDateTime } from '@/lib/utils';
import type { CKPUpload } from '@/types/database';
import { StatusBadge } from './status-badge';

const MONTH_ABBR = ['', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
const MONTH_FULL = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function getProgressClass(pct: number): string {
  if (pct >= 100) return 'progress-green';
  if (pct >= 71)  return 'progress-orange';
  if (pct >= 31)  return 'progress-blue';
  return 'progress-gray';
}

export interface ActivityCardProps {
  upload: CKPUpload;
}

export function ActivityCard({ upload }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Date from uploaded_at
  const dt = new Date(upload.uploaded_at);
  const day = dt.getDate();
  const monthAbbr = MONTH_ABBR[upload.bulan] ?? '---';
  const weekday = WEEKDAYS[dt.getDay()];

  const pct = Math.min(upload.avg_progres || 0, 100);
  const progressClass = getProgressClass(pct);

  return (
    <div className="activity-card" aria-expanded={expanded}>
      {/* ── Main card row ──────────────────────────── */}
      <div className="flex items-center gap-4 p-5">

        {/* Date block */}
        <div className="date-block hidden sm:flex">
          <span className="day">{day}</span>
          <span className="month">{monthAbbr}</span>
          <span className="weekday">{weekday}</span>
        </div>

        {/* Period icon + info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Colored status icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--primary-soft)', border: '1px solid rgba(37,99,235,0.15)' }}
            aria-hidden="true"
          >
            <FileCheck size={18} style={{ color: 'var(--primary)' }} />
          </div>

          <div className="min-w-0 flex-1">
            {/* Period title */}
            <p className="text-[15px] font-bold leading-snug truncate" style={{ color: 'var(--text-primary)' }}>
              CKP {MONTH_FULL[upload.bulan]} {upload.tahun}
              {upload.version > 1 && (
                <span className="ml-2 text-[11px] font-normal px-1.5 py-0.5 rounded-md"
                      style={{ background: '#F1F5F9', color: 'var(--text-secondary)' }}>
                  v{upload.version}
                </span>
              )}
            </p>
            {/* File name */}
            <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
              📄 {upload.file_name || 'Tidak ada nama file'}
            </p>
            {/* Mobile date */}
            <p className="text-[11px] mt-0.5 sm:hidden" style={{ color: 'var(--text-secondary)' }}>
              Upload: {formatDateTime(upload.uploaded_at)}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 min-w-[100px] hidden md:flex">
          <div className="flex items-center gap-2 w-full justify-end">
            <span className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {pct.toFixed(0)}%
            </span>
          </div>
          <div className="w-24 h-2.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
            <div
              className={`h-full rounded-full progress-bar ${progressClass}`}
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            {upload.total_entries} kegiatan
          </span>
        </div>

        {/* Status + expand */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusBadge status={upload.status} />
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-[12px] font-medium transition-colors px-2 py-1 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            aria-label={expanded ? 'Tutup detail' : 'Lihat detail'}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span className="hidden sm:inline">{expanded ? 'Tutup' : 'Detail'}</span>
          </button>
        </div>
      </div>

      {/* ── Expanded detail panel ───────────────────── */}
      {expanded && (
        <div
          className="card-expanded-content border-t px-5 py-4"
          style={{ borderColor: 'var(--border)', background: '#FAFBFC' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                 style={{ color: 'var(--text-secondary)' }}>Periode</p>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {MONTH_FULL[upload.bulan]} {upload.tahun}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                 style={{ color: 'var(--text-secondary)' }}>Total Kegiatan</p>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {upload.total_entries} kegiatan
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                 style={{ color: 'var(--text-secondary)' }}>Rata-rata Progres</p>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {pct.toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                 style={{ color: 'var(--text-secondary)' }}>Diupload</p>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {formatDateTime(upload.uploaded_at)}
              </p>
            </div>
          </div>

          {/* File attachment */}
          {upload.file_name && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl"
                 style={{ background: 'var(--primary-soft)', border: '1px solid rgba(37,99,235,0.12)' }}>
              <FileText size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span className="text-[12px] font-medium truncate" style={{ color: 'var(--primary)' }}>
                {upload.file_name}
              </span>
            </div>
          )}

          {/* Notes from pimpinan */}
          {upload.catatan_pimpinan && (
            <div className="mb-4 p-3 rounded-xl"
                 style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                 style={{ color: '#92400E' }}>Catatan Pimpinan</p>
              <p className="text-[13px]" style={{ color: '#78350F' }}>
                {upload.catatan_pimpinan}
              </p>
            </div>
          )}

          {/* CTA */}
          <Link
            href={`/pegawai/ckp/${upload.id}`}
            className="inline-flex items-center gap-2 text-[13px] font-semibold transition-colors"
            style={{ color: 'var(--primary)' }}
          >
            Lihat Detail Lengkap <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}

export function ActivityCardSkeleton() {
  return (
    <div className="activity-card p-5">
      <div className="flex items-center gap-4">
        <div className="skeleton w-16 h-20 rounded-xl hidden sm:block" />
        <div className="flex items-center gap-3 flex-1">
          <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-48 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 hidden md:flex">
          <div className="skeleton h-4 w-8 rounded" />
          <div className="skeleton h-2 w-24 rounded-full" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-4 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}
