"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { runSafeRead } from '@/lib/supabase/read';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { getBulanName, getDefaultPeriod } from '@/lib/utils';
import type { CKPUpload } from '@/types/database';
import {
  FileText, TrendingUp, CheckCircle2, Folder, Clock, Search,
  ArrowUpDown, LayoutList, LayoutGrid, ChevronDown,
  ArrowRight, WifiOff, RefreshCw, Trash2,
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────
const MONTH_ABBR = ['', 'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
  'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
const MONTH_FULL = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function getProgressClass(pct: number): string {
  if (pct >= 100) return 'progress-green';
  if (pct >= 71) return 'progress-orange';
  if (pct >= 31) return 'progress-blue';
  return 'progress-gray';
}

import { KPICard } from '@/components/dashboard/kpi-card';
import { StatusHero, type HeroStatus } from '@/components/dashboard/status-hero';
import { EmptyState } from '@/components/ui/empty-state';
import type { Route } from 'next';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { ActivityCard, ActivityCardSkeleton, type ActivityCardProps } from '@/components/dashboard/activity-card';
import { deleteCkpUploadAction } from '@/app/actions/ckp';
import { toast } from 'sonner';

// ── Grid card (alternate view) ─────────────────────────────
function ActivityGridCard({ upload, onDeleteSuccess }: ActivityCardProps) {
  const queryClient = useQueryClient();
  const pct = Math.min(upload.avg_progres || 0, 100);
  const progressClass = getProgressClass(pct);
  const canDelete = upload.status !== 'approved';
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bersihkan timer saat unmount agar tidak setState setelah komponen hilang.
  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    };
  }, []);

  const resetConfirmDelete = () => {
    if (confirmTimerRef.current) {
      clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
    }
    setShowConfirmDelete(false);
  };

  // Konfirmasi dua langkah (pola activity-card): tombol berubah jadi
  // "Yakin hapus?" + Batal, dan otomatis kembali setelah 5 detik.
  const handleAskDelete = () => {
    setShowConfirmDelete(true);
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    confirmTimerRef.current = setTimeout(() => {
      confirmTimerRef.current = null;
      setShowConfirmDelete(false);
    }, 5000);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation if wrapped in link or similar
    resetConfirmDelete();

    // 1. Optimistic Delete (Remove from UI instantly)
    const toastId = toast.loading('Menghapus CKP...');
    
    // Backup old data for rollback
    const previousUploads = queryClient.getQueryData(['pegawai-uploads', upload.user_id]);
    queryClient.setQueryData(['pegawai-uploads', upload.user_id], (old: CKPUpload[] | undefined) => {
      if (!old) return old;
      return old.filter(u => u.id !== upload.id);
    });

    try {
      const res = await deleteCkpUploadAction(upload.id);
      if (res.success) {
        toast.success('CKP berhasil dihapus', { id: toastId });
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else {
        throw new Error(res.error || 'Gagal menghapus');
      }
    } catch (err: any) {
      // 2. Rollback on failure
      queryClient.setQueryData(['pegawai-uploads', upload.user_id], previousUploads);
      toast.error(err.message || 'Terjadi kesalahan saat menghapus', { id: toastId });
    }
  };

  return (
    <div className="kpi-card p-4 sm:p-6 flex flex-col gap-3 animate-scale-in">
      <div className="flex items-center justify-between">
        <div className="date-block flex" style={{ minWidth: 'unset', padding: '8px 10px' }}>
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
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          {upload.total_entries} kegiatan
        </p>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>Progres</span>
          <span className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {pct.toFixed(0)}%
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--sand-subtle)' }}>
          <div className={`h-full rounded-full progress-bar ${progressClass}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Link
          href={`/pegawai/ckp/${upload.id}`}
          prefetch={true}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-200"
          style={{ background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid var(--primary-ring)' }}
        >
          Lihat Detail <ArrowRight size={13} />
        </Link>
        {canDelete && (
          showConfirmDelete ? (
            <div className="flex-shrink-0 flex items-center gap-1.5">
              <span className="hidden sm:inline text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                Yakin hapus?
              </span>
              <button
                onClick={resetConfirmDelete}
                className="px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-colors"
                style={{ background: 'var(--sand-subtle)', color: 'var(--text-secondary)' }}
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-2.5 py-1.5 rounded-full text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--danger)' }}
              >
                Ya, Hapus
              </button>
            </div>
          ) : (
            <button
              onClick={handleAskDelete}
              title="Hapus CKP"
              aria-label="Hapus CKP"
              className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
              style={{ color: 'var(--danger)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--danger-soft)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Trash2 size={15} />
            </button>
          )
        )}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function PegawaiDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const queryClient = useQueryClient();

  const handleDeleteSuccess = useCallback((deletedId: string) => {
    queryClient.setQueryData(['pegawai-uploads', user?.id], (old: CKPUpload[] | undefined) => {
      if (!old) return old;
      return old.filter(u => u.id !== deletedId);
    });
    queryClient.invalidateQueries({ queryKey: ['pegawai-uploads', user?.id] });
  }, [queryClient, user?.id]);

  const defaultPeriod = getDefaultPeriod(10);
  const currentMonth = defaultPeriod.bulan;
  const currentYear = defaultPeriod.tahun;

  const { data: uploads, isPending: queryPending, error: queryError, refetch } = useQuery({
    queryKey: ['pegawai-uploads', user?.id],
    queryFn: () =>
      runSafeRead(async (supabase, signal) => {
        if (!user) return [];

        const { data, error } = await supabase
          .from('ckp_uploads')
          .select('*')
          .eq('user_id', user.id)
          .order('tahun', { ascending: false })
          .order('bulan', { ascending: false })
          .order('uploaded_at', { ascending: false })
          .abortSignal(signal);

        if (error) throw new Error(error.message);
        return data as CKPUpload[];
      }),
    enabled: !!user && !authLoading,
    networkMode: 'always',
    // Data dari render server (prefetchQuery di page.tsx) sudah fresh.
    // JANGAN langsung query ulang ke Supabase saat mount — dulu ada
    // `staleTime: 0` + `refetchOnMount: 'always'` yang membuang data hasil
    // render server dan menambah satu round-trip ke Supabase setiap kali
    // dashboard dibuka. Freshness diatur staleTime (selaras RecoveryManager).
    staleTime: 30_000,
    // Show previous cached data while background-refetching — prevents skeleton flash
    placeholderData: keepPreviousData,
    retry: false,
  });

  // KEY FIX: Only show skeleton when there is genuinely NO data.
  // With keepPreviousData, `uploads` will be the previous fetch result (not undefined)
  // during background refetch — so this only returns true on the very first load.
  const isLoading = authLoading || (!uploads && queryPending);

  // Safe array for all downstream usage
  const uploadsArr: CKPUpload[] = uploads ?? [];

  // Only consider the latest upload per period (bulan-tahun)
  const uniqueUploads = useMemo(() => {
    const seen = new Set<string>();
    return uploadsArr.filter(u => {
      const key = `${u.bulan}-${u.tahun}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [uploadsArr]);

  // Stats
  // `totalPeriods` = jumlah upload unik per bulan-tahun (tanpa duplikat versi),
  // dipakai sebagai penyebut KPI "Disetujui" agar sebanding dengan pembilangnya.
  const stats = useMemo(() => ({
    total: uploadsArr.length,
    totalPeriods: uniqueUploads.length,
    approved: uniqueUploads.filter(u => u.status === 'approved').length,
    pending: uniqueUploads.filter(u => u.status === 'submitted' || u.status === 'scored').length,
    rejected: uniqueUploads.filter(u => u.status === 'rejected' || u.status === 'revision_required').length,
    avgProgres: uniqueUploads.length
      ? (uniqueUploads.reduce((s, u) => s + (u.avg_progres || 0), 0) / uniqueUploads.length).toFixed(0)
      : '0',
    totalKegiatan: uniqueUploads.reduce((s, u) => s + (u.total_entries || 0), 0),
  }), [uploadsArr, uniqueUploads]);

  const currentMonthUpload = useMemo(
    () => uploadsArr.find(u => u.bulan === currentMonth && u.tahun === currentYear),
    [uploadsArr, currentMonth, currentYear]
  );

  // Filtered list
  const filteredUploads = useMemo(() => {
    let result = uploadsArr;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        getBulanName(u.bulan).toLowerCase().includes(q) ||
        u.file_name?.toLowerCase().includes(q) ||
        String(u.tahun).includes(q)
      );
    }
    
    if (statusFilter !== 'all') {
      if (statusFilter === 'rejected') {
        result = result.filter(u => u.status === 'rejected' || u.status === 'revision_required');
      } else {
        result = result.filter(u => u.status === statusFilter);
      }
    }
    
    // Sort
    return [...result].sort((a, b) => {
      // Prioritize tahun, then bulan
      const valA = (a.tahun * 100) + a.bulan;
      const valB = (b.tahun * 100) + b.bulan;
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [uploadsArr, searchQuery, sortOrder, statusFilter]);

  // Hero: status CKP bulan berjalan → kata sorotan + ajakan yang relevan
  const hero = useMemo((): {
    status: HeroStatus;
    description: string;
    note?: string;
    cta: { href: Route; label: string };
  } => {
    const periode = `${getBulanName(currentMonth)} ${currentYear}`;
    const otherRevisions = uniqueUploads.filter(
      u => (u.status === 'rejected' || u.status === 'revision_required') && u !== currentMonthUpload
    ).length;
    const note = otherRevisions > 0 ? `${otherRevisions} CKP bulan lain perlu revisi` : undefined;

    if (!currentMonthUpload) {
      return {
        status: 'missing',
        description: `Periode ${periode}.`,
        note,
        cta: { href: '/pegawai/upload', label: 'Upload CKP' },
      };
    }

    const u = currentMonthUpload;
    const detail = `/pegawai/ckp/${u.id}` as Route;
    const ringkas = [
      u.total_entries ? `${u.total_entries} kegiatan` : null,
      u.avg_progres != null ? `progres ${Math.round(u.avg_progres)}%` : null,
    ].filter(Boolean).join(' · ');

    switch (u.status) {
      case 'approved':
        return { status: 'done', description: ringkas, note, cta: { href: detail, label: 'Lihat CKP' } };
      case 'scored':
        return { status: 'scored', description: `${ringkas} · menunggu persetujuan`, note, cta: { href: detail, label: 'Lihat nilai' } };
      case 'submitted':
        return { status: 'waiting', description: ringkas, note, cta: { href: detail, label: 'Lihat CKP' } };
      case 'rejected':
      case 'revision_required':
        return { status: 'revision', description: `${ringkas} · ada catatan penilai`, note, cta: { href: detail, label: 'Perbaiki CKP' } };
      default:
        return { status: 'draft', description: ringkas, note, cta: { href: detail, label: 'Lanjutkan' } };
    }
  }, [currentMonthUpload, uniqueUploads, currentMonth, currentYear]);

  // KPI cards config
  const kpiCards = [
    { icon: <FileText size={18} style={{ color: 'var(--primary)' }} />, value: stats.total, label: 'Total Upload', sub: 'semua periode', iconBg: 'var(--primary-soft)' },
    { icon: <TrendingUp size={18} style={{ color: 'var(--success)' }} />, value: `${stats.avgProgres}%`, label: 'Rata-rata Progres', sub: 'semua kegiatan', iconBg: 'var(--success-soft)' },
    { icon: <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />, value: stats.approved, label: 'Disetujui', sub: `dari ${stats.totalPeriods} upload`, iconBg: 'var(--success-soft)' },
    { icon: <Clock size={18} style={{ color: 'var(--warning)' }} />, value: stats.pending, label: 'Menunggu Review', sub: 'belum diproses', iconBg: 'var(--warning-soft)' },
  ];

  const error = queryError ? queryError.message : null;

  // Only show full-screen error if we have NO data to display at all.
  // If we have hydrated data but a background refetch failed, keep showing the data.
  if (error && !isLoading && uploadsArr.length === 0) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-md mx-auto text-center py-24">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
               style={{ background: 'var(--sand-subtle)' }}>
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

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 space-y-6 page-enter">

        {/* ── Hero status CKP bulan ini ─────────────── */}
        <StatusHero
          title={`CKP ${getBulanName(currentMonth)}`}
          status={hero.status}
          description={hero.description}
          note={hero.note}
          cta={hero.cta}
          loading={isLoading}
        />

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
              <h3 className="text-[22px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
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

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-btn appearance-none pr-8 bg-transparent"
                  style={{ outline: 'none', cursor: 'pointer' }}
                >
                  <option value="all">Semua Status</option>
                  <option value="submitted">Menunggu Review</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak / Revisi</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
              </div>

              {/* Sort */}
              <button 
                className="filter-btn" 
                aria-label="Urutkan"
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              >
                <ArrowUpDown size={13} />
                <span className="hidden sm:inline">Urutkan {sortOrder === 'desc' ? '(Terbaru)' : '(Terlama)'}</span>
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
            <EmptyState
              className="rounded-[22px] py-14"
              illustration={searchQuery || statusFilter !== 'all' ? 'search' : 'empty'}
              title={searchQuery || statusFilter !== 'all' ? 'Tidak ada yang cocok' : 'Belum ada CKP'}
              description={
                searchQuery || statusFilter !== 'all'
                  ? 'Coba kata kunci atau filter status lain.'
                  : 'Unggah CKP bulanan pertama Anda untuk mulai dinilai.'
              }
              action={
                !searchQuery && statusFilter === 'all' ? (
                  <Link href="/pegawai/upload" prefetch={true} className="btn-primary">
                    Upload CKP
                  </Link>
                ) : undefined
              }
            />
          ) : viewMode === 'list' ? (
            /* `key` memaksa remount saat mode berubah → animasi stagger
               ikut diputar ulang, jadi perpindahan list ⇄ grid terasa
               "mengalir", bukan sekadar bertukar tata letak. */
            <div key="list" className="space-y-3 card-list">
              {filteredUploads.map((upload) => (
                <ActivityCard key={upload.id} upload={upload} onDeleteSuccess={() => handleDeleteSuccess(upload.id)} />
              ))}
            </div>
          ) : (
            <div key="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 card-list">
              {filteredUploads.map((upload) => (
                <ActivityGridCard key={upload.id} upload={upload} onDeleteSuccess={() => handleDeleteSuccess(upload.id)} />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}