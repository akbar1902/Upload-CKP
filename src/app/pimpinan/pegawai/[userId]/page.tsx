"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
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

  const { data, isLoading: loading, error: queryError, refetch } = useQuery({
    queryKey: ['pimpinan-pegawai-detail', userId],
    queryFn: async () => {
      if (!userId) throw new Error('Missing userId');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const queryPromise = Promise.all([
          supabase.from('users').select('*').eq('id', userId).single().abortSignal(controller.signal),
          supabase.from('ckp_uploads').select('*').eq('user_id', userId).order('tahun', { ascending: false }).order('bulan', { ascending: false }).abortSignal(controller.signal),
        ]);

        const [userRes, uploadsRes] = await Promise.race([
          queryPromise,
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Supabase request timeout')), 9000))
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
    enabled: !!userId,
    networkMode: 'always',
  });

  const employee = data?.employee || null;
  const uploads = data?.uploads || [];

  const error = queryError ? queryError.message : null;

  if (error && !loading) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-md mx-auto text-center py-24">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
            <WifiOff className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">Gagal Memuat Data</h3>
          <p className="text-sm text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
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
          <p className="text-slate-500">Pegawai tidak ditemukan.</p>
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
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>

        {/* Employee Info */}
        <Card className="bg-gradient-to-r from-slate-900 to-blue-950 text-white border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-6 relative">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/30">
                {employee.full_name.charAt(0)}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{employee.full_name}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-blue-200">
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
              <Calendar className="h-5 w-5 text-slate-400" />
              Riwayat CKP
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploads.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-slate-200 mb-3" />
                <p className="text-slate-500">Belum ada CKP yang diupload</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Periode</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Versi</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Kegiatan</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Progres</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Diupload</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map((upload) => (
                      <tr key={upload.id} className="border-b border-slate-100 table-row-hover group">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {getBulanName(upload.bulan)} {upload.tahun}
                        </td>
                        <td className="py-3 px-4 text-center text-slate-500">v{upload.version}</td>
                        <td className="py-3 px-4 text-center font-medium text-slate-700">{upload.total_entries}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full progress-bar" style={{ width: `${upload.avg_progres || 0}%` }} />
                            </div>
                            <span className="text-xs font-medium text-slate-600">{(upload.avg_progres || 0).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center"><UploadStatusBadge status={upload.status} /></td>
                        <td className="py-3 px-4 text-xs text-slate-400">{formatDateTime(upload.uploaded_at)}</td>
                        <td className="py-3 px-4 text-right">
                          <Link href={`/pimpinan/ckp/${upload.id}`}>
                            <Button variant="ghost" size="sm" className="opacity-70 group-hover:opacity-100">
                              Review <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
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
