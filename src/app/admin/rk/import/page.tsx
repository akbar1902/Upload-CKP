"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { FileSpreadsheet, Upload, X, CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react';
import { uploadRencanaKinerjaBulk } from '@/app/actions/admin';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ImportRKPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet) as any[];

      // Format expected from new Excel screenshot: 
      // Nama | Tim kerja | Status | Rencana kinerja
      const mappedData = rows.map((r, i) => ({
        _id: i, // temporary id for react key
        nama: r['Nama'],
        tim_kerja: r['Tim kerja'] || r['tim_kerja'],
        status: r['Status'] || r['status'],
        rencana_kinerja: r['Rencana kinerja'] || r['rencana_kinerja'] || r['Rencana Kinerja'] || r['RK'],
      })).filter(r => r.rencana_kinerja && r.nama);

      if (mappedData.length === 0) {
        toast.error("Format Excel tidak valid atau kosong. Pastikan ada kolom 'Nama' dan 'Rencana kinerja'.");
        setPreviewData([]);
        return;
      }

      setPreviewData(mappedData);
      toast.success(`Berhasil membaca ${mappedData.length} baris data`);
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
        toast.success(`Berhasil menyimpan ${res.processed} Rencana Kinerja (beserta keanggotaannya).`);
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
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
        
        <div className="flex items-center gap-4">
          <Link href="/admin/rk" className="p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Kembali">
            <ArrowLeft size={18} className="text-slate-600" />
          </Link>
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Import Rencana Kinerja
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Upload file Excel berisi daftar Rencana Kinerja dan Penugasan Anggota.
            </p>
          </div>
        </div>

        {!previewData.length && (
          <div className="border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30" style={{ borderColor: 'var(--border)' }}>
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Upload size={24} />
            </div>
            <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Upload File Excel</h3>
            <p className="text-[13px] mb-6 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              Gunakan format Excel dengan kolom: <strong>Nama</strong>, <strong>Tim kerja</strong>, <strong>Status</strong>, dan <strong>Rencana kinerja</strong>.
            </p>
            
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isUploading}
              className="btn-primary flex items-center gap-2"
            >
              {isUploading ? (
                <><RefreshCw size={16} className="animate-spin" /> Memproses...</>
              ) : (
                <><FileSpreadsheet size={16} /> Pilih File Excel</>
              )}
            </button>
          </div>
        )}

        {previewData.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border bg-blue-50/50" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-blue-600" />
                <div>
                  <h4 className="font-medium text-sm text-blue-900">Preview Data Siap Disimpan</h4>
                  <p className="text-xs text-blue-700 mt-0.5">{previewData.length} baris data berhasil terbaca.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPreviewData([])} 
                  disabled={isSaving}
                  className="btn-secondary text-slate-600 hover:bg-slate-100"
                >
                  <X size={14} className="mr-1.5" /> Batal
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary"
                >
                  {isSaving ? (
                    <><RefreshCw size={14} className="animate-spin mr-1.5" /> Menyimpan...</>
                  ) : (
                    <>Simpan Data</>
                  )}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border max-h-[600px] overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-left text-[13px]">
                <thead className="sticky top-0 z-10" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  <tr>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Nama</th>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Tim Kerja</th>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Status</th>
                    <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Rencana Kinerja</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((r) => (
                    <tr key={r._id} className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3">
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{r.nama}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{r.tim_kerja || '—'}</td>
                      <td className="px-4 py-3">
                        {r.status?.toLowerCase() === 'ketua tim' ? (
                          <span className="badge-pill bg-purple-50 text-purple-700 text-[11px] px-2 py-0.5 font-medium">Ketua Tim</span>
                        ) : (
                          <span className="badge-pill bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5">Anggota</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="line-clamp-1 max-w-sm" style={{ color: 'var(--text-primary)' }} title={r.rencana_kinerja}>
                          {r.rencana_kinerja}
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
