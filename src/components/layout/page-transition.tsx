"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Transisi perpindahan halaman.
 *
 * Dua bagian yang sengaja dipisah:
 *
 * 1. **Layar lama diburam** (scrim + `backdrop-filter: blur`) dengan
 *    pill "Memuat …" di TENGAH. Ini yang bikin perpindahan terasa
 *    mulus: Swap konten terjadi di balik kabut, jadi mata tidak
 *    pernah melihat lompatan. Efek ini persis seperti yang dipakai
 *    saat ganti filter bulan — jadi bahasa geraknya satu.
 *
 * 2. **Konten baru masuk dengan rise + fade** (kelas CSS
 *    `.page-enter` pada wrapper isi halaman). Ini motion-nya
 *    yang _terlihat_ — bukan cuma teks "Memuat" yang berubah.
 *
 * Catatan: efek rise TIDAK boleh dipasang pada elemen yang menjadi
 * induk `position: sticky` header — `transform` membuat header ikut
 * ter-scroll (sudah diverifikasi). Karena itu `.page-enter` hanya
 * dipakai pada wrapper ISI halaman, satu tingkat di bawah header.
 */

/** Label rute untuk pill "Memuat …". */
const ROUTE_LABELS: Record<string, string> = {
  '/admin': 'Monitoring CKP',
  '/admin/pegawai': 'Kepegawaian',
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
  '/pimpinan/approval': 'Persetujuan',
  '/pimpinan/monitoring-penilaian': 'Monitoring Penilaian',
  '/pimpinan': 'Dashboard',
  '/rencana_kinerja': 'Rencana Kinerja',
  '/analitik': 'Analitik',
};

function labelFor(path: string): string {
  if (ROUTE_LABELS[path]) return ROUTE_LABELS[path];
  let best = '';
  for (const key of Object.keys(ROUTE_LABELS)) {
    if (path.startsWith(key) && key.length > best.length) best = key;
  }
  return best ? ROUTE_LABELS[best] : 'Halaman';
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pending, setPending] = React.useState<string | null>(null);
  const [leaving, setLeaving] = React.useState(false);
  const pendingRef = React.useRef<string | null>(null);
  const safetyRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rute berubah → navigasi selesai → mainkan animasi keluar, lalu lepas.
  React.useEffect(() => {
    if (!pendingRef.current) return;
    setLeaving(true);
    const timer = setTimeout(() => {
      pendingRef.current = null;
      setPending(null);
      setLeaving(false);
    }, 180);
    return () => clearTimeout(timer);
    // Sengaja hanya bergantung pada pathname: `pending` dibaca lewat ref
    // supaya efek ini tidak ikut berjalan saat overlay baru muncul.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Deteksi klik link internal → tampilkan blur + pill.
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null;
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

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Halaman yang sama → tidak ada yang perlu dimuat.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      pendingRef.current = labelFor(url.pathname);
      setLeaving(false);
      setPending(pendingRef.current);

      // Jaring pengaman: kalau rute tak pernah sampai, blur tidak boleh
      // menggantung di layar.
      if (safetyRef.current) clearTimeout(safetyRef.current);
      safetyRef.current = setTimeout(() => {
        pendingRef.current = null;
        setPending(null);
        setLeaving(false);
      }, 8000);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  React.useEffect(
    () => () => {
      if (safetyRef.current) clearTimeout(safetyRef.current);
    },
    []
  );

  return (
    <>
      {children}

      {pending && (
        <div
          className={`fixed inset-y-0 right-0 left-0 z-[60] flex items-start justify-center pt-[35vh] pointer-events-none lg:left-[var(--sikap-sidebar-w,260px)] ${leaving ? 'sikap-fade-out' : 'sikap-fade-in'}`}
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
      )}
    </>
  );
}
