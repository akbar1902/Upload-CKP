import { createAdminClient } from '@/lib/supabase/server';
import { getBulanName } from '@/lib/utils';

export type NotificationType =
  | 'approved'
  | 'rejected'
  | 'revision_required'
  | 'reopened'
  | 'scored'
  | 'submitted';

interface NotifyInput {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  uploadId?: string;
  actorId?: string;
}

/** Insert satu notifikasi via service-role (bypass RLS). Gagal = warn, bukan throw. */
export async function notify(input: NotifyInput): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from('notifications').insert({
      user_id: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      upload_id: input.uploadId ?? null,
      actor_id: input.actorId ?? null,
    });
  } catch (err) {
    console.warn('[notify] gagal kirim notifikasi:', err);
  }
}

/** Ambil periode "Bulan X Tahun" dari upload untuk copy notifikasi. */
export async function getUploadPeriodLabel(uploadId: string): Promise<string> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('ckp_uploads')
      .select('bulan, tahun')
      .eq('id', uploadId)
      .maybeSingle();
    if (!data) return '';
    return `${getBulanName(data.bulan)} ${data.tahun}`;
  } catch {
    return '';
  }
}

/** Semua user aktif yang perlu tahu ada upload baru: pimpinan + admin. */
export async function getReviewerIds(): Promise<string[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('users')
      .select('id')
      .in('role', ['pimpinan', 'admin'])
      .eq('is_active', true);
    return (data ?? []).map((u) => u.id);
  } catch {
    return [];
  }
}

/** Pemilik upload (penerima notifikasi hasil review/penilaian). */
export async function getUploadOwnerId(uploadId: string): Promise<string | null> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('ckp_uploads')
      .select('user_id')
      .eq('id', uploadId)
      .maybeSingle();
    return data?.user_id ?? null;
  } catch {
    return null;
  }
}
