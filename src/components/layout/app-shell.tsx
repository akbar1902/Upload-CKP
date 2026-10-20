"use client";

import * as React from 'react';
import { Sidebar } from '@/components/layout/sidebar';

/**
 * Shell aplikasi yang dipakai semua halaman ber-layout (admin,
 * analitik, ketua_tim, pegawai, penilaian, pimpinan, rencana_kinerja).
 *
 * Sebelumnya setiap segmen punya file layout sendiri dengan isi yang
 * persis sama — 7 salinan dari 14 baris. Sekarang satu tempat,
 * sehingga perubahan shell berlaku di semua rute.
 *
 * Transisi perpindahan halaman TIDAK di sini: `PageTransition`
 * Diletakkan di root layout supaya tidak ter-unmount saat pindah
 * segmen (kalau di sini, promise View Transitions menggantung).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
