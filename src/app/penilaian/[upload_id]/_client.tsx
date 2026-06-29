"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import type { CKPUpload, CKPEntry, Approval, User, ApprovalAction } from '@/types/database';
import { toast } from 'sonner';
import {
  ArrowLeft, Download, FileText, TrendingUp, CheckCircle2, Folder, Clock, Users, XCircle,
  RefreshCw, MessageSquare, Unlock, User as UserIcon, WifiOff,
  Briefcase, Search, ChevronDown, ChevronUp, Save, LayoutList
} from 'lucide-react';

const STATUS_CFG = {
  submitted: { label: 'Menunggu Review', cls: 'badge-submitted', dot: '🟡' },
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
        <p className="text-3xl font-extrabold tracking-tight leading-none text-slate-900">{value}</p>
        <p className="text-[13px] font-medium mt-1 text-slate-900">{label}</p>
        {sub && <p className="text-[11px] mt-0.5 text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}

function RencanaKinerjaGroup({
  rkName,
  entries,
  canReview,
  onSaveScore,
  defaultScore
}: {
  rkName: string;
  entries: CKPEntry[];
  canReview: boolean;
  onSaveScore: (rk: string, score: number | null) => Promise<void>;
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
  const dinilaiOleh = entries[0]?.dinilai_oleh;

  return (
    <div className="activity-card mb-4" aria-expanded={expanded}>
      {/* Header */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Rencana Kinerja</p>
          <h4 className="text-[15px] font-bold text-slate-800 leading-snug">{rkName || 'Tidak ada nama Rencana Kinerja'}</h4>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[12px] text-slate-500">{entries.length} Kegiatan</span>
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
                    className="border rounded-lg px-3 py-1.5 text-[14px] font-semibold text-center w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:bg-slate-100 disabled:text-slate-400"
                    placeholder="-"
                    title="Tekan Enter atau klik di luar untuk menyimpan"
                  />
                  {saving && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <RefreshCw size={12} className="animate-spin text-slate-400" />
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
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors ml-2 self-end"
          >
            {expanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-4">
          <h5 className="text-[13px] font-bold text-slate-700">Daftar Kegiatan</h5>
          <div className="space-y-3">
            {entries.map((entry, idx) => (
              <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                  <div>
                    <p className="text-[13px] font-medium text-slate-800">{entry.kegiatan || '—'}</p>
                    <p className="text-[12px] text-slate-500 mt-1 whitespace-pre-wrap">{entry.capaian || '—'}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Baris #{entry.row_number}</span>
                      <span className="text-[11px] text-slate-500">{formatDate(entry.tanggal_mulai)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-slate-600">Progres:</span>
                      <span className={`text-[12px] font-bold ${entry.progres >= 100 ? 'text-green-600' : 'text-blue-600'}`}>{entry.progres}%</span>
                    </div>
                    {entry.data_dukung && (
                      <div className="mt-auto">
                        <DataDukungLink value={entry.data_dukung} />
                      </div>
                    )}
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
  const { user: currentUser, loading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [defaultModalAction, setDefaultModalAction] = useState<ApprovalAction>('approved');
  
  const { data, isPending: queryPending, error: queryError, refetch } = useQuery({
    queryKey: ['penilaian-ckp-detail', uploadId],
    queryFn: async () => {
      const { data: uploadData, error: uploadError } = await supabase
        .from('ckp_uploads').select('*').eq('id', uploadId).single();
      if (uploadError) throw new Error(uploadError.message);

      const [employeeRes, entriesRes, approvalsRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', uploadData.user_id).single(),
        supabase.from('ckp_entries').select('*').eq('upload_id', uploadId).order('row_number'),
        supabase.from('approvals').select('*, reviewer:reviewer_id(id, full_name)').eq('upload_id', uploadId).order('created_at', { ascending: false }),
      ]);

      return {
        upload: uploadData as CKPUpload,
        employee: employeeRes.data as User,
        entries: (entriesRes.data as CKPEntry[]) || [],
        approvals: (approvalsRes.data || []).map((a: any) => ({ ...a })) as Approval[],
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
          ? { ...e, nilai: score, dinilai_oleh: currentUser?.id } 
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

  const error = queryError ? queryError.message : null;

  if (error && !loading && !upload) {
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
          <p className="text-slate-500">CKP tidak ditemukan.</p>
          <button onClick={() => router.back()} className="btn-secondary mt-4">
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>
      </>
    );
  }

  // Pimpinan can review and approve, Ketua Tim can review
  const isPimpinan = currentUser?.role === 'pimpinan' || currentUser?.role === 'admin';
  const isKetuaTim = currentUser?.role === 'ketua_tim' || isPimpinan;
  
  const canReview = isKetuaTim && (upload.status === 'submitted' || (isPimpinan && upload.status === 'approved')); 
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
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={14} /> Kembali
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <p className="text-[12px] mb-2 text-slate-500">
              Penilaian &rsaquo; CKP &rsaquo; {bulanNama} {upload.tahun}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Review CKP {bulanNama} {upload.tahun}
              </h2>
              <UploadBadge status={upload.status} />
            </div>

            <div className="flex items-center gap-4 mt-3 flex-wrap bg-white border border-slate-200 py-2 px-4 rounded-xl shadow-sm w-fit">
              <div className="flex items-center gap-2 text-[14px]">
                <UserIcon size={14} className="text-slate-400" />
                <span className="font-bold text-slate-800">{employee.full_name}</span>
              </div>
              <div className="w-px h-4 bg-slate-200"></div>
              {employee.nip && <span className="text-[13px] text-slate-500">NIP: {employee.nip}</span>}
              {employee.unit_kerja && (
                <>
                  <div className="w-px h-4 bg-slate-200"></div>
                  <span className="text-[13px] text-slate-500">{employee.unit_kerja}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-2">
            <button onClick={handleExport} className="btn-secondary">
              <Download size={14} /> Export
            </button>
            {isPimpinan && upload.status === 'submitted' && (
              <button
                onClick={() => { setDefaultModalAction('approved'); setShowApprovalModal(true); }}
                className={`btn-primary ${!allScored ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!allScored}
                title={!allScored ? 'Semua RK harus dinilai sebelum disetujui' : ''}
              >
                <CheckCircle2 size={14} /> Approval Pimpinan
              </button>
            )}
            {canReopen && (
              <button onClick={() => handleApproval('reopened', 'Dibuka kembali oleh pimpinan.')} className="btn-secondary" style={{ color: '#D97706', borderColor: '#FDE68A' }}>
                <Unlock size={14} /> Buka Kembali
              </button>
            )}
          </div>
        </div>

        {upload.catatan_pimpinan && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <MessageSquare size={16} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-[13px] font-bold text-blue-900">Catatan Pimpinan</p>
              <p className="text-[13px] mt-1 text-blue-800">{upload.catatan_pimpinan}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={<FileText size={18} className="text-blue-600" />} value={rkGroups.length} label="Total Rencana Kinerja" iconBg="#EFF6FF" />
          <KPICard icon={<LayoutList size={18} className="text-purple-600" />} value={entries.length} label="Total Kegiatan" iconBg="#F5F3FF" />
          <KPICard icon={<TrendingUp size={18} className="text-green-600" />} value={`${avgPct.toFixed(0)}%`} label="Rata-rata Progres" iconBg="#F0FDF4" />
          <KPICard icon={<CheckCircle2 size={18} className="text-amber-600" />} value={upload.rata_rata_nilai ? upload.rata_rata_nilai.toFixed(1) : '-'} label="Rata-rata Nilai SKP" iconBg="#FEF3C7" />
        </div>

        <div>
          <div className="mb-4">
            <h3 className="text-[20px] font-bold text-slate-900">Penilaian Berdasarkan Rencana Kinerja</h3>
            <p className="text-[13px] text-slate-500">Berikan nilai pada level Rencana Kinerja. Nilai ini akan berlaku untuk seluruh kegiatan di bawahnya.</p>
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
              />
            ))}
            
            {rkGroups.length === 0 && (
              <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl">
                <p className="text-slate-500">Tidak ada Rencana Kinerja yang ditemukan.</p>
              </div>
            )}
          </div>
        </div>

        {approvals.length > 0 && (
          <div className="mt-8">
            <h3 className="text-[20px] font-bold text-slate-900 mb-4">Riwayat Persetujuan</h3>
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
    </>
  );
}
