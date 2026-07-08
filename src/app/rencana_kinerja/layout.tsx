"use client";

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';

export default function RencanaKinerjaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
