"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
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
  Zap,
  Lock,
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

export function Sidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const isPimpinan = user?.role === 'pimpinan' || user?.role === 'admin';
  const isKetuaTim = user?.role === 'ketua_tim' || isPimpinan;
  
  let navItems: NavItem[] = [];
  if (isPimpinan) {
    navItems = [...pimpinanNav, ...ketuaTimNav, ...pegawaiNav];
  } else if (isKetuaTim) {
    navItems = [...ketuaTimNav, ...pegawaiNav];
  } else {
    navItems = pegawaiNav;
  }

  const sidebarW = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false;
    if (href === '/pegawai' || href === '/pimpinan' || href === '/ketua_tim') return pathname === href;
    return pathname.startsWith(href);
  };

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

  const roleLabel = isPimpinan ? 'Pimpinan' : (user?.role === 'ketua_tim' ? 'Ketua Tim' : 'Pegawai');

  const navContent = (
    <div className="flex flex-col h-full select-none">

      {/* ── Brand / Logo ─────────────────────────────── */}
      <div className={cn(
        "flex items-center gap-3 px-5 py-5",
        collapsed && "justify-center px-3 py-5"
      )}>
        {/* Logo mark */}
        <div
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--primary)' }}
        >
          <Zap className="h-4.5 w-4.5 text-white" size={18} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[15px] font-semibold leading-tight tracking-tight"
               style={{ color: 'var(--text-primary)' }}>
              CKP Digital
            </p>
            <p className="text-[11px] font-medium leading-tight mt-0.5"
               style={{ color: 'var(--text-tertiary)' }}>
              BPS Kab. Belitung
            </p>
          </div>
        )}
      </div>

      {/* ── Divider ───────────────────────────────────── */}
      <div className="mx-4 h-px" style={{ background: 'var(--border)' }} />

      {/* ── User Profile Card ─────────────────────────── */}
      {!collapsed && user && (
        <div className="mx-3 mt-4 mb-1 p-3 rounded-2xl flex items-center gap-3"
             style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold flex-shrink-0"
            style={{ background: 'var(--primary)' }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium truncate"
               style={{ color: 'var(--text-primary)' }}>
              {user.full_name || 'User'}
            </p>
            <p className="text-[11px] truncate mt-0.5"
               style={{ color: 'var(--text-secondary)' }}>
              {roleLabel}
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
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isPlaceholder = item.href.startsWith('#');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={item.label}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              prefetch={!isPlaceholder}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200",
                collapsed && "justify-center px-3"
              )}
              style={
                active
                  ? { background: 'var(--sidebar-active)', color: 'var(--primary)' }
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
          onClick={() => setCollapsed(c => !c)}
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
