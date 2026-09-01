"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { DataDukungLink } from '@/components/ckp/data-dukung-link';
import { Skeleton } from '@/components/ui/skeleton';
import { getBulanName, formatDate, getDefaultPeriod } from '@/lib/utils';
import { gradeRencanaKinerjaAction } from '@/app/actions/penilaian';
import { markEntryAction } from '@/app/actions/ckp';
import type { CKPUpload, CKPEntry, User } from '@/types/database';
import { toast } from 'sonner';
import {
  ArrowLeft, FileText, TrendingUp, CheckCircle2,
  RefreshCw, WifiOff, Search, ChevronDown, ChevronUp, User as UserIcon,
  XCircle, CheckSquare, AlertTriangle
} from 'lucide-react';

function KPICard({ icon, value, label, sub, iconBg }: {
  icon: React.ReactNode; value: string | number; label: string; sub?: string; iconBg: string;
}) {
  return (
    <div className="kpi-card p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-3xl font-extrabold tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>{value}</p>
        <p className="text-[13px] font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
      </div>
    </div>
  );
}

function PegawaiRKGroup({
  uploads,
  user,
  entries,
  rkName,
  canReview,
  onSaveScore,
  defaultScore,
  onMarkEntryClick,
  forceExpanded
}: {
  uploads: CKPUpload[];
  user: User;
  entries: CKPEntry[];
  rkName: string;
  canReview: boolean;
  onSaveScore: (uploadIds: string[], score: number | null) => Promise<void>;
  defaultScore: number | null;
  onMarkEntryClick?: (entry: CKPEntry) => void;
  forceExpanded?: boolean;
}) {
  const [expandedState, setExpandedState] = useState(false);
  const expanded = forceExpanded || expandedState;
  const [score, setScore] = useState<string>(defaultScore?.toString() ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setScore(defaultScore?.toString() ?? '');
  }, [defaultScore]);

  const handleBlur = async () => {
    const currentSavedStr = defaultScore?.toString() ?? '';
    if (score === currentSavedStr) return;

    const uploadIds = uploads.map(u => u.id);

    if (score === '') {
      setSaving(true);
      try {
        await onSaveScore(uploadIds, null);
      } catch {
        setScore(currentSavedStr);
      } finally {
        setSaving(false);
      }
      return;
    }

    const num = parseInt(score, 10);
    if (isNaN(num) || num < 0 || num > 100) {
      toast.error('Nilai harus berupa angka 0-100');
      setScore(currentSavedStr);
      return;
    }
    
    setSaving(true);
    try {
      await onSaveScore(uploadIds, num);
    } catch {
      setScore(currentSavedStr);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Triggers save
      // Find the next score input and focus it
      const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('.score-input:not(:disabled)'));
      const currentIndex = inputs.indexOf(e.currentTarget);
      if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
        inputs[currentIndex + 1].select(); // Optional: select existing score for easy overwrite
      }
    }
  };

  const hasScore = defaultScore !== null;
  const avgProgress = entries.length > 0 ? entries.reduce((s, e) => s + (e.progres || 0), 0) / entries.length : 0;
  const dinilaiOleh = entries[0]?.dinilai_oleh && entries[0]?.nilai !== null;

  return (
    <div className="activity-card mb-4 bg-white border rounded-2xl shadow-sm hover:shadow transition-shadow" aria-expanded={expanded} style={{ borderColor: 'var(--border)' }}>
      {/* Header */}
      <div 
        className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center cursor-pointer"
        onClick={() => setExpandedState(!expandedState)}
      >
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <UserIcon className="text-blue-600" size={20} />
          </div>
          <div>
            <h4 className="text-[15px] font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{user.full_name || 'Pegawai'}</h4>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {user.nip ? `NIP. ${user.nip}` : 'NIP tidak tersedia'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{entries.length} Kegiatan</span>
              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>&bull; Rata-rata capaian: {avgProgress.toFixed(0)}%</span>
              {dinilaiOleh && <span className="badge-pill bg-green-50 text-green-700 text-[10px]">Telah dinilai</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col items-end">
             <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Nilai RK</p>
             {canReview ? (
                <div className="relative w-24">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={e => setScore(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    disabled={saving}
                    className="score-input border rounded-lg px-3 py-1.5 text-[14px] font-semibold text-center w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-tertiary)]"
                    placeholder="-"
                    title="Tekan Enter atau klik di luar untuk menyimpan"
                  />
                  {saving && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <RefreshCw size={12} className="animate-spin" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-[16px] font-bold" style={{ color: hasScore ? '#059669' : '#94A3B8' }}>
                  {hasScore ? defaultScore : '-'}
                </span>
              )}
          </div>
          
          <button
            onClick={() => setExpandedState(!expandedState)}
            className="p-2 rounded-lg transition-colors ml-2 self-end bg-slate-50 hover:bg-slate-100 text-slate-500"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t p-4 sm:p-5 space-y-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
          <h5 className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Detail Kegiatan</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {entries.map((entry) => (
              <div key={entry.id} className={`p-4 rounded-xl shadow-sm border transition-colors ${entry.catatan_koreksi ? 'border-amber-400 bg-amber-50/30' : 'border-[var(--border)] bg-[var(--card-bg)]'}`}>
                <div className="flex flex-col h-full">
                  <div className="flex-1 mb-3 flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{entry.kegiatan || '—'}</p>
                      <p className="text-[12px] mt-1 whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{entry.capaian || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t flex-wrap gap-y-2" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded whitespace-nowrap" style={{ color: 'var(--text-tertiary)', background: 'var(--bg-secondary)' }}>Baris #{entry.row_number}</span>
                      <span className="text-[11px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(entry.tanggal_mulai)}
                        {entry.tanggal_selesai && entry.tanggal_selesai !== entry.tanggal_mulai && (
                          <> - {formatDate(entry.tanggal_selesai)}</>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-right flex-wrap">
                      {entry.data_dukung && <DataDukungLink value={entry.data_dukung} />}
                      {canReview && onMarkEntryClick && (
                        <button 
                          onClick={() => onMarkEntryClick(entry)} 
                          className="p-1 rounded-md transition-colors"
                          style={{ color: 'var(--amber-600)', background: 'var(--amber-50)' }}
                          title="Tandai Perlu Diperbaiki"
                        >
                          <AlertTriangle size={14} />
                        </button>
                      )}
                      <div className="flex items-center gap-1.5 ml-2">
                        <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Progres:</span>
                        <span className={`text-[12px] font-bold ${entry.progres >= 100 ? 'text-[var(--success)]' : 'text-[var(--primary)]'}`}>{entry.progres}%</span>
                      </div>
                      {entry.nilai !== null && (
                        <div className="flex items-center gap-1.5 ml-3 pl-3 border-l" style={{ borderColor: 'var(--border)' }}>
                          <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Nilai:</span>
                          <span className="text-[12px] font-bold" style={{ color: 'var(--success)' }}>{entry.nilai}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {entry.catatan_koreksi && (
                    <div className="mt-3 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-[12px] flex items-start gap-2">
                      <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block mb-0.5">Catatan Perbaikan:</span>
                        {entry.catatan_koreksi}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RkDetailClient({ rkId }: { rkId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, loading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  const defaultPeriod = getDefaultPeriod(10);
  const currentMonth = defaultPeriod.bulan;
  const currentYear = defaultPeriod.tahun;
  
  const paramBulan = searchParams.get('bulan');
  const paramTahun = searchParams.get('tahun');
  const bulan: string | number = paramBulan && paramBulan.startsWith('T') ? paramBulan : (paramBulan ? parseInt(paramBulan) : currentMonth);
  const tahun = paramTahun ? parseInt(paramTahun) : currentYear;
  const [searchQuery, setSearchQuery] = useState('');
  
  const [entryToMark, setEntryToMark] = useState<CKPEntry | null>(null);
  const [catatanKoreksi, setCatatanKoreksi] = useState<string>('');
  const [isMarking, setIsMarking] = useState(false);
  


  const { data, isPending: queryPending, error: queryError, refetch } = useQuery({
    // KEY must match server prefetch in ketua_tim/rk/[id]/page.tsx exactly
    queryKey: ['rk-detail', rkId, bulan, tahun],
    queryFn: async () => {
      // 1. Get RK mapping details
      const { data: mappingData, error: mapError } = await supabase
        .from('rk_ketua_tim_mapping')
        .select('*')
        .eq('id', rkId)
        .single();
      
      if (mapError) throw mapError;
      if (!mappingData) throw new Error("Rencana Kinerja tidak ditemukan");

      const rkName = mappingData.rencana_kinerja;

      // 1.5 Fetch user_rk_assignments for this RK
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('user_rk_assignments')
        .select('user_id')
        .eq('rk_id', rkId);

      if (assignmentsError) throw assignmentsError;
      
      const assignedUserIds = new Set(assignmentsData?.map((a: any) => a.user_id) || []);

      // 2. Fetch all active uploads for the selected month/period
      let uploadsQuery = supabase
        .from('ckp_uploads')
        .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
        .eq('tahun', tahun)
        .in('status', ['submitted', 'scored', 'approved', 'revision_required']);

      if (typeof bulan === 'string' && bulan.startsWith('T')) {
        const triwulanMap: Record<string, number[]> = {
          'T1': [1, 2, 3],
          'T2': [4, 5, 6],
          'T3': [7, 8, 9],
          'T4': [10, 11, 12]
        };
        uploadsQuery = uploadsQuery.in('bulan', triwulanMap[bulan] || []);
      } else {
        uploadsQuery = uploadsQuery.eq('bulan', bulan);
      }
        
      const { data: uploadsData, error: uploadsError } = await uploadsQuery;
        
      if (uploadsError) throw uploadsError;
      
      const uploadIds = uploadsData?.map((u: any) => u.id) || [];

      if (uploadIds.length === 0) {
        return { rk: mappingData, entries: [], uploads: [] };
      }

      // 3. Fetch entries matching this RK
      const { data: entriesData, error: entriesError } = await supabase
        .from('ckp_entries')
        .select('*')
        .in('upload_id', uploadIds)
        .eq('rencana_kinerja', rkName);
        
      if (entriesError) throw entriesError;
      // Find ALL ketua_tim_ids for this rencana_kinerja across all teams
      const { data: allMappingsForRK } = await supabase
        .from('rk_ketua_tim_mapping')
        .select('ketua_tim_id')
        .eq('rencana_kinerja', rkName);
        
      const validKetuaTimIds = new Set(allMappingsForRK?.map((m: any) => m.ketua_tim_id).filter(Boolean));
      
      const relevantUploadIds = new Set((entriesData || []).map((e: any) => e.upload_id));
      
      let relevantUploads = (uploadsData || []).filter((u: any) => {
         if (!relevantUploadIds.has(u.id)) return false;
         
         if (currentUser?.role === 'pimpinan' || currentUser?.role === 'admin') {
            if (mappingData.ketua_tim_id !== currentUser.id) {
               // For RKs of other teams, Pimpinan only evaluates the Ketua Tim themselves
               return u.user_id === mappingData.ketua_tim_id;
            }
            return assignedUserIds.has(u.user_id) || validKetuaTimIds.has(u.user_id);
         }
         return assignedUserIds.has(u.user_id);
      });
      
      // Filter out the logged-in user themselves
      relevantUploads = relevantUploads.filter((u: any) => u.user_id !== currentUser?.id);

      const newUploads = relevantUploads.map((u: any) => ({
        ...u,
        user: u.user as User | undefined,
      })) as (CKPUpload & { user?: User })[];

      return {
        rk: mappingData,
        entries: entriesData || [],
        uploads: newUploads,
      };
    },
    enabled: !!currentUser && !authLoading && !!rkId,
    networkMode: 'always',
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  });
  const loading = authLoading || (!data && queryPending);
  const rk = data?.rk || null;
  const entries: CKPEntry[] = data?.entries || [];
  const uploads: (CKPUpload & { user?: User })[] = data?.uploads || [];
  const error = queryError ? queryError.message : null;

  const handleSaveScore = async (uploadIds: string[], score: number | null) => {
    if (!rk) return;
    
    // Optimistic update — use the simplified query key (matches server prefetch)
    const rkDetailKey = ['rk-detail', rkId, bulan, tahun];
    
    // 1. Cancel outgoing fetches so they don't overwrite optimistic update
    await queryClient.cancelQueries({ queryKey: rkDetailKey });

    // 2. Backup previous state
    const previousData = queryClient.getQueryData(rkDetailKey);

    // 3. Optimistic update
    queryClient.setQueryData(rkDetailKey, (old: any) => {
      if (!old) return old;
      const uploadIdsSet = new Set(uploadIds);
      const newEntries = old.entries.map((e: any) => 
        uploadIdsSet.has(e.upload_id)
          ? { ...e, nilai: score, dinilai_oleh: score !== null ? currentUser?.id : null } 
          : e
      );
      return { ...old, entries: newEntries };
    });

    try {
      // Single server action call with all uploadIds at once — 1 round trip instead of N
      const result = await gradeRencanaKinerjaAction(uploadIds, rk.rencana_kinerja, score);
      if (!result.success) throw new Error(result.error);
      // Invalidate both this page and the dashboard so both show updated scores
      void queryClient.invalidateQueries({ queryKey: ['rk-detail'] });
      void queryClient.invalidateQueries({ queryKey: ['ketua-tim-uploads'] });
    } catch (error: any) {
      // Roll back optimistic update on failure
      queryClient.setQueryData(rkDetailKey, previousData);
      toast.error(`Gagal menyimpan nilai: ${error.message || 'Error server'}`);
    }
  };

  const handleExecuteMarkEntry = async () => {
    if (!entryToMark) return;
    
    setIsMarking(true);
    try {
      const result = await markEntryAction(entryToMark.id, catatanKoreksi || null);
        
      if (!result.success) throw new Error(result.error);
      
      toast.success(catatanKoreksi ? "Catatan perbaikan berhasil disimpan." : "Catatan perbaikan berhasil dihapus.");
      setEntryToMark(null);
      setCatatanKoreksi('');
      refetch();
    } catch (err: any) {
      toast.error("Gagal menyimpan catatan: " + (err.message || 'Error tidak diketahui'));
    } finally {
      setIsMarking(false);
    }
  };

  const { filteredUserGroups, totalDisplayedUsers } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    
    const userGroupsMap = uploads.reduce((acc, upload) => {
      const userId = upload.user_id;
      if (!acc[userId] && upload.user) {
        acc[userId] = { user: upload.user, uploads: [] };
      }
      if (acc[userId]) {
        acc[userId].uploads.push(upload);
      }
      return acc;
    }, {} as Record<string, { user: User, uploads: CKPUpload[] }>);
    
    const userGroups = Object.values(userGroupsMap);
    
    const finalGroups = userGroups.map(group => {
       const uploadIds = group.uploads.map(u => u.id);
       const userEntries = entries.filter(e => uploadIds.includes(e.upload_id));
       
       userEntries.sort((a, b) => {
          const aUpload = group.uploads.find(u => u.id === a.upload_id);
          const bUpload = group.uploads.find(u => u.id === b.upload_id);
          return (aUpload?.bulan || 0) - (bUpload?.bulan || 0);
       });
       
       if (!q) {
          return { ...group, entries: userEntries, matches: true };
       }
       
       const userMatches = group.user.full_name?.toLowerCase().includes(q) || 
                           group.user.nip?.toLowerCase().includes(q);
                           
       let filteredEntries = userEntries;
       if (!userMatches) {
          filteredEntries = userEntries.filter(e => 
            e.kegiatan?.toLowerCase().includes(q) || 
            e.capaian?.toLowerCase().includes(q)
          );
       }
       
       return { ...group, entries: filteredEntries, matches: userMatches || filteredEntries.length > 0 };
    }).filter(g => g.matches && g.entries.length > 0);
    
    return { 
       filteredUserGroups: finalGroups, 
       totalDisplayedUsers: finalGroups.length 
    };
  }, [uploads, entries, searchQuery]);

  if (error && !loading && !rk) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-md mx-auto text-center py-24">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
            <WifiOff className="h-6 w-6" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Gagal Memuat Data</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white"
          >
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-12 w-3/4 rounded-xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        </div>
      </>
    );
  }

  if (!rk) {
    return (
      <>
        <Header />
        <div className="p-5 lg:p-8 max-w-4xl mx-auto text-center py-20">
          <p style={{ color: 'var(--text-secondary)' }}>Rencana Kinerja tidak ditemukan.</p>
          <button onClick={() => router.back()} className="px-4 py-2 bg-slate-100 rounded-lg font-medium text-sm mt-4 inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>
      </>
    );
  }

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

  const bulanNama = getPeriodName(bulan);
  
  const userGroupsMap = uploads.reduce((acc, upload) => {
    if (!acc[upload.user_id]) {
      acc[upload.user_id] = { uploads: [] };
    }
    acc[upload.user_id].uploads.push(upload);
    return acc;
  }, {} as Record<string, { uploads: typeof uploads }>);
  const uniqueUsersCount = Object.keys(userGroupsMap).length;

  const evaluatedUsersCount = Object.values(userGroupsMap).filter(group => {
    const userUploadIds = group.uploads.map(u => u.id);
    const userEntries = entries.filter(e => userUploadIds.includes(e.upload_id));
    return userEntries.length > 0 && userEntries.every(e => e.nilai !== null);
  }).length;
  
  const pendingCount = uniqueUsersCount - evaluatedUsersCount;
  
  const avgProgress = entries.length > 0 ? entries.reduce((s, e) => s + (e.progres || 0), 0) / entries.length : 0;
  const scoredEntries = entries.filter(e => e.nilai !== null);
  let avgScoreRaw = null;
  if (scoredEntries.length > 0) {
    const userScores = new Map<string, { total: number; count: number }>();
    scoredEntries.forEach(e => {
       const upload = uploads.find(u => u.id === e.upload_id);
       if (upload) {
          const existing = userScores.get(upload.user_id) || { total: 0, count: 0 };
          userScores.set(upload.user_id, { total: existing.total + e.nilai!, count: existing.count + 1 });
       }
    });
    
    let sumOfUserAverages = 0;
    userScores.forEach(val => {
       sumOfUserAverages += (val.total / val.count);
    });
    
    if (userScores.size > 0) {
       avgScoreRaw = sumOfUserAverages / userScores.size;
    }
  }
  const avgScore = avgScoreRaw !== null ? Math.round(avgScoreRaw) : null;

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors w-fit border border-slate-200 shadow-sm"
                title="Kembali ke Dashboard">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <p className="text-[12px] mb-2 font-semibold uppercase tracking-wider text-blue-600">
              Detail Penilaian RK &bull; {bulanNama} {tahun}
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 leading-tight max-w-3xl">
              {rk.rencana_kinerja}
            </h2>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-[13px] font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                Tim: {rk.tim_kerja || '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={<UserIcon size={18} style={{ color: 'var(--primary)' }} />} value={uniqueUsersCount} label="Total Pegawai" iconBg="var(--primary-soft)" />
          <KPICard icon={<CheckCircle2 size={18} style={{ color: 'var(--success)' }} />} value={evaluatedUsersCount} label="Selesai Dinilai" iconBg="var(--success-soft)" />
          <KPICard icon={<TrendingUp size={18} style={{ color: 'var(--primary)' }} />} value={`${avgProgress.toFixed(0)}%`} label="Rata-rata Capaian" iconBg="var(--primary-soft)" />
          <KPICard icon={<FileText size={18} style={{ color: 'var(--primary)' }} />} value={avgScoreRaw !== null ? (typeof bulan === 'string' && bulan.startsWith('T') ? Math.round(avgScoreRaw) : avgScoreRaw.toFixed(1)) : '-'} label="Rata-rata Nilai" iconBg="var(--primary-soft)" />
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Daftar Pegawai ({totalDisplayedUsers})</h3>
              <p className="text-sm text-slate-500">Berikan nilai Rencana Kinerja untuk masing-masing pegawai di bawah ini.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="search" 
                  placeholder="Cari pegawai..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="w-full pl-9 h-10 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredUserGroups.length > 0 ? (
              filteredUserGroups.map(({ user, uploads: userUploads, entries: userEntries }) => {
                // Determine score to show
                const scoredEntries = userEntries.filter(e => e.nilai !== null);
                let defaultScore = null;
                // Hanya tampilkan nilai default jika SEMUA kegiatan sudah dinilai.
                // Jika ada kegiatan baru/pindahan yang belum dinilai, biarkan kosong agar user menilainya ulang.
                if (scoredEntries.length === userEntries.length && userEntries.length > 0) {
                   const avg = scoredEntries.reduce((s, e) => s + e.nilai!, 0) / scoredEntries.length;
                   defaultScore = Math.round(avg);
                }
                
                // Can review if status is submitted or revision_required, but NOT in Triwulan view and NOT if approved
                const isTriwulan = typeof bulan === 'string' && bulan.startsWith('T');
                const isApproved = userUploads.some(u => u.status === 'approved');
                const canReview = !isTriwulan && !isApproved && userUploads.some(u => u.status !== 'draft');
                
                return (
                  <PegawaiRKGroup
                    key={user.id}
                    uploads={userUploads}
                    user={user}
                    entries={userEntries}
                    rkName={rk.rencana_kinerja}
                    canReview={canReview}
                    onSaveScore={handleSaveScore}
                    defaultScore={defaultScore}
                    onMarkEntryClick={(entry) => {
                      setEntryToMark(entry);
                      setCatatanKoreksi(entry.catatan_koreksi || '');
                    }}
                    forceExpanded={!!searchQuery.trim()}
                  />
                );
              })
            ) : (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                <UserIcon className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Tidak ada pegawai yang ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {entryToMark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-xl shadow-xl w-full max-w-md overflow-hidden border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
            <div className="p-5 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-lg flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <AlertTriangle size={18} className="text-amber-500" />
                Tandai Perlu Diperbaiki
              </h3>
              <button onClick={() => setEntryToMark(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <XCircle size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                <p className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Kegiatan:</p>
                <p className="text-slate-700">{entryToMark.kegiatan}</p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Berikan Catatan Perbaikan</label>
                <textarea 
                  className="w-full text-sm rounded-lg p-3 outline-none focus:ring-2 resize-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  placeholder="Contoh: Kegiatan ini seharusnya masuk ke Rencana Kinerja X..."
                  rows={4}
                  value={catatanKoreksi}
                  onChange={(e) => setCatatanKoreksi(e.target.value)}
                />
                <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  Catatan ini akan terlihat oleh pegawai saat mereka memperbaiki dan merevisi file Excel.
                </p>
              </div>
            </div>
            <div className="p-5 flex justify-end gap-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
              <button className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors" onClick={() => setEntryToMark(null)}>
                Batal
              </button>
              <button className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50" onClick={handleExecuteMarkEntry} disabled={isMarking}>
                {isMarking ? 'Menyimpan...' : 'Simpan Catatan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
