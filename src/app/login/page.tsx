"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, LogIn, AlertCircle, Mail, Lock } from 'lucide-react';

/** 12 titik bulan untuk kalender di panel ilustrasi. */
const MONTH_TICKS = Array.from({ length: 12 }, (_, i) => i);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Bulan berjalan ditulis langsung ke DOM (bukan state React) supaya
  // HTML server dan client identik → tidak ada hydration mismatch.
  // Penanda bulan yang disorot sepenuhnya ditangani CSS lewat atribut ini.
  const calRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = calRef.current;
    if (el) el.dataset.nowMonth = String(new Date().getMonth());
  }, []);

  // Redirect jika sudah ada session aktif menurut useAuth
  useEffect(() => {
    if (!authLoading && user) {
      switch (user.role) {
        case 'admin':
          router.replace('/admin');
          break;
        case 'pimpinan':
          router.replace('/pimpinan');
          break;
        case 'ketua_tim':
          router.replace('/ketua_tim');
          break;
        default:
          router.replace('/pegawai');
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !data.user) {
        setError(
          signInError?.message.includes('Invalid')
            ? 'Email atau password salah. Silakan coba lagi.'
            : (signInError?.message ?? 'Login gagal. Silakan coba lagi.')
        );
        setLoading(false);
        return;
      }

      // Tandai sesi ini sebagai sesi aktif browser (SESSION cookie).
      // Hilang saat browser ditutup → pengguna wajib login lagi.
      if (typeof document !== 'undefined') {
        document.cookie = 'sikap-session=1; path=/; samesite=lax';
      }

      // Navigasi SEGERA memakai role dari metadata sesi (sudah diverifikasi
      // konsisten dengan role di database) supaya tidak perlu menunggu
      // pengambilan profil dari DB sebelum halaman tujuan dibuka — ini yang
      // membuat tombol "Masuk" terasa lama berputar.
      // Middleware tetap memvalidasi dan mengoreksi bila role ternyata berbeda.
      // Bila role tidak dikenali, biarkan useEffect di atas yang mengarahkan
      // setelah profil dari database termuat.
      const metaRole = data.user.user_metadata?.role as string | undefined;
      const roleRoutes: Record<string, Route> = {
        admin: '/admin',
        pimpinan: '/pimpinan',
        ketua_tim: '/ketua_tim',
        pegawai: '/pegawai',
        anggota: '/pegawai',
      };
      const targetRoute = metaRole ? roleRoutes[metaRole] : undefined;
      if (targetRoute) router.replace(targetRoute);
    } catch {
      setError('Terjadi kesalahan yang tidak terduga.');
      setLoading(false);
    }
  };

  const primaryColor = 'var(--primary)'; // Selaras token tema (light/dark)

  return (
    <div className="h-screen overflow-hidden flex bg-[var(--bg-base)] dark:bg-[var(--bg-secondary)]">

      {/* ═══════════════════════════════════════════════ */}
      {/*  Left — Login Form                             */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative z-10">

        {/* Login Card */}
        <div className="w-full max-w-[440px] rounded-[24px] p-8 flex flex-col relative z-10 bg-white border border-[var(--border)] shadow-[0_24px_60px_-28px_rgba(16,24,40,0.18)] dark:bg-[var(--card-bg)] dark:border-[var(--border)]">

          <div className="flex-1 flex flex-col justify-center">
            {/* ── Normal Login Form ─────────────── */}
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="mx-auto flex justify-center mb-4">
                  <Logo size={110} className="drop-shadow-sm" darkSrc="/SIKAP-text-and-tagline-beige.svg" />
                </div>
                <h2 className="text-[26px] font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
                  Selamat Datang
                </h2>
                <p className="text-[14px] text-[var(--text-secondary)]">
                  Masuk ke akun Anda untuk melanjutkan
                </p>
              </div>

              {error && (
                <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl animate-fade-in bg-[var(--danger-soft)] border border-[var(--danger-soft)]">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--danger)]" />
                  <p className="text-[13px] font-medium text-[var(--danger-text)]">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-[13px] font-bold mb-2 text-[var(--text-secondary)]">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@bps.go.id"
                      required
                      autoFocus
                      className="login-input pl-12 h-12 py-2 border border-[var(--border)] focus:border-[var(--primary)] rounded-xl text-[14px] font-medium shadow-sm placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-[13px] font-bold mb-2 text-[var(--text-secondary)]">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="login-input pl-12 pr-12 h-12 py-2 border border-[var(--border)] focus:border-[var(--primary)] rounded-xl text-[14px] font-medium shadow-sm placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-[12px] text-[var(--text-tertiary)]">
                    Lupa password? Hubungi Admin Kepegawaian untuk direset.
                  </p>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full h-12 py-2 mt-2 rounded-xl font-bold text-[15px] text-[var(--on-primary)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-[var(--primary-ring)]"
                  style={{ backgroundColor: primaryColor }}
                >
                  <LogIn className="h-5 w-5" />
                  Masuk
                </Button>
              </form>
            </div>
          </div>

          {/* Footer inside the card */}
          <div className="mt-6 text-center border-t border-[var(--border)] pt-6">
            <p className="text-[11px] text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)] font-medium">
              © {new Date().getFullYear()} BPS Kabupaten Belitung
            </p>
            <p className="text-[11px] mt-1 text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)] font-medium">
              Sistem Informasi Capaian Kinerja Pegawai
            </p>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  Right Panel — Illustration                    */}
      {/* ═══════════════════════════════════════════════ */}
      <aside
        className="hidden xl:flex items-center shrink-0"
        style={{ padding: '48px 60px 48px 0' }}
      >
        {/* Panel: rasio 728:714. Ukuran = yang lebih kecil antara 50.6% lebar layar
            dan (tinggi layar - 96px). Jadi di layar lebar/short panel isi tinggi,
            di layar kotak/tinggi panel dibatasi lebar & ke-center vertikal.
            Isi pakai container query unit (cqw/cqh) supaya selalu proporsional. */}
        <div
          className="login-panel relative shrink-0 overflow-hidden rounded-[32px]"
          style={{
            width: 'min(50.6vw, calc((100vh - 96px) * 1.0196))',
            aspectRatio: '728 / 714',
            containerType: 'size',
          }}
        >
          {/* Cahaya kertas di kiri-bawah: memberi "ruang baca" untuk
              tagline, dan membuat warna aksen bisa_used tanpa
              menurunkan kontras. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(52% 44% at 20% 86%, rgba(255,255,255,0.94), rgba(255,255,255,0) 72%)',
            }}
          />

          {/* Kalender 12 bulan — abstrak, bukan grafik.
              SIKAP bekerja per bulan, jadi lingkaran 12 titik bulan
              (satu disorot = bulan berjalan) adalah metafora yang
              jujur. Tipis, tenang, dan bergerak sedikit.
              SSR & client menghasilkan DOM yang identik; bulan yang
              disorot ditentukan CSS lewat `data-now-month`. */}
          <div ref={calRef} className="login-cal absolute pointer-events-none"
            style={{
              width: '78%',
              aspectRatio: '1',
              right: '-14%',
              top: '-9%',
            }}
          >
            <svg aria-hidden="true" viewBox="0 0 400 400" className="w-full h-full" style={{ overflow: 'visible' }}>
              <circle
                cx="200"
                cy="200"
                r="176"
                fill="none"
                stroke="var(--tagline-ink)"
                strokeOpacity="0.14"
                strokeWidth="1"
              />
              <circle
                cx="200"
                cy="200"
                r="142"
                fill="none"
                stroke="var(--tagline-ink)"
                strokeOpacity="0.08"
                strokeWidth="1"
                strokeDasharray="2 8"
              />
              {MONTH_TICKS.map((_, i) => {
                const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
                const x = 200 + Math.cos(a) * 176;
                const y = 200 + Math.sin(a) * 176;
                return (
                  <g key={i}>
                    <circle className={`mk mk-${i}`} cx={x} cy={y} r="3" />
                    <circle className={`mkpulse mkpulse-${i}`} cx={x} cy={y} r="13" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Tagline — display serif (DM Serif Display), satu blok
              berdiri sendiri. Palet: hijau hutan pekat (teks) +
              terakota (kata sorotan) + garis coral di atasnya. */}
          <div
            className="absolute"
            style={{
              left: '7cqw',
              bottom: '7.5cqh',
              fontFamily: 'var(--font-display)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'block',
                width: '3.2em',
                height: '3px',
                borderRadius: '999px',
                marginBottom: '0.5em',
                background: 'linear-gradient(90deg, var(--tagline-rule), transparent)',
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: '6.1cqw',
                lineHeight: 1.02,
                letterSpacing: '-0.012em',
                fontWeight: 400,
                color: 'var(--tagline-ink)',
              }}
            >
              CKP sudah
              <br />
              diunggah, Hati{' '}              <span
                style={{
                  fontStyle: 'italic',
                  color: 'var(--tagline-accent)',
                }}
              >
                Tenang
              </span>
              .
            </p>
          </div>

          {/* Alur 3 langkah — menjelaskan SIKAP dalam satu baris. */}
          <div
            className="absolute flex items-center"
            style={{
              left: '7cqw',
              bottom: '3.4cqh',
              gap: '1.1cqw',
              fontSize: '1.55cqw',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: 'var(--tagline-ink)',
              opacity: 0.52,
            }}
          >
            {['Unggah', 'Dinilai', 'Disetujui'].map((step, i) => (
              <React.Fragment key={step}>
                {i > 0 && (
                  <span aria-hidden="true" style={{ opacity: 0.5 }}>
                    ·
                  </span>
                )}
                <span>{step}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
