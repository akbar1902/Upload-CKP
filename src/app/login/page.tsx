"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/client';
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

  const primaryColor = '#3A6D5B'; // The green from SIKAP logo

  return (
    <div className="min-h-screen flex bg-[#F6F9F7] font-sans">
      
      {/* ═══════════════════════════════════════════════ */}
      {/*  Left Panel — Modern Light Design             */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#F6F9F7]">
        
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,0 C30,40 70,60 100,20 L100,100 L0,100 Z" fill="#EBF2ED" opacity="0.5" />
             <path d="M0,100 C40,80 60,30 100,60 L100,100 L0,100 Z" fill="#E2EBE5" opacity="0.3" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center py-8 w-full h-full max-w-[560px] ml-auto px-8 lg:pr-16 xl:pr-20">
          
          {/* Hero tagline */}
          <h2 className="text-[44px] font-extrabold text-[#1C2520] leading-[1.15] tracking-tight mb-4">
            Rekap, Review,<br />
            dan Approval<br />
            <span style={{ color: primaryColor }}>Capaian Kinerja</span>
          </h2>
          <p className="text-[16px] text-slate-500 mb-12 font-medium">
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
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1"
                  style={{ background: '#E6F0EA', color: primaryColor }}>
                  <feat.icon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#1C2520] mb-0.5">{feat.title}</h4>
                  <p className="text-[13px] text-slate-500">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  Right Panel — Login Form                      */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 bg-[#F6F9F7] lg:bg-transparent overflow-y-auto">
        <div className="w-full max-w-[460px] bg-white rounded-[32px] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(58,109,91,0.1)] border border-gray-100 flex flex-col my-auto">

          <div className="flex-1 flex flex-col justify-center">
            {resetSuccess ? (
              /* ── Success State ──────────────────── */
              <div className="flex flex-col items-center justify-center py-4 animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[#E6F0EA]">
                  <CheckCircle2 className="h-8 w-8" style={{ color: primaryColor }} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-[#1C2520]">
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
                  <div className="mx-auto flex justify-center mb-6">
                    <Logo size={140} className="drop-shadow-sm" />
                  </div>
                  <h2 className="text-[24px] font-bold text-[#1C2520] tracking-tight mb-2">
                    Lupa Password?
                  </h2>
                  <p className="text-[14px] text-slate-500">
                    Masukkan email Anda untuk mereset password.
                  </p>
                </div>

                {resetError && (
                  <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl animate-fade-in bg-red-50 border border-red-100">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" />
                    <p className="text-[13px] font-medium text-red-600">{resetError}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label htmlFor="reset-email" className="block text-[13px] font-bold mb-2 text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
                        className="pl-12 h-12 bg-[#F3F6F4] border-transparent focus:border-slate-300 focus:bg-white rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-[13px] font-bold mb-2 text-slate-700">
                      Password Baru
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="pl-12 pr-12 h-12 bg-[#F3F6F4] border-transparent focus:border-slate-300 focus:bg-white rounded-xl text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
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
                      className="w-full h-12 text-slate-500 hover:text-slate-700 rounded-xl font-medium"
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
                <div className="text-center mb-10">
                  <div className="mx-auto flex justify-center mb-6">
                    <Logo size={140} className="drop-shadow-sm" />
                  </div>
                  <h2 className="text-[26px] font-extrabold text-[#1C2520] tracking-tight mb-2">
                    Selamat Datang
                  </h2>
                  <p className="text-[14px] text-slate-500">
                    Masuk ke akun Anda untuk melanjutkan
                  </p>
                </div>

                {error && (
                  <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl animate-fade-in bg-red-50 border border-red-100">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" />
                    <p className="text-[13px] font-medium text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-[13px] font-bold mb-2 text-[#1C2520]">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
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
                        className="pl-12 h-13 py-3.5 bg-[#F6F8F7] border-[#E2EBE5] focus:border-[#3A6D5B] focus:bg-white rounded-xl text-[14px] font-medium shadow-sm placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-[13px] font-bold text-[#1C2520]">
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
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="pl-12 pr-12 h-13 py-3.5 bg-[#F6F8F7] border-[#E2EBE5] focus:border-[#3A6D5B] focus:bg-white rounded-xl text-[14px] font-medium shadow-sm placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full h-13 py-4 mt-4 rounded-xl font-bold text-[15px] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-[#3A6D5B]/20"
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
          <div className="mt-12 text-center border-t border-gray-100 pt-6">
            <p className="text-[11px] text-gray-400 font-medium">
              © {new Date().getFullYear()} BPS Kabupaten Belitung
            </p>
            <p className="text-[11px] mt-1 text-gray-400 font-medium">
              Sistem Informasi Capaian Kinerja Pegawai
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
