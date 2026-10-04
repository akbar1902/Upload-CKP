"use client";

import React, { useMemo, useCallback, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { DataDukungLink } from '@/components/ckp/data-dukung-link';
import { ApprovalHistory } from '@/components/ckp/approval-history';
import { CalendarPreview } from '@/components/ckp/calendar-preview';
import { StatusBadge as SharedStatusBadge } from '@/components/dashboard/status-badge';
import { getBulanName, formatDateTime, formatDate, formatTime } from '@/lib/utils';
import { exportToExcel } from '@/lib/excel/exporter';
import type { CKPUpload, CKPEntry, Approval, User } from '@/types/database';
import { toast } from 'sonner';
import {
  ArrowLeft, Download, FileText, TrendingUp, CheckCircle2, Folder, Clock, Users, MessageSquare,
  RefreshCw, Search, SlidersHorizontal, ChevronDown, ChevronUp, WifiOff, Trash2, AlertTriangle,
  LayoutList, CalendarDays,
} from 'lucide-react';
import Link from 'next/link';
import { deleteCkpUploadAction } from '@/app/actions/ckp';
import { useQueryClient } from '@tanstack/react-query';

// ── Helpers ────────────────────────────────────────────────
const MONTH_ABBR = ['', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
  'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
const WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const ACTIVITY_COLORS = [
  { bg: 'var(--primary-soft)', icon: 'var(--primary)' },
  { bg: '#EFE7DD', icon: '#6B5A44' },
  { bg: 'var(--accent-soft)', icon: 'var(--accent-strong)' },
  { bg: 'var(--success-soft)', icon: 'var(--success-text)' },
  { bg: 'var(--danger-soft)', icon: 'var(--danger-text)' },
  { bg: 'var(--success-soft)', icon: 'var(--success-text)' },
  { bg: 'var(--warning-soft)', icon: 'var(--warning-text)' },
  { bg: 'var(--primary-soft)', icon: 'var(--primary)' },
];
function getActivityColor(idx: number) {
  return ACTIVITY_COLORS[idx % ACTIVITY_COLORS.length];
}

function getProgressClass(pct: number): string {
  // Always use the primary theme color for consistency as requested
  return 'progress-blue'; // progress-blue maps to var(--primary) in globals.css
}

// ── Upload status badge ────────────────────────────────────
function UploadBadge({ status }: { status: string }) {
  return <SharedStatusBadge status={status} />;
}

// Entry-level status badge
function EntryStatusBadge({ progres }: { progres: number }) {
  if (progres >= 100) return (
    <span className="badge-pill badge-approved" role="status">● Selesai</span>
  );
  if (progres > 0) return (
    <span className="badge-pill" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }} role="status">● Berjalan</span>
  );
  return (
    <span className="badge-pill badge-draft" role="status">● Belum mulai</span>
  );
}

