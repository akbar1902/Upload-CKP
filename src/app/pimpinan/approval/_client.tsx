"use client";

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { PeriodFilter } from '@/components/dashboard/period-filter';
import { getDefaultPeriod, getBulanName } from '@/lib/utils';
import type { CKPUpload, User } from '@/types/database';
import { toast } from 'sonner';
import { approveAction } from '@/app/actions/penilaian';
import {
  ArrowLeft, CheckCircle2, Search,
  RefreshCw, WifiOff, MessageSquare
} from 'lucide-react';
import { ApprovalModal } from '@/components/ckp/approval-modal';
import type { ApprovalAction } from '@/types/database';

export default function PimpinanQuickApprovalClient() {
  const supabase = useMemo(() => createClient(), []);
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const defaultPeriod = getDefaultPeriod(10);
  const currentMonth = defaultPeriod.bulan;
  const currentYear = defaultPeriod.tahun;

  const paramBulan = searchParams.get('bulan');
  const paramTahun = searchParams.get('tahun');
  const bulan: string | number = paramBulan && paramBulan.startsWith('T') ? paramBulan : (paramBulan ? parseInt(paramBulan) : currentMonth);
  const tahun = paramTahun ? parseInt(paramTahun) : currentYear;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUpload, setSelectedUpload] = useState<{ id: string, name: string, period: string } | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const setBulan = (b: string | number) => {
    router.push(`?bulan=${b}&tahun=${tahun}`);
  };

  const setTahun = (t: number) => {
    router.push(`?bulan=${bulan}&tahun=${t}`);
  };

  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ['quick-approval', bulan, tahun],
    queryFn: async () => {
      let uploadsQuery = supabase
        .from('ckp_uploads')
        .select('*, user:user_id(id, full_name, nip, unit_kerja)')
        .eq('tahun', tahun)
        .eq('status', 'submitted')
        .order('uploaded_at', { ascending: true });

      if (typeof bulan === 'string' && bulan.startsWith('T')) {
        const triwulanMap: Record<string, number[]> = {
          'T1': [1, 2, 3], 'T2': [4, 5, 6], 'T3': [7, 8, 9], 'T4': [10, 11, 12]
        };
        uploadsQuery = uploadsQuery.in('bulan', triwulanMap[bulan] || []);
      } else {
        uploadsQuery = uploadsQuery.eq('bulan', bulan);
      }

      // 1. Fetch Uploads
      const { data: uploadsRes, error: uploadsErr } = await uploadsQuery;
      if (uploadsErr) throw new Error(uploadsErr.message);

      const uploadsList = uploadsRes || [];
      if (uploadsList.length === 0) return [];

      const uploadIds = uploadsList.map(u => u.id);

      // 2. Fetch entries to check which uploads are fully scored
      // We only need to check if there are any unscored entries per upload.
      // But because entries are grouped by rencana_kinerja, we can just fetch distinct rk with their nilais.
      // Fetching all entries' nilais for these uploads is safer than a huge join if done separately.
      const { data: entriesData, error: entriesErr } = await supabase
        .from('ckp_entries')
        .select('upload_id, rencana_kinerja, nilai')
        .in('upload_id', uploadIds);
        
      if (entriesErr) throw new Error(entriesErr.message);

      const entriesByUpload = new Map<string, any[]>();
      if (entriesData) {
         for (const e of entriesData) {
           if (!entriesByUpload.has(e.upload_id)) entriesByUpload.set(e.upload_id, []);
           entriesByUpload.get(e.upload_id)!.push(e);
         }
      }

      return uploadsList.map((u: any) => {
        const entries = entriesByUpload.get(u.id) || [];
        const rks = new Set(entries.map(e => e.rencana_kinerja || 'Tidak Diketahui'));
        
        let allScored = false;
        if (rks.size > 0) {
           const rkGroups = Array.from(rks).map(rk => {
              const e = entries.find(en => (en.rencana_kinerja || 'Tidak Diketahui') === rk);
              return e ? e.nilai : null;
           });
           allScored = rkGroups.every(score => score !== null);
        }

        return {
          ...u,
          user: u.user as User,
          allScored,
        };
      }) as (CKPUpload & { user: User, allScored: boolean })[];
    },
    enabled: !!authUser && !authLoading,
  });

  const loading = authLoading || isPending || isFetching;
  const uploads = data || [];

  const filteredUploads = useMemo(() => {
    if (!searchQuery.trim()) return uploads;
    const q = searchQuery.toLowerCase();
    return uploads.filter(u => 
      u.user?.full_name.toLowerCase().includes(q) ||
      u.user?.nip?.toLowerCase().includes(q) ||
      u.user?.unit_kerja?.toLowerCase().includes(q)
    );
  }, [uploads, searchQuery]);

  const handleApprove = async (uploadId: string, action: ApprovalAction, catatan: string) => {
    if (!authUser) return;
    setProcessingId(uploadId);
    setShowApprovalModal(false);

    try {
      const result = await approveAction(uploadId, action, catatan || '');
      if (!result.success) throw new Error(result.error);
      
      toast.success('CKP berhasil diproses!');
      
      // Update local cache so it disappears from the list instantly
      queryClient.setQueryData(['quick-approval', bulan, tahun], (old: any) => {
        if (!old) return old;
        return old.filter((u: any) => u.id !== uploadId);
      });
      // Invalidate dashboard to reflect changes
      queryClient.invalidateQueries({ queryKey: ['pimpinan-uploads'] });

    } catch (err: any) {
      toast.error(err.message || 'Gagal menyetujui CKP');
    } finally {
      setProcessingId(null);
      setSelectedUpload(null);
    }
  };

  const getPeriodName = (p: string | number) => {
    if (typeof p === 'string' && p.startsWith('T')) {
      const tMap: Record<string, string> = { 'T1': 'Triwulan I', 'T2': 'Triwulan II', 'T3': 'Triwulan III', 'T4': 'Triwulan IV' };
      return tMap[p] || p;
    }
    return getBulanName(p as number);
  };

  if (error && !loading && uploads.length === 0) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-md mx-auto text-center py-24">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
            <WifiOff className="h-7 w-7" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 className="text-[17px] font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Gagal Memuat Data</h3>
          <p className="text-[14px] mb-6" style={{ color: 'var(--text-secondary)' }}>{error.message}</p>
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
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
        
        <button onClick={() => router.back()} className="flex items-center gap-1 text-[13px] font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              Persetujuan Cepat CKP
            </h2>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              Lakukan review dan persetujuan dengan cepat untuk CKP {getPeriodName(bulan)} {tahun} yang berstatus Menunggu Review.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PeriodFilter bulan={bulan} tahun={tahun} onBulanChange={setBulan} onTahunChange={setTahun} />
            <button onClick={() => refetch()} className="filter-btn" title="Refresh">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="search"
              placeholder="Cari nama atau NIP pegawai..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 h-10 text-[13px] rounded-xl transition-all duration-200"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                  <th className="py-3 px-4 font-semibold text-[12px] uppercase" style={{ color: 'var(--text-tertiary)' }}>Pegawai</th>
                  <th className="py-3 px-4 font-semibold text-[12px] uppercase text-center" style={{ color: 'var(--text-tertiary)' }}>Rata-rata Capaian</th>
                  <th className="py-3 px-4 font-semibold text-[12px] uppercase text-center" style={{ color: 'var(--text-tertiary)' }}>Skor Penilaian</th>
                  <th className="py-3 px-4 font-semibold text-[12px] uppercase text-center" style={{ color: 'var(--text-tertiary)' }}>Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {loading && uploads.length === 0 ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-4"><div className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-48"></div></td>
                      <td className="py-4 px-4"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-24 mx-auto"></div></td>
                      <td className="py-4 px-4"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-16 mx-auto"></div></td>
                      <td className="py-4 px-4"><div className="h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-32 mx-auto"></div></td>
                    </tr>
                  ))
                ) : filteredUploads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-20" style={{ color: 'var(--text-primary)' }} />
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Semua Beres!</p>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Tidak ada CKP yang menunggu persetujuan Anda saat ini.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUploads.map((upload) => (
                    <tr key={upload.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{upload.user.full_name}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{upload.user.unit_kerja || upload.user.nip}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-2">
                           <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                             <div className="h-full bg-emerald-500" style={{ width: `${Math.min(upload.avg_progres || 0, 100)}%` }} />
                           </div>
                           <span className="font-semibold">{Math.round(upload.avg_progres || 0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                         <span className="font-bold text-[15px]" style={{ color: upload.rata_rata_nilai !== null ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                           {upload.rata_rata_nilai !== null ? upload.rata_rata_nilai.toFixed(1) : '-'}
                         </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                            <button
                               onClick={() => {
                                 setSelectedUpload({ id: upload.id, name: upload.user.full_name, period: `${getPeriodName(bulan)} ${tahun}` });
                                 setShowApprovalModal(true);
                               }}
                               disabled={processingId === upload.id || !upload.allScored}
                               className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                 !upload.allScored 
                                 ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800' 
                                 : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md'
                               }`}
                               title={!upload.allScored ? "Tidak bisa disetujui, Ketua Tim belum selesai menilai semua RK" : "Proses Persetujuan"}
                            >
                               {processingId === upload.id ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                               Approve
                            </button>
                            
                            <button
                               onClick={() => window.open(`/penilaian/${upload.id}`, '_blank')}
                               className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                               title="Lihat Detail CKP di tab baru"
                            >
                               <Search className="h-3.5 w-3.5" />
                               Detail
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      
      {showApprovalModal && selectedUpload && (
        <ApprovalModal
          open={showApprovalModal}
          onClose={() => { setShowApprovalModal(false); setSelectedUpload(null); }}
          onSubmit={async (action: ApprovalAction, note: string) => {
            await handleApprove(selectedUpload.id, action, note);
          }}
          employeeName={selectedUpload.name}
          period={selectedUpload.period}
          defaultAction="approved"
        />
      )}
    </>
  );
}
