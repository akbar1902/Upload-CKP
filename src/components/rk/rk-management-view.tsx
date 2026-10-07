"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import {
  ChevronDown,
  Plus,
  Trash2,
  Search,
  X,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  ArrowRightLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { withTimeoutRetry } from '@/lib/supabase/read';
import {
  getAdminRkDataAction,
  addRkMasterAction,
  addSubRkAction,
  moveSubRkAction,
  deleteRkOrSubAction,
  getRkYearStatsAction,
  deleteRkYearAction,
} from '@/app/actions/admin';

// ------------------------------------------------------------
// Palet aksen earthy (selaras tema: sage, coklat, terracotta)
// ------------------------------------------------------------
type Accent = { color: string; soft: string };
const EARTH: Accent[] = [
  { color: '#6B7F5B', soft: 'rgba(107, 127, 91, 0.12)' }, // sage
  { color: '#8A6F4E', soft: 'rgba(138, 111, 78, 0.12)' }, // coklat tua
  { color: '#C96F4F', soft: 'rgba(201, 111, 79, 0.12)' }, // terracotta
  { color: '#0F766E', soft: 'rgba(15, 118, 110, 0.10)' }, // teal
];

function accentFor(team: string): Accent {
  let h = 0;
  for (let i = 0; i < team.length; i++) h = (h * 31 + team.charCodeAt(i)) % 9973;
  return EARTH[h % EARTH.length];
}

