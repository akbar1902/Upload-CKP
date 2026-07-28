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
  const [filterStatus, setFilterStatus] = useState('semua');

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
    let result = rkStats;
    
    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((rk: any) =>
        rk.rencana_kinerja?.toLowerCase().includes(q) ||
        rk.tim_kerja?.toLowerCase().includes(q)
      );
    }
    
    // 2. Status Filter
    if (filterStatus !== 'semua') {
      result = result.filter((rk: any) => {
        if (filterStatus === 'perlu_dinilai') return rk.totalEntries > 0 && !rk.allEvaluated;
        if (filterStatus === 'selesai') return rk.totalEntries > 0 && rk.allEvaluated;
        if (filterStatus === 'belum_ada') return rk.totalEntries === 0;
        return true;
      });
    }

    // 3. Sorting
    // Priority 1: Perlu dinilai (un-evaluated) first
    // Priority 2: Higher number of totalPegawai
    return result.sort((a: any, b: any) => {
      const aPending = a.totalEntries > 0 && !a.allEvaluated;
      const bPending = b.totalEntries > 0 && !b.allEvaluated;
      
      if (aPending && !bPending) return -1;
      if (!aPending && bPending) return 1;
      
      return b.totalPegawai - a.totalPegawai;
    });
  }, [rkStats, searchQuery, filterStatus]);

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

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="search" 
                  placeholder="Cari Rencana Kinerja atau Tim Kerja..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="w-full pl-9 h-10 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" 
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 text-sm bg-white border border-slate-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium shadow-sm w-full md:w-auto"
              >
                <option value="semua">Semua Status</option>
                <option value="perlu_dinilai">Perlu Dinilai</option>
                <option value="selesai">Selesai Dinilai</option>
                <option value="belum_ada">Belum Ada Laporan</option>
              </select>
            </div>
            
            <div className="w-full">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(`/ketua_tim/rk/${e.target.value}?bulan=${bulan}&tahun=${tahun}`);
                  }
                }}
                className="w-full h-10 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 shadow-sm"
              >
                <option value="">🚀 Lompat Cepat ke Rencana Kinerja...</option>
                {rkStats.map((rk: any) => (
                  <option key={`jump-${rk.id}`} value={rk.id}>
                    {rk.rencana_kinerja}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
            </div>
          ) : filteredRKs.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-base font-semibold text-slate-700">Tidak ada Rencana Kinerja ditemukan</p>
              <p className="text-sm text-slate-400 mt-1">Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRKs.map((rk: any) => (
                <Link key={rk.id} href={`/ketua_tim/rk/${rk.id}?bulan=${bulan}&tahun=${tahun}`} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col h-full hover:border-[var(--primary)] cursor-pointer block">
                  <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${rk.totalEntries === 0 ? 'bg-slate-200' : rk.allEvaluated ? 'bg-[var(--primary)]' : 'bg-slate-400'}`} />
                  
                  <div className="flex justify-between items-start mb-3 pl-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <Users size={12} /> {rk.tim_kerja || 'Tim Kerja'}
                    </span>
                    {rk.totalEntries > 0 && (
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold shadow-sm ${rk.allEvaluated ? 'bg-[var(--primary-soft)] text-[var(--primary)] ring-1 ring-[var(--primary)]/20' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}>
                        {rk.allEvaluated ? 'Selesai Dinilai' : 'Perlu Dinilai'}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-[15px] font-extrabold text-slate-800 mb-5 pl-2 leading-relaxed group-hover:text-[var(--primary)] transition-colors" title={rk.rencana_kinerja}>
                    {rk.rencana_kinerja}
                  </h4>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 pl-2">
                    <div className="flex gap-4 sm:gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Pegawai</span>
                        <span className="text-[15px] font-black text-slate-700 flex items-center gap-1.5">
                          {rk.totalPegawai} <Users size={12} className="text-slate-300" />
                        </span>
                      </div>
                      <div className="w-px bg-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Kegiatan</span>
                        <span className="text-[15px] font-black text-slate-700">{rk.totalEntries}</span>
                      </div>
                      <div className="w-px bg-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Rata2 Nilai</span>
                        <span className={`text-[15px] font-black ${rk.avgScore !== null ? 'text-[var(--primary)]' : 'text-slate-300'}`}>
                          {rk.avgScore !== null ? rk.avgScore.toFixed(1) : '-'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[var(--primary)] group-hover:text-white group-hover:shadow-md transition-all duration-300 transform group-hover:translate-x-1">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
