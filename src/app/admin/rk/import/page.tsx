"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import {
  FileSpreadsheet,
  Upload,
  X,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Download,
  FileJson,
  FileArchive,
  AlertTriangle,
  Play,
  Database,
} from 'lucide-react';
import { uploadRencanaKinerjaBulk } from '@/app/actions/admin';
import { importDatasetRkAction, type DatasetImportReport } from '@/app/actions/dataset-rk';
import {
  parseDatasetRkWorkbook,
  buildParsedDataset,
  type ParsedDataset,
} from '@/lib/excel/dataset-rk';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type TabKey = 'excel' | 'json' | 'zip';

export default function ImportRKPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>('zip');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Dataset RK (.zip) state ---
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  const [importYear, setImportYear] = useState<number>(new Date().getFullYear());
  const [isImporting, setIsImporting] = useState(false);
  const [importReport, setImportReport] = useState<DatasetImportReport | null>(null);
  const [lastDryRun, setLastDryRun] = useState<boolean>(false);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        "Tim Kerja": "Statistik Sosial",
        "RK Utama": "Terlaksananya Survei Angkatan Kerja Nasional",
        "Sub RK": "Melakukan pendataan lapangan Sakernas"
      },
      {
        "Tim Kerja": "Statistik Sosial",
        "RK Utama": "Terlaksananya Survei Angkatan Kerja Nasional",
        "Sub RK": "Membuat laporan hasil Sakernas"
      }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template RK");
    XLSX.writeFile(wb, "Template_Import_RK.xlsx");
  };

  const parseJsonFile = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error("JSON harus berupa array of objects.");

      const mappedData = data.map((r: any, i: number) => ({
        _id: `json-${i}`,
        tim_kerja: r.tim_kerja || r.timKerja || r["Tim Kerja"],
        rk_utama: r.rk_utama || r.rkUtama || r["RK Utama"],
        sub_rk: r.sub_rk || r.subRk || r["Sub RK"],
      })).filter(r => r.tim_kerja && r.rk_utama);

      if (mappedData.length === 0) {
        toast.error("Format JSON tidak valid atau kosong. Pastikan memiliki field tim_kerja dan rk_utama.");
        return;
      }
      setPreviewData(mappedData);
      toast.success(`Berhasil membaca ${mappedData.length} baris data JSON`);
    } catch (e: any) {
      toast.error("Gagal parse JSON: " + e.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (file.name.endsWith('.json')) {
        await parseJsonFile(file);
      } else {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet) as any[];

        const mappedData = rows.map((r, i) => ({
          _id: `excel-${i}`,
          tim_kerja: r['Tim Kerja'] || r['Tim kerja'] || r['tim_kerja'],
          rk_utama: r['RK Utama'] || r['Rencana kinerja'] || r['Rencana Kinerja'] || r['rencana_kinerja'],
          sub_rk: r['Sub RK'] || r['Sub Rk'] || r['sub_rk'],
        })).filter(r => r.tim_kerja && r.rk_utama);

        if (mappedData.length === 0) {
          toast.error("Format Excel tidak valid. Pastikan ada kolom 'Tim Kerja' dan 'RK Utama'.");
          setPreviewData([]);
          return;
        }

        setPreviewData(mappedData);
        toast.success(`Berhasil membaca ${mappedData.length} baris data`);
      }
    } catch (error: any) {
      toast.error("Gagal membaca file: " + error.message);
      setPreviewData([]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (previewData.length === 0 || !user) return;

    setIsSaving(true);
    try {
      const res = await uploadRencanaKinerjaBulk(previewData, user.id);
      if (res.success) {
        toast.success(`Berhasil menyimpan ${res.processed} RK Utama dan ${res.processedSub} Sub-RK.`);
        router.push('/admin/rk');
      } else {
        toast.error("Gagal menyimpan data: " + res.error);
      }
    } catch (error: any) {
      toast.error("Terjadi kesalahan: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // Dataset RK (.zip)
  // ============================================================
  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setDataset(null);
    setImportReport(null);
    try {
      const zip = await JSZip.loadAsync(await file.arrayBuffer());
      const entries = Object.values(zip.files).filter(
        (f) =>
          !f.dir &&
          /\.xlsx?$/i.test(f.name) &&
          !/(^|\/)\./.test(f.name) &&
          !f.name.includes('__MACOSX')
      );

      if (entries.length === 0) {
        toast.error('Tidak ada file .xlsx di dalam ZIP.');
        return;
      }

      const parts = [];
      for (const entry of entries) {
        const buffer = await entry.async('arraybuffer');
        const baseName = entry.name.split('/').pop() || entry.name;
        parts.push(parseDatasetRkWorkbook(baseName, buffer));
      }

      const parsed = buildParsedDataset(parts);
      setDataset(parsed);
      toast.success(
        `Terbaca ${parsed.totals.teams} tim, ${parsed.totals.parents} RK Ketua Tim, ${parsed.totals.subRks} Sub-RK.`
      );
    } catch (error: any) {
      toast.error('Gagal membaca ZIP: ' + error.message);
      setDataset(null);
    } finally {
      setIsUploading(false);
      if (zipInputRef.current) zipInputRef.current.value = '';
    }
  };

  const runImport = async (dryRun: boolean) => {
    if (!dataset) return;
    setIsImporting(true);
    setImportReport(null);
    try {
      const res = await importDatasetRkAction(dataset, importYear, dryRun);
      if (!res.success || !res.report) {
        toast.error('Gagal: ' + (res.error || 'Tidak ada laporan'));
        return;
      }
      setImportReport(res.report);
      setLastDryRun(dryRun);
      if (dryRun) {
        toast.success('Pemeriksaan selesai (belum disimpan).');
      } else {
        toast.success(
          `Impor selesai: ${res.report.parents} RK, ${res.report.subRks} Sub-RK, ${res.report.assignments} penugasan.`
        );
      }
    } catch (error: any) {
      toast.error('Terjadi kesalahan: ' + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in max-w-7xl mx-auto">

        <div className="flex items-center gap-4">
          <Link href="/admin/rk" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Kembali">
            <ArrowLeft size={18} className="text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Import Rencana Kinerja
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Upload Dataset RK (.zip) tahunan, atau Excel/JSON RK Utama + Sub-RK.
            </p>
          </div>
        </div>

        {!previewData.length && !dataset && (
          <div className="bg-white dark:bg-[var(--card-bg)] rounded-2xl border p-6 shadow-sm" style={{ borderColor: 'var(--border)' }}>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setActiveTab('zip')}
                className={`pb-3 text-[14px] font-medium transition-colors border-b-2 px-2 ${activeTab === 'zip' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Dataset RK (.zip)
              </button>
              <button
                onClick={() => setActiveTab('excel')}
                className={`pb-3 text-[14px] font-medium transition-colors border-b-2 px-2 ${activeTab === 'excel' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Upload via Excel
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`pb-3 text-[14px] font-medium transition-colors border-b-2 px-2 ${activeTab === 'json' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Upload via JSON
              </button>
            </div>

            {/* ZIP Tab */}
            {activeTab === 'zip' && (
              <div className="flex flex-col items-center justify-center text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mb-4">
                  <FileArchive size={28} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Dataset RK (ZIP)</h3>
                <p className="text-[13px] mb-6 max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                  Upload <code>Dataset RK.zip</code> berisi file Excel per tim (sheet <strong>Matriks</strong>).
                  Sistem otomatis membaca RK Ketua Tim (Baris 1) dan Sub-RK Anggota (baris berikutnya),
                  lalu menyimpannya sebagai <strong>RK tahun aktif</strong>. RK tahun sebelumnya diarsipkan (tidak dihapus).
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                  <label className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>Tahun RK</label>
                  <input
                    type="number"
                    min={2020}
                    max={2100}
                    value={importYear}
                    onChange={(e) => setImportYear(Number(e.target.value))}
                    className="w-28 h-10 text-[13px] px-3 rounded-xl border outline-none text-center"
                    style={{ background: 'var(--card-bg)', borderColor: 'var(--sand-border)', color: 'var(--text-primary)' }}
                  />
                </div>

                <button
                  onClick={() => zipInputRef.current?.click()}
                  disabled={isUploading}
                  className="btn-primary flex items-center gap-2"
                >
                  {isUploading ? <><RefreshCw size={16} className="animate-spin" /> Memproses...</> : <><Upload size={16} /> Pilih Dataset RK.zip</>}
                </button>
                <input type="file" accept=".zip" className="hidden" ref={zipInputRef} onChange={handleZipUpload} />
              </div>
            )}

            {/* Excel Tab */}
            {activeTab === 'excel' && (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mb-4">
                  <FileSpreadsheet size={28} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Format Excel</h3>
                <p className="text-[13px] mb-6 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                  Gunakan template standar kami agar sistem dapat membaca data dengan benar. Kolom wajib: <strong>Tim Kerja</strong> dan <strong>RK Utama</strong>.
                </p>

                <div className="flex gap-3">
                  <button onClick={handleDownloadTemplate} className="btn-secondary flex items-center gap-2">
                    <Download size={16} /> Download Template
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="btn-primary flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)]">
                    {isUploading ? <><RefreshCw size={16} className="animate-spin" /> Memproses...</> : <><Upload size={16} /> Pilih File Excel</>}
                  </button>
                </div>
                <input type="file" accept=".xlsx,.xls" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              </div>
            )}

            {/* JSON Tab */}
            {activeTab === 'json' && (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[var(--primary)] flex items-center justify-center mb-4">
                  <FileJson size={28} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Format JSON</h3>
                <p className="text-[13px] mb-6 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                  Upload file <code>.json</code> yang berisi array objek dengan key yang sesuai.
                </p>

                <div className="text-left bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6 w-full max-w-2xl text-[12px] font-mono overflow-x-auto text-slate-700 dark:text-slate-300">
                  <pre>{`[
  {
    "tim_kerja": "Statistik Sosial",
    "rk_utama": "Terlaksananya Survei Nasional",
    "sub_rk": "Melakukan pendataan lapangan"
  }
]`}</pre>
                </div>

                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="btn-primary flex items-center gap-2">
                  {isUploading ? <><RefreshCw size={16} className="animate-spin" /> Memproses...</> : <><Upload size={16} /> Pilih File JSON</>}
                </button>
                <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              </div>
            )}
          </div>
        )}

        {/* Preview Excel/JSON */}
        {previewData.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-blue-50/50 dark:bg-blue-900/20" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <CheckCircle2 size={20} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">Preview Data Siap Disimpan</h4>
                  <p className="text-xs text-[var(--primary)] mt-0.5">{previewData.length} baris data berhasil terbaca.</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => setPreviewData([])} disabled={isSaving} className="flex-1 sm:flex-none btn-secondary text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 justify-center">
                  <X size={14} className="mr-1.5" /> Batal
                </button>
                <button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none btn-primary justify-center">
                  {isSaving ? <><RefreshCw size={14} className="animate-spin mr-1.5" /> Menyimpan...</> : <>Simpan Data</>}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border max-h-[600px] overflow-y-auto" style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}>
              <table className="w-full text-left text-[13px]">
                <thead className="sticky top-0 z-10" style={{ background: 'var(--sand-subtle)', color: 'var(--text-secondary)' }}>
                  <tr>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Tim Kerja</th>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)] w-1/3">RK Utama</th>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)] w-1/3">Sub RK</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((r) => (
                    <tr key={r._id} className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 font-medium text-[var(--primary)]">{r.tim_kerja}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }} title={r.rk_utama}>
                          {r.rk_utama}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="line-clamp-2 text-slate-600 dark:text-slate-400" title={r.sub_rk}>
                          {r.sub_rk || <span className="italic opacity-50">Kosong</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Preview Dataset RK */}
        {dataset && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-blue-50/50 dark:bg-blue-900/20 gap-3" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <CheckCircle2 size={20} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">Dataset RK terbaca</h4>
                  <p className="text-xs text-[var(--primary)] mt-0.5">
                    {dataset.totals.teams} tim &middot; {dataset.totals.parents} RK Ketua Tim &middot; {dataset.totals.subRks} Sub-RK
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setDataset(null); setImportReport(null); }} disabled={isImporting} className="btn-secondary text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 justify-center">
                  <X size={14} className="mr-1.5" /> Batal
                </button>
                <button onClick={() => runImport(true)} disabled={isImporting} className="btn-secondary flex items-center gap-2 justify-center">
                  {isImporting ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />} Periksa (dry-run)
                </button>
                <button onClick={() => runImport(false)} disabled={isImporting} className="btn-primary flex items-center gap-2 justify-center">
                  {isImporting ? <><RefreshCw size={14} className="animate-spin" /> Memproses...</> : <><Database size={14} /> Simpan ke Database</>}
                </button>
              </div>
            </div>

            {dataset.warnings.length > 0 && (
              <div className="rounded-xl border p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50">
                <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-300">
                  <AlertTriangle size={16} />
                  <span className="text-sm font-medium">{dataset.warnings.length} peringatan parse</span>
                </div>
                <ul className="text-[12px] space-y-1 text-amber-800 dark:text-amber-200 list-disc pl-5">
                  {dataset.warnings.slice(0, 20).map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}

            <div className="overflow-x-auto rounded-xl border max-h-[600px] overflow-y-auto" style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}>
              <table className="w-full text-left text-[13px]">
                <thead className="sticky top-0 z-10" style={{ background: 'var(--sand-subtle)', color: 'var(--text-secondary)' }}>
                  <tr>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Tim (nama file)</th>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Ketua Tim</th>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)] text-right">RK Ketua</th>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)] text-right">Sub-RK</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.teams.map((t, i) => (
                    <tr key={i} className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 font-medium text-[var(--primary)]">{t.teamName}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>
                        {t.ketua?.nama || <span className="italic opacity-50">Tidak terbaca</span>}
                      </td>
                      <td className="px-4 py-3 text-right">{t.parents.length}</td>
                      <td className="px-4 py-3 text-right">{t.parents.reduce((m, p) => m + p.subRks.length, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {importReport && (
              <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    Laporan Impor &mdash; Tahun {importReport.year}
                  </h4>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${lastDryRun ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'}`}>
                    {lastDryRun ? 'dry-run (belum disimpan)' : 'tersimpan'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {([
                    ['Tim', importReport.teams],
                    ['RK Ketua Tim', importReport.parents],
                    ['Sub-RK Anggota', importReport.subRks],
                    ['Penugasan', importReport.assignments],
                  ] as [string, number][]).map(([label, val]) => (
                    <div key={label} className="rounded-lg border p-3" style={{ borderColor: 'var(--border)' }}>
                      <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{label}</div>
                      <div className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{val}</div>
                    </div>
                  ))}
                </div>

                {importReport.missingEmployees.length > 0 && (
                  <div className="rounded-lg border p-3 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50">
                    <p className="text-[12px] font-medium text-amber-700 dark:text-amber-300 mb-1">
                      {importReport.missingEmployees.length} pegawai tidak ditemukan di SIKAP (dilewati):
                    </p>
                    <p className="text-[12px] text-amber-800 dark:text-amber-200">
                      {importReport.missingEmployees.join(', ')}
                    </p>
                  </div>
                )}

                {importReport.warnings.length > 0 && (
                  <div className="rounded-lg border p-3 bg-slate-50 dark:bg-slate-800/50" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Catatan:</p>
                    <ul className="text-[12px] list-disc pl-5 space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {importReport.warnings.slice(0, 20).map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
