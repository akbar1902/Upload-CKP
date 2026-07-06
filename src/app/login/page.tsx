"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { resetPasswordDirectAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Eye, EyeOff, LogIn, AlertCircle, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/25">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CKP Digital</h1>
              <p className="text-sm text-blue-300">BPS Kabupaten Belitung</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Sistem Rekap<br />
            <span className="gradient-text">Capaian Kinerja</span><br />
            Pegawai
          </h2>
          <p className="text-lg text-slate-400 max-w-md leading-relaxed">
            Kelola dan pantau kinerja pegawai secara digital. Upload CKP, review, dan approval dalam satu platform terintegrasi.
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4">
            {[
              'Upload file Excel CKP bulanan',
              'Dashboard monitoring real-time',
              'Approval workflow terintegrasi',
              'Akses bukti dukung langsung',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <span className="text-sm text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">CKP Digital</h1>
              <p className="text-xs text-slate-500">BPS Kabupaten Belitung</p>
            </div>
          </div>

          {/* Form Content / State Switcher */}
          <div className="relative overflow-hidden">
            {resetSuccess ? (
              // Success State
              <div className="flex flex-col items-center justify-center py-10 animate-fade-in text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Password Berhasil Diubah!</h3>
                <p className="text-slate-500 max-w-sm mb-8">
                  Password untuk akun <span className="font-semibold text-slate-700">{resetEmail}</span> telah berhasil diubah. Silakan masuk menggunakan password baru Anda.
                </p>
                <Button 
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetSuccess(false);
                    setResetEmail('');
                    setNewPassword('');
                  }}
                  variant="outline" 
                  className="w-full h-12"
                >
                  Kembali ke Halaman Login
                </Button>
              </div>
            ) : isForgotPassword ? (
              // Forgot Password Form
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Lupa Password?</h2>
                  <p className="text-slate-500 mt-2">Masukkan email Anda untuk mereset password.</p>
                </div>
                
                {resetError && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{resetError}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 mb-2">
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
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 mb-2">
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
                        className="h-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <Button
                      type="submit"
                      loading={resetLoading}
                      className="w-full h-12 text-base font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                    >
                      <KeyRound className="h-5 w-5" />
                      Ubah Password
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsForgotPassword(false)}
                      className="w-full h-12 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Kembali ke Login
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              // Normal Login Form
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Selamat Datang</h2>
                  <p className="text-slate-500 mt-2">Masuk ke akun Anda untuk melanjutkan</p>
                </div>

                {error && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
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
                      className="h-12"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setResetError('');
                          setResetEmail(email); // Autofill with current email
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
                        className="h-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full h-12 text-base font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all mt-2"
                  >
                    <LogIn className="h-5 w-5" />
                    Masuk
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} BPS Kabupaten Belitung
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Sistem Informasi Capaian Kinerja Pegawai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
