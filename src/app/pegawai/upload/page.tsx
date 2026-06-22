"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { parseExcelFile } from '@/lib/excel/parser';
import type { ParseResult } from '@/lib/excel/parser';
import { Header } from '@/components/layout/header';
import { UploadDropzone } from '@/components/ckp/upload-dropzone';
import { DataDukungLink } from '@/components/ckp/data-dukung-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BULAN_NAMES, getBulanName } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Send,
  Info,
} from 'lucide-react';

export default function UploadPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [bulan, setBulan] = useState(currentMonth);
  const [tahun, setTahun] = useState(currentYear);
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [existingUpload, setExistingUpload] = useState<{id: string; version: number; status: string} | null>(null);

  const bulanOptions = BULAN_NAMES.map((name, index) => ({
    value: String(index + 1),
    label: name,
  }));

  const tahunOptions = Array.from({ length: 5 }, (_, i) => ({
    value: String(currentYear - 2 + i),
    label: String(currentYear - 2 + i),
  }));

  const checkExistingUpload = useCallback(async (b: number, t: number) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('ckp_uploads')
      .select('id, version, status')
      .eq('user_id', user.id)
      .eq('bulan', b)
      .eq('tahun', t)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error) {
      setExistingUpload(data);
    } else {
      console.warn('[Upload] checkExistingUpload error:', error.message);
      setExistingUpload(null);
    }
  }, [user, supabase]);

  React.useEffect(() => {
    checkExistingUpload(bulan, tahun);
  }, [bulan, tahun, checkExistingUpload]);

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setParsing(true);
    setParseResult(null);

    try {
      const result = await parseExcelFile(selectedFile);
      setParseResult(result);
    } catch {
      toast.error('Gagal membaca file Excel');
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = async () => {
    if (authLoading) {
      toast.info('Sedang memuat data pengguna, mohon tunggu...');
      return;
    }
    if (!user) {
      toast.error('Sesi login tidak ditemukan. Silakan login ulang.');
      router.push('/login');
      return;
    }
    if (!file || !parseResult?.success) return;

    // Blokir jika sudah approved
    if (existingUpload?.status === 'approved') {
      toast.error('CKP sudah disetujui. Tidak dapat mengupload ulang.');
      return;
    }

    // Blokir jika ada yang masih submitted (sedang di-review)
    if (existingUpload?.status === 'submitted') {
      toast.error('CKP sedang dalam proses review. Tunggu hasil review sebelum upload ulang.');
      return;
    }

    setUploading(true);
    const toastId = toast.loading('Memulai persiapan upload...');

    try {
      let newVersion = 1;
      let oldUploadId: string | null = null;

      if (existingUpload && (existingUpload.status === 'draft' || existingUpload.status === 'revision_required')) {
        oldUploadId = existingUpload.id;
        newVersion = existingUpload.version;
      } else if (!existingUpload) {
        newVersion = 1;
      } else {
        newVersion = existingUpload.version + 1;
      }

      toast.loading('Langkah 1/4: Mengupload file ke Storage...', { id: toastId });
      const storagePath = `${user.id}/${tahun}/${bulan}/v${newVersion}_${Date.now()}_${file.name}`;
      
      // Use Promise.race to prevent infinite hanging
      const storageUploadPromise = supabase.storage
        .from('ckp-files')
        .upload(storagePath, file, { upsert: true });
        
      const storageRes = await Promise.race([
        storageUploadPromise,
        new Promise<{error: {message: string}}>((_, reject) => setTimeout(() => reject(new Error('Timeout upload file (15 detik)')), 15000))
      ]);
      const storageError = storageRes?.error;

      if (storageError) {
        console.warn('Storage upload warning:', storageError.message);
      }

      if (oldUploadId) {
        toast.loading('Langkah 2/4: Menghapus entri lama...', { id: toastId });
        await Promise.race([
          supabase.from('ckp_entries').delete().eq('upload_id', oldUploadId),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout hapus entri lama')), 10000))
        ]);
        // Kita tidak mendelete ckp_uploads karena tidak ada RLS Delete untuk Pegawai,
        // kita akan melakukan UPDATE pada record yang sudah ada.
      }

      const totalEntries = parseResult.entries.length;
      const avgProgres = totalEntries > 0
        ? parseResult.entries.reduce((s, e) => s + (Number(e.progres) || 0), 0) / totalEntries
        : 0;

      toast.loading('Langkah 3/4: Menyimpan informasi CKP...', { id: toastId });
      let uploadReqPromise;
      if (oldUploadId) {
        uploadReqPromise = supabase
          .from('ckp_uploads')
          .update({
            file_name: file.name,
            storage_path: storagePath,
            status: 'submitted',
            total_entries: totalEntries,
            avg_progres: avgProgres,
            catatan_pimpinan: null, // Reset catatan pimpinan saat upload ulang
          })
          .eq('id', oldUploadId)
          .select()
          .single();
      } else {
        uploadReqPromise = supabase
          .from('ckp_uploads')
          .insert({
            user_id: user.id,
            bulan,
            tahun,
            version: newVersion,
            file_name: file.name,
            storage_path: storagePath,
            status: 'submitted',
            total_entries: totalEntries,
            avg_progres: avgProgres,
          })
          .select()
          .single();
      }
        
      const uploadRes = await Promise.race([
        uploadReqPromise,
        new Promise<{data: any, error: any}>((_, reject) => setTimeout(() => reject(new Error('Timeout menyimpan CKP (10 detik)')), 10000))
      ]) as any;

      const { data: uploadData, error: uploadError } = uploadRes;

      if (uploadError) throw new Error(`Gagal menyimpan data upload: ${uploadError.message}`);
      if (!uploadData) throw new Error('Upload berhasil tapi data tidak diterima dari server');

      toast.loading(`Langkah 4/4: Menyimpan ${parseResult.entries.length} entri kegiatan...`, { id: toastId });
      const entries = parseResult.entries.map((entry) => ({
        upload_id: uploadData.id,
        row_number: entry.row_number || 0,
        tanggal_mulai: entry.tanggal_mulai || null,
        tanggal_selesai: entry.tanggal_selesai || null,
        jam_mulai: entry.jam_mulai || null,
        jam_selesai: entry.jam_selesai || null,
        rencana_kinerja: entry.rencana_kinerja || null,
        kegiatan: entry.kegiatan || null,
        progres: Number(entry.progres) || 0,
        capaian: entry.capaian || null,
        data_dukung: entry.data_dukung || null,
        extra_columns: entry.extra_columns || {},
      }));

      const entriesPromise = supabase.from('ckp_entries').insert(entries);
      const entriesRes = await Promise.race([
        entriesPromise,
        new Promise<{error: any}>((_, reject) => setTimeout(() => reject(new Error('Timeout menyimpan entri CKP (15 detik)')), 15000))
      ]) as any;

      if (entriesRes.error) {
        // Rollback: ubah status kembali menjadi draft karena kita tidak bisa mendelete
        await supabase.from('ckp_uploads').update({ status: 'draft' }).eq('id', uploadData.id);
        throw new Error(`Gagal menyimpan entri CKP: ${entriesRes.error.message}`);
      }

      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: oldUploadId ? 'replace_ckp' : 'upload_ckp',
        entity_type: 'ckp_uploads',
        entity_id: uploadData.id,
        new_data: { bulan, tahun, version: newVersion, total_entries: entries.length },
      });

      toast.success(`CKP ${getBulanName(bulan)} ${tahun} berhasil diupload!`, { id: toastId });
      router.push(`/pegawai/ckp/${uploadData.id}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui';
      console.error('[Upload] handleSubmit error:', error);
      toast.error(`Gagal mengupload CKP: ${msg}`, { id: toastId, duration: 8000 });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Upload className="h-6 w-6 text-blue-500" />
            Upload CKP
          </h2>
          <p className="text-slate-500 mt-1">Upload file Excel CKP bulanan Anda</p>
        </div>

        {/* Step 1: Select Period */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Pilih Periode</CardTitle>
            <CardDescription>Pilih bulan dan tahun CKP yang akan diupload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-48">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Bulan</label>
                <Select
                  options={bulanOptions}
                  value={String(bulan)}
                  onChange={(e) => setBulan(Number(e.target.value))}
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Tahun</label>
                <Select
                  options={tahunOptions}
                  value={String(tahun)}
                  onChange={(e) => setTahun(Number(e.target.value))}
                />
              </div>
            </div>

            {existingUpload && (
              <div className={`mt-4 flex items-start gap-2 p-3 rounded-lg border ${
                existingUpload.status === 'approved'
                  ? 'bg-red-50 border-red-200'
                  : existingUpload.status === 'submitted'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-amber-50 border-amber-200'
              }`}>
                {existingUpload.status === 'approved' ? (
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                ) : existingUpload.status === 'submitted' ? (
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                ) : (
                  <Info className="h-4 w-4 text-amber-500 mt-0.5" />
                )}
                <div className="text-sm">
                  {existingUpload.status === 'approved' && (
                    <p className="text-red-700">
                      CKP periode ini sudah <strong>disetujui</strong>. Tidak dapat mengupload ulang.
                    </p>
                  )}
                  {existingUpload.status === 'submitted' && (
                    <p className="text-blue-700">
                      CKP periode ini sedang <strong>dalam review</strong> (v{existingUpload.version}). 
                      Tunggu hasil review sebelum upload ulang.
                    </p>
                  )}
                  {(existingUpload.status === 'draft' || existingUpload.status === 'revision_required') && (
                    <p className="text-amber-700">
                      Sudah ada upload v{existingUpload.version} dengan status{' '}
                      <strong>{existingUpload.status === 'revision_required' ? 'perlu revisi' : 'draft'}</strong>.
                      Upload baru akan menggantikan draft ini.
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Upload File */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Upload File Excel</CardTitle>
            <CardDescription>Pilih atau seret file Excel CKP (.xlsx / .xls)</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadDropzone
              onFileSelected={handleFileSelected}
              disabled={existingUpload?.status === 'approved'}
            />
          </CardContent>
        </Card>

        {/* Step 3: Preview */}
        {parsing && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-slate-500">Membaca file Excel...</p>
            </CardContent>
          </Card>
        )}

        {parseResult && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                3. Preview Data
              </CardTitle>
              <CardDescription>
                {parseResult.success
                  ? `${parseResult.entries.length} baris data berhasil dibaca`
                  : 'Terdapat masalah dengan file'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Errors */}
              {parseResult.errors.length > 0 && (
                <div className="space-y-2">
                  {parseResult.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-700">{err}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Warnings */}
              {parseResult.warnings.length > 0 && (
                <div className="space-y-2">
                  {parseResult.warnings.slice(0, 5).map((warn, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <Info className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700">{warn}</p>
                    </div>
                  ))}
                  {parseResult.warnings.length > 5 && (
                    <p className="text-xs text-amber-500">
                      +{parseResult.warnings.length - 5} peringatan lainnya
                    </p>
                  )}
                </div>
              )}

              {/* Mapping info */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-slate-500">Kolom terbaca:</span>
                {parseResult.mappedFields.map(f => (
                  <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                ))}
              </div>

              {/* Data preview table */}
              {parseResult.success && parseResult.entries.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">No</th>
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">Rencana Kinerja</th>
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">Kegiatan</th>
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">Tgl Mulai</th>
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">Tgl Selesai</th>
                        <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">Progres</th>
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">Bukti</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseResult.entries.slice(0, 10).map((entry, i) => (
                        <tr key={i} className="border-b border-slate-100 table-row-hover">
                          <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{entry.row_number}</td>
                          <td className="py-2 px-3 text-slate-600 text-xs leading-relaxed">{String(entry.rencana_kinerja || '—')}</td>
                          <td className="py-2 px-3 text-slate-700 text-xs leading-relaxed">{entry.kegiatan || '—'}</td>
                          <td className="py-2 px-3 text-slate-500 text-xs whitespace-nowrap">{String(entry.tanggal_mulai || '-')}</td>
                          <td className="py-2 px-3 text-slate-500 text-xs whitespace-nowrap">{String(entry.tanggal_selesai || '-')}</td>
                          <td className="py-2 px-3 text-center">
                            <span className="text-xs font-medium">{Number(entry.progres || 0).toFixed(0)}%</span>
                          </td>
                          <td className="py-2 px-3">
                            <DataDukungLink value={entry.data_dukung || null} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parseResult.entries.length > 10 && (
                    <div className="py-2 px-3 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-200">
                      Menampilkan 10 dari {parseResult.entries.length} baris
                    </div>
                  )}
                </div>
              )}

              {/* Submit button */}
              {parseResult.success && (
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSubmit}
                    loading={uploading}
                    disabled={existingUpload?.status === 'approved'}
                    size="lg"
                    className="shadow-lg shadow-blue-500/20"
                  >
                    <Send className="h-4 w-4" />
                    Submit CKP {getBulanName(bulan)} {tahun}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
