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
import * as XLSX from 'xlsx';
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
  const bulan: string | number = paramBulan && paramBulan.startsWith('T') ? paramBulan : (paramBulan ? parseInt(paramBulan) : currentMonth);
  const tahun = paramTahun ? parseInt(paramTahun) : currentYear;

  const isCurrentPeriod = bulan === currentMonth && tahun === currentYear;

  const setBulan = (b: string | number) => {
    router.push(`?bulan=${b}&tahun=${tahun}`);
  };

  const setTahun = (t: number) => {
    router.push(`?bulan=${bulan}&tahun=${t}`);
  };

  const { data, isPending: queryPending, error: queryError, refetch } = useQuery({
    queryKey: ['ketua-tim-uploads', bulan, tahun, user?.id, user?.role],
    queryFn: async ({ queryKey }) => {
      const [_key, qBulan, qTahun] = queryKey as [string, string | number, number];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        if (!user) return { rks: [], uploads: [], entries: [], users: [] };

        // 1. Get RKs
        let mappingQuery = supabase.from('rk_ketua_tim_mapping').select('*');
        if (user.role !== 'pimpinan' && user.role !== 'admin') {
          mappingQuery = mappingQuery.eq('ketua_tim_id', user.id);
        }
        
        const { data: mappingData, error: mapError } = await mappingQuery.abortSignal(controller.signal);

        if (mapError) throw mapError;

        if (!mappingData || mappingData.length === 0) {
          return { rks: [], uploads: [], entries: [], users: [], assignments: [] };
        }

        const rkIds = mappingData.map((m: any) => m.id);
        const rkNames = mappingData.map((m: any) => m.rencana_kinerja);

        // Fetch user assignments for these RKs (chunked to avoid URI Too Long)
        let assignmentsData: any[] = [];
        for (let i = 0; i < rkIds.length; i += 100) {
          const chunk = rkIds.slice(i, i + 100);
          const { data, error } = await supabase
            .from('user_rk_assignments')
            .select('user_id, rk_id')
            .in('rk_id', chunk)
            .abortSignal(controller.signal);
          if (error) throw error;
          if (data) assignmentsData.push(...data);
        }

        // 2. Get uploads for the selected month/period that are submitted or approved
        let uploadsQuery = supabase
          .from('ckp_uploads')
          .select('id, user_id, status, uploaded_at')
          .eq('tahun', qTahun)
          .in('status', ['submitted', 'approved', 'revision_required']);

        if (typeof qBulan === 'string' && qBulan.startsWith('T')) {
          const triwulanMap: Record<string, number[]> = {
            'T1': [1, 2, 3],
            'T2': [4, 5, 6],
            'T3': [7, 8, 9],
            'T4': [10, 11, 12]
          };
          uploadsQuery = uploadsQuery.in('bulan', triwulanMap[qBulan] || []);
        } else {
          uploadsQuery = uploadsQuery.eq('bulan', qBulan);
        }

        const { data: uploadsData, error: uploadsError } = await uploadsQuery.abortSignal(controller.signal);

        if (uploadsError) throw uploadsError;
        const uploadIds = uploadsData?.map((u: any) => u.id) || [];

        if (uploadIds.length === 0) {
          return { rks: mappingData, uploads: [], entries: [], users: [], assignments: assignmentsData || [] };
        }

        // 3. Get entries for these uploads (filter by RK names in memory to avoid URI Too Long)
        const { data: entriesData, error: entriesError } = await supabase
          .from('ckp_entries')
          .select('*')
          .in('upload_id', uploadIds)
          .abortSignal(controller.signal);

        if (entriesError) throw entriesError;
        
        const validRkNames = new Set(rkNames);
        const filteredEntriesData = (entriesData || []).filter((e: any) => validRkNames.has(e.rencana_kinerja));

        const relevantUploadIds = new Set(filteredEntriesData.map((e: any) => e.upload_id));
        
        // We don't filter out user.id here anymore, because we need Pimpinan's own upload if we are showing otherRks (Wait, no, if Pimpinan submits something for Team Belitung, it shouldn't show up in their dashboard anyway, but we will filter it in rkStats processing)
        const relevantUploads = (uploadsData || []).filter((u: any) => 
          relevantUploadIds.has(u.id)
        );
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
          entries: filteredEntriesData,
          users: usersData,
          assignments: assignmentsData || [],
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
  const assignments = data?.assignments || [];
  const error = queryError ? queryError.message : null;

  // Process data for RK Cards
  const rkStats = useMemo(() => {
    const displayRks = rks.filter((rk: any) => rk.ketua_tim_id === user?.id);
    
    return displayRks.map((rk: any) => {
      let rkEntries = entries.filter((e: any) => e.rencana_kinerja === rk.rencana_kinerja);
      
      const validKetuaTimIds = new Set(
         rks.filter((r: any) => r.rencana_kinerja === rk.rencana_kinerja).map((r: any) => r.ketua_tim_id).filter(Boolean)
      );
      
      const assignedUserIds = new Set(
        assignments.filter((a: any) => a.rk_id === rk.id).map((a: any) => a.user_id)
      );

      rkEntries = rkEntries.filter((e: any) => {
         const upload = uploads.find((u: any) => u.id === e.upload_id);
         if (!upload) return false;
         
         if (user?.role === 'pimpinan' || user?.role === 'admin') {
            return assignedUserIds.has(upload.user_id) || validKetuaTimIds.has(upload.user_id);
         }
         return assignedUserIds.has(upload.user_id);
      });
      
      // Filter out the logged-in user themselves (Pimpinan cannot evaluate themselves, Radina cannot evaluate themselves)
      rkEntries = rkEntries.filter((e: any) => {
         const upload = uploads.find((u: any) => u.id === e.upload_id);
         return upload?.user_id !== user?.id;
      });

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

      let avgScore = null;
      if (evaluatedEntries.length > 0) {
        const userScores = new Map<string, { total: number; count: number }>();
        evaluatedEntries.forEach((e: any) => {
          const upload = uploads.find((u: any) => u.id === e.upload_id);
          if (upload) {
            const existing = userScores.get(upload.user_id) || { total: 0, count: 0 };
            userScores.set(upload.user_id, { total: existing.total + e.nilai, count: existing.count + 1 });
          }
        });
        
        let sumOfUserAverages = 0;
        userScores.forEach(val => {
          sumOfUserAverages += (val.total / val.count);
        });
        
        if (userScores.size > 0) {
          avgScore = sumOfUserAverages / userScores.size;
        }
      }

      return {
        ...rk,
        totalEntries: rkEntries.length,
        totalPegawai: uniquePegawaiIds.size,
        evaluatedEntries: evaluatedEntries.length,
        allEvaluated,
        avgProgress: Math.min(100, avgProgress),
        avgScore,
        entries: rkEntries
      };
    }).filter(Boolean);
  }, [rks, entries, uploads, user?.id, user?.role]);

  const applyFilters = (list: any[]) => {
    let result = list;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((rk: any) =>
        rk.rencana_kinerja?.toLowerCase().includes(q) ||
        rk.tim_kerja?.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'semua') {
      result = result.filter((rk: any) => {
        if (filterStatus === 'perlu_dinilai') return rk.totalEntries > 0 && !rk.allEvaluated;
        if (filterStatus === 'selesai') return rk.totalEntries > 0 && rk.allEvaluated;
        if (filterStatus === 'belum_ada') return rk.totalEntries === 0;
        return true;
      });
    }
    return result.sort((a: any, b: any) => {
      const aPending = a.totalEntries > 0 && !a.allEvaluated;
      const bPending = b.totalEntries > 0 && !b.allEvaluated;
      if (aPending && !bPending) return -1;
      if (!aPending && bPending) return 1;
      return b.totalPegawai - a.totalPegawai;
    });
  };

  const getPeriodName = (p: string | number) => {
    if (typeof p === 'string' && p.startsWith('T')) {
      const tMap: Record<string, string> = {
        'T1': 'Triwulan I (Jan-Mar)',
        'T2': 'Triwulan II (Apr-Jun)',
        'T3': 'Triwulan III (Jul-Sep)',
        'T4': 'Triwulan IV (Okt-Des)',
      };
      return tMap[p] || p;
    }
    return getBulanName(p as number);
  };

  const handleExport = () => {
    if (!allRKStats || allRKStats.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }
    
    const isTriwulan = typeof bulan === 'string' && bulan.startsWith('T');
    
    const headerRows = [
      ['REKAP NILAI RENCANA KINERJA PEGAWAI'],
      ['BPS Kabupaten Belitung'],
      [`Periode: ${getPeriodName(bulan)} ${tahun}`],
      [],
    ];

    const dataHeaders = ['No', 'Nama Pegawai', 'Rencana Kinerja', 'Rata-rata Nilai'];
    const dataRows: any[] = [];
    
    let rowIndex = 1;
    allRKStats.forEach((rk: any) => {
      const userAverages = new Map<string, { totalScore: number, count: number, name: string }>();
      
      rk.entries.forEach((e: any) => {
        if (e.nilai === null) return;
        const upload = uploads.find((u: any) => u.id === e.upload_id);
        if (!upload) return;
        
        const userId = upload.user_id;
        const userObj = data?.users.find((u: any) => u.id === userId);
        const userName = userObj ? userObj.full_name : 'Unknown User';
        
        const existing = userAverages.get(userId);
        if (existing) {
          existing.totalScore += e.nilai;
          existing.count += 1;
        } else {
          userAverages.set(userId, { totalScore: e.nilai, count: 1, name: userName });
        }
      });
      
      userAverages.forEach((val) => {
        const avgRaw = val.totalScore / val.count;
        const finalAvg = isTriwulan ? Math.round(avgRaw) : Number(avgRaw.toFixed(1));
        
        dataRows.push([
          rowIndex++,
          val.name,
          rk.rencana_kinerja,
          finalAvg
        ]);
      });
    });
    
    if (dataRows.length === 0) {
      toast.error('Belum ada data nilai untuk diekspor');
      return;
    }
    
    const allRows = [...headerRows, dataHeaders, ...dataRows];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(allRows);
    
    ws['!cols'] = [
      { wch: 5 },   // No
      { wch: 30 },  // Nama
      { wch: 50 },  // Rencana Kinerja
      { wch: 15 },  // Nilai
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap_Nilai');
    
    const fileName = `Rekap_Nilai_KetuaTim_${bulan}_${tahun}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const filteredRKs = useMemo(() => applyFilters(rkStats), [rkStats, searchQuery, filterStatus]);
  const allRKStats = rkStats;
  const totalRKs = allRKStats.length;
  const activeRKs = allRKStats.filter((rk: any) => rk.totalEntries > 0).length;
  const pendingRKs = allRKStats.filter((rk: any) => rk.totalEntries > 0 && !rk.allEvaluated).length;
  const avgOverallProgress = activeRKs > 0 ? allRKStats.reduce((s: number, rk: any) => s + rk.avgProgress, 0) / activeRKs : 0;

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

  const renderRkCard = (rk: any) => (
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
              {rk.avgScore !== null ? (typeof bulan === 'string' && bulan.startsWith('T') ? Math.round(rk.avgScore) : rk.avgScore.toFixed(1)) : '-'}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[var(--primary)] group-hover:text-white group-hover:shadow-md transition-all duration-300 transform group-hover:translate-x-1">
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );

  return (
    <>
      <Header pendingCount={0} />
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Dashboard Ketua Tim</h2>
            <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-2">
              {getPeriodName(bulan)} {tahun}
              {!isCurrentPeriod && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Filter aktif</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="btn-secondary flex items-center gap-2 h-10 px-4 mr-2" disabled={loading}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Rekap</span>
            </button>
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
              <p className="text-xs text-slate-400 mt-0.5">{allRKStats.length} RK ditampilkan</p>
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
                <option value="">Pilih RK Disini...</option>
                {allRKStats.map((rk: any) => (
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
          ) : allRKStats.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-base font-semibold text-slate-700">Tidak ada Rencana Kinerja ditemukan</p>
              <p className="text-sm text-slate-400 mt-1">Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredRKs.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2">Rencana Kinerja</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRKs.map(renderRkCard)}
                  </div>
                </div>
              )}

              {filteredRKs.length === 0 && (
                <div className="text-center py-10">
                   <p className="text-sm text-slate-400">Pencarian tidak menemukan hasil.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
