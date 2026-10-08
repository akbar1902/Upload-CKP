"use client";

import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { withTimeoutRetry } from '@/lib/supabase/read';
import { getAnalyticsOverviewAction } from '@/app/actions/analytics';
import type { AnalyticsOverview } from '@/app/actions/analytics';
import { Header } from '@/components/layout/header';
import { KPICard } from '@/components/dashboard/kpi-card';
import { PeriodFilter } from '@/components/dashboard/period-filter';
import { FetchingBar } from '@/components/dashboard/filter-loading';
import { TrendLines, StatusDonut, MiniBars } from '@/components/dashboard/charts';
import { usePeriodParams } from '@/hooks/use-period-params';
import { getBulanName, getDefaultPeriod } from '@/lib/utils';
import {
  Users,
  Upload,
  CheckCircle2,
  TrendingUp,
  Star,
  Clock,
  RefreshCw,
  WifiOff,
  BarChart3,
} from 'lucide-react';

// Warna donut per status upload (CSS var agar ikut tema terang/gelap).
const STATUS_COLORS: Record<string, string> = {
  draft: 'var(--text-tertiary)',
  submitted: 'var(--accent)',
  scored: 'var(--warning)',
  approved: 'var(--success)',
  rejected: 'var(--danger)',
  revision_required: 'var(--accent-strong)',
  superseded: 'var(--sand-strong)',
};

function formatNum(value: number): string {
  return value.toLocaleString('id-ID', { maximumFractionDigits: 1 });
}

