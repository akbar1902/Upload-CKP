"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Bell, Search } from 'lucide-react';

const PAGE_NAMES: Record<string, string> = {
  '/pegawai':         'Dashboard',
  '/pegawai/upload':  'Upload CKP',
  '/pimpinan':        'Dashboard',
  '/pimpinan/pegawai':'Data Pegawai',
};

const ROLE_LABELS: Record<string, string> = {
  pegawai:  'Pegawai',
  pimpinan: 'Pimpinan',
  admin:    'Administrator',
};

interface HeaderProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  pendingCount?: number;
}

export function Header({ onSearch, showSearch = false, pendingCount = 0 }: HeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const getPageTitle = () => {
    for (const [path, name] of Object.entries(PAGE_NAMES)) {
      if (pathname === path) return name;
    }
    if (pathname.includes('/ckp/')) return 'Detail CKP';
    if (pathname.includes('/pimpinan/pegawai/')) return 'Detail Pegawai';
    return 'CKP Digital';
  };

  const initials = user?.full_name
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const roleLabel = user?.role ? (ROLE_LABELS[user.role] || user.role) : '';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-100" role="banner">
      <div className="flex items-center gap-4 px-5 lg:px-7 h-14">

        {/* Mobile spacer for hamburger button */}
        <div className="lg:hidden w-8 flex-shrink-0" aria-hidden="true" />

        {/* Page title */}
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-semibold text-slate-800 truncate">{getPageTitle()}</h1>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="hidden md:flex flex-shrink-0 w-64" role="search">
            <div className="relative w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                placeholder="Cari pegawai..."
                aria-label="Cari pegawai"
                className="w-full pl-8 h-9 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-colors"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Pending count notification */}
        {pendingCount > 0 && (
          <button
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            aria-label={`${pendingCount} CKP menunggu review`}
            title={`${pendingCount} CKP menunggu review`}
          >
            <Bell size={18} />
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
              aria-hidden="true"
            >
              {pendingCount > 9 ? '9+' : pendingCount}
            </span>
          </button>
        )}

        {/* Right: User info */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0 pl-4 border-l border-slate-100">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #b45309 0%, #78716c 50%, #475569 100%)' }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="hidden lg:block">
            <p className="text-[13px] font-semibold text-slate-800 leading-tight">{user?.full_name || 'User'}</p>
            <p className="text-[11px] text-slate-400 leading-tight">{roleLabel}</p>
          </div>
        </div>

      </div>
    </header>
  );
}
