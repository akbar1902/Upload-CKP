"use client";

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { DataDukungLink } from '@/components/ckp/data-dukung-link';
import { ApprovalHistory } from '@/components/ckp/approval-history';
import { ApprovalModal } from '@/components/ckp/approval-modal';
import { getBulanName, formatDateTime, formatDate, formatTime } from '@/lib/utils';
import { exportToExcel } from '@/lib/excel/exporter';
import type { CKPUpload, CKPEntry, Approval, User, ApprovalAction } from '@/types/database';
import { toast } from 'sonner';
import {
  ArrowLeft, Download, FileText, TrendingUp, CheckCircle2, Folder, Clock, Users, XCircle,
  RefreshCw, MessageSquare, Unlock, User as UserIcon, WifiOff,
  Briefcase, Search, SlidersHorizontal, LayoutList,
  LayoutGrid, ChevronDown, ChevronUp,
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────
const MONTH_ABBR = ['', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
                        'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
const WEEKDAYS   = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function getActivityColor(idx: number) {
  return { bg: '#F8FAFC', icon: '#64748B' }; // Simple slate styling
}

function getProgressClass(pct: number): string {
  if (pct >= 100) return 'progress-green';
  if (pct >= 71)  return 'progress-orange';
  if (pct >= 31)  return 'progress-blue';
  return 'progress-gray';
}

// ── Status config ──────────────────────────────────────────
const STATUS_CFG = {
  submitted:         { label: 'Menunggu Review', cls: 'badge-submitted', dot: '🟡' },
  approved:          { label: 'Disetujui',        cls: 'badge-approved',  dot: '🟢' },
  rejected:          { label: 'Ditolak',          cls: 'badge-rejected',  dot: '🔴' },
  revision_required: { label: 'Perlu Revisi',     cls: 'badge-revision',  dot: '🟠' },
  draft:             { label: 'Draft',             cls: 'badge-draft',     dot: '⚪' },
} as const;

function UploadBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status as keyof typeof STATUS_CFG] ?? { label: status, cls: 'badge-draft', dot: '⚪' };
  return (
    <span className={`badge-pill ${cfg.cls}`} role="status" aria-label={cfg.label}>
      <span aria-hidden="true">{cfg.dot}</span> {cfg.label}
    </span>
  );
}

// Progress status for individual entries
function EntryStatusBadge({ progres }: { progres: number }) {
  if (progres >= 100) return (
    <span className="badge-pill badge-approved" role="status">● Completed</span>
  );
  if (progres > 0) return (
    <span className="badge-pill badge-submitted" style={{ background: '#EFF6FF', color: '#1D4ED8' }} role="status">● In Progress</span>
  );
  return (
    <span className="badge-pill badge-draft" role="status">● Pending</span>
  );
}

