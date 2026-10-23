'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Link2, ShieldAlert, XCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { approveIntegrationPairingAction } from '@/app/actions/integration';

function waktu(iso: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function PairClient({
  kode,
  status: statusAwal,
  expiresAt,
  initialError,
}: {
  kode: string;
  status: 'pending' | 'approved' | 'expired' | 'invalid';
  expiresAt: string;
  initialError: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(statusAwal);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);

  const setujui = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await approveIntegrationPairingAction(kode);
      if (!res.success) {
        setError(res.error || 'Gagal menyetujui pairing.');
        return;
      }
      setStatus('approved');
      toast.success(`CKP App terhubung sebagai ${res.nama || 'akun Anda'}.`);
      router.refresh();
      // Tab ini biasanya dibuka oleh CKP App; coba tutup otomatis.
      setTimeout(() => {
        try { window.close(); } catch { /* abaikan */ }
      }, 1200);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8">
        <div className="mx-auto max-w-xl">
          <div className="activity-card p-7 text-center">
            {status === 'pending' && (
              <>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--sand-subtle)] text-[var(--primary)]">
                  <Link2 className="h-7 w-7" />
                </span>
                <h1 className="mt-4 text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Hubungkan CKP App
                </h1>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  CKP App meminta izin mengirim CKP ke akun SIKAP Anda. Setujui hanya jika Anda
                  baru saja menekan <strong>Hubungkan SIKAP</strong> di CKP App.
                </p>
                <div className="mx-auto mt-5 w-fit rounded-xl px-5 py-3" style={{ background: 'var(--sand-subtle)' }}>
                  <p className="text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: 'var(--text-secondary)' }}>Kode pairing</p>
                  <p className="mt-1 font-mono text-[24px] font-extrabold tracking-[0.18em]" style={{ color: 'var(--text-primary)' }}>
                    {kode}
                  </p>
                  {expiresAt && (
                    <p className="mt-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      Berlaku sampai {waktu(expiresAt)}
                    </p>
                  )}
                </div>
                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12.5px] text-red-700">
                    {error}
                  </div>
                )}
                <Button className="mt-5 w-full" onClick={setujui} disabled={busy}>
                  {busy ? 'Menghubungkan…' : 'Setujui & hubungkan CKP App'}
                </Button>
                <p className="mt-3 flex items-start justify-center gap-1.5 text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Jangan setujui kode ini jika Anda tidak merasa memulai koneksi dari CKP App.
                </p>
              </>
            )}

            {status === 'approved' && (
              <>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h1 className="mt-4 text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  CKP App sudah terhubung
                </h1>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Kembali ke jendela CKP App. Koneksi akan selesai otomatis dalam beberapa detik.
                </p>
                <Button className="mt-5" variant="outline" onClick={() => { try { window.close(); } catch { /* abaikan */ } }}>
                  Tutup tab ini
                </Button>
              </>
            )}

            {(status === 'expired' || status === 'invalid') && (
              <>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-100 text-red-700">
                  <XCircle className="h-7 w-7" />
                </span>
                <h1 className="mt-4 text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Kode pairing tidak berlaku
                </h1>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Kode sudah kedaluwarsa atau tidak ditemukan. Buka CKP App → Profil &amp; rekan →
                  <strong> Hubungkan SIKAP</strong> untuk membuat kode baru.
                </p>
                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12.5px] text-red-700">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
