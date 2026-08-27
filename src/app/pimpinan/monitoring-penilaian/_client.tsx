"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { PeriodFilter } from '@/components/dashboard/period-filter';
import { getDefaultPeriod, getBulanName } from '@/lib/utils';
import { getPendingScoringKetuaTim, type PendingScoringKetuaTim } from '@/app/actions/monitoring';
import { ChevronDown, ChevronUp, AlertCircle, RefreshCw, Users, FileText, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

function MonitoringCard({ data }: { data: PendingScoringKetuaTim }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div 
        className="p-5 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {data.ketuaTim.full_name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-slate-100">{data.ketuaTim.full_name}</h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">NIP: {data.ketuaTim.nip || '-'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[20px] font-bold text-orange-600 dark:text-orange-400 leading-none">
              {data.totalPendingKegiatan}
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1">
              Kegiatan Tertunda
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 p-5 space-y-4">
          <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <Users size={16} className="text-indigo-500" />
            Daftar Pegawai yang Belum Dinilai ({data.pegawaiDetails.length})
          </div>
          
          <div className="grid gap-3">
            {data.pegawaiDetails.map((pegawai) => (
              <PegawaiDetailCard key={pegawai.id} pegawai={pegawai} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PegawaiDetailCard({ pegawai }: { pegawai: PendingScoringKetuaTim['pegawaiDetails'][0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-[#25262b] rounded-xl border border-slate-200/60 dark:border-slate-700/50 overflow-hidden">
      <div 
        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-bold">
            {pegawai.full_name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">{pegawai.full_name}</div>
            <div className="text-[11px] text-slate-500">{pegawai.unit_kerja || 'BPS Kabupaten Belitung'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-[12px] font-medium">
            <FileText size={14} />
            {pegawai.pendingKegiatanCount} Kegiatan
          </span>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>
      
      {expanded && (
        <div className="p-3.5 pt-0">
          <div className="pl-11 pr-2">
            <ul className="space-y-2">
              {pegawai.kegiatanNames.map((keg, idx) => (
                <li key={idx} className="text-[12px] text-slate-600 dark:text-slate-400 flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                  <div className="min-w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5" />
                  <span>{keg}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MonitoringPenilaianClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPeriod = getDefaultPeriod(10);
  
  const paramBulan = searchParams.get('bulan');
  const paramTahun = searchParams.get('tahun');
  
  // Karena parameter T1, T2 dsb sulit ditangani di action sederhana ini tanpa map,
  // Kita fallback ke angka bulan jika berupa string T1. (Bisa diperbaiki nanti jika perlu).
  const currentBulan = typeof defaultPeriod.bulan === 'string' ? 1 : defaultPeriod.bulan;
  const rawBulan = paramBulan || currentBulan;
  
  const bulan = typeof rawBulan === 'string' && rawBulan.startsWith('T') ? 1 : parseInt(String(rawBulan));
  const tahun = paramTahun ? parseInt(paramTahun) : defaultPeriod.tahun;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PendingScoringKetuaTim[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getPendingScoringKetuaTim(bulan, tahun);
      if (res.error) {
        toast.error(res.error);
      } else {
        setData(res.data || []);
      }
    } catch (err) {
      toast.error('Gagal mengambil data monitoring');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bulan, tahun]);

  const setBulan = (b: string | number) => router.push(`?bulan=${b}&tahun=${tahun}`);
  const setTahun = (t: number) => router.push(`?bulan=${bulan}&tahun=${t}`);

  const getBulanLabel = () => {
    if (paramBulan && paramBulan.startsWith('T')) return paramBulan; // fallback
    return getBulanName(bulan);
  };

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1a1b1e] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Monitoring Penilaian
            </h1>
            <p className="text-[13px] text-slate-500 mt-1">
              Pantau progres Ketua Tim yang belum menyelesaikan penilaian pada {getBulanLabel()} {tahun}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PeriodFilter
              bulan={paramBulan || bulan}
              tahun={tahun}
              onBulanChange={setBulan}
              onTahunChange={setTahun}
            />
            <button 
              onClick={fetchData}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="w-full h-[90px] rounded-2xl" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-2">Semua Penilaian Selesai!</h3>
            <p className="text-[14px] text-slate-500 max-w-md mx-auto">
              Luar biasa! Tidak ada Ketua Tim yang tertunda dalam memberikan penilaian pada periode ini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map(item => (
              <MonitoringCard key={item.ketuaTim.id} data={item} />
            ))}
          </div>
        )}

      </div>
    </>
  );
}
