"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { StatCard } from '@/components/dashboard/stat-card';
import { PeriodFilter } from '@/components/dashboard/period-filter';
import { Skeleton } from '@/components/ui/skeleton';
import { getBulanName } from '@/lib/utils';
import { exportRekapToExcel } from '@/lib/excel/exporter';
import type { CKPUpload, UploadStatus, User } from '@/types/database';
import { toast } from 'sonner';
import {
  Users,
  FileCheck,
  Clock,
  CheckCircle2,
  Search,
  RefreshCw,
  Download,
  WifiOff,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

// ─── Tipe gabungan pegawai + upload ───────────────────────
interface PegawaiRow {
  user: User;
  upload: (CKPUpload & { user?: User }) | null;
}

// ─── Avatar gradient elegan (berdasarkan nama) ───────────
// Setiap orang mendapat gradient berbeda dari palet yang hangat
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #b45309 0%, #78716c 50%, #475569 100%)',
  'linear-gradient(135deg, #0f766e 0%, #0369a1 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
  'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
  'linear-gradient(135deg, #1d4ed8 0%, #0e7490 100%)',
  'linear-gradient(135deg, #15803d 0%, #0f766e 100%)',
  'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
  'linear-gradient(135deg, #6d28d9 0%, #be185d 100%)',
];
function getAvatarGradient(name: string): string {
  const idx = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

// ─── Status label mini ────────────────────────────────────
function StatusLabel({ status }: { status: UploadStatus | null }) {
  if (!status) {
    return (
      <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
        Belum Lapor
      </span>
    );
  }
  const map: Record<UploadStatus, { label: string; cls: string }> = {
    draft:            { label: 'Draft',          cls: 'text-slate-500 bg-slate-100' },
    submitted:        { label: 'Menunggu Review', cls: 'text-amber-700 bg-amber-50' },
    approved:         { label: 'Disetujui',       cls: 'text-emerald-700 bg-emerald-50' },
    rejected:         { label: 'Ditolak',         cls: 'text-red-600 bg-red-50' },
    revision_required:{ label: 'Perlu Revisi',    cls: 'text-orange-700 bg-orange-50' },
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

// ─── Kartu pegawai ─────────────────────────────────────────
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

  return (
    <div className="pegawai-card p-5 flex flex-col gap-4">
      {/* Header kartu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            style={{ background: getAvatarGradient(user.full_name) }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 text-sm leading-snug truncate">{user.full_name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{user.nip || '—'}</p>
          </div>
        </div>
        <StatusLabel status={upload?.status ?? null} />
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-semibold text-slate-800">{totalEntries}</p>
          <p className="text-[11px] text-slate-400">Kegiatan</p>
        </div>
        <div>
          <p className={`text-lg font-semibold ${hasUpload ? (avgProgres >= 80 ? 'text-emerald-600' : avgProgres >= 50 ? 'text-amber-600' : 'text-slate-800') : 'text-slate-400'}`}>
            {hasUpload ? `${avgProgres.toFixed(0)}%` : '0%'}
          </p>
          <p className="text-[11px] text-slate-400">Capaian</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-800">
            {hasUpload ? avgProgres.toFixed(0) : '—'}
          </p>
          <p className="text-[11px] text-slate-400">Skor</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full progress-bar"
          style={{ width: `${Math.min(avgProgres, 100)}%`, backgroundColor: barColor }}
        />
      </div>

      {/* Tombol detail */}
      {hasUpload ? (
        <Link
          href={`/pimpinan/ckp/${upload!.id}`}
          className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg py-2 transition-colors hover:bg-slate-50"
        >
          Lihat Detail Log <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-slate-300 border border-slate-100 rounded-lg py-2 cursor-not-allowed"
          aria-disabled="true"
        >
          Belum ada data
        </button>
      )}
    </div>
  );
}

// ─── Skeleton kartu ───────────────────────────────────────
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
      <Skeleton className="h-1 rounded-full" />
      <Skeleton className="h-9 rounded-lg" />
    </div>
  );
}

// ─── Completion Rate Widget ───────────────────────────────
function CompletionWidget({ uploaded, total }: { uploaded: number; total: number }) {
  const pct = total > 0 ? Math.round((uploaded / total) * 100) : 0;
  const r = 18;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;
  const strokeColor = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#3b82f6';

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Tingkat Pelaporan</p>
          <p className="text-2xl font-semibold text-slate-800 tabular-nums">
            {uploaded}<span className="text-base font-normal text-slate-400"> / {total}</span>
          </p>
          <p className="text-xs text-slate-400">pegawai upload bulan ini</p>
        </div>
        <div className="relative flex-shrink-0">
          <svg width="44" height="44" className="-rotate-90">
            <circle cx="22" cy="22" r={r} fill="none" stroke="#f1f5f9" strokeWidth="4" />
            <circle
              cx="22" cy="22" r={r} fill="none"
              stroke={strokeColor}
              strokeWidth="4"
              strokeDasharray={`${dash} ${circumference}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700">
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman utama ─────────────────────────────────────────
export default function PimpinanDashboard() {
  const supabase = useMemo(() => createClient(), []);

  const [uploads, setUploads] = useState<(CKPUpload & { user?: User })[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [bulan, setBulan] = useState(currentMonth);
  const [tahun, setTahun] = useState(currentYear);

  const isCurrentPeriod = bulan === currentMonth && tahun === currentYear;

  // Fetch data
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
      if (usersRes.error) throw new Error(`Gagal memuat data pegawai: ${usersRes.error.message}`);

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

  // Gabungkan pegawai + upload
  const pegawaiRows = useMemo((): PegawaiRow[] => {
    return allUsers.map(user => {
      const upload = uploads.find(u => u.user_id === user.id) ?? null;
      return { user, upload };
    });
  }, [allUsers, uploads]);

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

  // Stats summary
  const totalPegawai = allUsers.length;
  const uploadedCount = uploads.length;
  const pendingCount = uploads.filter(u => u.status === 'submitted').length;
  const approvedCount = uploads.filter(u => u.status === 'approved').length;
  const avgCapaian = uploads.length > 0
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
        <Header showSearch pendingCount={0} />
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

  // ── Main render ───────────────────────────────────────────
  return (
    <>
      <Header showSearch pendingCount={pendingCount} onSearch={setSearchQuery} />
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in">

        {/* Judul + kontrol */}
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
              bulan={bulan}
              tahun={tahun}
              onBulanChange={setBulan}
              onTahunChange={setTahun}
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

        {/* Stat cards — uniform 5-col grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <CompletionWidget uploaded={uploadedCount} total={totalPegawai} />
          <StatCard
            title="Total Pegawai"
            value={totalPegawai}
            subtitle="Pegawai aktif"
            icon={Users}
            color="blue"
            loading={loading}
          />
          <StatCard
            title="Menunggu Review"
            value={pendingCount}
            subtitle="Perlu diproses"
            icon={Clock}
            color="amber"
            loading={loading}
          />
          <StatCard
            title="Disetujui"
            value={approvedCount}
            subtitle="Bulan ini"
            icon={CheckCircle2}
            color="emerald"
            loading={loading}
          />
          <StatCard
            title="Rata-rata Capaian"
            value={`${avgCapaian}%`}
            subtitle="Tim bulan ini"
            icon={TrendingUp}
            color="purple"
            loading={loading}
          />
        </div>

        {/* Section rekap per pegawai */}
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

          {/* Search (page-level only on mobile; header search handles desktop) */}
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

          {/* Grid kartu */}
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
