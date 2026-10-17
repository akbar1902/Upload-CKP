import Link from 'next/link';
import { WifiOff, RefreshCw } from 'lucide-react';

/**
 * Halaman fallback offline (dipakai next-pwa lewat `fallbacks`).
 *
 * Saat koneksi terputus dan permintaan dokumen gagal, service worker
 * menyajikan halaman ini alih-alih layar error bawaan browser.
 */
export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div
        className="w-full max-w-md rounded-3xl p-8 text-center"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--warning-soft)' }}
        >
          <WifiOff className="h-7 w-7" style={{ color: 'var(--warning)' }} />
        </div>

        <h1 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Koneksi Terputus
        </h1>
        <p className="text-[14px] mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Halaman ini membutuhkan koneksi internet. Periksa jaringan Anda, lalu coba lagi.
          Data yang sudah pernah dibuka umumnya masih bisa dilihat.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary text-[14px] inline-flex">
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Link>
        </div>
      </div>
    </div>
  );
}