function initials(name?: string | null): string {
  const clean = (name || '').replace(/[^\p{L}\p{N}\s]/gu, ' ').trim();
  if (!clean) return '?';
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Tampilan RK bersama untuk admin & semua akun.
 * canEdit=false  → mode lihat-saja (semua kontrol ubah disembunyikan).
 */
export function RkManagementView({
  initialData,
  canEdit = false,
}: {
  initialData: any;
  canEdit?: boolean;
}) {
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(
    initialData?.selectedYear ?? new Date().getFullYear()
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Modal states (hanya dipakai bila canEdit)
  const [showAddMasterModal, setShowAddMasterModal] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string; type: 'master' | 'sub' } | null>(null);
  const [selectedRkForSub, setSelectedRkForSub] = useState<any>(null);
  const [showMoveSubModal, setShowMoveSubModal] = useState(false);
  const [selectedSubForMove, setSelectedSubForMove] = useState<any>(null);
  const [targetRkId, setTargetRkId] = useState('');

  const [newMasterRk, setNewMasterRk] = useState({ rencana_kinerja: '', tim_kerja: '', ketua_tim_id: '' });
  const [newSubRk, setNewSubRk] = useState({ kegiatan_nama: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hapus tahun (arsip)
  const [showDeleteYearModal, setShowDeleteYearModal] = useState(false);
  const [yearStats, setYearStats] = useState<any>(null);
  const [isDeletingYear, setIsDeletingYear] = useState(false);

  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: ['rk-management-data', selectedYear],
    queryFn: () =>
      withTimeoutRetry(
        async () => {
          const res = await getAdminRkDataAction(selectedYear);
          if (!res.success) throw new Error(res.error || 'Gagal memuat data');
          return res;
        },
        { attempts: 2, timeoutMs: 15000 }
      ),
    initialData:
      initialData && initialData.selectedYear === selectedYear ? initialData : undefined,
    placeholderData: keepPreviousData,
    retry: false,
  });

  const rks: any[] = useMemo(() => data?.rks || [], [data]);
  const subsByRk: Record<string, any[]> = useMemo(() => data?.subsByRk || {}, [data]);
  const ketuaTims: any[] = useMemo(() => data?.ketuaTims || [], [data]);
  const years: number[] = useMemo(() => data?.years || [selectedYear], [data, selectedYear]);
  const activeYear: number = data?.activeYear ?? selectedYear;
  const isArchiveView = selectedYear !== activeYear;

  const q = search.trim().toLowerCase();

  const filteredRks = useMemo(() => {
    let result = rks;
    if (selectedTeam) result = result.filter((r: any) => r.tim_kerja === selectedTeam);
    if (q) {
      result = result.filter((r: any) => {
        if ((r.rencana_kinerja || '').toLowerCase().includes(q)) return true;
        if ((r.tim_kerja || '').toLowerCase().includes(q)) return true;
        if ((r.ketua_tim?.full_name || '').toLowerCase().includes(q)) return true;
        return (subsByRk[r.id] || []).some((s: any) => (s.kegiatan_nama || '').toLowerCase().includes(q));
      });
    }
    return result;
  }, [rks, selectedTeam, q, subsByRk]);

  const groupedRks = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const rk of filteredRks) {
      const team = rk.tim_kerja || 'Tanpa Tim Kerja';
      if (!map.has(team)) map.set(team, []);
      map.get(team)!.push(rk);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredRks]);

  const uniqueTeams = useMemo(() => {
    const teams = new Set<string>();
    rks.forEach((r: any) => r.tim_kerja && teams.add(r.tim_kerja));
    return Array.from(teams).sort();
  }, [rks]);

  const stats = useMemo(() => {
    const totalSubs = rks.reduce((n, r) => n + (subsByRk[r.id]?.length || 0), 0);
    const teams = new Set(rks.map((r) => r.tim_kerja).filter(Boolean));
    const ketuas = new Set(rks.map((r) => r.ketua_tim_id).filter(Boolean));
    return { teams: teams.size, parents: rks.length, subs: totalSubs, ketuas: ketuas.size };
  }, [rks, subsByRk]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleTeam = (teamRks: any[]) => {
    const ids = teamRks.map((r) => r.id);
    const allOpen = ids.every((id) => expanded.has(id));
    setExpanded((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (allOpen ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const handleYear = (y: number) => {
    setSelectedYear(y);
    setExpanded(new Set());
  };

  // ---------- handlers (admin) ----------
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    setIsSubmitting(true);
    try {
      const res = await deleteRkOrSubAction(deleteConfirm.id, deleteConfirm.type);
      if (!res.success) throw new Error(res.error);
      toast.success(deleteConfirm.type === 'master' ? 'RK berhasil dihapus' : 'Sub-RK berhasil dihapus');
      refetch();
    } catch (e: any) {
      toast.error('Gagal menghapus: ' + e.message);
    } finally {
      setIsSubmitting(false);
      setDeleteConfirm(null);
    }
  };

  const handleAddMaster = async () => {
    if (!newMasterRk.rencana_kinerja.trim() || !newMasterRk.tim_kerja.trim() || !newMasterRk.ketua_tim_id) {
      toast.error('Harap isi semua kolom!');
      return;
    }
    setIsSubmitting(true);
    const res = await addRkMasterAction({
      rencana_kinerja: newMasterRk.rencana_kinerja,
      tim_kerja: newMasterRk.tim_kerja,
      ketua_tim_id: newMasterRk.ketua_tim_id,
      created_by: user?.id,
      tahun: selectedYear,
    });
    setIsSubmitting(false);

    if (!res.success) {
      toast.error('Gagal menambah RK: ' + res.error);
    } else {
      toast.success('RK berhasil ditambahkan');
      setShowAddMasterModal(false);
      setNewMasterRk({ rencana_kinerja: '', tim_kerja: '', ketua_tim_id: '' });
      refetch();
    }
  };

  const handleAddSub = async () => {
    if (!newSubRk.kegiatan_nama.trim() || !selectedRkForSub) {
      toast.error('Harap isi nama Sub-RK!');
      return;
    }
    setIsSubmitting(true);
    const res = await addSubRkAction({
      rk_id: selectedRkForSub.id,
      kegiatan_nama: newSubRk.kegiatan_nama,
      user_id: user?.id,
    });
    setIsSubmitting(false);

    if (!res.success) {
      toast.error('Gagal menambah Sub-RK: ' + res.error);
    } else {
      toast.success('Sub-RK berhasil ditambahkan');
      setShowAddSubModal(false);
      setNewSubRk({ kegiatan_nama: '' });
      refetch();
    }
  };

  const handleMoveSub = async () => {
    if (!targetRkId || !selectedSubForMove) return;
    setIsSubmitting(true);
    const res = await moveSubRkAction(selectedSubForMove.id, targetRkId);
    setIsSubmitting(false);

    if (!res.success) {
      toast.error('Gagal memindahkan Sub-RK: ' + res.error);
    } else {
      toast.success('Sub-RK berhasil dipindahkan');
      setShowMoveSubModal(false);
      setTargetRkId('');
      setSelectedSubForMove(null);
      refetch();
    }
  };

  const openDeleteYear = async () => {
    setShowDeleteYearModal(true);
    setYearStats(null);
    const res = await getRkYearStatsAction(selectedYear);
    if (res.success) setYearStats(res.stats);
    else toast.error('Gagal menghitung data tahun: ' + res.error);
  };

  const confirmDeleteYear = async (force: boolean) => {
    setIsDeletingYear(true);
    const res: any = await deleteRkYearAction(selectedYear, force);
    setIsDeletingYear(false);
    if (res.success) {
      toast.success(`Data RK tahun ${selectedYear} dihapus.`);
      setShowDeleteYearModal(false);
      setYearStats(null);
      setSelectedYear(activeYear);
      setExpanded(new Set());
      refetch();
    } else if (res.needsConfirm) {
      setYearStats(res.stats);
      toast.error(res.error);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 space-y-7 animate-fade-in">

        {/* ===== Header ===== */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {canEdit ? 'Manajemen Rencana Kinerja' : 'Rencana Kinerja'}
            </h2>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              Daftar Rencana Kinerja Utama, Sub-RK Anggota, dan Tim Kerja per tahun.
            </p>
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <Link prefetch={true} href="/admin/rk/import" className="btn-secondary text-[13px]">
                <FileSpreadsheet size={15} />
                Upload Dataset / Excel
              </Link>
              <button onClick={() => setShowAddMasterModal(true)} className="btn-primary text-[13px]">
                <Plus size={15} /> Tambah RK
              </button>
            </div>
          )}
        </div>

        {/* ===== Statistik ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Tim Kerja', value: stats.teams, accent: EARTH[0] },
            { label: 'RK Utama', value: stats.parents, accent: EARTH[0] },
            { label: 'Sub-RK Anggota', value: stats.subs, accent: EARTH[1] },
            { label: 'Ketua Tim', value: stats.ketuas, accent: EARTH[2] },
          ].map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl px-5 py-4"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-card)' }}
            >
              <span className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full" style={{ background: s.accent.color }} />
              <div className="pl-3">
                <div className="text-[26px] leading-none font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {s.value}
                </div>
                <div className="text-[10.5px] uppercase tracking-[0.16em] mt-2" style={{ color: 'var(--text-secondary)' }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Toolbar ===== */}
        <div
          className="rounded-2xl p-4 space-y-4"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="search-input flex-1">
              <Search size={16} className="shrink-0" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="search"
                placeholder="Cari RK, tim kerja, ketua tim, atau Sub-RK..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setExpanded(new Set());
                }}
              />
            </div>
            <select
              className="neu-field h-11 px-4 text-[13px] rounded-xl outline-none lg:w-64"
              style={{ color: 'var(--text-primary)' }}
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setExpanded(new Set());
              }}
            >
              <option value="">Semua Tim Kerja</option>
              {uniqueTeams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            {isFetching && <RefreshCw size={15} className="animate-spin self-center" style={{ color: 'var(--primary)' }} />}
          </div>

          {/* Tahun */}
          <div className="filter-bar">
            <span className="text-[12px] font-medium mr-1" style={{ color: 'var(--text-secondary)' }}>
              Tahun
            </span>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => handleYear(y)}
                className={`filter-btn text-[13px] ${y === selectedYear ? 'active' : ''}`}
              >
                {y}
                {y === activeYear && (
                  <span
                    className="uppercase"
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.08em',
                      padding: '2px 7px',
                      borderRadius: 999,
                      background: 'var(--success-soft)',
                      color: 'var(--success-text)',
                    }}
                  >
                    Aktif
                  </span>
                )}
              </button>
            ))}
            {canEdit && isArchiveView && (
              <button onClick={openDeleteYear} className="filter-btn ml-auto" style={{ color: 'var(--danger)' }}>
                <Trash2 size={13} /> Hapus tahun {selectedYear}
              </button>
            )}
          </div>
        </div>

        {/* Archive notice */}
        {isArchiveView && (
          <div
            className="rounded-2xl px-4 py-3 text-[13px]"
            style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-ring)', color: 'var(--accent-strong)' }}
          >
            Melihat <strong>RK {selectedYear} (arsip)</strong>. Tahun aktif sekarang <strong>{activeYear}</strong> — data arsip
            tetap tersimpan dan tidak dipakai pada penilaian tahun berjalan.
          </div>
        )}

        {/* ===== Konten ===== */}
        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-3 p-16" style={{ color: 'var(--text-secondary)' }}>
            <RefreshCw className="h-6 w-6 animate-spin" style={{ color: 'var(--primary)' }} />
            <span className="text-[13px]">Memuat data RK...</span>
          </div>
        ) : groupedRks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-16 text-center"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="text-[15px] font-medium" style={{ color: 'var(--text-primary)' }}>
              Tidak ada Rencana Kinerja
            </p>
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              {canEdit ? 'Ubah filter tahun/tim atau kata kunci, atau tambahkan RK baru.' : 'Ubah filter tahun/tim atau kata kunci.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedRks.map(([team, teamRks]) => {
              const accent = accentFor(team);
              const teamSubs = teamRks.reduce((n, r) => n + (subsByRk[r.id]?.length || 0), 0);
              const allOpen = teamRks.every((r) => expanded.has(r.id));
              return (
                <section key={team}>
                  {/* Header tim */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: accent.color }} />
                    <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {team}
                    </h3>
                    <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
                      {teamRks.length} RK &middot; {teamSubs} Sub-RK
                    </span>
                    <button onClick={() => toggleTeam(teamRks)} className="filter-btn ml-auto !py-1.5 !px-3 text-[12px]">
                      <ChevronDown size={13} className={allOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                      {allOpen ? 'Tutup' : 'Buka semua'}
                    </button>
                  </div>

                  {/* Kartu RK */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {teamRks.map((r) => {
                      const subs = subsByRk[r.id] || [];
                      const isOpen = expanded.has(r.id);
                      return (
                        <article
                          key={r.id}
                          className="group relative overflow-hidden rounded-2xl transition-shadow"
                          style={{ background: 'var(--card-bg)', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-card)' }}
                        >
                          <span className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: accent.color, opacity: 0.85 }} />

                          <div className="p-5 pl-6">
                            {/* Area klik besar: judul + meta → buka/tutup */}
                            <div
                              role="button"
                              tabIndex={0}
                              aria-expanded={isOpen}
                              onClick={() => toggle(r.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  toggle(r.id);
                                }
                              }}
                              className="cursor-pointer rounded-xl -m-2 p-2 transition-colors hover:bg-[var(--sand-subtle)]"
                            >
                              <div className="flex items-start gap-3">
                                <h4 className="flex-1 text-[14.5px] font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                                  {r.rencana_kinerja}
                                </h4>
                                {canEdit && (
                                  <div
                                    className="flex items-center gap-1 shrink-0 -mt-0.5"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => { setSelectedRkForSub(r); setShowAddSubModal(true); }}
                                      title="Tambah Sub-RK"
                                      className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:brightness-95"
                                      style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}
                                    >
                                      <Plus size={15} />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm({ id: r.id, name: r.rencana_kinerja, type: 'master' })}
                                      title="Hapus RK"
                                      className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                                      style={{ color: 'var(--text-tertiary)' }}
                                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* meta */}
                              <div className="mt-3 flex items-center flex-wrap gap-x-2 gap-y-1 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                                <span className="inline-flex items-center gap-1.5">
                                  <span
                                    className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-semibold"
                                    style={{ background: accent.soft, color: accent.color }}
                                  >
                                    {initials(r.ketua_tim?.full_name)}
                                  </span>
                                  {r.ketua_tim?.full_name || 'Belum di-set'}
                                </span>
                                <span style={{ color: 'var(--text-tertiary)' }}>&middot;</span>
                                <span className="tabular-nums">{subs.length} Sub-RK</span>
                              </div>
                            </div>

                            {/* toggle lebar penuh */}
                            <button
                              onClick={() => toggle(r.id)}
                              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-medium transition-colors hover:bg-[var(--sand-subtle)]"
                              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-soft)' }}
                            >
                              <ChevronDown size={14} className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                              {isOpen ? 'Sembunyikan kegiatan' : `Lihat ${subs.length} kegiatan`}
                            </button>

                            {/* sub-rk */}
                            {isOpen && (
                              <div
                                className="mt-3 rounded-xl p-2"
                                style={{ background: 'var(--sand-subtle)', border: '1px solid var(--border-soft)' }}
                              >
                                {subs.length > 0 ? (
                                  <ul className="max-h-[340px] overflow-y-auto">
                                    {subs.map((sub: any, idx: number) => (
                                      <li
                                        key={sub.id}
                                        className="group/sub flex items-start gap-3 rounded-lg px-2 py-2 transition-colors"
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                      >
                                        <span
                                          className="mt-px w-6 shrink-0 text-right text-[11px] tabular-nums"
                                          style={{ color: 'var(--text-tertiary)' }}
                                        >
                                          {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <span className="flex-1 text-[12.5px] leading-snug" style={{ color: 'var(--text-primary)' }}>
                                          {sub.kegiatan_nama}
                                          {sub.is_fallback && (
                                            <em className="ml-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                                              (default)
                                            </em>
                                          )}
                                        </span>
                                        {canEdit && !sub.is_fallback && (
                                          <span className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/sub:opacity-100">
                                            <button
                                              onClick={() => { setSelectedSubForMove(sub); setShowMoveSubModal(true); setTargetRkId(''); }}
                                              className="p-1 rounded-md transition-colors"
                                              style={{ color: 'var(--text-tertiary)' }}
                                              title="Pindah induk RK"
                                            >
                                              <ArrowRightLeft size={13} />
                                            </button>
                                            <button
                                              onClick={() => setDeleteConfirm({ id: sub.id, name: sub.kegiatan_nama, type: 'sub' })}
                                              className="p-1 rounded-md transition-colors"
                                              style={{ color: 'var(--text-tertiary)' }}
                                              title="Hapus Sub-RK"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                          </span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="px-2 py-3 text-center text-[12px] italic" style={{ color: 'var(--text-tertiary)' }}>
                                    {canEdit ? 'Belum ada Sub-RK — tekan tombol tambah pada kartu.' : 'Belum ada Sub-RK.'}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= Modal Tambah RK ================= */}
      {canEdit && showAddMasterModal && (
        <Modal title="Tambah RK Utama" onClose={() => setShowAddMasterModal(false)}>
          <div className="space-y-4">
            <Field label="Nama Rencana Kinerja">
              <textarea
                className="neu-field w-full text-sm rounded-xl p-3 outline-none min-h-[80px]"
                style={{ color: 'var(--text-primary)' }}
                placeholder="Ketik nama RK..."
                value={newMasterRk.rencana_kinerja}
                onChange={(e) => setNewMasterRk({ ...newMasterRk, rencana_kinerja: e.target.value })}
              />
            </Field>
            <Field label="Tim Kerja">
              <input
                type="text"
                className="neu-field w-full text-sm rounded-xl h-10 px-3 outline-none"
                style={{ color: 'var(--text-primary)' }}
                placeholder="Misal: Statistik Sosial"
                value={newMasterRk.tim_kerja}
                onChange={(e) => setNewMasterRk({ ...newMasterRk, tim_kerja: e.target.value })}
              />
            </Field>
            <Field label="Ketua Tim">
              <select
                className="neu-field w-full text-sm rounded-xl h-10 px-3 outline-none"
                style={{ color: 'var(--text-primary)' }}
                value={newMasterRk.ketua_tim_id}
                onChange={(e) => setNewMasterRk({ ...newMasterRk, ketua_tim_id: e.target.value })}
              >
                <option value="">-- Pilih Ketua Tim --</option>
                {ketuaTims.map((k: any) => (
                  <option key={k.id} value={k.id}>
                    {k.full_name} {k.unit_kerja ? `(${k.unit_kerja})` : ''}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <ModalFooter onCancel={() => setShowAddMasterModal(false)} onConfirm={handleAddMaster} loading={isSubmitting} confirmLabel="Simpan RK" />
        </Modal>
      )}

      {/* ================= Modal Tambah Sub-RK ================= */}
      {canEdit && showAddSubModal && selectedRkForSub && (
        <Modal title="Tambah Sub-RK" onClose={() => setShowAddSubModal(false)}>
          <div className="space-y-4">
            <div className="p-3 rounded-xl" style={{ background: 'var(--primary-soft)', border: '1px solid var(--primary-ring)' }}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] mb-1" style={{ color: 'var(--primary)' }}>
                RK Induk
              </p>
              <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                {selectedRkForSub.rencana_kinerja}
              </p>
            </div>
            <Field label="Nama Kegiatan Anggota (Sub-RK)">
              <textarea
                className="neu-field w-full text-sm rounded-xl p-3 outline-none min-h-[100px]"
                style={{ color: 'var(--text-primary)' }}
                placeholder="Ketik uraian kegiatan spesifik dari anggota..."
                value={newSubRk.kegiatan_nama}
                onChange={(e) => setNewSubRk({ kegiatan_nama: e.target.value })}
              />
            </Field>
          </div>
          <ModalFooter onCancel={() => setShowAddSubModal(false)} onConfirm={handleAddSub} loading={isSubmitting} confirmLabel="Simpan Sub-RK" />
        </Modal>
      )}

      {/* ================= Modal Konfirmasi Hapus ================= */}
      {canEdit && deleteConfirm && (
        <Modal title="Konfirmasi Hapus" onClose={() => setDeleteConfirm(null)}>
          <div className="flex items-start gap-2 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            <AlertTriangle size={16} style={{ color: 'var(--danger)' }} className="mt-0.5 shrink-0" />
            <span>Hapus {deleteConfirm.type === 'master' ? 'RK Utama' : 'Sub-RK'} berikut?</span>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--danger-soft)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--danger-text)' }}>{deleteConfirm.name}</p>
          </div>
          {deleteConfirm.type === 'master' && (
            <p className="text-[12.5px]" style={{ color: 'var(--danger-text)' }}>
              Menghapus RK Utama akan menghapus seluruh Sub-RK di dalamnya.
            </p>
          )}
          <ModalFooter onCancel={() => setDeleteConfirm(null)} onConfirm={executeDelete} loading={isSubmitting} confirmLabel="Ya, Hapus" danger />
        </Modal>
      )}

      {/* ================= Modal Pindah Sub-RK ================= */}
      {canEdit && showMoveSubModal && selectedSubForMove && (
        <Modal title="Pindah Induk RK" onClose={() => setShowMoveSubModal(false)}>
          <div className="space-y-4">
            <div className="p-3 rounded-xl" style={{ background: 'var(--primary-soft)', border: '1px solid var(--primary-ring)' }}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] mb-1" style={{ color: 'var(--primary)' }}>
                Sub-RK Saat Ini
              </p>
              <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                {selectedSubForMove.kegiatan_nama}
              </p>
            </div>
            <Field label="Pilih RK Induk Baru">
              <select
                className="neu-field w-full text-sm rounded-xl h-10 px-3 outline-none"
                style={{ color: 'var(--text-primary)' }}
                value={targetRkId}
                onChange={(e) => setTargetRkId(e.target.value)}
              >
                <option value="">-- Pilih RK Utama --</option>
                {rks.map((r: any) => (
                  <option key={r.id} value={r.id} disabled={r.id === selectedSubForMove.rk_id}>
                    {r.tim_kerja ? `[${r.tim_kerja}] ` : ''}
                    {r.rencana_kinerja}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <ModalFooter onCancel={() => setShowMoveSubModal(false)} onConfirm={handleMoveSub} loading={isSubmitting} confirmLabel="Pindah" disabled={!targetRkId} />
        </Modal>
      )}

      {/* ================= Modal Hapus Tahun ================= */}
      {canEdit && showDeleteYearModal && (
        <Modal title={`Hapus RK tahun ${selectedYear}`} onClose={() => setShowDeleteYearModal(false)}>
          {!yearStats ? (
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              Menghitung data...
            </p>
          ) : (
            <>
              <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Seluruh RK tahun <strong>{selectedYear}</strong> akan dihapus beserta Sub-RK dan penugasannya.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  ['RK', yearStats.rk],
                  ['Sub-RK', yearStats.subs],
                  ['Penugasan', yearStats.assignments],
                  ['Entri CKP', yearStats.entries],
                ] as [string, number][]).map(([l, v]) => (
                  <div key={l} className="rounded-xl p-3" style={{ background: 'var(--sand-subtle)' }}>
                    <div className="text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>{l}</div>
                    <div className="text-lg font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>{v}</div>
                  </div>
                ))}
              </div>
              {yearStats.entries > 0 && (
                <div className="flex items-start gap-2 rounded-xl p-3 text-[12.5px]" style={{ background: 'var(--danger-soft)', color: 'var(--danger-text)' }}>
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  <span>
                    Ada <strong>{yearStats.entries} entri CKP</strong> yang menunjuk RK tahun ini. Tautan RK pada entri tersebut akan menjadi kosong.
                  </span>
                </div>
              )}
              <ModalFooter
                onCancel={() => setShowDeleteYearModal(false)}
                onConfirm={() => confirmDeleteYear(yearStats.entries > 0)}
                loading={isDeletingYear}
                confirmLabel={yearStats.entries > 0 ? 'Tetap hapus' : 'Hapus tahun'}
                danger
              />
            </>
          )}
        </Modal>
      )}
    </>
  );
}

// ------------------------------------------------------------
// Komponen kecil
// ------------------------------------------------------------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-medium uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(43, 42, 38, 0.45)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-elevated)' }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
          <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <button onClick={onClose} className="transition-colors" style={{ color: 'var(--text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({
  onCancel,
  onConfirm,
  loading,
  confirmLabel,
  danger,
  disabled,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  confirmLabel: string;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-end gap-3 pt-1">
      <button className="btn-secondary text-[14px]" onClick={onCancel}>
        Batal
      </button>
      <button
        onClick={onConfirm}
        disabled={loading || disabled}
        className="text-[14px] disabled:opacity-60"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '11px 22px',
          borderRadius: 'var(--radius-badge)',
          background: danger ? 'var(--danger)' : 'var(--primary)',
          color: '#fff',
          fontWeight: 500,
          cursor: 'pointer',
          border: 'none',
        }}
      >
        {loading ? 'Memproses...' : confirmLabel}
      </button>
    </div>
  );
}
