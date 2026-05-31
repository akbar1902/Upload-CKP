"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types/database';
import {
  Search,
  Users,
  ArrowRight,
  Briefcase,
  Mail,
} from 'lucide-react';

// Gradient palette elegan (sama dengan dashboard pimpinan)
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #b45309 0%, #78716c 50%, #475569 100%)',
  'linear-gradient(135deg, #0f766e 0%, #0369a1 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
  'linear-gradient(135deg, #be185d 0%, #9d174d 100%)',
  'linear-gradient(135deg, #1d4ed8 0%, #0e7490 100%)',
  'linear-gradient(135deg, #15803d 0%, #0f766e 100%)',
  'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
  'linear-gradient(135deg, #6d28d9 0%, #be185d 100%)',
];
function getAvatarGradient(name: string): string {
  const idx = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}
function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export default function PimpinanPegawaiPage() {
  const supabase = useMemo(() => createClient(), []);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'pegawai')
          .eq('is_active', true)
          .order('full_name');

        if (!cancelled) setUsers(data as User[] || []);
      } catch (err) {
        console.error('[PimpinanPegawai] Fetch error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();
    return () => { cancelled = true; };
  }, [supabase]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      u.full_name.toLowerCase().includes(q) ||
      u.nip?.toLowerCase().includes(q) ||
      u.unit_kerja?.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-4 lg:p-8 space-y-6">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-500" />
              Data Pegawai
            </h2>
            <p className="text-slate-500 mt-1">{users.length} pegawai aktif terdaftar</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama, NIP, atau unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Employee Cards */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">Tidak ada pegawai ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((u) => (
              <Card key={u.id} className="hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                      style={{ background: getAvatarGradient(u.full_name) }}
                      aria-hidden="true"
                    >
                      {getInitials(u.full_name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 truncate">{u.full_name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{u.nip || 'NIP belum diisi'}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{u.unit_kerja || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{u.email}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                    <Badge variant={u.is_active ? 'success' : 'secondary'} className="text-[10px]">
                      {u.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                    <Link href={`/pimpinan/pegawai/${u.id}`}>
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
                        Lihat CKP <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
