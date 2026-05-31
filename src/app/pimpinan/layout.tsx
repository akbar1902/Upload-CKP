"use client";

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';

export default function PimpinanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
