"use client";

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { BULAN_NAMES, getBulanName, getFormattedPenilaianPeriod } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  FileDown, Printer, FileSpreadsheet, ExternalLink, Calendar, 
  Users, CheckCircle2, AlertCircle, Loader2, Sparkles, Archive,
  Smile, Frown, Info
} from 'lucide-react';
import { 
  getExportPenilaianData, 
  getExportEntriesForUpload, 
  getAllEntriesForPeriodAction,
  type PimpinanInfo, 
  type ExportPegawaiUpload 
} from '@/app/actions/export';
import { generateEvaluationPdf } from '@/lib/export/pdf-generator';
import { groupEntriesByRK, type GroupedRK } from '@/lib/export/evaluasi-helper';

interface ExportPenilaianClientProps {
  initialBulan: number;
  initialTahun: number;
  initialData: {
    pimpinan: PimpinanInfo;
    uploads: ExportPegawaiUpload[];
    allUsers: {
      id: string;
      full_name: string;
      nip: string | null;
      unit_kerja: string | null;
      role: string;
      profile?: { jabatan: string | null; golongan: string | null } | null;
    }[];
  };
  isEmployeeView?: boolean;
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
  isEmployeeView = false,
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
  const [downloadingAllZip, setDownloadingAllZip] = useState<boolean>(false);
  const [bulkProgress, setBulkProgress] = useState<string>('');

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

  // Find current selected profile (from upload or from allUsers)
  const currentSelectedProfile = useMemo(() => {
    return (
      currentUpload?.profile ||
      data.allUsers.find(u => u.id === selectedUserId)?.profile ||
      null
    );
  }, [currentUpload, data.allUsers, selectedUserId]);

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

  // Group entries by Rencana Kinerja (RK)
  const groupedEntries: GroupedRK[] = useMemo(() => {
    return groupEntriesByRK(entries);
  }, [entries]);

