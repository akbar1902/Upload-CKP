import React from 'react';
import { AppShell } from '@/components/layout/app-shell';

export default function MonitoringLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
