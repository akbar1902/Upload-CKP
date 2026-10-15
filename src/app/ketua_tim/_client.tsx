"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { runSafeRead } from '@/lib/supabase/read';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { PeriodFilter } from '@/components/dashboard/period-filter';
import { Skeleton } from '@/components/ui/skeleton';
import { getDefaultPeriod, getBulanName } from '@/lib/utils';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
  Users, Clock, CheckCircle2, Search,
  RefreshCw, Download, WifiOff, ArrowRight, TrendingUp, FileText, CheckCircle
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/kpi-card';
import { FetchingBar, FetchingOverlay } from '@/components/dashboard/filter-loading';
import { usePeriodParams } from '@/hooks/use-period-params';

export default function KetuaTimDashboardClient() {
  const { user, loading: authLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');

  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultPeriod = getDefaultPeriod(10);
  const currentMonth = defaultPeriod.bulan;
  const currentYear = defaultPeriod.tahun;

  const paramBulan = searchParams.get('bulan');
  const paramTahun = searchParams.get('tahun');
  const bulan: string | number = paramBulan && paramBulan.startsWith('T') ? paramBulan : (paramBulan ? parseInt(paramBulan) : currentMonth);
  const tahun = paramTahun ? parseInt(paramTahun) : currentYear;

  const isCurrentPeriod = bulan === currentMonth && tahun === currentYear;

  // Prefetch RK detail page on card hover — makes navigation feel instant
  const prefetchedRks = useMemo(() => new Set<string>(), []);
  const prefetchRkDetail = useCallback((rkId: string) => {
    if (prefetchedRks.has(rkId)) return;
    prefetchedRks.add(rkId);
    // router.prefetch triggers Next.js to prefetch server components + JS bundle
    router.prefetch(`/ketua_tim/rk/${rkId}?bulan=${bulan}&tahun=${tahun}`);
  }, [router, bulan, tahun, prefetchedRks]);

  const setPeriod = usePeriodParams();

  // Ganti periode via native History API → tidak memicu render ulang server
  // (dulu pakai router.push sehingga setiap filter menunggu round-trip RSC).
  const setBulan = (b: string | number) => {
    setPeriod({ bulan: b, tahun });
  };

  const setTahun = (t: number) => {
    setPeriod({ bulan, tahun: t });
  };

  const { data, isPending: queryPending, isFetching: queryFetching, error: queryError, refetch } = useQuery({
    // KEY must match server prefetch in ketua_tim/page.tsx exactly
    queryKey: ['ketua-tim-uploads', bulan, tahun],
    queryFn: ({ queryKey }) => {
      const [_key, qBulan, qTahun] = queryKey as [string, string | number, number];

      return runSafeRead(async (supabase, signal) => {
        if (!user) return { rks: [], uploads: [], entries: [], users: [] };

        // 1. RK mapping + uploads periode bersifat independen → jalankan PARALEL
        //    agar tidak ada tahap menunggu berurutan yang tak perlu.
        let mappingQuery = supabase.from('rk_ketua_tim_mapping').select('*').eq('is_active', true);
        if (user.role !== 'pimpinan' && user.role !== 'admin') {
          mappingQuery = mappingQuery.eq('ketua_tim_id', user.id);
        }

        let uploadsQuery = supabase
          .from('ckp_uploads')
          .select('id, user_id, status, uploaded_at')
          .eq('tahun', qTahun)
          .in('status', ['submitted', 'scored', 'approved', 'revision_required']);

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

        const [mappingRes, uploadsRes] = await Promise.all([
          mappingQuery.abortSignal(signal),
          uploadsQuery.abortSignal(signal),
        ]);

        if (mappingRes.error) throw mappingRes.error;
        if (uploadsRes.error) throw uploadsRes.error;

        const mappingData = mappingRes.data;
        if (!mappingData || mappingData.length === 0) {
          return { rks: [], uploads: [], entries: [], users: [], assignments: [] };
        }

        const rkIds = mappingData.map((m: any) => m.id);
        const rkNames = mappingData.map((m: any) => m.rencana_kinerja);

        const uploadsData = uploadsRes.data;
        const uploadIds = uploadsData?.map((u: any) => u.id) || [];

        // 2. Ambil assignments (chunked) — dijalankan paralel dengan pengambilan
        //    entri di bawah, karena keduanya tidak saling bergantung.
        const runAssignments = async (): Promise<any[]> => {
          const chunks: string[][] = [];
          for (let i = 0; i < rkIds.length; i += 100) {
            chunks.push(rkIds.slice(i, i + 100));
          }
          const results = await Promise.all(
            chunks.map((chunk) =>
              supabase
                .from('user_rk_assignments')
                .select('user_id, rk_id')
                .in('rk_id', chunk)
                .abortSignal(signal)
            )
          );
          const collected: any[] = [];
          for (const { data, error } of results) {
            if (error) throw error;
            if (data) collected.push(...data);
          }
          return collected;
        };

        const assignmentsPromise = runAssignments();

        if (uploadIds.length === 0) {
          const assignmentsData = await assignmentsPromise;
          return { rks: mappingData, uploads: [], entries: [], users: [], assignments: assignmentsData };
        }

        // 3. Ambil entri untuk upload tersebut, difilter di sisi DB ke RK yang
        //    relevan (strategi dual: data lama by nama parent RK, data baru by
        //    UUID parent di rk_ketua_tim_id). Kedua strategi dijalankan PARALEL.
        const uploadBatches: string[][] = [];
        for (let i = 0; i < uploadIds.length; i += 50) {
          uploadBatches.push(uploadIds.slice(i, i + 50));
        }

        const fetchEntriesBy = async (
          column: 'rencana_kinerja' | 'rk_ketua_tim_id',
          values: any[]
        ): Promise<any[]> => {
          if (values.length === 0) return [];
          const collected: any[] = [];
          for (const batch of uploadBatches) {
            let from = 0;
            const limit = 999;
            while (true) {
              const { data: chunk, error: entriesError } = await supabase
                .from('ckp_entries')
                .select('*')
                .in('upload_id', batch)
                .in(column, values)
                .range(from, from + limit)
                .abortSignal(signal);

              if (entriesError) throw entriesError;
              if (chunk) collected.push(...chunk);
              if (!chunk || chunk.length <= limit) break;
              from += limit + 1;
            }
          }
          return collected;
        };

        const [assignmentsData, entriesByName, entriesById] = await Promise.all([
          assignmentsPromise,
          fetchEntriesBy('rencana_kinerja', rkNames),
          fetchEntriesBy('rk_ketua_tim_id', rkIds),
        ]);

        // Dedupe by id (entri lama bisa cocok via nama, entri baru via UUID)
        const seenEntryIds = new Set<string>();
        const filteredEntriesData = [...entriesByName, ...entriesById].filter((e: any) => {
          if (seenEntryIds.has(e.id)) return false;
          seenEntryIds.add(e.id);
          return true;
        });

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
            .abortSignal(signal);
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
      });
    },
    enabled: !!user && !authLoading && !!bulan && !!tahun,
    networkMode: 'always',
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
    // Client baru tiap percobaan ditangani runSafeRead (retry internal).
    retry: false,
  });

  const loading = authLoading || queryPending;
  // Refetch di background (ganti periode / refresh) sementara data lama tetap tampil.
  const isFiltering = !loading && queryFetching;

  // Beri tahu pengguna bila pemuatan periode gagal (data lama tetap tampil).
  useEffect(() => {
    if (queryError) {
      toast.error('Gagal memuat data periode ini. Silakan coba lagi.', { id: 'period-fetch-error' });
    }
  }, [queryError]);

  const rks = data?.rks || [];
  const entries = data?.entries || [];
  const uploads = data?.uploads || [];
  const assignments = data?.assignments || [];
  const error = queryError ? queryError.message : null;

  // Process data for RK Cards
  const rkStats = useMemo(() => {
    const displayRks = rks.filter((rk: any) => {
      if (rk.ketua_tim_id === user?.id) return true;
      if (user?.role === 'pimpinan' || user?.role === 'admin') return true;
      return false;
    });
    
    return displayRks.map((rk: any) => {
      // Pencocokan dual (pola getRkDetailAction): data lama cocok by nama parent RK,
      // data baru cocok by UUID parent di rk_ketua_tim_id (rencana_kinerja berisi nama Sub-RK)
      let rkEntries = entries.filter((e: any) => e.rencana_kinerja === rk.rencana_kinerja || (e.rk_ketua_tim_id && e.rk_ketua_tim_id === rk.id));
      
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
            if (rk.ketua_tim_id && rk.ketua_tim_id !== user.id) {
               // For RKs of other teams, Pimpinan only evaluates the Ketua Tim themselves
               return upload.user_id === rk.ketua_tim_id;
            }
            // Jika RK tidak memiliki ketua tim, atau Pimpinan adalah ketua timnya, Pimpinan menilai semua
            return true;
         }
         
         // Untuk Ketua Tim biasa, tampilkan semua entri yang masuk ke RK mereka, 
         // meskipun pegawai tidak secara resmi di-assign ke RK tersebut
         return true;
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
    
    const timKerja = allRKStats.length > 0 && allRKStats[0].tim_kerja ? allRKStats[0].tim_kerja : (user?.unit_kerja || 'Tim');
    let periodeStr = `${bulan}`;
    if (typeof bulan === 'string' && bulan.startsWith('T')) {
      const tMap: Record<string, string> = {
        'T1': 'Triwulan I',
        'T2': 'Triwulan II',
        'T3': 'Triwulan III',
        'T4': 'Triwulan IV',
      };
      periodeStr = tMap[bulan] || bulan;
    } else {
      periodeStr = `Bulan ${getBulanName(bulan as number)}`;
    }
    
    const fileName = `Rekap CKP_${timKerja}_${periodeStr}.xlsx`;
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
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'var(--neu-surface-2)', boxShadow: 'var(--neu-inset-sm)' }}>
            <WifiOff className="h-6 w-6" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Gagal Memuat Data</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button onClick={() => refetch()} className="btn-primary">
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      </>
    );
  }

  const renderRkCard = (rk: any) => (
    <Link
      key={rk.id}
      href={`/ketua_tim/rk/${rk.id}?bulan=${bulan}&tahun=${tahun}`}
      prefetch={true}
      onMouseEnter={() => prefetchRkDetail(rk.id)}
      className="neu-raised card-hover rounded-2xl p-5 transition-all duration-300 relative overflow-hidden group flex flex-col h-full cursor-pointer block"
    >
      <div
        className="absolute top-0 left-0 w-1.5 h-full transition-colors"
        style={{ background: rk.totalEntries === 0 ? 'var(--sand-border)' : rk.allEvaluated ? 'var(--success)' : 'var(--accent)' }}
      />

      <div className="flex justify-between items-start mb-3 pl-2 gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
          style={{ background: 'var(--neu-surface-2)', color: 'var(--text-secondary)', boxShadow: 'var(--neu-inset-sm)' }}
        >
          <Users size={12} /> {rk.tim_kerja || 'Tim Kerja'}
        </span>
        {rk.totalEntries > 0 && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-full font-bold"
            style={rk.allEvaluated
              ? { background: 'var(--success-soft)', color: 'var(--success-text)' }
              : { background: 'var(--accent-soft)', color: 'var(--accent-strong)' }}
          >
            {rk.allEvaluated ? 'Selesai Dinilai' : 'Perlu Dinilai'}
          </span>
        )}
      </div>

      <h4
        className="text-[15px] font-extrabold mb-5 pl-2 leading-relaxed transition-colors group-hover:text-[var(--primary)]"
        style={{ color: 'var(--text-primary)' }}
        title={rk.rencana_kinerja}
      >
        {rk.rencana_kinerja}
      </h4>

      <div className="flex items-center justify-between mt-auto pt-4 pl-2" style={{ borderTop: '1px solid var(--border-soft)' }}>
        <div className="flex gap-4 sm:gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Pegawai</span>
            <span className="text-[15px] font-black flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              {rk.totalPegawai} <Users size={12} style={{ color: 'var(--text-tertiary)' }} />
            </span>
          </div>
          <div className="w-px" style={{ background: 'var(--border-soft)' }} />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Kegiatan</span>
            <span className="text-[15px] font-black" style={{ color: 'var(--text-primary)' }}>{rk.totalEntries}</span>
          </div>
          <div className="w-px" style={{ background: 'var(--border-soft)' }} />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Rata2 Nilai</span>
            <span className="text-[15px] font-black" style={{ color: rk.avgScore !== null ? 'var(--primary)' : 'var(--text-tertiary)' }}>
              {rk.avgScore !== null ? (typeof bulan === 'string' && bulan.startsWith('T') ? Math.round(rk.avgScore) : rk.avgScore.toFixed(1)) : '-'}
            </span>
          </div>
        </div>

        <div
          className="p-2.5 rounded-full transition-all duration-300 transform group-hover:translate-x-1"
          style={{ background: 'var(--neu-surface-2)', color: 'var(--text-secondary)', boxShadow: 'var(--neu-inset-sm)' }}
        >
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );

  return (
    <>
      <Header pendingCount={0} />
      <div className="relative p-4 lg:p-8 space-y-6 animate-fade-in">
        <FetchingBar show={isFiltering} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Dashboard Ketua Tim</h2>
            <p className="text-sm mt-0.5 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              {getPeriodName(bulan)} {tahun}
              {!isCurrentPeriod && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--warning-soft)', color: 'var(--warning-text)' }}
                >
                  Filter aktif
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="btn-secondary flex items-center gap-2 h-10 px-4 mr-2" disabled={loading}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Rekap</span>
            </button>
            <PeriodFilter bulan={bulan} tahun={tahun} onBulanChange={setBulan} onTahunChange={setTahun} />
            <button onClick={() => refetch()} className="filter-btn" title="Muat ulang" aria-label="Muat ulang data">
              <RefreshCw className={`h-4 w-4 ${queryFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={<FileText size={18} style={{ color: 'var(--primary)' }} />} value={totalRKs} label="Total Rencana Kinerja" sub="Tanggung jawab Anda" iconBg="var(--primary-soft)" loading={loading} />
          <KPICard icon={<Users size={18} style={{ color: 'var(--success)' }} />} value={activeRKs} label="RK Aktif" sub="Ada laporan bulan ini" iconBg="var(--success-soft)" loading={loading} />
          <KPICard icon={<Clock size={18} style={{ color: 'var(--warning)' }} />} value={pendingRKs} label="Menunggu Nilai" sub="RK belum dinilai penuh" iconBg="var(--warning-soft)" loading={loading} />
          <KPICard icon={<TrendingUp size={18} style={{ color: 'var(--primary)' }} />} value={`${avgOverallProgress.toFixed(0)}%`} label="Rata-rata Capaian" sub="Seluruh RK aktif" iconBg="var(--primary-soft)" loading={loading} />
        </div>

        <div className="relative">
          <FetchingOverlay show={isFiltering} label={`Memuat ${getPeriodName(bulan)} ${tahun}…`} />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Daftar Rencana Kinerja</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{allRKStats.length} RK ditampilkan</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:max-w-md flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  type="search"
                  placeholder="Cari Rencana Kinerja atau Tim Kerja..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="neu-field w-full pl-10 h-11 text-sm rounded-full transition-all"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="neu-field h-11 text-sm rounded-full px-4 font-medium w-full md:w-auto cursor-pointer"
                style={{ color: 'var(--text-primary)', outline: 'none' }}
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
                className="neu-field w-full h-11 text-sm rounded-full px-4 cursor-pointer"
                style={{ color: 'var(--text-primary)', outline: 'none' }}
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
            <div className="text-center py-20 neu-raised rounded-3xl">
              <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Tidak ada Rencana Kinerja ditemukan</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredRKs.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-4 pb-2" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-soft)' }}>Rencana Kinerja</h4>
                  <div key={`${bulan}-${tahun}`} className="card-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRKs.map(renderRkCard)}
                  </div>
                </div>
              )}

              {filteredRKs.length === 0 && (
                <div className="text-center py-10">
                   <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Pencarian tidak menemukan hasil.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
