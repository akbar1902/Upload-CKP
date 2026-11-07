'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  value: string;
  options: string[];
  /** Pilihan tambahan (mis. nama kegiatan lama), disembunyikan sampai diminta. */
  extraOptions?: string[];
  usulan?: string[];
  onChange: (rk: string) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Normalisasi untuk pencarian: huruf kecil, tanpa tanda baca. */
function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Pemilih Sub-RK dengan kotak cari. Daftar dirender di portal (posisi fixed)
 * agar tidak terpotong oleh tabel yang bisa digulir.
 */
export function RkPicker({ value, options, extraOptions = [], usulan = [], onChange, placeholder = 'Pilih RK…', invalid, disabled, className }: Props) {
  const [open, setOpen] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<{ left: number; top: number; width: number; up: boolean } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const list = useMemo(() => {
    const q = norm(query);
    const words = q ? q.split(' ') : [];
    const cocok = (rk: string) => {
      const n = norm(rk);
      return words.every((w) => n.includes(w));
    };
    const saran = usulan.filter((rk) => options.includes(rk) && cocok(rk));
    const lain = options.filter((rk) => !saran.includes(rk) && cocok(rk));
    const ekstra = showExtra ? extraOptions.filter((rk) => !options.includes(rk) && cocok(rk)) : [];
    return { saran, lain, ekstra, semua: [...saran, ...lain, ...ekstra] };
  }, [query, options, extraOptions, usulan, showExtra]);

  function openPanel() {
    if (disabled) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(Math.max(rect.width, 360), window.innerWidth - 32);
    const left = Math.min(Math.max(16, rect.left), window.innerWidth - width - 16);
    const up = rect.bottom + 340 > window.innerHeight && rect.top > 340;
    setPos({ left, top: up ? rect.top - 8 : rect.bottom + 8, width, up });
    setQuery('');
    setActive(0);
    setOpen(true);
  }

  function pick(rk: string) {
    onChange(rk);
    setOpen(false);
    buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const close = (event: Event) => {
      if (panelRef.current?.contains(event.target as Node) || buttonRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    const onScroll = (event: Event) => {
      if (panelRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      // Jangan ikut menutup dialog tempat picker ini berada (Dialog
      // mengabaikan Escape yang sudah ditangani / defaultPrevented).
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, list.semua.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const rk = list.semua[active];
      if (rk) pick(rk);
    }
  }

  const item = (rk: string, index: number, saran: boolean) => (
    <button
      key={`${saran ? 's' : 'o'}-${rk}`}
      type="button"
      onMouseEnter={() => setActive(index)}
      onClick={() => pick(rk)}
      className={cn(
        'flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm text-[var(--text-primary)]',
        index === active && 'bg-[var(--sand-subtle)]',
      )}
    >
      {saran ? (
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
      ) : (
        <Check className={cn('mt-0.5 h-4 w-4 shrink-0', rk === value ? 'text-[var(--primary)]' : 'opacity-0')} />
      )}
      <span>{rk}</span>
    </button>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex w-full items-start justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm',
          'border-[var(--sand-border)] bg-[var(--card-bg)] text-[var(--text-primary)] disabled:opacity-50',
          invalid && 'border-[var(--danger)]',
          className,
        )}
      >
        <span className={cn(!value && 'text-[var(--text-secondary)]')}>{value || placeholder}</span>
        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            role="listbox"
            onKeyDown={onKeyDown}
            style={{ left: pos.left, width: pos.width, ...(pos.up ? { bottom: window.innerHeight - pos.top } : { top: pos.top }) }}
            className="fixed z-[10000] flex max-h-[340px] flex-col overflow-hidden rounded-xl border border-[var(--sand-border)] bg-[var(--card-bg)] shadow-xl"
          >
            <div className="flex items-center gap-2 border-b border-[var(--sand-border)] px-3">
              <Search className="h-4 w-4 text-[var(--text-secondary)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                placeholder="Ketik untuk mencari Sub-RK…"
                className="h-11 w-full bg-transparent text-sm text-[var(--text-primary)] outline-none"
              />
            </div>
            <div className="overflow-y-auto p-1">
              {list.saran.length > 0 && (
                <div className="px-3 pb-1 pt-2 text-xs font-medium text-[var(--text-secondary)]">Usulan</div>
              )}
              {list.saran.map((rk, i) => item(rk, i, true))}
              {list.saran.length > 0 && list.lain.length > 0 && (
                <div className="px-3 pb-1 pt-2 text-xs font-medium text-[var(--text-secondary)]">Semua Sub-RK</div>
              )}
              {list.lain.map((rk, i) => item(rk, list.saran.length + i, false))}
              {list.ekstra.length > 0 && (
                <div className="px-3 pb-1 pt-2 text-xs font-medium text-[var(--text-secondary)]">
                  Lainnya (termasuk nama kegiatan dari CKP lama)
                </div>
              )}
              {list.ekstra.map((rk, i) => item(rk, list.saran.length + list.lain.length + i, false))}
              {!showExtra && extraOptions.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowExtra(true);
                    inputRef.current?.focus();
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-[var(--primary)] hover:underline"
                >
                  Tampilkan {extraOptions.length} pilihan lain (termasuk nama kegiatan dari CKP lama)
                </button>
              )}
              {list.semua.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-[var(--text-secondary)]">
                  Tidak ada Sub-RK yang cocok. Sub-RK baru ditambahkan di menu Rencana Kinerja.
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
