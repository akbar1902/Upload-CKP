"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { runSafeRead } from '@/lib/supabase/read';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { DataDukungLink } from '@/components/ckp/data-dukung-link';
import { ApprovalHistory } from '@/components/ckp/approval-history';
import { ApprovalModal } from '@/components/ckp/approval-modal';
import { CalendarPreview } from '@/components/ckp/calendar-preview';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge as SharedStatusBadge } from '@/components/dashboard/status-badge';
import { getBulanName, formatDateTime, formatDate, formatTime } from '@/lib/utils';
import { exportToExcel } from '@/lib/excel/exporter';
import { gradeRencanaKinerjaAction, approveAction } from '@/app/actions/penilaian';
import { rkGroupKey, isRkGroupScored, rkGroupAvg, formatScore1, normalizeRkName } from '@/lib/rk-scoring';
import { moveEntriesAction } from '@/app/actions/ckp';
import type { CKPUpload, CKPEntry, Approval, User, ApprovalAction } from '@/types/database';
import { toast } from 'sonner';
import {
  ArrowLeft, Download, FileText, TrendingUp, CheckCircle2, Folder, Clock, Users, XCircle,
  RefreshCw, MessageSquare, Unlock, User as UserIcon, WifiOff, Lock, Calendar,
  Briefcase, Search, ChevronDown, ChevronUp, Save, LayoutList, ArrowRightLeft, AlertTriangle,
  CalendarDays,
} from 'lucide-react';

// Supabase memotong hasil query di 1000 baris per request. Refetch client
// (mis. setelah simpan nilai) harus membaca semua halaman agar entri/persetujuan
// triwulan >1000 baris tidak hilang — samakan perilakunya dengan server page.
type PageableQuery<T> = {
  range(
    from: number,
    to: number
  ): PromiseLike<{ data: T[] | null; error: { message: string } | null }>;
};

async function fetchAllRows<T>(
  buildQuery: () => PageableQuery<T>
): Promise<{ data: T[] | null; error: { message: string } | null }> {
  const PAGE_SIZE = 1000;
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await buildQuery().range(from, from + PAGE_SIZE - 1);
    if (error) return { data: null, error };
    const chunk = data ?? [];
    rows.push(...chunk);
    if (chunk.length < PAGE_SIZE) break;
  }
  return { data: rows, error: null };
}

