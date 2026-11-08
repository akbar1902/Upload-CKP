import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight } from 'lucide-react';
import { LoginScene } from '@/app/login/scene';
import s from './status-hero.module.css';

export type HeroStatus = 'missing' | 'draft' | 'waiting' | 'scored' | 'done' | 'revision';

/** Kata sorotan di baris kedua headline + nada warnanya. */
const HIGHLIGHT: Record<HeroStatus, string> = {
  missing: 'belum diunggah.',
  draft: 'masih draf.',
  waiting: 'sedang dinilai.',
  scored: 'sudah dinilai.',
  done: 'sudah beres.',
  revision: 'perlu revisi.',
};

/** Potongan adegan ruko: fasad, papan nama SIKAP, taman, rumah toska. */
const HERO_VIEWBOX = '160 250 1320 610';

export interface StatusHeroProps {
  /** Baris sapaan kecil (opsional). */
  greeting?: string;
  /** Baris meta kecil di bawah sapaan (tanggal, NIP). */
  meta?: string;
  /** Baris pertama headline, mis. "CKP November". */
  title: string;
  status: HeroStatus;
  /** Kalimat pendek penjelas di bawah headline. */
  description?: string;
  /** Catatan tambahan kecil (mis. CKP bulan lain yang perlu revisi). */
  note?: string;
  cta?: { href: Route; label: string };
  loading?: boolean;
}

/**
 * Hero dashboard: headline status dua baris dengan kata sorotan (gaya tagline
 * login) + potongan ilustrasi ruko yang ikut siang/malam. Ilustrasinya statis
 * (tanpa animasi) — murah dirender.
 */
export function StatusHero({ greeting, meta, title, status, description, note, cta, loading }: StatusHeroProps) {
  return (
    <section className={s.hero} data-status={status} aria-busy={loading || undefined}>
      <div className={s.body}>
        {greeting && <p className={s.greeting}>{greeting}</p>}
        {meta && <p className={s.meta}>{meta}</p>}

        {loading ? (
          <div className={s.headlineSkeleton} aria-hidden="true">
            <span className="skeleton" />
            <span className="skeleton" />
          </div>
        ) : (
          <h2 className={s.headline}>
            <span className={s.line1}>{title}</span>
            <span className={s.line2}>{HIGHLIGHT[status]}</span>
          </h2>
        )}

        {!loading && description && <p className={s.description}>{description}</p>}
        {!loading && note && <p className={s.note}>{note}</p>}

        {cta && (
          <Link href={cta.href} prefetch className={s.cta}>
            {cta.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className={s.art} aria-hidden="true">
        <LoginScene viewBox={HERO_VIEWBOX} preserveAspectRatio="xMidYMax slice" showTagline={false} />
      </div>
    </section>
  );
}
