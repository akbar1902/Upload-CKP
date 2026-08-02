"use client";

import React, { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { ChevronDown, ChevronUp, ChevronRight, Plus, Trash2, Search, Filter, AlertTriangle, X, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminRencanaKinerjaClient({ initialData }: { initialData: any }) {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Modal States
  const [showAddMasterModal, setShowAddMasterModal] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, name: string, type: 'master' | 'sub'} | null>(null);
  const [selectedRkForSub, setSelectedRkForSub] = useState<any>(null);

  // Form States
  const [newMasterRk, setNewMasterRk] = useState({ rencana_kinerja: '', tim_kerja: '', ketua_tim_id: '' });
  const [newSubRk, setNewSubRk] = useState({ kegiatan_nama: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isPending, refetch } = useQuery({
    queryKey: ['admin-rk-data'],
    queryFn: async () => {
      const [rksRes, subsRes, usersRes] = await Promise.all([
        supabase.from('rk_ketua_tim_mapping').select('*, ketua_tim:users!ketua_tim_id(full_name)').order('rencana_kinerja'),
        supabase.from('master_kegiatan_anggota').select('*').order('kegiatan_nama'),
        supabase.from('users').select('id, full_name, unit_kerja').in('role', ['ketua_tim', 'pimpinan', 'admin'])
      ]);

      if (rksRes.error) throw rksRes.error;
      
      const rks = rksRes.data || [];
      const subs = subsRes.data || [];
      const ketuaTims = usersRes.data || [];

      // Group Sub-RKs by rk_id
      const subsByRk = subs.reduce((acc: any, sub: any) => {
        if (!acc[sub.rk_id]) acc[sub.rk_id] = [];
        acc[sub.rk_id].push(sub);
        return acc;
      }, {});

      return { rks, subsByRk, ketuaTims };
    },
    initialData: initialData,
  });

  const { rks, subsByRk, ketuaTims } = data || { rks: [], subsByRk: {}, ketuaTims: [] };

  const uniqueTeams = useMemo(() => {
    const teams = new Set<string>();
    rks.forEach((r: any) => {
      if (r.tim_kerja) teams.add(r.tim_kerja);
    });
    return Array.from(teams).sort();
  }, [rks]);

  const filteredRks = useMemo(() => {
    let result = rks;
    
    if (selectedTeam) {
      result = result.filter((r: any) => r.tim_kerja === selectedTeam);
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r: any) => 
        r.rencana_kinerja.toLowerCase().includes(q) ||
        (r.tim_kerja && r.tim_kerja.toLowerCase().includes(q)) ||
        (r.ketua_tim?.full_name && r.ketua_tim.full_name.toLowerCase().includes(q))
      );
    }
    
    return result;
  }, [rks, search, selectedTeam]);

  const groupedRks = useMemo(() => {
    return filteredRks.reduce((acc: any, rk: any) => {
      const team = rk.tim_kerja || 'Tanpa Tim Kerja';
      if (!acc[team]) acc[team] = [];
      acc[team].push(rk);
      return acc;
    }, {} as Record<string, any[]>);
  }, [filteredRks]);

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    setIsSubmitting(true);
    try {
      if (deleteConfirm.type === 'master') {
        const { error } = await supabase.from('rk_ketua_tim_mapping').delete().eq('id', deleteConfirm.id);
        if (error) throw error;
        toast.success("RK berhasil dihapus");
      } else {
        const { error } = await supabase.from('master_kegiatan_anggota').delete().eq('id', deleteConfirm.id);
        if (error) throw error;
        toast.success("Sub-RK berhasil dihapus");
      }
      refetch();
    } catch (e: any) {
      toast.error("Gagal menghapus: " + e.message);
    } finally {
      setIsSubmitting(false);
      setDeleteConfirm(null);
    }
  };

  const handleAddMaster = async () => {
    if (!newMasterRk.rencana_kinerja.trim() || !newMasterRk.tim_kerja.trim() || !newMasterRk.ketua_tim_id) {
      toast.error("Harap isi semua kolom!");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('rk_ketua_tim_mapping').insert({
      rencana_kinerja: newMasterRk.rencana_kinerja,
      tim_kerja: newMasterRk.tim_kerja,
      ketua_tim_id: newMasterRk.ketua_tim_id,
      created_by: user?.id
    });
    setIsSubmitting(false);
    
    if (error) {
      toast.error("Gagal menambah RK: " + error.message);
    } else {
      toast.success("RK berhasil ditambahkan");
      setShowAddMasterModal(false);
      setNewMasterRk({ rencana_kinerja: '', tim_kerja: '', ketua_tim_id: '' });
      refetch();
    }
  };

  const handleAddSub = async () => {
    if (!newSubRk.kegiatan_nama.trim() || !selectedRkForSub) {
      toast.error("Harap isi nama Sub-RK!");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('master_kegiatan_anggota').insert({
      rk_id: selectedRkForSub.id,
      kegiatan_nama: newSubRk.kegiatan_nama,
      user_id: user?.id
    });
    setIsSubmitting(false);
    
    if (error) {
      toast.error("Gagal menambah Sub-RK: " + error.message);
    } else {
      toast.success("Sub-RK berhasil ditambahkan");
      setShowAddSubModal(false);
      setNewSubRk({ kegiatan_nama: '' });
      refetch();
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
              Kelola Rencana Kinerja Utama, Sub-RK Anggota, dan Tim Kerja.
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
            <button onClick={() => setShowAddMasterModal(true)} className="btn-primary">
              <Plus size={14} /> Tambah RK Manual
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Cari Rencana Kinerja, Tim Kerja, Ketua Tim..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 h-10 text-[13px] rounded-xl border focus:ring-2 outline-none transition-colors"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="w-full sm:w-64">
            <select
              className="w-full h-10 text-[13px] px-3 rounded-xl border outline-none transition-colors"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">Semua Tim Kerja</option>
              {uniqueTeams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center p-12">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border shadow-sm" style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}>
            <table className="w-full text-left text-[13px]">
              <thead style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                <tr>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)] w-10"></th>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Rencana Kinerja Utama</th>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Ketua Tim</th>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedRks).map(([team, rksInTeam]) => (
                  <React.Fragment key={team}>
                    {/* Header Tim Kerja */}
                    <tr className="bg-slate-100 dark:bg-slate-800/80">
                      <td colSpan={4} className="px-4 py-2 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                        Tim Kerja: <span className="text-blue-600 dark:text-blue-400">{team}</span>
                      </td>
                    </tr>
                    {/* Render RKs */}
                    {(rksInTeam as any[]).map((r: any) => {
                      const isExpanded = expandedRowId === r.id;
                      const subs = subsByRk[r.id] || [];
                      return (
                        <React.Fragment key={r.id}>
                          <tr className={`border-b last:border-b-0 transition-colors ${isExpanded ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`} style={{ borderColor: 'var(--border)' }}>
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => setExpandedRowId(isExpanded ? null : r.id)}
                                className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                style={{ color: 'var(--text-tertiary)' }}
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold line-clamp-2 max-w-md" style={{ color: 'var(--text-primary)' }}>{r.rencana_kinerja}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div style={{ color: 'var(--text-primary)' }}>{r.ketua_tim?.full_name || 'Belum di-set'}</div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => { setSelectedRkForSub(r); setShowAddSubModal(true); }} 
                                  title="Tambah Sub-RK" 
                                  className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-600 transition-colors border border-emerald-200 dark:border-emerald-800"
                                >
                                  <Plus size={14} />
                                </button>
                                <button onClick={() => setDeleteConfirm({id: r.id, name: r.rencana_kinerja, type: 'master'})} title="Hapus RK Master" className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {/* Expanded Row for Sub-RKs */}
                          {isExpanded && (
                            <tr className="bg-slate-50/50 dark:bg-slate-900/30" style={{ borderBottom: '1px solid var(--border)' }}>
                              <td></td>
                              <td colSpan={3} className="p-4">
                                <div className="rounded-lg border shadow-inner p-4" style={{ background: 'var(--bg-base)', borderColor: 'var(--border)' }}>
                                  <h4 className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Daftar Kegiatan Anggota (Sub-RK)</h4>
                                  {subs.length > 0 ? (
                                    <ul className="space-y-2">
                                      {subs.map((sub: any, idx: number) => (
                                        <li key={sub.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                          <div className="flex items-start gap-2">
                                            <span className="text-xs text-slate-400 mt-0.5">{idx + 1}.</span>
                                            <span className="text-[13px]" style={{ color: 'var(--text-primary)' }}>{sub.kegiatan_nama}</span>
                                          </div>
                                          <button onClick={() => setDeleteConfirm({id: sub.id, name: sub.kegiatan_nama, type: 'sub'})} className="p-1 text-slate-400 hover:text-red-500 transition-colors" title="Hapus Sub-RK">
                                            <Trash2 size={14} />
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-[13px] text-slate-500 italic">Belum ada Sub-RK yang dipetakan ke RK Utama ini.</p>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                ))}
                {filteredRks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      Tidak ada Rencana Kinerja ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah RK Master */}
      {showAddMasterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-xl shadow-xl w-full max-w-md overflow-hidden" style={{ background: 'var(--card-bg)' }}>
            <div className="p-5 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Tambah RK Utama</h3>
              <button onClick={() => setShowAddMasterModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Nama Rencana Kinerja</label>
                <textarea 
                  className="w-full text-sm rounded-lg p-3 outline-none min-h-[80px]"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  placeholder="Ketik nama RK..."
                  value={newMasterRk.rencana_kinerja}
                  onChange={(e) => setNewMasterRk({...newMasterRk, rencana_kinerja: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tim Kerja</label>
                <input 
                  type="text"
                  className="w-full text-sm rounded-lg h-10 px-3 outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  placeholder="Misal: Tim Statistik Distribusi"
                  value={newMasterRk.tim_kerja}
                  onChange={(e) => setNewMasterRk({...newMasterRk, tim_kerja: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Ketua Tim</label>
                <select
                  className="w-full text-sm rounded-lg h-10 px-3 outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  value={newMasterRk.ketua_tim_id}
                  onChange={(e) => setNewMasterRk({...newMasterRk, ketua_tim_id: e.target.value})}
                >
                  <option value="">-- Pilih Ketua Tim --</option>
                  {ketuaTims.map((k: any) => (
                    <option key={k.id} value={k.id}>{k.full_name} {k.unit_kerja ? `(${k.unit_kerja})` : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-5 flex justify-end gap-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
              <button className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors" onClick={() => setShowAddMasterModal(false)}>Batal</button>
              <button className="btn-primary" onClick={handleAddMaster} disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan RK Master'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Sub-RK */}
      {showAddSubModal && selectedRkForSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-xl shadow-xl w-full max-w-md overflow-hidden" style={{ background: 'var(--card-bg)' }}>
            <div className="p-5 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Tambah Sub-RK Manual</h3>
              <button onClick={() => setShowAddSubModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">RK Induk</p>
                <p className="text-sm font-medium line-clamp-2" style={{ color: 'var(--text-primary)' }}>{selectedRkForSub.rencana_kinerja}</p>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Nama Kegiatan Anggota (Sub-RK)</label>
                <textarea 
                  className="w-full text-sm rounded-lg p-3 outline-none min-h-[100px]"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                  placeholder="Ketik uraian kegiatan spesifik dari anggota..."
                  value={newSubRk.kegiatan_nama}
                  onChange={(e) => setNewSubRk({ kegiatan_nama: e.target.value })}
                />
              </div>
            </div>
            <div className="p-5 flex justify-end gap-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
              <button className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors" onClick={() => setShowAddSubModal(false)}>Batal</button>
              <button className="btn-primary" onClick={handleAddSub} disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Sub-RK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-xl shadow-xl w-full max-w-md overflow-hidden border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
            <div className="p-5 flex justify-between items-center border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 text-red-600">
                 <AlertTriangle size={20} />
                 <h3 className="font-semibold text-lg">Konfirmasi Hapus</h3>
              </div>
              <button onClick={() => setDeleteConfirm(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Apakah Anda yakin ingin menghapus {deleteConfirm.type === 'master' ? 'RK Utama' : 'Sub-RK'} berikut?
              </p>
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50">
                <p className="text-sm font-medium line-clamp-3 text-red-800 dark:text-red-200">{deleteConfirm.name}</p>
              </div>
              {deleteConfirm.type === 'master' && (
                <p className="text-[13px] text-red-600 dark:text-red-400 mt-2">
                  <strong>Peringatan:</strong> Menghapus RK Utama akan otomatis menghapus seluruh Sub-RK di dalamnya. Tindakan ini tidak dapat dibatalkan.
                </p>
              )}
            </div>
            <div className="p-5 flex justify-end gap-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
              <button className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300" onClick={() => setDeleteConfirm(null)}>Batal</button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm" onClick={executeDelete} disabled={isSubmitting}>
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
