"use client";

import React, { useEffect, useState, useMemo } from 'react';
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
import type { CKPUpload, User } from '@/types/database';
import { toast } from 'sonner';
import {
  Users, Clock, CheckCircle2, Search,
  RefreshCw, Download, WifiOff, ArrowRight, TrendingUp,
} from 'lucide-react';

import { KPICard } from '@/components/dashboard/kpi-card';
import { PegawaiCard, PegawaiCardSkeleton, type PegawaiRow } from '@/components/dashboard/pegawai-card';

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

export default function KetuaTimDashboardClient() {
  const supabase = useMemo(() => createClient(), []);
  const { user, loading: authLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

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
    queryKey: ['ketua-tim-uploads', bulan, tahun],
    queryFn: async ({ queryKey }) => {
      const [_key, qBulan, qTahun] = queryKey as [string, number, number];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        if (!user) return { uploads: [], users: [] };

        // 1. Get RKs for this ketua tim
        const { data: mappingData, error: mapError } = await supabase
          .from('rk_ketua_tim_mapping')
          .select('rencana_kinerja')
          .eq('ketua_tim_id', user.id)
          .abortSignal(controller.signal);
        
        if (mapError) throw mapError;
        const rkList = mappingData?.map((m: any) => m.rencana_kinerja) || [];

        if (rkList.length === 0) return { uploads: [], users: [] };

        // 2. Find ALL upload_ids that have EVER contained these RKs to identify Team Members
        const { data: entries, error: entriesError } = await supabase
          .from('ckp_entries')
          .select('upload_id')
          .in('rencana_kinerja', rkList)
          .abortSignal(controller.signal);

        if (entriesError) throw entriesError;
        const allUploadIds = Array.from(new Set((entries || []).map((e: any) => e.upload_id)));

        let teamUserIds: string[] = [];
        if (allUploadIds.length > 0) {
          // Get the user_ids of these uploads
          const { data: allUploadsData, error: allUploadsError } = await supabase
            .from('ckp_uploads')
            .select('user_id')
            .in('id', allUploadIds)
            .abortSignal(controller.signal);
          
          if (allUploadsError) throw allUploadsError;
          teamUserIds = Array.from(new Set((allUploadsData || []).map((u: any) => u.user_id)));
        }

        if (teamUserIds.length === 0) return { uploads: [], users: [] };

        // 3. Get the user details of these team members
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .in('id', teamUserIds)
          .order('full_name')
          .abortSignal(controller.signal);
          
        if (usersError) throw usersError;

        // 4. Get the uploads for these team members for the SELECTED month and year
        const { data: monthUploads, error: monthUploadsError } = await supabase
          .from('ckp_uploads')
          .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
          .in('user_id', teamUserIds)
          .eq('bulan', qBulan)
          .eq('tahun', qTahun)
          .order('uploaded_at', { ascending: false })
          .abortSignal(controller.signal);

        if (monthUploadsError) throw monthUploadsError;

        const newUploads = (monthUploads || []).map((u: any) => ({
          ...u,
          user: u.user as User | undefined,
        })) as (CKPUpload & { user?: User })[];

        return { uploads: newUploads, users: usersData as User[] };
      } finally {
        clearTimeout(timeoutId);
      }
    },
    enabled: !!user && !authLoading,
    networkMode: 'always',
    staleTime: 1000 * 60 * 5,
  });

  const loading = authLoading || queryPending;

  // Failsafe: if genuinely stuck for > 10s after auth resolved, retry query
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!authLoading && queryPending) {
      timeout = setTimeout(() => {
        console.warn('Failsafe triggered: retrying stuck query');
        void refetch();
      }, 10000);
    }
    return () => clearTimeout(timeout);
  }, [authLoading, queryPending, refetch]);

  const uploads = data?.uploads || [];
  const allUsers = data?.users || [];
  const error = queryError ? queryError.message : null;

  useEffect(() => {
    const channelName = `ketua-tim-${bulan}-${tahun}-${user?.id}`;
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
  }, [supabase, bulan, tahun, refetch, user?.id]);

  const pegawaiRows = useMemo((): PegawaiRow[] =>
    allUsers.map(u => ({
      user: u,
      upload: uploads.find(up => up.user_id === u.id) ?? null,
    })),
    [allUsers, uploads]
  );

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return pegawaiRows;
    const q = searchQuery.toLowerCase();
    return pegawaiRows.filter(r =>
      r.user.full_name.toLowerCase().includes(q) ||
      (r.user.nip?.toLowerCase().includes(q)) ||
      (r.user.unit_kerja?.toLowerCase().includes(q))
    );
  }, [pegawaiRows, searchQuery]);

  const totalPegawai = allUsers.length;
  const uniqueUploads = useMemo(() => pegawaiRows.map(r => r.upload).filter((u): u is CKPUpload & { user?: User } => u !== null), [pegawaiRows]);
  const uploadedCount = uniqueUploads.length;
  const pendingCount = uniqueUploads.filter(u => u.status === 'submitted').length;
  const approvedCount = uniqueUploads.filter(u => u.status === 'approved').length;
  const avgCapaian = uniqueUploads.length > 0 ? Math.round(uniqueUploads.reduce((s, u) => s + (u.avg_progres || 0), 0) / uniqueUploads.length) : 0;

  const handleExportRekap = () => {
    exportRekapToExcel(uploads, bulan, tahun);
    toast.success('Rekap Excel berhasil diunduh');
  };

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
          <button onClick={() => refetch()} className="btn-primary">
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header pendingCount={pendingCount} showExport onExport={handleExportRekap} />
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Dashboard Ketua Tim</h2>
            <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-2">
              {getBulanName(bulan)} {tahun}
              {!isCurrentPeriod && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Filter aktif</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PeriodFilter bulan={bulan} tahun={tahun} onBulanChange={setBulan} onTahunChange={setTahun} />
            <button onClick={() => refetch()} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleExportRekap} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <CompletionWidget uploaded={uploadedCount} total={totalPegawai} loading={loading} />
          <KPICard icon={<Clock size={18} className="text-amber-600" />} value={pendingCount} label="Menunggu Review" sub="Perlu diproses" iconBg="#FFFBEB" loading={loading} />
          <KPICard icon={<CheckCircle2 size={18} className="text-green-600" />} value={approvedCount} label="Disetujui" sub="Bulan ini" iconBg="#F0FDF4" loading={loading} />
          <KPICard icon={<TrendingUp size={18} className="text-green-600" />} value={`${avgCapaian}%`} label="Rata-rata Capaian" sub="Tim bulan ini" iconBg="#F5F3FF" loading={loading} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Rekap Kegiatan Tim</h3>
              <p className="text-xs text-slate-400 mt-0.5">{filteredRows.length} anggota ditampilkan</p>
            </div>
          </div>

          <div className="relative mb-4 max-w-xs md:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input type="search" placeholder="Cari anggota..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 h-9 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <PegawaiCardSkeleton key={i} />)}
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-slate-600">Tidak ada anggota tim ditemukan</p>
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
