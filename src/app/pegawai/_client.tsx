"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { getBulanName, formatDateTime } from '@/lib/utils';
import type { CKPUpload } from '@/types/database';
import {
  FileText, TrendingUp, CheckCircle2, Folder, Clock, Users, Plus, AlertTriangle, XCircle, Search,
  ArrowUpDown, LayoutList, LayoutGrid, ChevronDown,
  ChevronUp, ArrowRight, Upload, FileCheck, WifiOff, RefreshCw, Trash2, Info
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
import { StatusBadge } from '@/components/dashboard/status-badge';
import { ActivityCard, ActivityCardSkeleton, type ActivityCardProps } from '@/components/dashboard/activity-card';
import { deleteCkpUploadAction } from '@/app/actions/ckp';
import { toast } from 'sonner';

// ── Grid card (alternate view) ─────────────────────────────
function ActivityGridCard({ upload, onDeleteSuccess }: ActivityCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const pct = Math.min(upload.avg_progres || 0, 100);
  const progressClass = getProgressClass(pct);
  const canDelete = upload.status !== 'approved';

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation if wrapped in link or similar
    if (!window.confirm('Apakah Anda yakin ingin menghapus data CKP ini? Semua entri kegiatan akan ikut terhapus.')) {
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
        toast.error(res.error || 'Gagal menghapus', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan', { id: toastId });
    } finally {
      setIsDeleting(false);
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
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          <div className={`h-full rounded-full progress-bar ${progressClass}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Link
          href={`/pegawai/ckp/${upload.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-200"
          style={{ background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid rgba(0,113,227,0.08)' }}
        >
          Lihat Detail <ArrowRight size={13} />
        </Link>
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Hapus CKP"
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 disabled:opacity-50"
            style={{ color: 'var(--danger)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--danger-soft)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <Trash2 size={15} />
          </button>
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
  const supabase = useMemo(() => createClient(), []);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: uploads, isPending: queryPending, error: queryError, refetch } = useQuery({
    queryKey: ['pegawai-uploads', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const queryPromise = supabase
          .from('ckp_uploads')
          .select('*')
          .eq('user_id', user.id)
          .order('tahun', { ascending: false })
          .order('bulan', { ascending: false })
          .order('uploaded_at', { ascending: false })
          .abortSignal(controller.signal);

        const { data, error } = await Promise.race([
          queryPromise,
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Supabase request took too long')), 15000))
        ]);

        if (error) throw new Error(error.message);
        return data as CKPUpload[];
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
  // With keepPreviousData, `uploads` will be the previous fetch result (not undefined)
  // during background refetch — so this only returns true on the very first load.
  const isLoading = authLoading || (!uploads && queryPending);

  // Safe array for all downstream usage
  const uploadsArr: CKPUpload[] = uploads ?? [];

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
  const stats = useMemo(() => ({
    total: uploadsArr.length, // keep total as historical count
    approved: uniqueUploads.filter(u => u.status === 'approved').length,
    pending: uniqueUploads.filter(u => u.status === 'submitted').length,
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

  // KPI cards config
  const kpiCards = [
    { icon: <FileText size={18} style={{ color: 'var(--primary)' }} />, value: stats.total, label: 'Total Upload', sub: 'semua periode', iconBg: 'var(--primary-soft)' },
    { icon: <TrendingUp size={18} style={{ color: 'var(--success)' }} />, value: `${stats.avgProgres}%`, label: 'Rata-rata Progres', sub: 'semua kegiatan', iconBg: 'var(--success-soft)' },
    { icon: <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />, value: stats.approved, label: 'Disetujui', sub: `dari ${stats.total} upload`, iconBg: 'var(--success-soft)' },
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

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 space-y-6 animate-fade-in">

        {/* ── Page hero ─────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Halo, {user?.full_name?.split(' ')[0] || 'Pegawai'}
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
            className="flex items-center gap-3 p-4 rounded-2xl animate-fade-in"
            style={{ background: 'var(--primary-soft)', border: '1px solid rgba(0,113,227,0.06)' }}
            role="alert"
          >
            <div className="flex-shrink-0 p-2 rounded-xl"
                 style={{ background: 'var(--card-bg)' }}>
              <Info size={16} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px]" style={{ color: 'var(--primary)' }}>
                <span className="font-semibold">CKP {getBulanName(currentMonth)} {currentYear} Belum Diupload</span>
                <span className="hidden sm:inline"> — Silakan lengkapi laporan Anda bulan ini.</span>
              </p>
            </div>
          </div>
        )}

        {!isLoading && stats.rejected > 0 && (
          <div
            className="flex items-center gap-3 p-4 rounded-2xl animate-fade-in"
            style={{ background: 'var(--danger-soft)', border: '1px solid rgba(255,59,48,0.06)' }}
            role="alert"
          >
            <div className="flex-shrink-0 p-2 rounded-xl"
                 style={{ background: 'var(--card-bg)' }}>
              <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px]" style={{ color: 'var(--danger)' }}>
                <span className="font-semibold">{stats.rejected} CKP Perlu Revisi</span>
                <span className="hidden sm:inline"> — Terdapat CKP yang ditolak atau perlu perbaikan.</span>
              </p>
            </div>
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
            <div
              className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
              style={{ background: 'var(--card-bg)', border: '1px dashed var(--border)' }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <Folder size={28} style={{ color: 'var(--text-tertiary)' }} />
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
                <ActivityCard key={upload.id} upload={upload} onDeleteSuccess={() => refetch()} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 card-list">
              {filteredUploads.map((upload) => (
                <ActivityGridCard key={upload.id} upload={upload} onDeleteSuccess={() => refetch()} />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}