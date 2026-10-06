"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  CornerDownLeft,
  FileDown,
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  Moon,
  RefreshCw,
  Search,
  Sun,
  Upload,
  User as UserIcon,
  Users,
  Zap,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   Context — supaya tombol mana pun bisa membuka palette
   ═══════════════════════════════════════════════════════════ */

interface CommandPaletteContextType {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

const CommandPaletteContext = createContext<CommandPaletteContextType>({
  open: () => {},
  close: () => {},
  toggle: () => {},
  isOpen: false,
});

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */

type CmdGroup = 'Navigasi' | 'Aksi' | 'Pegawai' | 'CKP';

interface CommandItem {
  id: string;
  group: CmdGroup;
  label: string;
  hint?: string;
  keywords?: string;
  icon: React.ElementType;
  run: () => void;
}

interface SearchUpload {
  id: string;
  bulan: number;
  tahun: number;
  status: string;
  file_name: string | null;
  user_id: string;
}

interface SearchUser {
  id: string;
  full_name: string;
  nip: string | null;
  unit_kerja: string | null;
  role: string;
}

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */

const BULAN_FULL = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Menunggu Review',
  scored: 'Sudah Dinilai',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  revision_required: 'Perlu Revisi',
  superseded: 'Diganti (Arsip)',
};

function scoreMatch(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (!q) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  // Subsequence fuzzy match (mis. "uplckp" → "Upload CKP")
  let ti = 0;
  let matched = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return 0;
    ti = found + 1;
    matched++;
  }
  return matched === q.length ? 30 : 0;
}

