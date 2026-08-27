import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MonitoringPenilaianClient from './_client';

export default async function PimpinanMonitoringPenilaianPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user || (user.role !== 'pimpinan' && user.role !== 'admin')) {
    redirect('/login');
  }

  return <MonitoringPenilaianClient />;
}
