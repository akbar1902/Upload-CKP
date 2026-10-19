"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { useAuth } from '@/hooks/use-auth';
import { Download, ChevronRight, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationBell } from '@/components/layout/notification-bell';
import { useCommandPalette } from '@/components/layout/command-palette';

// ── Breadcrumb configuration ───────────────────────────────
interface BreadcrumbConfig {
  crumbs: { label: string; href?: string }[];
  title: string;
}

function getBreadcrumbConfig(pathname: string, isPimpinan: boolean): BreadcrumbConfig {
  if (pathname === '/pegawai') {
    return {
      crumbs: [{ label: 'Dashboard' }],
      title: 'Dashboard',
    };
  }
  if (pathname === '/pegawai/upload') {
    return {
      crumbs: [{ label: 'Dashboard', href: '/pegawai' }, { label: 'Upload CKP' }],
      title: 'Upload CKP',
    };
  }
  if (pathname === '/pimpinan') {
    return {
      crumbs: [{ label: 'Dashboard' }],
      title: 'Dashboard Pimpinan',
    };
  }
  if (pathname === '/ketua_tim') {
    return {
      crumbs: [{ label: 'Dashboard' }],
      title: 'Dashboard Ketua Tim',
    };
  }
  if (pathname === '/pimpinan/pegawai') {
    return {
      crumbs: [{ label: 'Dashboard', href: '/pimpinan' }, { label: 'Data Pegawai' }],
      title: 'Data Pegawai',
    };
  }
  if (pathname.includes('/ckp/') || pathname.includes('/penilaian/')) {
    const base = isPimpinan ? '/pimpinan' : (pathname.includes('/penilaian/') ? '/ketua_tim' : '/pegawai');
    return {
      crumbs: [{ label: 'Dashboard', href: base }, { label: 'Detail CKP' }],
      title: 'Detail CKP',
    };
  }
  if (pathname.includes('/pimpinan/pegawai/')) {
    return {
      crumbs: [{ label: 'Dashboard', href: '/pimpinan' }, { label: 'Data Pegawai', href: '/pimpinan/pegawai' }, { label: 'Detail Pegawai' }],
      title: 'Detail Pegawai',
    };
  }
  if (pathname.includes('/monitoring-penilaian')) {
    const base = pathname.includes('/admin') ? '/admin' : '/pimpinan';
    return {
      crumbs: [{ label: 'Dashboard', href: base }, { label: 'Monitoring Penilaian' }],
      title: 'Monitoring Penilaian Ketua Tim',
    };
  }
  if (pathname === '/rencana_kinerja') {
    return {
      crumbs: [{ label: 'Dashboard', href: isPimpinan ? '/pimpinan' : '/pegawai' }, { label: 'Rencana Kinerja' }],
      title: 'Rencana Kinerja',
    };
  }
  if (pathname.includes('/export-penilaian') || pathname.includes('/evaluasi-penilaian')) {
    return {
      crumbs: [{ label: 'Dashboard', href: isPimpinan ? '/admin' : '/pegawai' }, { label: 'Evaluasi Penilaian' }],
      title: 'Evaluasi Penilaian',
    };
  }
  if (pathname === '/analitik') {
    return {
      crumbs: [{ label: 'Dashboard', href: isPimpinan ? '/admin' : '/pimpinan' }, { label: 'Analitik' }],
      title: 'Analitik CKP',
    };
  }
  if (pathname === '/admin/pegawai') {
    return {
      crumbs: [{ label: 'Dashboard', href: '/admin' }, { label: 'Kepegawaian' }],
      title: 'Manajemen Kepegawaian',
    };
  }
  if (pathname === '/admin/periode') {
    return {
      crumbs: [{ label: 'Dashboard', href: '/admin' }, { label: 'Pengaturan Periode' }],
      title: 'Pengaturan Periode CKP',
    };
  }
  if (pathname === '/admin/logs') {
    return {
      crumbs: [{ label: 'Dashboard', href: '/admin' }, { label: 'Log Aktivitas' }],
      title: 'Log Aktivitas Sistem',
    };
  }
  if (pathname === '/pimpinan/approval') {
    return {
      crumbs: [{ label: 'Dashboard', href: '/pimpinan' }, { label: 'Persetujuan Cepat' }],
      title: 'Persetujuan Cepat CKP',
    };
  }
  if (pathname === '/admin/rk/import') {
    return {
      crumbs: [
        { label: 'Dashboard', href: '/admin' },
        { label: 'Rencana Kinerja', href: '/admin/rk' },
        { label: 'Import RK' },
      ],
      title: 'Import Rencana Kinerja',
    };
  }
  if (pathname === '/admin/rk') {
    return {
      crumbs: [{ label: 'Dashboard', href: '/admin' }, { label: 'Rencana Kinerja' }],
      title: 'Manajemen Rencana Kinerja',
    };
  }
  if (pathname.startsWith('/ketua_tim/rk/')) {
    return {
      crumbs: [{ label: 'Dashboard', href: '/ketua_tim' }, { label: 'Detail RK' }],
      title: 'Detail Rencana Kinerja',
    };
  }
  // Fallback: ambil nama ruas terakhir sebagai judul, biar tidak
  // menampilkan "SIKAP" (terlalu generik) di route yang belum dipetakan.
  const lastSegment = pathname.split('/').filter(Boolean).pop() ?? 'SIKAP';
  const fallbackTitle = lastSegment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    crumbs: [{ label: 'SIKAP' }],
    title: fallbackTitle,
  };
}