// ── KPI Card ───────────────────────────────────────────────
function KPICard({ icon, value, label, sub, iconBg }: {
  icon: React.ReactNode; value: string | number; label: string; sub?: string; iconBg: string;
}) {
  return (
    <div className="kpi-card p-5 flex items-start gap-4 min-w-0 overflow-hidden">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-extrabold tracking-tight leading-none tabular-nums break-words" style={{ color: 'var(--text-primary)', fontSize: 'clamp(24px, 3vw, 30px)' }}>
          {value}
        </p>
        <p className="text-[14px] font-medium mt-1.5 leading-snug" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {sub && <p className="text-[12.5px] mt-0.5 leading-snug" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Entry Activity Card ────────────────────────────────────
function EntryCard({ entry, index }: { entry: CKPEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const dt = entry.tanggal_mulai ? new Date(entry.tanggal_mulai) : null;
  const day = dt ? dt.getDate() : '—';
  const monthAbbr = entry.tanggal_mulai
    ? MONTH_ABBR[new Date(entry.tanggal_mulai).getMonth() + 1] ?? '—'
    : '—';
  const yearNum = dt ? dt.getFullYear() : '';
  const weekday = dt ? WEEKDAYS[dt.getDay()] : '';

  const pct = Math.min(entry.progres || 0, 100);
  const progressClass = getProgressClass(pct);
  const color = getActivityColor(index);

  return (
    <div className={`activity-card ${entry.catatan_koreksi ? '!border-amber-400 !bg-amber-50' : ''}`} aria-expanded={expanded}>
      {/* ── Main row ─────────────────────────────── */}
      <div className="flex items-start gap-4 p-3.5 sm:p-5">

        {/* Date block (Desktop / tablet only) */}
        <div className="hidden sm:flex flex-col items-center justify-center rounded-xl w-16 h-16 flex-shrink-0 text-center shadow-sm"
             style={{ background: 'var(--sand-subtle)', border: '1px solid var(--sand-border)' }}>
          <span className="text-xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{day}</span>
          <span className="text-[10px] font-semibold uppercase mt-1 tracking-widest" style={{ color: 'var(--text-secondary)' }}>{monthAbbr}</span>
        </div>

        {/* ─── Mobile Compact Layout (< md screen) ─── */}
        <div className="flex flex-col flex-1 min-w-0 md:hidden space-y-2">
          {/* Baris 1: Rencana Kinerja (Chip) + Tanggal & Expand Toggle */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="inline-block text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-800/60 truncate max-w-full" title={entry.rencana_kinerja || ''}>
                {entry.rencana_kinerja || 'Tanpa RK'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {formatDate(entry.tanggal_mulai)}
                {entry.tanggal_selesai && entry.tanggal_selesai !== entry.tanggal_mulai && (
                  <>–{formatDate(entry.tanggal_selesai)}</>
                )}
              </span>
              <button
                type="button"
                onClick={() => setExpanded(e => !e)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={expanded ? 'Tutup detail' : 'Lihat detail'}
              >
                {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          </div>

          {/* Baris 2: Kegiatan Utama & Capaian */}
          <div>
            <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {entry.kegiatan || '—'}
            </h4>
            {entry.capaian && (
              <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-snug mt-0.5">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Capaian: </span>
                {entry.capaian}
              </p>
            )}
            {entry.jam_mulai && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Waktu: {formatTime(entry.jam_mulai)}–{formatTime(entry.jam_selesai)}
              </p>
            )}
          </div>

          {/* Baris 3: Footer Status (Bukti Dukung, Nilai SKP & Progres) */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
            {/* Bukti Dukung */}
            <div className="flex items-center gap-1">
              {entry.data_dukung ? (
                <DataDukungLink value={entry.data_dukung} />
              ) : (
                <span className="text-[11px] text-slate-400">Bukti: -</span>
              )}
            </div>

            {/* Nilai SKP & Progres */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                SKP: <strong className={entry.nilai !== null ? 'text-[var(--success)] font-bold' : 'text-slate-400 font-medium'}>
                  {entry.nilai !== null ? entry.nilai : 'Belum dinilai'}
                </strong>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {pct}%
              </span>
            </div>
          </div>

          {/* Catatan Koreksi jika ada */}
          {entry.catatan_koreksi && (
            <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-600" />
              <div>
                <span className="font-semibold block text-[11px] text-amber-800">Catatan Perbaikan:</span>
                {entry.catatan_koreksi}
              </div>
            </div>
          )}
        </div>

        {/* ─── Desktop Content (>= md screen - TETAP SAMA PERSIS SEPERTI SEBELUMNYA) ─── */}
        <div className="hidden md:flex flex-col flex-1 min-w-0 justify-center">
          <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 mb-2">
            <p className="text-[12px] font-semibold uppercase tracking-wider pt-0.5" style={{ color: 'var(--text-secondary)' }}>Rencana Kinerja</p>
            <p className="text-[14px] font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
              {entry.rencana_kinerja || '—'}
            </p>

            <p className="text-[12px] font-semibold uppercase tracking-wider pt-0.5" style={{ color: 'var(--text-secondary)' }}>Kegiatan</p>
            <p className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
              {entry.kegiatan || '—'}
            </p>

            <p className="text-[12px] font-semibold uppercase tracking-wider pt-0.5" style={{ color: 'var(--text-secondary)' }}>Capaian</p>
            <p className="text-[13px] whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
              {entry.capaian || '—'}
            </p>

            <p className="text-[12px] font-semibold uppercase tracking-wider pt-0.5 mt-1" style={{ color: 'var(--text-secondary)' }}>Nilai SKP</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[14px] font-bold" style={{ color: entry.nilai !== null ? 'var(--success-text)' : 'var(--text-tertiary)' }}>
                {entry.nilai !== null ? entry.nilai : 'Belum dinilai'}
              </span>
            </div>

            {entry.catatan_koreksi && (
              <>
                <p className="text-[12px] font-semibold uppercase tracking-wider pt-0.5 mt-2" style={{ color: 'var(--amber-700)' }}>Catatan Perbaikan</p>
                <div className="mt-2 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-[13px] flex items-start gap-2 col-span-2">
                  <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
                  <div>
                    {entry.catatan_koreksi}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress (Desktop only) */}
        <div className="flex-col items-end gap-2 flex-shrink-0 hidden md:flex" style={{ minWidth: 120 }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Progres
          </p>
          <div className="flex items-center gap-2 w-full justify-end">
            <div className="w-24 h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--sand-subtle)' }}>
              <div
                className={`h-full rounded-full progress-bar ${progressClass}`}
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--text-primary)', minWidth: 36, textAlign: 'right' }}>
              {pct}%
            </span>
          </div>
        </div>

        {/* Bukti Dukung + expand (Desktop only) */}
        <div className="hidden md:flex flex-col items-end gap-2 flex-shrink-0">
          {entry.data_dukung && (
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: 'var(--text-secondary)' }}>Bukti Dukung</p>
              <DataDukungLink value={entry.data_dukung} />
            </div>
          )}

          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-[12px] font-medium transition-colors px-2 py-1 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            aria-label={expanded ? 'Tutup detail' : 'Lihat detail'}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* ── Expanded detail ─────────────────────────── */}
      {expanded && (
        <div
          className="card-expanded-content border-t px-5 py-4"
          style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: 'var(--text-secondary)' }}>Tanggal</p>
              <p className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                {formatDate(entry.tanggal_mulai)}
                {entry.tanggal_selesai && entry.tanggal_selesai !== entry.tanggal_mulai && (
                  <> – {formatDate(entry.tanggal_selesai)}</>
                )}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: 'var(--text-secondary)' }}>Waktu</p>
              <p className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                {formatTime(entry.jam_mulai)} – {formatTime(entry.jam_selesai)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: 'var(--text-secondary)' }}>Progres (mobile)</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--sand-subtle)', maxWidth: 80 }}>
                  <div className={`h-full rounded-full ${progressClass}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{pct}%</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: 'var(--text-secondary)' }}>No. Baris</p>
              <p className="text-[13px]" style={{ color: 'var(--text-primary)' }}>#{entry.row_number}</p>
            </div>
          </div>
          {!entry.data_dukung && (
            <p className="text-[12px] mt-3 italic" style={{ color: 'var(--text-secondary)' }}>
              Tidak ada bukti dukung.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Skeleton entry card ────────────────────────────────────
function EntryCardSkeleton() {
  return (
    <div className="activity-card p-5">
      <div className="flex items-start gap-4">
        <div className="skeleton w-16 h-20 rounded-xl hidden sm:block flex-shrink-0" />
        <div className="flex items-start gap-3 flex-1">
          <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-4 w-48 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-4 w-36 rounded" />
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end hidden md:flex">
          <div className="skeleton h-3 w-14 rounded" />
          <div className="skeleton h-2.5 w-28 rounded-full" />
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function CKPDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const { data, isPending: queryPending, error: queryError, refetch } = useQuery({
    queryKey: ['ckp-detail', id],
    queryFn: async () => {
      if (!id) throw new Error("Missing ID");

      const fetchLogic = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const [uploadRes, entriesRes, approvalsRes] = await Promise.all([
            supabase.from('ckp_uploads').select('*').eq('id', id).single().abortSignal(controller.signal),
            supabase.from('ckp_entries').select('*').eq('upload_id', id).order('row_number').abortSignal(controller.signal),
            supabase.from('approvals').select('*, reviewer:reviewer_id(full_name)').eq('upload_id', id).order('created_at', { ascending: false }).abortSignal(controller.signal),
          ]);

          if (uploadRes.error) throw new Error(uploadRes.error.message);

          return {
            upload: uploadRes.data as CKPUpload,
            entries: (entriesRes.data as CKPEntry[]) || [],
            approvals: (approvalsRes.data || []).map((a: Record<string, unknown>) => ({
              ...a, reviewer: a.reviewer as User | undefined,
            })) as Approval[],
          };
        } finally {
          clearTimeout(timeoutId);
        }
      };

      return Promise.race([
        fetchLogic(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Supabase request took too long')), 15000))
      ]);
    },
    enabled: !!user && !authLoading && !!id,
    networkMode: 'always',
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Show previous cached data while background-refetching — prevents skeleton flash
    placeholderData: keepPreviousData,
  });

  // KEY FIX: Only show skeleton when there is genuinely NO data.
  // With keepPreviousData, React Query keeps old data during background refetch
  // but isPending remains true — so `!!user && queryPending` would wrongly
  // show a skeleton over perfectly good cached data.
  const loading = authLoading || (!data && queryPending);

  // Failsafe: if genuinely stuck for > 15s after auth resolved, retry query (NOT hard reload)
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!authLoading && queryPending) {
      timeout = setTimeout(() => {
        console.warn('Failsafe triggered: retrying stuck query');
        void refetch();
      }, 15000);
    }
    return () => clearTimeout(timeout);
  }, [authLoading, queryPending, refetch]);

  const upload = data?.upload || null;
  const entries: CKPEntry[] = data?.entries || [];
  const approvals: Approval[] = data?.approvals || [];

  const handleExport = () => {
    if (!upload || !user) return;
    exportToExcel({ upload, entries, user });
    toast.success('File Excel berhasil diunduh');
  };

  const handleDelete = async () => {
    if (!upload) return;
    if (!window.confirm('Apakah Anda yakin ingin menghapus data CKP ini? Semua entri kegiatan akan ikut terhapus permanen.')) {
      return;
    }
    
    setIsDeleting(true);
    const toastId = toast.loading('Menghapus CKP...');
    try {
      const res = await deleteCkpUploadAction(upload.id);
      if (res.success) {
        toast.success('CKP berhasil dihapus', { id: toastId });
        queryClient.invalidateQueries({ queryKey: ['pegawai-uploads'] });
        router.push('/pegawai'); // redirect back to dashboard
      } else {
        toast.error(res.error || 'Gagal menghapus', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter + pagination
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(e =>
      e.kegiatan?.toLowerCase().includes(q) ||
      e.rencana_kinerja?.toLowerCase().includes(q) ||
      e.capaian?.toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);


  const pagedEntries = filteredEntries;

  const completedCount = entries.filter(e => e.progres >= 100).length;
  const dataDukungCount = entries.filter(e => e.data_dukung && e.data_dukung.trim()).length;
  const avgPct = Math.min(upload?.avg_progres || 0, 100);

  const error = queryError ? queryError.message : null;

  // Error state
  if (error && !loading && !upload) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-md mx-auto text-center py-24">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'var(--sand-subtle)' }}>
            <WifiOff className="h-6 w-6" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Gagal Memuat Data</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'var(--text-primary)', color: 'var(--bg-base)' }}
          >
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      </>
    );
  }

  // Loading
  if (loading) {
    return (
      <>
        <Header />
        <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-12 w-64 rounded-xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <EntryCardSkeleton key={i} />)}
          </div>
        </div>
      </>
    );
  }

  if (!upload) {
    return (
      <>
        <Header />
        <div className="p-5 lg:p-8 max-w-6xl mx-auto text-center py-20">
          <p style={{ color: 'var(--text-secondary)' }}>CKP tidak ditemukan.</p>
          <button onClick={() => router.back()} className="btn-secondary mt-4">
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>
      </>
    );
  }

  const canReupload = upload.status === 'draft' || upload.status === 'revision_required';
  const bulanNama = getBulanName(upload.bulan);

  // Status efektif untuk memastikan jika belum dinilai semua tidak berstatus 'Sudah Dinilai'
  const isFullyScored = entries.length > 0 && entries.every(e => e.nilai !== null);
  const effectiveStatus = (upload.status === 'scored' && !isFullyScored)
    ? 'submitted'
    : (upload.status === 'submitted' && isFullyScored)
    ? 'scored'
    : upload.status;

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* ── Back ──────────────────────────────────── */}
        <Link
          href="/pegawai"
          prefetch={true}
          className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
        >
          <ArrowLeft size={14} /> Kembali
        </Link>

        {/* ── Page header ───────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <p className="text-[12px] mb-2" style={{ color: 'var(--text-secondary)' }}>
              Dashboard &rsaquo; CKP &rsaquo; {bulanNama} {upload.tahun}
            </p>

            {/* Title + status */}
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                CKP {bulanNama} {upload.tahun}
              </h2>
              <UploadBadge status={effectiveStatus} />
              {upload.version > 1 && (
                <span className="badge-pill badge-draft">v{upload.version}</span>
              )}
            </div>

            {/* Meta */}
            <p className="text-[13px] mt-2" style={{ color: 'var(--text-secondary)' }}>
              Diupload: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {formatDateTime(upload.uploaded_at)}
              </span>
              {upload.approved_at && (
                <> · Terakhir diperbarui: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {formatDateTime(upload.approved_at)}
                </span></>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={handleExport} className="btn-primary">
              <Download size={14} /> Export Excel
            </button>
            {canReupload && (
              <>
                <Link href="/pegawai/upload" prefetch={true}>
                  <button className="btn-secondary"
                    style={{ color: 'var(--warning-text)', borderColor: 'var(--warning-text)' }}>
                    <RefreshCw size={14} /> Upload Ulang
                  </button>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn-secondary flex items-center gap-2"
                  style={{ color: 'var(--danger-text)', borderColor: 'var(--danger-text)' }}
                >
                  <Trash2 size={14} /> {isDeleting ? 'Menghapus...' : 'Hapus CKP'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Catatan pimpinan ──────────────────────── */}
        {upload.catatan_pimpinan && (
          <div
            className="flex items-start gap-3 p-4 rounded-2xl"
            style={{ background: 'var(--primary-soft)', border: '1px solid var(--primary-ring)' }}
            role="alert"
          >
            <MessageSquare size={16} style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }} />
            <div>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--primary)' }}>Catatan Pimpinan</p>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-primary)' }}>{upload.catatan_pimpinan}</p>
            </div>
          </div>
        )}

        {/* Rejected alert */}
        {upload.status === 'rejected' && (
          <div
            className="flex items-start gap-3 p-4 rounded-2xl"
            style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger-soft)' }}
            role="alert"
          >
            <div className="text-lg" aria-hidden="true">🔴</div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold" style={{ color: 'var(--danger-text)' }}>CKP Ini Ditolak</p>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--danger-text)' }}>
                CKP Anda telah ditolak. Silakan upload ulang setelah diperbaiki.
              </p>
            </div>
            <Link href="/pegawai/upload" prefetch={true}>
              <button className="btn-primary text-[12px] py-1.5 px-3"
                style={{ background: 'var(--danger)' }}>Upload Ulang</button>
            </Link>
          </div>
        )}

        {/* ── KPI Cards ─────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          <KPICard icon={<FileText size={18} style={{ color: "var(--primary)" }} />} value={upload.total_entries} label="Total Kegiatan"
            sub="Rencana kegiatan pada periode ini" iconBg="var(--primary-soft)" />
          <KPICard icon={<TrendingUp size={18} style={{ color: "var(--primary)" }} />} value={`${avgPct.toFixed(0)}%`} label="Rata-rata Progres"
            sub="Rata-rata dari seluruh kegiatan" iconBg="var(--primary-soft)" />
          <KPICard icon={<Folder size={18} style={{ color: "var(--primary)" }} />} value={dataDukungCount} label="Dokumen Pendukung"
            sub="Total bukti dukung diunggah" iconBg="var(--primary-soft)" />
          <KPICard icon={<CheckCircle2 size={18} style={{ color: "var(--primary)" }} />} value={upload.rata_rata_nilai ? upload.rata_rata_nilai.toFixed(1) : '-'} label="Rata-rata Nilai"
            sub="Nilai Capaian SKP" iconBg="var(--primary-soft)" />
        </div>

        {/* ── Daftar Kegiatan ───────────────────────── */}
        <div>
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <h3 className="text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {viewMode === 'calendar' ? 'Kalender Kegiatan' : 'Daftar Kegiatan'}
              </h3>
              {/* ── View mode toggle ── */}
              <div
                className="flex items-center rounded-lg overflow-hidden"
                style={{ border: '1px solid var(--sand-border)', background: 'var(--sand-subtle)' }}
                role="group"
                aria-label="Pilih tampilan"
              >
                <button
                  id="view-toggle-list"
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  title="Tampilan List"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-all"
                  style={{
                    background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                    color: viewMode === 'list' ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  <LayoutList size={13} />
                  <span>List</span>
                </button>
                <button
                  id="view-toggle-calendar"
                  onClick={() => setViewMode('calendar')}
                  aria-pressed={viewMode === 'calendar'}
                  title="Tampilan Kalender"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-all"
                  style={{
                    background: viewMode === 'calendar' ? 'var(--primary)' : 'transparent',
                    color: viewMode === 'calendar' ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  <CalendarDays size={13} />
                  <span>Kalender</span>
                </button>
              </div>
            </div>

            {/* Search & filter — only shown in list mode */}
            {viewMode === 'list' && (
              <div className="filter-bar">
                <div className="search-input">
                  <Search size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                  <input
                    type="search"
                    placeholder="Cari kegiatan..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); }}
                    aria-label="Cari kegiatan"
                  />
                </div>
                <button className="filter-btn" aria-label="Filter">
                  <SlidersHorizontal size={13} /> Filter
                </button>
              </div>
            )}
          </div>

          {/* ── Calendar View ─────────────────────── */}
          {viewMode === 'calendar' ? (
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
            >
              <CalendarPreview
                bulan={upload.bulan}
                tahun={upload.tahun}
                entries={entries}
              />
            </div>
          ) : (
            /* ── List View ─────────────────────────── */
            pagedEntries.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 text-center rounded-2xl"
                style={{ background: 'var(--card-bg)', border: '1px dashed var(--border)' }}
              >
                <div className="text-3xl mb-3">📂</div>
                <p className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {searchQuery ? 'Tidak ada kegiatan ditemukan' : 'Belum ada kegiatan'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 card-list">
                {pagedEntries.map((entry, i) => (
                  <EntryCard key={entry.id} entry={entry} index={i} />
                ))}
              </div>
            )
          )}

        </div>

        {/* ── Riwayat Review ────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <MessageSquare size={16} style={{ color: 'var(--text-secondary)' }} />
              <h4 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                Riwayat Review
              </h4>
            </div>
          </div>
          <div className="px-5 py-4">
            <ApprovalHistory approvals={approvals} />
          </div>
        </div>

      </div>
    </>
  );
}