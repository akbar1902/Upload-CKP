import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { RouteTransition } from '@/components/layout/route-transition';

export default function RencanaKinerjaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <RouteTransition />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
