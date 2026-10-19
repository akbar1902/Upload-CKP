"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useAuth } from '@/hooks/use-auth';
import { useQueryClient } from '@tanstack/react-query';
import { fetchUploadMasterData, uploadMasterDataQueryKey } from '@/lib/upload-master-data';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Upload,
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Zap,
  Lock,
  FileDown,
  type LucideIcon,
} from 'lucide-react';
import { ChangePasswordModal } from '@/components/dashboard/change-password-modal';
import { PwaInstallButton } from '@/components/layout/pwa-install-button';

interface NavItem {
  href: Route;
  label: string;
  icon: LucideIcon;
}

const SIDEBAR_EXPANDED = 264;
const SIDEBAR_COLLAPSED = 76;
const SIDEBAR_STORAGE_KEY = 'sikap-sidebar-collapsed';
const SIDEBAR_STORAGE_EVENT = 'sikap:sidebar-collapsed';

function subscribeSidebarCollapsed(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(SIDEBAR_STORAGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(SIDEBAR_STORAGE_EVENT, onChange);
  };
}

function getSidebarCollapsedSnapshot() {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

// Snapshot server = false (sidebar terbuka) → aman saat hydration.
function getSidebarCollapsedServerSnapshot() {
  return false;
}

/**
 * Sidebar aplikasi.
 *
 * Prinsip visual:
 *  - Hijau pinus gelap sebagai "bingkai" navigasi → konten utama
 *    (kertas terang) jadi fokus mata, dan aplikasi terasa punya
 *    kedalaman, bukan sekadar daftar tautan.
 *  - Setiap state punya transisi (sub-menu, hover, item aktif)
 *    supaya tidak ada yang "melompat".
 *  - Semua hover memakai varian Tailwind (hover:/focus-visible:),
 *    bukan mutasi `element.style` — supaya efeknya juga terlihat
 *    saat navigasi dengan keyboard.
 */
export function Sidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [prefetchedUpload, setPrefetchedUpload] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Persist preferensi collapsed via localStorage (tanpa setState di effect).
  const collapsed = React.useSyncExternalStore(
    subscribeSidebarCollapsed,
    getSidebarCollapsedSnapshot,
    getSidebarCollapsedServerSnapshot
  );

  const setCollapsedPersisted = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? '1' : '0');
    } catch {
      /* localStorage bisa diblokir; abaikan */
    }
    // Beri tahu useSyncExternalStore di tab yang sama.
    window.dispatchEvent(new Event(SIDEBAR_STORAGE_EVENT));
  }, []);

  // Tutup drawer mobile dengan Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  // Prefetch upload master data on hover so the upload page opens instantly
  const prefetchUploadData = useCallback(async () => {
    if (prefetchedUpload) return;
    setPrefetchedUpload(true);
    await queryClient.prefetchQuery({
      queryKey: uploadMasterDataQueryKey,
      queryFn: fetchUploadMasterData,
      staleTime: 1000 * 60 * 5, // 5 minutes — samakan dengan halaman upload
    });
  }, [queryClient, prefetchedUpload]);

  // Terima permintaan buka modal ganti password dari Command Palette
  useEffect(() => {
    const handler = () => setChangePasswordOpen(true);
    window.addEventListener('sikap:change-password', handler);
    return () => window.removeEventListener('sikap:change-password', handler);
  }, []);

  const isPimpinan = user?.role === 'pimpinan' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';
  const isKetuaTim = user?.role === 'ketua_tim' || isPimpinan;

  // Dashboard Sub-items based on role
  let dashboardSubItems: NavItem[] = [];
  if (isPimpinan) {
    dashboardSubItems = [
      { href: '/pimpinan', label: 'Dashboard Pimpinan', icon: LayoutDashboard },
      { href: '/ketua_tim', label: 'Dashboard Ketua Tim', icon: LayoutDashboard },
    ];
  } else if (isKetuaTim) {
    dashboardSubItems = [
      { href: '/ketua_tim', label: 'Dashboard Ketua Tim', icon: LayoutDashboard },
      { href: '/pegawai', label: 'Dashboard Anggota', icon: LayoutDashboard },
    ];
  } else {
    dashboardSubItems = [
      { href: '/pegawai', label: 'Dashboard Anggota', icon: LayoutDashboard },
    ];
  }

  // Build main nav items
  const navItems: NavItem[] = [];
  if (isAdmin) {
    navItems.push({ href: '/admin', label: 'Monitoring CKP', icon: LayoutDashboard });
    navItems.push({ href: '/admin/pegawai', label: 'Kepegawaian', icon: Users });
    navItems.push({ href: '/admin/rk', label: 'Rencana Kinerja', icon: Users });
    navItems.push({ href: '/admin/export-penilaian', label: 'Evaluasi Penilaian', icon: FileDown });
    navItems.push({ href: '/admin/periode', label: 'Pengaturan Periode', icon: Lock });
    navItems.push({ href: '/admin/logs', label: 'Log Aktivitas', icon: Zap });
  } else if (isPimpinan) {
    navItems.push({ href: '/pimpinan/pegawai', label: 'Data Pegawai', icon: Users });
    navItems.push({ href: '/admin/export-penilaian', label: 'Evaluasi Penilaian', icon: FileDown });
  }

  if (!isAdmin) {
    if (!isPimpinan) {
      navItems.push({ href: '/pegawai/upload', label: 'Upload CKP', icon: Upload });
      navItems.push({ href: '/pegawai/evaluasi-penilaian', label: 'Evaluasi Penilaian', icon: FileDown });
    }
    navItems.push({ href: '/rencana_kinerja', label: 'Rencana Kinerja', icon: Users });
  }

  // Prefetch semua rute menu (saat login & saat kembali ke tab) agar pindah
  // menu tidak menunggu render server (terasa instan).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hrefs = Array.from(
      new Set([...dashboardSubItems.map((i) => i.href), ...navItems.map((i) => i.href)])
    ).filter((h) => h && !h.startsWith('#'));
    if (hrefs.length === 0) return;

    const warm = () => {
      for (const h of hrefs) {
        try {
          router.prefetch(h);
        } catch {
          /* ignore */
        }
      }
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') warm();
    };

    const timer = setTimeout(warm, 400);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, user?.role]);

  // Ekspos lebar sidebar ke CSS var (dipakai overlay transisi agar pas di area konten).
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty(
      '--sikap-sidebar-w',
      `${collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED}px`
    );
  }, [collapsed]);

  const sidebarW = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false;
    if (href === '/pegawai' || href === '/pimpinan' || href === '/ketua_tim') return pathname === href;
    if (href === '/pimpinan/pegawai') return pathname.startsWith('/pimpinan/pegawai');
    return pathname.startsWith(href);
  };

  const isDashboardActive = ['/pimpinan', '/ketua_tim', '/pegawai'].some((href) => pathname === href);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  const initials = user?.full_name
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const roleLabel = isAdmin
    ? 'Admin'
    : isPimpinan
      ? 'Pimpinan'
      : user?.role === 'ketua_tim'
        ? 'Ketua Tim'
        : 'Pegawai';

  /* ── Item navigasi ───────────────────────────────────────── */
  const navItemClass = (active: boolean) =>
    cn(
      'group relative flex items-center gap-3 w-full min-w-0 rounded-xl text-[14px] font-medium',
      'transition-[background-color,color,transform] duration-200 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--sidebar-bg)]',
      collapsed ? 'justify-center px-3 py-2.5' : 'px-3 py-2.5',
      active
        ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-text)] font-semibold'
        : 'text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)] active:scale-[0.98]'
    );

  const navContent = (
    <div className="flex flex-col h-full w-full min-w-0 select-none overflow-hidden">

      {/* ── Brand / Logo ─────────────────────────────── */}
      <div className={cn(
        "flex items-center justify-center px-5 pt-6 pb-5 w-full min-w-0 transition-[padding] duration-300",
        collapsed && "px-3"
      )}>
        {collapsed ? (
          <img
            src="/SIKAP-logo-only-beige.svg"
            alt="SIKAP"
            className="h-8 w-auto max-w-full object-contain"
          />
        ) : (
          <img
            src="/SIKAP-text-and-tagline-beige.svg"
            alt="SIKAP — Sistem Informasi Rekap Capaian Kinerja Pegawai"
            className="w-full h-auto max-w-full object-contain"
          />
        )}
      </div>

      {/* ── Divider ───────────────────────────────────── */}
      <div className="mx-4 h-px flex-shrink-0" style={{ background: 'var(--sidebar-border)' }} />

      {/* ── User Profile Card ─────────────────────────── */}
      {!collapsed && user && (
        <div className="mx-3 mt-4 mb-1 p-3 rounded-2xl flex items-center gap-3"
             style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--sidebar-border)' }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
            style={{ background: 'var(--sidebar-accent)', color: '#0B2A24' }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold truncate"
               style={{ color: 'var(--sidebar-text)' }}
               title={user.full_name || 'User'}>
              {user.full_name || 'User'}
            </p>
            <p className="text-[11px] truncate mt-0.5"
               style={{ color: 'var(--sidebar-text-muted)' }}
               title={user.jabatan ? `${user.jabatan} (${roleLabel})` : roleLabel}>
              {user.jabatan || roleLabel}
            </p>
          </div>
          {/* Online indicator — denyut halus, bukan statis */}
          <span className="relative flex-shrink-0 w-2 h-2" title="Online">
            <span className="absolute inset-0 rounded-full animate-[pulse-ring_2.4s_ease-out_infinite]"
                  style={{ background: '#7FD3A6' }} aria-hidden="true" />
            <span className="relative block w-2 h-2 rounded-full" style={{ background: '#7FD3A6' }} />
          </span>
        </div>
      )}

      {collapsed && user && (
        <div className="flex justify-center mt-3 mb-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold"
            style={{ background: 'var(--sidebar-accent)', color: '#0B2A24' }}
            title={`${user.full_name || 'User'} · ${roleLabel}`}
            aria-hidden="true"
          >
            {initials}
          </div>
        </div>
      )}

      {/* ── Nav Label ─────────────────────────────────── */}
      {!collapsed && (
        <p className="px-5 pt-5 pb-2 text-[10px] font-bold uppercase tracking-[0.16em]"
           style={{ color: 'var(--sidebar-text-muted)' }}>
          Menu
        </p>
      )}

      {/* ── Navigation Items ──────────────────────────── */}
      <nav className="flex-1 min-w-0 px-3 py-1 space-y-1 overflow-y-auto overflow-x-hidden" aria-label="Navigasi utama">

        {/* Nested Dashboard Menu */}
        {!isAdmin && (
          <div>
            <button
              onClick={() => {
                if (collapsed) setCollapsedPersisted(false);
                setIsDashboardOpen(!isDashboardOpen);
              }}
              className={cn(navItemClass(isDashboardActive), 'justify-between')}
              aria-expanded={isDashboardOpen}
              aria-controls="sikap-dashboard-submenu"
              title={collapsed ? 'Dashboard' : undefined}
            >
              <span className="flex items-center gap-3 min-w-0">
                <LayoutDashboard size={18} className="flex-shrink-0" aria-hidden="true" />
                {!collapsed && <span className="truncate min-w-0">Dashboard</span>}
              </span>
              {!collapsed && (
                <ChevronDown
                  size={15}
                  className={cn(
                    'flex-shrink-0 transition-transform duration-300 ease-out',
                    isDashboardOpen && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              )}
            </button>

            {/* Sub-items — tinggi mengikuti isi, transisi mulus */}
            {!collapsed && (
              <div
                id="sikap-dashboard-submenu"
                className="sikap-reveal"
                data-open={isDashboardOpen ? 'true' : 'false'}
              >
                <div>
                  <div className="mt-1 ml-4 pl-3 space-y-1" style={{ borderLeft: '1px solid var(--sidebar-border)' }}>
                    {dashboardSubItems.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={true}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium',
                            'transition-[background-color,color] duration-200 ease-out',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-accent)]',
                            active
                              ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-text)] font-semibold'
                              : 'text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]'
                          )}
                          aria-current={active ? 'page' : undefined}
                        >
                          {/* Indikator aktif: coral, tumbuh halus */}
                          <span
                            className={cn(
                              'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full transition-all duration-300 ease-out',
                              active ? 'h-5 opacity-100' : 'h-0 opacity-0'
                            )}
                            style={{ background: 'var(--sidebar-indicator)' }}
                            aria-hidden="true"
                          />
                          <span className="truncate min-w-0">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              aria-label={collapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
              className={navItemClass(active)}
              onMouseEnter={() => {
                // Prefetch upload master data when hovering the Upload CKP link
                if (item.href === '/pegawai/upload') void prefetchUploadData();
              }}
            >
              {/* Indikator aktif: coral, tumbuh halus */}
              {!collapsed && (
                <span
                  className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full transition-all duration-300 ease-out',
                    active ? 'h-5 opacity-100' : 'h-0 opacity-0'
                  )}
                  style={{ background: 'var(--sidebar-indicator)' }}
                  aria-hidden="true"
                />
              )}
              <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span className="truncate min-w-0">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Actions ────────────────────────────── */}
      <div className="px-3 pb-5 pt-3 space-y-1 flex-shrink-0"
           style={{ borderTop: '1px solid var(--sidebar-border)' }}>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsedPersisted(!collapsed)}
          className={cn(
            'hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium',
            'transition-[background-color,color] duration-200 ease-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-accent)]',
            collapsed && 'justify-center'
          )}
          style={{ color: 'var(--sidebar-text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text-muted)'; }}
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed
            ? <ChevronRight size={15} />
            : <><ChevronLeft size={15} /><span>Ciutkan</span></>
          }
        </button>

        {/* Install sebagai aplikasi (muncul hanya bila browser mendukung) */}
        <PwaInstallButton collapsed={collapsed} />

        {/* Change Password */}
        <button
          onClick={() => setChangePasswordOpen(true)}
          title="Ganti Password"
          aria-label="Ganti password akun"
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium',
            'transition-[background-color,color] duration-200 ease-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-accent)]',
            collapsed && 'justify-center'
          )}
          style={{ color: 'var(--sidebar-text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text-muted)'; }}
        >
          <Lock size={15} className="flex-shrink-0" aria-hidden="true" />
          {!collapsed && (
            <span>Ganti Password</span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          title="Keluar"
          aria-label="Keluar dari aplikasi"
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium',
            'transition-[background-color,color] duration-200 ease-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-accent)]',
            signingOut ? "cursor-not-allowed opacity-50" : "",
            collapsed && "justify-center"
          )}
          style={{ color: 'var(--sidebar-text-muted)' }}
          onMouseEnter={(e) => {
            if (!signingOut) {
              (e.currentTarget as HTMLElement).style.background = 'rgba(224, 146, 108, 0.16)';
              (e.currentTarget as HTMLElement).style.color = '#F3B694';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text-muted)';
          }}
        >
          <LogOut size={15} className="flex-shrink-0" aria-hidden="true" />
          {!collapsed && (
            <span>{signingOut ? 'Keluar...' : 'Keluar'}</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-2xl shadow-lg transition-transform duration-200 active:scale-95"
        style={{ background: 'var(--card-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
        aria-label="Buka menu navigasi"
        aria-expanded={mobileOpen}
        aria-controls="sikap-mobile-sidebar"
      >
        <Menu size={16} />
      </button>

      {/* Mobile overlay — muncul dengan fade, bukan langsung */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden',
          'transition-opacity duration-300 ease-out',
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile sidebar */}
      <aside
        id="sikap-mobile-sidebar"
        aria-label="Menu navigasi"
        inert={!mobileOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col lg:hidden transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          width: SIDEBAR_EXPANDED,
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          boxShadow: 'var(--sidebar-shadow)',
        }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ color: 'var(--sidebar-text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text-muted)'; }}
          aria-label="Tutup menu"
        >
          <X size={14} />
        </button>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30"
        style={{
          width: sidebarW,
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          boxShadow: 'var(--sidebar-shadow)',
          transition: 'width 0.28s cubic-bezier(0.4, 0.1, 0.2, 1)',
        }}
      >
        {navContent}
      </aside>

      {/* Desktop spacer */}
      <div
        className="hidden lg:block lg:flex-shrink-0"
        style={{ width: sidebarW, transition: 'width 0.28s cubic-bezier(0.4, 0.1, 0.2, 1)' }}
        aria-hidden="true"
      />

      {/* Modals */}
      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </>
  );
}