  // Handle period change
  const handlePeriodChange = (newBulan: number, newTahun: number) => {
    setBulan(newBulan);
    setTahun(newTahun);
    startTransition(async () => {
      try {
        const targetId = isEmployeeView ? (selectedUserId || data.allUsers[0]?.id) : undefined;
        const newData = await getExportPenilaianData(newBulan, newTahun, targetId);
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
          jabatan: currentSelectedProfile?.jabatan || null,
          golongan: currentSelectedProfile?.golongan || null,
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

  // Bulk Download All Employees ZIP Action
  const handleDownloadAllZip = async () => {
    if (data.uploads.length === 0) {
      toast.error('Tidak ada data CKP pegawai pada periode ini untuk didownload.');
      return;
    }

    try {
      setDownloadingAllZip(true);
      setBulkProgress('Mengambil data kegiatan seluruh pegawai...');

      const allEntriesMap = await getAllEntriesForPeriodAction(bulan, tahun);
      const zip = new JSZip();
      const folderName = `Evaluasi_Kinerja_Pegawai_${getBulanName(bulan)}_${tahun}`;
      const folder = zip.folder(folderName);
      if (!folder) throw new Error('Gagal membuat folder ZIP');

      let count = 0;
      for (const upload of data.uploads) {
        count++;
        setBulkProgress(`Membuat PDF (${count}/${data.uploads.length}): ${upload.user?.full_name || 'Pegawai'}`);

        const empEntries = allEntriesMap[upload.id] || [];
        const pdfDoc = generateEvaluationPdf({
          pegawai: {
            full_name: upload.user?.full_name || 'Pegawai',
            nip: upload.user?.nip || null,
            unit_kerja: upload.user?.unit_kerja || 'BPS Kabupaten Belitung',
            jabatan: upload.profile?.jabatan || null,
            golongan: upload.profile?.golongan || null,
          },
          pimpinan: data.pimpinan,
          bulan,
          tahun,
          tanggalCetak,
          entries: empEntries,
        });

        const pdfBlob = pdfDoc.output('blob');
        const safeName = (upload.user?.full_name || `Pegawai_${count}`).replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${String(count).padStart(2, '0')}_Evaluasi_${safeName}.pdf`;
        folder.file(fileName, pdfBlob);
      }

      setBulkProgress('Mengompres file ZIP...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `Evaluasi_Kinerja_Semua_Pegawai_${getBulanName(bulan)}_${tahun}.zip`);
      toast.success(`Berhasil mendownload berkas penilaian untuk ${data.uploads.length} pegawai!`);
    } catch (err: any) {
      console.error('Bulk export error:', err);
      toast.error('Gagal mendownload seluruh pegawai: ' + err.message);
    } finally {
      setDownloadingAllZip(false);
      setBulkProgress('');
    }
  };

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Hide header and UI controls when printing */}
      <div className="print:hidden">
        <Header />
      </div>

      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
        {/* Top Header Controls (Hidden during print) */}
        <div className="print:hidden flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {isEmployeeView ? 'Evaluasi Penilaian Saya' : 'Evaluasi Penilaian Bulanan'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {isEmployeeView 
                ? 'Rekap hasil evaluasi kinerja bulanan resmi pejabat penilai kinerja'
                : 'Rekap evaluasi kinerja bulanan pegawai resmi pejabat penilai kinerja'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Download All Button (Only for Admin/Pimpinan) */}
            {!isEmployeeView && (
              <Button
                onClick={handleDownloadAllZip}
                disabled={downloadingAllZip || data.uploads.length === 0}
                variant="outline"
                className="gap-1.5 sm:gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 shadow-sm font-semibold whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4"
              >
                {downloadingAllZip ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span className="text-xs">{bulkProgress || 'Memproses...'}</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>Download Semua ({data.uploads.length} ZIP)</span>
                  </>
                )}
              </Button>
            )}

            {/* Download Single PDF Button */}
            <Button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf || loadingEntries}
              className="gap-1.5 sm:gap-2 shadow-sm font-semibold whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4"
            >
              {downloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              <span>Download PDF</span>
            </Button>

            {/* Print Button */}
            <Button
              onClick={handlePrint}
              variant="outline"
              className="gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-sm font-semibold whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Print</span>
            </Button>
          </div>
        </div>

        {/* Filter Panel (Hidden during print) */}
        <Card className="print:hidden border shadow-sm" style={{ background: 'var(--bg-card)' }}>
          <CardContent className="p-4 sm:p-5">
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${isEmployeeView ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4 items-end`}>
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

              {/* Pilih Pegawai (Only for Admin/Pimpinan) */}
              {!isEmployeeView && (
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
                      const jabatanText = u.profile?.jabatan ? ` — ${u.profile.jabatan}` : '';
                      return (
                        <option key={u.id} value={u.id}>
                          {u.full_name}{jabatanText} {hasUpload ? '✓ (Ada CKP)' : '(Belum ada CKP)'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

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
              <div className="mt-4 p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-lg flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>
                    Ditemukan CKP versi {currentUpload.version} ({entries.length} kegiatan, {groupedEntries.length} Rencana Kinerja) - Status: <strong>{currentUpload.status}</strong>
                  </span>
                </div>
                {currentUpload.approved_at && (
                  <span className="text-[11px] opacity-80 font-medium">
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
            <span>Periode Penilaian: {getFormattedPenilaianPeriod(bulan, tahun)}</span>
          </div>

          {/* Tabel Profil Pegawai & Pejabat Penilai Kinerja */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-[11px] sm:text-[12px] border-collapse border border-slate-400">
              <thead className="bg-[#0F766E] text-white">
                <tr className="bg-[#0F766E] font-bold text-white border-b border-[#0F766E]">
                  <th className="border border-slate-400 p-1.5 w-8 text-center bg-[#0F766E] text-white">No</th>
                  <th className="border border-slate-400 p-1.5 text-left bg-[#0F766E] text-white" colSpan={2}>Pegawai yang Dinilai</th>
                  <th className="border border-slate-400 p-1.5 w-8 text-center bg-[#0F766E] text-white">No</th>
                  <th className="border border-slate-400 p-1.5 text-left bg-[#0F766E] text-white" colSpan={2}>Pejabat Penilai Kinerja</th>
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
                  <td className="border border-slate-400 p-1.5 font-medium">{currentSelectedProfile?.golongan || '-'}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">3</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">Pangkat / Golongan</td>
                  <td className="border border-slate-400 p-1.5 font-medium">{data.pimpinan.pangkatGolongan || 'Pembina Tk.I, IV/b'}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">4</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">Jabatan</td>
                  <td className="border border-slate-400 p-1.5 font-medium">{currentSelectedProfile?.jabatan || '-'}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">4</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">Jabatan</td>
                  <td className="border border-slate-400 p-1.5 font-medium">{data.pimpinan.jabatan || 'Kepala BPS Kabupaten Belitung'}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">5</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">Unit Kerja</td>
                  <td className="border border-slate-400 p-1.5">{currentSelectedUser.unit_kerja || 'BPS Kabupaten Belitung'}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-medium">5</td>
                  <td className="border border-slate-400 p-1.5 font-semibold">Unit Kerja</td>
                  <td className="border border-slate-400 p-1.5">{data.pimpinan.unitKerja || 'BPS Kabupaten Belitung'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section: Hasil Kerja (4 Kolom Sesuai Foto 1 & Foto 2) */}
          <div className="mb-4">
            <div className="mb-2">
              <h4 className="text-[12px] sm:text-[13px] font-bold text-[#0F766E]">
                Hasil Kerja dan Umpan Balik Berkelanjutan:
              </h4>
            </div>

            {loadingEntries ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-[#0F766E]" />
                <span className="text-xs">Memuat detail kegiatan...</span>
              </div>
            ) : (
              <table className="w-full text-[11px] sm:text-[12px] border-collapse border border-slate-400">
                <thead className="bg-[#0F766E] text-white">
                  <tr className="bg-[#0F766E] font-bold text-white border-b border-[#0F766E]">
                    <th className="border border-slate-400 p-2 w-8 text-center bg-[#0F766E] text-white">No</th>
                    <th className="border border-slate-400 p-2 text-center w-[28%] bg-[#0F766E] text-white">Rencana Kinerja</th>
                    <th className="border border-slate-400 p-2 text-center w-[47%] bg-[#0F766E] text-white">Kegiatan</th>
                    <th className="border border-slate-400 p-2 text-center w-[25%] bg-[#0F766E] text-white">
                      Umpan Balik Berkelanjutan<br />Berdasarkan Bukti Dukung
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 text-slate-800">
                  {groupedEntries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="border border-slate-400 p-6 text-center text-slate-400 italic">
                        Tidak ada entri kegiatan pada CKP periode ini.
                      </td>
                    </tr>
                  ) : (
                    groupedEntries.map((group, idx) => (
                      <tr key={group.rencana_kinerja || idx} className="hover:bg-slate-50/50">
                        <td className="border border-slate-400 p-2.5 text-center align-top font-medium text-slate-600">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-400 p-2.5 align-top font-semibold text-slate-900 leading-relaxed">
                          {group.rencana_kinerja}
                        </td>
                        <td className="border border-slate-400 p-2.5 align-top leading-relaxed">
                          <div className="space-y-3">
                            {group.items.map((item, itemIdx) => {
                              const hasLink = item.data_dukung && (item.data_dukung.startsWith('http://') || item.data_dukung.startsWith('https://'));
                              return (
                                <div key={item.id || itemIdx} className={itemIdx > 0 ? "pt-2.5 border-t border-slate-200" : ""}>
                                  <div className="font-normal text-slate-800 leading-snug">
                                    {group.items.length > 1 && (
                                      <span className="text-slate-500 mr-1.5">{itemIdx + 1}.</span>
                                    )}
                                    {item.kegiatan || '-'}
                                    {item.progres !== null && item.progres !== undefined && (
                                      <span className="ml-1.5 text-[10.5px] text-slate-500">
                                        ({item.progres}%)
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-1 text-[11px] text-slate-600 break-all leading-relaxed">
                                    <span className="text-slate-500 mr-1">Bukti dukung:</span>
                                    {hasLink ? (
                                      <a
                                        href={item.data_dukung!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-700 underline hover:text-blue-900 inline-flex items-center gap-1 font-normal"
                                      >
                                        {item.data_dukung}
                                        <ExternalLink className="w-2.5 h-2.5 flex-shrink-0 print:hidden" />
                                      </a>
                                    ) : (
                                      <span>{item.data_dukung || '-'}</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="border border-slate-400 p-2.5 align-top text-center">
                          <div className="flex flex-col items-center justify-center gap-1.5 pt-1">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${group.umpanBalik.bgClass}`}>
                              {group.umpanBalik.color === 'green' && <Smile className="w-3.5 h-3.5" />}
                              {group.umpanBalik.color === 'blue' && <Smile className="w-3.5 h-3.5" />}
                              {group.umpanBalik.color === 'red' && <Frown className="w-3.5 h-3.5" />}
                              <span>{group.umpanBalik.label}</span>
                            </span>
                            {group.score !== null && (
                              <span className="text-[10.5px] font-semibold text-slate-500 print:text-slate-700">
                                Nilai: {group.score}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
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

        {/* ── KETERANGAN BATAS NILAI (DI BAWAH PREVIEW DOKUMEN) ── */}
        <div className="print:hidden max-w-4xl mx-auto p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Keterangan Batas Nilai
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 min-w-[54px]">99 - 100 :</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16a34a] text-white font-semibold text-xs shadow-xs">
                  <Smile className="w-3.5 h-3.5" />
                  <span>Diatas Ekspektasi</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 min-w-[54px]">80 - 98 :</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0284c7] text-white font-semibold text-xs shadow-xs">
                  <Smile className="w-3.5 h-3.5" />
                  <span>Sesuai Ekspektasi</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 min-w-[54px]">0 - 79 :</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dc2626] text-white font-semibold text-xs shadow-xs">
                  <Frown className="w-3.5 h-3.5" />
                  <span>Dibawah Ekspektasi</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded print styles */}
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
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
