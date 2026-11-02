import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import ApprovalClient from './_client';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Persetujuan Cepat - Upload CKP',
};

export default async function PimpinanApprovalPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/login');

  // Hanya pimpinan yang boleh menyetujui CKP. Admin (dan peran lain)
  // bersifat view-only dan diarahkan ke halaman monitoring.
  const metadataRole = user.user_metadata?.role;
  let role: string | null = typeof metadataRole === 'string' ? metadataRole : null;
  if (!role || role === 'pegawai') {
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    role = dbUser?.role ?? role;
  }

  if (role !== 'pimpinan') {
    redirect(role === 'admin' ? '/admin' : '/monitoring');
  }

  return (
    <Suspense fallback={null}>
      <ApprovalClient />
    </Suspense>
  );
}
