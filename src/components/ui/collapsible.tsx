"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Panel yang terlipat (expand/collapse) dengan mulus.
 *
 * Cara kerjanya: tinggi panel dianimasikan dari `0fr` → `1fr` lewat
 * `grid-template-rows` (bukan `max-height`, yang selalu menebak dan
 * bisa memotong isi yang tinggi).
 *
 * Isi TIDAK dilepas dari DOM saat tertutup — melainkan disembunyikan
 * dengan `visibility`, sehingga:
 *  - transisi buka/tutup selalu bisa dimainkan (tidak ada
 *    "muncul sudah terbuka" tanpa animasi);
 *  - elemen di dalam tidak bisa di-fokus saat panel tertutup.
 *
 * Contoh:
 *   <Collapsible open={expanded}>
 *     <DetailPanel />
 *   </Collapsible>
 */
export interface CollapsibleProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  /** Kelas untuk elemen membungkus children di dalam grid. */
  contentClassName?: string;
}

export function Collapsible({
  open,
  children,
  className,
  contentClassName,
}: CollapsibleProps) {
  const [expanded, setExpanded] = React.useState(open);

  React.useEffect(() => {
    // Ubah state di frame berikutnya supaya transisi punya state "dari"
    // (tertutup → terbuka) dan tidak melompat.
    const raf = requestAnimationFrame(() => setExpanded(open));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  return (
    <div
      className={cn('sikap-reveal', className)}
      data-open={expanded ? 'true' : 'false'}
    >
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
