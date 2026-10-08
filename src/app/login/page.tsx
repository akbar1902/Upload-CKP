"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { requestPasswordResetAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, ArrowLeft, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Lupa Password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  const supabase = useMemo(() => createClient(), []);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

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

      // Sukses: JANGAN redirect manual di sini — useEffect di atas yang
      // redirect berdasarkan role dari database (cover admin/pimpinan/
      // ketua_tim/pegawai). Redirect manual pakai user_metadata bisa salah
      // role dan bikin loading nyangkut kalau navigasi lambat.
    } catch {
      setError('Terjadi kesalahan yang tidak terduga.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    const email = resetEmail.trim();
    if (!email) {
      setResetError('Masukkan email Anda terlebih dahulu.');
      return;
    }

    setResetLoading(true);

    try {
      const res = await requestPasswordResetAction(email);

      if (!res.success) {
        setResetError(res.error || 'Terjadi kesalahan.');
      } else {
        // Pesan netral: tidak membocorkan apakah email terdaftar.
        setResetSuccess(true);
      }
    } catch {
      setResetError('Terjadi kesalahan yang tidak terduga.');
    } finally {
      setResetLoading(false);
    }
  };

  const primaryColor = 'var(--primary)'; // Selaras token tema (light/dark)

  return (
    <div className="h-screen overflow-hidden flex bg-[#FAFAF5] dark:bg-[var(--bg-secondary)]">

      {/* ═══════════════════════════════════════════════ */}
      {/*  Left — Login Form                             */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative z-10">

        {/* Login Card */}
        <div className="w-full max-w-[440px] rounded-[32px] p-8 flex flex-col relative z-10 bg-white border border-[#EDE8DF] shadow-[0_28px_70px_-32px_rgba(45,80,60,0.30)] dark:bg-[var(--card-bg)] dark:border-[var(--border)]">

          <div className="flex-1 flex flex-col justify-center">
            {resetSuccess ? (
              /* ── Success State (netral, anti-enumeration) ── */
              <div className="flex flex-col items-center justify-center py-4 animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[var(--primary-soft)] ">
                  <CheckCircle2 className="h-8 w-8" style={{ color: primaryColor }} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-[var(--text-primary)]">
                  Cek Email Anda
                </h3>
                <p className="text-[14px] max-w-sm mb-3 text-[var(--text-secondary)]">
                  Jika <span className="font-semibold text-[var(--text-primary)]">{resetEmail}</span> terdaftar,
                  kami telah mengirim tautan untuk mengatur ulang password.
                </p>
                <p className="text-[13px] max-w-sm mb-8 text-[var(--text-tertiary)]">
                  Buka tautan pada email tersebut, lalu buat password baru Anda.
                  Jangan lupa periksa folder spam jika email tidak muncul.
                </p>
                <Button
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetSuccess(false);
                    setResetEmail('');
                  }}
                  className="w-full h-12 rounded-xl font-semibold"
                  style={{ backgroundColor: primaryColor }}
                >
                  Kembali ke Halaman Login
                </Button>
              </div>

            ) : isForgotPassword ? (
              /* ── Forgot Password Form ──────────── */
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <div className="mx-auto flex justify-center mb-4">
                    <Logo size={110} className="drop-shadow-sm" darkSrc="/SIKAP-text-and-tagline-beige.svg" />
                  </div>
                  <h2 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
                    Lupa Password?
                  </h2>
                  <p className="text-[14px] text-[var(--text-secondary)]">
                    Masukkan email Anda. Kami akan mengirim tautan untuk mengatur ulang password.
                  </p>
                </div>

                {resetError && (
                  <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl animate-fade-in bg-[var(--danger-soft)] border border-[var(--danger-soft)]">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--danger)]" />
                    <p className="text-[13px] font-medium text-[var(--danger-text)]">{resetError}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label htmlFor="reset-email" className="block text-[13px] font-bold mb-2 text-[var(--text-primary)]">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                        <Mail className="h-5 w-5" />
                      </div>
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="nama@bps.go.id"
                        required
                        autoFocus
                        className="login-input pl-12 h-12 py-2 border border-[var(--border)] focus:border-[var(--primary)] rounded-xl text-[14px] font-medium shadow-sm placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button
                      type="submit"
                      loading={resetLoading}
                      className="w-full h-12 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Kirim Tautan Reset
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsForgotPassword(false)}
                      className="w-full h-12 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl font-medium"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Kembali ke Login
                    </Button>
                  </div>
                </form>
              </div>

            ) : (
              /* ── Normal Login Form ─────────────── */
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
                    <label htmlFor="email" className="block text-[13px] font-bold mb-2 text-[#1C2520] text-[var(--text-secondary)]">
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
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-[13px] font-bold text-[#1C2520] text-[var(--text-secondary)]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setResetError('');
                          setResetEmail(email);
                        }}
                        className="text-[12px] font-bold transition-colors hover:opacity-80"
                        style={{ color: primaryColor }}
                      >
                        Lupa Password?
                      </button>
                    </div>
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
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full h-12 py-2 mt-2 rounded-xl font-bold text-[15px] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-[var(--primary-ring)]"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <LogIn className="h-5 w-5" />
                    Masuk
                  </Button>
                </form>
              </div>
            )}
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
          <div
            aria-hidden="true"
            className="absolute select-none pointer-events-none"
            style={{
              height: '61.5cqh',
              aspectRatio: '1358 / 1920',
              right: '9.5cqw',
              top: '11.8cqh',
              backgroundColor: 'var(--text-primary)',
              WebkitMaskImage: 'url(/login-figure.png)',
              maskImage: 'url(/login-figure.png)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          />
          <p
            className="absolute"
            style={{
              left: '6.5cqw',
              bottom: '5cqh',
              fontSize: '4.5cqw',
              lineHeight: 1.5,
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}
          >
            CKP sudah diupload,<br />
            Hati <span className="italic" style={{ fontWeight: 700 }}>Tenang</span>
          </p>
        </div>
      </aside>
    </div>
  );
}