/** Bungkus potongan yang cocok dengan <mark> untuk highlight. */
function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          background: 'var(--primary-soft)',
          color: 'var(--primary)',
          borderRadius: 4,
          padding: '0 2px',
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Provider + Palette
   ═══════════════════════════════════════════════════════════ */

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((o) => !o), []);

  // Shortcut global: Ctrl/Cmd + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k';
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    };
    // Dukung pemanggilan dari luar (mis. event kustom)
    const onEvent = () => setIsOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('sikap:command-palette', onEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('sikap:command-palette', onEvent);
    };
  }, []);

  const value = useMemo(
    () => ({ open, close, toggle, isOpen }),
    [open, close, toggle, isOpen]
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      {isOpen && <CommandPalette onClose={close} />}
    </CommandPaletteContext.Provider>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const supabase = useMemo(() => createClient(), []);

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploads, setUploads] = useState<SearchUpload[]>([]);
  const [people, setPeople] = useState<SearchUser[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const role = user?.role ?? 'anggota';
  const isPimpinan = role === 'pimpinan' || role === 'admin';
  const isKetua = role === 'ketua_tim' || isPimpinan;

  // Fokus ke input saat dibuka
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  // Kunci scroll body
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Muat data pencarian global (sekali per buka)
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    const load = async () => {
      setLoadingData(true);
      try {
        const uploadsQuery = supabase
          .from('ckp_uploads')
          .select('id, bulan, tahun, status, file_name, user_id')
          .order('tahun', { ascending: false })
          .order('bulan', { ascending: false })
          .limit(isPimpinan ? 150 : 60);

        // Tipe builder Supabase tidak persis Promise — pakai any[] agar aman.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const queries: any[] = [uploadsQuery];
        if (isPimpinan) {
          queries.push(
            supabase
              .from('users')
              .select('id, full_name, nip, unit_kerja, role')
              .order('full_name')
              .limit(300)
          );
        }

        const [upRes, usRes] = await Promise.all(queries);
        if (cancelled) return;

        const upData = (upRes?.data as SearchUpload[] | null) ?? [];
        // Anggota hanya melihat upload miliknya sendiri
        setUploads(isPimpinan ? upData : upData.filter((u) => u.user_id === user.id));
        if (usRes) setPeople((usRes.data as SearchUser[] | null) ?? []);
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id, isPimpinan, supabase]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  /* ── Command registry ─────────────────────────────────── */
  const commands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [];

    // Navigasi
    if (role === 'admin') {
      items.push(
        { id: 'nav-admin', group: 'Navigasi', label: 'Monitoring CKP', icon: LayoutDashboard, run: () => go('/admin') },
        { id: 'nav-pegawai-admin', group: 'Navigasi', label: 'Kepegawaian', keywords: 'user pegawai', icon: Users, run: () => go('/admin/pegawai') },
        { id: 'nav-rk-admin', group: 'Navigasi', label: 'Rencana Kinerja (Admin)', keywords: 'rk', icon: FileText, run: () => go('/admin/rk') },
        { id: 'nav-export-admin', group: 'Navigasi', label: 'Evaluasi Penilaian', keywords: 'export pdf', icon: FileDown, run: () => go('/admin/export-penilaian') },
        { id: 'nav-periode', group: 'Navigasi', label: 'Pengaturan Periode', keywords: 'kunci bulan', icon: Lock, run: () => go('/admin/periode') },
        { id: 'nav-logs', group: 'Navigasi', label: 'Log Aktivitas', keywords: 'audit', icon: Zap, run: () => go('/admin/logs') },
      );
    } else if (isPimpinan) {
      items.push(
        { id: 'nav-pimpinan', group: 'Navigasi', label: 'Dashboard Pimpinan', icon: LayoutDashboard, run: () => go('/pimpinan') },
        { id: 'nav-ketua', group: 'Navigasi', label: 'Dashboard Ketua Tim', icon: LayoutDashboard, run: () => go('/ketua_tim') },
        { id: 'nav-data-pegawai', group: 'Navigasi', label: 'Data Pegawai', keywords: 'user', icon: Users, run: () => go('/pimpinan/pegawai') },
        { id: 'nav-export', group: 'Navigasi', label: 'Evaluasi Penilaian', keywords: 'export pdf', icon: FileDown, run: () => go('/admin/export-penilaian') },
        { id: 'nav-monitoring', group: 'Navigasi', label: 'Monitoring Penilaian', keywords: 'tunggakan', icon: Users, run: () => go('/pimpinan/monitoring-penilaian') },
        { id: 'nav-approval', group: 'Navigasi', label: 'Persetujuan Cepat', keywords: 'approve', icon: CheckCircle2, run: () => go('/pimpinan/approval') },
        { id: 'nav-rk', group: 'Navigasi', label: 'Rencana Kinerja', keywords: 'rk', icon: FileText, run: () => go('/rencana_kinerja') },
      );
    } else if (isKetua) {
      items.push(
        { id: 'nav-ketua', group: 'Navigasi', label: 'Dashboard Ketua Tim', icon: LayoutDashboard, run: () => go('/ketua_tim') },
        { id: 'nav-pegawai', group: 'Navigasi', label: 'Dashboard Anggota', icon: LayoutDashboard, run: () => go('/pegawai') },
        { id: 'nav-upload', group: 'Navigasi', label: 'Upload CKP', keywords: 'unggah excel', icon: Upload, run: () => go('/pegawai/upload') },
        { id: 'nav-evaluasi', group: 'Navigasi', label: 'Evaluasi Penilaian', keywords: 'export pdf', icon: FileDown, run: () => go('/pegawai/evaluasi-penilaian') },
        { id: 'nav-rk', group: 'Navigasi', label: 'Rencana Kinerja', keywords: 'rk', icon: FileText, run: () => go('/rencana_kinerja') },
      );
    } else {
      items.push(
        { id: 'nav-pegawai', group: 'Navigasi', label: 'Dashboard Anggota', icon: LayoutDashboard, run: () => go('/pegawai') },
        { id: 'nav-upload', group: 'Navigasi', label: 'Upload CKP', keywords: 'unggah excel', icon: Upload, run: () => go('/pegawai/upload') },
        { id: 'nav-evaluasi', group: 'Navigasi', label: 'Evaluasi Penilaian', keywords: 'export pdf', icon: FileDown, run: () => go('/pegawai/evaluasi-penilaian') },
        { id: 'nav-rk', group: 'Navigasi', label: 'Rencana Kinerja', keywords: 'rk', icon: FileText, run: () => go('/rencana_kinerja') },
      );
    }

    // Insight — tersedia untuk semua peran
    items.push({
      id: 'nav-insight', group: 'Navigasi', label: 'Insight Kinerja',
      keywords: 'grafik chart analitik tren', icon: BarChart3,
      run: () => go('/insight'),
    });

    // Aksi
    if (!isPimpinan) {
      items.push({
        id: 'act-upload', group: 'Aksi', label: 'Upload CKP Baru', keywords: 'unggah excel tambah', icon: Upload,
        run: () => go('/pegawai/upload'),
      });
    }
    items.push({
      id: 'act-theme', group: 'Aksi',
      label: theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap',
      keywords: 'tema dark light mode',
      icon: theme === 'dark' ? Sun : Moon,
      run: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        onClose();
      },
    });
    items.push({
      id: 'act-password', group: 'Aksi', label: 'Ganti Password', keywords: 'password sandi keamanan', icon: Lock,
      run: () => {
        onClose();
        window.dispatchEvent(new Event('sikap:change-password'));
      },
    });
    items.push({
      id: 'act-refresh', group: 'Aksi', label: 'Muat Ulang Halaman', keywords: 'refresh reload', icon: RefreshCw,
      run: () => {
        onClose();
        router.refresh();
      },
    });
    items.push({
      id: 'act-logout', group: 'Aksi', label: 'Keluar', keywords: 'logout sign out', icon: LogOut,
      run: () => void signOut(),
    });

    // Hasil data
    for (const p of people) {
      const subtitle = [p.nip ? `NIP ${p.nip}` : null, p.unit_kerja].filter(Boolean).join(' · ');
      items.push({
        id: `people-${p.id}`,
        group: 'Pegawai',
        label: p.full_name,
        hint: subtitle || undefined,
        keywords: `${p.full_name} ${p.nip ?? ''} ${p.unit_kerja ?? ''}`,
        icon: UserIcon,
        run: () => go(`/pimpinan/pegawai/${p.id}`),
      });
    }

    for (const u of uploads) {
      const period = `${BULAN_FULL[u.bulan] ?? u.bulan} ${u.tahun}`;
      const href = role === 'anggota' ? `/pegawai/ckp/${u.id}` : `/penilaian/${u.id}`;
      items.push({
        id: `upload-${u.id}`,
        group: 'CKP',
        label: `CKP ${period}`,
        hint: `${STATUS_LABEL[u.status] ?? u.status}${u.file_name ? ` · ${u.file_name}` : ''}`,
        keywords: `${period} ${u.tahun} ${u.file_name ?? ''} ${STATUS_LABEL[u.status] ?? ''}`,
        icon: Calendar,
        run: () => go(href),
      });
    }

    return items;
  }, [role, isPimpinan, isKetua, theme, people, uploads, go, onClose, setTheme, signOut, router]);

  /* ── Filter + sort ────────────────────────────────────── */
  const filtered = useMemo(() => {
    const q = query.trim();
    const withScore = commands
      .map((c) => {
        if (!q) {
          // Tanpa query: prioritaskan Navigasi & Aksi, batasi hasil data
          const base = c.group === 'Navigasi' ? 50 : c.group === 'Aksi' ? 40 : 20;
          return { c, s: base };
        }
        const s = Math.max(
          scoreMatch(c.label, q),
          scoreMatch(c.keywords ?? '', q),
          scoreMatch(c.hint ?? '', q)
        );
        return { c, s };
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);

    if (!q) {
      // batasi agar tidak membanjiri: maks 6 per grup data
      const counts: Record<string, number> = {};
      return withScore
        .filter(({ c }) => {
          counts[c.group] = (counts[c.group] ?? 0) + 1;
          if (c.group === 'Pegawai' || c.group === 'CKP') return counts[c.group] <= 6;
          return true;
        })
        .map((x) => x.c);
    }
    return withScore.slice(0, 40).map((x) => x.c);
  }, [commands, query]);

  // Kelompokkan untuk render
  const grouped = useMemo(() => {
    const order: CmdGroup[] = ['Navigasi', 'Aksi', 'Pegawai', 'CKP'];
    const map = new Map<CmdGroup, CommandItem[]>();
    for (const item of filtered) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    }
    return order.filter((g) => map.has(g)).map((g) => ({ group: g, items: map.get(g)! }));
  }, [filtered]);

  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  // Jaga item aktif tetap terlihat
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(flat.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % Math.max(flat.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      flat[activeIndex]?.run();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const showEmpty = !loadingData && flat.length === 0;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-start justify-center p-4 sm:pt-[12vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md"
        style={{ animation: 'fadeIn 0.18s cubic-bezier(0.25,0.1,0.25,1) both' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-[620px] rounded-[24px] overflow-hidden neu-raised-lg"
        style={{ animation: 'scaleIn 0.2s cubic-bezier(0.25,0.1,0.25,1) both' }}
        role="dialog"
        aria-modal="true"
        aria-label="Pencarian cepat"
      >
        {/* Input */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-soft)' }}
        >
          <Search size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Cari halaman, pegawai, periode CKP, atau aksi…"
            className="flex-1 bg-transparent outline-none text-[15px]"
            style={{ color: 'var(--text-primary)', border: 'none' }}
            aria-label="Kata kunci pencarian"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd
            className="hidden sm:inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ background: 'var(--neu-surface-2)', color: 'var(--text-tertiary)', boxShadow: 'var(--neu-inset-sm)' }}
          >
            ESC
          </kbd>
        </div>

        {/* Hasil */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
          {loadingData && flat.length === 0 ? (
            <div className="flex items-center gap-2 px-5 py-8 justify-center text-[13px]"
                 style={{ color: 'var(--text-tertiary)' }}>
              <RefreshCw size={14} className="animate-spin" /> Memuat data…
            </div>
          ) : showEmpty ? (
            <div className="px-5 py-10 text-center">
              <p className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>
                Tidak ada hasil untuk “{query}”
              </p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Coba kata kunci lain seperti nama pegawai atau periode.
              </p>
            </div>
          ) : (
            grouped.map(({ group, items }) => (
              <div key={group} className="mb-1">
                <p
                  className="px-5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {group}
                </p>
                {items.map((item) => {
                  const index = flat.indexOf(item);
                  const active = index === activeIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      data-index={index}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={item.run}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 mx-2 rounded-xl text-left transition-colors'
                      )}
                      style={{
                        width: 'calc(100% - 16px)',
                        padding: '10px 12px',
                        background: active ? 'var(--primary-soft)' : 'transparent',
                        color: active ? 'var(--primary)' : 'var(--text-primary)',
                      }}
                      role="option"
                      aria-selected={active}
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: active ? 'var(--card-bg)' : 'var(--neu-surface-2)',
                          color: active ? 'var(--primary)' : 'var(--text-secondary)',
                          boxShadow: 'var(--neu-inset-sm)',
                        }}
                        aria-hidden="true"
                      >
                        <Icon size={15} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-medium truncate">
                          {highlight(item.label, query)}
                        </span>
                        {item.hint && (
                          <span
                            className="block text-[11px] truncate"
                            style={{ color: active ? 'var(--primary)' : 'var(--text-tertiary)', opacity: 0.85 }}
                          >
                            {item.hint}
                          </span>
                        )}
                      </span>
                      {active && (
                        <CornerDownLeft size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 px-5 py-2.5 text-[11px]"
          style={{ borderTop: '1px solid var(--border-soft)', color: 'var(--text-tertiary)' }}
        >
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded" style={{ background: 'var(--neu-surface-2)', boxShadow: 'var(--neu-inset-sm)' }}><ArrowUp size={9} /></kbd>
              <kbd className="px-1 py-0.5 rounded" style={{ background: 'var(--neu-surface-2)', boxShadow: 'var(--neu-inset-sm)' }}><ArrowDown size={9} /></kbd>
              navigasi
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded" style={{ background: 'var(--neu-surface-2)', boxShadow: 'var(--neu-inset-sm)' }}><CornerDownLeft size={9} /></kbd>
              buka
            </span>
          </span>
          <span className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--primary)' }}>
            SIKAP <ArrowRight size={10} /> Cari Cepat
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
