"use client";

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Label tujuan navigasi (exact + prefix). Prefix terpanjang yang menang.
const ROUTE_LABELS: Record<string, string> = {
  '/admin': 'Monitoring CKP',
  '/admin/pegawai': 'Data Pegawai',
  '/admin/rk/import': 'Import RK',
  '/admin/rk': 'Rencana Kinerja',
  '/admin/export-penilaian': 'Evaluasi Penilaian',
  '/admin/periode': 'Pengaturan Periode',
  '/admin/logs': 'Log Aktivitas',
  '/admin/monitoring-penilaian': 'Monitoring Penilaian',
  '/analitik': 'Analitik',
  '/pegawai/upload': 'Upload CKP',
  '/pegawai/evaluasi-penilaian': 'Evaluasi Penilaian',
  '/pegawai/ckp': 'Detail CKP',
  '/pegawai': 'Dashboard',
  '/ketua_tim/rk': 'Rincian RK',
  '/ketua_tim': 'Dashboard',
  '/penilaian': 'Penilaian',
  '/pimpinan/pegawai': 'Data Pegawai',
  '/pimpinan/approval': 'Approval',
  '/pimpinan/monitoring-penilaian': 'Monitoring Penilaian',
  '/pimpinan': 'Dashboard',
  '/rencana_kinerja': 'Rencana Kinerja',
};

function labelFor(path: string): string {
  if (ROUTE_LABELS[path]) return ROUTE_LABELS[path];
  let best = '';
  for (const key of Object.keys(ROUTE_LABELS)) {
    if (path.startsWith(key) && key.length > best.length) best = key;
  }
  return best ? ROUTE_LABELS[best] : '';
}

/**
 * Overlay transisi antar halaman: konten lama dibiarkan, ditimpa blur lembut
 * + pill "Memuat (tujuan)" — persis seperti feedback saat ganti filter bulan.
 * Muncul saat mengklik link internal, hilang saat pathname berubah.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const [pending, setPending] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pathname berubah → navigasi selesai → tutup overlay.
  useEffect(() => {
    setPending(null);
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as HTMLElement)?.closest?.('a') as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute('href') || '';
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        a.target === '_blank' ||
        a.hasAttribute('download')
      ) {
        return;
      }

      let dest: string;
      try {
        dest = new URL(href, window.location.href).pathname;
      } catch {
        return;
      }
      if (dest === pathname) return; // klik halaman yang sama

      const label =
        a.getAttribute('data-nav-label') ||
        labelFor(dest) ||
        (a.textContent || '').trim().slice(0, 40) ||
        'Halaman';

      setPending(label);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setPending(null), 8000);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pathname]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          key="route-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-y-0 right-0 left-0 z-40 flex items-start justify-center pt-[35vh] pointer-events-none lg:left-[var(--sikap-sidebar-w,260px)]"
          style={{
            background: 'var(--overlay-scrim)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <motion.div
            initial={{ y: -10, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-2.5"
            style={{
              background: 'var(--card-bg)',
              boxShadow: 'var(--neu-raised-sm)',
              border: '1px solid var(--border-soft)',
            }}
          >
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--primary)' }} />
            <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              Memuat {pending}…
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
