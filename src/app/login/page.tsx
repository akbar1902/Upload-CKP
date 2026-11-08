"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { LoginHandoff } from '@/components/auth/login-handoff';
import { createClient } from '@/lib/supabase/client';
import { warmSupabaseConnection } from '@/lib/supabase/warm-connection';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff, AlertCircle, ArrowBigUp } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LoginScene } from './scene';
import s from './login.module.css';

const ROLE_ROUTES: Record<string, Route> = {
  admin: '/admin',
  pimpinan: '/pimpinan',
  ketua_tim: '/ketua_tim',
  pegawai: '/pegawai',
  anggota: '/pegawai',
};

function routeForRole(role?: string | null): Route {
  return (role && ROLE_ROUTES[role]) || '/pegawai';
}

function safeNextPath(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const next = new URLSearchParams(window.location.search).get('next');
    if (next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/login')) {
      return next;
    }
  } catch {
    /* abaikan */
  }
  return null;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const supabase = useMemo(() => createClient(), []);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Satu navigasi saja. Setelah login berhasil, effect pemantau sesi dan
  // handler submit bisa sama-sama ingin mengarahkan pengguna; guard ini
  // mencegah dua permintaan RSC untuk rute yang sama.
  const navigatingRef = useRef(false);

  const goTo = useCallback((target: Route) => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    setRedirecting(true);
    router.replace(target);
  }, [router]);

  // Bangunkan koneksi Supabase selagi pengguna mengetik. Query dashboard
  // pertama jadi tidak menanggung cold start 1–3 detik.
  useEffect(() => {
    void warmSupabaseConnection();
  }, []);

  // Redirect jika sudah ada session aktif menurut useAuth
  useEffect(() => {
    if (!authLoading && user) {
      goTo((safeNextPath() as Route | null) ?? routeForRole(user.role));
    }
  }, [user, authLoading, goTo]);

  // Jaring pengaman: kalau navigasi tak pernah selesai, jangan biarkan layar
  // handoff menggantung selamanya.
  useEffect(() => {
    if (!redirecting) return;
    const timer = setTimeout(() => {
      navigatingRef.current = false;
      setRedirecting(false);
      setLoading(false);
      setError('Halaman tujuan memakan waktu terlalu lama. Silakan coba lagi.');
    }, 15_000);
    return () => clearTimeout(timer);
  }, [redirecting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    // Jaga-jaga bila halaman sudah lama terbuka (>TTL warm) atau warm awal
    // gagal: kirim ping lagi tepat sebelum autentikasi.
    void warmSupabaseConnection();

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !data.user) {
        setError(
          signInError?.message.includes('Invalid')
            ? 'Email atau kata sandi salah. Silakan coba lagi.'
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
      // pengambilan profil dari DB sebelum halaman tujuan dibuka.
      // Middleware tetap memvalidasi dan mengoreksi bila role ternyata berbeda.
      // Bila role tidak dikenali, effect di atas yang mengarahkan setelah
      // profil dari database termuat.
      const metaRole = data.user.user_metadata?.role as string | undefined;
      const next = safeNextPath();
      const target = next ? (next as Route) : (metaRole ? ROLE_ROUTES[metaRole] : undefined);
      if (target) goTo(target);
    } catch {
      setError('Terjadi kesalahan yang tidak terduga.');
      setLoading(false);
    }
  };

  const onPasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState?.('CapsLock') ?? false);
  };

  return (
    <div className={s.root}>
      <div className={s.scene} aria-hidden="true">
        <LoginScene />
      </div>

      <div className={s.themeToggle}>
        <ThemeToggle />
      </div>

      <main className={s.card} inert={redirecting}>
        <h1 className={s.title}>Masuk ke SIKAP</h1>
        <p className={s.subtitle}>Gunakan email dan kata sandi akun Anda.</p>

        {error && (
          <div className={s.alert} role="alert">
            <AlertCircle size={17} style={{ flex: 'none', marginTop: 1 }} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={s.form}>
          <div>
            <label htmlFor="email" className={s.label}>Email</label>
            <input
              id="email"
              type="email"
              className={s.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@bps.go.id"
              autoComplete="username"
              inputMode="email"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className={s.label}>Kata sandi</label>
            <div className={s.control}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`${s.input} ${s.inputWithAction}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => { void warmSupabaseConnection(); }}
                onKeyDown={onPasswordKey}
                onKeyUp={onPasswordKey}
                onBlur={() => setCapsLock(false)}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-describedby="password-hint"
                required
              />
              <button
                type="button"
                className={s.eye}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {capsLock && (
              <p className={s.caps} role="status">
                <ArrowBigUp size={14} aria-hidden="true" /> Caps Lock aktif
              </p>
            )}
            <p id="password-hint" className={s.hint}>
              Lupa kata sandi? Hubungi Admin Kepegawaian.
            </p>
          </div>

          <button type="submit" className={s.submit} disabled={loading} aria-busy={loading}>
            {loading ? (
              <>
                <span className={s.spinner} aria-hidden="true" />
                Memeriksa…
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <div className={s.foot}>
          <Link href="/privasi">Kebijakan privasi</Link>
        </div>
      </main>

      {redirecting && <LoginHandoff name={user?.full_name} />}
    </div>
  );
}
