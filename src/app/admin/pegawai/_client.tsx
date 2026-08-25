"use client";

import React, { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import type { User } from '@/types/database';
import { Search, Plus, Trash2, Key, RefreshCw, ShieldCheck, Briefcase, Mail, XCircle, CheckCircle, ArrowRightLeft } from 'lucide-react';
import { createEmployee, deleteEmployee, resetPassword, toggleEmployeeStatus, replaceKetuaTim } from '@/app/actions/admin';
import { toast } from 'sonner';

export default function AdminPegawaiClient({ initialUsers }: { initialUsers: User[] }) {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ganti Ketua Tim state
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceOldUserId, setReplaceOldUserId] = useState('');
  const [replaceNewUserId, setReplaceNewUserId] = useState('');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmStyle: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Ya',
    confirmStyle: 'primary',
    onConfirm: () => {},
  });
  const [isReplacing, setIsReplacing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    nip: '',
    unit_kerja: '',
    role: 'anggota'
  });

  const { data: usersData, isPending, refetch } = useQuery({
    queryKey: ['admin-pegawai'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('full_name');

      if (error) throw error;
      
      const users = (data as (User & { managed_teams?: string })[]) ?? [];
      
      // Ambil mapping tim_kerja untuk memastikan nama timnya benar-benar diambil dari data penugasan
      const { data: mappings } = await supabase.from('rk_ketua_tim_mapping').select('ketua_tim_id, tim_kerja').not('ketua_tim_id', 'is', null);
      
      if (mappings) {
        users.forEach(u => {
          if (u.role === 'ketua_tim') {
            const tims = mappings.filter((m: any) => m.ketua_tim_id === u.id).map((m: any) => m.tim_kerja).filter(Boolean);
            if (tims.length > 0) {
              u.managed_teams = [...new Set(tims)].join(', ');
            }
          }
        });
      }

      return users;
    },
    initialData: initialUsers as (User & { managed_teams?: string })[],
  });

  const users = usersData || [];
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u => 
      u.full_name.toLowerCase().includes(q) ||
      (u.nip && u.nip.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  }, [users, search]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createEmployee(formData);
      if (res.success) {
        toast.success("Pegawai berhasil ditambahkan");
        setShowAddModal(false);
        setFormData({ email: '', password: '', full_name: '', nip: '', unit_kerja: '', role: 'anggota' });
        refetch();
      } else {
        toast.error("Gagal menambahkan pegawai: " + res.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (userId: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Hapus',
      message: `Yakin ingin menghapus secara permanen akun ${name}? Semua data CKP-nya juga akan ikut terhapus dan tidak dapat dikembalikan.`,
      confirmText: 'Hapus Pegawai',
      confirmStyle: 'danger',
      onConfirm: async () => {
        const res = await deleteEmployee(userId);
        if (res.success) {
          toast.success("Pegawai berhasil dihapus");
          refetch();
        } else {
          toast.error("Gagal menghapus: " + res.error);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleResetPassword = (userId: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Password',
      message: `Yakin ingin me-reset kata sandi ${name} menjadi "Password123!"?`,
      confirmText: 'Reset Password',
      confirmStyle: 'warning',
      onConfirm: async () => {
        const res = await resetPassword(userId);
        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error("Gagal reset password: " + res.error);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleToggleStatus = (userId: string, currentStatus: boolean, name: string) => {
    const actionName = currentStatus ? 'Menonaktifkan' : 'Mengaktifkan';
    setConfirmModal({
      isOpen: true,
      title: `${actionName} Akun`,
      message: `Yakin ingin ${currentStatus ? 'me-nonaktifkan' : 'mengaktifkan'} ${name}?`,
      confirmText: currentStatus ? 'Nonaktifkan' : 'Aktifkan',
      confirmStyle: currentStatus ? 'warning' : 'primary',
      onConfirm: async () => {
        // Optimistic update agar UI langsung berubah
        queryClient.setQueryData(['admin-pegawai'], (old: any) => {
          if (!old) return old;
          return old.map((u: any) => u.id === userId ? { ...u, is_active: !currentStatus } : u);
        });

        const res = await toggleEmployeeStatus(userId, currentStatus);
        if (res.success) {
          toast.success(`Pegawai berhasil di${currentStatus ? 'nonaktifkan' : 'aktifkan'}`);
          refetch();
        } else {
          // Revert jika gagal
          queryClient.setQueryData(['admin-pegawai'], (old: any) => {
            if (!old) return old;
            return old.map((u: any) => u.id === userId ? { ...u, is_active: currentStatus } : u);
          });
          toast.error("Gagal mengubah status: " + res.error);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleReplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceNewUserId) return toast.error('Pilih pegawai pengganti');
    
    setIsReplacing(true);
    try {
      const res = await replaceKetuaTim(replaceOldUserId, replaceNewUserId);
      if (res.success) {
        toast.success('Ketua Tim berhasil diganti');
        setShowReplaceModal(false);
        setReplaceOldUserId('');
        setReplaceNewUserId('');
        refetch();
      } else {
        toast.error('Gagal mengganti ketua tim: ' + res.error);
      }
    } finally {
      setIsReplacing(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-2">
          <div>
            <h2 className="text-[24px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Manajemen Kepegawaian
            </h2>
            <p className="text-[14px] mt-1 text-slate-500 dark:text-slate-400">
              Kelola akun pegawai, tambah baru, hapus, atau reset password.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-slate-400" />
              <input
                type="search"
                placeholder="Cari nama, NIP, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 pl-10 h-10 text-[13px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#3A6D5B]/50 outline-none transition-all shadow-sm"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            <button onClick={() => setShowAddModal(true)} className="h-10 px-4 rounded-xl font-medium text-[13px] text-white bg-[#3A6D5B] hover:bg-[#2c5345] transition-all shadow-md shadow-[#3A6D5B]/20 flex items-center justify-center gap-2">
              <Plus size={16} /> Tambah Pegawai
            </button>
          </div>
        </div>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-24">
            <RefreshCw className="h-8 w-8 animate-spin text-[#3A6D5B] mb-4 opacity-80" />
            <p className="text-[13px] text-slate-500">Memuat data pegawai...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Pegawai</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap">Peran (Role)</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Status Akun</th>
                    <th className="px-5 py-4 font-semibold whitespace-nowrap text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-[14px]">{u.full_name}</div>
                        <div className="text-[12px] text-slate-500 mt-0.5">{u.nip} &bull; {u.email}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                          {u.role === 'anggota' ? 'Pegawai' : u.role === 'ketua_tim' ? `Ketua Tim ${u.managed_teams ? '- ' + u.managed_teams : (u.unit_kerja ? '- ' + u.unit_kerja : '')}` : <span className="capitalize">{u.role}</span>}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${u.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-slate-50 text-slate-600 border-slate-200/50 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          {u.is_active ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5 opacity-90 sm:opacity-0 sm:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                          {u.role === 'ketua_tim' && u.is_active && (
                            <button onClick={() => { setReplaceOldUserId(u.id); setShowReplaceModal(true); }} title="Ganti Ketua Tim" className="p-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 text-slate-400 transition-all hover:scale-105 active:scale-95">
                              <ArrowRightLeft size={16} strokeWidth={2.5} />
                            </button>
                          )}
                          <button onClick={() => handleToggleStatus(u.id, u.is_active, u.full_name)} title={u.is_active ? "Nonaktifkan Akun" : "Aktifkan Akun"} className={`p-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${u.is_active ? 'hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 text-slate-400' : 'hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 text-slate-400'}`}>
                            {u.is_active ? <XCircle size={16} strokeWidth={2.5} /> : <CheckCircle size={16} strokeWidth={2.5} />}
                          </button>
                          <button onClick={() => handleResetPassword(u.id, u.full_name)} title="Reset Password ke Default" className="p-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 text-slate-400 transition-all hover:scale-105 active:scale-95">
                            <Key size={16} strokeWidth={2.5} />
                          </button>
                          <button onClick={() => handleDelete(u.id, u.full_name)} title="Hapus Permanen" className="p-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 text-slate-400 transition-all hover:scale-105 active:scale-95">
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                          <Search size={36} className="mb-3 opacity-20" />
                          <p className="text-[14px] font-medium">Tidak ada pegawai ditemukan</p>
                          <p className="text-[12px] mt-1 opacity-70">Coba gunakan kata kunci pencarian yang lain.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-2xl border border-slate-100 dark:border-slate-800 scale-in">
            <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Tambah Pegawai Baru</h3>
            <form onSubmit={handleAddEmployee} className="space-y-4 text-[13px]">
              <div>
                <label className="block mb-1.5 font-medium text-slate-600 dark:text-slate-400">Nama Lengkap</label>
                <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3A6D5B]/50 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-slate-600 dark:text-slate-400">NIP</label>
                <input required type="text" value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3A6D5B]/50 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-slate-600 dark:text-slate-400">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3A6D5B]/50 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-slate-600 dark:text-slate-400">Password Default</label>
                <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3A6D5B]/50 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-slate-600 dark:text-slate-400">Unit Kerja</label>
                <input type="text" value={formData.unit_kerja} onChange={e => setFormData({...formData, unit_kerja: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3A6D5B]/50 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-slate-600 dark:text-slate-400">Peran (Role)</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3A6D5B]/50 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-200">
                  <option value="anggota">Pegawai</option>
                  <option value="ketua_tim">Ketua Tim</option>
                  <option value="pimpinan">Pimpinan</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-8 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl font-medium bg-[#3A6D5B] hover:bg-[#2c5345] text-white transition-colors shadow-md shadow-[#3A6D5B]/20 disabled:opacity-50">{isSubmitting ? 'Menyimpan...' : 'Simpan Pegawai'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReplaceModal && (() => {
        const oldUserObj = users.find(u => u.id === replaceOldUserId);
        const teamName = oldUserObj?.managed_teams || oldUserObj?.unit_kerja || '';
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-2xl border border-slate-100 dark:border-slate-800 scale-in">
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100 uppercase">
              Ganti Ketua Tim {teamName}
            </h3>
            <p className="text-[13px] mb-6 text-slate-500 leading-relaxed">
              Pilih pegawai yang akan menggantikan Ketua Tim ini. Semua Rencana Kinerja akan dipindahkan ke penggantinya.
            </p>
            <form onSubmit={handleReplaceSubmit} className="space-y-4 text-[13px]">
              <div>
                <label className="block mb-1.5 font-medium text-slate-600 dark:text-slate-400">Pilih Pengganti</label>
                <select value={replaceNewUserId} onChange={e => setReplaceNewUserId(e.target.value)} required className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-200">
                  <option value="">-- Pilih Pegawai Aktif --</option>
                  {users.filter(u => u.is_active && u.id !== replaceOldUserId).map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.unit_kerja || '-'})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-8 pt-2">
                <button type="button" onClick={() => setShowReplaceModal(false)} className="px-5 py-2.5 rounded-xl font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors">Batal</button>
                <button type="submit" disabled={isReplacing} className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-md shadow-indigo-500/20 disabled:opacity-50">{isReplacing ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
              </div>
            </form>
          </div>
        </div>
        );
      })()}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-2xl border border-slate-100 dark:border-slate-800 scale-in text-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${
              confirmModal.confirmStyle === 'danger' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' :
              confirmModal.confirmStyle === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
              'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
            }`}>
              {confirmModal.confirmStyle === 'danger' ? <Trash2 size={24} /> : confirmModal.confirmStyle === 'warning' ? <XCircle size={24} /> : <CheckCircle size={24} />}
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">{confirmModal.title}</h3>
            <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} className="px-5 py-2.5 rounded-xl font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors w-full">
                Batal
              </button>
              <button onClick={confirmModal.onConfirm} className={`px-5 py-2.5 rounded-xl font-medium text-white transition-colors w-full shadow-md ${
                confirmModal.confirmStyle === 'danger' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20' :
                confirmModal.confirmStyle === 'warning' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' :
                'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
              }`}>
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
