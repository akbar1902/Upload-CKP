"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { DataDukungLink } from '@/components/ckp/data-dukung-link';
import { ApprovalHistory } from '@/components/ckp/approval-history';
import { ApprovalModal } from '@/components/ckp/approval-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { getBulanName, formatDateTime, formatDate, formatTime } from '@/lib/utils';
import { exportToExcel } from '@/lib/excel/exporter';
import { gradeRencanaKinerjaAction, approveAction } from '@/app/actions/penilaian';
import { moveEntriesAction } from '@/app/actions/ckp';
import type { CKPUpload, CKPEntry, Approval, User, ApprovalAction } from '@/types/database';
import { toast } from 'sonner';
import {
  ArrowLeft, Download, FileText, TrendingUp, CheckCircle2, Folder, Clock, Users, XCircle,
  RefreshCw, MessageSquare, Unlock, User as UserIcon, WifiOff, Lock,
  Briefcase, Search, ChevronDown, ChevronUp, Save, LayoutList, ArrowRightLeft, AlertTriangle
} from 'lucide-react';

const STATUS_CFG = {
  submitted: { label: 'Menunggu Review', cls: 'badge-submitted', dot: '🟡' },
  scored: { label: 'Sudah Dinilai', cls: 'badge-scored', dot: '🟣' },
  approved: { label: 'Disetujui', cls: 'badge-approved', dot: '🟢' },
  rejected: { label: 'Ditolak', cls: 'badge-rejected', dot: '🔴' },
  revision_required: { label: 'Perlu Revisi', cls: 'badge-revision', dot: '🟠' },
  draft: { label: 'Draft', cls: 'badge-draft', dot: '⚪' },
} as const;

function UploadBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status as keyof typeof STATUS_CFG] ?? { label: status, cls: 'badge-draft', dot: '⚪' };
  return (
    <span className={`badge-pill ${cfg.cls}`} role="status">
      <span aria-hidden="true">{cfg.dot}</span> {cfg.label}
    </span>
  );
}

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

