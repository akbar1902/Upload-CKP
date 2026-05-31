"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { UploadStatusBadge } from '@/components/dashboard/upload-status-badge';
import { DataDukungLink } from '@/components/ckp/data-dukung-link';
import { ApprovalHistory } from '@/components/ckp/approval-history';
import { ApprovalModal } from '@/components/ckp/approval-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getBulanName, formatDateTime, formatDate, formatTime } from '@/lib/utils';
import { exportToExcel } from '@/lib/excel/exporter';
import type { CKPUpload, CKPEntry, Approval, User, ApprovalAction } from '@/types/database';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Download,
  FileText,
  BarChart3,
  Calendar,
  Clock,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MessageSquare,
  Unlock,
  Briefcase,
} from 'lucide-react';

export default function PimpinanCKPDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [upload, setUpload] = useState<CKPUpload | null>(null);
  const [employee, setEmployee] = useState<User | null>(null);
  const [entries, setEntries] = useState<CKPEntry[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [defaultModalAction, setDefaultModalAction] = useState<ApprovalAction>('approved');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const { data: uploadData } = await supabase
        .from('ckp_uploads')
        .select('*')
        .eq('id', id)
        .single();

      if (uploadData) {
        setUpload(uploadData as CKPUpload);

        const [employeeRes, entriesRes, approvalsRes] = await Promise.all([
          supabase.from('users').select('*').eq('id', uploadData.user_id).single(),
          supabase.from('ckp_entries').select('*').eq('upload_id', id).order('row_number'),
          supabase.from('approvals')
            .select('*, reviewer:reviewer_id(id, full_name)')
            .eq('upload_id', id)
            .order('created_at', { ascending: false }),
        ]);

        setEmployee(employeeRes.data as User);
        setEntries(entriesRes.data as CKPEntry[] || []);
        setApprovals((approvalsRes.data || []).map((a: Record<string, unknown>) => ({
          ...a,
          reviewer: a.reviewer as User | undefined,
        })) as Approval[]);
      }
      setLoading(false);
    };
    fetchData();
  }, [id, supabase]);

  const handleApproval = async (action: ApprovalAction, catatan: string) => {
    if (!upload || !currentUser) return;

    // Update upload status
    const newStatus = action === 'reopened' ? 'draft' : action;
    const updateData: Record<string, unknown> = {
      status: newStatus,
      catatan_pimpinan: catatan || null,
    };

    if (action === 'approved') {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = currentUser.id;
    }

    const { error: updateError } = await supabase
      .from('ckp_uploads')
      .update(updateData)
      .eq('id', upload.id);

    if (updateError) {
      toast.error('Gagal memproses. Silakan coba lagi.');
      throw updateError;
    }

    // Insert approval record
    await supabase.from('approvals').insert({
      upload_id: upload.id,
      reviewer_id: currentUser.id,
      action,
      catatan,
    });

    // Audit log
    await supabase.from('audit_logs').insert({
      user_id: currentUser.id,
      action: `${action}_ckp`,
      entity_type: 'ckp_uploads',
      entity_id: upload.id,
      new_data: { status: newStatus, catatan },
    });

    // Refresh data
    setUpload({ ...upload, status: newStatus as CKPUpload['status'], catatan_pimpinan: catatan });

    const { data: newApprovals } = await supabase
      .from('approvals')
      .select('*, reviewer:reviewer_id(id, full_name)')
      .eq('upload_id', upload.id)
      .order('created_at', { ascending: false });

    setApprovals((newApprovals || []).map((a: Record<string, unknown>) => ({
      ...a,
      reviewer: a.reviewer as User | undefined,
    })) as Approval[]);

    const actionLabel = action === 'approved' ? 'disetujui' : action === 'rejected' ? 'ditolak' : action === 'revision_required' ? 'diminta revisi' : 'dibuka kembali';
    toast.success(`CKP berhasil ${actionLabel}`);
  };

  const handleExport = () => {
    if (!upload || !employee) return;
    exportToExcel({ upload, entries, user: employee });
    toast.success('File Excel berhasil diunduh');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </>
    );
  }

  if (!upload || !employee) {
    return (
      <>
        <Header />
        <div className="p-4 lg:p-8 max-w-6xl mx-auto text-center py-20">
          <p className="text-slate-500">CKP tidak ditemukan.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
        </div>
      </>
    );
  }

  const canReview = upload.status === 'submitted';
  const canReopen = upload.status === 'approved';

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Review CKP
              </h2>
              <UploadStatusBadge status={upload.status} />
              {upload.version > 1 && <Badge variant="outline">v{upload.version}</Badge>}
            </div>
            <p className="text-slate-500">
              {getBulanName(upload.bulan)} {upload.tahun} — Diupload {formatDateTime(upload.uploaded_at)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export Excel
            </Button>
            {canReview && (
              <Button
                onClick={() => {
                  setDefaultModalAction('approved');
                  setShowApprovalModal(true);
                }}
                className="shadow-lg shadow-blue-500/20"
              >
                <CheckCircle2 className="h-4 w-4" /> Review CKP
              </Button>
            )}
            {canReopen && (
              <Button
                variant="warning"
                size="sm"
                onClick={async () => {
                  await handleApproval('reopened', 'Status dibuka kembali oleh pimpinan.');
                }}
              >
                <Unlock className="h-4 w-4" /> Buka Kembali
              </Button>
            )}
          </div>
        </div>

        {/* Employee Info Card */}
        <Card className="bg-gradient-to-r from-slate-900 to-blue-950 text-white border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-6 relative">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/30">
                {employee.full_name?.charAt(0) || '?'}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">{employee.full_name}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-blue-200">
                  <span className="flex items-center gap-1">
                    <UserIcon className="h-3.5 w-3.5" />
                    NIP: {employee.nip || '-'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {employee.unit_kerja || '-'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50"><FileText className="h-4 w-4 text-blue-500" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{upload.total_entries}</p>
                <p className="text-xs text-slate-500">Total Kegiatan</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50"><BarChart3 className="h-4 w-4 text-emerald-500" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{(upload.avg_progres || 0).toFixed(0)}%</p>
                <p className="text-xs text-slate-500">Rata-rata Progres</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50"><Calendar className="h-4 w-4 text-amber-500" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{getBulanName(upload.bulan)}</p>
                <p className="text-xs text-slate-500">{upload.tahun}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50"><Clock className="h-4 w-4 text-purple-500" /></div>
              <div>
                <p className="text-sm font-bold text-slate-900 truncate">v{upload.version}</p>
                <p className="text-xs text-slate-500">{upload.file_name || 'File'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-400" />
              Detail Kegiatan Harian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th scope="col" className="text-center py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">No</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">Tanggal</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:table-cell">Jam</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap hidden md:table-cell">Rencana Kinerja</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500">Kegiatan</th>
                    <th scope="col" className="text-center py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">Progres</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap hidden lg:table-cell">Capaian</th>
                    <th scope="col" className="text-left py-3 px-3 text-xs font-semibold text-slate-500 whitespace-nowrap">Bukti</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-100 table-row-hover">
                      <td className="py-3 px-3 text-slate-500 text-center">{entry.row_number}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-xs text-slate-700">{formatDate(entry.tanggal_mulai)}</div>
                        {entry.tanggal_selesai && entry.tanggal_selesai !== entry.tanggal_mulai && (
                          <div className="text-xs text-slate-400">s.d. {formatDate(entry.tanggal_selesai)}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-xs text-slate-600 hidden sm:table-cell">
                        {formatTime(entry.jam_mulai)} — {formatTime(entry.jam_selesai)}
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-600 max-w-[160px] hidden md:table-cell">
                        <div className="line-clamp-2">{entry.rencana_kinerja || '-'}</div>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate-800 max-w-[280px]">
                        <div className="line-clamp-2">{entry.kegiatan || '-'}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full progress-bar"
                              style={{
                                width: `${Math.min(entry.progres, 100)}%`,
                                background: entry.progres >= 80
                                  ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                                  : entry.progres >= 50
                                  ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                                  : 'linear-gradient(90deg, #ef4444, #f97316)',
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-600 w-8 text-right">{entry.progres}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-600 max-w-[160px] hidden lg:table-cell">
                        <div className="line-clamp-2">{entry.capaian || '-'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <DataDukungLink value={entry.data_dukung} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick action bar at bottom of table */}
            {canReview && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  {entries.length} kegiatan • Rata-rata progres {(upload.avg_progres || 0).toFixed(0)}%
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => {
                      setDefaultModalAction('approved');
                      setShowApprovalModal(true);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Setujui
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDefaultModalAction('rejected');
                      setShowApprovalModal(true);
                    }}
                  >
                    <XCircle className="h-4 w-4" /> Tolak
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => {
                      setDefaultModalAction('revision_required');
                      setShowApprovalModal(true);
                    }}
                  >
                    <RefreshCw className="h-4 w-4" /> Minta Revisi
                  </Button>
                </div>
              </div>
            )}
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

      {/* Approval Modal */}
      <ApprovalModal
        open={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onSubmit={handleApproval}
        employeeName={employee.full_name}
        period={`${getBulanName(upload.bulan)} ${upload.tahun}`}
        defaultAction={defaultModalAction}
      />
    </>
  );
}
