import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ArrowRight, FileCheck, FileText, Trash2 } from 'lucide-react';
import { getBulanName, formatDateTime } from '@/lib/utils';
import type { CKPUpload } from '@/types/database';
import { StatusBadge } from './status-badge';
import { deleteCkpUploadAction } from '@/app/actions/ckp';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
  onDeleteSuccess?: () => void;
}

export function ActivityCard({ upload, onDeleteSuccess }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data CKP ini? Semua entri kegiatan di dalamnya akan ikut terhapus permanen.')) {
      return;
    }
    
    setIsDeleting(true);
    const toastId = toast.loading('Menghapus CKP...');
    try {
      const res = await deleteCkpUploadAction(upload.id);
      if (res.success) {
        toast.success('CKP berhasil dihapus', { id: toastId });
        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          queryClient.invalidateQueries({ queryKey: ['pegawai-uploads'] });
        }
      } else {
        toast.error(res.error || 'Gagal menghapus CKP', { id: toastId });
      }
    } catch (e: any) {
      toast.error(e.message || 'Terjadi kesalahan', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = upload.status !== 'approved';

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
      <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">

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
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--primary-soft)' }}
            aria-hidden="true"
          >
            <FileCheck size={18} style={{ color: 'var(--primary)' }} />
          </div>

          <div className="min-w-0 flex-1">
            {/* Period title */}
            <p className="text-[15px] font-semibold leading-snug truncate"
               style={{ color: 'var(--text-primary)' }}>
              CKP {MONTH_FULL[upload.bulan]} {upload.tahun}
              {upload.version > 1 && (
                <span className="ml-2 text-[11px] font-normal px-1.5 py-0.5 rounded-md"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
                  v{upload.version}
                </span>
              )}
            </p>
            {/* File name */}
            <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
              {upload.file_name || 'Tidak ada nama file'}
            </p>
            {/* Mobile date */}
            <p className="text-[11px] mt-0.5 sm:hidden" style={{ color: 'var(--text-tertiary)' }}>
              Upload: {formatDateTime(upload.uploaded_at)}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 min-w-[100px] hidden md:flex">
          <div className="flex items-center gap-2 w-full justify-end">
            <span className="text-[14px] font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {pct.toFixed(0)}%
            </span>
          </div>
          <div className="w-24 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
            <div
              className={`h-full rounded-full progress-bar ${progressClass}`}
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            {upload.total_entries} kegiatan
          </span>
        </div>

        {/* Status + expand */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusBadge status={upload.status} />
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-[12px] font-medium transition-all duration-200 px-2.5 py-1 rounded-full"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)';
            }}
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
          className="card-expanded-content border-t px-6 py-5"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                 style={{ color: 'var(--text-tertiary)' }}>Periode</p>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {MONTH_FULL[upload.bulan]} {upload.tahun}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                 style={{ color: 'var(--text-tertiary)' }}>Total Kegiatan</p>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {upload.total_entries} kegiatan
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                 style={{ color: 'var(--text-tertiary)' }}>Rata-rata Progres</p>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {pct.toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                 style={{ color: 'var(--text-tertiary)' }}>Diupload</p>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {formatDateTime(upload.uploaded_at)}
              </p>
            </div>
          </div>

          {/* File attachment */}
          {upload.file_name && (
            <div className="flex items-center gap-2 mb-5 p-3.5 rounded-2xl"
                 style={{ background: 'var(--primary-soft)', border: '1px solid rgba(0,113,227,0.06)' }}>
              <FileText size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span className="text-[12px] font-medium truncate" style={{ color: 'var(--primary)' }}>
                {upload.file_name}
              </span>
            </div>
          )}

          {/* Notes from pimpinan */}
          {upload.catatan_pimpinan && (
            <div className="mb-5 p-3.5 rounded-2xl"
                 style={{ background: 'var(--warning-soft)', border: '1px solid rgba(255,149,0,0.08)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                 style={{ color: 'var(--warning)' }}>Catatan Pimpinan</p>
              <p className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                {upload.catatan_pimpinan}
              </p>
            </div>
          )}

          {/* CTA & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-5 border-t"
               style={{ borderColor: 'var(--border)' }}>
            <Link
              href={`/pegawai/ckp/${upload.id}`}
              className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors"
              style={{ color: 'var(--primary)' }}
            >
              Lihat Detail Lengkap <ArrowRight size={13} />
            </Link>
            
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 disabled:opacity-50"
                style={{ color: 'var(--danger)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--danger-soft)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Trash2 size={13} />
                {isDeleting ? 'Menghapus...' : 'Hapus CKP'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ActivityCardSkeleton() {
  return (
    <div className="activity-card p-4 sm:p-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="skeleton w-16 h-20 rounded-2xl hidden sm:block" />
        <div className="flex items-center gap-3 flex-1">
          <div className="skeleton w-10 h-10 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="skeleton h-4 w-48 rounded-lg" />
            <div className="skeleton h-3 w-32 rounded-lg" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 hidden md:flex">
          <div className="skeleton h-4 w-8 rounded-lg" />
          <div className="skeleton h-1 w-24 rounded-full" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
