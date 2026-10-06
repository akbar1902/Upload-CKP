"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { resetPasswordDirectAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, ArrowLeft, Mail, Lock, CloudUpload, BarChart, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Lupa Password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
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

      // Sukses: JANGAN redirect manual di sini — useEffect di atas yang
      // redirect berdasarkan role dari database (cover admin/pimpinan/
      // ketua_tim/pegawai). Redirect manual pakai user_metadata bisa salah
      // role dan bikin loading nyangkut kalau navigasi lambat.
    } catch (err) {
      setError('Terjadi kesalahan yang tidak terduga.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);

    if (newPassword.length < 6) {
      setResetError('Password baru minimal 6 karakter.');
      setResetLoading(false);
      return;
    }

    try {
      const res = await resetPasswordDirectAction(resetEmail, newPassword);

      if (!res.success) {
        setResetError(res.error || 'Terjadi kesalahan.');
      } else {
        setResetSuccess(true);
      }
    } catch (err) {
      setResetError('Terjadi kesalahan yang tidak terduga.');
    } finally {
      setResetLoading(false);
    }
  };

  const primaryColor = 'var(--primary)'; // Selaras token tema (light/dark)

  return (
    <div
      className="h-screen overflow-hidden flex relative bg-[var(--bg-base)] dark:bg-[var(--bg-secondary)]"
    >
      <div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          background: `
            radial-gradient(circle at 12% 85%, rgba(15,118,110,.10), transparent 35%),
            linear-gradient(180deg, #F5F1EA 0%, #EFEAE2 55%, #E7E0D5 100%)
          `
        }}
      />
      {/* Subtle Pattern (fading out towards the right) */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(169,146,118,0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to right, black 30%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 80%)'
        }}
      />

      {/* ═══════════════════════════════════════════════ */}
      {/*  Left Panel — Modern Light Design             */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative">

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center py-8 w-full h-full max-w-[560px] ml-auto px-8 lg:pr-16 xl:pr-20">

          {/* Hero tagline */}
          <h2 className="text-[44px] font-extrabold text-[var(--text-primary)] leading-[1.15] tracking-tight mb-4">
            Rekap, Review,<br />
            dan Approval<br />
            <span style={{ color: primaryColor }}>Capaian Kinerja</span>
          </h2>
          <p className="text-[16px] text-[var(--text-secondary)] mb-12 font-medium">
            Semua dalam satu platform terintegrasi.
          </p>

          {/* Features */}
          <div className="space-y-6">
            {[
              { icon: CloudUpload, title: 'Upload CKP Bulanan', desc: 'Unggah file Excel CKP dengan mudah dan aman.' },
              { icon: BarChart, title: 'Dashboard Real-time', desc: 'Pantau progress capaian kinerja secara real-time.' },
              { icon: ShieldCheck, title: 'Workflow Approval', desc: 'Proses review dan approval lebih cepat dan transparan.' },
              { icon: Lock, title: 'Akses Bukti Dukung Langsung', desc: 'Sistem mempermudah untuk mengakses bukti dukung.' },
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 bg-[var(--primary-soft)]"
                  style={{ color: primaryColor }}>
                  <feat.icon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[var(--text-primary)] mb-0.5">{feat.title}</h4>
                  <p className="text-[13px] text-[var(--text-secondary)]">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  Right Panel — Login Form                      */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-transparent">

        {/* Login Card */}
        <div className="w-full max-w-[440px] neu-raised-lg rounded-[32px] p-8 flex flex-col relative z-10">

          <div className="flex-1 flex flex-col justify-center">
            {resetSuccess ? (
              /* ── Success State ──────────────────── */
              <div className="flex flex-col items-center justify-center py-4 animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[var(--primary-soft)] ">
                  <CheckCircle2 className="h-8 w-8" style={{ color: primaryColor }} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-[var(--text-primary)]">
                  Password Berhasil Diubah!
                </h3>
                <p className="text-[14px] max-w-sm mb-8 text-[var(--text-secondary)]">
                  Password untuk akun <span className="font-semibold text-[var(--text-primary)]">{resetEmail}</span> telah berhasil diubah. Silakan masuk menggunakan password baru Anda.
                </p>
                <Button
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetSuccess(false);
                    setResetEmail('');
                    setNewPassword('');
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
                    <Logo size={110} className="drop-shadow-sm dark:brightness-0 dark:invert" />
                  </div>
                  <h2 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
                    Lupa Password?
                  </h2>
                  <p className="text-[14px] text-[var(--text-secondary)]">
                    Masukkan email Anda untuk mereset password.
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
                        className="pl-12 h-12 py-2 bg-[var(--card-bg)] border border-[var(--border)] focus:border-[var(--primary)] rounded-xl text-[14px] font-medium shadow-sm placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-[13px] font-bold mb-2 text-[var(--text-primary)]">
                      Password Baru
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="pl-12 pr-12 h-12 py-2 bg-[var(--card-bg)] border border-[var(--border)] focus:border-[var(--primary)] rounded-xl text-[14px] font-medium shadow-sm placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button
                      type="submit"
                      loading={resetLoading}
                      className="w-full h-12 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Ubah Password
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
                    <Logo size={110} className="drop-shadow-sm dark:brightness-0 dark:invert" />
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
                        className="pl-12 h-12 py-2 bg-[var(--card-bg)] border border-[var(--border)] focus:border-[var(--primary)] rounded-xl text-[14px] font-medium shadow-sm placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] transition-all"
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
                        className="pl-12 pr-12 h-12 py-2 bg-[var(--card-bg)] border border-[var(--border)] focus:border-[var(--primary)] rounded-xl text-[14px] font-medium shadow-sm placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] transition-all"
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
    </div>
  );
}
