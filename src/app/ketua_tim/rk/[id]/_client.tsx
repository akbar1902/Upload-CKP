"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { DataDukungLink } from '@/components/ckp/data-dukung-link';
import { Skeleton } from '@/components/ui/skeleton';
import { getBulanName, formatDate } from '@/lib/utils';
import { gradeRencanaKinerjaAction } from '@/app/actions/penilaian';
import type { CKPUpload, CKPEntry, User } from '@/types/database';
import { toast } from 'sonner';
import {
  ArrowLeft, FileText, TrendingUp, CheckCircle2,
  RefreshCw, WifiOff, Search, ChevronDown, ChevronUp, User as UserIcon
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
  upload,
  entries,
  rkName,
  canReview,
  onSaveScore,
  defaultScore
}: {
  upload: CKPUpload & { user?: User };
  entries: CKPEntry[];
  rkName: string;
  canReview: boolean;
  onSaveScore: (uploadId: string, score: number | null) => Promise<void>;
  defaultScore: number | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [score, setScore] = useState<string>(defaultScore?.toString() ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setScore(defaultScore?.toString() ?? '');
  }, [defaultScore]);

  const handleBlur = async () => {
    const currentSavedStr = defaultScore?.toString() ?? '';
    if (score === currentSavedStr) return;

    if (score === '') {
      setSaving(true);
      try {
        await onSaveScore(upload.id, null);
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
      await onSaveScore(upload.id, num);
    } catch {
      setScore(currentSavedStr);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.currentTarget.blur();
  };

  const hasScore = defaultScore !== null;
  const avgProgress = entries.length > 0 ? entries.reduce((s, e) => s + (e.progres || 0), 0) / entries.length : 0;
  const dinilaiOleh = entries[0]?.dinilai_oleh;

  return (
    <div className="activity-card mb-4 bg-white border rounded-2xl shadow-sm hover:shadow transition-shadow" aria-expanded={expanded} style={{ borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <UserIcon className="text-blue-600" size={20} />
          </div>
          <div>
            <h4 className="text-[15px] font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{upload.user?.full_name || 'Pegawai'}</h4>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {upload.user?.nip ? `NIP. ${upload.user.nip}` : 'NIP tidak tersedia'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{entries.length} Kegiatan</span>
              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>&bull; Rata-rata capaian: {avgProgress.toFixed(0)}%</span>
              {dinilaiOleh && <span className="badge-pill bg-green-50 text-green-700 text-[10px]">Telah dinilai</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
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
                    className="border rounded-lg px-3 py-1.5 text-[14px] font-semibold text-center w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-tertiary)]"
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
            onClick={() => setExpanded(!expanded)}
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
          <div className="grid grid-cols-1 gap-3">
            {entries.map((entry) => (
              <div key={entry.id} className="p-4 rounded-xl shadow-sm" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <div className="flex flex-col h-full">
                  <div className="flex-1 mb-3">
                    <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{entry.kegiatan || '—'}</p>
                    <p className="text-[12px] mt-1 whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{entry.capaian || '—'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded" style={{ color: 'var(--text-tertiary)', background: 'var(--bg-secondary)' }}>Baris #{entry.row_number}</span>
                      <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{formatDate(entry.tanggal_mulai)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      {entry.data_dukung && <DataDukungLink value={entry.data_dukung} />}
                      <div className="flex items-center gap-1.5 ml-2">
                        <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Progres:</span>
                        <span className={`text-[12px] font-bold ${entry.progres >= 100 ? 'text-[var(--success)]' : 'text-[var(--primary)]'}`}>{entry.progres}%</span>
                      </div>
                    </div>
                  </div>
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

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const paramBulan = searchParams.get('bulan');
  const paramTahun = searchParams.get('tahun');
  const bulan = paramBulan ? parseInt(paramBulan) : currentMonth;
  const tahun = paramTahun ? parseInt(paramTahun) : currentYear;

  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, isPending: queryPending, error: queryError, refetch } = useQuery({
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

      // 2. Fetch all active uploads for the selected month
      const { data: uploadsData, error: uploadsError } = await supabase
        .from('ckp_uploads')
        .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .in('status', ['submitted', 'approved', 'revision_required']);
        
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
      
      const relevantUploadIds = new Set((entriesData || []).map((e: any) => e.upload_id));
      const relevantUploads = (uploadsData || []).filter((u: any) => relevantUploadIds.has(u.id));

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
    enabled: !!rkId && !authLoading,
    networkMode: 'always',
    staleTime: 1000 * 60 * 5,
  });

  const loading = authLoading || queryPending;
  const rk = data?.rk || null;
  const entries: CKPEntry[] = data?.entries || [];
  const uploads: (CKPUpload & { user?: User })[] = data?.uploads || [];
  const error = queryError ? queryError.message : null;

  const handleSaveScore = async (uploadId: string, score: number | null) => {
    if (!rk) return;
    
    // Optimistic update
    queryClient.setQueryData(['rk-detail', rkId, bulan, tahun], (old: any) => {
      if (!old) return old;
      const newEntries = old.entries.map((e: any) => 
        e.upload_id === uploadId 
          ? { ...e, nilai: score, dinilai_oleh: currentUser?.id } 
          : e
      );
      
      return { ...old, entries: newEntries };
    });

    try {
      const result = await gradeRencanaKinerjaAction(uploadId, rk.rencana_kinerja, score);
      if (!result.success) throw new Error(result.error);
      void queryClient.invalidateQueries({ queryKey: ['rk-detail', rkId, bulan, tahun] });
    } catch (error: any) {
      await queryClient.invalidateQueries({ queryKey: ['rk-detail', rkId, bulan, tahun] });
      toast.error(`Gagal menyimpan nilai: ${error.message || 'Error server'}`);
    }
  };

  const filteredUploads = useMemo(() => {
    if (!searchQuery.trim()) return uploads;
    const q = searchQuery.toLowerCase();
    return uploads.filter(u =>
      u.user?.full_name?.toLowerCase().includes(q) ||
      u.user?.nip?.toLowerCase().includes(q)
    );
  }, [uploads, searchQuery]);

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

  const bulanNama = getBulanName(bulan);
  
  const evaluatedCount = uploads.filter(u => {
    const rkEntries = entries.filter(e => e.upload_id === u.id);
    return rkEntries.length > 0 && rkEntries.every(e => e.nilai !== null);
  }).length;
  
  const pendingCount = uploads.length - evaluatedCount;
  
  const avgProgress = entries.length > 0 ? entries.reduce((s, e) => s + (e.progres || 0), 0) / entries.length : 0;
  const scoredEntries = entries.filter(e => e.nilai !== null);
  const avgScore = scoredEntries.length > 0 ? scoredEntries.reduce((s, e) => s + (e.nilai || 0), 0) / scoredEntries.length : null;

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
        <button onClick={() => router.push('/ketua_tim')} className="flex items-center gap-2 text-[13px] font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
          <ArrowLeft size={14} /> Kembali ke Dashboard
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
          <KPICard icon={<UserIcon size={18} style={{ color: 'var(--primary)' }} />} value={uploads.length} label="Total Pegawai" iconBg="var(--primary-soft)" />
          <KPICard icon={<CheckCircle2 size={18} style={{ color: 'var(--success)' }} />} value={evaluatedCount} label="Selesai Dinilai" iconBg="var(--success-soft)" />
          <KPICard icon={<TrendingUp size={18} style={{ color: 'var(--primary)' }} />} value={`${avgProgress.toFixed(0)}%`} label="Rata-rata Capaian" iconBg="var(--primary-soft)" />
          <KPICard icon={<FileText size={18} style={{ color: 'var(--primary)' }} />} value={avgScore !== null ? avgScore.toFixed(1) : '-'} label="Rata-rata Nilai" iconBg="var(--primary-soft)" />
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Daftar Pegawai ({filteredUploads.length})</h3>
              <p className="text-sm text-slate-500">Berikan nilai Rencana Kinerja untuk masing-masing pegawai di bawah ini.</p>
            </div>
            
            <div className="relative w-full sm:max-w-xs">
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

          <div className="space-y-4">
            {filteredUploads.length > 0 ? (
              filteredUploads.map(upload => {
                const userEntries = entries.filter(e => e.upload_id === upload.id);
                // Assume all entries for this RK by this user have the same score
                const defaultScore = userEntries[0]?.nilai ?? null;
                // Can review if status is submitted, or if it's approved (Ketua Tim can still revise their grades if needed, or we restrict it)
                // Let's allow review for anything except draft
                const canReview = upload.status !== 'draft';
                
                return (
                  <PegawaiRKGroup
                    key={upload.id}
                    upload={upload}
                    entries={userEntries}
                    rkName={rk.rencana_kinerja}
                    canReview={canReview}
                    onSaveScore={handleSaveScore}
                    defaultScore={defaultScore}
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
    </>
  );
}
