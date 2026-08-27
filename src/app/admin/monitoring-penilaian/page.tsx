import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MonitoringPenilaianClient from '@/app/pimpinan/monitoring-penilaian/_client';

export default async function AdminMonitoringPenilaianPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return <MonitoringPenilaianClient />;
}