function UploadBadge({ status }: { status: string }) {
  return <SharedStatusBadge status={status} />;
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
  rkKey,
  parentName,
  entries,
  canReview,
  onSaveScore,
  defaultScore,
  onMoveEntryClick,
  isTriwulan,
  monthlyScores,
}: {
  rkName: string;
  rkKey: string;
  parentName?: string | null;
  entries: CKPEntry[];
  canReview: boolean;
  onSaveScore: (rkKey: string, rkName: string, score: number | null) => Promise<void>;
  defaultScore: number | null;
  onMoveEntryClick?: (entry: CKPEntry) => void;
  isTriwulan?: boolean;
  monthlyScores?: { bulan: number; bulanNama: string; score: number | null; count: number }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [score, setScore] = useState<string>(defaultScore?.toString() ?? '');
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setScore(defaultScore?.toString() ?? '');
  }, [defaultScore]);

  // Bersihkan timer badge "Tersimpan" saat komponen unmount.
  useEffect(() => () => {
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
  }, []);

  const flashSaved = () => {
    setJustSaved(true);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setJustSaved(false), 2000);
  };

  const handleBlur = async () => {
    // Cegah submit dobel untuk RK yang sama selama request berjalan.
    if (saving) return;
    const currentSavedStr = defaultScore?.toString() ?? '';
    if (score === currentSavedStr) return;

    setSaving(true);
    try {
      if (score === '') {
        await onSaveScore(rkKey, rkName, null);
      } else {
        const num = parseInt(score, 10);
        if (isNaN(num) || num < 0 || num > 100) {
          toast.error('Nilai harus berupa angka 0-100');
          setScore(currentSavedStr);
          return;
        }
        await onSaveScore(rkKey, rkName, num);
      }
      flashSaved();
    } catch {
      // Parent sudah menampilkan toast error; di sini cukup kembalikan nilai lama.
      setScore(currentSavedStr);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.currentTarget.blur();
  };

  const hasScore = defaultScore !== null;
  const dinilaiOleh = entries[0]?.dinilai_oleh && entries[0]?.nilai !== null;

  return (
    <div className="activity-card mb-4" aria-expanded={expanded}>
      {/* Header — klik area kiri (nama RK) untuk expand/collapse */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Left: nama RK — seluruhnya bisa diklik */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex-1 min-w-0 text-left p-4 sm:p-5 cursor-pointer"
          aria-label={expanded ? 'Tutup detail kegiatan' : 'Lihat detail kegiatan'}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Rencana Kinerja</p>
          <h4 className="text-[15px] font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{rkName || 'Tidak ada nama Rencana Kinerja'}</h4>
          {parentName && normalizeRkName(parentName) !== normalizeRkName(rkName) && (
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Induk: {parentName}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              {entries.length} Kegiatan
            </span>
            {dinilaiOleh && <span className="badge-pill bg-[var(--success-soft)] text-[var(--success-text)] text-[10px]">Telah dinilai</span>}
          </div>
        </button>

        {/* Right: nilai + chevron */}
        <div className="flex items-center gap-3 pr-4 sm:pr-5 pb-4 sm:pb-0 w-full sm:w-auto justify-end sm:justify-start">
          <div className="flex flex-col items-end">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Nilai RK</p>
            {isTriwulan ? (
              <div className="flex flex-col items-end">
                <span className="text-[17px] font-bold" style={{ color: hasScore ? 'var(--success-text)' : 'var(--text-tertiary)' }}>
                  {hasScore ? formatScore1(defaultScore) : '-'}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Rata-rata triwulan
                </span>
              </div>
            ) : canReview ? (
              <div>
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
                    aria-busy={saving}
                    className="border rounded-lg px-3 py-1.5 text-[14px] font-semibold text-center w-full outline-none focus:ring-2 focus:ring-[var(--primary-ring)] transition-shadow disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-tertiary)]"
                    placeholder="-"
                    title="Tekan Enter atau klik di luar untuk menyimpan"
                  />
                  {saving && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <RefreshCw size={12} className="animate-spin" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                  )}
                </div>
                {/* Umpan balik simpan: "Menyimpan…" saat request, badge hijau ±2 dtk saat sukses */}
                <div className="mt-1 min-h-[14px]" aria-live="polite">
                  {saving ? (
                    <span className="text-[10px] font-medium flex items-center justify-end gap-1" style={{ color: 'var(--text-secondary)' }}>
                      Menyimpan…
                    </span>
                  ) : justSaved ? (
                    <span className="text-[10px] font-semibold flex items-center justify-end gap-1 animate-fade-in" style={{ color: 'var(--success-text)' }}>
                      <CheckCircle2 size={11} /> Tersimpan
                    </span>
                  ) : null}
                </div>
              </div>
            ) : (
              <span className="text-[16px] font-bold" style={{ color: hasScore ? 'var(--success-text)' : 'var(--text-tertiary)' }}>
                {hasScore ? formatScore1(defaultScore) : '-'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            aria-label={expanded ? 'Tutup' : 'Buka'}
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t p-4 sm:p-5 space-y-4" style={{ borderColor: 'var(--sand-border)', background: 'var(--sand-subtle)' }}>
          {isTriwulan && monthlyScores && monthlyScores.length > 0 && (
            <div className="flex items-stretch gap-2.5">
              {monthlyScores.map(m => (
                <div key={m.bulan} className="flex-1 flex items-center gap-3 py-2.5 px-3.5 rounded-xl transition-shadow hover:shadow-md" style={{ background: 'var(--primary-soft)', borderLeft: '3px solid var(--primary)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{m.bulanNama}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{m.count} kegiatan</p>
                  </div>
                  <span className="text-[18px] font-extrabold leading-none" style={{ color: m.score !== null ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                    {m.score !== null ? m.score : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}

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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] px-2 py-0.5 rounded" style={{ color: 'var(--text-tertiary)', background: 'var(--bg-secondary)' }}>
                        Baris #{entry.row_number}
                        {(entry as any).bulan && ` • ${getBulanName((entry as any).bulan).slice(0, 3)}`}
                      </span>
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
  const paramBulan = searchParams.get('bulan');
  const paramTahun = searchParams.get('tahun');
  const isTriwulan = typeof paramBulan === 'string' && paramBulan.startsWith('T');

  const { user: currentUser, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [defaultModalAction, setDefaultModalAction] = useState<ApprovalAction>('approved');
  const [entryToMove, setEntryToMove] = useState<CKPEntry | null>(null);
  const [targetMoveRk, setTargetMoveRk] = useState<string>('');
  const [isMovingEntry, setIsMovingEntry] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [rkSearch, setRkSearch] = useState('');
  const [showReopenConfirm, setShowReopenConfirm] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  // Timer redirect setelah approve — disimpan di ref agar bisa dibersihkan saat unmount.
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace('/login');
    }
  }, [currentUser, authLoading, router]);

  useEffect(() => () => {
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
  }, []);

  const { data, isPending: queryPending, error: queryError, refetch } = useQuery({
    queryKey: ['penilaian-ckp-detail', uploadId, paramBulan || '', paramTahun || ''],
    queryFn: () =>
      runSafeRead(async (supabase, signal) => {
      const { data: uploadData, error: uploadError } = await supabase
        .from('ckp_uploads').select('*').eq('id', uploadId).abortSignal(signal).single();
      if (uploadError) throw new Error(uploadError.message);

      let targetUploads = [uploadData];
      let targetUploadIds = [uploadId];
      const targetYear = paramTahun ? parseInt(paramTahun, 10) : uploadData.tahun;

      if (isTriwulan) {
        const triwulanMap: Record<string, number[]> = {
          'T1': [1, 2, 3],
          'T2': [4, 5, 6],
          'T3': [7, 8, 9],
          'T4': [10, 11, 12],
        };
        const targetMonths = triwulanMap[paramBulan!] || [];

        const { data: qUploads } = await supabase
          .from('ckp_uploads')
          .select('*')
          .eq('user_id', uploadData.user_id)
          .eq('tahun', targetYear)
          .in('bulan', targetMonths)
          .order('bulan', { ascending: true })
          .abortSignal(signal);

        if (qUploads && qUploads.length > 0) {
          targetUploads = qUploads;
          targetUploadIds = qUploads.map((u: any) => u.id);
        }
      }

      const [employeeRes, entriesRes, approvalsRes, masterRkRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', uploadData.user_id).abortSignal(signal).single(),
        fetchAllRows<CKPEntry>(() =>
          supabase.from('ckp_entries').select('*').in('upload_id', targetUploadIds).order('row_number').abortSignal(signal)
        ),
        fetchAllRows<Approval>(() =>
          supabase.from('approvals').select('*, reviewer:reviewer_id(id, full_name)').in('upload_id', targetUploadIds).order('created_at', { ascending: false }).abortSignal(signal)
        ),
        supabase.from('rk_ketua_tim_mapping').select('id, rencana_kinerja, tim_kerja').eq('is_active', true).order('rencana_kinerja').abortSignal(signal),
      ]);

      const uploadMonthMap = new Map(targetUploads.map((u: any) => [u.id, u.bulan]));
      const rawEntries = ((entriesRes.data as CKPEntry[]) || []).map((e: any) => ({
        ...e,
        bulan: uploadMonthMap.get(e.upload_id) ?? uploadData.bulan,
      }));
      let entriesData = rawEntries;
      const employeeData = employeeRes.data as User;
      const reviewerRole = currentUser?.role;

      if (source === 'ketua_tim' && reviewerRole === 'pimpinan' && employeeData.role === 'ketua_tim') {
        const { data: rkMapping } = await supabase
          .from('rk_ketua_tim_mapping')
          .select('id, rencana_kinerja')
          .or(`ketua_tim_id.eq.${employeeData.id},ketua_tim_id.eq.${currentUser?.id}`)
          .eq('is_active', true)
          .abortSignal(signal);

        if (rkMapping && rkMapping.length > 0) {
          const ownRkIds = new Set(rkMapping.map((m: any) => m.id).filter(Boolean));
          const ownRkNorms = new Set(rkMapping.map((m: any) => normalizeRkName(m.rencana_kinerja)));
          entriesData = entriesData.filter((e: any) =>
            (e.rk_ketua_tim_id && ownRkIds.has(e.rk_ketua_tim_id)) ||
            (!e.rk_ketua_tim_id && e.rencana_kinerja && ownRkNorms.has(normalizeRkName(e.rencana_kinerja)))
          );
        } else {
          entriesData = [];
        }
      }

      let finalUpload = uploadData as CKPUpload;
      if (isTriwulan) {
        const totalEntries = entriesData.length;
        const avgProgres = targetUploads.reduce((sum: number, u: any) => sum + (u.avg_progres || 0), 0) / targetUploads.length;
        const scoredUploads = targetUploads.filter((u: any) => u.rata_rata_nilai !== null && u.rata_rata_nilai !== undefined);
        const avgScore = scoredUploads.length > 0
          ? scoredUploads.reduce((sum: number, u: any) => sum + (u.rata_rata_nilai || 0), 0) / scoredUploads.length
          : null;

        let aggregatedStatus = targetUploads[targetUploads.length - 1].status;
        if (targetUploads.some(u => u.status === 'revision_required')) {
          aggregatedStatus = 'revision_required';
        } else if (targetUploads.some(u => u.status === 'submitted')) {
          aggregatedStatus = 'submitted';
        } else if (targetUploads.some(u => u.status === 'scored')) {
          aggregatedStatus = 'scored';
        } else if (targetUploads.every(u => u.status === 'approved')) {
          aggregatedStatus = 'approved';
        }

        finalUpload = {
          ...targetUploads[targetUploads.length - 1],
          id: uploadId,
          bulan: paramBulan as any,
          tahun: targetYear,
          total_entries: totalEntries,
          avg_progres: avgProgres,
          rata_rata_nilai: avgScore,
          status: aggregatedStatus,
        };
      }

      return {
        upload: finalUpload,
        employee: employeeData,
        entries: entriesData,
        calendarEntries: rawEntries,
        approvals: (approvalsRes.data || []).map((a: any) => ({ ...a })) as Approval[],
        masterRks: masterRkRes.data || [],
        targetUploadIds,
      };
      }),
    enabled: !!uploadId && !authLoading,
    networkMode: 'always',
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    retry: false,
  });

  const loading = authLoading || (!data && queryPending);

  const upload = data?.upload || null;
  const employee = data?.employee || null;
  const entries: CKPEntry[] = data?.entries || [];
  const calendarEntries: CKPEntry[] = (data as any)?.calendarEntries || entries;
  const approvals: Approval[] = data?.approvals || [];
  const masterRks: any[] = data?.masterRks || [];

  // Group entries by RK — kunci grup kontrak (rkGroupKey): 'id:<uuid>' data baru, 'legacy:<nama>' data lama.
  // Key React = group key (bukan nama), label = nama sub-RK + parent bila beda.
  const rkGroups = useMemo(() => {
    const map = new Map<string, { key: string; entries: CKPEntry[]; rkKetuaTimId: string | null; parentName: string | null }>();
    entries.forEach(e => {
      const key = rkGroupKey(e);
      if (!map.has(key)) {
        map.set(key, { key, entries: [], rkKetuaTimId: (e as any).rk_ketua_tim_id ?? null, parentName: null });
      }
      map.get(key)!.entries.push(e);
    });

    return Array.from(map.values()).map(({ key, entries: groupEntries, rkKetuaTimId }) => {
      // Nama tampil: sub-RK pertama (data baru) atau nama legacy (data lama)
      const rk = groupEntries[0]?.rencana_kinerja || 'Tidak Diketahui';
      const parentName = rkKetuaTimId
        ? (masterRks as any[]).find((m: any) => m.id === rkKetuaTimId)?.rencana_kinerja ?? null
        : null;

      if (isTriwulan) {
        const triwulanMonths: Record<string, number[]> = {
          'T1': [1, 2, 3],
          'T2': [4, 5, 6],
          'T3': [7, 8, 9],
          'T4': [10, 11, 12],
        };
        const monthsInQ = triwulanMonths[String(paramBulan)] || [1, 2, 3];

        const monthlyScores: { bulan: number; bulanNama: string; score: number | null; count: number }[] = [];

        monthsInQ.forEach(m => {
          const entriesInMonth = groupEntries.filter(e => (e as any).bulan === m);
          if (entriesInMonth.length > 0) {
            // Avg helper kontrak (1 desimal) dari SEMUA entry bulan itu — bukan find pertama.
            const score = rkGroupAvg(entriesInMonth);
            monthlyScores.push({
              bulan: m,
              bulanNama: getBulanName(m),
              score,
              count: entriesInMonth.length,
            });
          }
        });

        // Avg triwulan via helper kontrak dari nilai bulanan yang ada.
        const monthlyVals = monthlyScores
          .filter(ms => ms.score !== null)
          .map(ms => ({ nilai: ms.score as number }));
        const avgScore = rkGroupAvg(monthlyVals);

        return {
          key,
          rk,
          parentName,
          rkKetuaTimId,
          entries: groupEntries,
          defaultScore: avgScore,
          monthlyScores,
          isTriwulan: true,
        };
      } else {
        // defaultScore per grup = avg helper kontrak, hanya bila SEMUA entry scored.
        const defaultScore = isRkGroupScored(groupEntries) ? rkGroupAvg(groupEntries) : null;
        return {
          key,
          rk,
          parentName,
          rkKetuaTimId,
          entries: groupEntries,
          defaultScore,
          monthlyScores: [],
          isTriwulan: false,
        };
      }
    });
  }, [entries, isTriwulan, paramBulan, masterRks]);

  // Filter daftar RK (nama RK / induk / kegiatan / capaian) — untuk jumlah grup banyak.
  const filteredRkGroups = useMemo(() => {
    const q = rkSearch.trim().toLowerCase();
    if (!q) return rkGroups;
    return rkGroups.filter(g =>
      (g.rk || '').toLowerCase().includes(q) ||
      (g.parentName || '').toLowerCase().includes(q) ||
      g.entries.some(e =>
        (e.kegiatan || '').toLowerCase().includes(q) ||
        (e.capaian || '').toLowerCase().includes(q)
      )
    );
  }, [rkGroups, rkSearch]);

  const handleApproval = async (action: ApprovalAction, catatan: string) => {
    if (!upload || !currentUser) return;
    
    const idsToApprove = (isTriwulan && data?.targetUploadIds) ? data.targetUploadIds : [upload.id];
    const isApproved = action === 'approved';
    const isReopened = action === 'reopened';
    const newStatus = isReopened ? (allScored ? 'scored' : 'submitted') : action;

    queryClient.setQueryData(['penilaian-ckp-detail', uploadId, paramBulan || '', paramTahun || ''], (old: any) => {
      if (!old) return old;
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
      for (const id of idsToApprove) {
        const result = await approveAction(id, action, catatan || '');
        if (!result.success) throw new Error(result.error);
      }
      toast.success(isReopened ? 'CKP berhasil dibuka kembali. Anda sekarang dapat mengubah nilai.' : 'Berhasil! CKP diperbarui.');
      await queryClient.invalidateQueries({ queryKey: ['penilaian-ckp-detail'] });
      await queryClient.invalidateQueries({ queryKey: ['ckp-detail'] });
      await queryClient.invalidateQueries({ queryKey: ['pimpinan-uploads'] });
      await queryClient.invalidateQueries({ queryKey: ['ketua-tim-uploads'] });
      await queryClient.invalidateQueries({ queryKey: ['pegawai-uploads'] });
      
      // Jika disetujui, kembali ke daftar dashboard setelah 1 detik.
      // Jika dibuka kembali, tetap di halaman ini agar pimpinan bisa langsung mengubah nilai.
      if (isApproved) {
        // Simpan di ref + bersihkan timer lama supaya redirect tidak dobel
        // dan bisa dibatalkan saat komponen unmount.
        if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = setTimeout(() => {
          const backUrl = (currentUser.role === 'pimpinan' || currentUser.role === 'admin' ? '/pimpinan' : '/ketua_tim') +
            `?bulan=${paramBulan || upload.bulan}&tahun=${paramTahun || upload.tahun}`;
          router.push(backUrl);
        }, 1000);
      }
    } catch (error: any) {
      await queryClient.invalidateQueries({ queryKey: ['penilaian-ckp-detail'] });
      toast.error(`Gagal memproses persetujuan: ${error.message || 'Error server'}`);
    }
  };

  const handleSaveScore = async (rkKey: string, rkName: string, score: number | null) => {
    // Triwulan: kunci save bila >1 upload sekaligus agar rincian bulanan tidak hancur.
    // Server juga menolak (ids.length > 1) — client cegah lebih awal + input triwulan read-only.
    if (isTriwulan && (data?.targetUploadIds?.length ?? 1) > 1) {
      toast.error('Penilaian triwulan dikunci — nilai per bulan agar rincian tidak tercampur');
      throw new Error('Penilaian triwulan dikunci');
    }
    const detailKey = ['penilaian-ckp-detail', uploadId, paramBulan || '', paramTahun || ''];
    const previousData = queryClient.getQueryData(detailKey);

    // Optimistic update — cocokkan by kunci grup kontrak, bukan nama.
    queryClient.setQueryData<{ entries: CKPEntry[]; upload: CKPUpload } | undefined>(detailKey, (old) => {
      if (!old) return old;
      const newEntries = old.entries.map((e) =>
        rkGroupKey(e) === rkKey
          ? { ...e, nilai: score, dinilai_oleh: score !== null ? (currentUser?.id ?? null) : null }
          : e
      );

      const scored = newEntries.filter((e) => e.nilai !== null);
      const newAvg = scored.length > 0 ? scored.reduce((acc: number, e) => acc + (e.nilai as number), 0) / scored.length : null;

      return { ...old, entries: newEntries, upload: { ...old.upload, rata_rata_nilai: newAvg } };
    });

    try {
      // Selalu satu upload per save (server menolak multi-upload) — triwulan dinilai per bulan.
      const targetIds = uploadId;
      const result = await gradeRencanaKinerjaAction(targetIds, rkName === 'Tidak Diketahui' ? '' : rkName, score, rkKey);
      if (!result.success) throw new Error(result.error);
      // Validasi ulang secara asinkron (tidak memblokir UI)
      void queryClient.invalidateQueries({ queryKey: ['penilaian-ckp-detail'] });
      void queryClient.invalidateQueries({ queryKey: ['ckp-detail'] });
      void queryClient.invalidateQueries({ queryKey: ['pegawai-uploads'] });
      void queryClient.invalidateQueries({ queryKey: ['ketua-tim-uploads'] });
      void queryClient.invalidateQueries({ queryKey: ['pimpinan-uploads'] });
    } catch (error: any) {
      // Rollback instan ke data sebelum optimistic update, lalu lempar agar
      // RencanaKinerjaGroup ikut mengembalikan input lokalnya.
      queryClient.setQueryData(detailKey, previousData);
      toast.error(`Gagal menyimpan nilai: ${error.message || 'Error server'}`);
      throw error;
    }
  };

  // Buka kembali lewat Dialog konfirmasi — jelaskan dampak sebelum eksekusi.
  const handleReopenConfirm = async () => {
    setIsReopening(true);
    try {
      await handleApproval('reopened', 'Dibuka kembali oleh pimpinan.');
      setShowReopenConfirm(false);
    } finally {
      setIsReopening(false);
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
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'var(--sand-subtle)' }}>
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
  
  // Nilai hanya bisa diubah ketika status CKP adalah 'submitted' atau 'scored'.
  // Ketika status 'approved', nilai TERKUNCI (read-only) untuk semua pihak.
  // Pimpinan harus menekan tombol 'Buka Kembali' terlebih dahulu untuk membuka kunci nilai dan menilai ulang.
  // Ketua tim tidak boleh menilai CKP miliknya sendiri (dinilai pimpinan).
  const isOwnUpload = !!currentUser && !!upload && currentUser.id === (upload as any).user_id;
  const canReview = isKetuaTim && !isOwnUpload && (upload.status === 'submitted' || upload.status === 'scored');
  
  const canReopen = isPimpinan && upload.status === 'approved';
  const bulanNama = getBulanName(upload.bulan);
  const avgPct = Math.min(upload.avg_progres || 0, 100);
  
  // All RKs must have a score before approval
  const allScored = rkGroups.every(g => g.defaultScore !== null);
  const effectiveStatus = (upload.status === 'scored' && !allScored) 
    ? 'submitted' 
    : upload.status;

  const scoredRks = rkGroups.filter(g => g.defaultScore !== null);
  const avgVals = scoredRks.map(g => ({ nilai: g.defaultScore as number }));
  const avgRkScore = rkGroupAvg(avgVals);
  const displayRataRataNilai = isTriwulan
    ? (avgRkScore !== null ? formatScore1(avgRkScore) : (upload.rata_rata_nilai != null ? formatScore1(upload.rata_rata_nilai) : '-'))
    : (upload.rata_rata_nilai != null ? formatScore1(upload.rata_rata_nilai) : '-');

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
          <ArrowLeft size={14} /> Kembali
        </button>

        {/* ── Page Header (Title on Left, Action Buttons on Right) ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Dashboard &rsaquo; Review CKP &rsaquo; {bulanNama} {upload.tahun}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Review CKP {bulanNama} {upload.tahun}
              </h2>
              <UploadBadge status={effectiveStatus} />
              {upload.version > 1 && (
                <span className="badge-pill badge-draft">v{upload.version}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
            <button onClick={handleExport} className="btn-secondary h-10 px-4 text-[13px] flex items-center gap-1.5 shadow-sm">
              <Download size={14} /> Export
            </button>
            {isAdmin ? (
              <button
                disabled
                className="btn-primary opacity-50 cursor-not-allowed h-10 px-4 text-[13px] flex items-center gap-1.5"
              >
                <Lock size={14} className="mr-1" /> View Only (Admin)
              </button>
            ) : isPimpinan && (upload.status === 'submitted' || upload.status === 'scored') ? (
              <button
                onClick={() => { setDefaultModalAction('approved'); setShowApprovalModal(true); }}
                className={`btn-primary h-10 px-4 text-[13px] flex items-center gap-1.5 shadow-sm ${!allScored ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!allScored}
                title={!allScored ? 'Semua RK harus dinilai sebelum disetujui' : ''}
              >
                <CheckCircle2 size={14} /> Approval Pimpinan
              </button>
            ) : null}
            {canReopen && (
              <button onClick={() => setShowReopenConfirm(true)} className="btn-secondary h-10 px-4 text-[13px] flex items-center gap-1.5 shadow-sm" style={{ color: 'var(--warning-text)', borderColor: 'var(--warning-text)' }}>
                <Unlock size={14} /> Buka Kembali
              </button>
            )}
          </div>
        </div>

        {/* ── Full-Width Employee Identity Card (Simetris sejajar dengan Card KPI di bawahnya) ── */}
        <div className="w-full rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
             style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm"
                 style={{ background: 'var(--primary)' }}>
              {employee.full_name?.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || 'P'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[15px] sm:text-[16px] truncate" style={{ color: 'var(--text-primary)' }}>
                {employee.full_name}
              </h3>
              <div className="flex items-center gap-x-3 gap-y-1 mt-1 text-[12px] sm:text-[13px] flex-wrap" style={{ color: 'var(--text-secondary)' }}>
                {employee.nip && <span>NIP: {employee.nip}</span>}
                {employee.nip && employee.unit_kerja && <span className="opacity-40">•</span>}
                {employee.unit_kerja && <span>{employee.unit_kerja}</span>}
                {employee.jabatan && (
                  <>
                    <span className="opacity-40">•</span>
                    <span>{employee.jabatan}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[12px] self-start sm:self-auto px-3 py-1.5 rounded-lg flex-shrink-0"
               style={{ background: 'var(--card-bg)', color: 'var(--text-secondary)', border: '1px solid var(--sand-border)' }}>
            <Calendar size={13} className="text-slate-400" />
            <span>Periode: <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>{bulanNama} {upload.tahun}</strong></span>
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
          <KPICard icon={<CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />} value={displayRataRataNilai} label="Rata-rata Nilai SKP" iconBg="var(--primary-soft)" />
        </div>

        <div>
          {/* ── Section header + view toggle ── */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-[20px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  {viewMode === 'calendar' ? 'Kalender Kegiatan' : 'Daftar Kegiatan'}
                </h3>
                {/* View mode toggle */}
                <div
                  className="flex items-center rounded-lg overflow-hidden"
                  style={{ border: '1px solid var(--sand-border)', background: 'var(--sand-subtle)' }}
                  role="group"
                  aria-label="Pilih tampilan"
                >
                  <button
                    id="view-toggle-list-penilaian"
                    onClick={() => setViewMode('list')}
                    aria-pressed={viewMode === 'list'}
                    title="Tampilan List"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-all"
                    style={{
                      background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                      color: viewMode === 'list' ? '#fff' : 'var(--text-secondary)',
                    }}
                  >
                    <LayoutList size={13} />
                    <span>List</span>
                  </button>
                  <button
                    id="view-toggle-calendar-penilaian"
                    onClick={() => setViewMode('calendar')}
                    aria-pressed={viewMode === 'calendar'}
                    title="Tampilan Kalender"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-all"
                    style={{
                      background: viewMode === 'calendar' ? 'var(--primary)' : 'transparent',
                      color: viewMode === 'calendar' ? '#fff' : 'var(--text-secondary)',
                    }}
                  >
                    <CalendarDays size={13} />
                    <span>Kalender</span>
                  </button>
                </div>
              </div>
              {viewMode === 'list' && (
                <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {isTriwulan
                    ? 'Menampilkan akumulasi kegiatan dan rata-rata nilai pada level Rencana Kinerja selama triwulan ini.'
                    : 'Berikan nilai pada level Rencana Kinerja. Nilai ini akan berlaku untuk seluruh kegiatan di bawahnya.'}
                </p>
              )}
            </div>

            {/* Search daftar RK — muncul bila ada grup untuk disaring */}
            {viewMode === 'list' && rkGroups.length > 0 && (
              <div className="w-full sm:w-72 flex-shrink-0">
                <div className="search-input">
                  <Search size={15} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                  <input
                    type="search"
                    placeholder="Cari RK atau kegiatan..."
                    value={rkSearch}
                    onChange={(e) => setRkSearch(e.target.value)}
                    aria-label="Cari Rencana Kinerja"
                  />
                </div>
                {rkSearch.trim() && (
                  <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Menampilkan {filteredRkGroups.length} dari {rkGroups.length} RK
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Calendar View ── */}
          {viewMode === 'calendar' ? (
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
            >
              <CalendarPreview
                bulan={upload.bulan}
                tahun={upload.tahun}
                entries={calendarEntries}
              />
            </div>
          ) : (
            /* ── List View (Penilaian per RK) ── */
            <div className="space-y-4">
              {filteredRkGroups.map(group => (
                <RencanaKinerjaGroup
                  key={group.key}
                  rkKey={group.key}
                  rkName={group.rk}
                  parentName={group.parentName}
                  entries={group.entries}
                  canReview={isTriwulan ? false : canReview}
                  onSaveScore={handleSaveScore}
                  defaultScore={group.defaultScore}
                  isTriwulan={isTriwulan}
                  monthlyScores={group.monthlyScores}
                  onMoveEntryClick={(entry) => {
                    setEntryToMove(entry);
                    setTargetMoveRk('');
                  }}
                />
              ))}
              
              {filteredRkGroups.length === 0 && (
                <div className="text-center py-12 rounded-2xl" style={{ background: 'var(--sand-subtle)', border: '1px solid var(--sand-border)' }}>
                  {rkSearch.trim() ? (
                    <>
                      <p style={{ color: 'var(--text-secondary)' }}>Tidak ada RK yang cocok dengan pencarian.</p>
                      <button type="button" onClick={() => setRkSearch('')} className="btn-secondary mt-3 text-[12px]">
                        Hapus pencarian
                      </button>
                    </>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>Tidak ada Rencana Kinerja yang ditemukan.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {approvals.length > 0 && (
          <div className="mt-8">
            <h3 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Riwayat Persetujuan</h3>
            <ApprovalHistory approvals={approvals} />
          </div>
        )}
      </div>

      {/* ── Sticky grading bar: progres nilai + rata-rata + aksi ──
          Selalu nempel di bawah layar agar reviewer tidak perlu scroll
          untuk tahu berapa RK belum dinilai / kenapa Approve disabled. */}
      {canReview && rkGroups.length > 0 && (
        <div
          className="sticky bottom-4 z-30 mt-6 flex flex-col gap-3 rounded-2xl p-4 shadow-lg backdrop-blur-md animate-fade-in sm:flex-row sm:items-center"
          style={{ background: 'color-mix(in srgb, var(--card-bg) 92%, transparent)', border: '1px solid var(--border)' }}
          role="status"
          aria-label={`Progres penilaian: ${scoredRks.length} dari ${rkGroups.length} RK dinilai`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-[13px] font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
              {scoredRks.length}/{rkGroups.length} RK
            </span>
            <div
              className="h-2 flex-1 rounded-full overflow-hidden"
              style={{ background: 'var(--sand-subtle)' }}
              role="progressbar"
              aria-valuenow={scoredRks.length}
              aria-valuemin={0}
              aria-valuemax={rkGroups.length}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${rkGroups.length > 0 ? (scoredRks.length / rkGroups.length) * 100 : 0}%`,
                  background: allScored ? 'var(--success)' : 'var(--primary)',
                }}
              />
            </div>
            <span className="text-[12px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
              rata-rata <strong className="font-bold" style={{ color: 'var(--text-primary)' }}>{displayRataRataNilai}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isPimpinan && (upload.status === 'submitted' || upload.status === 'scored') && (
              <button
                onClick={() => { setDefaultModalAction('approved'); setShowApprovalModal(true); }}
                className="btn-primary h-10 px-4 text-[13px] flex items-center gap-1.5"
                disabled={!allScored}
                title={!allScored ? `${rkGroups.length - scoredRks.length} RK belum dinilai` : 'Setujui CKP'}
              >
                <CheckCircle2 size={14} /> {allScored ? 'Approve' : `Approve (${rkGroups.length - scoredRks.length} kurang)`}
              </button>
            )}
            {canReopen && (
              <button onClick={() => setShowReopenConfirm(true)} className="btn-secondary h-10 px-4 text-[13px] flex items-center gap-1.5">
                <Unlock size={14} /> Buka Kembali
              </button>
            )}
          </div>
        </div>
      )}

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

      {/* Konfirmasi Buka Kembali — jelaskan dampak sebelum nilai dibuka ulang */}
      {showReopenConfirm && (
        <Dialog
          open={showReopenConfirm}
          onClose={() => { if (!isReopening) setShowReopenConfirm(false); }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buka kembali penilaian?</DialogTitle>
              <DialogDescription>
                CKP {employee.full_name} — {bulanNama} {upload.tahun}
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-3">
              <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                Semua nilai pada CKP ini akan{' '}
                <strong style={{ color: 'var(--text-primary)' }}>terbuka untuk dinilai ulang</strong>{' '}
                oleh ketua tim dan pimpinan, dan status CKP kembali ke tahap penilaian.
              </p>
              <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
                Tindakan ini tercatat pada riwayat persetujuan dan pegawai akan menerima notifikasi.
              </p>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReopenConfirm(false)} disabled={isReopening}>
                Batal
              </Button>
              <Button variant="warning" onClick={handleReopenConfirm} loading={isReopening}>
                Ya, Buka Kembali
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <div className="p-3 rounded-lg bg-[var(--primary-soft)] border border-[var(--primary-ring)]">
                <p className="text-[11px] font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Kegiatan</p>
                <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{entryToMove.kegiatan}</p>
                <p className="text-[11px] mt-2 font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">RK Awal (Salah)</p>
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
            <div className="p-5 flex justify-end gap-3 border-t" style={{ borderColor: 'var(--sand-border)', background: 'var(--sand-subtle)' }}>
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
