import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MonitoringPenilaianClient from '@/app/pimpinan/monitoring-penilaian/_client';

export default async function AdminMonitoringPenilaianPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  const appRole = user?.user_metadata?.role;

  if (!user || appRole !== 'admin') {
    redirect('/login');
  }

  return <MonitoringPenilaianClient />;
}
