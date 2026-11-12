"use client";

import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

/**
 * Layar jeda antara halaman login dan dashboard.
 *
 * Setelah kredensial diterima, halaman tujuan tetap perlu satu perjalanan ke
 * server (proxy + render RSC + query data). Tanpa layar ini, form login diam
 * dengan spinner kecil lalu tiba-tiba berganti menjadi skeleton — terasa
 * "nge-hold". Handoff ini menutup jeda tersebut dengan latar dan logo yang
 * sama seperti halaman login, jadi perpindahannya terasa satu alur.
 */
export function LoginHandoff({ name }: { name?: string | null }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[var(--bg-base)] dark:bg-[var(--bg-secondary)] animate-fade-in"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Logo size={56} />

      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2.5">
          <Loader2
            className="h-4 w-4 animate-spin"
            style={{ color: 'var(--primary)' }}
            aria-hidden="true"
          />
          <span
            className="max-w-[80vw] text-center text-[13px] font-semibold"
            style={{ color: 'var(--text-secondary)' }}
          >
            {name ? `Menyiapkan dashboard untuk ${name}…` : 'Menyiapkan dashboard…'}
          </span>
        </div>

        <div
          className="relative h-1 w-48 overflow-hidden rounded-full"
          style={{ background: 'var(--border-soft)' }}
          aria-hidden="true"
        >
          <span
            className="sikap-bar-inner absolute inset-y-0 left-0 w-1/3 rounded-full"
            style={{ background: 'var(--primary)' }}
          />
        </div>
      </div>
    </div>
  );
}
