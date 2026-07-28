"use client";

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function PegawaiLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'ketua_tim') {
        router.replace('/pegawai'); // redirect unauthorized users
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ketua_tim') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
