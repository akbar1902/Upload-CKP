"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import styles from '@/app/login/login.module.css';

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
    <div className={styles.page} style={{ gridTemplateColumns: '1fr' }}>
      <section className={styles.panel}>
        <div className={styles.card}>
          <div className={styles.cardBrand}>
            <img src="/SIKAP-text-and-tagline.svg" alt="SIKAP" />
          </div>

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
                <button type="button" className={styles.submit}>
                  Kembali ke Halaman Login
                </button>
              </Link>
            </div>
          )}

          {status === 'ready' && (
            /* ── Form password baru ─────────────────── */
            <div className="animate-fade-in">
              <span className={styles.badge}>
                <CheckCircle2 size={13} />
                Akun Anda terverifikasi
              </span>
              <h1 style={{ marginTop: 16 }}>
                Atur password
                <br />
                <em>baru.</em>
              </h1>
              <p className={styles.cardSub}>
                Masukkan password baru untuk melanjutkan. Minimal {MIN_PASSWORD_LENGTH} karakter dan berbeda dari
                password lama.
              </p>

              {error && (
                <div className={styles.error} role="alert" style={{ marginTop: 22 }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="new-password">Password Baru</label>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                      <KeyRound size={17} />
                    </span>
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      className={`${styles.input} ${styles.inputAffix}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={`Minimal ${MIN_PASSWORD_LENGTH} karakter`}
                      required
                      autoFocus
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      aria-pressed={showPassword}
                      className={styles.affixBtn}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="confirm-password">Konfirmasi Password</label>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>
                      <Lock size={17} />
                    </span>
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`${styles.input} ${styles.inputAffix}`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      aria-pressed={showConfirmPassword}
                      className={styles.affixBtn}
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className={styles.submit} disabled={loading} style={{ marginTop: 6 }}>
                  {loading ? (
                    <>
                      <span className="animate-spin">
                        <CheckCircle2 size={18} />
                      </span>
                      Menyimpan…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Simpan Password Baru
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className={styles.foot}>
            <p>
              © {new Date().getFullYear()} BPS Kabupaten Belitung
              <br />
              Sistem Informasi Capaian Kinerja Pegawai (SIKAP)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
