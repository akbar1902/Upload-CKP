"use client";

import React, { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import type { User } from '@/types/database';
import { Search, Plus, Trash2, Key, RefreshCw, ShieldCheck, Briefcase, Mail } from 'lucide-react';
import { createEmployee, deleteEmployee, resetPassword } from '@/app/actions/admin';
import { toast } from 'sonner';

export default function AdminPegawaiClient({ initialUsers }: { initialUsers: User[] }) {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      return (data as User[]) ?? [];
    },
    initialData: initialUsers,
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

  const handleDelete = async (userId: string, name: string) => {
    if (confirm(`Yakin ingin menghapus ${name}? Semua data CKP-nya akan hilang.`)) {
      const res = await deleteEmployee(userId);
      if (res.success) {
        toast.success("Pegawai berhasil dihapus");
        refetch();
      } else {
        toast.error("Gagal menghapus: " + res.error);
      }
    }
  };

  const handleResetPassword = async (userId: string, name: string) => {
    if (confirm(`Yakin ingin mereset password ${name} menjadi "Password123!"?`)) {
      const res = await resetPassword(userId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error("Gagal reset password: " + res.error);
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
              Manajemen Kepegawaian
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Kelola akun pegawai, tambah baru, hapus, atau reset password.
            </p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus size={14} /> Tambah Pegawai
          </button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Cari nama, NIP, atau email..."
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
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Pegawai</th>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)]">Role</th>
                  <th className="px-4 py-3 font-medium border-b border-[var(--border)] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3">
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{u.full_name}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{u.nip} • {u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-pill bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] capitalize px-2 py-0.5">
                        {u.role === 'anggota' ? 'Pegawai' : u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleResetPassword(u.id, u.full_name)} title="Reset Password" className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 transition-colors">
                          <Key size={14} />
                        </button>
                        <button onClick={() => handleDelete(u.id, u.full_name)} title="Hapus Pegawai" className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      Tidak ada pegawai ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Tambah Pegawai Baru</h3>
            <form onSubmit={handleAddEmployee} className="space-y-4 text-[13px]">
              <div>
                <label className="block mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Nama Lengkap</label>
                <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>NIP</label>
                <input required type="text" value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Password Default</label>
                <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Unit Kerja</label>
                <input type="text" value={formData.unit_kerja} onChange={e => setFormData({...formData, unit_kerja: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <option value="anggota">Pegawai</option>
                  <option value="ketua_tim">Ketua Tim</option>
                  <option value="pimpinan">Pimpinan</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Batal</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Menyimpan...' : 'Simpan Pegawai'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
