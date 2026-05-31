"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { getBulanName, formatDateTime } from '@/lib/utils';
import type { CKPUpload } from '@/types/database';
import {
  Upload, FileText, TrendingUp, CheckCircle2,
  Clock, BarChart3, ArrowRight, AlertTriangle, Plus, XCircle,
} from 'lucide-react';

const STATUS_CONFIG = {
  submitted:         { label: 'Menunggu Review', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  approved:          { label: 'Disetujui',        color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  rejected:          { label: 'Ditolak',          color: 'bg-red-100 text-red-700 border-red-200' },
  revision_required: { label: 'Perlu Revisi',     color: 'bg-orange-100 text-orange-700 border-orange-200' },
  draft:             { label: 'Draft',             color: 'bg-slate-100 text-slate-600 border-slate-200' },
} as const;

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? { label: status, color: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}
      role="status"
      aria-label={`Status: ${cfg.label}`}
    >
      {cfg.label}
    </span>
  );
}

// Fixed widths to avoid SSR/client hydration mismatch (no Math.random)
const SKELETON_WIDTHS = ['75%', '60%', '85%', '50%', '70%', '65%'];

function SkeletonRow({ index }: { index: number }) {
  return (
    <tr>
      {SKELETON_WIDTHS.map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-4 bg-slate-100 rounded animate-pulse"
            style={{ width: index % 2 === 0 ? w : SKELETON_WIDTHS[(i + 2) % 6] }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function PegawaiDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [uploads, setUploads] = useState<CKPUpload[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setDataLoading(false); return; }

    let cancelled = false;
    const fetchUploads = async () => {
      try {
        const { data } = await supabase
          .from('ckp_uploads')
          .select('*')
          .eq('user_id', user.id)
          .order('tahun', { ascending: false })
          .order('bulan', { ascending: false });
        if (!cancelled) setUploads(data || []);
      } catch (err) {
        console.error('Error fetching uploads:', err);
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    };
    fetchUploads();
    return () => { cancelled = true; };
  }, [user, authLoading, supabase]);

  // Memoized stats to avoid recalculation on every render
  const stats = useMemo(() => ({
    total: uploads.length,
    approved: uploads.filter(u => u.status === 'approved').length,
    pending: uploads.filter(u => u.status === 'submitted').length,
    rejected: uploads.filter(u => u.status === 'rejected' || u.status === 'revision_required').length,
    avgProgres: uploads.length
      ? (uploads.reduce((s, u) => s + (u.avg_progres || 0), 0) / uploads.length).toFixed(0)
      : '0',
  }), [uploads]);

  const currentMonthUpload = useMemo(
    () => uploads.find(u => u.bulan === currentMonth && u.tahun === currentYear),
    [uploads, currentMonth, currentYear]
  );

  const isLoading = authLoading || dataLoading;

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 space-y-6 animate-fade-up">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Halo, {user?.full_name?.split(' ')[0] || 'Pegawai'} 👋
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Ringkasan CKP Anda — {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Link href="/pegawai/upload">
            <Button size="sm" className="flex items-center gap-1.5 shadow-sm">
              <Plus size={15} />
              Upload CKP
            </Button>
          </Link>
        </div>

        {/* Alert: belum upload bulan ini */}
        {!isLoading && !currentMonthUpload && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 animate-fade-in" role="alert">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800">
                CKP {getBulanName(currentMonth)} {currentYear} belum diupload
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Silakan upload sebelum akhir bulan.
              </p>
            </div>
            <Link href="/pegawai/upload" className="flex-shrink-0">
              <Button size="sm" variant="warning" className="text-xs">Upload</Button>
            </Link>
          </div>
        )}

        {/* Alert: ada yang ditolak */}
        {!isLoading && stats.rejected > 0 && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in" role="alert">
            <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800">
                {stats.rejected} CKP memerlukan tindakan
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Ada CKP yang ditolak atau perlu revisi. Silakan upload ulang.
              </p>
            </div>
            <Link href="/pegawai/upload" className="flex-shrink-0">
              <Button size="sm" variant="destructive" className="text-xs">Upload Ulang</Button>
            </Link>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {[
            { label: 'Total Upload',      value: stats.total,     icon: FileText,     color: 'bg-blue-50 text-blue-600',    sub: 'semua periode' },
            { label: 'Disetujui',         value: stats.approved,  icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600', sub: `dari ${stats.total} upload` },
            { label: 'Menunggu Review',   value: stats.pending,   icon: Clock,        color: 'bg-amber-50 text-amber-600',   sub: 'belum diproses' },
            { label: 'Rata-rata Progres', value: `${stats.avgProgres}%`, icon: BarChart3, color: 'bg-purple-50 text-purple-600', sub: 'semua kegiatan' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm card-hover animate-fade-up">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
                  <div className={`p-2 rounded-lg ${s.color}`}>
                    <Icon size={15} />
                  </div>
                </div>
                {isLoading
                  ? <div className="h-7 w-16 bg-slate-100 rounded animate-pulse" />
                  : <p className="text-2xl font-bold text-slate-800 tabular-nums">{s.value}</p>
                }
                <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Upload history table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Riwayat Upload CKP</h3>
              <p className="text-xs text-slate-400 mt-0.5">{uploads.length} upload tercatat</p>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-slate-400" />
              <span className="text-xs text-slate-400">Progres rata-rata: <span className="font-semibold text-slate-600">{stats.avgProgres}%</span></span>
            </div>
          </div>

          {isLoading ? (
            <table className="w-full">
              <tbody>
                {[...Array(3)].map((_, i) => <SkeletonRow key={i} index={i} />)}
              </tbody>
            </table>
          ) : uploads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <FileText size={24} className="text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Belum ada upload</p>
              <p className="text-xs text-slate-400 mt-1 mb-5">Upload CKP bulanan pertama Anda</p>
              <Link href="/pegawai/upload">
                <Button size="sm" variant="outline">
                  <Upload size={14} />
                  Upload Sekarang
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th scope="col" className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Periode</th>
                    <th scope="col" className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">File</th>
                    <th scope="col" className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Kegiatan</th>
                    <th scope="col" className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Progres</th>
                    <th scope="col" className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Status</th>
                    <th scope="col" className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Diupload</th>
                    <th scope="col" className="text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {uploads.map((upload) => (
                    <tr key={upload.id} className="table-row group">
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-800">
                          {getBulanName(upload.bulan)} {upload.tahun}
                        </span>
                        {upload.version > 1 && (
                          <span className="ml-1.5 text-[11px] text-slate-400 font-normal">v{upload.version}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-slate-600 block max-w-[180px] break-words leading-snug text-xs">
                          {upload.file_name || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center hidden md:table-cell">
                        <span className="font-medium text-slate-700">{upload.total_entries}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full progress-bar"
                              style={{ width: `${Math.min(upload.avg_progres || 0, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600 font-medium tabular-nums">
                            {(upload.avg_progres || 0).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={upload.status} />
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-slate-400">
                          {formatDateTime(upload.uploaded_at)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/pegawai/ckp/${upload.id}`}>
                          <button className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                            Detail <ArrowRight size={12} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
