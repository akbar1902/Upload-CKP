import React from 'react';
import { PageTransition } from '@/components/layout/page-transition';

/**
 * Template route-group — di-remount tiap navigasi (semantik `template.tsx` Next),
 * memberi entrance konten halaman via <ViewTransition>. Shell (Sidebar) berada di
 * layout — di luar template — sehingga tidak ikut remount (MOTION-SPEC §C1/C2).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
