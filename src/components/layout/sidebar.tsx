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
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const pegawaiNav: NavItem[] = [
  { href: '/pegawai', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pegawai/upload', label: 'Upload CKP', icon: Upload },
];

const pimpinanNav: NavItem[] = [
  { href: '/pimpinan', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pimpinan/pegawai', label: 'Data Pegawai', icon: Users },
];

// Sidebar width constants — must match the pl-* in layout.tsx
const SIDEBAR_W = 240; // px — same as w-60 and pl-60

export function Sidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isPimpinan = user?.role === 'pimpinan' || user?.role === 'admin';
  const navItems = isPimpinan ? pimpinanNav : pegawaiNav;

  const isActive = (href: string) => {
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

  const navContent = (
    <div className="flex flex-col h-full select-none">

      {/* Brand */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-slate-700/50",
        collapsed && "justify-center px-3"
      )}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
          <Building2 className="h-4 w-4 text-white" size={16} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">CKP Digital</p>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">BPS Kab. Belitung</p>
          </div>
        )}
      </div>

      {/* User chip */}
      {!collapsed && user && (
        <div className="mx-3 mt-4 mb-2 px-3 py-2.5 rounded-lg bg-slate-700/40 border border-slate-700/50 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #b45309 0%, #78716c 50%, #475569 100%)' }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-slate-100 truncate">{user.full_name || 'User'}</p>
            <p className="text-[10px] text-slate-400 capitalize truncate">{user.role}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto" aria-label="Navigasi utama">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
            Menu
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={item.label}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              prefetch={true}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium",
                active
                  ? "bg-slate-700/50 text-slate-100"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30",
                collapsed && "justify-center px-3"
              )}
            >
              <Icon size={15} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-slate-700/50 pt-3">
        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={cn(
            "hidden lg:flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/30",
            collapsed && "justify-center"
          )}
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
            "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium",
            signingOut
              ? "text-slate-600 cursor-not-allowed"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30",
            collapsed && "justify-center"
          )}
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
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 shadow-sm hover:bg-slate-700"
        aria-label="Buka menu navigasi"
      >
        <Menu size={16} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar — no transition, instant open/close */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-[#1e293b] border-r border-slate-700/60 lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
        style={{ width: SIDEBAR_W }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
          aria-label="Tutup menu"
        >
          <X size={14} />
        </button>
        {navContent}
      </aside>

      {/* Desktop sidebar — NO transition-all (was causing nav lag) */}
      <aside
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-[#1e293b] border-r border-slate-700/60 z-30"
        style={{ width: collapsed ? 56 : SIDEBAR_W }}
      >
        {navContent}
      </aside>

      {/* Desktop spacer — keeps content pushed right without transition lag */}
      <div
        className="hidden lg:block lg:flex-shrink-0"
        style={{ width: collapsed ? 56 : SIDEBAR_W }}
        aria-hidden="true"
      />
    </>
  );
}
