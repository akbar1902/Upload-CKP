"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import type { User } from '@/types/database';
import { Search, ArrowRight, Users, Briefcase, Mail, ShieldCheck, WifiOff, RefreshCw } from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
  'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
  'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)',
  'linear-gradient(135deg, #DB2777 0%, #9333EA 100%)',
  'linear-gradient(135deg, #EA580C 0%, #EAB308 100%)',
  'linear-gradient(135deg, #0F766E 0%, #2563EB 100%)',
  'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)',
  'linear-gradient(135deg, #1D4ED8 0%, #0E7490 100%)',
];
function getAvatarGradient(name: string): string {
  const idx = ((name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}
function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

// ── Staff Card ─────────────────────────────────────────────
function StaffCard({ u, index }: { u: User; index: number }) {
  const delay = Math.min(index * 40, 320);
  return (
    <div
      className="activity-card animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4 p-5">

        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0"
          style={{ background: getAvatarGradient(u.full_name) }}
          aria-hidden="true"
        >
          {getInitials(u.full_name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
              {u.full_name}
            </p>
            {u.is_active && (
              <span
                className="badge-pill text-[10px] px-2"
                style={{ background: '#DCFCE7', color: '#15803D', padding: '2px 8px' }}
                aria-label="Status aktif"
              >
                <ShieldCheck size={10} className="inline mr-1" />
                Aktif
              </span>
            )}
          </div>
          <p className="text-[12px] mt-0.5 font-mono" style={{ color: 'var(--text-secondary)' }}>
            {u.nip || 'NIP belum diisi'}
          </p>
        </div>

        {/* Unit & email — hidden on small screens */}
        <div className="hidden md:flex flex-col gap-1.5 flex-shrink-0 min-w-0 max-w-[200px]">
          {u.unit_kerja && (
            <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              <Briefcase size={12} style={{ flexShrink: 0 }} />
              <span className="truncate">{u.unit_kerja}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
            <Mail size={12} style={{ flexShrink: 0 }} />
            <span className="truncate">{u.email}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/pimpinan/pegawai/${u.id}`}
          className="flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
          style={{
            background: 'var(--primary-soft)',
            color: 'var(--primary)',
            border: '1px solid rgba(37,99,235,0.12)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--primary)';
            (e.currentTarget as HTMLElement).style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--primary-soft)';
            (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
          }}
        >
          <span className="hidden sm:inline">Lihat CKP</span>
          <ArrowRight size={14} />
        </Link>

      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────
function StaffCardSkeleton() {
  return (
    <div className="activity-card p-5">
      <div className="flex items-center gap-4">
        <div className="skeleton w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-44 rounded" />
          <div className="skeleton h-3 w-32 rounded" />
        </div>
        <div className="hidden md:flex flex-col gap-2">
          <div className="skeleton h-3 w-36 rounded" />
          <div className="skeleton h-3 w-28 rounded" />
        </div>
        <div className="skeleton w-24 h-9 rounded-xl flex-shrink-0" />
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function PimpinanPegawaiPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState('');

  const { data: usersData, isPending: queryPending, error: queryError, refetch } = useQuery({
    queryKey: ['pimpinan-pegawai'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      try {
        const queryPromise = supabase
          .from('users')
          .select('*')
          .eq('role', 'pegawai')
          .eq('is_active', true)
          .order('full_name')
          .abortSignal(controller.signal);

        const { data, error } = await Promise.race([
          queryPromise,
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Supabase request took too long')), 15000))
        ]);

        if (error) throw new Error(error.message);
        return data as User[] || [];
      } finally {
        clearTimeout(timeoutId);
      }
    },
    enabled: !!user && !authLoading,
    networkMode: 'always',
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Show previous cached data while background-refetching — prevents skeleton flash
    placeholderData: keepPreviousData,
  });

  // KEY FIX: Only show skeleton when there is genuinely NO data.
  // `usersData` is undefined before first successful fetch. Once fetched (even empty []),
  // data is defined — so we only skeleton on the very first load, never on refetch.
  const loading = authLoading || (usersData === undefined && queryPending);

  // Safe array alias for all downstream usage
  const users = usersData ?? [];

  // Failsafe: if genuinely stuck for > 15s after auth resolved, retry query (NOT hard reload)
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!authLoading && queryPending) {
      timeout = setTimeout(() => {
        console.warn('Failsafe triggered: retrying stuck query');
        void refetch();
      }, 15000);
    }
    return () => clearTimeout(timeout);
  }, [authLoading, queryPending, refetch]);

  // NOTE: visibilitychange refetch removed — RecoveryManager handles this globally
  //       by invalidating all queries when the tab becomes visible.

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

  const error = queryError ? queryError.message : null;

  if (error && !loading && users.length === 0) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-md mx-auto text-center py-24">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
            <WifiOff className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">Gagal Memuat Data</h3>
          <p className="text-sm text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="p-5 lg:p-8 space-y-6 animate-fade-in">

        {/* ── Page hero ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Direktori Pegawai
            </h2>
            <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              {users.length} pegawai aktif terdaftar
            </p>
          </div>

          {/* Search */}
          <div className="search-input" style={{ maxWidth: 300, width: '100%' }}>
            <Search size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <input
              type="search"
              placeholder="Cari nama, NIP, atau unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari pegawai"
              style={{ minWidth: 200 }}
            />
          </div>
        </div>

        {/* ── Results info bar ──────────────────────── */}
        {!loading && (
          <div className="flex items-center justify-between">
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{filteredUsers.length}</strong> dari {users.length} pegawai
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-[12px] font-medium"
                style={{ color: 'var(--primary)' }}
              >
                Hapus filter ×
              </button>
            )}
          </div>
        )}

        {/* ── Content ────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => <StaffCardSkeleton key={i} />)}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
            style={{ background: 'var(--card-bg)', border: '1px dashed var(--border)' }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
                 style={{ background: '#F1F5F9' }}>
              🔍
            </div>
            <p className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              Tidak ada pegawai ditemukan
            </p>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              Coba kata kunci yang berbeda.
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-4 btn-secondary text-[13px]"
              >
                Hapus pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((u, i) => (
              <StaffCard key={u.id} u={u} index={i} />
            ))}
          </div>
        )}

      </div>
    </>
  );
}
