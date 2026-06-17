"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { getBulanName, formatDateTime } from '@/lib/utils';
import type { CKPUpload } from '@/types/database';
import {
  FileText, TrendingUp, CheckCircle2, Folder, Clock, Users, Plus, AlertTriangle, XCircle, Search,
  ArrowUpDown, LayoutList, LayoutGrid, ChevronDown,
  ChevronUp, ArrowRight, Upload, FileCheck, WifiOff, RefreshCw,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const supabase = useMemo(() => createClient(), []);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: uploads = [], isPending: queryPending, error: queryError, refetch } = useQuery({
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
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Supabase request timeout')), 4000))
        ]);

        if (error) throw new Error(error.message);
        return data as CKPUpload[];
      } finally {
        clearTimeout(timeoutId);
      }
    },
    enabled: !!user && !authLoading,
    networkMode: 'always',
  });

  // FIX: In React Query v5, isPending is TRUE even when query is disabled (enabled=false).
  // Only show loading when auth is done AND query is actually running.
  // Matches pimpinan/page.tsx pattern exactly.
  const isLoading = authLoading || (!!user && queryPending);

  // Failsafe: if genuinely stuck after auth resolved, force reload
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!authLoading && queryPending) {
      timeout = setTimeout(() => {
        console.warn('Failsafe triggered: stuck in loading state after auth resolved');
        window.location.reload();
      }, 12000);
    }
    return () => clearTimeout(timeout);
  }, [authLoading, queryPending]);

  // Only consider the latest upload per period (bulan-tahun)
  const uniqueUploads = useMemo(() => {
    const seen = new Set<string>();
    return uploads.filter(u => {
      const key = `${u.bulan}-${u.tahun}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [uploads]);

  // Stats
  const stats = useMemo(() => ({
    total: uploads.length, // keep total as historical count
    approved: uniqueUploads.filter(u => u.status === 'approved').length,
    pending: uniqueUploads.filter(u => u.status === 'submitted').length,
    rejected: uniqueUploads.filter(u => u.status === 'rejected' || u.status === 'revision_required').length,
    avgProgres: uniqueUploads.length
      ? (uniqueUploads.reduce((s, u) => s + (u.avg_progres || 0), 0) / uniqueUploads.length).toFixed(0)
      : '0',
    totalKegiatan: uniqueUploads.reduce((s, u) => s + (u.total_entries || 0), 0),
  }), [uploads, uniqueUploads]);

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

  // KPI cards config
  const kpiCards = [
    { icon: <FileText size={18} style={{ color: "#2563EB" }} />, value: stats.total, label: 'Total Upload', sub: 'semua periode', iconBg: '#EFF6FF' },
    { icon: <TrendingUp size={18} style={{ color: "#16A34A" }} />, value: `${stats.avgProgres}%`, label: 'Rata-rata Progres', sub: 'semua kegiatan', iconBg: '#F0FDF4' },
    { icon: <CheckCircle2 size={18} style={{ color: "#059669" }} />, value: stats.approved, label: 'Disetujui', sub: `dari ${stats.total} upload`, iconBg: '#F0FDF4' },
    { icon: <Clock size={18} style={{ color: "#D97706" }} />, value: stats.pending, label: 'Menunggu Review', sub: 'belum diproses', iconBg: '#FFFBEB' },
  ];

  const error = queryError ? queryError.message : null;

  if (error && !isLoading) {
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