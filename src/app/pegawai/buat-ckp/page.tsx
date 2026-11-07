import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import BuatCkpClient from './_client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Buat CKP',
  description: 'Unggah bukti dukung, koreksi draft, lalu submit CKP langsung di SIKAP.',
};

export default async function BuatCkpPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Dibaca saat request agar Client ID bisa diganti di Vercel tanpa build ulang.
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';

  return <BuatCkpClient googleClientId={clientId} />;
}
