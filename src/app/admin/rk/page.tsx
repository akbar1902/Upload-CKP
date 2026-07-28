"use client";

import React, { useState, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Search, Plus, Trash2, FileSpreadsheet, RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminRKPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const { data: rksData, isPending, refetch } = useQuery({
    queryKey: ['admin-rk'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rk_ketua_tim_mapping')
        .select('*, ketua_tim:users!ketua_tim_id(full_name)')
        .order('rencana_kinerja');

      if (error) throw error;
      return data ?? [];
    },
  });

  const rks = rksData || [];
  const filteredRks = useMemo(() => {
    if (!search.trim()) return rks;
    const q = search.toLowerCase();
    return rks.filter((r: any) => 
      r.rencana_kinerja.toLowerCase().includes(q) ||
      (r.tim_kerja && r.tim_kerja.toLowerCase().includes(q)) ||
      (r.ketua_tim?.full_name && r.ketua_tim.full_name.toLowerCase().includes(q))
    );
  }, [rks, search]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus RK: ${name}?`)) {
      const { error } = await supabase.from('rk_ketua_tim_mapping').delete().eq('id', id);
      if (!error) {
        toast.success("RK berhasil dihapus");
        refetch();
      } else {
        toast.error("Gagal menghapus: " + error.message);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Manajemen Rencana Kinerja
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Kelola Rencana Kinerja dan Tim Kerja, atau upload massal via Excel.
            </p>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/admin/rk/import"
              className="btn-secondary flex items-center gap-2 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
            >
              <FileSpreadsheet size={14} /> 
              Upload Excel
            </Link>
            <button className="btn-primary">
              <Plus size={14} /> Tambah RK Manual
            </button>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Cari Rencana Kinerja, Tim Kerja, Ketua Tim..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 h-10 text-[13px] rounded-xl border focus:ring-2 outline-none"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
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
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Rencana Kinerja</th>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Tim Kerja</th>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Ketua Tim</th>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRks.map((r: any) => (
                  <tr key={r.id} className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3">
                      <div className="font-semibold line-clamp-2 max-w-md" style={{ color: 'var(--text-primary)' }}>{r.rencana_kinerja}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-pill bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] px-2 py-0.5">
                        {r.tim_kerja || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div style={{ color: 'var(--text-primary)' }}>{r.ketua_tim?.full_name || 'Belum di-set'}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button title="Kelola Anggota RK" className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 transition-colors">
                          <Users size={14} />
                        </button>
                        <button onClick={() => handleDelete(r.id, r.rencana_kinerja)} title="Hapus RK" className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRks.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      Tidak ada Rencana Kinerja ditemukan.
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