export default function AnalitikClient() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const setPeriod = usePeriodParams();

  const defaultPeriod = getDefaultPeriod(10);

  const paramBulan = searchParams.get('bulan');
  const paramTahun = searchParams.get('tahun');
  const parsedBulan = paramBulan ? parseInt(paramBulan, 10) : NaN;
  const parsedTahun = paramTahun ? parseInt(paramTahun, 10) : NaN;

  const bulan: string | number = paramBulan
    ? paramBulan.startsWith('T')
      ? paramBulan
      : Number.isNaN(parsedBulan)
        ? defaultPeriod.bulan
        : parsedBulan
    : defaultPeriod.bulan;
  const tahun = Number.isNaN(parsedTahun) ? defaultPeriod.tahun : parsedTahun;

  const setBulan = (nextBulan: string | number) => setPeriod({ bulan: nextBulan, tahun });
  const setTahun = (nextTahun: number) => setPeriod({ bulan, tahun: nextTahun });

  const {
    data: result,
    isPending,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['analytics', bulan, tahun],
    queryFn: () =>
      withTimeoutRetry(() => getAnalyticsOverviewAction(bulan, tahun), {
        attempts: 2,
        timeoutMs: 20000,
      }),
    enabled: !!user && !authLoading,
    networkMode: 'always',
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    retry: false,
  });

  const loading = authLoading || isPending;
  const isFiltering = !loading && isFetching;

  const data: AnalyticsOverview | null = result?.success ? result.data : null;
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : 'Gagal memuat data analitik.'
    : result && !result.success
      ? result.error || 'Gagal memuat data analitik.'
      : null;

  // Bila data periode lama masih tampil, cukup beri tahu lewat toast.
  useEffect(() => {
    if (error && data) {
      toast.error(error, { id: 'analytics-fetch-error' });
    }
  }, [error, data]);

  const trenChartData = useMemo(
    () =>
      (data?.tren ?? []).map((bulanTren) => ({
        label: bulanTren.label,
        value: bulanTren.rataRataNilai,
        value2: bulanTren.rataRataProgres,
      })),
    [data]
  );

  const donutData = useMemo(
    () =>
      (data?.distribusiStatus ?? []).map((status) => ({
        label: status.label,
        value: status.jumlah,
        color: STATUS_COLORS[status.status] ?? 'var(--primary)',
      })),
    [data]
  );

  const tunggakanBars = useMemo(
    () =>
      (data?.perKetuaTim ?? [])
        .filter((ketua) => ketua.entriBelumDinilai > 0)
        .slice(0, 10)
        .map((ketua) => ({ label: ketua.nama, value: ketua.entriBelumDinilai })),
    [data]
  );

  const showSkeleton = loading && !data;
  const adaDataTahun = !!data && data.tren.some((bulanTren) => bulanTren.jumlahUpload > 0);

  // ── Error state (tanpa data sama sekali) ─────────────────
  if (error && !data && !loading) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-md mx-auto text-center py-24">
          <div
            className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--sand-subtle)' }}
          >
            <WifiOff className="h-7 w-7" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 className="text-[17px] font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Gagal Memuat Data Analitik
          </h3>
          <p className="text-[14px] mb-6" style={{ color: 'var(--text-secondary)' }}>
            {error}
          </p>
          <button onClick={() => refetch()} className="btn-primary">
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="relative p-4 lg:p-8 space-y-6 animate-fade-in">
        <FetchingBar show={isFiltering} />

        {/* ── Hero + filter ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2
              className="text-[22px] font-semibold tracking-tight"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              Analitik CKP
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {getBulanName(bulan)} {tahun} · ringkasan, tren, dan tunggakan penilaian
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PeriodFilter bulan={bulan} tahun={tahun} onBulanChange={setBulan} onTahunChange={setTahun} />
            <button
              onClick={() => refetch()}
              className="filter-btn"
              title="Refresh data"
              aria-label="Refresh data analitik"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── KPI Cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <KPICard
            icon={<Users size={18} />}
            value={data?.ringkasan.totalPegawaiAktif ?? 0}
            label="Pegawai Aktif"
            sub="anggota & ketua tim"
            loading={showSkeleton}
          />
          <KPICard
            icon={<Upload size={18} />}
            value={data?.ringkasan.jumlahUpload ?? 0}
            label="Upload Periode"
            sub={data ? `${data.ringkasan.jumlahPegawaiMelapor} pegawai melapor` : undefined}
            loading={showSkeleton}
          />
          <KPICard
            icon={<CheckCircle2 size={18} />}
            value={data ? `${formatNum(data.ringkasan.persenApproved)}%` : '—'}
            label="Sudah Disetujui"
            sub={data ? `${data.ringkasan.jumlahApproved} dari ${data.ringkasan.jumlahUpload} upload` : undefined}
            loading={showSkeleton}
          />
          <KPICard
            icon={<TrendingUp size={18} />}
            value={data ? `${formatNum(data.ringkasan.rataRataProgres)}%` : '—'}
            label="Rata-rata Progres"
            sub="capaian periode ini"
            loading={showSkeleton}
          />
          <KPICard
            icon={<Star size={18} />}
            value={data?.ringkasan.rataRataNilai != null ? formatNum(data.ringkasan.rataRataNilai) : '—'}
            label="Rata-rata Nilai"
            sub="penilaian ketua tim"
            tone="attention"
            loading={showSkeleton}
          />
        </div>

        {/* ── Empty state tahun terpilih ────────────────── */}
        {!showSkeleton && !error && data && !adaDataTahun && (
          <div className="neu-raised rounded-2xl p-10 text-center">
            <div
              className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--sand-subtle)' }}
            >
              <Upload className="h-7 w-7" style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <h3 className="text-[17px] font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Belum Ada Data CKP
            </h3>
            <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
              Tidak ditemukan upload CKP pada tahun {tahun}. Coba ganti periode atau tahun di atas.
            </p>
          </div>
        )}

        {adaDataTahun && data && (
          <>
            {/* ── Tren + Distribusi ─────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="neu-raised rounded-2xl p-4 sm:p-5 xl:col-span-2">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      Tren 12 Bulan {tahun}
                    </h3>
                    <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      Rata-rata nilai vs rata-rata progres per bulan
                    </p>
                  </div>
                  <BarChart3 className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                </div>
                {showSkeleton ? (
                  <div className="skeleton h-[240px] rounded-xl" />
                ) : (
                  <TrendLines
                    data={trenChartData}
                    label1="Rata-rata Nilai"
                    label2="Rata-rata Progres"
                    maxValue={100}
                    unit="%"
                  />
                )}
              </div>

              <div className="neu-raised rounded-2xl p-4 sm:p-5">
                <h3 className="text-[17px] font-semibold tracking-tight mb-0.5" style={{ color: 'var(--text-primary)' }}>
                  Distribusi Status
                </h3>
                <p className="text-[12px] mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {getBulanName(bulan)} {tahun}
                </p>
                {showSkeleton ? (
                  <div className="skeleton h-[168px] w-[168px] rounded-full mx-auto" />
                ) : (
                  <StatusDonut data={donutData} centerLabel="Upload" />
                )}
              </div>
            </div>

            {/* ── SLA + Tunggakan ───────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="neu-raised rounded-2xl p-4 sm:p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                  <h3 className="text-[17px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    SLA Persetujuan {tahun}
                  </h3>
                </div>
                <p className="text-[12px] mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Rata-rata waktu dari unggah sampai disetujui
                </p>
                {showSkeleton ? (
                  <div className="skeleton h-12 w-40 rounded-xl" />
                ) : (
                  <>
                    <p
                      className="font-bold tracking-tight leading-none tabular-nums"
                      style={{ color: 'var(--text-primary)', fontSize: 'clamp(28px, 4vw, 38px)' }}
                    >
                      {data.sla.rataRataHari != null ? `${formatNum(data.sla.rataRataHari)} hari` : '—'}
                    </p>
                    <p className="text-[13px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
                      {data.sla.rataRataHari != null
                        ? `${data.sla.jumlahAdaData} dari ${data.sla.jumlahApproved} upload approved memiliki data tanggal lengkap`
                        : 'Belum ada upload approved dengan data tanggal lengkap pada tahun ini'}
                    </p>
                  </>
                )}
              </div>

              <div className="neu-raised rounded-2xl p-4 sm:p-5">
                <h3 className="text-[17px] font-semibold tracking-tight mb-0.5" style={{ color: 'var(--text-primary)' }}>
                  Tunggakan per Ketua Tim
                </h3>
                <p className="text-[12px] mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Entri yang belum diberi nilai pada periode ini
                </p>
                {showSkeleton ? (
                  <div className="space-y-2.5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="skeleton h-4 w-full rounded-full" />
                    ))}
                  </div>
                ) : (
                  <MiniBars data={tunggakanBars} valueSuffix=" entri" emptyText="Tidak ada tunggakan pada periode ini 🎉" />
                )}
              </div>
            </div>

            {/* ── Tabel per ketua tim ───────────────────── */}
            <div className="neu-raised rounded-2xl p-4 sm:p-5">
              <h3 className="text-[17px] font-semibold tracking-tight mb-0.5" style={{ color: 'var(--text-primary)' }}>
                Beban & Tunggakan per Ketua Tim
              </h3>
              <p className="text-[12px] mb-4" style={{ color: 'var(--text-secondary)' }}>
                RK mapping tahun {tahun} · entri belum dinilai pada upload yang sudah dikirim
              </p>

              {showSkeleton ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton h-8 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px] min-w-[560px]">
                    <thead>
                      <tr
                        className="text-left uppercase text-[11px] tracking-wider"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <th className="py-2 pr-3 font-semibold">Ketua Tim</th>
                        <th className="py-2 px-3 font-semibold text-right">RK Mapping</th>
                        <th className="py-2 px-3 font-semibold text-right">Entri Belum Dinilai</th>
                        <th className="py-2 pl-3 font-semibold text-right">Upload Menunggu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.perKetuaTim.map((ketua) => (
                        <tr key={ketua.ketuaTimId} style={{ borderTop: '1px solid var(--border-soft)' }}>
                          <td className="py-2.5 pr-3">
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {ketua.nama}
                            </p>
                            {ketua.nip && (
                              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                                NIP {ketua.nip}
                              </p>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                            {ketua.jumlahRk}
                          </td>
                          <td
                            className="py-2.5 px-3 text-right tabular-nums"
                            style={
                              ketua.entriBelumDinilai > 0
                                ? { color: 'var(--accent-strong)', fontWeight: 600 }
                                : { color: 'var(--text-secondary)' }
                            }
                          >
                            {ketua.entriBelumDinilai}
                          </td>
                          <td className="py-2.5 pl-3 text-right tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                            {ketua.uploadMenunggu}
                          </td>
                        </tr>
                      ))}
                      {data.perKetuaTim.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-8 text-center"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            Belum ada ketua tim terdaftar
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