// ── Props ──────────────────────────────────────────────────
interface HeaderProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  pendingCount?: number;
  onExport?: () => void;
  showExport?: boolean;
}

// ── Component ──────────────────────────────────────────────
export function Header({
  onExport,
  showExport = false,
}: HeaderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- canonical hydration guard
    setMounted(true);
  }, []);

  const pathname = usePathname();
  const { user } = useAuth();
  const { open: openCommandPalette } = useCommandPalette();
  const isPimpinan = user?.role === 'pimpinan' || user?.role === 'admin';

  const { crumbs, title } = getBreadcrumbConfig(pathname, isPimpinan);

  const initials = user?.full_name
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const roleLabel = isPimpinan ? 'Pimpinan' : (user?.role === 'ketua_tim' ? 'Ketua Tim' : 'Pegawai');

  // Current date meta
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="header-glass sticky top-0 z-20" role="banner">
      <div className="flex items-center gap-4 px-5 sm:px-6 lg:px-8" style={{ height: '64px' }}>

        {/* Mobile spacer for hamburger */}
        <div className="lg:hidden w-8 flex-shrink-0" aria-hidden="true" />

        {/* ── Left: Breadcrumb + judul, SATU BARIS ─────────
            Sebelumnya breadcrumb ("Dashboard") dan judul ("Dashboard
            Pimpinan") ditumpuk dua baris dengan font berbeda, sehingga
            terbaca sebagai dua judul yang bertabrakan. Sekarang jejak
            navigasi dan judul menyatu satu baris: induk=redup, halaman
            ini=tegas, satu keluarga font. */}
        <nav className="breadcrumb min-w-0 flex-1 items-center gap-1.5" aria-label="Breadcrumb">
          {crumbs.length > 1 &&
            crumbs.slice(0, -1).map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <ChevronRight size={13} className="breadcrumb-sep flex-shrink-0" aria-hidden="true" />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href as Route}
                    prefetch={true}
                    className="text-[13px] font-medium truncate transition-colors duration-200 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)] rounded-md"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[13px] font-medium truncate" style={{ color: 'var(--text-tertiary)' }}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}

          {crumbs.length > 1 && (
            <ChevronRight size={13} className="breadcrumb-sep flex-shrink-0 mx-0.5" aria-hidden="true" />
          )}

          <h1
            className="text-[17px] font-semibold leading-tight truncate tracking-[-0.01em] min-w-0"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h1>
        </nav>

        {/* ── Center: Date meta ─────────────────────── */}
        <div className="hidden xl:flex items-center gap-1.5 text-[12px] flex-shrink-0"
             style={{ color: 'var(--text-tertiary)' }}>
          {mounted ? (
            <>
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{dateStr}</span>
              <span aria-hidden="true">·</span>
              <span>{timeStr} WIB</span>
            </>
          ) : (
            <div className="w-32 h-4 skeleton rounded" />
          )}
        </div>

        {/* ── Right: Actions + User ─────────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Command palette trigger */}
          <button
            onClick={openCommandPalette}
            className="group hidden sm:flex items-center gap-2 rounded-xl transition-[background-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97]"
            style={{
              background: 'var(--neu-surface)',
              boxShadow: 'var(--neu-raised-sm)',
              color: 'var(--text-secondary)',
              padding: '8px 12px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--neu-raised)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--neu-raised-sm)';
            }}
            aria-label="Buka pencarian cepat (Ctrl+K)"
            title="Pencarian cepat (Ctrl+K)"
          >
            <Search size={15} aria-hidden="true" />
            <span className="hidden md:inline text-[13px]">Cari…</span>
            <kbd
              className="hidden md:inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
              style={{ background: 'var(--neu-surface-2)', color: 'var(--text-tertiary)', boxShadow: 'var(--neu-inset-sm)' }}
            >
              Ctrl K
            </kbd>
          </button>

          {/* Search — hanya ikon di layar kecil */}
          <button
            onClick={openCommandPalette}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-transform duration-200 active:scale-95"
            style={{
              background: 'var(--neu-surface)',
              boxShadow: 'var(--neu-raised-sm)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Buka pencarian cepat (Ctrl+K)"
          >
            <Search size={15} aria-hidden="true" />
          </button>

          {/* Export button */}
          {showExport && onExport && (
            <button
              onClick={onExport}
              className="btn-primary text-[13px] hidden sm:flex"
              aria-label="Export ke Excel"
            >
              <Download size={14} />
              Export Excel
            </button>
          )}

          {/* Riwayat notifikasi + realtime */}
          <NotificationBell />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Divider */}
          <div className="hidden sm:block w-px h-6" style={{ background: 'var(--border)' }} aria-hidden="true" />

          {/* User info — pill neumorfik */}
          <div
            className="hidden sm:flex items-center gap-2.5 rounded-full pl-1.5 pr-4 py-1.5 transition-transform duration-200 hover:scale-[1.02]"
            style={{ background: 'var(--neu-surface)', boxShadow: 'var(--neu-raised-sm)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
              style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="hidden lg:block">
              <p className="text-[13px] font-medium leading-tight"
                 style={{ color: 'var(--text-primary)' }}>
                {user?.full_name || 'User'}
              </p>
              <p className="text-[11px] leading-tight truncate max-w-[180px]"
                 style={{ color: 'var(--text-tertiary)' }}
                 title={user?.jabatan ? `${user.jabatan} (${roleLabel})` : roleLabel}>
                {user?.jabatan || roleLabel}
              </p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
