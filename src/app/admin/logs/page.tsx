"use client";

import React, { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Search, RefreshCw, Clock, User, Activity } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function AdminLogsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [search, setSearch] = useState('');
  const [filterEntity, setFilterEntity] = useState('all');

  const { data: logsData, isPending, refetch } = useQuery({
    queryKey: ['admin-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*, user:users(full_name, role)')
        .order('created_at', { ascending: false })
        .limit(200); // Batasi 200 terbaru untuk performa

      if (error) throw error;
      return data ?? [];
    },
  });

  const logs = logsData || [];
  
  const filteredLogs = useMemo(() => {
    let result = logs;

    if (filterEntity !== 'all') {
      result = result.filter(l => l.entity_type === filterEntity);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l => 
        (l.action && l.action.toLowerCase().includes(q)) ||
        (l.user?.full_name && l.user.full_name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [logs, search, filterEntity]);

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
          <button onClick={() => refetch()} className="btn-secondary" disabled={isPending}>
            <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Cari aktivitas atau nama user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 h-10 text-[13px] rounded-xl border focus:ring-2 outline-none"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="px-4 py-2 border rounded-xl text-[13px] outline-none h-10"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <option value="all">Semua Entitas</option>
            <option value="ckp_uploads">CKP Uploads</option>
            <option value="ckp_entries">CKP Entries (Nilai)</option>
            <option value="rencana_kinerja">Rencana Kinerja</option>
            <option value="users">Users</option>
          </select>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center p-12">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-left text-[13px]">
              <thead style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                <tr>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Waktu</th>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)]">User</th>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Entitas</th>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(l => (
                  <tr key={l.id} className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <Clock size={12} />
                        {formatDateTime(l.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                        <User size={12} />
                        {l.user?.full_name || 'Sistem'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-pill bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 text-[11px]">
                        {l.entity_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                        <Activity size={12} className="text-blue-500" />
                        {l.action}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      Tidak ada log aktivitas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
