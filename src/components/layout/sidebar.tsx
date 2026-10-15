"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useQueryClient } from '@tanstack/react-query';
import { fetchUploadMasterData, uploadMasterDataQueryKey } from '@/lib/upload-master-data';
import { Logo } from '@/components/ui/logo';
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
} from 'lucide-react';
import { ChangePasswordModal } from '@/components/dashboard/change-password-modal';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  
}

const pegawaiNav: NavItem[] = [
  { href: '/pegawai',        label: 'Dashboard Anggota',  icon: LayoutDashboard },
  { href: '/pegawai/upload', label: 'Upload CKP', icon: Upload },
  { href: '/rencana_kinerja', label: 'Rencana Kinerja', icon: Users },
];

const pimpinanNav: NavItem[] = [
  { href: '/pimpinan',         label: 'Dashboard Pimpinan',    icon: LayoutDashboard },
  { href: '/pimpinan/pegawai', label: 'Data Pegawai', icon: Users },
];

const ketuaTimNav: NavItem[] = [
  { href: '/ketua_tim', label: 'Dashboard Ketua Tim', icon: LayoutDashboard },
];

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 72;
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

export function Sidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [prefetchedUpload, setPrefetchedUpload] = useState(false);

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

  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

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
  
  const isDashboardActive = ['/pimpinan', '/ketua_tim', '/pegawai'].some(href => pathname === href);

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

  const roleLabel = isAdmin ? 'Admin' : (isPimpinan ? 'Pimpinan' : (user?.role === 'ketua_tim' ? 'Ketua Tim' : 'Pegawai'));

  const navContent = (
    <div className="flex flex-col h-full select-none">

      {/* ── Brand / Logo ─────────────────────────────── */}
      <div className={cn(
        "flex items-center justify-center px-5 py-5 w-full",
        collapsed && "px-3 py-5"
      )}>
        <img
          src="/SIKAP-text-and-tagline.svg"
          alt="SIKAP Logo"
          className="w-full h-auto object-contain drop-shadow-sm dark:hidden"
        />
        <img
          src="/SIKAP-text-and-tagline-beige.svg"
          alt="SIKAP Logo"
          className="w-full h-auto object-contain drop-shadow-sm hidden dark:block"
        />
      </div>

      {/* ── Divider ───────────────────────────────────── */}
      <div className="mx-4 h-px" style={{ background: 'var(--border)' }} />

      {/* ── User Profile Card ─────────────────────────── */}
      {!collapsed && user && (
        <div className="mx-3 mt-4 mb-1 p-3 rounded-2xl flex items-center gap-3"
             style={{ background: 'var(--sidebar-bg)', boxShadow: 'var(--neu-raised)' }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold flex-shrink-0"
            style={{ background: 'var(--primary)', boxShadow: 'var(--neu-inset-sm)' }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium truncate"
               style={{ color: 'var(--text-primary)' }}
               title={user.full_name || 'User'}>
              {user.full_name || 'User'}
            </p>
            <p className="text-[11px] truncate mt-0.5"
               style={{ color: 'var(--text-secondary)' }}
               title={user.jabatan ? `${user.jabatan} (${roleLabel})` : roleLabel}>
              {user.jabatan || roleLabel}
            </p>
          </div>
          {/* Online indicator */}
          <div className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: 'var(--success)' }} title="Online" />
        </div>
      )}

      {collapsed && user && (
        <div className="flex justify-center mt-3 mb-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold"
            style={{ background: 'var(--primary)' }}
            title={user.full_name}
            aria-hidden="true"
          >
            {initials}
          </div>
        </div>
      )}

      {/* ── Nav Label ─────────────────────────────────── */}
      {!collapsed && (
        <p className="px-5 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
           style={{ color: 'var(--text-tertiary)' }}>
          Menu
        </p>
      )}

      {/* ── Navigation Items ──────────────────────────── */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto" aria-label="Navigasi utama">
        
        {/* Nested Dashboard Menu */}
        {!isAdmin && (
          <div>
            <button
              onClick={() => {
                if (collapsed) setCollapsedPersisted(false);
                setIsDashboardOpen(!isDashboardOpen);
              }}
              className={cn(
                "relative flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200",
                collapsed && "justify-center px-3"
              )}
              style={
                isDashboardActive
                  ? { background: 'var(--sidebar-active)', color: 'var(--primary-bright)' }
                  : { color: 'var(--sidebar-text-muted)' }
              }
              onMouseEnter={(e) => {
                if (!isDashboardActive) {
                  (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDashboardActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text-muted)';
                }
              }}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} className="flex-shrink-0" />
                {!collapsed && <span>Dashboard</span>}
              </div>
              {/* Indikator terracotta: menu dashboard aktif */}
              {isDashboardActive && !collapsed && (
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              )}
              {!collapsed && (
                <ChevronDown 
                  size={16} 
                  className={cn("transition-transform duration-200", isDashboardOpen ? "rotate-180" : "")} 
                />
              )}
            </button>
            
            {/* Sub-items */}
            {(!collapsed && isDashboardOpen) && (
              <div className="mt-1 ml-4 pl-3 space-y-1 border-l border-[var(--border)]">
                {dashboardSubItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setMobileOpen(false)}
                      className="relative flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200"
                      style={
                        active
                          ? { background: 'var(--sidebar-active)', color: 'var(--primary-bright)' }
                          : { color: 'var(--sidebar-text-muted)' }
                      }
                      onMouseEnter={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                          (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text-muted)';
                        }
                      }}
                    >
                      {/* Indikator terracotta: sub-item aktif */}
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Other Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isPlaceholder = item.href.startsWith('#');
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={() => setMobileOpen(false)}
              title={item.label}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200",
                collapsed && "justify-center px-3"
              )}
              style={
                active
                  ? { background: 'var(--sidebar-active)', color: 'var(--primary-bright)' }
                  : { color: 'var(--sidebar-text-muted)' }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)';
                }
                // Prefetch upload master data when hovering the Upload CKP link
                if (item.href === '/pegawai/upload') {
                  void prefetchUploadData();
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text-muted)';
                }
              }}
            >
              {/* Indikator terracotta: item aktif */}
              {active && !collapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              )}
              <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Actions ────────────────────────────── */}
      <div className="px-3 pb-5 pt-3 space-y-1"
           style={{ borderTop: '1px solid var(--border)' }}>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsedPersisted(!collapsed)}
          className={cn(
            "hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
            collapsed && "justify-center"
          )}
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)';
            (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)';
          }}
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed
            ? <ChevronRight size={15} />
            : <><ChevronLeft size={15} /><span>Ciutkan</span></>
          }
        </button>

        {/* Change Password */}
        <button
          onClick={() => setChangePasswordOpen(true)}
          title="Ganti Password"
          aria-label="Ganti password akun"
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
            collapsed && "justify-center"
          )}
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)';
            (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)';
          }}
        >
          <Lock size={15} className="flex-shrink-0" />
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
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
            signingOut ? "cursor-not-allowed opacity-50" : "",
            collapsed && "justify-center"
          )}
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => {
            if (!signingOut) {
              (e.currentTarget as HTMLElement).style.background = 'var(--danger-soft)';
              (e.currentTarget as HTMLElement).style.color = 'var(--danger)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)';
          }}
        >
          <LogOut size={15} className="flex-shrink-0" />
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
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-2xl shadow-lg"
        style={{ background: 'var(--card-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
        aria-label="Buka menu navigasi"
        aria-expanded={mobileOpen}
        aria-controls="sikap-mobile-sidebar"
      >
        <Menu size={16} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        id="sikap-mobile-sidebar"
        aria-label="Menu navigasi"
        inert={!mobileOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col lg:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          width: SIDEBAR_EXPANDED,
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
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
          transition: 'width 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        {navContent}
      </aside>

      {/* Desktop spacer */}
      <div
        className="hidden lg:block lg:flex-shrink-0"
        style={{ width: sidebarW, transition: 'width 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)' }}
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
