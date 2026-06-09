"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Bell, Download, ChevronRight } from 'lucide-react';

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
  if (pathname === '/pimpinan/pegawai') {
    return {
      crumbs: [{ label: 'Dashboard', href: '/pimpinan' }, { label: 'Data Pegawai' }],
      title: 'Data Pegawai',
    };
  }
  if (pathname.includes('/ckp/')) {
    const base = isPimpinan ? '/pimpinan' : '/pegawai';
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
  return {
    crumbs: [{ label: 'CKP Digital' }],
    title: 'CKP Digital',
  };
}

// ── Avatar gradients ───────────────────────────────────────
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
function getAvatarGrad(name: string): string {
  const idx = ((name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
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
  pendingCount = 0,
  onExport,
  showExport = false,
}: HeaderProps) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();
  const { user } = useAuth();
  const isPimpinan = user?.role === 'pimpinan' || user?.role === 'admin';

  const { crumbs, title } = getBreadcrumbConfig(pathname, isPimpinan);

  const initials = user?.full_name
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const avatarGrad = getAvatarGrad(user?.full_name || 'U');
  const roleLabel = isPimpinan ? 'Pimpinan' : 'Pegawai';

  // Current date meta
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="header-glass sticky top-0 z-20" role="banner">
      <div className="flex items-center gap-4 px-6 lg:px-8 h-16">

        {/* Mobile spacer for hamburger */}
        <div className="lg:hidden w-8 flex-shrink-0" aria-hidden="true" />

        {/* ── Left: Title + Breadcrumb ──────────────── */}
        <div className="min-w-0 flex-1">
          {/* Breadcrumb */}
          <nav className="breadcrumb mb-0.5" aria-label="Breadcrumb">
            {crumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <ChevronRight size={12} className="breadcrumb-sep flex-shrink-0" aria-hidden="true" />
                )}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Page Title */}
          <h1 className="text-[18px] font-bold text-slate-900 leading-tight truncate">
            {title}
          </h1>
        </div>

        {/* ── Center: Date meta ─────────────────────── */}
        <div className="hidden xl:flex items-center gap-1.5 text-[12px] text-slate-400 flex-shrink-0">
          {mounted ? (
            <>
              <span className="font-medium text-slate-500">{dateStr}</span>
              <span>·</span>
              <span>{timeStr} WIB</span>
            </>
          ) : (
            <div className="w-32 h-4 bg-slate-100 rounded animate-pulse" />
          )}
        </div>

        {/* ── Right: Actions + User ─────────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">

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

          {/* Pending notification bell */}
          {pendingCount > 0 && (
            <button
              className="relative p-2 rounded-xl transition-colors"
              style={{ background: '#FEF9C3', color: '#92400E' }}
              aria-label={`${pendingCount} CKP menunggu review`}
              title={`${pendingCount} CKP menunggu review`}
            >
              <Bell size={16} />
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
                aria-hidden="true"
              >
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            </button>
          )}

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-slate-200" aria-hidden="true" />

          {/* User info */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
              style={{ background: avatarGrad }}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="hidden lg:block">
              <p className="text-[13px] font-semibold text-slate-800 leading-tight">
                {user?.full_name || 'User'}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">{roleLabel}</p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
