"use client";

import * as React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { RouteTransition } from '@/components/layout/route-transition';
import { PageTransition } from '@/components/layout/page-transition';

/**
 * Shell aplikasi yang dipakai semua halaman ber-layout (admin,
 * analitik, ketua_tim, pegawai, penilaian, pimpinan, rencana_kinerja).
 *
 * Sebelumnya setiap segmen punya file layout sendiri dengan isi yang
 * persis sama — 7 salinan dari 14 baris. Sekarang satu tempat,
 * sehingga perubahan shell (mis. transisi halaman) langsung berlaku
 * di semua rute.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <RouteTransition />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
