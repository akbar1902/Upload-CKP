"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { PeriodFilter } from '@/components/dashboard/period-filter';
import { Skeleton } from '@/components/ui/skeleton';
import { getBulanName } from '@/lib/utils';
import { exportRekapToExcel } from '@/lib/excel/exporter';
import type { CKPUpload, UploadStatus, User } from '@/types/database';
import { toast } from 'sonner';
import {
  Users, Clock, CheckCircle2, Search,
  RefreshCw, Download, WifiOff, ArrowRight, TrendingUp,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────
interface PegawaiRow {
  user: User;
  upload: (CKPUpload & { user?: User }) | null;
}

// ─── Avatar gradients ──────────────────────────────────────
function getAvatarGradient(name: string): string {
  return 'linear-gradient(135deg, #475569 0%, #1e293b 100%)';
}

// ─── Status label ──────────────────────────────────────────
function StatusLabel({ status }: { status: UploadStatus | null }) {
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

// ─── Pegawai card (cleaner style) ───────
function PegawaiCard({ row }: { row: PegawaiRow }) {
  const { user, upload } = row;
  const initials = user.full_name
    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const avgProgres = upload?.avg_progres ?? 0;
  const totalEntries = upload?.total_entries ?? 0;
  const hasUpload = upload !== null;

  const barColor = avgProgres >= 80 ? '#22c55e'
    : avgProgres >= 50 ? '#f59e0b'
    : '#94a3b8';

  const progressLabel = avgProgres >= 80 ? 'Sangat Baik'
    : avgProgres >= 60 ? 'Baik'
    : avgProgres >= 40 ? 'Cukup'
    : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
      {/* Header kartu */}
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
          style={{ background: getAvatarGradient(user.full_name) }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-[14px] leading-snug truncate" title={user.full_name}>{user.full_name}</p>
              <p className="text-[12px] text-slate-500 mt-0.5 truncate">{user.nip || '—'}</p>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <StatusLabel status={upload?.status ?? null} />
            </div>
          </div>
        </div>
      </div>

      {/* Statistik in a unified block */}
      <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-200">
          <div>
            <p className="text-[11px] text-slate-500 font-medium mb-1">Kegiatan</p>
            <p className="text-[15px] font-bold text-slate-800">{totalEntries}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium mb-1">Capaian</p>
            <p className={`text-[15px] font-bold ${hasUpload ? (avgProgres >= 80 ? 'text-emerald-600' : avgProgres >= 50 ? 'text-amber-600' : 'text-slate-800') : 'text-slate-400'}`}>
              {hasUpload ? `${avgProgres.toFixed(0)}%` : '0%'}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium mb-1">Skor</p>
            <p className="text-[15px] font-bold text-slate-800">
              {hasUpload ? avgProgres.toFixed(0) : '—'}
            </p>
          </div>
        </div>

        {/* Progress bar placed closely with stats */}
        {hasUpload && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.min(avgProgres, 100)}%`, backgroundColor: barColor }}
              />
            </div>
            {progressLabel && (
              <span className="text-[10px] font-semibold text-slate-500">{progressLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Tombol detail */}
      <div className="mt-auto pt-1">
        {hasUpload ? (
          <Link
            href={`/pimpinan/ckp/${upload!.id}`}
            className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-lg py-2 transition-colors w-full"
          >
            Lihat Detail Log <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-slate-400 bg-slate-50 border border-slate-100 rounded-lg py-2 cursor-not-allowed w-full"
            aria-disabled="true"
          >
            Belum ada data
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton kartu ────────────────────────────────────────
function PegawaiCardSkeleton() {
  return (
    <div className="pegawai-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-2.5 w-20 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
      </div>
      <Skeleton className="h-1.5 rounded-full" />
      <Skeleton className="h-9 rounded-lg" />
    </div>
  );
}

// ─── KPI Card ──────────────────────────────────────────────
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
    <div className="kpi-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
             style={{ background: iconBg }}>
          {icon}
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

// ─── Completion Rate Widget ────────────────────────────────
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

// ─── Main page ─────────────────────────────────────────────
export default function PimpinanDashboard() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();

  const [uploads, setUploads] = useState<(CKPUpload & { user?: User })[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fetchedRef = useRef(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear  = new Date().getFullYear();
  const [bulan, setBulan] = useState(currentMonth);
  const [tahun, setTahun] = useState(currentYear);
  const isCurrentPeriod = bulan === currentMonth && tahun === currentYear;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const [uploadsRes, usersRes] = await Promise.all([
        supabase
          .from('ckp_uploads')
          .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
          .eq('bulan', bulan)
          .eq('tahun', tahun)
          .order('uploaded_at', { ascending: false })
          .abortSignal(controller.signal),
        supabase
          .from('users')
          .select('*')
          .eq('role', 'pegawai')
          .eq('is_active', true)
          .order('full_name')
          .abortSignal(controller.signal),
      ]);

      clearTimeout(timeout);

      if (uploadsRes.error) throw new Error(`Gagal memuat data upload: ${uploadsRes.error.message}`);
      if (usersRes.error)  throw new Error(`Gagal memuat data pegawai: ${usersRes.error.message}`);

      const uploadsData = (uploadsRes.data || []).map((u: Record<string, unknown>) => ({
        ...u,
        user: u.user as User | undefined,
      })) as (CKPUpload & { user?: User })[];

      setUploads(uploadsData);
      setAllUsers(usersRes.data as User[] || []);
      setLastRefreshed(new Date());
      fetchedRef.current = true;
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Waktu permintaan habis. Silakan coba lagi.');
      } else {
        setError(err instanceof Error ? err.message : 'Gagal memuat data');
      }
    } finally {
      setLoading(false);
    }
  }, [supabase, bulan, tahun]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Realtime — with proper cleanup
  useEffect(() => {
    const channelName = `pimpinan-${bulan}-${tahun}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'ckp_uploads',
        filter: `bulan=eq.${bulan}`,
      }, () => fetchData())
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, bulan, tahun, fetchData]);

  // Re-fetch when tab becomes visible (prevents stale/stuck state)
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === 'visible' && fetchedRef.current) {
        console.log('[Pimpinan] Tab visible, refreshing data...');
        await fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchData]);

  // Build rows
  const pegawaiRows = useMemo((): PegawaiRow[] =>
    allUsers.map(user => ({
      user,
      upload: uploads.find(u => u.user_id === user.id) ?? null,
    })),
    [allUsers, uploads]
  );

  // Filter by search
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return pegawaiRows;
    const q = searchQuery.toLowerCase();
    return pegawaiRows.filter(r =>
      r.user.full_name.toLowerCase().includes(q) ||
      r.user.nip?.toLowerCase().includes(q) ||
      r.user.unit_kerja?.toLowerCase().includes(q)
    );
  }, [pegawaiRows, searchQuery]);

  // Stats
  const totalPegawai  = allUsers.length;
  
  const uniqueUploads = useMemo(() => {
    return pegawaiRows.map(r => r.upload).filter((u): u is CKPUpload & { user?: User } => u !== null);
  }, [pegawaiRows]);

  const uploadedCount = uniqueUploads.length;
  const pendingCount  = uniqueUploads.filter(u => u.status === 'submitted').length;
  const approvedCount = uniqueUploads.filter(u => u.status === 'approved').length;
  const avgCapaian    = uniqueUploads.length > 0
    ? Math.round(uniqueUploads.reduce((s, u) => s + (u.avg_progres || 0), 0) / uniqueUploads.length)
    : 0;

  const handleExportRekap = () => {
    exportRekapToExcel(uploads, bulan, tahun);
    toast.success('Rekap Excel berhasil diunduh');
  };

  // ── Error state ─────────────────────────────────────────
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
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      </>
    );
  }

  // ── Main render ─────────────────────────────────────────
  return (
    <>
      <Header pendingCount={pendingCount} showExport onExport={handleExportRekap} />
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in">

        {/* ── Page hero ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Dashboard Pimpinan</h2>
            <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-2">
              {getBulanName(bulan)} {tahun}
              {!isCurrentPeriod && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  Filter aktif
                </span>
              )}
              {lastRefreshed && (
                <span className="text-[11px] text-slate-400">
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
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              title="Refresh data"
              aria-label="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExportRekap}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              title="Export rekap ke Excel"
              aria-label="Export rekap ke Excel"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── KPI Cards ─────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <CompletionWidget uploaded={uploadedCount} total={totalPegawai} loading={loading} />
          <KPICard icon={<Users size={18} style={{ color: "#2563EB" }} />} value={totalPegawai}    label="Total Pegawai"     sub="Aktif terdaftar" iconBg="#EFF6FF" loading={loading} />
          <KPICard icon={<Clock size={18} style={{ color: "#D97706" }} />} value={pendingCount}    label="Menunggu Review"   sub="Perlu diproses"  iconBg="#FFFBEB" loading={loading} />
          <KPICard icon={<CheckCircle2 size={18} style={{ color: "#059669" }} />} value={approvedCount}   label="Disetujui"         sub="Bulan ini"       iconBg="#F0FDF4" loading={loading} />
          <KPICard icon={<TrendingUp size={18} style={{ color: "#16A34A" }} />} value={`${avgCapaian}%`} label="Rata-rata Capaian" sub="Tim bulan ini"  iconBg="#F5F3FF" loading={loading} />
        </div>

        {/* ── Rekap per Pegawai section ─────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Rekap per Pegawai</h3>
              <p className="text-xs text-slate-400 mt-0.5">{filteredRows.length} pegawai ditampilkan</p>
            </div>
            <Link
              href="/pimpinan/pegawai"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
            >
              Lihat tabel lengkap <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Mobile search */}
          <div className="relative mb-4 max-w-xs md:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              placeholder="Cari pegawai..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari pegawai"
              className="w-full pl-9 h-9 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          {/* Grid kartu pegawai */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <PegawaiCardSkeleton key={i} />)}
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-slate-600">Tidak ada pegawai ditemukan</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-blue-500 hover:text-blue-700"
                >
                  Hapus pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRows.map(row => (
                <PegawaiCard key={row.user.id} row={row} />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
