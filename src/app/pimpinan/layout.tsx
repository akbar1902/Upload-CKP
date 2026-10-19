import React from 'react';
import { AppShell } from '@/components/layout/app-shell';

export default function PimpinanLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