function RencanaKinerjaGroup({
  rkName,
  entries,
  canReview,
  onSaveScore,
  defaultScore,
  onMoveEntryClick
}: {
  rkName: string;
  entries: CKPEntry[];
  canReview: boolean;
  onSaveScore: (rk: string, score: number | null) => Promise<void>;
  defaultScore: number | null;
  onMoveEntryClick?: (entry: CKPEntry) => void;
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
        await onSaveScore(rkName, null);
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
      await onSaveScore(rkName, num);
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

  // The scorer's role info could be embedded in the UI if needed
  // For now, if dinilai_oleh is set, it means it has been graded.
  const dinilaiOleh = entries[0]?.dinilai_oleh && entries[0]?.nilai !== null;

  return (
    <div className="activity-card mb-4" aria-expanded={expanded}>
      {/* Header */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Rencana Kinerja</p>
          <h4 className="text-[15px] font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{rkName || 'Tidak ada nama Rencana Kinerja'}</h4>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{entries.length} Kegiatan</span>
            {dinilaiOleh && <span className="badge-pill bg-green-50 text-green-700 text-[10px]">Telah dinilai</span>}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
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
            className="p-2 rounded-lg transition-colors ml-2 self-end"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t p-4 sm:p-5 space-y-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
          <h5 className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Daftar Kegiatan</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(entry.tanggal_mulai)}
                        {entry.tanggal_selesai && entry.tanggal_selesai !== entry.tanggal_mulai && (
                          <> - {formatDate(entry.tanggal_selesai)}</>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      {entry.data_dukung && <DataDukungLink value={entry.data_dukung} />}
                      {canReview && onMoveEntryClick && (
                        <button 
                          onClick={() => onMoveEntryClick(entry)} 
                          className="p-1 rounded-md transition-colors"
                          style={{ color: 'var(--primary)', background: 'var(--primary-soft)' }}
                          title="Pindah ke RK Lain (Koreksi RK)"
                        >
                          <ArrowRightLeft size={14} />
                        </button>
                      )}
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

export default function PenilaianCKPDetailClient({ uploadId }: { uploadId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const { user: currentUser, loading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [defaultModalAction, setDefaultModalAction] = useState<ApprovalAction>('approved');
  const [entryToMove, setEntryToMove] = useState<CKPEntry | null>(null);
  const [targetMoveRk, setTargetMoveRk] = useState<string>('');
  const [isMovingEntry, setIsMovingEntry] = useState(false);
  
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace('/login');
    }
  }, [currentUser, authLoading, router]);

  const { data, isPending: queryPending, error: queryError, refetch } = useQuery({
    queryKey: ['penilaian-ckp-detail', uploadId],
    queryFn: async () => {
      const { data: uploadData, error: uploadError } = await supabase
        .from('ckp_uploads').select('*').eq('id', uploadId).single();
      if (uploadError) throw new Error(uploadError.message);

      const [employeeRes, entriesRes, approvalsRes, masterRkRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', uploadData.user_id).single(),
        supabase.from('ckp_entries').select('*').eq('upload_id', uploadId).order('row_number'),
        supabase.from('approvals').select('*, reviewer:reviewer_id(id, full_name)').eq('upload_id', uploadId).order('created_at', { ascending: false }),
        supabase.from('rk_ketua_tim_mapping').select('rencana_kinerja, tim_kerja').order('rencana_kinerja'),
      ]);

      let entriesData = (entriesRes.data as CKPEntry[]) || [];
      const employeeData = employeeRes.data as User;
      const reviewerRole = currentUser?.role;

      if (source === 'ketua_tim' && reviewerRole === 'pimpinan' && employeeData.role === 'ketua_tim') {
        const { data: rkMapping } = await supabase
          .from('rk_ketua_tim_mapping')
          .select('rencana_kinerja')
          .or(`ketua_tim_id.eq.${employeeData.id},ketua_tim_id.eq.${currentUser?.id}`);
          
        if (rkMapping && rkMapping.length > 0) {
          const ownRks = rkMapping.map((m: any) => m.rencana_kinerja);
          entriesData = entriesData.filter((e: any) => e.rencana_kinerja && ownRks.includes(e.rencana_kinerja));
        } else {
          entriesData = [];
        }
      }

      return {
        upload: uploadData as CKPUpload,
        employee: employeeData,
        entries: entriesData,
        approvals: (approvalsRes.data || []).map((a: any) => ({ ...a })) as Approval[],
        masterRks: masterRkRes.data || [],
      };
    },
    enabled: !!uploadId && !authLoading,
    networkMode: 'always',
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  const loading = authLoading || (!data && queryPending);

  const upload = data?.upload || null;
  const employee = data?.employee || null;
  const entries: CKPEntry[] = data?.entries || [];
  const approvals: Approval[] = data?.approvals || [];
  const masterRks: any[] = data?.masterRks || [];

  // Group entries by RK
  const rkGroups = useMemo(() => {
    const map = new Map<string, CKPEntry[]>();
    entries.forEach(e => {
      const rk = e.rencana_kinerja || 'Tidak Diketahui';
      if (!map.has(rk)) map.set(rk, []);
      map.get(rk)!.push(e);
    });
    return Array.from(map.entries()).map(([rk, entries]) => ({
      rk,
      entries,
      // Assuming all entries in the same RK have the same score if graded at the RK level
      defaultScore: entries[0]?.nilai ?? null
    }));
  }, [entries]);

  const handleApproval = async (action: ApprovalAction, catatan: string) => {
    if (!upload || !currentUser) return;
    
    queryClient.setQueryData(['penilaian-ckp-detail', uploadId], (old: any) => {
      if (!old) return old;
      const isApproved = action === 'approved';
      const newStatus = action === 'reopened' ? 'draft' : action;
      return {
        ...old,
        upload: {
          ...old.upload,
          status: newStatus,
          catatan_pimpinan: catatan || null,
          approved_at: isApproved ? new Date().toISOString() : null,
          approved_by: isApproved ? currentUser.id : null,
        }
      };
    });

    try {
      const result = await approveAction(upload.id, action, catatan || '');
      if (!result.success) throw new Error(result.error);
      toast.success(`Berhasil! CKP diperbarui.`);
      await queryClient.invalidateQueries({ queryKey: ['penilaian-ckp-detail', uploadId] });
      
      const timeoutId = setTimeout(() => {
        router.push(currentUser.role === 'pimpinan' || currentUser.role === 'admin' ? '/pimpinan' : '/ketua_tim');
      }, 1000);
      return () => clearTimeout(timeoutId);
    } catch (error: any) {
      await queryClient.invalidateQueries({ queryKey: ['penilaian-ckp-detail', uploadId] });
      toast.error(`Gagal memproses persetujuan: ${error.message || 'Error server'}`);
    }
  };

  const handleSaveScore = async (rkName: string, score: number | null) => {
    // Optimistic update
    queryClient.setQueryData(['penilaian-ckp-detail', uploadId], (old: any) => {
      if (!old) return old;
      const newEntries = old.entries.map((e: any) => 
        (e.rencana_kinerja || 'Tidak Diketahui') === rkName 
          ? { ...e, nilai: score, dinilai_oleh: score !== null ? currentUser?.id : null } 
          : e
      );
      
      const scored = newEntries.filter((e: any) => e.nilai !== null);
      const newAvg = scored.length > 0 ? scored.reduce((acc: number, e: any) => acc + e.nilai, 0) / scored.length : null;
      
      return { ...old, entries: newEntries, upload: { ...old.upload, rata_rata_nilai: newAvg } };
    });

    try {
      const result = await gradeRencanaKinerjaAction(uploadId, rkName === 'Tidak Diketahui' ? '' : rkName, score);
      if (!result.success) throw new Error(result.error);
      // Validasi ulang secara asinkron (tidak memblokir UI)
      void queryClient.invalidateQueries({ queryKey: ['penilaian-ckp-detail', uploadId] });
    } catch (error: any) {
      await queryClient.invalidateQueries({ queryKey: ['penilaian-ckp-detail', uploadId] });
      toast.error(`Gagal menyimpan nilai: ${error.message || 'Error server'}`);
    }
  };

  const handleExport = () => {
    if (!upload || !employee) return;
    exportToExcel({ upload, entries, user: employee });
    toast.success('File Excel berhasil diunduh');
  };

  const handleExecuteMoveEntry = async () => {
    try {
      if (!entryToMove || !targetMoveRk.trim()) return;
      
      setIsMovingEntry(true);
      const result = await moveEntriesAction([entryToMove.id], targetMoveRk);
        
      if (!result.success) throw new Error(result.error);
      
      toast.success("Kegiatan berhasil dipindah ke RK yang baru.");
      setEntryToMove(null);
      setTargetMoveRk('');
      refetch();
    } catch (err: any) {
      toast.error("Gagal memindahkan kegiatan: " + (err.message || 'Error tidak diketahui'));
    } finally {
      setIsMovingEntry(false);
    }
  };

  const error = queryError ? queryError.message : null;

  if (error && !loading && !upload) {
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'var(--text-primary)', color: 'var(--bg-base)' }}
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
        <div className="p-5 lg:p-8 max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-12 w-64 rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        </div>
      </>
    );
  }

  if (!upload || !employee) {
    return (
      <>
        <Header />
        <div className="p-5 lg:p-8 max-w-4xl mx-auto text-center py-20">
          <p style={{ color: 'var(--text-secondary)' }}>CKP tidak ditemukan.</p>
          <button onClick={() => router.back()} className="btn-secondary mt-4">
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>
      </>
    );
  }

  // Pimpinan can review and approve, Ketua Tim can review
  // Pimpinan can review and approve, Ketua Tim can review. Admin is read-only.
  const isAdmin = currentUser?.role === 'admin';
  const isPimpinan = currentUser?.role === 'pimpinan';
  const isKetuaTim = currentUser?.role === 'ketua_tim' || isPimpinan;
  
  const canReview = isKetuaTim && (upload.status === 'submitted' || upload.status === 'scored' || (isPimpinan && upload.status === 'approved')); 
  // Pimpinan can always override if needed, but typically they change status first. 
  // The user said: "jika bu baiq melakukan penilaian sebelum dinilai oleh ketua tim tidak masalah." and "pimpinan bisa membatalkan approval lalu menilai ulang"
  // So canReview is true if status is submitted or if it's pimpinan modifying an approved one (we can just allow it if status is submitted, and let pimpinan reopen first if it's approved).
  
  const canReopen = isPimpinan && upload.status === 'approved';
  const bulanNama = getBulanName(upload.bulan);
  const avgPct = Math.min(upload.avg_progres || 0, 100);
  
  // All RKs must have a score before approval
  const allScored = rkGroups.every(g => g.defaultScore !== null);

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
          <ArrowLeft size={14} /> Kembali
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <p className="text-[12px] mb-2" style={{ color: 'var(--text-secondary)' }}>
              Dashboard &rsaquo; Review CKP &rsaquo; {bulanNama} {upload.tahun}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Review CKP {bulanNama} {upload.tahun}
              </h2>
              <UploadBadge status={upload.status} />
            </div>

            <div className="flex items-center gap-4 mt-3 flex-wrap py-2 px-4 rounded-xl shadow-sm w-fit"
                 style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2">
                <UserIcon size={14} style={{ color: 'var(--text-tertiary)' }} />
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{employee.full_name}</span>
              </div>
              <div className="w-px h-4" style={{ background: 'var(--border)' }}></div>
              {employee.nip && <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>NIP: {employee.nip}</span>}
              
              {employee.unit_kerja && (
                <>
                  <div className="w-px h-4" style={{ background: 'var(--border)' }}></div>
                  <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{employee.unit_kerja}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-2">
            <button onClick={handleExport} className="btn-secondary">
              <Download size={14} /> Export
            </button>
            <div className="flex gap-2">
              {isAdmin ? (
                <button
                  disabled
                  className="btn-primary opacity-50 cursor-not-allowed"
                >
                  <Lock size={14} className="mr-1" /> View Only (Admin)
                </button>
              ) : isPimpinan && (upload.status === 'submitted' || upload.status === 'scored') ? (
                <button
                  onClick={() => { setDefaultModalAction('approved'); setShowApprovalModal(true); }}
                  className={`btn-primary ${!allScored ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!allScored}
                  title={!allScored ? 'Semua RK harus dinilai sebelum disetujui' : ''}
                >
                  <CheckCircle2 size={14} /> Approval Pimpinan
                </button>
              ) : null}
            </div>
            {canReopen && (
              <button onClick={() => handleApproval('reopened', 'Dibuka kembali oleh pimpinan.')} className="btn-secondary" style={{ color: '#D97706', borderColor: '#FDE68A' }}>
                <Unlock size={14} /> Buka Kembali
              </button>
            )}
          </div>
        </div>

        {upload.catatan_pimpinan && (
          <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: 'var(--warning-soft)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <MessageSquare size={16} style={{ color: 'var(--warning)', marginTop: 2 }} />
            <div>
              <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Catatan Pimpinan</p>
              <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>{upload.catatan_pimpinan}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={<FileText size={18} style={{ color: 'var(--primary)' }} />} value={rkGroups.length} label="Total Rencana Kinerja" iconBg="var(--primary-soft)" />
          <KPICard icon={<LayoutList size={18} style={{ color: 'var(--primary)' }} />} value={entries.length} label="Total Kegiatan" iconBg="var(--primary-soft)" />
          <KPICard icon={<TrendingUp size={18} style={{ color: 'var(--primary)' }} />} value={`${avgPct.toFixed(0)}%`} label="Rata-rata Progres" iconBg="var(--primary-soft)" />
          <KPICard icon={<CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />} value={upload.rata_rata_nilai ? upload.rata_rata_nilai.toFixed(1) : '-'} label="Rata-rata Nilai SKP" iconBg="var(--primary-soft)" />
        </div>

        <div>
          <div className="mb-4">
            <h3 className="text-[20px] font-bold" style={{ color: 'var(--text-primary)' }}>Penilaian Berdasarkan Rencana Kinerja</h3>
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Berikan nilai pada level Rencana Kinerja. Nilai ini akan berlaku untuk seluruh kegiatan di bawahnya.</p>
          </div>

          <div className="space-y-4">
            {rkGroups.map(group => (
              <RencanaKinerjaGroup
                key={group.rk}
                rkName={group.rk}
                entries={group.entries}
                canReview={canReview}
                onSaveScore={handleSaveScore}
                defaultScore={group.defaultScore}
                onMoveEntryClick={(entry) => {
                  setEntryToMove(entry);
                  setTargetMoveRk('');
                }}
              />
            ))}
            
            {rkGroups.length === 0 && (
              <div className="text-center py-12 rounded-2xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Tidak ada Rencana Kinerja yang ditemukan.</p>
              </div>
            )}
          </div>
        </div>

        {approvals.length > 0 && (
          <div className="mt-8">
            <h3 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Riwayat Persetujuan</h3>
            <ApprovalHistory approvals={approvals} />
          </div>
        )}
      </div>

      {showApprovalModal && (
        <ApprovalModal
          open={showApprovalModal}
          onClose={() => setShowApprovalModal(false)}
          onSubmit={async (action: ApprovalAction, note: string) => {
            setShowApprovalModal(false);
            await handleApproval(action, note);
          }}
          employeeName={employee?.full_name || 'Pegawai'}
          period={`${bulanNama} ${upload.tahun}`}
          defaultAction={defaultModalAction}
        />
      )}

      {/* Modal Pindah RK / Koreksi RK */}
      {entryToMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-xl shadow-xl w-full max-w-md overflow-hidden border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
            <div className="p-5 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Pindah/Koreksi Rencana Kinerja</h3>
              <button onClick={() => setEntryToMove(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <XCircle size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
                <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Kegiatan</p>
                <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{entryToMove.kegiatan}</p>
                <p className="text-[11px] mt-2 font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">RK Awal (Salah)</p>
                <p className="text-[13px] font-medium text-red-600 dark:text-red-400">{entryToMove.rencana_kinerja}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Pilih RK Induk Baru</label>
                <input 
                  type="text" 
                  list="master-rk-list"
                  className="w-full text-sm rounded-lg h-10 px-3 outline-none focus:ring-2"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  placeholder="Ketik atau pilih Rencana Kinerja..."
                  value={targetMoveRk}
                  onChange={(e) => setTargetMoveRk(e.target.value)}
                />
                <datalist id="master-rk-list">
                  {masterRks.map((rk, idx) => (
                    <option key={idx} value={rk.rencana_kinerja} />
                  ))}
                </datalist>
                <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  Pilih dari daftar RK yang ada atau ketik manual jika RK tidak ada di daftar. Kegiatan ini akan langsung dipindahkan ke grup RK yang baru.
                </p>
              </div>
            </div>
            <div className="p-5 flex justify-end gap-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
              <button className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors" onClick={() => setEntryToMove(null)}>
                Batal
              </button>
              <button className="btn-primary" onClick={handleExecuteMoveEntry} disabled={isMovingEntry || !targetMoveRk.trim() || targetMoveRk === entryToMove.rencana_kinerja}>
                {isMovingEntry ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
