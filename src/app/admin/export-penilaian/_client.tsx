"use client";

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { BULAN_NAMES, getBulanName } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  FileDown, Printer, FileSpreadsheet, ExternalLink, Calendar, 
  Users, CheckCircle2, AlertCircle, Loader2, Sparkles
} from 'lucide-react';
import { 
  getExportPenilaianData, 
  getExportEntriesForUpload, 
  type PimpinanInfo, 
  type ExportPegawaiUpload 
} from '@/app/actions/export';
import { generateEvaluationPdf } from '@/lib/export/pdf-generator';

interface ExportPenilaianClientProps {
  initialBulan: number;
  initialTahun: number;
  initialData: {
    pimpinan: PimpinanInfo;
    uploads: ExportPegawaiUpload[];
    allUsers: { id: string; full_name: string; nip: string | null; unit_kerja: string | null; role: string }[];
  };
}

function getIndonesianDate(d: Date = new Date()): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ExportPenilaianClient({
  initialBulan,
  initialTahun,
  initialData,
}: ExportPenilaianClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [bulan, setBulan] = useState<number>(initialBulan);
  const [tahun, setTahun] = useState<number>(initialTahun);
  const [data, setData] = useState(initialData);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [tanggalCetak, setTanggalCetak] = useState<string>(getIndonesianDate());
  const [entries, setEntries] = useState<any[]>([]);
  const [loadingEntries, setLoadingEntries] = useState<boolean>(false);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);

  // Set default selected user (first user with upload or first active user)
  useEffect(() => {
    if (!selectedUserId) {
      if (data.uploads.length > 0) {
        setSelectedUserId(data.uploads[0].user_id);
      } else if (data.allUsers.length > 0) {
        setSelectedUserId(data.allUsers[0].id);
      }
    }
  }, [data, selectedUserId]);

  // Find current selected upload (if exists)
  const currentUpload = useMemo(() => {
    return data.uploads.find(u => u.user_id === selectedUserId) || null;
  }, [data.uploads, selectedUserId]);

  // Find current selected user
  const currentSelectedUser = useMemo(() => {
    return (
      data.allUsers.find(u => u.id === selectedUserId) ||
      currentUpload?.user || {
        id: selectedUserId,
        full_name: 'Pegawai',
        nip: '-',
        unit_kerja: 'BPS Kabupaten Belitung',
        role: 'pegawai',
      }
    );
  }, [data.allUsers, currentUpload, selectedUserId]);

  // Load entries when selectedUpload changes
  useEffect(() => {
    if (currentUpload) {
      setLoadingEntries(true);
      getExportEntriesForUpload(currentUpload.id)
        .then((res) => {
          setEntries(res);
        })
        .catch((err) => {
          console.error('Failed to load entries:', err);
          toast.error('Gagal memuat detail kegiatan');
        })
        .finally(() => {
          setLoadingEntries(false);
        });
    } else {
      setEntries([]);
      setLoadingEntries(false);
    }
  }, [currentUpload]);

  // Handle period change
  const handlePeriodChange = (newBulan: number, newTahun: number) => {
    setBulan(newBulan);
    setTahun(newTahun);
    startTransition(async () => {
      try {
        const newData = await getExportPenilaianData(newBulan, newTahun);
        setData(newData);
        if (newData.uploads.length > 0) {
          setSelectedUserId(newData.uploads[0].user_id);
        }
      } catch (e) {
        toast.error('Gagal memuat data periode.');
      }
    });
  };

  // Download PDF Action
  const handleDownloadPdf = () => {
    try {
      setDownloadingPdf(true);
      const doc = generateEvaluationPdf({
        pegawai: {
          full_name: currentSelectedUser.full_name,
          nip: currentSelectedUser.nip,
          unit_kerja: currentSelectedUser.unit_kerja || 'BPS Kabupaten Belitung',
          jabatan: currentUpload?.profile?.jabatan || 'Pranata Komputer / Pegawai',
          golongan: currentUpload?.profile?.golongan || '-',
        },
        pimpinan: data.pimpinan,
        bulan,
        tahun,
        tanggalCetak,
        entries,
      });

      const safeName = currentSelectedUser.full_name.replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`Evaluasi_Kinerja_${safeName}_${getBulanName(bulan)}_${tahun}.pdf`);
      toast.success('File PDF berhasil didownload!');
    } catch (err: any) {
      console.error('Export PDF error:', err);
      toast.error('Gagal membuat file PDF: ' + err.message);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  const lastDay = new Date(tahun, bulan, 0).getDate();

  return (
    <>
      {/* Hide header and UI controls when printing */}
      <div className="print:hidden">
        <Header />
      </div>

      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
        {/* Top Header Controls (Hidden during print) */}
        <div className="print:hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Export Penilaian Bulanan
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Rekap evaluasi kinerja bulanan pegawai resmi pejabat penilai kinerja
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf || loadingEntries}
              className="gap-2 shadow-sm font-semibold"
            >
              {downloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              Download PDF
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="gap-2 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-sm font-semibold"
            >
              <Printer className="w-4 h-4" />
              Cetak / Print
            </Button>
          </div>
        </div>

        {/* Filter Panel (Hidden during print) */}
        <Card className="print:hidden border shadow-sm" style={{ background: 'var(--bg-card)' }}>
          <CardContent className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Filter Bulan */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Bulan
                </label>
                <Select
                  value={String(bulan)}
                  onChange={(e) => handlePeriodChange(parseInt(e.target.value), tahun)}
                  options={BULAN_NAMES.map((name, i) => ({ value: String(i + 1), label: name }))}
                />
              </div>

              {/* Filter Tahun */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Tahun
                </label>
                <Select
                  value={String(tahun)}
                  onChange={(e) => handlePeriodChange(bulan, parseInt(e.target.value))}
                  options={[2024, 2025, 2026, 2027].map((y) => ({ value: String(y), label: String(y) }))}
                />
              </div>

              {/* Pilih Pegawai */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Pilih Pegawai
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {data.allUsers.map((u) => {
                    const hasUpload = data.uploads.some(up => up.user_id === u.id);
                    return (
                      <option key={u.id} value={u.id}>
                        {u.full_name} {hasUpload ? '✓ (Ada CKP)' : '(Belum ada CKP)'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Tanggal Cetak */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Tanggal Cetak Dokumen
                </label>
                <input
                  type="text"
                  value={tanggalCetak}
                  onChange={(e) => setTanggalCetak(e.target.value)}
                  placeholder="Contoh: 3 September 2026"
                  className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Status notice */}
            {!currentUpload && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Pegawai ini belum mengunggah CKP untuk periode <strong>{getBulanName(bulan)} {tahun}</strong>. Dokumen preview menampilkan struktur kosong.
                </span>
              </div>
            )}
            {currentUpload && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-lg flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Ditemukan CKP versi {currentUpload.version} ({entries.length} kegiatan) - Status: <strong>{currentUpload.status}</strong>
                  </span>
                </div>
                {currentUpload.approved_at && (
                  <span className="text-[11px] opacity-80">
                    Disetujui: {new Date(currentUpload.approved_at).toLocaleDateString('id-ID')}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── DOKUMEN REKAP EVALUASI RESMI (PRINT AREA) ────────────────── */}
        <div 
          id="evaluation-document-print"
          className="bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 p-8 sm:p-12 max-w-4xl mx-auto font-sans print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full"
          style={{ minHeight: '297mm' }}
        >
          {/* Header Dokumen */}
          <div className="text-center pb-3 border-b-2 border-slate-800 mb-2">
            <h2 className="text-[16px] sm:text-[18px] font-extrabold uppercase tracking-wide leading-snug">
              Evaluasi Kinerja Pegawai
            </h2>
            <h3 className="text-[14px] sm:text-[15px] font-bold uppercase tracking-wide leading-snug">
              Pendekatan Hasil Kerja Kualitatif
            </h3>
            <p className="text-[13px] font-semibold mt-1 text-slate-700">
              Periode: Bulan {getBulanName(bulan)} {tahun}
            </p>
          </div>

          <div className="flex justify-between items-center text-[11px] sm:text-[12px] font-medium text-slate-700 mb-4 px-1">
            <span className="font-bold text-slate-900">Badan Pusat Statistik</span>
            <span>Periode Penilaian: 1 {getBulanName(bulan)} s.d. {lastDay} {getBulanName(bulan)} {tahun}</span>
          </div>

          {/* Tabel Profil Pegawai & Pejabat Penilai Kinerja */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-[11px] sm:text-[12px] border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-100/80 font-bold text-slate-900 border-b border-slate-400">
                  <th className="border border-slate-400 p-1.5 w-8 text-center">No</th>
                  <th className="border border-slate-400 p-1.5 text-left" colSpan={2}>Pegawai yang Dinilai</th>
                  <th className="border border-slate-400 p-1.5 w-8 text-center">No</th>
                  <th className="border border-slate-400 p-1.5 text-left" colSpan={2}>Pejabat Penilai Kinerja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-slate-800">
                <tr>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">1</td>
                  <td className="border border-slate-400 p-1.5 font-semibold w-28">Nama</td>
                  <td className="border border-slate-400 p-1.5 font-bold text-slate-900">{currentSelectedUser.full_name}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">1</td>
                  <td className="border border-slate-400 p-1.5 font-semibold w-28">Nama</td>
                  <td className="border border-slate-400 p-1.5 font-bold text-slate-900">{data.pimpinan.nama}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">2</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">NIP</td>
                  <td className="border border-slate-400 p-1.5">{currentSelectedUser.nip || '-'}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">2</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">NIP</td>
                  <td className="border border-slate-400 p-1.5">{data.pimpinan.nip}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">3</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">Pangkat / Golongan</td>
                  <td className="border border-slate-400 p-1.5">{currentUpload?.profile?.golongan || '-'}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">3</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">Pangkat / Golongan</td>
                  <td className="border border-slate-400 p-1.5">{data.pimpinan.pangkatGolongan}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">4</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">Jabatan</td>
                  <td className="border border-slate-400 p-1.5">{currentUpload?.profile?.jabatan || 'Pegawai'}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">4</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">Jabatan</td>
                  <td className="border border-slate-400 p-1.5">{data.pimpinan.jabatan}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">5</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">Unit Kerja</td>
                  <td className="border border-slate-400 p-1.5">{currentSelectedUser.unit_kerja || 'BPS Kabupaten Belitung'}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">5</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">Unit Kerja</td>
                  <td className="border border-slate-400 p-1.5">{data.pimpinan.unitKerja}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section: Hasil Kerja (3 Kolom: RK, Kegiatan, Bukti Dukung) */}
          <div className="mb-4">
            <h4 className="text-[12px] sm:text-[13px] font-bold text-slate-900 mb-2">
              Hasil Kerja dan Bukti Dukung:
            </h4>

            {loadingEntries ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-xs">Memuat detail kegiatan...</span>
              </div>
            ) : (
              <table className="w-full text-[11px] sm:text-[12px] border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-100/80 font-bold text-slate-900 border-b border-slate-400">
                    <th className="border border-slate-400 p-2 w-8 text-center">No</th>
                    <th className="border border-slate-400 p-2 text-left w-1/3">Rencana Kinerja (RK)</th>
                    <th className="border border-slate-400 p-2 text-left w-1/3">Kegiatan</th>
                    <th className="border border-slate-400 p-2 text-left w-1/3">Bukti Dukung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 text-slate-800">
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="border border-slate-400 p-6 text-center text-slate-400 italic">
                        Tidak ada entri kegiatan pada CKP periode ini.
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry, idx) => {
                      const hasLink = entry.data_dukung && (entry.data_dukung.startsWith('http://') || entry.data_dukung.startsWith('https://'));
                      return (
                        <tr key={entry.id || idx} className="hover:bg-slate-50/50">
                          <td className="border border-slate-400 p-2 text-center align-top font-medium text-slate-600">
                            {idx + 1}
                          </td>
                          <td className="border border-slate-400 p-2 align-top font-medium leading-relaxed">
                            {entry.rencana_kinerja || '-'}
                          </td>
                          <td className="border border-slate-400 p-2 align-top leading-relaxed">
                            {entry.kegiatan || '-'}
                            {entry.progres !== null && entry.progres !== undefined && (
                              <div className="text-[10px] text-slate-500 mt-1 font-semibold">
                                Progres: {entry.progres}%
                              </div>
                            )}
                          </td>
                          <td className="border border-slate-400 p-2 align-top text-[10.5px] leading-relaxed break-all">
                            {hasLink ? (
                              <a
                                href={entry.data_dukung}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 underline font-medium hover:text-blue-900 inline-flex items-center gap-1"
                              >
                                {entry.data_dukung}
                                <ExternalLink className="w-2.5 h-2.5 flex-shrink-0 print:hidden" />
                              </a>
                            ) : (
                              <span>{entry.data_dukung || '-'}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Area Tanda Tangan Ibu Pimpinan */}
          <div className="mt-8 flex justify-end break-inside-avoid">
            <div className="w-64 text-left text-[11px] sm:text-[12px] text-slate-900">
              <p>Belitung, {tanggalCetak}</p>
              <p className="font-semibold">Pejabat Penilai Kinerja,</p>
              <p className="text-[11px] text-slate-600 mb-16 sm:mb-20">{data.pimpinan.jabatan}</p>

              <p className="font-bold underline text-[12px] sm:text-[13px]">{data.pimpinan.nama}</p>
              <p className="text-[11px] text-slate-700">NIP. {data.pimpinan.nip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          #evaluation-document-print {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          @page {
            size: A4 portrait;
            margin: 12mm 12mm 12mm 12mm;
          }
        }
      `}</style>
    </>
  );
}
