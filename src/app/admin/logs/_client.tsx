"use client";

import React, { useState, useMemo } from 'react';
import { runSafeRead } from '@/lib/supabase/read';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Search, RefreshCw, Clock, User, Activity, AlertTriangle, History } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import {
  DataTable,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';

const LOG_LIMIT = 200; // Batasi 200 terbaru untuk performa (limit dari server)

interface AuditLogUser {
  full_name: string | null;
  role: string | null;
}

interface AuditLogRow {
  id: string;
  action: string | null;
  entity_type: string | null;
  created_at: string;
  user?: AuditLogUser | null;
}

export default function AdminLogsClient({ initialLogs }: { initialLogs: AuditLogRow[] }) {
  const [search, setSearch] = useState('');
  const [filterEntity, setFilterEntity] = useState('all');

  const {
    data: logsData,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin-logs'],
    queryFn: () =>
      runSafeRead<AuditLogRow[]>(async (supabase) => {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*, user:users(full_name, role)')
          .order('created_at', { ascending: false })
          .limit(LOG_LIMIT);

        if (error) throw error;
        return (data ?? []) as AuditLogRow[];
      }),
    initialData: initialLogs,
    retry: false,
  });

  const logs = useMemo(() => logsData ?? [], [logsData]);

  const filteredLogs = useMemo(() => {
    let result = logs;

    if (filterEntity !== 'all') {
      result = result.filter((l) => l.entity_type === filterEntity);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) =>
        (l.action && l.action.toLowerCase().includes(q)) ||
        (l.user?.full_name && l.user.full_name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [logs, search, filterEntity]);

  const isFiltering = search.trim().length > 0 || filterEntity !== 'all';
  const showTable = !(isError && logs.length === 0);
  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Log Aktivitas Sistem
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Pantau aktivitas penting yang dilakukan oleh pegawai dan pimpinan.
            </p>
          </div>
          <button onClick={() => refetch()} className="btn-secondary" disabled={isFetching}>
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            {isFetching ? 'Memuat...' : 'Refresh'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Cari aktivitas atau nama user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari log aktivitas"
              className="w-full pl-9 h-10 text-[13px] rounded-xl border focus:ring-2 outline-none"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--sand-border)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            aria-label="Filter entitas log"
            className="px-4 py-2 border rounded-xl text-[13px] outline-none h-10"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--sand-border)', color: 'var(--text-primary)' }}
          >
            <option value="all">Semua Entitas</option>
            <option value="ckp_uploads">CKP Uploads</option>
            <option value="ckp_entries">CKP Entries (Nilai)</option>
            <option value="rencana_kinerja">Rencana Kinerja</option>
            <option value="users">Users</option>
          </select>
        </div>

        {isError && (
          <div
            role="alert"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border px-4 py-3"
            style={{ background: 'var(--danger-soft)', borderColor: 'var(--danger-soft)' }}
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--danger)' }} aria-hidden="true" />
              <div>
                <p className="text-[13px] font-semibold" style={{ color: 'var(--danger-text)' }}>
                  Gagal memuat log aktivitas.
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {errorMessage ? `Detail: ${errorMessage}` : 'Periksa koneksi lalu coba lagi.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 flex-shrink-0"
              style={{ background: 'var(--danger)', color: 'var(--on-solid)' }}
            >
              <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
              Coba lagi
            </button>
          </div>
        )}

        {showTable && (
          <div className="space-y-2">
            <DataTable
              isLoading={isPending && !isError}
              skeletonRows={6}
              skeletonCols={4}
              isEmpty={!isPending && !isError && filteredLogs.length === 0}
              emptyState={
                <EmptyState
                  icon={History}
                  title={isFiltering ? 'Tidak ada log yang cocok' : 'Belum ada log aktivitas'}
                  description={
                    isFiltering
                      ? 'Coba ubah kata kunci pencarian atau filter entitas.'
                      : 'Aktivitas pegawai dan pimpinan akan tampil di sini.'
                  }
                />
              }
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-b-0 hover:bg-transparent">
                    <TableHead>Waktu</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Entitas</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                          <Clock size={12} aria-hidden="true" />
                          {formatDateTime(l.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                          <User size={12} aria-hidden="true" />
                          {l.user?.full_name || 'Sistem'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="badge-pill bg-[var(--sand-subtle)] text-[var(--text-secondary)] px-2 py-0.5 text-[11px]">
                          {l.entity_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                          <Activity size={12} className="text-[var(--primary)]" aria-hidden="true" />
                          {l.action}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DataTable>

            <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              {isFiltering
                ? `Menampilkan ${filteredLogs.length} dari ${logs.length} log yang dimuat`
                : `Menampilkan ${logs.length} log`}{' '}
              · server hanya memuat {LOG_LIMIT} log terbaru (limit query).
            </p>
          </div>
        )}
      </div>
    </>
  );
}
