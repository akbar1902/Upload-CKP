"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { FileSpreadsheet, Upload, X, CheckCircle2, RefreshCw, ArrowLeft, Download, FileJson } from 'lucide-react';
import { uploadRencanaKinerjaBulk } from '@/app/actions/admin';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ImportRKPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'excel' | 'json'>('excel');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        "Tim Kerja": "Statistik Sosial",
        "Ketua Tim": "Budi Santoso",
        "RK Utama": "Terlaksananya Survei Angkatan Kerja Nasional",
        "Sub RK": "Melakukan pendataan lapangan Sakernas"
      },
      {
        "Tim Kerja": "Statistik Sosial",
        "Ketua Tim": "Budi Santoso",
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
        ketua_tim: r.ketua_tim || r.ketuaTim || r["Ketua Tim"],
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
          ketua_tim: r['Ketua Tim'] || r['Ketua team'] || r['ketua_tim'],
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
              Import Rencana Kinerja (Excel/JSON)
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Upload file untuk memetakan RK Utama beserta Sub-RK secara instan.
            </p>
          </div>
        </div>

        {!previewData.length && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b" style={{ borderColor: 'var(--border)' }}>
              <button 
                onClick={() => setActiveTab('excel')}
                className={`pb-3 text-[14px] font-medium transition-colors border-b-2 px-2 ${activeTab === 'excel' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Upload via Excel
              </button>
              <button 
                onClick={() => setActiveTab('json')}
                className={`pb-3 text-[14px] font-medium transition-colors border-b-2 px-2 ${activeTab === 'json' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Upload via JSON
              </button>
            </div>

            {/* Excel Tab */}
            {activeTab === 'excel' && (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
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
                  <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="btn-primary flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                    {isUploading ? <><RefreshCw size={16} className="animate-spin" /> Memproses...</> : <><Upload size={16} /> Pilih File Excel</>}
                  </button>
                </div>
                <input type="file" accept=".xlsx,.xls" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              </div>
            )}

            {/* JSON Tab */}
            {activeTab === 'json' && (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
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
    "ketua_tim": "Budi Santoso",
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

        {previewData.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-blue-50/50 dark:bg-blue-900/20" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <CheckCircle2 size={20} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">Preview Data Siap Disimpan</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">{previewData.length} baris data berhasil terbaca.</p>
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
                <thead className="sticky top-0 z-10" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  <tr>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Tim Kerja</th>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Ketua Tim</th>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)] w-1/3">RK Utama</th>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)] w-1/3">Sub RK</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((r) => (
                    <tr key={r._id} className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">{r.tim_kerja}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{r.ketua_tim || '—'}</td>
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
      </div>
    </>
  );
}
