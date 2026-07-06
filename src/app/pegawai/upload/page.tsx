"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
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
import { Check, CheckCircle2, ChevronDown, ChevronUp, FileSpreadsheet, Loader2, UploadCloud, X, LayoutDashboard, Upload, AlertTriangle, ArrowLeft, Send, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export default function UploadPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [bulan, setBulan] = useState(currentMonth);
  const [tahun, setTahun] = useState(currentYear);
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingUpload, setExistingUpload] = useState<{id: string; version: number; status: string} | null>(null);

  // States for Team Assignment Prompt
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [unmatchedRKs, setUnmatchedRKs] = useState<string[]>([]);
  const [rkTeamMapping, setRkTeamMapping] = useState<Record<string, { tim_kerja: string, ketua_tim_id: string }>>({});
  const [masterRKs, setMasterRKs] = useState<any[]>([]);
  const [uniqueTeams, setUniqueTeams] = useState<{tim_kerja: string, ketua_tim_id: string}[]>([]);
  const [ketuaTims, setKetuaTims] = useState<any[]>([]);
  const [timKerjaList, setTimKerjaList] = useState<string[]>([]);

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

  React.useEffect(() => {
    const fetchMasterRKs = async () => {
      const { data } = await supabase.from('rk_ketua_tim_mapping').select('id, rencana_kinerja, tim_kerja, ketua_tim_id').limit(10000);
      if (data) {
        setMasterRKs(data);
        const teamsMap = new Map<string, string>();
        data.forEach((rk: any) => {
          if (rk.tim_kerja) {
            teamsMap.set(rk.tim_kerja, rk.ketua_tim_id || '');
          }
        });
        const teams = Array.from(teamsMap.entries()).map(([tim_kerja, ketua_tim_id]) => ({ tim_kerja, ketua_tim_id }));
        setUniqueTeams(teams);
        setTimKerjaList(Array.from(teamsMap.keys()));
      }

      const { data: ketuas } = await supabase.from('profiles').select('id, full_name, unit_kerja');
      if (ketuas) setKetuaTims(ketuas);
    };
    fetchMasterRKs();
  }, [supabase]);

  const normalize = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const getSimilarity = (s1: string, s2: string) => {
    if (!s1 || !s2) return 0;
    if (s1 === s2) return 1;
    if (s1.length < 2 || s2.length < 2) return 0;
    let bg1 = new Set();
    for(let i=0; i<s1.length-1; i++) bg1.add(s1.substring(i, i+2));
    let bg2 = new Set();
    for(let i=0; i<s2.length-1; i++) bg2.add(s2.substring(i, i+2));
    let intersection = 0;
    for(let item of bg1) if (bg2.has(item)) intersection++;
    return (2.0 * intersection) / (bg1.size + bg2.size);
  };

  const fuzzyMatchRK = (input: string, masterNames: string[]) => {
    if (!input) return input;
    const normInput = normalize(input);
    if (!normInput) return input;
    
    let bestMatch = '';
    let bestScore = 0;
    
    for (const master of masterNames) {
      const normMaster = normalize(master);
      if (normMaster === normInput) return master;
      
      const score = getSimilarity(normInput, normMaster);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = master;
      }
    }
    
    if (bestScore > 0.8) {
       return bestMatch;
    }

    return String(input).trim().replace(/\s+/g, ' ');
  };

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
  };

  React.useEffect(() => {
    if (!file) return;

    let isMounted = true;
    const parse = async () => {
      setParsing(true);
      setParseResult(null);

      try {
        const result = await parseExcelFile(file, bulan, tahun);
        if (isMounted) {
          setParseResult(result);
        }
      } catch {
        if (isMounted) {
          toast.error('Gagal membaca file Excel');
        }
      } finally {
        if (isMounted) {
          setParsing(false);
        }
      }
    };

    parse();

    return () => {
      isMounted = false;
    };
  }, [file, bulan, tahun]);

  const [parsing, setParsing] = useState(false);

  const handlePreSubmit = async () => {
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

    if (existingUpload?.status === 'approved') {
      toast.error('CKP sudah disetujui. Tidak dapat mengupload ulang.');
      return;
    }

    if (existingUpload?.status === 'submitted') {
      toast.error('CKP sedang dalam proses review. Tunggu hasil review sebelum upload ulang.');
      return;
    }

    const masterNames = Array.from(new Set(masterRKs.map(r => String(r.rencana_kinerja))));
    const newUnmatched = new Set<string>();

    parseResult.entries.forEach(entry => {
      const rawRK = entry.rencana_kinerja ? String(entry.rencana_kinerja) : '';
      const matchedRK = fuzzyMatchRK(rawRK, masterNames);
      if (matchedRK && matchedRK.trim() !== '' && !masterNames.includes(matchedRK)) {
        newUnmatched.add(matchedRK);
      }
    });

    if (newUnmatched.size > 0) {
      setUnmatchedRKs(Array.from(newUnmatched));
      
      const initialMap: Record<string, { tim_kerja: string, ketua_tim_id: string }> = {};
      Array.from(newUnmatched).forEach(rk => {
        initialMap[rk] = { tim_kerja: '', ketua_tim_id: '' };
      });
      setRkTeamMapping(initialMap);
      
      setShowTeamModal(true);
    } else {
      processUpload();
    }
  };

  const processUpload = async () => {
    if (!user || !file || !parseResult || !parseResult.success) {
      return;
    }

    setUploading(true);
    setUploadStep(0);
    setUploadProgress(10);
    setShowTeamModal(false);

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

      setUploadStep(1);
      setUploadProgress(30);
      const storagePath = `${user.id}/${tahun}/${bulan}/v${newVersion}_${Date.now()}_${file.name}`;
      
      const { error: storageError } = await supabase.storage
        .from('ckp-files')
        .upload(storagePath, file, { upsert: true });

      if (storageError) throw new Error(storageError.message);

      if (oldUploadId) {
        setUploadStep(2);
        setUploadProgress(50);
        await supabase.from('ckp_entries').delete().eq('upload_id', oldUploadId);
      }

      const totalEntries = parseResult.entries.length;
      const avgProgres = totalEntries > 0
        ? parseResult.entries.reduce((s, e) => s + (Number(e.progres) || 0), 0) / totalEntries
        : 0;

      setUploadStep(3);
      setUploadProgress(70);
      
      let uploadData: any;
      if (oldUploadId) {
        const { data, error } = await supabase
          .from('ckp_uploads')
          .update({
            file_name: file.name,
            storage_path: storagePath,
            status: 'submitted',
            total_entries: totalEntries,
            avg_progres: avgProgres,
            catatan_pimpinan: null,
          })
          .eq('id', oldUploadId)
          .select()
          .single();
        if (error) throw error;
        uploadData = data;
      } else {
        const { data, error } = await supabase
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
        if (error) throw error;
        uploadData = data;
      }

      const masterDict = [...masterRKs];
      const masterNames = Array.from(new Set(masterDict.map(r => String(r.rencana_kinerja))));
      const distinctMatchedRKs = new Set<string>();

      setUploadStep(4);
      setUploadProgress(90);

      const entriesToInsert = parseResult.entries.map((entry) => {
        const rawRK = entry.rencana_kinerja ? String(entry.rencana_kinerja) : '';
        const matchedRK = fuzzyMatchRK(rawRK, masterNames);
        
        if (matchedRK && matchedRK.trim() !== '') {
          distinctMatchedRKs.add(matchedRK);
        }

        return {
          upload_id: uploadData.id,
          row_number: entry.row_number || 0,
          tanggal_mulai: entry.tanggal_mulai || null,
          tanggal_selesai: entry.tanggal_selesai || null,
          jam_mulai: entry.jam_mulai || null,
          jam_selesai: entry.jam_selesai || null,
          rencana_kinerja: matchedRK || null,
          kegiatan: entry.kegiatan || null,
          progres: Number(entry.progres) || 0,
          capaian: entry.capaian || null,
          data_dukung: entry.data_dukung || null,
          extra_columns: entry.extra_columns || {},
        }
      });

      const { error: entriesErr } = await supabase.from('ckp_entries').insert(entriesToInsert);
      if (entriesErr) throw entriesErr;

      if (distinctMatchedRKs.size > 0) {
        const validRKsToAssign = Array.from(distinctMatchedRKs).filter(rk => masterNames.includes(rk));
        const unmatched = Array.from(distinctMatchedRKs).filter(rk => !masterNames.includes(rk));
        
        if (unmatched.length > 0) {
          const newRKsToMaster = unmatched.map(rk => {
            const mapping = rkTeamMapping[rk];
            return {
              rencana_kinerja: rk,
              created_by: user.id,
              tim_kerja: mapping?.tim_kerja || null,
              ketua_tim_id: mapping?.ketua_tim_id || null,
            };
          });
          const { data: insertedRKs, error: insErr } = await supabase.from('rk_ketua_tim_mapping').insert(newRKsToMaster).select('id, rencana_kinerja');
          if (!insErr && insertedRKs) {
            masterDict.push(...insertedRKs);
            validRKsToAssign.push(...unmatched);
          }
        }

        if (validRKsToAssign.length > 0) {
          const assignmentsToInsert = [];
          for (const rkStr of validRKsToAssign) {
            const rkObj = masterDict.find((r: any) => r.rencana_kinerja === rkStr);
            if (rkObj) {
              assignmentsToInsert.push({
                rk_id: rkObj.id,
                user_id: user.id,
                assigned_by: user.id
              });
            }
          }
          if (assignmentsToInsert.length > 0) {
            await supabase.from('user_rk_assignments').upsert(assignmentsToInsert, { onConflict: 'user_id, rk_id' });
          }
        }
      }

      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: oldUploadId ? 'replace_ckp' : 'upload_ckp',
        entity_type: 'ckp_uploads',
        entity_id: uploadData.id,
        new_data: { bulan, tahun, version: newVersion, total_entries: entriesToInsert.length },
      });

      setUploadProgress(100);
      toast.success('Upload berhasil! CKP Anda telah disubmit untuk review.');
      
      setTimeout(() => {
        setUploading(false);
        router.push(`/pegawai/ckp/${uploadData.id}`);
      }, 1000);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Terjadi kesalahan saat upload data');
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Upload className="h-6 w-6 text-blue-500" />
            Upload CKP
          </h2>
          <p className="text-slate-500 mt-1">Upload file Excel CKP bulanan Anda</p>
        </div>

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
                ) : (
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                )}
                <div className="text-sm">
                  {existingUpload.status === 'approved' && (
                    <p className="text-red-700">CKP periode ini sudah <strong>disetujui</strong>. Tidak dapat mengupload ulang.</p>
                  )}
                  {existingUpload.status === 'submitted' && (
                    <p className="text-blue-700">CKP periode ini sedang <strong>dalam review</strong> (v{existingUpload.version}).</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
            </CardHeader>
            <CardContent className="space-y-4">
              {parseResult.success && (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="overflow-x-auto max-h-[500px]">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 shadow-sm z-10">
                        <tr>
                          <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Rencana Kinerja</th>
                          <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Kegiatan</th>
                          <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200">Progres (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parseResult.entries.map((entry, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 max-w-[200px] truncate" title={String(entry.rencana_kinerja || '')}>{entry.rencana_kinerja || '-'}</td>
                            <td className="px-4 py-3 max-w-[250px] truncate" title={String(entry.kegiatan || '')}>{entry.kegiatan || '-'}</td>
                            <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">{entry.progres || '0'}%</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {parseResult.success && (
                <div className="flex justify-end pt-2">
                  <Button onClick={handlePreSubmit} loading={uploading} disabled={existingUpload?.status === 'approved'} size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Submit CKP {getBulanName(bulan)} {tahun}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Mapping Tim Kerja</h3>
                <p className="text-sm text-slate-500 mt-1">Beberapa Rencana Kinerja belum memiliki tim kerja.</p>
              </div>
              <button onClick={() => setShowTeamModal(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <div className="space-y-4">
                {unmatchedRKs.map((rk, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="font-semibold text-slate-800 mb-4">{rk}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Pilih Tim Kerja</label>
                        <select 
                          className="w-full text-sm border-slate-200 rounded-lg h-10 px-3"
                          value={rkTeamMapping[rk]?.tim_kerja || ''}
                          onChange={(e) => {
                            const selectedTim = e.target.value;
                            const ketua = ketuaTims.find(k => k.unit_kerja === selectedTim);
                            setRkTeamMapping(prev => ({
                              ...prev,
                              [rk]: { tim_kerja: selectedTim, ketua_tim_id: ketua ? ketua.id : '' }
                            }));
                          }}
                        >
                          <option value="">-- Pilih Tim --</option>
                          {timKerjaList.map((tim, i) => <option key={i} value={tim}>{tim}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Ketua Tim</label>
                        <div className="h-10 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 flex items-center">
                          {rkTeamMapping[rk]?.ketua_tim_id ? ketuaTims.find(k => k.id === rkTeamMapping[rk]?.ketua_tim_id)?.full_name || 'Tidak diketahui' : 'Pilih tim kerja...'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowTeamModal(false)}>Batal</Button>
              <Button onClick={() => {
                const invalid = unmatchedRKs.some(rk => !rkTeamMapping[rk]?.tim_kerja || !rkTeamMapping[rk]?.ketua_tim_id);
                if (invalid) { toast.error('Lengkapi semua mapping'); return; }
                processUpload();
              }}>Lanjutkan Upload</Button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {uploading && !showTeamModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center">
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              {uploadProgress === 100 ? (
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              ) : (
                <>
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" 
                      className="stroke-blue-500 transition-all duration-500 ease-out" 
                      strokeWidth="8" 
                      strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * uploadProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{Math.round(uploadProgress)}%</span>
                </>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {uploadProgress === 100 ? 'Upload Selesai!' : 'Memproses Upload...'}
            </h3>
            
            <div className="w-full text-left mt-6 space-y-3">
              <div className="flex items-center text-sm">
                {uploadStep > 0 ? <CheckCircle2 className="w-4 h-4 mr-3 text-emerald-500" /> : <Loader2 className="w-4 h-4 mr-3 text-blue-500 animate-spin" />}
                <span className={uploadStep >= 0 ? "text-slate-700 dark:text-slate-200" : "text-slate-400"}>Persiapan data...</span>
              </div>
              <div className="flex items-center text-sm">
                {uploadStep > 1 ? <CheckCircle2 className="w-4 h-4 mr-3 text-emerald-500" /> : uploadStep === 1 ? <Loader2 className="w-4 h-4 mr-3 text-blue-500 animate-spin" /> : <div className="w-4 h-4 mr-3 rounded-full border-2 border-slate-200 dark:border-slate-700" />}
                <span className={uploadStep >= 1 ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-600"}>Mengunggah file Excel ke Storage...</span>
              </div>
              {existingUpload && (
                <div className="flex items-center text-sm">
                  {uploadStep > 2 ? <CheckCircle2 className="w-4 h-4 mr-3 text-emerald-500" /> : uploadStep === 2 ? <Loader2 className="w-4 h-4 mr-3 text-blue-500 animate-spin" /> : <div className="w-4 h-4 mr-3 rounded-full border-2 border-slate-200 dark:border-slate-700" />}
                  <span className={uploadStep >= 2 ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-600"}>Membersihkan data lama...</span>
                </div>
              )}
              <div className="flex items-center text-sm">
                {uploadStep > 3 ? <CheckCircle2 className="w-4 h-4 mr-3 text-emerald-500" /> : uploadStep === 3 ? <Loader2 className="w-4 h-4 mr-3 text-blue-500 animate-spin" /> : <div className="w-4 h-4 mr-3 rounded-full border-2 border-slate-200 dark:border-slate-700" />}
                <span className={uploadStep >= 3 ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-600"}>Menyimpan informasi CKP...</span>
              </div>
              <div className="flex items-center text-sm">
                {uploadStep >= 4 ? <CheckCircle2 className="w-4 h-4 mr-3 text-emerald-500" /> : uploadStep === 4 ? <Loader2 className="w-4 h-4 mr-3 text-blue-500 animate-spin" /> : <div className="w-4 h-4 mr-3 rounded-full border-2 border-slate-200 dark:border-slate-700" />}
                <span className={uploadStep >= 4 ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-600"}>Menyimpan detail kegiatan...</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-6 text-center">Mohon jangan menutup halaman ini.</p>
          </div>
        </div>
      )}
    </>
  );
}
