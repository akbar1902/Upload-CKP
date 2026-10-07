"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { withTimeoutRetry } from '@/lib/supabase/read';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { DataDukungLink } from '@/components/ckp/data-dukung-link';
import { Skeleton } from '@/components/ui/skeleton';
import { getBulanName, formatDate, getDefaultPeriod } from '@/lib/utils';
import { gradeRencanaKinerjaAction, getRkDetailAction } from '@/app/actions/penilaian';
import { markEntryAction } from '@/app/actions/ckp';
import type { CKPUpload, CKPEntry, User } from '@/types/database';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
  ArrowLeft, FileText, TrendingUp, CheckCircle2, Download,
  RefreshCw, WifiOff, Search, ChevronDown, ChevronUp, User as UserIcon,
  XCircle, AlertTriangle, Layers, FolderOpen
} from 'lucide-react';

function KPICard({ icon, value, label, sub, iconBg }: {
  icon: React.ReactNode; value: string | number; label: string; sub?: string; iconBg: string;
}) {
  return (
    <div className="kpi-card p-5 flex items-start gap-4 min-w-0 overflow-hidden">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-extrabold tracking-tight leading-none tabular-nums break-words" style={{ color: 'var(--text-primary)', fontSize: 'clamp(24px, 3vw, 30px)' }}>{value}</p>
        <p className="text-[14px] font-medium mt-1.5 leading-snug" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {sub && <p className="text-[12.5px] mt-0.5 leading-snug" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─── RK Baris Row ──────────────────────────────────────────────────────────
// Satu baris = 1 pasangan pegawai × RK Anggota (tabel flat, bukan kartu).
// Logika input nilai / expand / monthly dipindah utuh; markup jadi 3 kolom
// Nama | Nama RK + sub-meta | Nilai + chevron, expand = full-width row bawah.
type RowBaris = {
  userId: string;
  nama: string;
  nip?: string;
  rkName: string;
  entries: CKPEntry[];
  uploads: (CKPUpload & { user?: User })[];
  defaultScore: number | null;
  canReview: boolean;
  isOwnGroup: boolean;
};
function RkBarisRow({
  nama,
  nip,
  rkName,
  entries,
  uploads,
  canReview,
  onSaveScore,
  defaultScore,
  isOwnGroup,
  onMarkEntryClick,
  forceExpanded,
  isTriwulan,
  bulan,
}: {
  nama: string;
  nip?: string;
  rkName: string;
  entries: CKPEntry[];
  uploads: CKPUpload[];
  canReview: boolean;
  onSaveScore: (uploadIds: string[], score: number | null, rkAnggotaName: string) => Promise<void>;
  defaultScore: number | null;
  isOwnGroup?: boolean;
  onMarkEntryClick?: (entry: CKPEntry) => void;
  forceExpanded?: boolean;
  isTriwulan?: boolean;
  bulan?: string | number;
}) {
  const [expandedState, setExpandedState] = useState(false);
  // Search TIDAK lagi memaksa detail RK kebuka — user buka-tutup manual.
  // (Dulu forceExpanded bikin detail nyangkut kebuka & tombol nggak mempan.)
  const expanded = expandedState;
  const [score, setScore] = useState<string>(defaultScore?.toString() ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setScore(defaultScore?.toString() ?? '');
  }, [defaultScore]);

  const hasScore = defaultScore !== null;
  const allScored = entries.length > 0 && entries.every(e => e.nilai !== null);
  const avgProgress = entries.length > 0
    ? entries.reduce((s, e) => s + (e.progres || 0), 0) / entries.length
    : 0;

  const uploadIds = useMemo(() => Array.from(new Set(entries.map(e => e.upload_id))), [entries]);

  const handleBlur = async () => {
    const currentSavedStr = defaultScore?.toString() ?? '';
    if (score === currentSavedStr) return;

    if (score === '') {
      setSaving(true);
      try { await onSaveScore(uploadIds, null, rkName); }
      catch { setScore(currentSavedStr); }
      finally { setSaving(false); }
      return;
    }

    const num = parseInt(score, 10);
    if (isNaN(num) || num < 0 || num > 100) {
      toast.error('Nilai harus berupa angka 0-100');
      setScore(currentSavedStr);
      return;
    }

    setSaving(true);
    try { await onSaveScore(uploadIds, num, rkName); }
    catch { setScore(currentSavedStr); }
    finally { setSaving(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
      const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('.score-input:not(:disabled)'));
      const currentIndex = inputs.indexOf(e.currentTarget);
      if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
        inputs[currentIndex + 1].select();
      }
    }
  };

  // Triwulan monthly breakdown
  const monthlyScores = useMemo(() => {
    if (!isTriwulan || !bulan) return [];
    const triwulanMap: Record<string, number[]> = {
      'T1': [1, 2, 3], 'T2': [4, 5, 6], 'T3': [7, 8, 9], 'T4': [10, 11, 12],
    };
    const months = triwulanMap[String(bulan)] || [];
    return months.map(m => {
      const monthUploads = uploads.filter((u: any) => u.bulan === m);
      const monthUploadIds = new Set(monthUploads.map(u => u.id));
      const monthEntries = entries.filter(e => monthUploadIds.has(e.upload_id));
      const scoredEntries = monthEntries.filter(e => e.nilai !== null);
      const avgScore = scoredEntries.length > 0
        ? Math.round(scoredEntries.reduce((s, e) => s + e.nilai!, 0) / scoredEntries.length)
        : null;
      return { bulan: m, bulanNama: getBulanName(m), count: monthEntries.length, score: avgScore };
    }).filter(m => m.count > 0);
  }, [isTriwulan, bulan, uploads, entries]);

  return (
    <div
      className="rounded-xl border overflow-hidden transition-colors"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--card-bg)',
      }}
    >
      {/* Baris 3 kolom: Nama | Nama RK + sub-meta | Nilai + chevron */}
      {/* Mobile (<640px): Nama + Nilai satu baris atas, RK full-width di bawah */}
      <div
        className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(160px,1fr)_minmax(0,2fr)_110px] items-center gap-x-2 gap-y-1 px-2.5 py-2 cursor-pointer hover:bg-[var(--sand-subtle)] transition-colors"
        onClick={() => setExpandedState(!expandedState)}
        tabIndex={0}
        onKeyDown={e => {
          // Abaikan Enter/Space dari dalam input nilai (punya handler sendiri)
          if ((e.target as HTMLElement).closest('input, textarea')) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpandedState(!expandedState);
          }
        }}
      >
        {/* Kolom 1: Nama + avatar */}
        <div className="min-w-0 col-start-1 row-start-1 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0"
            role="img"
            aria-label={`Foto profil ${nama}`}
          >
            <UserIcon size={16} style={{ color: 'var(--primary)' }} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
          <p
            className="text-[13px] font-bold leading-tight truncate"
            style={{ color: 'var(--text-primary)' }}
            title={nama}
          >
            {nama}
          </p>
          {nip && (
            <p
              className="text-[11px] leading-tight truncate mt-[2px]"
              style={{ color: 'var(--text-secondary)' }}
              title={`NIP. ${nip}`}
            >
              NIP. {nip}
            </p>
          )}
          {isOwnGroup && (
            <span className="text-[10px] px-1.5 py-px rounded-full font-semibold" style={{ background: 'var(--warning-soft)', color: 'var(--warning-text)' }}>
              Dinilai pimpinan
            </span>
          )}
          </div>
        </div>

        {/* Kolom 2: Nama RK + sub-meta */}
        <div className="min-w-0 col-span-full row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 flex items-start gap-2">
          <div className="mt-0.5 flex-shrink-0 hidden sm:block">
            <FolderOpen size={14} style={{ color: allScored ? 'var(--primary)' : 'var(--text-tertiary)' }} />
          </div>
          <div className="min-w-0">
            <p
              className="text-[13px] font-medium sm:font-semibold leading-snug line-clamp-2 sm:line-clamp-none"
              style={{ color: 'var(--text-primary)' }}
              title={rkName}
              onClick={e => {
                // Di mobile: ketuk judul untuk baca full (toggle clamp)
                if (window.innerWidth < 640) {
                  e.stopPropagation();
                  (e.currentTarget as HTMLElement).classList.toggle('line-clamp-2');
                }
              }}
            >
              {rkName}
            </p>
            <div className="flex items-center gap-2 mt-px flex-wrap">
              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{entries.length} kegiatan</span>
              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>• Capaian: {avgProgress.toFixed(0)}%</span>
              {allScored && (
                <span className="text-[10px] px-1.5 py-px rounded-full font-semibold" style={{ background: 'var(--success-soft)', color: 'var(--success-text)' }}>
                  Dinilai
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Kolom 3: Nilai + chevron */}
        <div className="flex items-center gap-1.5 ml-auto flex-shrink-0 col-start-2 row-start-1 sm:col-start-3" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col items-end mr-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Nilai</p>
            {canReview ? (
              <div className="relative w-16">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={e => setScore(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  disabled={saving}
                  className="score-input border rounded-lg px-1.5 py-0.5 text-[13px] font-semibold text-center w-full outline-none focus:ring-2 focus:ring-[var(--primary-ring)] transition-shadow disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-tertiary)]"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="—"
                  title="Tekan Enter atau klik di luar untuk menyimpan"
                  aria-label={`Nilai ${rkName} milik ${nama}`}
                />
                {saving && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <RefreshCw size={11} className="animate-spin" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                )}
              </div>
            ) : (
              <span className="text-[14px] font-bold" style={{ color: hasScore ? 'var(--success-text)' : 'var(--text-tertiary)' }}>
                {hasScore ? defaultScore : '—'}
              </span>
            )}
          </div>
          <button
            onClick={() => setExpandedState(!expandedState)}
            aria-expanded={expanded}
            aria-label="Tampilkan detail kegiatan"
            className="p-1 rounded-lg transition-colors bg-slate-50 hover:bg-slate-100 text-slate-400"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded entries — full-width row di bawah baris */}
      {expanded && (
        <div className="border-t p-3.5 space-y-3" style={{ borderColor: 'var(--sand-border)', background: 'var(--sand-subtle)' }}>
          {isTriwulan && monthlyScores.length > 0 && (
            <div className="flex items-stretch gap-2 mb-2">
              {monthlyScores.map(m => (
                <div key={m.bulan} className="flex-1 flex items-center gap-2 py-2 px-3 rounded-lg border" style={{ background: 'var(--primary-soft)', borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{m.bulanNama}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{m.count} kegiatan</p>
                  </div>
                  <span className="text-[16px] font-extrabold" style={{ color: m.score !== null ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                    {m.score !== null ? m.score : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <h6 className="text-[12px] font-bold" style={{ color: 'var(--text-secondary)' }}>Detail Kegiatan</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {entries.map((entry) => (
              <div key={entry.id} className={`p-3.5 rounded-xl shadow-sm border transition-colors ${entry.catatan_koreksi ? 'border-amber-400 bg-amber-50/30' : 'border-[var(--sand-border)] bg-[var(--card-bg)]'}`}>
                <div className="flex flex-col h-full">
                  <div className="flex-1 mb-2.5">
                    <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{entry.kegiatan || '—'}</p>
                    <p className="text-[12px] mt-1 whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{entry.capaian || '—'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2.5 border-t flex-wrap gap-y-1.5" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded whitespace-nowrap" style={{ color: 'var(--text-tertiary)', background: 'var(--bg-secondary)' }}>#{ entry.row_number}</span>
                      <span className="text-[11px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(entry.tanggal_mulai)}
                        {entry.tanggal_selesai && entry.tanggal_selesai !== entry.tanggal_mulai && (
                          <> — {formatDate(entry.tanggal_selesai)}</>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {entry.data_dukung && <DataDukungLink value={entry.data_dukung} />}
                      {canReview && onMarkEntryClick && (
                        <button
                          onClick={() => onMarkEntryClick(entry)}
                          className="p-1 rounded-md transition-colors"
                          style={{ color: 'var(--amber-600)', background: 'var(--amber-50)' }}
                          title="Tandai Perlu Diperbaiki"
                        >
                          <AlertTriangle size={13} />
                        </button>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Progres:</span>
                        <span className={`text-[11px] font-bold ${entry.progres >= 100 ? 'text-[var(--success)]' : 'text-[var(--primary)]'}`}>{entry.progres}%</span>
                      </div>
                      {entry.nilai !== null && (
                        <div className="flex items-center gap-1 pl-2">
                          <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Nilai:</span>
                          <span className="text-[11px] font-bold" style={{ color: 'var(--success)' }}>{entry.nilai}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {entry.catatan_koreksi && (
                    <div className="mt-2.5 p-2.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-[11px] flex items-start gap-1.5">
                      <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block mb-0.5">Catatan:</span>
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
    queryKey: ['rk-detail', rkId, bulan, tahun],
    queryFn: () =>
      withTimeoutRetry(
        async () => {
          const res = await getRkDetailAction(rkId, bulan, tahun);
          if (!res.success) throw new Error(res.error);
          return res.data;
        },
        { attempts: 2, timeoutMs: 15000 }
      ),
    enabled: !!currentUser && !authLoading && !!rkId,
    networkMode: 'always',
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
    retry: false,
  });

  const loading = authLoading || (!data && queryPending);
  const rk = data?.rk || null;
  const entries: CKPEntry[] = data?.entries || [];
  const uploads: (CKPUpload & { user?: User })[] = data?.uploads || [];
  const error = queryError ? queryError.message : null;

  // ─── Save score per (uploadIds, rkAnggotaName) ───────────────────────────
  // uploadIds: upload ids yang entry-nya mengandung rkAnggotaName
  // rkAnggotaName: nama RK Anggota spesifik yang ingin dinilai
  const handleSaveScore = async (uploadIds: string[], score: number | null, rkAnggotaName: string) => {
    if (!rk) return;

    const rkDetailKey = ['rk-detail', rkId, bulan, tahun];
    await queryClient.cancelQueries({ queryKey: rkDetailKey });
    const previousData = queryClient.getQueryData(rkDetailKey);

    // Optimistic update — hanya entry yang sesuai upload_id DAN rencana_kinerja
    queryClient.setQueryData(rkDetailKey, (old: any) => {
      if (!old) return old;
      const uploadIdsSet = new Set(uploadIds);
      const newEntries = old.entries.map((e: any) =>
        uploadIdsSet.has(e.upload_id) && e.rencana_kinerja === rkAnggotaName
          ? { ...e, nilai: score, dinilai_oleh: score !== null ? currentUser?.id : null }
          : e
      );
      return { ...old, entries: newEntries };
    });

    try {
      // Kirim rkId sebagai rkKetuaTimId agar grading action bisa filter tepat
      const result = await gradeRencanaKinerjaAction(uploadIds, rkAnggotaName, score, rkId);
      if (!result.success) throw new Error(result.error);
      void queryClient.invalidateQueries({ queryKey: ['rk-detail'] });
      void queryClient.invalidateQueries({ queryKey: ['ketua-tim-uploads'] });
      void queryClient.invalidateQueries({ queryKey: ['ckp-detail'] });
      void queryClient.invalidateQueries({ queryKey: ['pegawai-uploads'] });
      void queryClient.invalidateQueries({ queryKey: ['pimpinan-uploads'] });
    } catch (err: any) {
      queryClient.setQueryData(rkDetailKey, previousData);
      toast.error(`Gagal menyimpan nilai: ${err.message || 'Error server'}`);
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

  // ─── Build user + RK Anggota groups, lalu flatten ke baris ──────────────
  // sections dipertahankan untuk Export Excel; render memakai rows (flat).
  const { filteredPegawaiSections, totalDisplayedUsers, totalRkAnggota, rows } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const isTriwulan = typeof bulan === 'string' && bulan.startsWith('T');

    // Group uploads per user
    const userMap: Record<string, { user: User; uploads: (CKPUpload & { user?: User })[] }> = {};
    for (const upload of uploads) {
      const uid = upload.user_id;
      if (!userMap[uid] && upload.user) {
        userMap[uid] = { user: upload.user, uploads: [] };
      }
      if (userMap[uid]) {
        userMap[uid].uploads.push(upload);
      }
    }

    const sections = Object.values(userMap).map(({ user, uploads: userUploads }) => {
      const userUploadIds = userUploads.map(u => u.id);
      const userEntries = entries.filter(e => userUploadIds.includes(e.upload_id));

      // Sub-group entries by RK Anggota name (rencana_kinerja)
      const rkMap: Record<string, CKPEntry[]> = {};
      for (const entry of userEntries) {
        const rkName = entry.rencana_kinerja || '(Tanpa RK)';
        if (!rkMap[rkName]) rkMap[rkName] = [];
        rkMap[rkName].push(entry);
      }

      const rkGroups = Object.entries(rkMap).map(([rkName, rkEntries]) => {
        // Sort entries by month then row_number
        rkEntries.sort((a, b) => {
          const aUpload = userUploads.find(u => u.id === a.upload_id);
          const bUpload = userUploads.find(u => u.id === b.upload_id);
          const mDiff = ((aUpload as any)?.bulan || 0) - ((bUpload as any)?.bulan || 0);
          if (mDiff !== 0) return mDiff;
          return (a.row_number || 0) - (b.row_number || 0);
        });

        // Compute defaultScore: hanya tampilkan jika SEMUA entry RK Anggota ini sudah dinilai
        const scoredEntries = rkEntries.filter(e => e.nilai !== null);
        let defaultScore: number | null = null;
        if (scoredEntries.length === rkEntries.length && rkEntries.length > 0) {
          const avg = scoredEntries.reduce((s, e) => s + e.nilai!, 0) / scoredEntries.length;
          defaultScore = Math.round(avg);
        }

        // canReview: upload tidak approved dan bukan mode triwulan
        const rkUploadIds = new Set(rkEntries.map(e => e.upload_id));
        const rkUploads = userUploads.filter(u => rkUploadIds.has(u.id));
        const isApproved = rkUploads.some(u => u.status === 'approved');
        // Ketua tim tidak boleh menilai dirinya sendiri — grup milik sendiri
        // selalu read-only (dinilai pimpinan), walau tampil di daftar.
        const isOwnGroup = currentUser?.role === 'ketua_tim' && user.id === currentUser?.id;
        const canReview = !isTriwulan && !isApproved && !isOwnGroup && rkUploads.some(u => u.status !== 'draft');

        return { rkName, entries: rkEntries, defaultScore, canReview, isOwnGroup };
      });

      // Search filter: nama pegawai, lalu RK/kegiatan/capaian di bawah
      const userMatches = !q ||
        user.full_name?.toLowerCase().includes(q) ||
        user.nip?.toLowerCase().includes(q);

      const filteredRkGroups = q && !userMatches
        ? rkGroups.filter(g =>
          g.rkName.toLowerCase().includes(q) ||
          g.entries.some(e => e.kegiatan?.toLowerCase().includes(q) || e.capaian?.toLowerCase().includes(q))
        )
        : rkGroups;

      if (filteredRkGroups.length === 0) return null;

      return { user, uploads: userUploads, rkGroups: filteredRkGroups };
    }).filter(Boolean) as { user: User; uploads: (CKPUpload & { user?: User })[]; rkGroups: { rkName: string; entries: CKPEntry[]; defaultScore: number | null; canReview: boolean; isOwnGroup?: boolean }[] }[];

    const totalRkAnggota = sections.reduce((s, sec) => s + sec.rkGroups.length, 0);

    // Flatten: satu baris = 1 pasangan pegawai × RK Anggota (nama diulang).
    // Sort final: nama A-Z lalu rkName A-Z (localeCompare 'id').
    const rows: RowBaris[] = [];
    for (const sec of sections) {
      const nama = sec.user.full_name || 'Pegawai';
      const nip = sec.user.nip || undefined;
      for (const g of sec.rkGroups) {
        rows.push({
          userId: sec.user.id,
          nama,
          nip,
          rkName: g.rkName,
          entries: g.entries,
          uploads: sec.uploads,
          defaultScore: g.defaultScore,
          canReview: g.canReview,
          isOwnGroup: !!g.isOwnGroup,
        });
      }
    }
    rows.sort((a, b) =>
      (a.nama || '').localeCompare(b.nama || '', 'id') ||
      (a.rkName || '').localeCompare(b.rkName || '', 'id')
    );

    return { filteredPegawaiSections: sections, totalDisplayedUsers: sections.length, totalRkAnggota, rows };
  }, [uploads, entries, searchQuery, bulan]);

  // ─── KPI calculations ───────────────────────────────────────────────────
  const uniqueUsersCount = useMemo(() => new Set(uploads.map(u => u.user_id)).size, [uploads]);

  const evaluatedUsersCount = useMemo(() => {
    const userMap: Record<string, CKPEntry[]> = {};
    for (const e of entries) {
      const upload = uploads.find(u => u.id === e.upload_id);
      if (!upload) continue;
      if (!userMap[upload.user_id]) userMap[upload.user_id] = [];
      userMap[upload.user_id].push(e);
    }
    return Object.values(userMap).filter(ents =>
      ents.length > 0 && ents.every(e => e.nilai !== null)
    ).length;
  }, [uploads, entries]);

  const avgProgress = entries.length > 0
    ? entries.reduce((s, e) => s + (e.progres || 0), 0) / entries.length
    : 0;

  const scoredEntries = entries.filter(e => e.nilai !== null);
  let avgScoreRaw: number | null = null;
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
    userScores.forEach(val => { sumOfUserAverages += (val.total / val.count); });
    if (userScores.size > 0) avgScoreRaw = sumOfUserAverages / userScores.size;
  }

  const getPeriodName = (p: string | number) => {
    if (typeof p === 'string' && p.startsWith('T')) {
      const tMap: Record<string, string> = {
        'T1': 'Triwulan I (Jan-Mar)', 'T2': 'Triwulan II (Apr-Jun)',
        'T3': 'Triwulan III (Jul-Sep)', 'T4': 'Triwulan IV (Okt-Des)',
      };
      return tMap[p] || p;
    }
    return getBulanName(p as number);
  };

  const bulanNama = getPeriodName(bulan);
  const isTriwulanMode = typeof bulan === 'string' && bulan.startsWith('T');

  const handleExportExcel = () => {
    if (!rk || filteredPegawaiSections.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }
    const headerRows = [
      ['REKAP NILAI RK ANGGOTA'],
      [rk.rencana_kinerja || ''],
      [`Tim: ${rk.tim_kerja || '-'} • Periode: ${bulanNama} ${tahun}`],
      [],
    ];
    const dataHeaders = ['No', 'Nama Pegawai', 'NIP', 'RK Anggota', 'Jml Kegiatan', 'Capaian (%)', 'Nilai'];
    const dataRows: (string | number)[][] = [];
    let no = 1;
    for (const sec of filteredPegawaiSections) {
      for (const g of sec.rkGroups) {
        const capaian = g.entries.length > 0
          ? g.entries.reduce((s, e) => s + (e.progres || 0), 0) / g.entries.length
          : 0;
        dataRows.push([
          no++,
          sec.user.full_name || '-',
          sec.user.nip || '-',
          (g as any).rkName || '-',
          g.entries.length,
          Math.round(capaian),
          g.defaultScore !== null ? g.defaultScore : '-',
        ]);
      }
    }
    if (dataRows.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([...headerRows, dataHeaders, ...dataRows]);
    ws['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 22 }, { wch: 60 }, { wch: 13 }, { wch: 12 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap_Nilai');
    const safeRk = (rk.rencana_kinerja || 'RK').replace(/[\\/:*?"<>|]/g, '').slice(0, 50);
    XLSX.writeFile(wb, `Rekap_${safeRk}_${bulanNama}_${tahun}.xlsx`);
    toast.success('Rekap Excel berhasil diunduh');
  };

  if (error && !loading && !rk) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-md mx-auto text-center py-24">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'var(--sand-subtle)' }}>
            <WifiOff className="h-6 w-6" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Gagal Memuat Data</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button onClick={() => refetch()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--primary)] text-white">
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

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors w-fit border border-slate-200 shadow-sm"
          title="Kembali ke Dashboard"
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </button>

        {/* Page title */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <p className="text-[12px] mb-2 font-semibold uppercase tracking-wider text-[var(--primary)]">
              Detail Penilaian RK • {bulanNama} {tahun}
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 leading-tight max-w-3xl">
              {rk.rencana_kinerja}
            </h2>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="text-[13px] font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                Tim: {rk.tim_kerja || '—'}
              </span>
              {isTriwulanMode && (
                <span className="text-[12px] font-medium px-3 py-1 rounded-full" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                  Mode Triwulan — Nilai terkunci
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors w-fit shadow-sm flex-shrink-0"
            title="Unduh rekap nilai RK Anggota ke Excel"
          >
            <Download size={16} /> Export Excel
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={<UserIcon size={18} style={{ color: 'var(--primary)' }} />} value={uniqueUsersCount} label="Total Pegawai" iconBg="var(--primary-soft)" />
          <KPICard icon={<Layers size={18} style={{ color: 'var(--warning)' }} />} value={totalRkAnggota} label="Total RK Anggota" sub="Yang perlu dinilai" iconBg="var(--warning-soft)" />
          <KPICard icon={<CheckCircle2 size={18} style={{ color: 'var(--success)' }} />} value={evaluatedUsersCount} label="Pegawai Selesai" sub="Semua RK-nya dinilai" iconBg="var(--success-soft)" />
          <KPICard
            icon={<TrendingUp size={18} style={{ color: 'var(--primary)' }} />}
            value={avgScoreRaw !== null ? (isTriwulanMode ? Math.round(avgScoreRaw) : avgScoreRaw.toFixed(1)) : '—'}
            label="Rata-rata Nilai"
            iconBg="var(--primary-soft)"
          />
        </div>

        {/* Pegawai list */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Daftar Pegawai ({totalDisplayedUsers})
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Nilai setiap <strong>RK Anggota</strong> yang di-submit oleh masing-masing pegawai.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Cari pegawai atau RK..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 h-10 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-ring)]/20"
              />
            </div>
          </div>

          <div>
            <div className="hidden sm:grid grid-cols-[minmax(160px,1fr)_minmax(0,2fr)_110px] gap-x-2 px-2.5 py-2 rounded-xl border bg-white" style={{ borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Nama</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Rencana Kinerja</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--text-tertiary)' }}>Nilai</p>
            </div>
            {rows.length > 0 ? (
              <div className="space-y-2.5 mt-2.5">
              {rows.map((row) => (
                <RkBarisRow
                  key={`${row.userId}::${row.rkName}`}
                  nama={row.nama}
                  nip={row.nip}
                  rkName={row.rkName}
                  entries={row.entries}
                  uploads={row.uploads}
                  canReview={row.canReview}
                  onSaveScore={handleSaveScore}
                  defaultScore={row.defaultScore}
                  isOwnGroup={row.isOwnGroup}
                  onMarkEntryClick={(entry) => {
                    setEntryToMark(entry);
                    setCatatanKoreksi(entry.catatan_koreksi || '');
                  }}
                  forceExpanded={!!searchQuery.trim()}
                  isTriwulan={isTriwulanMode}
                  bulan={bulan}
                />
              ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                <UserIcon className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Tidak ada pegawai yang ditemukan.</p>
                {uploads.length === 0 && (
                  <p className="text-xs text-slate-400 mt-1">Belum ada pegawai yang mengupload CKP untuk RK Ketua Tim ini pada periode ini.</p>
                )}
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
            <div className="p-5 flex justify-end gap-3 border-t" style={{ borderColor: 'var(--sand-border)', background: 'var(--sand-subtle)' }}>
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
