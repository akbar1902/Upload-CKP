"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  return (
    <KPICard
      icon={<Users size={18} />}
      value={
        <div className="flex items-baseline gap-1">
          <span>{uploaded}</span>
          <span className="text-base font-normal text-slate-400">/{total}</span>
        </div>
      }
      label="Tingkat Pelaporan"
      sub="pegawai melapor"
      loading={loading}
    />
  );
}

// ─── Main page ─────────────────────────────────────────────
export default function PimpinanDashboard() {
  const supabase = useMemo(() => createClient(), []);
  const { user, loading: authLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const paramBulan = searchParams.get('bulan');
  const paramTahun = searchParams.get('tahun');
  const bulan = paramBulan ? parseInt(paramBulan) : currentMonth;
  const tahun = paramTahun ? parseInt(paramTahun) : currentYear;

  const isCurrentPeriod = bulan === currentMonth && tahun === currentYear;

  const setBulan = (b: number) => {
    router.push(`?bulan=${b}&tahun=${tahun}`);
  };

  const setTahun = (t: number) => {
    router.push(`?bulan=${bulan}&tahun=${t}`);
  };

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
  });

  const loading = authLoading || queryPending;

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

  // Filter and sort by search and status
  const filteredRows = useMemo(() => {
    let result = pegawaiRows;

    // 1. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.user.full_name.toLowerCase().includes(q) ||
        r.user.nip?.toLowerCase().includes(q) ||
        r.user.unit_kerja?.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (statusFilter !== 'all') {
      result = result.filter(r => {
        if (statusFilter === 'belum_lapor') {
          return !r.upload || !r.upload.status;
        }
        return r.upload?.status === statusFilter;
      });
    }

    // 3. Sorting (Default: Menunggu Review -> Disetujui -> Belum Lapor)
    return result.sort((a, b) => {
      const getStatusScore = (upload: CKPUpload | null) => {
        if (!upload || !upload.status) return 3; // Belum Lapor
        if (upload.status === 'approved') return 2; // Disetujui
        if (upload.status === 'submitted') return 1; // Menunggu Review
        return 4; // Lainnya
      };

      const scoreA = getStatusScore(a.upload as CKPUpload | null);
      const scoreB = getStatusScore(b.upload as CKPUpload | null);

      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }
      
      // If same status, sort alphabetically by name
      return a.user.full_name.localeCompare(b.user.full_name);
    });
  }, [pegawaiRows, searchQuery, statusFilter]);

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
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
               style={{ background: 'var(--bg-secondary)' }}>
            <WifiOff className="h-7 w-7" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 className="text-[17px] font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Gagal Memuat Data</h3>
          <p className="text-[14px] mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button onClick={() => refetch()} className="btn-primary">
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
            <h2 className="text-[22px] font-semibold tracking-tight"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Dashboard Pimpinan
            </h2>
            <p className="text-[13px] mt-0.5 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              {getBulanName(bulan)} {tahun}
              {!isCurrentPeriod && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}>
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
              className="filter-btn"
              title="Refresh data"
              aria-label="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExportRekap}
              className="filter-btn"
              title="Export rekap ke Excel"
              aria-label="Export rekap ke Excel"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── KPI Cards ─────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <CompletionWidget uploaded={uploadedCount} total={totalPegawai} loading={loading} />
          <KPICard icon={<Clock size={18} style={{ color: 'var(--warning)' }} />} value={pendingCount} label="Menunggu Review" sub="Perlu diproses" iconBg="var(--warning-soft)" loading={loading} />
          <KPICard icon={<CheckCircle2 size={18} style={{ color: 'var(--success)' }} />} value={approvedCount} label="Disetujui" sub="Bulan ini" iconBg="var(--success-soft)" loading={loading} />
          <KPICard icon={<TrendingUp size={18} style={{ color: 'var(--success)' }} />} value={`${avgCapaian}%`} label="Rata-rata Capaian" sub="Tim bulan ini" iconBg="var(--success-soft)" loading={loading} />
        </div>

        {/* ── Rekap per Pegawai section ─────────────── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[17px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>Rekap per Pegawai</h3>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{filteredRows.length} pegawai ditampilkan</p>
            </div>
            <Link
              href="/pimpinan/pegawai"
              className="text-[13px] font-medium flex items-center gap-1 transition-colors"
              style={{ color: 'var(--primary)' }}
            >
              Lihat tabel lengkap <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {/* Controls: Search and Filter */}
          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="search"
                placeholder="Cari pegawai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Cari pegawai"
                className="w-full pl-9 h-10 text-[13px] rounded-xl transition-all duration-200"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'submitted', label: 'Menunggu Review' },
                { id: 'approved', label: 'Disetujui' },
                { id: 'belum_lapor', label: 'Belum Lapor' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 ${statusFilter === st.id ? 'shadow-sm' : 'hover:bg-[var(--bg-secondary)]'}`}
                  style={statusFilter === st.id 
                    ? { background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid rgba(0,113,227,0.15)' } 
                    : { background: 'var(--card-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid kartu pegawai */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {[...Array(6)].map((_, i) => <PegawaiCardSkeleton key={i} />)}
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-40" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>Tidak ada pegawai ditemukan</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-[13px] font-medium transition-colors"
                  style={{ color: 'var(--primary)' }}
                >
                  Hapus pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
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