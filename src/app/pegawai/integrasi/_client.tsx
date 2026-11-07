'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Copy,
  ExternalLink,
  FilePlus2,
  KeyRound,
  Link2,
  MonitorSmartphone,
  Package,
  Puzzle,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  createIntegrationTokenAction,
  listIntegrationTokensAction,
  revokeIntegrationTokenAction,
  type IntegrationTokenRow,
} from '@/app/actions/integration';
import { DailyFlow, DownloadSection, ExtensionGuide, SectionHeading, StepGuide } from './_guide';
import { BuatCkpGuide, CompanionGuide, KipappGuide, PanduanFaq, alurBulanan } from './_panduan';

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

const heroSteps = alurBulanan;

function HeroFlow() {
  return (
    <div
      className="relative rounded-3xl border p-4 shadow-[var(--shadow-card)] sm:p-5"
      style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Alur tiap bulan
        </p>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold"
          style={{ background: 'var(--success-soft)', color: 'var(--success-text)' }}
        >
          Tanpa instal aplikasi
        </span>
      </div>

      <ol className="mt-4">
        {heroSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.title} className="relative flex gap-3 pb-4 last:pb-0">
              {index < heroSteps.length - 1 && (
                <span
                  className="absolute bottom-0 left-4 top-8 w-px"
                  style={{ background: 'var(--border)' }}
                  aria-hidden="true"
                />
              )}
              <span
                className="relative z-10 grid size-8 shrink-0 place-items-center rounded-xl"
                style={{
                  background: index === heroSteps.length - 1 ? 'var(--primary)' : 'var(--primary-soft)',
                  color: index === heroSteps.length - 1 ? 'var(--on-primary)' : 'var(--primary)',
                }}
                aria-hidden="true"
              >
                <Icon size={15} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[12.5px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {step.title}
                </p>
                <p className="text-[10.5px] leading-tight" style={{ color: 'var(--text-secondary)' }}>
                  {step.detail}
                </p>
              </div>
              {index === heroSteps.length - 1 && (
                <CheckCircle2
                  size={16}
                  className="ml-auto mt-1 shrink-0"
                  style={{ color: 'var(--success)' }}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      <div
        className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-[10.5px] font-medium"
        style={{ background: 'var(--sand-subtle)', color: 'var(--text-secondary)' }}
      >
        <ShieldCheck size={13} style={{ color: 'var(--primary)' }} />
        Foto tersimpan di Google Drive Anda sendiri
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden rounded-[26px] border"
      style={{
        borderColor: 'var(--border)',
        background:
          'linear-gradient(125deg, var(--card-bg) 0%, var(--sand-subtle) 58%, var(--primary-soft) 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full blur-3xl"
        style={{ background: 'var(--primary-soft)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 size-64 rounded-full blur-3xl"
        style={{ background: 'var(--accent-soft)' }}
        aria-hidden="true"
      />

      <div className="relative grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.18fr)_minmax(290px,0.82fr)] lg:items-center lg:p-9">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] font-bold"
            style={{
              borderColor: 'var(--primary-ring)',
              background: 'var(--card-bg)',
              color: 'var(--primary)',
            }}
          >
            <Sparkles size={12} />
            Panduan CKP bulanan
          </span>

          <h2
            className="mt-3 max-w-2xl text-[27px] font-extrabold leading-[1.08] tracking-tight sm:text-[34px]"
            style={{ color: 'var(--text-primary)' }}
          >
            Dari foto bukti dukung sampai KipApp terisi.
          </h2>
          <p
            className="mt-3 max-w-xl text-[13px] leading-relaxed sm:text-[13.5px]"
            style={{ color: 'var(--text-secondary)' }}
          >
            Susun dan submit CKP langsung di SIKAP, lalu biarkan CKP Companion mengisi KipApp untuk Anda.
            Cukup browser Chrome dan akun Google pribadi.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Link href="/pegawai/buat-ckp" className={buttonVariants({ variant: 'default', size: 'default' })}>
              <FilePlus2 size={16} /> Buat CKP sekarang
            </Link>
            <a href="#companion" className={buttonVariants({ variant: 'outline', size: 'default' })}>
              <Puzzle size={15} /> Pasang CKP Companion
            </a>
          </div>

          <div
            className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <span>3 langkah</span>
            <span className="hidden h-3 w-px sm:block" style={{ background: 'var(--border)' }} aria-hidden="true" />
            <span>Extension dipasang sekali</span>
            <span className="hidden h-3 w-px sm:block" style={{ background: 'var(--border)' }} aria-hidden="true" />
            <span>Google Chrome</span>
          </div>

          <p className="mt-4 text-[11.5px]" style={{ color: 'var(--text-secondary)' }}>
            Masih memakai CKP App di laptop?{' '}
            <a href="#cara-lama" className="font-semibold underline underline-offset-2" style={{ color: 'var(--primary)' }}>
              Lihat panduan cara lama
            </a>
            .
          </p>
        </div>

        <HeroFlow />
      </div>
    </section>
  );
}

function QuickNav() {
  const items = [
    { href: '#buat-ckp', label: '1 · Buat CKP', icon: FilePlus2 },
    { href: '#companion', label: '2 · Pasang Companion', icon: Puzzle },
    { href: '#kipapp', label: '3 · Isi KipApp', icon: Send },
    { href: '#hubungkan', label: 'Akses terhubung', icon: Link2 },
    { href: '#faq', label: 'Pertanyaan umum', icon: CircleHelp },
  ];

  return (
    <nav aria-label="Lompat ke bagian halaman" className="flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-colors hover:bg-[var(--sand-subtle)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--card-bg)' }}
          >
            <Icon size={13} style={{ color: 'var(--primary)' }} />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
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

  const alamatSikap = origin || 'https://sikap.bps.go.id';
  const activeTokens = tokens.filter((token) => !token.revoked_at);
  const revokedTokens = tokens.filter((token) => token.revoked_at);
  const lastUsedAt = activeTokens.reduce<string | null>((latest, token) => {
    if (!token.last_used_at) return latest;
    if (!latest) return token.last_used_at;
    return new Date(token.last_used_at).getTime() > new Date(latest).getTime()
      ? token.last_used_at
      : latest;
  }, null);

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
    if (!window.confirm(`Cabut akses “${token.name}”? CKP App yang memakainya akan langsung ditolak.`)) return;
    setBusy(true);
    try {
      const res = await revokeIntegrationTokenAction(token.id);
      if (!res.success) {
        toast.error(res.error || 'Gagal mencabut token.');
        return;
      }
      toast.success('Akses perangkat dicabut.');
      await muatUlang();
    } finally {
      setBusy(false);
    }
  };

  const salin = async (teks: string, pesan = 'Disalin.') => {
    try {
      await navigator.clipboard.writeText(teks);
      toast.success(pesan);
    } catch {
      try {
        const area = document.createElement('textarea');
        area.value = teks;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
        toast.success(pesan);
      } catch {
        toast.error('Gagal menyalin. Salin manual dari kotak yang tersedia.');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="page-enter mx-auto w-full max-w-[1180px] space-y-8 p-4 sm:p-6 lg:p-8">
        <Hero />
        <QuickNav />

        <BuatCkpGuide />
        <CompanionGuide />
        <KipappGuide />

        <section id="hubungkan" className="scroll-mt-28 space-y-4">
          <SectionHeading
            eyebrow="Keamanan"
            title="Aplikasi yang terhubung ke akun Anda"
            description="CKP Companion dan CKP App memakai akses (token) atas nama Anda. Akses muncul di sini setelah Anda klik Setujui & hubungkan, dan bisa dicabut kapan saja."
          />

          {error && (
            <div
              className="rounded-2xl border px-4 py-3 text-[12.5px]"
              style={{ borderColor: 'var(--danger)', background: 'var(--danger-soft)', color: 'var(--danger-text)' }}
            >
              {error}
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div className="activity-card p-5 sm:p-6" style={{ transform: 'none' }}>
              <div
                className="flex flex-col gap-3 rounded-2xl border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                style={{
                  borderColor: activeTokens.length > 0 ? 'var(--success)' : 'var(--border)',
                  background: activeTokens.length > 0 ? 'var(--success-soft)' : 'var(--sand-subtle)',
                }}
              >
                <div className="flex items-start gap-2.5">
                  {activeTokens.length > 0 ? (
                    <CheckCircle2 size={19} className="mt-0.5 shrink-0" style={{ color: 'var(--success-text)' }} />
                  ) : (
                    <MonitorSmartphone size={19} className="mt-0.5 shrink-0" style={{ color: 'var(--text-secondary)' }} />
                  )}
                  <div>
                    <p
                      className="text-[13px] font-bold"
                      style={{ color: activeTokens.length > 0 ? 'var(--success-text)' : 'var(--text-primary)' }}
                    >
                      {activeTokens.length > 0 ? 'Aplikasi sudah terhubung' : 'Belum ada aplikasi terhubung'}
                    </p>
                    <p
                      className="mt-0.5 text-[11.5px] leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {activeTokens.length > 0
                        ? `${activeTokens.length} perangkat aktif · terakhir dipakai ${lastUsedAt ? tanggal(lastUsedAt) : 'belum pernah'}`
                        : 'Akses muncul otomatis di sini setelah Anda klik Hubungkan SIKAP di CKP Companion (Langkah 3) lalu menyetujuinya.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={muatUlang}
                  disabled={loadingList}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-[var(--card-bg)] disabled:opacity-50"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'transparent' }}
                >
                  <RefreshCw size={12} className={loadingList ? 'animate-spin' : ''} />
                  Muat ulang
                </button>
              </div>

              <details
                className="group mt-4 rounded-2xl border px-3.5 py-3"
                style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
              >
                <summary
                  className="flex cursor-pointer list-none items-center gap-2 rounded-md text-[12px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Package size={14} style={{ color: 'var(--text-tertiary)' }} />
                  <span className="min-w-0 flex-1">Menghubungkan CKP App lama</span>
                  <ChevronDown
                    size={14}
                    className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                    style={{ color: 'var(--text-tertiary)' }}
                    aria-hidden="true"
                  />
                </summary>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                {[
                  {
                    n: '1',
                    title: 'Buka CKP App',
                    detail: 'Jalankan Jalankan CKP.bat sampai browser terbuka.',
                  },
                  {
                    n: '2',
                    title: 'Klik Hubungkan',
                    detail: 'Profil & rekan → pilih profil → Integrasi SIKAP → Hubungkan SIKAP.',
                  },
                  {
                    n: '3',
                    title: 'Setujui di SIKAP',
                    detail: 'Tab SIKAP terbuka. Klik Setujui & hubungkan.',
                  },
                ].map((item) => (
                  <div
                    key={item.n}
                    className="rounded-xl border p-3"
                    style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
                  >
                    <span
                      className="grid size-6 place-items-center rounded-full text-[10px] font-extrabold"
                      style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}
                      aria-hidden="true"
                    >
                      {item.n}
                    </span>
                    <p className="mt-2 text-[11.5px] font-bold" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[10.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 rounded-2xl border p-3.5"
                style={{ borderColor: 'var(--border)', background: 'var(--sand-subtle)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Alamat SIKAP
                  </p>
                  <button
                    type="button"
                    onClick={() => salin(alamatSikap, 'Alamat SIKAP disalin.')}
                    className="inline-flex items-center gap-1 text-[10.5px] font-semibold"
                    style={{ color: 'var(--primary)' }}
                  >
                    <Copy size={11} /> Salin
                  </button>
                </div>
                <code
                  className="mt-1.5 block break-all font-mono text-[12px]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {alamatSikap}
                </code>
                <p className="mt-1.5 text-[10.5px]" style={{ color: 'var(--text-tertiary)' }}>
                  Tempel di kolom Alamat SIKAP pada kartu Integrasi SIKAP di CKP App.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="http://localhost:3230"
                  target="_blank"
                  rel="noreferrer noopener"
                  className={buttonVariants({ variant: 'default', size: 'sm' })}
                >
                  Buka CKP App <ExternalLink size={13} />
                </a>
                <button
                  type="button"
                  onClick={() => salin(alamatSikap, 'Alamat SIKAP disalin.')}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                >
                  <Copy size={13} /> Salin alamat SIKAP
                </button>
              </div>
              <p className="mt-2 text-[10.5px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                Tombol Buka CKP App memakai alamat default <code className="font-mono text-[10px]">localhost:3230</code>.
                Kalau port diubah, buka alamat yang tercetak di jendela hitam CKP App. Jalankan{' '}
                <strong>Jalankan CKP.bat</strong> terlebih dahulu jika CKP App belum berjalan.
              </p>
              </details>

              <details
                className="group mt-5 rounded-2xl border px-3.5 py-3"
                style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
              >
                <summary
                  className="flex cursor-pointer list-none items-center gap-2 rounded-md text-[12px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <KeyRound size={14} style={{ color: 'var(--text-tertiary)' }} />
                  <span className="min-w-0 flex-1">Koneksi manual (opsional) — buat token</span>
                  <ChevronDown
                    size={14}
                    className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                    style={{ color: 'var(--text-tertiary)' }}
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-2 text-[11.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Gunakan hanya bila satu klik Hubungkan SIKAP tidak bisa. Token hanya ditampilkan sekali; tempel di
                  CKP App → Profil &amp; rekan → opsi token manual.
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    maxLength={80}
                    placeholder="Nama token, mis. CKP App — laptop saya"
                    aria-label="Nama token integrasi"
                    autoComplete="off"
                    className="min-w-0 flex-1 rounded-xl border px-3.5 py-2.5 text-[12.5px] outline-none focus:shadow-[0_0_0_4px_var(--primary-ring)]"
                    style={{
                      background: 'var(--card-bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Button onClick={buatToken} disabled={busy || !nama.trim()} size="sm">
                    {busy ? 'Memproses…' : 'Buat token'}
                  </Button>
                </div>

                {tokenBaru && (
                  <div
                    className="mt-3 rounded-xl border p-3.5"
                    style={{ borderColor: 'var(--warning)', background: 'var(--warning-soft)' }}
                  >
                    <div
                      className="flex items-center gap-2 text-[12px] font-bold"
                      style={{ color: 'var(--warning-text)' }}
                    >
                      <ShieldCheck size={14} /> Salin token ini sekarang
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--warning-text)' }}>
                      Token hanya ditampilkan sekali dan tidak bisa dilihat lagi setelah halaman ditutup.
                    </p>
                    <div className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <code
                        className="min-w-0 flex-1 break-all rounded-lg px-3 py-2 font-mono text-[11.5px]"
                        style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                      >
                        {tokenBaru}
                      </code>
                      <Button size="sm" variant="outline" onClick={() => salin(tokenBaru, 'Token disalin.')}>
                        <Copy size={13} /> Salin
                      </Button>
                    </div>
                  </div>
                )}
              </details>
            </div>

            <div className="space-y-4">
              <div className="activity-card p-5" style={{ transform: 'none' }}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.16em]"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      Keamanan akun
                    </p>
                    <h3 className="mt-0.5 text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                      Perangkat terhubung
                    </h3>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                    style={{
                      background: activeTokens.length > 0 ? 'var(--success-soft)' : 'var(--sand-subtle)',
                      color: activeTokens.length > 0 ? 'var(--success-text)' : 'var(--text-tertiary)',
                    }}
                  >
                    {activeTokens.length} aktif
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {activeTokens.length === 0 ? (
                    <div
                      className="rounded-xl border border-dashed px-4 py-5 text-center"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <MonitorSmartphone size={22} className="mx-auto" style={{ color: 'var(--text-tertiary)' }} />
                      <p className="mt-2 text-[11.5px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Belum ada perangkat
                      </p>
                      <p className="mt-0.5 text-[10.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Ikuti Langkah 3 di atas, lalu muat ulang halaman ini.
                      </p>
                    </div>
                  ) : (
                    activeTokens.map((token) => (
                      <div
                        key={token.id}
                        className="rounded-xl border p-3"
                        style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg"
                            style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}
                          >
                            <MonitorSmartphone size={13} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate text-[12px] font-semibold"
                              style={{ color: 'var(--text-primary)' }}
                              title={token.name}
                            >
                              {token.name}
                            </p>
                            <p className="font-mono text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                              {token.token_prefix}…
                            </p>
                          </div>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            title="Cabut akses perangkat"
                            aria-label={`Cabut akses ${token.name}`}
                            onClick={() => cabut(token)}
                            disabled={busy}
                          >
                            <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                          </Button>
                        </div>
                        <div
                          className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 border-t pt-2 text-[10px]"
                          style={{ borderColor: 'var(--border-soft)', color: 'var(--text-tertiary)' }}
                        >
                          <span>Dibuat {tanggal(token.created_at)}</span>
                          <span>
                            {token.last_used_at ? `Dipakai ${tanggal(token.last_used_at)}` : 'Belum pernah dipakai'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {revokedTokens.length > 0 && (
                  <details className="mt-3">
                    <summary
                      className="cursor-pointer rounded text-[10.5px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)]"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      Riwayat perangkat dicabut ({revokedTokens.length})
                    </summary>
                    <div className="mt-2 space-y-1.5">
                      {revokedTokens.map((token) => (
                        <div
                          key={token.id}
                          className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[10.5px]"
                          style={{ background: 'var(--sand-subtle)', color: 'var(--text-tertiary)' }}
                        >
                          <span className="truncate">{token.name}</span>
                          <span className="shrink-0">dicabut {tanggal(token.revoked_at)}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>

              <div
                className="rounded-2xl border px-4 py-3.5 text-[11px] leading-relaxed"
                style={{ borderColor: 'var(--border)', background: 'var(--sand-subtle)', color: 'var(--text-secondary)' }}
              >
                <div className="flex items-center gap-2 text-[11.5px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--primary)' }} /> Token mewakili akun Anda
                </div>
                <p className="mt-1.5">
                  Jangan bagikan token. Jika laptop dipakai bergantian, putuskan sambungan SIKAP di CKP Companion
                  setelah selesai. Cabut akses di sini jika laptop hilang atau token bocor.
                </p>
              </div>
            </div>
          </div>
        </section>

        <PanduanFaq />

        <details
          id="cara-lama"
          className="group scroll-mt-28 rounded-[22px] border px-4 py-4 sm:px-6"
          style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
        >
          <summary
            className="flex cursor-pointer list-none items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)]"
          >
            <Package size={18} style={{ color: 'var(--text-tertiary)' }} />
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Cara lama: CKP App di laptop
              </span>
              <span className="block text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                Hanya untuk yang masih memakai CKP App selama masa transisi.
              </span>
            </span>
            <ChevronDown
              size={18}
              className="shrink-0 transition-transform duration-200 group-open:rotate-180"
              style={{ color: 'var(--text-tertiary)' }}
              aria-hidden="true"
            />
          </summary>
          <div className="mt-6 space-y-8">
            <DownloadSection />
            <StepGuide origin={origin} />
            <DailyFlow />
            <ExtensionGuide />
          </div>
        </details>

        <footer
          className="flex flex-col gap-1.5 border-t pt-5 text-[11px]"
          style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}
        >
          <p>
            <strong style={{ color: 'var(--text-secondary)' }}>All in CKP App</strong> · paket CKP App v1.1.0 ·
            Node.js LTS
          </p>
          <p>
            Butuh bantuan lain? Hubungi pengelola SIKAP di kantor Anda, atau buka{' '}
            <code className="font-mono text-[10.5px]">BACA-DULU.txt</code> di folder CKP App.
          </p>
        </footer>
      </div>
    </>
  );
}
