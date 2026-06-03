"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { getBulanName, formatDateTime } from '@/lib/utils';
import type { CKPUpload } from '@/types/database';
import {
  FileText, TrendingUp, CheckCircle2, Folder, Clock, Users, Plus, AlertTriangle, XCircle, Search,
  ArrowUpDown, LayoutList, LayoutGrid, ChevronDown,
  ChevronUp, ArrowRight, Upload, FileCheck,
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────
const MONTH_ABBR = ['', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
                        'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
const MONTH_FULL = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function getProgressClass(pct: number): string {
  if (pct >= 100) return 'progress-green';
  if (pct >= 71)  return 'progress-orange';
  if (pct >= 31)  return 'progress-blue';
  return 'progress-gray';
}

// ── Status badge ───────────────────────────────────────────
const STATUS_CONFIG = {
  submitted:         { label: 'Menunggu Review', cls: 'badge-submitted', dot: '🟡' },
  approved:          { label: 'Disetujui',        cls: 'badge-approved',  dot: '🟢' },
  rejected:          { label: 'Ditolak',          cls: 'badge-rejected',  dot: '🔴' },
  revision_required: { label: 'Perlu Revisi',     cls: 'badge-revision',  dot: '🟠' },
  draft:             { label: 'Draft',             cls: 'badge-draft',     dot: '⚪' },
} as const;

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
    ?? { label: status, cls: 'badge-draft', dot: '⚪' };
  return (
    <span className={`badge-pill ${cfg.cls}`} role="status" aria-label={`Status: ${cfg.label}`}>
      <span aria-hidden="true">{cfg.dot}</span>
      {cfg.label}
    </span>
  );
}

// ── KPI Card ───────────────────────────────────────────────
interface KPICardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sub?: string;
  iconBg: string;
  loading?: boolean;
}
function KPICard({ icon, value, label, sub, iconBg, loading }: KPICardProps) {
  return (
    <div className="kpi-card p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </p>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
      </div>
      {loading
        ? <div className="skeleton h-9 w-20 rounded-xl" />
        : <p className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
      }
      {sub && <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
    </div>
  );
}

// ── Activity Card (upload entry) ───────────────────────────
interface ActivityCardProps {
  upload: CKPUpload;
}
function ActivityCard({ upload }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Date from uploaded_at
  const dt = new Date(upload.uploaded_at);
  const day = dt.getDate();
  const monthAbbr = MONTH_ABBR[upload.bulan] ?? '---';
  const weekday = WEEKDAYS[dt.getDay()];

  const pct = Math.min(upload.avg_progres || 0, 100);
  const progressClass = getProgressClass(pct);

  const statusCfg = STATUS_CONFIG[upload.status as keyof typeof STATUS_CONFIG]
    ?? { label: upload.status, cls: 'badge-draft', dot: '⚪' };

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

// ── Skeleton card ──────────────────────────────────────────
function ActivityCardSkeleton() {
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
        <div className="flex flex-col gap-2 items-end hidden md:flex">
          <div className="skeleton h-3 w-12 rounded" />
          <div className="skeleton h-2.5 w-24 rounded-full" />
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ── Grid card (alternate view) ─────────────────────────────
function ActivityGridCard({ upload }: ActivityCardProps) {
  const pct = Math.min(upload.avg_progres || 0, 100);
  const progressClass = getProgressClass(pct);
  return (
    <div className="kpi-card p-5 flex flex-col gap-3 animate-scale-in">
      <div className="flex items-center justify-between">
        <div className="date-block" style={{ minWidth: 'unset', padding: '8px 10px' }}>
          <span className="month" style={{ fontSize: '11px' }}>
            {MONTH_FULL[upload.bulan]} {upload.tahun}
          </span>
        </div>
        <StatusBadge status={upload.status} />
      </div>
      <div>
        <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
          {upload.file_name || 'Tidak ada file'}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {upload.total_entries} kegiatan
        </p>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Progres</span>
          <span className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {pct.toFixed(0)}%
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
          <div className={`h-full rounded-full progress-bar ${progressClass}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <Link
        href={`/pegawai/ckp/${upload.id}`}
        className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[13px] font-medium transition-colors"
        style={{ background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid rgba(37,99,235,0.12)' }}
      >
        Lihat Detail <ArrowRight size={13} />
      </Link>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function PegawaiDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [uploads, setUploads] = useState<CKPUpload[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const supabase = useMemo(() => createClient(), []);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear  = new Date().getFullYear();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setDataLoading(false); return; }
    let cancelled = false;
    const fetchUploads = async () => {
      try {
        const { data } = await supabase
          .from('ckp_uploads')
          .select('*')
          .eq('user_id', user.id)
          .order('tahun', { ascending: false })
          .order('bulan', { ascending: false });
        if (!cancelled) setUploads(data || []);
      } catch (err) {
        console.error('Error fetching uploads:', err);
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    };
    fetchUploads();
    return () => { cancelled = true; };
  }, [user, authLoading, supabase]);

  // Stats
  const stats = useMemo(() => ({
    total:      uploads.length,
    approved:   uploads.filter(u => u.status === 'approved').length,
    pending:    uploads.filter(u => u.status === 'submitted').length,
    rejected:   uploads.filter(u => u.status === 'rejected' || u.status === 'revision_required').length,
    avgProgres: uploads.length
      ? (uploads.reduce((s, u) => s + (u.avg_progres || 0), 0) / uploads.length).toFixed(0)
      : '0',
    totalKegiatan: uploads.reduce((s, u) => s + (u.total_entries || 0), 0),
  }), [uploads]);

  const currentMonthUpload = useMemo(
    () => uploads.find(u => u.bulan === currentMonth && u.tahun === currentYear),
    [uploads, currentMonth, currentYear]
  );

  // Filtered list
  const filteredUploads = useMemo(() => {
    if (!searchQuery.trim()) return uploads;
    const q = searchQuery.toLowerCase();
    return uploads.filter(u =>
      getBulanName(u.bulan).toLowerCase().includes(q) ||
      u.file_name?.toLowerCase().includes(q) ||
      String(u.tahun).includes(q)
    );
  }, [uploads, searchQuery]);

  const isLoading = authLoading || dataLoading;

  // KPI cards config
  const kpiCards = [
    { icon: <FileText size={18} style={{ color: "#2563EB" }} />, value: stats.total,       label: 'Total Upload',      sub: 'semua periode',        iconBg: '#EFF6FF' },
    { icon: <TrendingUp size={18} style={{ color: "#16A34A" }} />, value: `${stats.avgProgres}%`, label: 'Rata-rata Progres', sub: 'semua kegiatan', iconBg: '#F0FDF4' },
    { icon: <CheckCircle2 size={18} style={{ color: "#059669" }} />, value: stats.approved,    label: 'Disetujui',         sub: `dari ${stats.total} upload`, iconBg: '#F0FDF4' },
    { icon: <Clock size={18} style={{ color: "#D97706" }} />, value: stats.pending,     label: 'Menunggu Review',   sub: 'belum diproses',       iconBg: '#FFFBEB' },
  ];

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 space-y-6 animate-fade-in">

        {/* ── Page hero ─────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Halo, {user?.full_name?.split(' ')[0] || 'Pegawai'} 👋
            </h2>
            <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Link href="/pegawai/upload">
            <button className="btn-primary">
              <Plus size={15} />
              Upload CKP
            </button>
          </Link>
        </div>

        {/* ── Alerts ────────────────────────────────── */}
        {!isLoading && !currentMonthUpload && (
          <div
            className="flex items-start gap-3 p-4 rounded-2xl animate-fade-in"
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
            role="alert"
          >
            <AlertTriangle size={16} style={{ color: '#D97706', marginTop: 2, flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold" style={{ color: '#92400E' }}>
                CKP {getBulanName(currentMonth)} {currentYear} belum diupload
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: '#B45309' }}>
                Silakan upload sebelum akhir bulan.
              </p>
            </div>
            <Link href="/pegawai/upload" className="flex-shrink-0">
              <button className="btn-primary text-[12px] py-1.5 px-3">Upload</button>
            </Link>
          </div>
        )}

        {!isLoading && stats.rejected > 0 && (
          <div
            className="flex items-start gap-3 p-4 rounded-2xl animate-fade-in"
            style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
            role="alert"
          >
            <XCircle size={16} style={{ color: '#DC2626', marginTop: 2, flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold" style={{ color: '#991B1B' }}>
                {stats.rejected} CKP memerlukan tindakan
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: '#B91C1C' }}>
                Ada CKP yang ditolak atau perlu revisi. Silakan upload ulang.
              </p>
            </div>
            <Link href="/pegawai/upload" className="flex-shrink-0">
              <button className="btn-primary text-[12px] py-1.5 px-3"
                      style={{ background: '#DC2626' }}>Upload Ulang</button>
            </Link>
          </div>
        )}

        {/* ── KPI Cards ─────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {kpiCards.map((card) => (
            <KPICard key={card.label} loading={isLoading} {...card} />
          ))}
        </div>

        {/* ── Activity Feed Section ─────────────────── */}
        <div>
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h3 className="text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Riwayat Upload CKP
              </h3>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {filteredUploads.length} upload tercatat
                {searchQuery && ` · filter aktif`}
              </p>
            </div>

            {/* Filter bar */}
            <div className="filter-bar">
              {/* Search */}
              <div className="search-input">
                <Search size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                <input
                  type="search"
                  placeholder="Cari periode atau file..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Cari upload"
                />
              </div>

              {/* Sort */}
              <button className="filter-btn" aria-label="Urutkan">
                <ArrowUpDown size={13} />
                <span className="hidden sm:inline">Urutkan</span>
              </button>

              {/* View toggle */}
              <div className="view-toggle" role="group" aria-label="Tampilan">
                <button
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="Tampilan list"
                  aria-pressed={viewMode === 'list'}
                >
                  <LayoutList size={14} />
                  <span className="hidden sm:inline ml-1">List</span>
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Tampilan grid"
                  aria-pressed={viewMode === 'grid'}
                >
                  <LayoutGrid size={14} />
                  <span className="hidden sm:inline ml-1">Grid</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="space-y-3 card-list">
              {[...Array(3)].map((_, i) => <ActivityCardSkeleton key={i} />)}
            </div>
          ) : filteredUploads.length === 0 ? (
            /* Empty state */
            <div
              className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
              style={{ background: 'var(--card-bg)', border: '1px dashed var(--border)' }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
                style={{ background: '#F1F5F9' }}
              >
                📂
              </div>
              <p className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {searchQuery ? 'Tidak ada hasil' : 'Belum ada upload'}
              </p>
              <p className="text-[13px] mt-1 mb-6" style={{ color: 'var(--text-secondary)' }}>
                {searchQuery
                  ? 'Coba kata kunci lain.'
                  : 'Upload CKP bulanan pertama Anda untuk mulai.'}
              </p>
              {!searchQuery && (
                <Link href="/pegawai/upload">
                  <button className="btn-primary">
                    <Upload size={14} /> Upload Sekarang
                  </button>
                </Link>
              )}
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-3 card-list">
              {filteredUploads.map((upload) => (
                <ActivityCard key={upload.id} upload={upload} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 card-list">
              {filteredUploads.map((upload) => (
                <ActivityGridCard key={upload.id} upload={upload} />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
