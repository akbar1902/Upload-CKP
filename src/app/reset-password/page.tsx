"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';

type Status = 'checking' | 'invalid' | 'ready';

const MIN_PASSWORD_LENGTH = 6;

/**
 * Halaman "Reset Password" (dibuka dari tautan email Supabase).
 *
 * Alur:
 *  1. Browser client @supabase/ssr otomatis menukar `code`/token di URL
 *     menjadi session. Bila ada `code` dan `exchangeCodeForSession` tersedia,
 *     kita panggil eksplisit sebagai jaring pengaman.
 *  2. Tidak ada session valid → tautan kedaluwarsa/tidak valid.
 *  3. Ada session → form password baru + konfirmasi → updateUser({ password })
 *     → signOut → kembali ke /login.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [status, setStatus] = useState<Status>('checking');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const primaryColor = 'var(--primary)';

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const url = new URL(window.location.href);
        const hashParams = new URLSearchParams(
          url.hash.startsWith('#') ? url.hash.slice(1) : url.hash
        );

        // Link kedaluwarsa/ditolak biasanya membawa error_description.
        const errorDescription =
          url.searchParams.get('error_description') ||
          hashParams.get('error_description');
        if (errorDescription) {
          console.warn('[reset-password] Tautan bermasalah:', errorDescription);
        }

        const code = url.searchParams.get('code');
        if (code) {
          // @supabase/ssr biasanya menukar code otomatis saat deteksi URL.
          // Panggil eksplisit hanya bila method tersedia (jaring pengaman).
          const exchange = (
            supabase.auth as unknown as {
              exchangeCodeForSession?: (authCode: string) => Promise<unknown>;
            }
          ).exchangeCodeForSession;
          if (typeof exchange === 'function') {
            try {
              await exchange.call(supabase.auth, code);
            } catch (exchangeErr) {
              // Gagal di sini tidak selalu fatal (auto-detect bisa sudah
              // menukar code lebih dulu) — validasi tetap lewat getSession.
              console.warn('[reset-password] exchangeCodeForSession:', exchangeErr);
            }
          }

          // Bersihkan `code` dari address bar agar tidak ditukar ulang saat refresh.
          url.searchParams.delete('code');
          const cleanUrl = `${url.pathname}${url.search}${url.hash}`;
          window.history.replaceState({}, '', cleanUrl);
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;
        setStatus(session ? 'ready' : 'invalid');
      } catch (err) {
        console.warn('[reset-password] Gagal memproses tautan:', err);
        if (mounted) setStatus('invalid');
      }
    };

    void init();

    // Fallback: bila client menyelesaikan deteksi URL belakangan,
    // event PASSWORD_RECOVERY/SIGNED_IN akan menandai session siap.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;
        if (session && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN')) {
          setStatus('ready');
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password baru minimal ${MIN_PASSWORD_LENGTH} karakter.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(
          updateError.message.toLowerCase().includes('different')
            ? 'Password baru harus berbeda dari password lama.'
            : 'Gagal menyimpan password baru. Tautan mungkin sudah kedaluwarsa — minta tautan baru.'
        );
        return;
      }

      toast.success('Password berhasil diubah. Silakan masuk dengan password baru Anda.');
      await supabase.auth.signOut();
      router.replace('/login');
    } catch (err) {
      console.warn('[reset-password] updateUser gagal:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex bg-[#FAFAF5] dark:bg-[var(--bg-secondary)]">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative z-10">
        <div className="w-full max-w-[440px] rounded-[32px] p-8 flex flex-col relative z-10 bg-white border border-[#EDE8DF] shadow-[0_28px_70px_-32px_rgba(45,80,60,0.30)] dark:bg-[var(--card-bg)] dark:border-[var(--border)]">
          <div className="flex-1 flex flex-col justify-center">
            {status === 'checking' && (
              /* ── Memeriksa tautan ──────────────────── */
              <div className="flex flex-col items-center justify-center py-10 animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[var(--primary-soft)]">
                  <div
                    className="animate-spin w-7 h-7 border-2 border-t-transparent rounded-full"
                    style={{ borderColor: 'var(--border)', borderTopColor: primaryColor }}
                  />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-[var(--text-primary)]">
                  Memeriksa Tautan…
                </h3>
                <p className="text-[14px] max-w-sm text-[var(--text-secondary)]">
                  Mohon tunggu sebentar, kami sedang memvalidasi tautan reset Anda.
                </p>
              </div>
            )}

            {status === 'invalid' && (
              /* ── Tautan tidak valid ─────────────────── */
              <div className="flex flex-col items-center justify-center py-4 animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-[var(--danger-soft)]">
                  <AlertCircle className="h-8 w-8 text-[var(--danger)]" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-[var(--text-primary)]">
                  Tautan Reset Tidak Valid
                </h3>
                <p className="text-[14px] max-w-sm mb-3 text-[var(--text-secondary)]">
                  Tautan reset tidak valid atau sudah kedaluwarsa. Password Anda tidak berubah.
                </p>
                <p className="text-[13px] max-w-sm mb-8 text-[var(--text-tertiary)]">
                  Silakan minta tautan baru melalui tombol <span className="font-semibold">Lupa Password</span> di
                  halaman login.
                </p>
                <Link href="/login" className="w-full">
                  <Button
                    className="w-full h-12 rounded-xl font-semibold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Kembali ke Halaman Login
                  </Button>
                </Link>
              </div>
            )}

            {status === 'ready' && (
              /* ── Form password baru ─────────────────── */
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <div className="mx-auto flex justify-center mb-4">
                    <Logo size={110} className="drop-shadow-sm" darkSrc="/SIKAP-text-and-tagline-beige.svg" />
                  </div>
                  <h2 className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight mb-2">
                    Buat Password Baru
                  </h2>
                  <p className="text-[14px] text-[var(--text-secondary)]">
                    Akun Anda terverifikasi. Masukkan password baru untuk melanjutkan.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl animate-fade-in bg-[var(--danger-soft)] border border-[var(--danger-soft)]">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--danger)]" />
                    <p className="text-[13px] font-medium text-[var(--danger-text)]">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="new-password" className="block text-[13px] font-bold mb-2 text-[var(--text-primary)]">
                      Password Baru
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                        <KeyRound className="h-5 w-5" />
                      </div>
                      <Input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={`Minimal ${MIN_PASSWORD_LENGTH} karakter`}
                        required
                        autoFocus
                        autoComplete="new-password"
                        className="login-input pl-12 pr-12 h-12 py-2 border border-[var(--border)] focus:border-[var(--primary)] rounded-xl text-[14px] font-medium shadow-sm placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-[13px] font-bold mb-2 text-[var(--text-primary)]">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password baru"
                        required
                        autoComplete="new-password"
                        className="login-input pl-12 pr-12 h-12 py-2 border border-[var(--border)] focus:border-[var(--primary)] rounded-xl text-[14px] font-medium shadow-sm placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full h-12 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Simpan Password Baru
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

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
