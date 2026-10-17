"use client";

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
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

/** Durasi animasi keluar (harus sama dengan durasi CSS `sikap-fade-out`). */
const EXIT_MS = 180;

/**
 * Overlay transisi antar halaman: konten lama dibiarkan, ditimpa blur lembut
 * + pill "Memuat (tujuan)" — persis seperti feedback saat ganti filter bulan.
 * Muncul saat mengklik link internal, hilang saat pathname berubah.
 *
 * Catatan performa: animasi memakai CSS (`sikap-*`), bukan framer-motion.
 * framer-motion dihapus dari bundle (~122 KB) karena hanya dipakai untuk
 * efek fade/pop sederhana seperti ini; tampilannya dibuat identik.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const [pending, setPending] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<string | null>(null);

  // Pathname berubah → navigasi selesai → mainkan animasi keluar lalu lepas.
  useEffect(() => {
    if (!pendingRef.current) return;
    setLeaving(true);
    const timer = setTimeout(() => {
      pendingRef.current = null;
      setPending(null);
      setLeaving(false);
    }, EXIT_MS);
    return () => clearTimeout(timer);
    // Sengaja hanya bergantung pada pathname: `pending` dibaca lewat ref agar
    // efek ini tidak ikut berjalan saat overlay baru muncul.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      pendingRef.current = label;
      setLeaving(false);
      setPending(label);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      safetyTimer.current = setTimeout(() => {
        pendingRef.current = null;
        setPending(null);
      }, 8000);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pathname]);

  useEffect(
    () => () => {
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    },
    []
  );

  if (!pending) return null;

  return (
    <div
      className={`fixed inset-y-0 right-0 left-0 z-40 flex items-start justify-center pt-[35vh] pointer-events-none lg:left-[var(--sikap-sidebar-w,260px)] ${leaving ? 'sikap-fade-out' : 'sikap-fade-in'}`}
      style={{
        background: 'var(--overlay-scrim)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 ${leaving ? 'sikap-pop-out' : 'sikap-pop-in'}`}
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
      </div>
    </div>
  );
}
