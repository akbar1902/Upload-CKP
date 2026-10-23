'use client';

import { useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';
import { Copy, KeyRound, Plug, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import {
  createIntegrationTokenAction,
  listIntegrationTokensAction,
  revokeIntegrationTokenAction,
  type IntegrationTokenRow,
} from '@/app/actions/integration';

function tanggal(value: string | null) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

export default function IntegrasiClient({
  initialTokens,
  initialError,
}: {
  initialTokens: IntegrationTokenRow[];
  initialError: string;
}) {
  const [tokens, setTokens] = useState<IntegrationTokenRow[]>(initialTokens);
  const [nama, setNama] = useState('CKP App — laptop saya');
  const [tokenBaru, setTokenBaru] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [loadingList, setLoadingList] = useState(false);
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => '',
  );

  const muatUlang = async () => {
    setLoadingList(true);
    try {
      const res = await listIntegrationTokensAction();
      if (!res.success) {
        setError(res.error || 'Gagal memuat token.');
        return;
      }
      setError('');
      setTokens(res.tokens || []);
    } finally {
      setLoadingList(false);
    }
  };

  const buatToken = async () => {
    setBusy(true);
    setTokenBaru('');
    try {
      const res = await createIntegrationTokenAction(nama);
      if (!res.success || !res.token) {
        toast.error(res.error || 'Gagal membuat token.');
        return;
      }
      setTokenBaru(res.token);
      toast.success('Token dibuat. Salin sekarang — tidak akan ditampilkan lagi.');
      await muatUlang();
    } finally {
      setBusy(false);
    }
  };

  const cabut = async (token: IntegrationTokenRow) => {
    if (!window.confirm(`Cabut token “${token.name}”? CKP App yang memakainya akan langsung ditolak.`)) return;
    setBusy(true);
    try {
      const res = await revokeIntegrationTokenAction(token.id);
      if (!res.success) {
        toast.error(res.error || 'Gagal mencabut token.');
        return;
      }
      toast.success('Token dicabut.');
      await muatUlang();
    } finally {
      setBusy(false);
    }
  };

  const salin = async (teks: string) => {
    try {
      await navigator.clipboard.writeText(teks);
      toast.success('Disalin.');
    } catch {
      toast.error('Gagal menyalin. Salin manual dari kotak token.');
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 space-y-6 page-enter">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Integrasi CKP App
            </h1>
            <p className="mt-1 max-w-2xl text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Hubungkan aplikasi CKP App di komputer Anda ke SIKAP. CKP yang disusun dari foto bukti
              dukung bisa langsung dikirim ke sini tanpa download-upload Excel manual.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={muatUlang} disabled={loadingList}>
            <RefreshCw className={`h-4 w-4 ${loadingList ? 'animate-spin' : ''}`} /> Muat ulang
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="activity-card p-6">
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-emerald-800">
                <ShieldCheck className="h-4 w-4" /> Cara termudah: satu klik
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-emerald-800">
                Buka CKP App → <strong>Profil &amp; rekan</strong> → <strong>Hubungkan SIKAP</strong>.
                Tab SIKAP akan terbuka untuk Anda setujui. Tidak perlu menyalin token.
                Token manual di bawah hanya untuk kebutuhan khusus.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--sand-subtle)] text-[var(--primary)]">
                <KeyRound className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Token integrasi
                </h2>
                <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Token ini mewakili akun Anda. Jangan bagikan ke orang lain atau tempel di komputer
                  bersama. Cabut segera jika laptop hilang / token bocor.
                </p>
              </div>
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer text-[12px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Opsi lanjutan: buat token manual
              </summary>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  maxLength={80}
                  placeholder="Nama token, mis. CKP App — laptop saya"
                  className="min-w-0 flex-1 rounded-xl border px-4 py-2.5 text-[13px] outline-none"
                  style={{
                    background: 'var(--card-bg)',
                    borderColor: 'var(--sand-border)',
                    color: 'var(--text-primary)',
                  }}
                />
                <Button onClick={buatToken} disabled={busy || !nama.trim()}>
                  {busy ? 'Memproses…' : 'Buat token manual'}
                </Button>
              </div>

              {tokenBaru && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-amber-800">
                    <ShieldCheck className="h-4 w-4" /> Salin token ini sekarang
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-amber-800">
                    Token hanya ditampilkan sekali. Tempel di CKP App → Profil &amp; rekan → opsi token manual.
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <code className="min-w-0 flex-1 break-all rounded-lg bg-white/80 px-3 py-2 font-mono text-[12px] text-amber-900">
                      {tokenBaru}
                    </code>
                    <Button size="sm" variant="outline" onClick={() => salin(tokenBaru)}>
                      <Copy className="h-4 w-4" /> Salin
                    </Button>
                  </div>
                </div>
              )}
            </details>

            <div className="mt-6 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-left text-[12.5px]">
                <thead style={{ background: 'var(--sand-subtle)' }}>
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nama</th>
                    <th className="px-4 py-3 font-semibold">Prefix</th>
                    <th className="px-4 py-3 font-semibold">Dibuat</th>
                    <th className="px-4 py-3 font-semibold">Terakhir dipakai</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {tokens.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center" style={{ color: 'var(--text-secondary)' }}>
                        Belum ada token. Token akan muncul otomatis setelah Anda menghubungkan CKP App.
                      </td>
                    </tr>
                  ) : (
                    tokens.map((token) => (
                      <tr key={token.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-medium">{token.name}</td>
                        <td className="px-4 py-3 font-mono text-[11.5px]">{token.token_prefix}…</td>
                        <td className="px-4 py-3">{tanggal(token.created_at)}</td>
                        <td className="px-4 py-3">{token.last_used_at ? tanggal(token.last_used_at) : 'Belum dipakai'}</td>
                        <td className="px-4 py-3">
                          {token.revoked_at ? (
                            <span className="rounded-full bg-red-100 px-2 py-1 text-[11px] font-semibold text-red-700">
                              Dicabut
                            </span>
                          ) : (
                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                              Aktif
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {!token.revoked_at && (
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              title="Cabut token"
                              onClick={() => cabut(token)}
                              disabled={busy}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="activity-card h-fit p-6">
            <div className="flex items-center gap-2">
              <Plug className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Cara menghubungkan
              </h2>
            </div>
            <ol className="mt-4 space-y-3 text-[12.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <li>
                <span className="font-semibold text-[var(--text-primary)]">1.</span> Buat token di halaman ini, lalu salin.
              </li>
              <li>
                <span className="font-semibold text-[var(--text-primary)]">2.</span> Buka CKP App →{' '}
                <span className="font-semibold">Profil &amp; rekan</span> → kartu{' '}
                <span className="font-semibold">Integrasi SIKAP</span>.
              </li>
              <li>
                <span className="font-semibold text-[var(--text-primary)]">3.</span> Isi alamat SIKAP dan tempel token, lalu klik{' '}
                <span className="font-semibold">Uji koneksi</span>.
              </li>
              <li>
                <span className="font-semibold text-[var(--text-primary)]">4.</span> Klik{' '}
                <span className="font-semibold">Tarik RK dari SIKAP</span> agar daftar RK CKP App sama dengan SIKAP.
              </li>
            </ol>
            <div className="mt-4 rounded-xl px-3.5 py-3 text-[12px]" style={{ background: 'var(--sand-subtle)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Alamat SIKAP yang dipakai:</p>
              <code className="mt-1 block break-all font-mono text-[11.5px]" style={{ color: 'var(--text-primary)' }}>
                {origin || 'https://sikap.bps.go.id'}
              </code>
            </div>
            <p className="mt-4 text-[11.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Endpoint integrasi: <code className="font-mono">/api/integrations/ckp-app</code>.
              Token disimpan sebagai hash; SIKAP tidak bisa menampilkan ulang token Anda.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
