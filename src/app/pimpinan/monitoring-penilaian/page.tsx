import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MonitoringPenilaianClient from './_client';

export default async function PimpinanMonitoringPenilaianPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const appRole = user?.user_metadata?.role;

  if (!user || (appRole !== 'pimpinan' && appRole !== 'admin')) {
    redirect('/login');
  }

  return <MonitoringPenilaianClient />;
}
