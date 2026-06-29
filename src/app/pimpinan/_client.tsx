"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
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

import { KPICard } from '@/components/dashboard/kpi-card';
import { StatusLabel } from '@/components/dashboard/status-badge';
import { PegawaiCard, PegawaiCardSkeleton, type PegawaiRow } from '@/components/dashboard/pegawai-card';
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
  const { user, loading: authLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [bulan, setBulan] = useState(currentMonth);
  const [tahun, setTahun] = useState(currentYear);
  const isCurrentPeriod = bulan === currentMonth && tahun === currentYear;

  const { data, isPending: queryPending, error: queryError, refetch } = useQuery({
    queryKey: ['pimpinan-uploads', bulan, tahun],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      try {
        const queryPromise = Promise.all([
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
            .in('role', ['anggota', 'ketua_tim'])
            .eq('is_active', true)
            .order('full_name')
            .abortSignal(controller.signal),
        ]);

        const [uploadsRes, usersRes] = await Promise.race([
          queryPromise,
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Supabase request took too long')), 15000))
        ]);

        if (uploadsRes.error) throw new Error(`Gagal memuat data upload: ${uploadsRes.error.message}`);
        if (usersRes.error) throw new Error(`Gagal memuat data pegawai: ${usersRes.error.message}`);

        const newUploads = (uploadsRes.data || []).map((u: Record<string, unknown>) => ({
          ...u,
          user: u.user as User | undefined,
        })) as (CKPUpload & { user?: User })[];

        const newUsers = usersRes.data as User[] || [];

        return { uploads: newUploads, users: newUsers };
      } finally {
        clearTimeout(timeoutId);
      }
    },
    enabled: !!user && !authLoading,
    networkMode: 'always',
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Show previous cached data while background-refetching — prevents skeleton flash
    placeholderData: keepPreviousData,
  });

  // KEY FIX: Only show skeleton when there is genuinely NO data.
  // With keepPreviousData, cached data stays visible during background refetch.
  // Using just queryPending would show skeleton over perfectly good cached data.
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

  const uploads = data?.uploads || [];
  const allUsers = data?.users || [];
  const error = queryError ? queryError.message : null;

  // Realtime
  useEffect(() => {
    const channelName = `pimpinan-${bulan}-${tahun}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'ckp_uploads',
        filter: `bulan=eq.${bulan}`,
      }, () => refetch())
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, bulan, tahun, refetch]);

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
  const totalPegawai = allUsers.length;

  const uniqueUploads = useMemo(() => {
    return pegawaiRows.map(r => r.upload).filter((u): u is CKPUpload & { user?: User } => u !== null);
  }, [pegawaiRows]);

  const uploadedCount = uniqueUploads.length;
  const pendingCount = uniqueUploads.filter(u => u.status === 'submitted').length;
  const approvedCount = uniqueUploads.filter(u => u.status === 'approved').length;
  const avgCapaian = uniqueUploads.length > 0
    ? Math.round(uniqueUploads.reduce((s, u) => s + (u.avg_progres || 0), 0) / uniqueUploads.length)
    : 0;

  const handleExportRekap = () => {
    exportRekapToExcel(uploads, bulan, tahun);
    toast.success('Rekap Excel berhasil diunduh');
  };

  // ── Error state ─────────────────────────────────────────
  if (error && !loading && uploads.length === 0 && allUsers.length === 0) {
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
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PeriodFilter
              bulan={bulan} tahun={tahun}
              onBulanChange={setBulan} onTahunChange={setTahun}
            />
            <button
              onClick={() => refetch()}
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
          <KPICard icon={<Users size={18} style={{ color: "#2563EB" }} />} value={totalPegawai} label="Total Pegawai" sub="Aktif terdaftar" iconBg="#EFF6FF" loading={loading} />
          <KPICard icon={<Clock size={18} style={{ color: "#D97706" }} />} value={pendingCount} label="Menunggu Review" sub="Perlu diproses" iconBg="#FFFBEB" loading={loading} />
          <KPICard icon={<CheckCircle2 size={18} style={{ color: "#059669" }} />} value={approvedCount} label="Disetujui" sub="Bulan ini" iconBg="#F0FDF4" loading={loading} />
          <KPICard icon={<TrendingUp size={18} style={{ color: "#16A34A" }} />} value={`${avgCapaian}%`} label="Rata-rata Capaian" sub="Tim bulan ini" iconBg="#F5F3FF" loading={loading} />
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