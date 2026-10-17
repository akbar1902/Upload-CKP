import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

/**
 * Halaman 404 — sebelumnya tidak ada, sehingga URL yang salah menampilkan
 * halaman bawaan Next yang polos dan tanpa jalan kembali ke aplikasi.
 */
export default function NotFound() {
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
          style={{ background: 'var(--primary-soft)' }}
        >
          <Compass className="h-7 w-7" style={{ color: 'var(--primary)' }} />
        </div>

        <p className="text-[40px] font-extrabold leading-none mb-2" style={{ color: 'var(--primary)' }}>
          404
        </p>
        <h1 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-[14px] mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.
        </p>

        <Link href="/" className="btn-primary text-[14px] inline-flex">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
