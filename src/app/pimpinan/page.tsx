"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { PeriodFilter } from '@/components/dashboard/period-filter';
import { getBulanName } from '@/lib/utils';
import { exportRekapToExcel } from '@/lib/excel/exporter';
import type { CKPUpload, UploadStatus, User } from '@/types/database';
import { toast } from 'sonner';
import {
  Users, FileCheck, Clock, CheckCircle2, Search,
  RefreshCw, Download, WifiOff, ArrowRight, TrendingUp,
  ChevronDown, ChevronUp,
} from 'lucide-react';

// ─── Helpers ───────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
  'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
  'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)',
  'linear-gradient(135deg, #DB2777 0%, #9333EA 100%)',
  'linear-gradient(135deg, #EA580C 0%, #EAB308 100%)',
  'linear-gradient(135deg, #0F766E 0%, #2563EB 100%)',
  'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)',
  'linear-gradient(135deg, #1D4ED8 0%, #0E7490 100%)',
];
function getAvatarGradient(name: string): string {
  const idx = ((name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

function getProgressClass(pct: number): string {
  if (pct >= 100) return 'progress-green';
  if (pct >= 71)  return 'progress-orange';
  if (pct >= 31)  return 'progress-blue';
  return 'progress-gray';
}

// ─── Types ─────────────────────────────────────────────────
interface PegawaiRow {
  user: User;
  upload: (CKPUpload & { user?: User }) | null;
}

// ─── KPI Card ──────────────────────────────────────────────
interface KPICardProps {
  emoji: string;
  value: string | number;
  label: string;
  sub?: string;
  iconBg: string;
  loading?: boolean;
}
function KPICard({ emoji, value, label, sub, iconBg, loading }: KPICardProps) {
  return (
    <div className="kpi-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
             style={{ background: iconBg }}>
          {emoji}
        </div>
      </div>
      {loading
        ? <div className="skeleton h-8 w-16 rounded-xl" />
        : <p className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
      }
      {sub && <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
    </div>
  );
}

// ─── Completion Rate Widget ─────────────────────────────────
function CompletionWidget({ uploaded, total, loading }: { uploaded: number; total: number; loading: boolean }) {
  const pct = total > 0 ? Math.round((uploaded / total) * 100) : 0;
  const r = 20;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;
  const strokeColor = pct >= 80 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#2563EB';

  return (
    <div className="kpi-card p-5 flex flex-col gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        Tingkat Pelaporan
      </p>
      <div className="flex items-center gap-4">
        {loading
          ? <div className="skeleton h-12 w-12 rounded-full" />
          : (
            <div className="relative flex-shrink-0">
              <svg width="52" height="52" className="-rotate-90">
                <circle cx="26" cy="26" r={r} fill="none" stroke="#F1F5F9" strokeWidth="5" />
                <circle
                  cx="26" cy="26" r={r} fill="none"
                  stroke={strokeColor} strokeWidth="5"
                  strokeDasharray={`${dash} ${circumference}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold"
                    style={{ color: 'var(--text-primary)' }}>
                {pct}%
              </span>
            </div>
          )
        }
        <div>
          {loading
            ? <div className="skeleton h-6 w-16 rounded" />
            : <p className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                {uploaded}<span className="text-base font-normal" style={{ color: 'var(--text-secondary)' }}>/{total}</span>
              </p>
          }
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>pegawai melapor</p>
        </div>
      </div>
    </div>
  );
}

// ─── Status badge ───────────────────────────────────────────
function StatusLabel({ status }: { status: UploadStatus | null }) {
  if (!status) {
    return <span className="badge-pill badge-none">⚪ Belum Lapor</span>;
  }
  const map: Record<UploadStatus, { label: string; cls: string; dot: string }> = {
    draft:             { label: 'Draft',          cls: 'badge-draft',     dot: '⚪' },
    submitted:         { label: 'Menunggu Review', cls: 'badge-submitted', dot: '🟡' },
    approved:          { label: 'Disetujui',       cls: 'badge-approved',  dot: '🟢' },
    rejected:          { label: 'Ditolak',         cls: 'badge-rejected',  dot: '🔴' },
    revision_required: { label: 'Perlu Revisi',    cls: 'badge-revision',  dot: '🟠' },
  };
  const s = map[status] ?? { label: status, cls: 'badge-draft', dot: '⚪' };
  return (
    <span className={`badge-pill ${s.cls}`} role="status" aria-label={`Status: ${s.label}`}>
      <span aria-hidden="true">{s.dot}</span>
      {s.label}
    </span>
  );
}

// ─── Team Member Activity Card ──────────────────────────────
function TeamMemberCard({ row }: { row: PegawaiRow }) {
  const { user, upload } = row;
  const [expanded, setExpanded] = useState(false);

  const initials = user.full_name
    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const avgProgres = upload?.avg_progres ?? 0;
  const totalEntries = upload?.total_entries ?? 0;
  const hasUpload = upload !== null;
  const pct = Math.min(avgProgres, 100);
  const progressClass = getProgressClass(pct);

  return (
    <div className="activity-card" aria-expanded={expanded}>
      {/* ── Main row ─────────────────────────────── */}
      <div className="flex items-center gap-4 p-5">

        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0"
          style={{ background: getAvatarGradient(user.full_name) }}
          aria-hidden="true"
        >
          {initials}
        </div>

        {/* Name + NIP + unit */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold leading-snug truncate" style={{ color: 'var(--text-primary)' }}>
            {user.full_name}
          </p>
          <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {user.nip || '—'}
            {user.unit_kerja && (
              <span className="ml-2 opacity-70">· {user.unit_kerja}</span>
            )}
          </p>
        </div>

        {/* Progress */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 hidden md:flex" style={{ minWidth: 120 }}>
          <div className="flex items-center gap-2 w-full justify-end">
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              {totalEntries} kegiatan
            </span>
            <span className="text-[14px] font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {hasUpload ? `${pct.toFixed(0)}%` : '—'}
            </span>
          </div>
          <div className="w-28 h-2.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
            <div
              className={`h-full rounded-full progress-bar ${hasUpload ? progressClass : 'progress-gray'}`}
              style={{ width: hasUpload ? `${pct}%` : '0%' }}
              role="progressbar"
              aria-valuenow={hasUpload ? pct : 0}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Status + action */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusLabel status={upload?.status ?? null} />
          {hasUpload ? (
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
          ) : (
            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Belum upload</span>
          )}
        </div>
      </div>

      {/* ── Expanded panel ─────────────────────────── */}
      {expanded && hasUpload && (
        <div
          className="card-expanded-content border-t px-5 py-4"
          style={{ borderColor: 'var(--border)', background: '#FAFBFC' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                 style={{ color: 'var(--text-secondary)' }}>Total Kegiatan</p>
              <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {totalEntries}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                 style={{ color: 'var(--text-secondary)' }}>Rata-rata Progres</p>
              <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {pct.toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                 style={{ color: 'var(--text-secondary)' }}>File</p>
              <p className="text-[12px] truncate" style={{ color: 'var(--text-primary)' }}>
                {upload!.file_name || '—'}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                 style={{ color: 'var(--text-secondary)' }}>Versi</p>
              <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                v{upload!.version}
              </p>
            </div>
          </div>
          {upload!.catatan_pimpinan && (
            <div className="mb-4 p-3 rounded-xl"
                 style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <p className="text-[11px] font-semibold uppercase mb-1" style={{ color: '#92400E' }}>Catatan</p>
              <p className="text-[12px]" style={{ color: '#78350F' }}>{upload!.catatan_pimpinan}</p>
            </div>
          )}
          <Link
            href={`/pimpinan/ckp/${upload!.id}`}
            className="inline-flex items-center gap-2 text-[13px] font-semibold"
            style={{ color: 'var(--primary)' }}
          >
            Lihat Detail Log <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton card ─────────────────────────────────────────
function TeamMemberCardSkeleton() {
  return (
    <div className="activity-card p-5">
      <div className="flex items-center gap-4">
        <div className="skeleton w-11 h-11 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-40 rounded" />
          <div className="skeleton h-3 w-28 rounded" />
        </div>
        <div className="flex flex-col gap-2 items-end hidden md:flex">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-2.5 w-28 rounded-full" />
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-6 w-14 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────
export default function PimpinanDashboard() {
  const supabase = useMemo(() => createClient(), []);

  const [uploads, setUploads] = useState<(CKPUpload & { user?: User })[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'status'>('name');

  const currentMonth = new Date().getMonth() + 1;
  const currentYear  = new Date().getFullYear();
  const [bulan, setBulan] = useState(currentMonth);
  const [tahun, setTahun] = useState(currentYear);

  const isCurrentPeriod = bulan === currentMonth && tahun === currentYear;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [uploadsRes, usersRes] = await Promise.all([
        supabase
          .from('ckp_uploads')
          .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
          .eq('bulan', bulan)
          .eq('tahun', tahun)
          .order('uploaded_at', { ascending: false }),
        supabase
          .from('users')
          .select('*')
          .eq('role', 'pegawai')
          .eq('is_active', true)
          .order('full_name'),
      ]);
      if (uploadsRes.error) throw new Error(`Gagal memuat data upload: ${uploadsRes.error.message}`);
      if (usersRes.error)  throw new Error(`Gagal memuat data pegawai: ${usersRes.error.message}`);

      const uploadsData = (uploadsRes.data || []).map((u: Record<string, unknown>) => ({
        ...u,
        user: u.user as User | undefined,
      })) as (CKPUpload & { user?: User })[];

      setUploads(uploadsData);
      setAllUsers(usersRes.data as User[] || []);
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [supabase, bulan, tahun]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`pimpinan-${bulan}-${tahun}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'ckp_uploads',
        filter: `bulan=eq.${bulan}`,
      }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, bulan, tahun, fetchData]);

  // Build rows
  const pegawaiRows = useMemo((): PegawaiRow[] =>
    allUsers.map(user => ({
      user,
      upload: uploads.find(u => u.user_id === user.id) ?? null,
    })),
    [allUsers, uploads]
  );

  // Filter + sort
  const filteredRows = useMemo(() => {
    let rows = pegawaiRows;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(r =>
        r.user.full_name.toLowerCase().includes(q) ||
        r.user.nip?.toLowerCase().includes(q) ||
        r.user.unit_kerja?.toLowerCase().includes(q)
      );
    }
    rows = [...rows].sort((a, b) => {
      if (sortBy === 'progress') return (b.upload?.avg_progres ?? -1) - (a.upload?.avg_progres ?? -1);
      if (sortBy === 'status') {
        const order: Record<string, number> = { approved: 0, submitted: 1, revision_required: 2, rejected: 3, draft: 4 };
        return (order[a.upload?.status ?? ''] ?? 5) - (order[b.upload?.status ?? ''] ?? 5);
      }
      return a.user.full_name.localeCompare(b.user.full_name, 'id');
    });
    return rows;
  }, [pegawaiRows, searchQuery, sortBy]);

  // Stats
  const totalPegawai  = allUsers.length;
  const uploadedCount = uploads.length;
  const pendingCount  = uploads.filter(u => u.status === 'submitted').length;
  const approvedCount = uploads.filter(u => u.status === 'approved').length;
  const avgCapaian    = uploads.length > 0
    ? Math.round(uploads.reduce((s, u) => s + (u.avg_progres || 0), 0) / uploads.length)
    : 0;

  const handleExportRekap = () => {
    exportRekapToExcel(uploads, bulan, tahun);
    toast.success('Rekap Excel berhasil diunduh');
  };

  // ── Error state ───────────────────────────────────────────
  if (error && !loading) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-md mx-auto text-center py-24">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl"
               style={{ background: '#F1F5F9' }}>
            📡
          </div>
          <h3 className="text-[16px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Gagal Memuat Data
          </h3>
          <p className="text-[13px] mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button onClick={fetchData} className="btn-primary">
            <RefreshCw size={14} /> Coba Lagi
          </button>
        </div>
      </>
    );
  }

  // ── Main render ───────────────────────────────────────────
  return (
    <>
      <Header
        pendingCount={pendingCount}
        showExport
        onExport={handleExportRekap}
      />
      <div className="p-5 lg:p-8 space-y-6 animate-fade-in">

        {/* ── Page hero ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Dashboard Pimpinan
            </h2>
            <p className="text-[14px] mt-1 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              {getBulanName(bulan)} {tahun}
              {!isCurrentPeriod && (
                <span className="badge-pill badge-submitted text-[10px]">Filter aktif</span>
              )}
              {lastRefreshed && (
                <span className="text-[12px]">
                  · Diperbarui {lastRefreshed.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PeriodFilter
              bulan={bulan} tahun={tahun}
              onBulanChange={setBulan} onTahunChange={setTahun}
            />
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl border transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'white' }}
              title="Refresh data"
              aria-label="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExportRekap}
              className="btn-primary hidden sm:flex"
              aria-label="Export rekap ke Excel"
            >
              <Download size={14} /> Export Excel
            </button>
          </div>
        </div>

        {/* ── KPI Cards ─────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 stagger">
          <CompletionWidget uploaded={uploadedCount} total={totalPegawai} loading={loading} />
          <KPICard emoji="👥" value={totalPegawai}   label="Total Pegawai"     sub="Aktif terdaftar" iconBg="#EFF6FF" loading={loading} />
          <KPICard emoji="⏳" value={pendingCount}   label="Menunggu Review"   sub="Perlu diproses"   iconBg="#FFFBEB" loading={loading} />
          <KPICard emoji="✅" value={approvedCount}  label="Disetujui"         sub="Bulan ini"        iconBg="#F0FDF4" loading={loading} />
          <KPICard emoji="📈" value={`${avgCapaian}%`} label="Rata-rata Capaian" sub="Tim bulan ini"  iconBg="#F5F3FF" loading={loading} />
        </div>

        {/* ── Team Activity Feed ─────────────────────── */}
        <div>
          {/* Section header + filter bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h3 className="text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Rekap Tim — {getBulanName(bulan)} {tahun}
              </h3>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {filteredRows.length} pegawai ditampilkan
                {' · '}<Link href="/pimpinan/pegawai"
                  className="font-medium"
                  style={{ color: 'var(--primary)' }}>
                  Lihat direktori lengkap →
                </Link>
              </p>
            </div>

            <div className="filter-bar">
              {/* Search */}
              <div className="search-input">
                <Search size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                <input
                  type="search"
                  placeholder="Cari pegawai..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Cari pegawai"
                />
              </div>

              {/* Sort buttons */}
              <div className="view-toggle">
                <button
                  className={`view-toggle-btn ${sortBy === 'name' ? 'active' : ''}`}
                  onClick={() => setSortBy('name')}
                  aria-label="Urutkan nama"
                  aria-pressed={sortBy === 'name'}
                >
                  A–Z
                </button>
                <button
                  className={`view-toggle-btn ${sortBy === 'progress' ? 'active' : ''}`}
                  onClick={() => setSortBy('progress')}
                  aria-label="Urutkan progres"
                  aria-pressed={sortBy === 'progress'}
                >
                  %
                </button>
                <button
                  className={`view-toggle-btn ${sortBy === 'status' ? 'active' : ''}`}
                  onClick={() => setSortBy('status')}
                  aria-label="Urutkan status"
                  aria-pressed={sortBy === 'status'}
                >
                  Status
                </button>
              </div>
            </div>
          </div>

          {/* Card list */}
          {loading ? (
            <div className="space-y-3 card-list">
              {[...Array(5)].map((_, i) => <TeamMemberCardSkeleton key={i} />)}
            </div>
          ) : filteredRows.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
              style={{ background: 'var(--card-bg)', border: '1px dashed var(--border)' }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
                   style={{ background: '#F1F5F9' }}>
                🔍
              </div>
              <p className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                Tidak ada pegawai ditemukan
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-[13px] font-medium"
                  style={{ color: 'var(--primary)' }}
                >
                  Hapus pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 card-list">
              {filteredRows.map(row => (
                <TeamMemberCard key={row.user.id} row={row} />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
