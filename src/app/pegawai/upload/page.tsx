"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Check, CheckCircle2, ChevronDown, ChevronUp, FileSpreadsheet, Loader2, UploadCloud, X, LayoutDashboard, Upload, AlertTriangle, ArrowLeft, Send, Info, Link as LinkIcon } from 'lucide-react';
import { saveKegiatanAnggotaMapping, getMasterKegiatanAnggota, getUploadMasterData, checkPeriodStatusAction, submitCkpUploadAction } from '@/app/actions/ckp';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import masterMappingDataRaw from '@/data/master_mapping.json';

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  let defaultMonth = currentDate.getMonth() + 1; // 1-12 (Bulan saat ini)
  let defaultYear = currentDate.getFullYear();

  const [bulan, setBulan] = useState(defaultMonth);
  const [tahun, setTahun] = useState(defaultYear);
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(-1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingUpload, setExistingUpload] = useState<{id: string; version: number; status: string} | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // States for Team Assignment Prompt
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [unmatchedRKs, setUnmatchedRKs] = useState<string[]>([]);
  const [rkTeamMapping, setRkTeamMapping] = useState<Record<string, { tim_kerja: string, rk_id: string }>>({});
  const [teamToKetuaMap, setTeamToKetuaMap] = React.useState<Map<string, string>>(new Map());
  const [timKerjaList, setTimKerjaList] = useState<string[]>([]);
  const [parsing, setParsing] = useState(false);
  const uploadAbortRef = useRef<AbortController | null>(null);

  const { data: masterData } = useQuery({
    queryKey: ['upload-master-data'],
    queryFn: async () => {
      // Server action with 6s timeout, returns fallback on error
      return Promise.race([
        getUploadMasterData(),
        new Promise<{ masterRKs: any[]; ketuaTims: any[]; masterKegiatan: any[] }>((resolve) =>
          setTimeout(() => resolve({ masterRKs: [], ketuaTims: [], masterKegiatan: [] }), 6000)
        ),
      ]);
    },
    staleTime: 1000 * 60 * 60, // 1 hour — master data rarely changes
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const masterRKs = useMemo(() => masterData?.masterRKs || [], [masterData]);
  const ketuaTims = useMemo(() => masterData?.ketuaTims || [], [masterData]);
  const masterKegiatan = useMemo(() => masterData?.masterKegiatan || [], [masterData]);
  const uniqueTeams = useMemo<{tim_kerja: string, ketua_tim_id: string}[]>(() => {
    const seen = new Set<string>();
    const teams: {tim_kerja: string, ketua_tim_id: string}[] = [];
    for (const rk of masterRKs) {
      if (rk.tim_kerja && !seen.has(rk.tim_kerja)) {
        seen.add(rk.tim_kerja);
        teams.push({ tim_kerja: rk.tim_kerja, ketua_tim_id: rk.ketua_tim_id || '' });
      }
    }
    return teams;
  }, [masterRKs]);

  React.useEffect(() => {
    const activeTeams = Array.from(new Set(ketuaTims.map((k: any) => k.unit_kerja).filter(Boolean))) as string[];
    const teamsMap = new Map<string, string>();
    masterRKs.forEach((rk: any) => { if (rk.tim_kerja) teamsMap.set(rk.tim_kerja, rk.ketua_tim_id || ''); });
    const allTeams = Array.from(new Set([...activeTeams, ...Array.from(teamsMap.keys())]));
    setTimKerjaList(allTeams);
    setTeamToKetuaMap(teamsMap);
  }, [ketuaTims, masterRKs]);

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
    try {
      const result = await checkPeriodStatusAction(user.id, b, t);
      setIsLocked(result.isLocked);
      setExistingUpload(result.existingUpload);
    } catch (err) {
      console.warn('[Upload] checkPeriodStatus error:', err);
    }
  }, [user]);

  React.useEffect(() => {
    checkExistingUpload(bulan, tahun);
  }, [bulan, tahun, checkExistingUpload]);

  // ══════════════════════════════════════════════════════════════════
  // SAFETY AUTO-RESET: Jika uploading stuck > 30 detik, auto-reset
  // Dengan fresh client + tanpa session validation, upload seharusnya
  // selesai dalam <10 detik. 30s adalah batas aman yang sangat longgar.
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!uploading) return;
    const safetyTimer = setTimeout(() => {
      console.error('[Upload] Safety timeout reached — forcing upload reset');
      if (uploadAbortRef.current) {
        uploadAbortRef.current.abort();
        uploadAbortRef.current = null;
      }
      setUploading(false);
      setUploadStep(-1);
      setUploadProgress(0);
      toast.error('Upload timeout: proses terlalu lama. Silakan refresh halaman dan coba lagi.', { duration: 8000 });
    }, 30_000); // 30 seconds — aggressive timeout
    return () => clearTimeout(safetyTimer);
  }, [uploading]);

  const normalize = (str: string) => (str || '').toLowerCase().replace(/tahun\s*20\d{2}/g, '').replace(/[^a-z0-9]/g, '');
  
  const localSubRkMap = useMemo(() => {
    const map = new Map<string, string>();
    (masterMappingDataRaw as Array<{rk_ketua: string, sub_rk: string[]}>).forEach(item => {
      item.sub_rk.forEach(sub => {
        map.set(normalize(sub), item.rk_ketua);
      });
    });
    return map;
  }, []);

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
    
    if (bestScore > 0.95) {
       return bestMatch;
    }

    return String(input).trim().replace(/\s+/g, ' ');
  };

  const fuzzyMatchKegiatan = (input: string, masterKegs: any[]) => {
    if (!input) return null;
    const normInput = normalize(input);
    if (!normInput) return null;
    
    let bestMatch = null;
    let bestScore = 0;
    
    for (const master of masterKegs) {
      const normMaster = normalize(master.kegiatan_nama);
      if (normMaster === normInput) return master;
      
      const score = getSimilarity(normInput, normMaster);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = master;
      }
    }
    
    if (bestScore > 0.90) { 
       return bestMatch;
    }

    return null;
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

  // ══════════════════════════════════════════════════════════════════
  // CANCEL UPLOAD: Abort ongoing upload operations
  // ══════════════════════════════════════════════════════════════════
  const handleCancelUpload = useCallback(() => {
    console.log('[Upload] User cancelled upload');
    if (uploadAbortRef.current) {
      uploadAbortRef.current.abort();
      uploadAbortRef.current = null;
    }
    setUploading(false);
    setUploadStep(-1);
    setUploadProgress(0);
    toast.info('Upload dibatalkan.');
  }, []);

  const handlePreSubmit = async () => {
    try {
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

      // Guard: data master kosong (mungkin gagal load) → skip validation, langsung upload
      if (masterRKs.length === 0) {
        processUpload([], []);
        return;
      }

      // NOW set uploading — all guards have passed
      setUploading(true);
      setUploadStep(0);
      setUploadProgress(5);
      // Beri React satu tick untuk render progress modal SEBELUM logika berat
      await new Promise<void>(r => setTimeout(r, 0));

      let currentMasterRKs = masterRKs;
      let currentMasterKegiatan = masterKegiatan;

      const getUnmatched = (rks: any[], kegiatan: any[]) => {
        const names = Array.from(new Set(rks.map((r: any) => String(r.rencana_kinerja))));
        const unmatched = new Set<string>();

        parseResult.entries.forEach(entry => {
          let rawRK = entry.rencana_kinerja ? String(entry.rencana_kinerja) : '';
          if (!rawRK.trim()) {
             rawRK = entry.kegiatan ? String(entry.kegiatan) : '';
          }
          if (!rawRK.trim()) return;
          
          let trueRK = '';
          const normRawRK = normalize(rawRK);
          
          if (localSubRkMap.has(normRawRK)) {
             trueRK = localSubRkMap.get(normRawRK)!;
             if (!entry.kegiatan || String(entry.kegiatan).trim() === '') {
                entry.kegiatan = rawRK;
             }
             entry.rencana_kinerja = trueRK;
          } else {
             const kegiatanMatch = fuzzyMatchKegiatan(rawRK, kegiatan);
             
             if (kegiatanMatch) {
                trueRK = kegiatanMatch.rk_ketua_tim_mapping?.rencana_kinerja || rawRK;
                
                if (!entry.kegiatan || String(entry.kegiatan).trim() === '') {
                   entry.kegiatan = rawRK;
                }
                entry.rencana_kinerja = trueRK;
             } else {
                trueRK = fuzzyMatchRK(rawRK, names);
                entry.rencana_kinerja = trueRK; 
             }
          }
          
          if (!names.some(m => m.toLowerCase() === trueRK.toLowerCase())) {
            unmatched.add(trueRK);
          }
        });
        
        return { unmatched, names };
      };

      const { unmatched: newUnmatched } = getUnmatched(currentMasterRKs, currentMasterKegiatan);

      if (newUnmatched.size > 0) {
        setUploading(false); // Reset loading state karena memunculkan modal
        setUploadStep(-1);
        setUnmatchedRKs(Array.from(newUnmatched));
        
        const initialMap: Record<string, { tim_kerja: string, rk_id: string }> = {};
        Array.from(newUnmatched).forEach(rk => {
          initialMap[rk] = { tim_kerja: '', rk_id: '' };
        });
        setRkTeamMapping(initialMap);
        
        setShowTeamModal(true);
      } else {
        processUpload(currentMasterRKs, currentMasterKegiatan);
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat memproses data sistem.');
      setUploading(false);
      setUploadStep(-1);
    }
  };

  // ══════════════════════════════════════════════════════════════════
  // HELPER: Wrap a promise with a timeout
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withTimeout = <T = any,>(promise: PromiseLike<T> | Promise<T>, ms: number, label: string): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout: ${label} melebihi ${Math.round(ms / 1000)} detik`));
      }, ms);
      (promise as Promise<T>).then(
        (result: T) => { clearTimeout(timer); resolve(result); },
        (err: unknown) => { clearTimeout(timer); reject(err); }
      );
    });
  };

  const processUpload = async (latestMasterRKs?: any[], latestMasterKegiatan?: any[]) => {
    if (!user || !file || !parseResult || !parseResult.success) {
      return;
    }

    setUploading(true);
    setUploadStep(0);
    setUploadProgress(15);
    setShowTeamModal(false);

    const abortController = new AbortController();
    uploadAbortRef.current = abortController;

    const checkAborted = () => {
      if (abortController.signal.aborted) {
        throw new Error('Upload dibatalkan oleh pengguna.');
      }
    };

    try {
      const masterDict = latestMasterRKs || [...masterRKs];
      const mKegiatan = latestMasterKegiatan || masterKegiatan;
      const masterNames: string[] = Array.from(new Set(masterDict.map((r: any) => String(r.rencana_kinerja))));
      const distinctMatchedRKs = new Set<string>();

      setUploadStep(1);
      setUploadProgress(30);

      const v2EntriesResolved = parseResult.entries.map((entry) => {
        let rawRK = entry.rencana_kinerja ? String(entry.rencana_kinerja) : '';
        if (!rawRK.trim()) {
           rawRK = entry.kegiatan ? String(entry.kegiatan) : '';
        }
        let matchedRK = '';
        
        const normRawRK = normalize(rawRK);
        if (localSubRkMap.has(normRawRK)) {
            matchedRK = localSubRkMap.get(normRawRK)!;
            if (!entry.kegiatan || String(entry.kegiatan).trim() === '') {
               entry.kegiatan = rawRK;
            }
        } else {
            const kegiatanMatch = fuzzyMatchKegiatan(rawRK, mKegiatan);
            if (kegiatanMatch) {
                matchedRK = kegiatanMatch.rk_ketua_tim_mapping?.rencana_kinerja || rawRK;
                if (!entry.kegiatan || String(entry.kegiatan).trim() === '') {
                   entry.kegiatan = rawRK;
                }
            } else {
                matchedRK = fuzzyMatchRK(rawRK, masterNames);
                if (!masterNames.some(m => m.toLowerCase() === matchedRK.toLowerCase()) && rkTeamMapping[matchedRK]?.rk_id) {
                   const mappedRKObj = masterDict.find((r: any) => String(r.id) === String(rkTeamMapping[matchedRK].rk_id));
                   if (mappedRKObj) {
                      if (!entry.kegiatan || String(entry.kegiatan).trim() === '') {
                         entry.kegiatan = rawRK;
                      }
                      matchedRK = mappedRKObj.rencana_kinerja;
                   }
                }
            }
        }
        
        if (matchedRK && matchedRK.trim() !== '') {
          distinctMatchedRKs.add(matchedRK);
        }
        
        return { entry, matchedRK };
      });

      const validRKsToAssign = Array.from(distinctMatchedRKs).filter(rk =>
        masterNames.some(m => m.toLowerCase() === rk.toLowerCase())
      );
      if (Object.keys(rkTeamMapping).length > 0) {
        Object.keys(rkTeamMapping).forEach(rk => {
          const mappedObj = masterDict.find((r: any) => String(r.id) === String(rkTeamMapping[rk]?.rk_id));
          if (mappedObj && masterNames.some(m => m.toLowerCase() === mappedObj.rencana_kinerja.toLowerCase())) {
            validRKsToAssign.push(mappedObj.rencana_kinerja);
          }
        });
      }

      checkAborted();

      setUploadStep(2);
      setUploadProgress(50);

      // Package everything into FormData to upload via Server Action
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);
      formData.append('bulan', String(bulan));
      formData.append('tahun', String(tahun));
      formData.append('entries', JSON.stringify(v2EntriesResolved));
      formData.append('rkTeamMapping', JSON.stringify(rkTeamMapping));
      formData.append('validRKsToAssign', JSON.stringify(validRKsToAssign));

      setUploadStep(3);
      setUploadProgress(75);

      const result = await submitCkpUploadAction(formData);
      checkAborted();

      if (!result.success) {
        throw new Error(result.error || 'Gagal memproses upload.');
      }

      // ── SUCCESS ─────────────────────────────────────────────────
      uploadAbortRef.current = null;
      setUploadStep(4);
      setUploadProgress(100);
      toast.success('Upload berhasil! CKP Anda telah disubmit untuk review.');
      
      queryClient.invalidateQueries({ queryKey: ['pegawai-uploads', user.id] });
      queryClient.invalidateQueries({ queryKey: ['upload-master-data'] });
      
      setTimeout(() => {
        setUploading(false);
        router.push(`/pegawai/ckp/${result.uploadId}`);
      }, 300);

    } catch (error: any) {
      uploadAbortRef.current = null;
      if (error.message?.includes('dibatalkan')) {
        console.log('[Upload] Upload cancelled by user');
      } else {
        console.error('[Upload] Upload error:', error);
        toast.error(error.message || 'Terjadi kesalahan saat upload data', { duration: 8000 });
      }
      setUploading(false);
      setUploadStep(-1);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        <Link href="/pegawai" prefetch={true}
          className="inline-flex items-center gap-1 text-[13px] font-medium transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)'; }}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>

        <div>
          <h2 className="text-[24px] font-semibold tracking-tight flex items-center gap-2"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            <Upload className="h-6 w-6" style={{ color: 'var(--primary)' }} />
            Upload CKP
          </h2>
          <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>Upload file Excel CKP bulanan Anda</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Pilih Periode</CardTitle>
            <CardDescription>Pilih bulan dan tahun CKP yang akan diupload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-48">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Bulan</label>
                <Select
                  options={bulanOptions}
                  value={String(bulan)}
                  onChange={(e) => setBulan(Number(e.target.value))}
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tahun</label>
                <Select
                  options={tahunOptions}
                  value={String(tahun)}
                  onChange={(e) => setTahun(Number(e.target.value))}
                />
              </div>
            </div>

            {isLocked && (
              <div className="mt-4 flex items-start gap-2 p-3 rounded-lg border bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <div className="text-sm">
                  <p className="text-red-700">Periode CKP untuk bulan dan tahun ini <strong>sudah dikunci</strong> oleh Admin. Anda tidak dapat mengupload data.</p>
                </div>
              </div>
            )}
            {!isLocked && existingUpload && (
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
              disabled={isLocked || existingUpload?.status === 'approved'}
            />
          </CardContent>
        </Card>

        {parsing && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full mx-auto mb-3"
                   style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
              <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Membaca file Excel...</p>
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
              {!parseResult.success && parseResult.errors.length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[14px] font-semibold text-red-800 dark:text-red-300">Gagal Membaca File Excel</h4>
                      <ul className="mt-1 space-y-1">
                        {parseResult.errors.map((err, i) => (
                          <li key={i} className="text-[13px] text-red-700 dark:text-red-400 leading-relaxed">{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {parseResult.success && parseResult.entries.length > 0 && (
                  <div className="overflow-x-auto rounded-xl shadow-sm mt-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                          <th className="text-center py-3 px-4 text-[13px] font-semibold whitespace-nowrap w-16" style={{ color: 'var(--text-secondary)' }}>No</th>
                          <th className="text-left py-3 px-4 text-[13px] font-semibold whitespace-nowrap w-[25%]" style={{ color: 'var(--text-secondary)' }}>Rencana Kinerja</th>
                          <th className="text-left py-3 px-4 text-[13px] font-semibold whitespace-nowrap w-[30%]" style={{ color: 'var(--text-secondary)' }}>Kegiatan</th>
                          <th className="text-left py-3 px-4 text-[13px] font-semibold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>Tanggal</th>
                          <th className="text-center py-3 px-4 text-[13px] font-semibold whitespace-nowrap w-24" style={{ color: 'var(--text-secondary)' }}>Progres</th>
                          <th className="text-left py-3 px-4 text-[13px] font-semibold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>Bukti Dukung</th>
                        </tr>
                      </thead>
                      <tbody style={{ borderTop: '1px solid var(--border)' }} className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {parseResult.entries.slice(0, 10).map((entry, i) => (
                          <tr key={i} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50" style={{ background: 'var(--card-bg)' }}>
                            <td className="py-3 px-4 text-center font-medium" style={{ color: 'var(--text-tertiary)' }}>{entry.row_number}</td>
                            <td className="py-3 px-4">
                              <p className="text-[13px] leading-relaxed line-clamp-3" style={{ color: 'var(--text-primary)' }}>
                                {String(entry.rencana_kinerja || '—')}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-[13px] leading-relaxed line-clamp-3" style={{ color: 'var(--text-primary)' }}>
                                {String(entry.kegiatan || '—')}
                              </p>
                            </td>
                            <td className="py-3 px-4 text-[13px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                              <div className="flex flex-col gap-1">
                                <span>Mulai: {String(entry.tanggal_mulai || '-')}</span>
                                <span>Selesai: {String(entry.tanggal_selesai || '-')}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[12px] font-semibold"
                                    style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                                {Number(entry.progres || 0).toFixed(0)}%
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {entry.data_dukung && String(entry.data_dukung).startsWith('http') ? (
                                <a href={String(entry.data_dukung)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-blue-600 dark:text-blue-400 hover:underline">
                                  <LinkIcon size={14} />
                                  <span>Lihat Bukti</span>
                                </a>
                              ) : (
                                <p className="text-[13px] line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                                  {String(entry.data_dukung || '—')}
                                </p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parseResult.entries.length > 10 && (
                      <div className="py-3 px-4 text-center text-[13px]"
                           style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', color: 'var(--text-tertiary)' }}>
                        Menampilkan 10 dari <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{parseResult.entries.length}</span> baris (keseluruhan data tetap akan diupload)
                      </div>
                    )}
                  </div>
              )}
              {parseResult.success && (
                <div className="flex justify-end pt-2">
                  <Button onClick={handlePreSubmit} loading={uploading} disabled={isLocked || existingUpload?.status === 'approved'} size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    {uploading ? 'Memproses Data...' : `Submit CKP ${getBulanName(bulan)} ${tahun}`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" style={{ background: 'var(--card-bg)' }}>
            <div className="p-6 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Mapping Tim Kerja</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Beberapa Rencana Kinerja belum memiliki tim kerja.</p>
              </div>
              <button onClick={() => setShowTeamModal(false)} className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1" style={{ background: 'var(--bg-base)' }}>
              <div className="space-y-4">
                {unmatchedRKs.map((rk, idx) => {
                  const selectedTim = rkTeamMapping[rk]?.tim_kerja || '';
                  const availableRKs = masterRKs.filter((r: any) => r.tim_kerja === selectedTim);
                  
                  return (
                    <div key={idx} className="p-5 rounded-xl shadow-sm" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                      <p className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Teks yang tidak dikenali: "{rk}"</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>1. Pilih Tim Kerja</label>
                          <select 
                            className="w-full text-sm rounded-lg h-10 px-3 outline-none"
                            style={{ border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                            value={selectedTim}
                            onChange={(e) => {
                              setRkTeamMapping(prev => ({
                                ...prev,
                                [rk]: { tim_kerja: e.target.value, rk_id: '' }
                              }));
                            }}
                          >
                            <option value="">-- Pilih Tim --</option>
                            {timKerjaList.map((tim, i) => <option key={i} value={tim}>{tim}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>2. Pilih Rencana Kinerja Master</label>
                          <select
                            className="w-full text-sm rounded-lg h-10 px-3 outline-none"
                            style={{ border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                            value={rkTeamMapping[rk]?.rk_id || ''}
                            disabled={!selectedTim}
                            onChange={(e) => {
                              setRkTeamMapping(prev => ({
                                ...prev,
                                [rk]: { ...prev[rk], rk_id: e.target.value }
                              }));
                            }}
                          >
                            <option value="">-- Pilih RK Master --</option>
                            {availableRKs.map((r: any) => (
                              <option key={r.id} value={r.id}>{r.rencana_kinerja}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-6 flex justify-end gap-3" style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)' }}>
              <Button variant="outline" onClick={() => setShowTeamModal(false)}>Batal</Button>
              <Button onClick={() => {
                const invalid = unmatchedRKs.some(rk => !rkTeamMapping[rk]?.tim_kerja || !rkTeamMapping[rk]?.rk_id);
                if (invalid) { toast.error('Lengkapi semua mapping RK Master'); return; }
                processUpload();
              }}>Lanjutkan Upload</Button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {uploading && !showTeamModal && uploadStep >= 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center" style={{ background: 'var(--card-bg)' }}>
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              {uploadProgress === 100 ? (
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              ) : (
                <>
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" style={{ stroke: 'var(--bg-secondary)' }} strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" 
                      className="transition-all duration-500 ease-out" 
                      style={{ stroke: 'var(--primary)' }}
                      strokeWidth="8" 
                      strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * uploadProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{Math.round(uploadProgress)}%</span>
                </>
              )}
            </div>
            
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {uploadProgress === 100 ? 'Upload Selesai!' : 'Memproses Upload...'}
            </h3>
            
            <div className="w-full text-left mt-6 space-y-3">
              <div className="flex items-center text-sm">
                {uploadStep > 0 ? <CheckCircle2 className="w-4 h-4 mr-3" style={{ color: 'var(--success)' }} /> : <Loader2 className="w-4 h-4 mr-3 animate-spin" style={{ color: 'var(--primary)' }} />}
                <span style={{ color: uploadStep >= 0 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>Persiapan data...</span>
              </div>
              <div className="flex items-center text-sm">
                {uploadStep > 1 ? <CheckCircle2 className="w-4 h-4 mr-3" style={{ color: 'var(--success)' }} /> : uploadStep === 1 ? <Loader2 className="w-4 h-4 mr-3 animate-spin" style={{ color: 'var(--primary)' }} /> : <div className="w-4 h-4 mr-3 rounded-full border-2" style={{ borderColor: 'var(--border)' }} />}
                <span style={{ color: uploadStep >= 1 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>Mengunggah file Excel ke Storage...</span>
              </div>
              {existingUpload && (
                <div className="flex items-center text-sm">
                  {uploadStep > 2 ? <CheckCircle2 className="w-4 h-4 mr-3" style={{ color: 'var(--success)' }} /> : uploadStep === 2 ? <Loader2 className="w-4 h-4 mr-3 animate-spin" style={{ color: 'var(--primary)' }} /> : <div className="w-4 h-4 mr-3 rounded-full border-2" style={{ borderColor: 'var(--border)' }} />}
                  <span style={{ color: uploadStep >= 2 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>Membersihkan data lama...</span>
                </div>
              )}
              <div className="flex items-center text-sm">
                {uploadStep > 3 ? <CheckCircle2 className="w-4 h-4 mr-3" style={{ color: 'var(--success)' }} /> : uploadStep === 3 ? <Loader2 className="w-4 h-4 mr-3 animate-spin" style={{ color: 'var(--primary)' }} /> : <div className="w-4 h-4 mr-3 rounded-full border-2" style={{ borderColor: 'var(--border)' }} />}
                <span style={{ color: uploadStep >= 3 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>Menyimpan informasi CKP...</span>
              </div>
              <div className="flex items-center text-sm">
                {uploadStep >= 4 ? <CheckCircle2 className="w-4 h-4 mr-3" style={{ color: 'var(--success)' }} /> : uploadStep === 4 ? <Loader2 className="w-4 h-4 mr-3 animate-spin" style={{ color: 'var(--primary)' }} /> : <div className="w-4 h-4 mr-3 rounded-full border-2" style={{ borderColor: 'var(--border)' }} />}
                <span style={{ color: uploadStep >= 4 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>Menyimpan detail kegiatan...</span>
              </div>
            </div>
            
            {uploadProgress < 100 && (
              <button
                onClick={handleCancelUpload}
                className="mt-6 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-tertiary)', background: 'transparent' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)'; (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)'; }}
              >
                Batalkan Upload
              </button>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">Mohon jangan menutup halaman ini.</p>
          </div>
        </div>
      )}
    </>
  );
}
