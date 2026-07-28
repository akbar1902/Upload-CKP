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
      } else if (user.role === 'admin') {
        router.replace('/admin');
      } else if (user.role === 'pimpinan') {
        router.replace('/pimpinan');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
