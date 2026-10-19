import React from 'react';
import { AppShell } from '@/components/layout/app-shell';

export default function PegawaiLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
