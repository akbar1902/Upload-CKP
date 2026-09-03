import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ExportPenilaianClient from './_client';
import { getDefaultPeriod } from '@/lib/utils';
import { getExportPenilaianData } from '@/app/actions/export';

export const dynamic = 'force-dynamic';

export default async function AdminExportPenilaianPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const defaultPeriod = getDefaultPeriod(10);
  const bulan = resolvedParams.bulan ? parseInt(resolvedParams.bulan as string) : defaultPeriod.bulan;
  const tahun = resolvedParams.tahun ? parseInt(resolvedParams.tahun as string) : defaultPeriod.tahun;

  const initialData = await getExportPenilaianData(bulan, tahun);

  return (
    <ExportPenilaianClient
      initialBulan={bulan}
      initialTahun={tahun}
      initialData={initialData}
    />
  );
}