// ── KPI Card ───────────────────────────────────────────────
function KPICard({ icon, value, label, sub, iconBg }: {
  icon: React.ReactNode; value: string | number; label: string; sub?: string; iconBg: string;
}) {
  return (
    <div className="kpi-card p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
           style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-3xl font-extrabold tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
          {value}
        </p>
        <p className="text-[13px] font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Entry Activity Card ────────────────────────────────────
function EntryCard({ entry, index }: { entry: CKPEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const dt = entry.tanggal_mulai ? new Date(entry.tanggal_mulai) : null;
  const day      = dt ? dt.getDate() : '—';
  const monthAbbr = entry.tanggal_mulai
    ? MONTH_ABBR[new Date(entry.tanggal_mulai).getMonth() + 1] ?? '—'
    : '—';
  const yearNum = dt ? dt.getFullYear() : '';
  const weekday = dt ? WEEKDAYS[dt.getDay()] : '';

  const pct = Math.min(entry.progres || 0, 100);
  const progressClass = getProgressClass(pct);
  const color = getActivityColor(index);

  return (
    <div className="activity-card" aria-expanded={expanded}>
      {/* ── Main row ─────────────────────────────── */}
      <div className="flex items-start gap-4 p-5">

        {/* Date block */}
        <div className="hidden sm:flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl w-16 h-16 flex-shrink-0 text-center shadow-sm">
          <span className="text-xl font-bold text-slate-700 leading-none">{day}</span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase mt-1 tracking-widest">{monthAbbr}</span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0 justify-center">
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-x-4 gap-y-2 mb-2">
            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider md:pt-0.5">Rencana Kinerja</p>
            <p className="text-[14px] font-semibold text-slate-800 leading-snug">
              {entry.rencana_kinerja || '—'}
            </p>

            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider md:pt-0.5">Kegiatan</p>
            <p className="text-[13px] text-slate-700">
              {entry.kegiatan || '—'}
            </p>

            <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider md:pt-0.5">Capaian</p>
            <p className="text-[13px] text-slate-700 whitespace-pre-wrap">
              {entry.capaian || '—'}
            </p>
          </div>
          
          {/* Mobile date */}
          <p className="text-[11px] mt-2 sm:hidden text-slate-500 font-medium">
            {formatDate(entry.tanggal_mulai)}
            {entry.jam_mulai && ` · ${formatTime(entry.jam_mulai)}–${formatTime(entry.jam_selesai)}`}
          </p>
        </div>

        {/* Progress */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 hidden md:flex" style={{ minWidth: 120 }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Progres
          </p>
          <div className="flex items-center gap-2 w-full justify-end">
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
            <span className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--text-primary)', minWidth: 36, textAlign: 'right' }}>
              {pct}%
            </span>
          </div>
        </div>

        {/* Bukti Dukung + expand */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {/* Bukti dukung */}
          {entry.data_dukung && (
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                 style={{ color: 'var(--text-secondary)' }}>Bukti Dukung</p>
              <DataDukungLink value={entry.data_dukung} />
            </div>
          )}

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-[12px] font-medium transition-colors px-2 py-1 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F1F5F9'; }}
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
          style={{ borderColor: 'var(--border)', background: '#FAFBFC' }}
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
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9', maxWidth: 80 }}>
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
export default function PimpinanCKPDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [defaultModalAction, setDefaultModalAction] = useState<ApprovalAction>('approved');
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading: loading, error: queryError, refetch } = useQuery({
    queryKey: ['pimpinan-ckp-detail', id],
    queryFn: async () => {
      if (!id) throw new Error("ID not found");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const { data: uploadData, error: uploadError } = await supabase
          .from('ckp_uploads').select('*').eq('id', id).single().abortSignal(controller.signal);
        
        if (uploadError) throw new Error(uploadError.message);
        if (!uploadData) throw new Error("Upload not found");

        const [employeeRes, entriesRes, approvalsRes] = await Promise.all([
          supabase.from('users').select('*').eq('id', uploadData.user_id).single().abortSignal(controller.signal),
          supabase.from('ckp_entries').select('*').eq('upload_id', id).order('row_number').abortSignal(controller.signal),
          supabase.from('approvals')
            .select('*, reviewer:reviewer_id(id, full_name)')
            .eq('upload_id', id)
            .order('created_at', { ascending: false })
            .abortSignal(controller.signal),
        ]);

        return {
          upload: uploadData as CKPUpload,
          employee: employeeRes.data as User,
          entries: (entriesRes.data as CKPEntry[]) || [],
          approvals: (approvalsRes.data || []).map((a: Record<string, unknown>) => ({
            ...a, reviewer: a.reviewer as User | undefined,
          })) as Approval[],
        };
      } finally {
        clearTimeout(timeoutId);
      }
    },
    enabled: !!id,
    networkMode: 'always',
  });

  const upload = data?.upload || null;
  const employee = data?.employee || null;
  const entries = data?.entries || [];
  const approvals = data?.approvals || [];

  const handleApproval = async (action: ApprovalAction, catatan: string) => {
    if (!upload || !currentUser) return;
    const newStatus = action === 'reopened' ? 'submitted' : action;
    const updateData: Record<string, unknown> = {
      status: newStatus,
      catatan_pimpinan: catatan || null,
    };
    if (action === 'approved') {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = currentUser.id;
    }
    const { error: updateError } = await supabase
      .from('ckp_uploads').update(updateData).eq('id', upload.id);
    if (updateError) { toast.error('Gagal memproses. Silakan coba lagi.'); throw updateError; }
    await supabase.from('approvals').insert({ upload_id: upload.id, reviewer_id: currentUser.id, action, catatan });
    await supabase.from('audit_logs').insert({
      user_id: currentUser.id, action: `${action}_ckp`,
      entity_type: 'ckp_uploads', entity_id: upload.id,
      new_data: { status: newStatus, catatan },
    });
    await queryClient.invalidateQueries({ queryKey: ['pimpinan-ckp-detail', id] });
    const label = action === 'approved' ? 'disetujui' : action === 'rejected' ? 'ditolak'
      : action === 'revision_required' ? 'diminta revisi' : 'dibuka kembali';
    toast.success(`CKP berhasil ${label}`);
  };

  const handleExport = () => {
    if (!upload || !employee) return;
    exportToExcel({ upload, entries, user: employee });
    toast.success('File Excel berhasil diunduh');
  };

  // Filter entries
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(e =>
      e.kegiatan?.toLowerCase().includes(q) ||
      e.rencana_kinerja?.toLowerCase().includes(q) ||
      e.capaian?.toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);

  // Pagination disabled as requested (showing all entries)
  const pagedEntries = filteredEntries;

  // Derived stats from entries
  const completedCount = entries.filter(e => e.progres >= 100).length;
  const dataDukungCount = entries.filter(e => e.data_dukung && e.data_dukung.trim()).length;

  const error = queryError ? queryError.message : null;

  // Error state
  if (error && !loading) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-md mx-auto text-center py-24">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
            <WifiOff className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">Gagal Memuat Data</h3>
          <p className="text-sm text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      </>
    );
  }

  // Loading state
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

  if (!upload || !employee) {
    return (
      <>
        <Header />
        <div className="p-5 lg:p-8 max-w-6xl mx-auto text-center py-20">
          <p className="text-slate-500">CKP tidak ditemukan.</p>
          <button onClick={() => router.back()} className="btn-secondary mt-4">
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>
      </>
    );
  }

  const canReview = upload.status === 'submitted';
  const canReopen = upload.status === 'approved';
  const bulanNama = getBulanName(upload.bulan);
  const avgPct = Math.min(upload.avg_progres || 0, 100);

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* ── Back ──────────────────────────────────── */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[13px] font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
        >
          <ArrowLeft size={14} /> Kembali ke Dashboard
        </button>

        {/* ── Page header ───────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <p className="text-[12px] mb-2" style={{ color: 'var(--text-secondary)' }}>
              Dashboard &rsaquo; CKP &rsaquo; {bulanNama} {upload.tahun}
            </p>

            {/* Title + status badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Review CKP {bulanNama} {upload.tahun}
              </h2>
              <UploadBadge status={upload.status} />
              {upload.version > 1 && (
                <span className="badge-pill badge-draft">v{upload.version}</span>
              )}
            </div>

            {/* Employee info */}
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                <UserIcon size={13} />
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{employee.full_name}</span>
              </div>
              {employee.nip && (
                <div className="flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                  <span>NIP: {employee.nip}</span>
                </div>
              )}
              {employee.unit_kerja && (
                <div className="flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                  <Briefcase size={12} />
                  <span>{employee.unit_kerja}</span>
                </div>
              )}
            </div>

            {/* Meta */}
            <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>
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
            <button onClick={handleExport} className="btn-secondary">
              <Download size={14} /> Export Excel
            </button>
            {canReview && (
              <button
                onClick={() => { setDefaultModalAction('approved'); setShowApprovalModal(true); }}
                className="btn-primary"
              >
                <CheckCircle2 size={14} /> Review CKP
              </button>
            )}
            {canReopen && (
              <button
                onClick={async () => { await handleApproval('reopened', 'Status dibuka kembali oleh pimpinan.'); }}
                className="btn-secondary"
                style={{ color: '#D97706', borderColor: '#FDE68A' }}
              >
                <Unlock size={14} /> Buka Kembali
              </button>
            )}
          </div>
        </div>

        {/* ── Catatan pimpinan alert ─────────────────── */}
        {upload.catatan_pimpinan && (
          <div
            className="flex items-start gap-3 p-4 rounded-2xl"
            style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}
            role="alert"
          >
            <MessageSquare size={16} style={{ color: '#2563EB', marginTop: 2, flexShrink: 0 }} />
            <div>
              <p className="text-[13px] font-semibold" style={{ color: '#1E40AF' }}>Catatan Pimpinan</p>
              <p className="text-[13px] mt-0.5" style={{ color: '#1D4ED8' }}>{upload.catatan_pimpinan}</p>
            </div>
          </div>
        )}

        {/* ── KPI Cards (4 columns) ─────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          <KPICard icon={<FileText size={18} style={{ color: "#2563EB" }} />} value={upload.total_entries} label="Total Kegiatan"
            sub="Rencana kegiatan pada periode ini" iconBg="#EFF6FF" />
          <KPICard icon={<TrendingUp size={18} style={{ color: "#16A34A" }} />} value={`${avgPct.toFixed(0)}%`} label="Rata-rata Progres"
            sub="Rata-rata dari seluruh kegiatan" iconBg="#F0FDF4" />
          <KPICard icon={<CheckCircle2 size={18} style={{ color: "#059669" }} />} value={completedCount} label="Completed"
            sub="Kegiatan telah selesai" iconBg="#ECFDF5" />
          <KPICard icon={<Folder size={18} style={{ color: "#7C3AED" }} />} value={dataDukungCount} label="Dokumen Pendukung"
            sub="Total bukti dukung diunggah" iconBg="#F5F3FF" />
        </div>

        {/* ── Daftar Kegiatan section ───────────────── */}
        <div>
          {/* Section header + filter bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <h3 className="text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Daftar Kegiatan
            </h3>
            <div className="filter-bar">
              {/* Search */}
              <div className="search-input">
                <Search size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                <input
                  type="search"
                  placeholder="Cari kegiatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Cari kegiatan"
                />
              </div>
              <button className="filter-btn" aria-label="Filter">
                <SlidersHorizontal size={13} /> Filter
              </button>
            </div>
          </div>

          {/* Entry cards */}
          {pagedEntries.length === 0 ? (
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
          )}


        </div>

        {/* ── Quick review actions (bottom of list) ─── */}
        {canReview && (
          <div
            className="flex items-center justify-between p-4 rounded-2xl"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
          >
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              {entries.length} kegiatan · Rata-rata progres {avgPct.toFixed(0)}%
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setDefaultModalAction('approved'); setShowApprovalModal(true); }}
                className="btn-primary text-[12px] py-2 px-4"
              >
                <CheckCircle2 size={13} /> Setujui
              </button>
              <button
                onClick={() => { setDefaultModalAction('rejected'); setShowApprovalModal(true); }}
                className="btn-secondary text-[12px] py-2 px-4"
                style={{ color: 'var(--danger)', borderColor: '#FECACA' }}
              >
                <XCircle size={13} /> Tolak
              </button>
              <button
                onClick={() => { setDefaultModalAction('revision_required'); setShowApprovalModal(true); }}
                className="btn-secondary text-[12px] py-2 px-4"
                style={{ color: '#D97706', borderColor: '#FDE68A' }}
              >
                <RefreshCw size={13} /> Minta Revisi
              </button>
            </div>
          </div>
        )}

        {/* ── Approval History ──────────────────────── */}
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

      {/* Approval Modal */}
      <ApprovalModal
        open={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onSubmit={handleApproval}
        employeeName={employee.full_name}
        period={`${bulanNama} ${upload.tahun}`}
        defaultAction={defaultModalAction}
      />
    </>
  );
}
