"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { PeriodFilter } from '@/components/dashboard/period-filter';
import { Skeleton } from '@/components/ui/skeleton';
import { getBulanName } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Users, Clock, CheckCircle2, Search,
  RefreshCw, Download, WifiOff, ArrowRight, TrendingUp, FileText, CheckCircle
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/kpi-card';

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
        if (!user) return { rks: [], uploads: [], entries: [], users: [] };

        // 1. Get RKs for this ketua tim
        const { data: mappingData, error: mapError } = await supabase
          .from('rk_ketua_tim_mapping')
          .select('*')
          .eq('ketua_tim_id', user.id)
          .abortSignal(controller.signal);
        
        if (mapError) throw mapError;
        
        if (!mappingData || mappingData.length === 0) {
          return { rks: [], uploads: [], entries: [], users: [] };
        }
        
        const rkNames = mappingData.map((m: any) => m.rencana_kinerja);
        
        // 2. Get uploads for the selected month that are submitted or approved
        const { data: uploadsData, error: uploadsError } = await supabase
          .from('ckp_uploads')
          .select('id, user_id, status, uploaded_at')
          .eq('bulan', qBulan)
          .eq('tahun', qTahun)
          .in('status', ['submitted', 'approved', 'revision_required'])
          .abortSignal(controller.signal);
          
        if (uploadsError) throw uploadsError;
        const uploadIds = uploadsData?.map((u: any) => u.id) || [];
        
        if (uploadIds.length === 0) {
          return { rks: mappingData, uploads: [], entries: [], users: [] };
        }
        
        // 3. Get entries for these uploads that match the RKs
        const { data: entriesData, error: entriesError } = await supabase
          .from('ckp_entries')
          .select('*')
          .in('upload_id', uploadIds)
          .in('rencana_kinerja', rkNames)
          .abortSignal(controller.signal);
          
        if (entriesError) throw entriesError;
        
        const relevantUploadIds = new Set((entriesData || []).map((e: any) => e.upload_id));
        const relevantUploads = (uploadsData || []).filter((u: any) => relevantUploadIds.has(u.id));
        const relevantUserIds = Array.from(new Set(relevantUploads.map((u: any) => u.user_id)));
        
        let usersData: any[] = [];
        if (relevantUserIds.length > 0) {
          const { data: uData, error: uError } = await supabase
            .from('users')
            .select('*')
            .in('id', relevantUserIds)
            .abortSignal(controller.signal);
          if (uError) throw uError;
          usersData = uData || [];
        }

        return {
          rks: mappingData,
          uploads: relevantUploads,
          entries: entriesData || [],
          users: usersData,
        };
      } finally {
        clearTimeout(timeoutId);
      }
    },
    enabled: !!user && !authLoading,
    networkMode: 'always',
    staleTime: 1000 * 60 * 5,
  });

  const loading = authLoading || queryPending;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!authLoading && queryPending) {
      timeout = setTimeout(() => {
        void refetch();
      }, 10000);
    }
    return () => clearTimeout(timeout);
  }, [authLoading, queryPending, refetch]);

  const rks = data?.rks || [];
  const entries = data?.entries || [];
  const uploads = data?.uploads || [];
  const error = queryError ? queryError.message : null;

  // Process data for RK Cards
  const rkStats = useMemo(() => {
    return rks.map((rk: any) => {
      const rkEntries = entries.filter((e: any) => e.rencana_kinerja === rk.rencana_kinerja);
      const uniquePegawaiIds = new Set(
        rkEntries.map((e: any) => {
          const upload = uploads.find((u: any) => u.id === e.upload_id);
          return upload?.user_id;
        }).filter(Boolean)
      );
      
      const evaluatedEntries = rkEntries.filter((e: any) => e.nilai !== null);
      const allEvaluated = rkEntries.length > 0 && evaluatedEntries.length === rkEntries.length;
      
      const avgProgress = rkEntries.length > 0 
        ? rkEntries.reduce((acc: number, curr: any) => acc + (curr.progres || 0), 0) / rkEntries.length 
        : 0;

      const avgScore = evaluatedEntries.length > 0
        ? evaluatedEntries.reduce((acc: number, curr: any) => acc + (curr.nilai || 0), 0) / evaluatedEntries.length
        : null;

      return {
        ...rk,
        totalEntries: rkEntries.length,
        totalPegawai: uniquePegawaiIds.size,
        evaluatedEntries: evaluatedEntries.length,
        allEvaluated,
        avgProgress: Math.min(100, avgProgress),
        avgScore
      };
    });
  }, [rks, entries, uploads]);

  const filteredRKs = useMemo(() => {
    if (!searchQuery.trim()) return rkStats;
    const q = searchQuery.toLowerCase();
    return rkStats.filter((rk: any) =>
      rk.rencana_kinerja?.toLowerCase().includes(q) ||
      rk.tim_kerja?.toLowerCase().includes(q)
    );
  }, [rkStats, searchQuery]);

  // Overall KPIs
  const totalRKs = rkStats.length;
  const activeRKs = rkStats.filter((rk: any) => rk.totalEntries > 0).length;
  const pendingRKs = rkStats.filter((rk: any) => rk.totalEntries > 0 && !rk.allEvaluated).length;
  const avgOverallProgress = activeRKs > 0 ? rkStats.reduce((s: number, rk: any) => s + rk.avgProgress, 0) / activeRKs : 0;

  if (error && !loading && rks.length === 0) {
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
      <Header pendingCount={0} />
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
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={<FileText size={18} style={{ color: 'var(--primary)' }} />} value={totalRKs} label="Total Rencana Kinerja" sub="Tanggung jawab Anda" iconBg="var(--primary-soft)" loading={loading} />
          <KPICard icon={<Users size={18} style={{ color: 'var(--success)' }} />} value={activeRKs} label="RK Aktif" sub="Ada laporan bulan ini" iconBg="var(--success-soft)" loading={loading} />
          <KPICard icon={<Clock size={18} style={{ color: 'var(--warning)' }} />} value={pendingRKs} label="Menunggu Nilai" sub="RK belum dinilai penuh" iconBg="var(--warning-soft)" loading={loading} />
          <KPICard icon={<TrendingUp size={18} style={{ color: 'var(--primary)' }} />} value={`${avgOverallProgress.toFixed(0)}%`} label="Rata-rata Capaian" sub="Seluruh RK aktif" iconBg="var(--primary-soft)" loading={loading} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Daftar Rencana Kinerja</h3>
              <p className="text-xs text-slate-400 mt-0.5">{filteredRKs.length} RK ditampilkan</p>
            </div>
          </div>

          <div className="relative mb-4 max-w-xs md:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input type="search" placeholder="Cari RK..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 h-9 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
            </div>
          ) : filteredRKs.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FileText className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-slate-600">Tidak ada Rencana Kinerja ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRKs.map((rk: any) => (
                <div key={rk.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: rk.totalEntries === 0 ? '#E2E8F0' : rk.allEvaluated ? '#10B981' : '#F59E0B' }} />
                  
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {rk.tim_kerja || 'Tim Kerja'}
                    </p>
                    {rk.totalEntries > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${rk.allEvaluated ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {rk.allEvaluated ? 'Selesai Dinilai' : 'Perlu Dinilai'}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-bold text-slate-800 mb-4 line-clamp-2" title={rk.rencana_kinerja}>
                    {rk.rencana_kinerja}
                  </h4>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400">Pegawai</span>
                        <span className="text-sm font-semibold text-slate-700">{rk.totalPegawai}</span>
                      </div>
                      <div className="w-px bg-slate-100" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400">Kegiatan</span>
                        <span className="text-sm font-semibold text-slate-700">{rk.totalEntries}</span>
                      </div>
                      <div className="w-px bg-slate-100" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400">Rata2 Nilai</span>
                        <span className="text-sm font-semibold text-slate-700">{rk.avgScore !== null ? rk.avgScore.toFixed(1) : '-'}</span>
                      </div>
                    </div>
                    
                    <Link href={`/ketua_tim/rk/${rk.id}?bulan=${bulan}&tahun=${tahun}`} className="p-2 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
