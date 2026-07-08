"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { resetPasswordDirectAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, LogIn, AlertCircle, KeyRound, CheckCircle2, ArrowLeft, Zap } from 'lucide-react';

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
  const router = useRouter();

  // Redirect jika sudah ada session aktif
  useEffect(() => {
    const checkSession = async () => {
      const result = await supabase.auth.getUser();
      const user = result.data?.user;
      if (user) {
        const role = user.user_metadata?.role as string | undefined;
        router.replace(role === 'pimpinan' || role === 'admin' ? '/pimpinan' : '/pegawai');
      }
    };
    checkSession();
  }, [supabase, router]);

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
        return;
      }

      // Redirect berdasarkan role dari metadata
      const role = data.user.user_metadata?.role;
      router.replace(role === 'pimpinan' || role === 'admin' ? '/pimpinan' : '/pegawai');
    } catch (err) {
      setError('Terjadi kesalahan yang tidak terduga.');
    } finally {
      // Tunggu sebentar sebelum mematikan loading saat redirect
      // Untuk mencegah kedipan tombol saat navigasi sedang berlangsung
      setTimeout(() => setLoading(false), 2000);
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

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>

      {/* ═══════════════════════════════════════════════ */}
      {/*  Left Panel — Apple-style Branding             */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
           style={{ background: '#1D1D1F' }}>

        {/* Soft ambient glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
               style={{ background: 'rgba(0,113,227,0.08)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
               style={{ background: 'rgba(0,113,227,0.05)' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-20 py-12">

          {/* Logo */}
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                 style={{ background: 'var(--primary)' }}>
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">CKP Digital</h1>
              <p className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                BPS Kabupaten Belitung
              </p>
            </div>
          </div>

          {/* Hero tagline */}
          <h2 className="text-[48px] font-bold text-white leading-[1.1] tracking-tight mb-6"
              style={{ letterSpacing: '-0.03em' }}>
            Sistem Rekap<br />
            <span style={{ color: 'var(--primary)' }}>Capaian Kinerja</span><br />
            Pegawai.
          </h2>
          <p className="text-[17px] leading-relaxed max-w-md"
             style={{ color: 'rgba(255,255,255,0.5)' }}>
            Kelola dan pantau kinerja pegawai secara digital. Upload CKP, review, dan approval dalam satu platform terintegrasi.
          </p>

          {/* Features — Apple checkmark style */}
          <div className="mt-14 space-y-5">
            {[
              'Upload file Excel CKP bulanan',
              'Dashboard monitoring real-time',
              'Approval workflow terintegrasi',
              'Akses bukti dukung langsung',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(0,113,227,0.15)' }}>
                  <CheckCircle2 size={13} style={{ color: 'var(--primary)' }} />
                </div>
                <span className="text-[15px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  Right Panel — Login Form                      */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12"
           style={{ background: 'var(--card-bg)' }}>
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                 style={{ background: 'var(--primary)' }}>
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                CKP Digital
              </h1>
              <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                BPS Kabupaten Belitung
              </p>
            </div>
          </div>

          {/* ── Form Content / State Switcher ───────── */}
          <div className="relative overflow-hidden">

            {resetSuccess ? (
              /* ── Success State ──────────────────── */
              <div className="flex flex-col items-center justify-center py-10 animate-fade-in text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-7"
                     style={{ background: 'var(--success-soft)' }}>
                  <CheckCircle2 className="h-10 w-10" style={{ color: 'var(--success)' }} />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-3"
                    style={{ color: 'var(--text-primary)' }}>
                  Password Berhasil Diubah!
                </h3>
                <p className="text-[15px] max-w-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                  Password untuk akun <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{resetEmail}</span> telah berhasil diubah. Silakan masuk menggunakan password baru Anda.
                </p>
                <Button 
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetSuccess(false);
                    setResetEmail('');
                    setNewPassword('');
                  }}
                  variant="outline" 
                  className="w-full"
                >
                  Kembali ke Halaman Login
                </Button>
              </div>

            ) : isForgotPassword ? (
              /* ── Forgot Password Form ──────────── */
              <div className="animate-fade-in">
                <div className="mb-10">
                  <h2 className="text-[28px] font-semibold tracking-tight"
                      style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    Lupa Password?
                  </h2>
                  <p className="text-[15px] mt-2" style={{ color: 'var(--text-secondary)' }}>
                    Masukkan email Anda untuk mereset password.
                  </p>
                </div>
                
                {resetError && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl animate-fade-in"
                       style={{ background: 'var(--danger-soft)', border: '1px solid rgba(255,59,48,0.08)' }}>
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--danger)' }} />
                    <p className="text-[14px]" style={{ color: 'var(--danger)' }}>{resetError}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label htmlFor="reset-email" className="block text-[13px] font-medium mb-2"
                           style={{ color: 'var(--text-primary)' }}>
                      Email Terdaftar
                    </label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="nama@bps.go.id"
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-[13px] font-medium mb-2"
                           style={{ color: 'var(--text-primary)' }}>
                      Password Baru
                    </label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Masukkan password baru"
                        required
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 space-y-3">
                    <Button
                      type="submit"
                      loading={resetLoading}
                      className="w-full"
                      size="lg"
                    >
                      <KeyRound className="h-5 w-5" />
                      Ubah Password
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsForgotPassword(false)}
                      className="w-full"
                      size="lg"
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
                <div className="mb-10">
                  <h2 className="text-[28px] font-semibold tracking-tight"
                      style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    Selamat Datang
                  </h2>
                  <p className="text-[15px] mt-2" style={{ color: 'var(--text-secondary)' }}>
                    Masuk ke akun Anda untuk melanjutkan
                  </p>
                </div>

                {error && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl animate-fade-in"
                       style={{ background: 'var(--danger-soft)', border: '1px solid rgba(255,59,48,0.08)' }}>
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--danger)' }} />
                    <p className="text-[14px]" style={{ color: 'var(--danger)' }}>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-[13px] font-medium mb-2"
                           style={{ color: 'var(--text-primary)' }}>
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@bps.go.id"
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-[13px] font-medium"
                             style={{ color: 'var(--text-primary)' }}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setResetError('');
                          setResetEmail(email); // Autofill with current email
                        }}
                        className="text-[13px] font-medium transition-colors"
                        style={{ color: 'var(--primary)' }}
                      >
                        Lupa Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password"
                        required
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full mt-3"
                    size="lg"
                  >
                    <LogIn className="h-5 w-5" />
                    Masuk
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
              © {new Date().getFullYear()} BPS Kabupaten Belitung
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Sistem Informasi Capaian Kinerja Pegawai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
