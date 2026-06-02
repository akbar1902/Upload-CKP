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
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  emoji: string;
}

const pegawaiNav: NavItem[] = [
  { href: '/pegawai',        label: 'Dashboard',  icon: LayoutDashboard, emoji: '🏠' },
  { href: '/pegawai/upload', label: 'Upload CKP', icon: Upload,          emoji: '📤' },
];

const pimpinanNav: NavItem[] = [
  { href: '/pimpinan',         label: 'Dashboard',    icon: LayoutDashboard, emoji: '🏠' },
  { href: '/pimpinan/pegawai', label: 'Data Pegawai', icon: Users,           emoji: '👥' },
];

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 60;

export function Sidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isPimpinan = user?.role === 'pimpinan' || user?.role === 'admin';
  const navItems = isPimpinan ? pimpinanNav : pegawaiNav;
  const sidebarW = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false;
    if (href === '/pegawai' || href === '/pimpinan') return pathname === href;
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

  const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
    'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
    'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)',
    'linear-gradient(135deg, #DB2777 0%, #9333EA 100%)',
    'linear-gradient(135deg, #EA580C 0%, #EAB308 100%)',
    'linear-gradient(135deg, #0F766E 0%, #2563EB 100%)',
    'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)',
    'linear-gradient(135deg, #1D4ED8 0%, #0E7490 100%)',
  ];
  const avatarGrad = AVATAR_GRADIENTS[
    ((user?.full_name?.charCodeAt(0) || 0) + (user?.full_name?.charCodeAt(1) || 0)) % AVATAR_GRADIENTS.length
  ];

  const roleLabel = isPimpinan ? 'Pimpinan / Admin' : 'Pegawai';

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
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)' }}
        >
          <Zap className="h-4.5 w-4.5 text-white" size={18} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-white leading-tight tracking-tight">
              CKP Digital
            </p>
            <p className="text-[11px] font-medium leading-tight mt-0.5"
               style={{ color: 'rgba(148,163,184,0.9)' }}>
              BPS Kab. Belitung
            </p>
          </div>
        )}
      </div>

      {/* ── Divider ───────────────────────────────────── */}
      <div className="mx-4 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* ── User Profile Card ─────────────────────────── */}
      {!collapsed && user && (
        <div className="mx-3 mt-4 mb-1 p-3 rounded-xl flex items-center gap-3"
             style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
            style={{ background: avatarGrad }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold truncate" style={{ color: 'rgba(255,255,255,0.92)' }}>
              {user.full_name || 'User'}
            </p>
            <p className="text-[11px] truncate mt-0.5" style={{ color: 'rgba(148,163,184,0.8)' }}>
              {roleLabel}
            </p>
          </div>
          {/* Online indicator */}
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400" title="Online" />
        </div>
      )}

      {collapsed && user && (
        <div className="flex justify-center mt-3 mb-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
            style={{ background: avatarGrad }}
            title={user.full_name}
            aria-hidden="true"
          >
            {initials}
          </div>
        </div>
      )}

      {/* ── Nav Label ─────────────────────────────────── */}
      {!collapsed && (
        <p className="px-5 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
           style={{ color: 'rgba(100,116,139,0.8)' }}>
          Navigation
        </p>
      )}

      {/* ── Navigation Items ──────────────────────────── */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto" aria-label="Navigasi utama">
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150",
                active
                  ? "text-blue-300 font-semibold"
                  : "hover:text-white",
                collapsed && "justify-center px-3"
              )}
              style={
                active
                  ? { background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.25)', color: '#93C5FD' }
                  : { color: 'rgba(148,163,184,0.8)', border: '1px solid transparent' }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(148,163,184,0.8)';
                }
              }}
            >
              <span className="text-base flex-shrink-0" aria-hidden="true">
                {item.emoji}
              </span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Actions ────────────────────────────── */}
      <div className="px-3 pb-5 pt-3 space-y-0.5"
           style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={cn(
            "hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
            collapsed && "justify-center"
          )}
          style={{ color: 'rgba(100,116,139,0.8)', border: '1px solid transparent' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'rgba(100,116,139,0.8)';
          }}
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
        >
          {collapsed
            ? <ChevronRight size={15} />
            : <><ChevronLeft size={15} /><span>Ciutkan</span></>
          }
        </button>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          title="Keluar"
          aria-label="Keluar dari aplikasi"
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
            signingOut ? "cursor-not-allowed opacity-50" : "",
            collapsed && "justify-center"
          )}
          style={{ color: 'rgba(100,116,139,0.8)', border: '1px solid transparent' }}
          onMouseEnter={(e) => {
            if (!signingOut) {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)';
              (e.currentTarget as HTMLElement).style.color = '#FCA5A5';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'rgba(100,116,139,0.8)';
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
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl shadow-lg"
        style={{ background: '#0F172A', color: 'rgba(148,163,184,0.9)' }}
        aria-label="Buka menu navigasi"
      >
        <Menu size={16} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
        style={{
          width: SIDEBAR_EXPANDED,
          background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg"
          style={{ color: 'rgba(148,163,184,0.7)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
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
          background: 'linear-gradient(180deg, #0F172A 0%, #1A2744 50%, #1E293B 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          transition: 'width 0.2s ease',
        }}
      >
        {navContent}
      </aside>

      {/* Desktop spacer */}
      <div
        className="hidden lg:block lg:flex-shrink-0"
        style={{ width: sidebarW, transition: 'width 0.2s ease' }}
        aria-hidden="true"
      />
    </>
  );
}
