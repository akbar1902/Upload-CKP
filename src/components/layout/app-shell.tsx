"use client";

import * as React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { RouteTransition } from '@/components/layout/route-transition';

/**
 * Shell aplikasi yang dipakai semua halaman ber-layout (admin,
 * analitik, ketua_tim, pegawai, penilaian, pimpinan, rencana_kinerja).
 *
 * Sebelumnya setiap segmen punya file layout sendiri dengan isi yang
 * persis sama — 7 salinan dari 14 baris. Sekarang satu tempat,
 * sehingga perubahan shell berlaku di semua rute.
 *
 * Catatan transisi: TIDAK ada animasi halaman tambahan di sini.
 * Setiap halaman sudah punya `animate-fade-in` pada wrapper-nya, dan
 * itu otomatis berjalan tiap kali segmen baru di-mount. Menambah
 * animasi kedua (mis. WAAPI di seluruh subtree) bikin perpindahan
 * menu terasa "patah" — dua efek berebut di layar yang sama.
 * Transisi "sedang pindah" ditangani `RouteTransition` (scrim + pill).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <RouteTransition />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
