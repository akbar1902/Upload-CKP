"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { UploadStatusBadge } from '@/components/dashboard/upload-status-badge';
import { DataDukungLink } from '@/components/ckp/data-dukung-link';
import { ApprovalHistory } from '@/components/ckp/approval-history';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getBulanName, formatDateTime, formatDate, formatTime } from '@/lib/utils';
import { exportToExcel } from '@/lib/excel/exporter';
import type { CKPUpload, CKPEntry, Approval, User } from '@/types/database';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Download,
  Upload,
  Calendar,
  Clock,
  FileText,
  BarChart3,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

export default function CKPDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [upload, setUpload] = useState<CKPUpload | null>(null);
  const [entries, setEntries] = useState<CKPEntry[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const [uploadRes, entriesRes, approvalsRes] = await Promise.all([
        supabase.from('ckp_uploads').select('*').eq('id', id).single(),
        supabase.from('ckp_entries').select('*').eq('upload_id', id).order('row_number'),
        supabase.from('approvals').select('*, reviewer:reviewer_id(full_name)').eq('upload_id', id).order('created_at', { ascending: false }),
      ]);

      setUpload(uploadRes.data as CKPUpload);
      setEntries(entriesRes.data as CKPEntry[] || []);
      setApprovals((approvalsRes.data || []).map((a: Record<string, unknown>) => ({
        ...a,
        reviewer: a.reviewer as User | undefined,
      })) as Approval[]);
      setLoading(false);
    };
    fetchData();
  }, [id, supabase]);

  const handleExport = () => {
    if (!upload || !user) return;
    exportToExcel({ upload, entries, user });
    toast.success('File Excel berhasil diunduh');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </>
    );
  }

  if (!upload) {
    return (
      <>
        <Header />
        <div className="p-4 lg:p-8 max-w-5xl mx-auto text-center py-20">
          <p className="text-slate-500">CKP tidak ditemukan.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
        </div>
      </>
    );
  }

  const canReupload = upload.status === 'draft' || upload.status === 'revision_required';

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">
                CKP {getBulanName(upload.bulan)} {upload.tahun}
              </h2>
              <UploadStatusBadge status={upload.status} />
              {upload.version > 1 && <Badge variant="outline">v{upload.version}</Badge>}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Diupload {formatDateTime(upload.uploaded_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export Excel
            </Button>
            {canReupload && (
              <Link href="/pegawai/upload">
                <Button variant="warning" size="sm">
                  <RefreshCw className="h-4 w-4" /> Upload Ulang
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Catatan pimpinan */}
        {upload.catatan_pimpinan && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200" role="alert">
            <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">Catatan Pimpinan</p>
              <p className="text-sm text-blue-700 mt-1">{upload.catatan_pimpinan}</p>
            </div>
          </div>
        )}

        {/* Alert for rejected status */}
        {upload.status === 'rejected' && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200" role="alert">
            <ArrowLeft className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">CKP Ini Ditolak</p>
              <p className="text-sm text-red-600 mt-0.5">CKP Anda telah ditolak. Silakan upload ulang setelah diperbaiki.</p>
            </div>
            <Link href="/pegawai/upload">
              <Button variant="destructive" size="sm">Upload Ulang</Button>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{upload.total_entries}</p>
                <p className="text-xs text-slate-500">Total Kegiatan</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <BarChart3 className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{(upload.avg_progres || 0).toFixed(0)}%</p>
                <p className="text-xs text-slate-500">Rata-rata Progres</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Calendar className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{upload.version}</p>
                <p className="text-xs text-slate-500">Versi</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Clock className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 truncate">{upload.file_name || '-'}</p>
                <p className="text-xs text-slate-500">File</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-400" />
              Detail Kegiatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm" style={{ tableLayout: 'auto' }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap w-10">No</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">Tanggal</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:table-cell">Jam</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Rencana Kinerja</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500">Kegiatan</th>
                    <th scope="col" className="text-center py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap w-24">Progres</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500 hidden lg:table-cell">Capaian</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">Bukti Dukung</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 text-slate-400 text-center text-xs">{entry.row_number}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-xs text-slate-700">{formatDate(entry.tanggal_mulai)}</div>
                        {entry.tanggal_selesai && entry.tanggal_selesai !== entry.tanggal_mulai && (
                          <div className="text-xs text-slate-400 mt-0.5">s.d. {formatDate(entry.tanggal_selesai)}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-xs text-slate-500 hidden sm:table-cell">
                        {formatTime(entry.jam_mulai)} – {formatTime(entry.jam_selesai)}
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-600 leading-relaxed hidden md:table-cell">
                        {entry.rencana_kinerja || '—'}
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-800 leading-relaxed">
                        {entry.kegiatan || '—'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full progress-bar"
                              style={{ width: `${Math.min(entry.progres, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 tabular-nums">{entry.progres}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-600 leading-relaxed hidden lg:table-cell">
                        {entry.capaian || '—'}
                      </td>
                      <td className="py-3 px-3">
                        <DataDukungLink value={entry.data_dukung} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>


        {/* Approval History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-slate-400" />
              Riwayat Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalHistory approvals={approvals} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
