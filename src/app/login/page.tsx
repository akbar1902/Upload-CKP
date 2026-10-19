"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className={styles.page}>
      {/* ═══════════════════════════════════════════════════ */}
      {/*  Panel ilustrasi — desktop saja                     */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className={styles.art} aria-hidden="true">
        <div className={styles.aurora} />
        <div className={styles.beam} />
        <div className={styles.vignette} />

        <div className={styles.artTop}>
          <img src="/SIKAP-text-and-tagline-beige.svg" alt="" />
          <span className={styles.artTag}>Portal Internal</span>
        </div>

        <div className={styles.stage}>
          {/* Orbit berputar pelan dengan dua titik */}
          <div className={styles.orbit}>
            <span className={`${styles.orbitDot} ${styles.orbitDotA}`} />
            <span className={`${styles.orbitDot} ${styles.orbitDotB}`} />
          </div>

          {/* Kartu laporan: capaian kinerja */}
          <article className={`${styles.artCard} ${styles.artCardA}`}>
            <div className={styles.cardHead}>
              <span className={styles.cardEyebrow}>Rekap Bulanan</span>
              <span className={`${styles.cardPill} ${styles.cardPillOk}`}>
                <CheckCircle2 size={11} />
                Disetujui
              </span>
            </div>
            <h3 className={styles.cardTitle}>Capaian Kinerja</h3>
            <div className={styles.cardRows}>
              <div className={styles.cardRow}>
                <span className={`${styles.cardVal} ${styles.cardValStart}`}>38 keg.</span>
                <span className={styles.cardBar}>
                  <span className={styles.cardFill} style={{ width: '96%' }} />
                </span>
              </div>
              <div className={styles.cardRow}>
                <span className={`${styles.cardVal} ${styles.cardValStart}`}>Nilai</span>
                <span className={`${styles.cardBar} ${styles.cardBarGold}`}>
                  <span className={styles.cardFill} style={{ width: '91%' }} />
                </span>
                <span className={styles.cardVal}>91</span>
              </div>
              <div className={styles.cardRow}>
                <span className={`${styles.cardVal} ${styles.cardValStart}`}>Revisi</span>
                <span className={`${styles.cardBar} ${styles.cardBarCoral}`}>
                  <span className={styles.cardFill} style={{ width: '14%' }} />
                </span>
                <span className={styles.cardVal}>0</span>
              </div>
            </div>
            <p className={styles.cardNote}>Tim Statistik Sosial · 5 Rencana Kinerja</p>
          </article>

          {/* Kartu laporan: sudah dinilai */}
          <article className={`${styles.artCard} ${styles.artCardB}`}>
            <div className={styles.cardHead}>
              <span className={styles.cardEyebrow}>Sudah Dinilai</span>
              <span className={`${styles.cardPill} ${styles.cardPillGold}`}>
                <Sparkles size={11} />
                Rata-rata 89,4
              </span>
            </div>
            <div className={`${styles.cardRows} ${styles.cardRowsScores}`}>
              {[92, 88, 90].map((v) => (
                <div className={styles.cardRow} key={v}>
                  <span className={styles.cardBar}>
                    <span className={styles.cardFill} style={{ width: `${v}%` }} />
                  </span>
                  <span className={styles.cardVal}>{v}</span>
                </div>
              ))}
            </div>
            <p className={styles.cardNoteOk}>
              <ShieldCheck size={12} />
              Siap disetujui pimpinan
            </p>
          </article>

          {/* Seal progres: 26 dari 32 pegawai melapor */}
          <div className={styles.seal}>
            <span className={styles.sealRing} />
            <span className={styles.sealDash} />
            <span className={styles.sealCore}>
              <strong>
                26<span>/32</span>
              </strong>
              <small>Pegawai Melapor</small>
            </span>
          </div>
        </div>

        {/* Slogan — satu kalimat */}
        <div className={styles.quote}>
          <span className={styles.quoteRule} />
          <h2>
            CKP sudah diunggah,
            <br />
            <em>Hati Tenang</em>
          </h2>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  Panel formulir                                  */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className={styles.panel}>
        <div className={styles.card}>
          {/* Slogan ringkas (hanya di layar kecil) */}
          <div className={styles.mobileSlogan}>
            <span className={styles.rule} />
            <p>
              CKP sudah diunggah, <em>Hati Tenang</em>
            </p>
          </div>

          {/* Logo (hanya di layar kecil — di desktop ada di panel kiri) */}
          <div className={styles.cardBrand}>
            <img src="/SIKAP-text-and-tagline.svg" alt="SIKAP" />
          </div>

          <span className={styles.badge}>
            <ShieldCheck size={13} />
            Akses pegawai BPS Kabupaten Belitung
          </span>

          <h1>
            Selamat datang
            <br />
            <em>kembali.</em>
          </h1>
          <p className={styles.cardSub}>
            Masuk ke akun Anda untuk melanjutkan pengelolaan CKP.
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {error && (
              <div className={styles.error} role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <Mail size={17} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@bps.go.id"
                  autoComplete="username"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <Lock size={17} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputAffix}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.affixBtn}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <p className={styles.note}>
                Lupa password? Hubungi <b>Admin Kepegawaian</b> untuk reset akun.
              </p>
            </div>

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin">
                    <LogIn size={18} />
                  </span>
                  Memeriksa…
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Masuk
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

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
