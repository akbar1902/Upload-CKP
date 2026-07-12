"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { resetPasswordDirectAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, LogIn, AlertCircle, KeyRound, CheckCircle2, ArrowLeft, Zap, Mail, Lock, CloudUpload, BarChart, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen flex bg-[#F8FAFC]">

      {/* ═══════════════════════════════════════════════ */}
      {/*  Left Panel — Modern Light Design             */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white/40">

        {/* Soft abstract blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-blue-50/80 blur-3xl opacity-70" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-50/60 blur-3xl opacity-70" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center py-12 w-full h-full max-w-[560px] ml-auto px-8 lg:pr-16 xl:pr-24">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ background: 'var(--primary)' }}>
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Rekap CKP</h1>
              <p className="text-[11px] font-medium text-slate-500">
                BPS Kabupaten Belitung
              </p>
            </div>
          </div>

          {/* Hero tagline */}
          <h2 className="text-[42px] font-bold text-slate-900 leading-[1.2] tracking-tight mb-4"
            style={{ letterSpacing: '-0.03em' }}>
            Rekap, Review,<br />
            dan Approval<br />
            <span style={{ color: 'var(--primary)' }}>Capaian Kinerja</span>
          </h2>
          <p className="text-[16px] text-slate-500 mb-12 font-medium">
            Semua dalam satu platform terintegrasi.
          </p>

          {/* Features */}
          <div className="space-y-7">
            {[
              { icon: CloudUpload, title: 'Upload CKP Bulanan', desc: 'Unggah file Excel CKP dengan mudah dan aman.' },
              { icon: BarChart, title: 'Dashboard Real-time', desc: 'Pantau progress capaian kinerja secara real-time.' },
              { icon: ShieldCheck, title: 'Workflow Approval', desc: 'Proses review dan approval lebih cepat dan transparan.' },
              { icon: Lock, title: 'Akses Bukti Dukung Langsung', desc: 'Sistem mempermudah untuk mengakses bukti dukung.' },
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-blue-50 mt-0.5"
                  style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                  <feat.icon size={18} />
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-slate-900">{feat.title}</h4>
                  <p className="text-[13px] text-slate-500 mt-1">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  Right Panel — Login Form                      */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center lg:justify-start p-6 lg:p-0 lg:pl-16 xl:pl-24 relative z-10">
        <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-12 border border-slate-100">

          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'var(--primary)' }}>
              <Zap className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-slate-900">CKP Digital</h1>
              <p className="text-[12px] text-slate-500">BPS Kabupaten Belitung</p>
            </div>
          </div>

          {/* ── Form Content / State Switcher ───────── */}
          <div className="relative overflow-hidden">

            {resetSuccess ? (
              /* ── Success State ──────────────────── */
              <div className="flex flex-col items-center justify-center py-6 animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'var(--success-soft)' }}>
                  <CheckCircle2 className="h-8 w-8" style={{ color: 'var(--success)' }} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-slate-900">
                  Password Berhasil Diubah!
                </h3>
                <p className="text-[14px] max-w-sm mb-8 text-slate-500">
                  Password untuk akun <span className="font-semibold text-slate-700">{resetEmail}</span> telah berhasil diubah. Silakan masuk menggunakan password baru Anda.
                </p>
                <Button
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetSuccess(false);
                    setResetEmail('');
                    setNewPassword('');
                  }}
                  className="w-full"
                >
                  Kembali ke Halaman Login
                </Button>
              </div>

            ) : isForgotPassword ? (
              /* ── Forgot Password Form ──────────── */
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <h2 className="text-[24px] font-bold text-slate-900 tracking-tight">
                    Lupa Password?
                  </h2>
                  <p className="text-[14px] mt-1.5 text-slate-500">
                    Masukkan email Anda untuk mereset password.
                  </p>
                </div>

                {resetError && (
                  <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl animate-fade-in"
                    style={{ background: 'var(--danger-soft)', border: '1px solid rgba(225,29,72,0.1)' }}>
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--danger)' }} />
                    <p className="text-[13px] font-medium" style={{ color: 'var(--danger)' }}>{resetError}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label htmlFor="reset-email" className="block text-[13px] font-semibold mb-2 text-slate-700">
                      Email Terdaftar
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="nama@bps.go.id"
                        required
                        autoFocus
                        className="pl-10 bg-slate-50 border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-[13px] font-semibold mb-2 text-slate-700">
                      Password Baru
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="pl-10 pr-10 bg-slate-50 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <Button
                      type="submit"
                      loading={resetLoading}
                      className="w-full"
                    >
                      Ubah Password
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsForgotPassword(false)}
                      className="w-full text-slate-500 hover:text-slate-700"
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
                <div className="text-center mb-8">
                  <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <h2 className="text-[24px] font-bold text-slate-900 tracking-tight">
                    Selamat Datang
                  </h2>
                  <p className="text-[14px] mt-1.5 text-slate-500">
                    Masuk ke akun Anda untuk melanjutkan
                  </p>
                </div>

                {error && (
                  <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl animate-fade-in"
                    style={{ background: 'var(--danger-soft)', border: '1px solid rgba(225,29,72,0.1)' }}>
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--danger)' }} />
                    <p className="text-[13px] font-medium" style={{ color: 'var(--danger)' }}>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-[13px] font-semibold mb-2 text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@bps.go.id"
                        required
                        autoFocus
                        className="pl-10 bg-slate-50 border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-[13px] font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setResetError('');
                          setResetEmail(email);
                        }}
                        className="text-[12px] font-semibold transition-colors hover:opacity-80"
                        style={{ color: 'var(--primary)' }}
                      >
                        Lupa Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="pl-10 pr-10 bg-slate-50 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full mt-2"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Masuk
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} BPS Kabupaten Belitung
            </p>
            <p className="text-[11px] mt-0.5 text-slate-400">
              Sistem Informasi Capaian Kinerja Pegawai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
