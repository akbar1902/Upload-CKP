"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { UploadStatusBadge } from '@/components/dashboard/upload-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getBulanName, formatDateTime } from '@/lib/utils';
import type { CKPUpload, User } from '@/types/database';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Calendar,
  Briefcase,
  User as UserIcon,
  Mail,
  WifiOff,
  RefreshCw,
} from 'lucide-react';

export default function PimpinanPegawaiDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { user, loading: authLoading } = useAuth();

  const { data, isPending: queryPending, error: queryError, refetch } = useQuery({
    queryKey: ['pimpinan-pegawai-detail', userId],
    queryFn: async () => {
      if (!userId) throw new Error('Missing userId');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const queryPromise = Promise.all([
          supabase.from('users').select('*').eq('id', userId).single().abortSignal(controller.signal),
          supabase.from('ckp_uploads').select('*').eq('user_id', userId).order('tahun', { ascending: false }).order('bulan', { ascending: false }).abortSignal(controller.signal),
        ]);

        const [userRes, uploadsRes] = await Promise.race([
          queryPromise,
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Supabase request took too long')), 15000))
        ]);

        if (userRes.error) throw userRes.error;

        return {
          employee: userRes.data as User,
          uploads: (uploadsRes.data as CKPUpload[]) || [],
        };
      } finally {
        clearTimeout(timeoutId);
      }
    },
    enabled: !!userId && !!user && !authLoading,
    networkMode: 'always',
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Show previous cached data while background-refetching — prevents skeleton flash
    placeholderData: keepPreviousData,
  });

  // KEY FIX: Only show skeleton when there is genuinely NO data.
  // With keepPreviousData, cached data stays visible during background refetch.
  const loading = authLoading || (!data && queryPending);

  // Failsafe: if genuinely stuck for > 15s after auth resolved, retry query (NOT hard reload)
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!authLoading && queryPending) {
      timeout = setTimeout(() => {
        console.warn('Failsafe triggered: retrying stuck query');
        void refetch();
      }, 15000);
    }
    return () => clearTimeout(timeout);
  }, [authLoading, queryPending, refetch]);

  const employee = data?.employee || null;
  const uploads = data?.uploads || [];

  const error = queryError ? queryError.message : null;

  if (error && !loading && !employee) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-md mx-auto text-center py-24">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
            <WifiOff className="h-6 w-6" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Gagal Memuat Data</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'var(--text-primary)', color: 'var(--bg-base)' }}
          >
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </>
    );
  }

  if (!employee) {
    return (
      <>
        <Header />
        <div className="p-4 lg:p-8 text-center py-20">
          <p style={{ color: 'var(--text-secondary)' }}>Pegawai tidak ditemukan.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>

        {/* Employee Info */}
        <Card className="bg-gradient-to-r from-[var(--primary)] to-teal-950 text-white border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-6 relative">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-2xl font-bold shadow-lg shadow-teal-500/30">
                {employee.full_name.charAt(0)}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{employee.full_name}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-teal-100">
                  <span className="flex items-center gap-1"><UserIcon className="h-3.5 w-3.5" /> NIP: {employee.nip || '-'}</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {employee.unit_kerja || '-'}</span>
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {employee.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CKP History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 opacity-70" />
              Riwayat CKP
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploads.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--border)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Belum ada CKP yang diupload</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                      <th className="text-left py-3 px-4 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Periode</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Versi</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Kegiatan</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Progres</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Diupload</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map((upload) => {
                      const avgPct = upload.avg_progres || 0;
                      return (
                        <tr key={upload.id} className="table-row-hover group" style={{ borderBottom: '1px solid var(--border)' }}>
                          <td className="py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
                            CKP {getBulanName(upload.bulan)} {upload.tahun}
                          </td>
                          <td className="py-3 px-4 text-center" style={{ color: 'var(--text-secondary)' }}>v{upload.version}</td>
                          <td className="py-3 px-4 text-center font-medium" style={{ color: 'var(--text-primary)' }}>{upload.total_entries}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                                <div className="h-full" style={{ width: `${avgPct}%`, background: 'var(--primary)' }} />
                              </div>
                              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{avgPct.toFixed(0)}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center"><UploadStatusBadge status={upload.status} /></td>
                          <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatDateTime(upload.uploaded_at)}</td>
                          <td className="py-3 px-4 text-right">
                            <Link href={`/penilaian/${upload.id}`}>
                              <Button variant="ghost" size="sm" className="opacity-70 group-hover:opacity-100">
                                Review <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
