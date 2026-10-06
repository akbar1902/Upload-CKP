"use client";

import React, { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import {
  BarChart,
  CHART_COLORS,
  ChartCard,
  ChartEmpty,
  DonutChart,
  HBarChart,
  LineChart,
} from '@/components/dashboard/charts';
import { getDefaultPeriod } from '@/lib/utils';
import { BarChart3, Calendar, RefreshCw, TrendingUp } from 'lucide-react';

const MONTH_ABBR = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/* ── Tipe baris data ─────────────────────────────────────── */
interface UploadRow {
  id: string;
  user_id: string;
  bulan: number;
  tahun: number;
  status: string;
  version: number;
  avg_progres: number;
  rata_rata_nilai: number | null;
  total_entries: number;
}
interface Person {
  id: string;
  full_name: string;
}
interface KetuaEntry {
  id: string;
  upload_id: string;
  rencana_kinerja: string | null;
  rk_ketua_tim_id: string | null;
  nilai: number | null;
}
interface KetuaUpload {
  id: string;
  user_id: string;
}
interface KetuaRk {
  id: string;
  rencana_kinerja: string;
  tim_kerja: string | null;
}
interface KetuaData {
  rks: KetuaRk[];
  uploads: KetuaUpload[];
  entries: KetuaEntry[];
  users: Person[];
}

function dedupeLatest(rows: UploadRow[]): UploadRow[] {
  const m = new Map<string, UploadRow>();
  for (const r of rows) {
    const k = `${r.user_id}-${r.bulan}`;
    const cur = m.get(k);
    if (!cur || (r.version ?? 1) > (cur.version ?? 1)) m.set(k, r);
  }
  return Array.from(m.values());
}

/* ═══════════════════════════════════════════════════════════ */
export default function InsightClient() {
  const { user, loading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const defaultPeriod = getDefaultPeriod(10);
  const [tahun, setTahun] = useState(defaultPeriod.tahun);

  const role = user?.role ?? 'anggota';
  const isPimpinan = role === 'pimpinan' || role === 'admin';
  const isKetua = role === 'ketua_tim';

  const years = useMemo(
    () => Array.from({ length: 5 }, (_, i) => defaultPeriod.tahun - i),
    [defaultPeriod.tahun]
  );

  const roleLabel = isPimpinan ? 'Pimpinan' : isKetua ? 'Ketua Tim' : 'Anggota';

  /* ── Query A: uploads setahun (semua role, RLS membatasi) ── */
  const { data: uploadsData, isPending: uploadsPending, refetch: refetchUploads } = useQuery({
    queryKey: ['insight-uploads', tahun, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ckp_uploads')
        .select('id, user_id, bulan, tahun, status, version, avg_progres, rata_rata_nilai, total_entries')
        .eq('tahun', tahun);
      if (error) throw new Error(error.message);
      return (data ?? []) as UploadRow[];
    },
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 5,
  });

  /* ── Query B: daftar pegawai (pimpinan saja) ─────────────── */
  const { data: people } = useQuery({
    queryKey: ['insight-people'],
    queryFn: async () => {
      const { data } = await supabase
        .from('users')
        .select('id, full_name')
        .in('role', ['anggota', 'ketua_tim'])
        .eq('is_active', true);
      return (data ?? []) as Person[];
    },
    enabled: !!user && !authLoading && isPimpinan,
    staleTime: 1000 * 60 * 10,
  });

  /* ── Query C: data ketua tim (RK + entri) ────────────────── */
  const { data: ketuaData, isPending: ketuaPending } = useQuery({
    queryKey: ['insight-ketua', tahun, user?.id],
    enabled: !!user && !authLoading && isKetua,
    staleTime: 1000 * 60 * 5,
    queryFn: async (): Promise<KetuaData> => {
      const empty: KetuaData = { rks: [], uploads: [], entries: [], users: [] };
      const { data: mapping } = await supabase
        .from('rk_ketua_tim_mapping')
        .select('id, rencana_kinerja, tim_kerja')
        .eq('ketua_tim_id', user!.id);
      const rks = (mapping ?? []) as KetuaRk[];
      if (rks.length === 0) return empty;

      const rkIds = rks.map((r) => r.id);
      const rkNames = new Set(rks.map((r) => r.rencana_kinerja));

      const { data: ups } = await supabase
        .from('ckp_uploads')
        .select('id, user_id')
        .eq('tahun', tahun)
        .in('status', ['submitted', 'scored', 'approved', 'revision_required']);
      const uploads = (ups ?? []) as KetuaUpload[];
      const uploadIds = uploads.map((u) => u.id);
      if (uploadIds.length === 0) return { ...empty, rks };

      const idSet = new Set(rkIds);
      const rawEntries: KetuaEntry[] = [];
      let from = 0;
      const limit = 999;
      for (;;) {
        const { data: chunk } = await supabase
          .from('ckp_entries')
          .select('id, upload_id, rencana_kinerja, rk_ketua_tim_id, nilai')
          .in('upload_id', uploadIds)
          .range(from, from + limit);
        const rows = (chunk ?? []) as KetuaEntry[];
        rawEntries.push(...rows);
        if (rows.length <= limit) break;
        from += limit + 1;
      }

      const seen = new Set<string>();
      const entries = rawEntries.filter((e) => {
        const match = (e.rencana_kinerja && rkNames.has(e.rencana_kinerja)) || (e.rk_ketua_tim_id && idSet.has(e.rk_ketua_tim_id));
        if (!match) return false;
        if (seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      });

      // Buang entri milik ketua sendiri
      const ownUploadIds = new Set(uploads.filter((u) => u.user_id === user!.id).map((u) => u.id));
      const relevant = entries.filter((e) => !ownUploadIds.has(e.upload_id));

      const userIds = Array.from(
        new Set(relevant.map((e) => uploads.find((u) => u.id === e.upload_id)?.user_id).filter(Boolean))
      ) as string[];
      let users: Person[] = [];
      if (userIds.length > 0) {
        const { data: u } = await supabase.from('users').select('id, full_name').in('id', userIds);
        users = (u ?? []) as Person[];
      }

      return { rks, uploads, entries: relevant, users };
    },
  });

  const loading = authLoading || uploadsPending || (isKetua && ketuaPending);

  /* ── Turunan: uploads ────────────────────────────────────── */
  const uploadRows = useMemo(() => dedupeLatest(uploadsData ?? []), [uploadsData]);
  const nameOf = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of people ?? []) m.set(p.id, p.full_name);
    return m;
  }, [people]);

  const monthly = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const m = uploadRows.filter((r) => r.bulan === i + 1);
        const withProgress = m.filter((r) => (r.avg_progres ?? 0) > 0);
        const scored = m.filter((r) => r.rata_rata_nilai != null);
        return {
          reporters: new Set(m.map((r) => r.user_id)).size,
          avgProgres: withProgress.length
            ? withProgress.reduce((s, r) => s + (r.avg_progres || 0), 0) / withProgress.length
            : null,
          avgNilai: scored.length
            ? scored.reduce((s, r) => s + (r.rata_rata_nilai || 0), 0) / scored.length
            : null,
          kegiatan: m.reduce((s, r) => s + (r.total_entries || 0), 0),
        };
      }),
    [uploadRows]
  );

  const statusCounts = useMemo(() => {
    const c = { approved: 0, scored: 0, submitted: 0, revision: 0 };
    for (const r of uploadRows) {
      if (r.status === 'approved') c.approved++;
      else if (r.status === 'scored') c.scored++;
      else if (r.status === 'submitted') c.submitted++;
      else if (r.status === 'rejected' || r.status === 'revision_required') c.revision++;
    }
    return c;
  }, [uploadRows]);

  const statusDonut = useMemo(
    () =>
      [
        { label: 'Disetujui', value: statusCounts.approved, color: CHART_COLORS.success },
        { label: 'Sudah Dinilai', value: statusCounts.scored, color: CHART_COLORS.taupe },
        { label: 'Menunggu Review', value: statusCounts.submitted, color: CHART_COLORS.accent },
        { label: 'Perlu Revisi', value: statusCounts.revision, color: CHART_COLORS.danger },
      ].filter((d) => d.value > 0),
    [statusCounts]
  );

  const ranking = useMemo(() => {
    const perUser = new Map<string, { sum: number; n: number; scoreSum: number; scoreN: number }>();
    for (const r of uploadRows) {
      const rec = perUser.get(r.user_id) ?? { sum: 0, n: 0, scoreSum: 0, scoreN: 0 };
      if ((r.avg_progres ?? 0) > 0) {
        rec.sum += r.avg_progres;
        rec.n++;
      }
      if (r.rata_rata_nilai != null) {
        rec.scoreSum += r.rata_rata_nilai;
        rec.scoreN++;
      }
      perUser.set(r.user_id, rec);
    }
    return Array.from(perUser.entries())
      .map(([id, v]) => {
        const capaian = v.n ? v.sum / v.n : 0;
        return {
          label: nameOf.get(id) ?? 'Pegawai',
          value: Math.round(capaian),
          caption: v.scoreN ? `Nilai ${(v.scoreSum / v.scoreN).toFixed(1)}` : 'Belum dinilai',
          color: capaian >= 80 ? CHART_COLORS.success : capaian >= 50 ? CHART_COLORS.primary : CHART_COLORS.warning,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [uploadRows, nameOf]);

  /* ── Turunan: ketua tim ──────────────────────────────────── */
  const ketua = useMemo(() => {
    const data = ketuaData;
    if (!data) return { beban: [] as { label: string; value: number; color: string; caption: string }[], perRk: [] as { label: string; value: number; color: string; caption: string }[] };

    const map = new Map<string, { label: string; total: number; evaluated: number }>();
    for (const e of data.entries) {
      const up = data.uploads.find((u) => u.id === e.upload_id);
      if (!up) continue;
      const u = data.users.find((x) => x.id === up.user_id);
      const rec = map.get(up.user_id) ?? { label: u?.full_name ?? 'Pegawai', total: 0, evaluated: 0 };
      rec.total += 1;
      if (e.nilai != null) rec.evaluated += 1;
      map.set(up.user_id, rec);
    }
    const beban = Array.from(map.values())
      .map((r) => {
        const pending = r.total - r.evaluated;
        return {
          label: r.label,
          value: pending,
          color: pending === 0 ? CHART_COLORS.success : CHART_COLORS.warning,
          caption: `${r.evaluated}/${r.total} entri dinilai`,
        };
      })
      .sort((a, b) => b.value - a.value);

    const perRk = data.rks
      .map((rk) => {
        const rkEntries = data.entries.filter(
          (e) => e.rencana_kinerja === rk.rencana_kinerja || (e.rk_ketua_tim_id && e.rk_ketua_tim_id === rk.id)
        );
        const evaluated = rkEntries.filter((e) => e.nilai != null);
        const byUser = new Map<string, { t: number; c: number }>();
        for (const e of evaluated) {
          const up = data.uploads.find((u) => u.id === e.upload_id);
          if (!up) continue;
          const rec = byUser.get(up.user_id) ?? { t: 0, c: 0 };
          rec.t += e.nilai as number;
          rec.c++;
          byUser.set(up.user_id, rec);
        }
        let avg = 0;
        if (byUser.size > 0) {
          let s = 0;
          byUser.forEach((v) => { s += v.t / v.c; });
          avg = s / byUser.size;
        }
        const allEvaluated = rkEntries.length > 0 && evaluated.length === rkEntries.length;
        return {
          label: rk.rencana_kinerja,
          value: Number(avg.toFixed(1)),
          color: allEvaluated ? CHART_COLORS.success : CHART_COLORS.primary,
          caption: `${evaluated.length}/${rkEntries.length} entri dinilai`,
        };
      })
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return { beban, perRk };
  }, [ketuaData]);

  const totalReporters = uploadRows.length > 0 ? new Set(uploadRows.map((r) => r.user_id)).size : 0;
  const totalPegawai = people?.length ?? 0;

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
        {/* Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--primary-soft)', boxShadow: 'var(--neu-inset-sm)' }}
              aria-hidden="true"
            >
              <BarChart3 size={22} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h2 className="text-[24px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Insight Kinerja
              </h2>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Visualisasi {roleLabel.toLowerCase()} · Tahun {tahun}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
              <select
                value={tahun}
                onChange={(e) => setTahun(parseInt(e.target.value, 10))}
                className="neu-field appearance-none rounded-full pl-9 pr-9 h-11 text-[13.5px] font-medium cursor-pointer"
                style={{ color: 'var(--text-primary)', outline: 'none' }}
                aria-label="Pilih tahun"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => refetchUploads()}
              className="filter-btn"
              title="Muat ulang"
              aria-label="Muat ulang data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Ringkasan angka */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: isPimpinan ? 'Pegawai Melapor' : 'Bulan Terlapor', value: isPimpinan ? `${totalReporters}/${totalPegawai}` : String(uploadRows.length) },
            { label: 'Total Kegiatan', value: String(uploadRows.reduce((s, r) => s + (r.total_entries || 0), 0)) },
            { label: 'Disetujui', value: String(statusCounts.approved) },
            { label: 'Perlu Revisi', value: String(statusCounts.revision) },
          ].map((s) => (
            <div key={s.label} className="neu-raised rounded-2xl p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                {s.label}
              </p>
              <p className="mt-1.5 text-[26px] font-bold tabular-nums leading-none" style={{ color: 'var(--text-primary)' }}>
                {loading ? <span className="skeleton inline-block h-7 w-16 rounded-lg align-middle" /> : s.value}
              </p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`neu-raised rounded-2xl p-5 ${i === 0 ? 'lg:col-span-2' : ''}`}>
                <div className="skeleton h-4 w-44 rounded mb-4" />
                <div className="skeleton h-[170px] w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : isKetua ? (
          /* ── Ketua tim ── */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Beban Penilaian per Pegawai" subtitle={`Entri yang belum dinilai · ${tahun}`}>
              {ketua.beban.length > 0 ? (
                <HBarChart data={ketua.beban} emptyLabel="Belum ada entri untuk dinilai" />
              ) : (
                <ChartEmpty />
              )}
            </ChartCard>
            <ChartCard title="Rata-rata Nilai per RK" subtitle="Skala 0–100, 10 RK teratas">
              {ketua.perRk.length > 0 ? (
                <HBarChart data={ketua.perRk} max={100} decimals={1} emptyLabel="Belum ada nilai" />
              ) : (
                <ChartEmpty label="Belum ada RK dengan entri" />
              )}
            </ChartCard>
          </div>
        ) : isPimpinan ? (
          /* ── Pimpinan / Admin ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard className="lg:col-span-2" title="Tingkat Pelaporan per Bulan" subtitle={`Jumlah pegawai yang melapor · ${tahun}`}>
              {uploadRows.length > 0 ? (
                <BarChart
                  data={monthly.map((m, i) => ({ label: MONTH_ABBR[i + 1], value: m.reporters }))}
                  max={Math.max(totalPegawai, 1)}
                  referenceValue={totalPegawai}
                  referenceLabel={`Total ${totalPegawai}`}
                  valueSuffix=" pegawai"
                />
              ) : (
                <ChartEmpty label={`Belum ada laporan pada ${tahun}`} />
              )}
            </ChartCard>

            <ChartCard title="Komposisi Status" subtitle={`Seluruh bulan ${tahun}`}>
              {statusDonut.length > 0 ? (
                <DonutChart data={statusDonut} centerValue={String(uploadRows.length)} centerLabel="total CKP" />
              ) : (
                <ChartEmpty />
              )}
            </ChartCard>

            <ChartCard className="lg:col-span-2" title="Tren Capaian & Nilai" subtitle={`Rata-rata seluruh pegawai · ${tahun}`}>
              {uploadRows.length > 0 ? (
                <LineChart
                  labels={MONTH_ABBR.slice(1)}
                  series={[
                    { name: 'Capaian (%)', color: CHART_COLORS.primary, values: monthly.map((m) => (m.avgProgres == null ? null : Math.round(m.avgProgres))) },
                    { name: 'Nilai', color: CHART_COLORS.accent, values: monthly.map((m) => (m.avgNilai == null ? null : Math.round(m.avgNilai))) },
                  ]}
                />
              ) : (
                <ChartEmpty />
              )}
            </ChartCard>

            <ChartCard title="Peringkat Pegawai" subtitle={`Capaian rata-rata · ${tahun}`}>
              <HBarChart data={ranking} max={100} valueSuffix="%" emptyLabel="Belum ada data pegawai" />
            </ChartCard>
          </div>
        ) : (
          /* ── Anggota ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard className="lg:col-span-2" title="Tren Capaian & Nilai" subtitle={`Perkembangan 12 bulan · ${tahun}`}>
              {uploadRows.length > 0 ? (
                <LineChart
                  labels={MONTH_ABBR.slice(1)}
                  series={[
                    { name: 'Capaian (%)', color: CHART_COLORS.primary, values: monthly.map((m) => (m.avgProgres == null ? null : Math.round(m.avgProgres))) },
                    { name: 'Nilai', color: CHART_COLORS.accent, values: monthly.map((m) => (m.avgNilai == null ? null : Math.round(m.avgNilai))) },
                  ]}
                />
              ) : (
                <ChartEmpty label={`Belum ada upload pada ${tahun}`} />
              )}
            </ChartCard>

            <ChartCard title="Komposisi Status" subtitle="Seluruh periode upload">
              {statusDonut.length > 0 ? (
                <DonutChart data={statusDonut} centerValue={String(uploadRows.length)} centerLabel="total upload" />
              ) : (
                <ChartEmpty />
              )}
            </ChartCard>

            <ChartCard className="lg:col-span-3" title="Jumlah Kegiatan per Bulan" subtitle={`Total kegiatan CKP ${tahun}`}>
              {monthly.some((m) => m.kegiatan > 0) ? (
                <BarChart
                  data={monthly.map((m, i) => ({ label: MONTH_ABBR[i + 1], value: m.kegiatan }))}
                  valueSuffix=" kegiatan"
                />
              ) : (
                <ChartEmpty label={`Belum ada kegiatan pada ${tahun}`} />
              )}
            </ChartCard>
          </div>
        )}

        <p className="text-[11px] flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
          <TrendingUp size={12} /> Data dihitung dari CKP yang tercatat pada sistem · diperbarui otomatis.
        </p>
      </div>
    </>
  );
}
