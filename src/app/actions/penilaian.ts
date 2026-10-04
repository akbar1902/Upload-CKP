"use server";

import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { notify, getUploadOwnerId, getUploadPeriodLabel } from '@/lib/notifications';

const APPROVE_COPY: Record<string, { type: 'approved' | 'rejected' | 'revision_required' | 'reopened'; title: string }> = {
  approved: { type: 'approved', title: 'CKP disetujui' },
  rejected: { type: 'rejected', title: 'CKP ditolak' },
  revision_required: { type: 'revision_required', title: 'CKP perlu revisi' },
  reopened: { type: 'reopened', title: 'CKP dibuka kembali' },
};

export async function gradeRencanaKinerjaAction(uploadIds: string | string[], rencanaKinerja: string, score: number | null) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Auth validation on the server
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi berakhir' };
    }

    // Accept both single string and array for backward compatibility
    const ids = Array.isArray(uploadIds) ? uploadIds : [uploadIds];

    const { error } = await supabase
      .from('ckp_entries')
      .update({ 
        nilai: score,
        dinilai_oleh: score !== null ? user.id : null
      })
      .in('upload_id', ids)
      .eq('rencana_kinerja', rencanaKinerja);

    if (error) {
      return { success: false, error: error.message };
    }

    // Auto-update status to 'scored' if all entries across ALL RKs have a score.
    // MUST use adminClient here to bypass RLS, otherwise a Ketua Tim only sees entries
    // for their assigned RK and allScored will erroneously evaluate to true when only 1 RK is graded!
    const adminClient = createAdminClient();
    const { data: uploads } = await adminClient
      .from('ckp_uploads')
      .select('id, status')
      .in('id', ids);

    for (const upload of uploads || []) {
      if (upload.status !== 'submitted' && upload.status !== 'scored') continue;

      const { data: entries } = await adminClient
        .from('ckp_entries')
        .select('nilai')
        .eq('upload_id', upload.id);
        
      const allScored = entries && entries.length > 0 && entries.every(e => e.nilai !== null);
      const newStatus = allScored ? 'scored' : 'submitted';

      if (upload.status !== newStatus) {
        await adminClient
          .from('ckp_uploads')
          .update({ status: newStatus })
          .eq('id', upload.id);

        // Notifikasi 'sudah dinilai' ke pemilik saat semua entri selesai dinilai
        if (newStatus === 'scored') {
          const { data: owner } = await adminClient
            .from('ckp_uploads')
            .select('user_id')
            .eq('id', upload.id)
            .maybeSingle();
          if (owner?.user_id) {
            await notify({
              userId: owner.user_id,
              type: 'scored',
              title: 'CKP sudah dinilai',
              body: 'Semua kegiatan sudah dinilai — menunggu keputusan pimpinan.',
              uploadId: upload.id,
              actorId: user.id,
            });
          }
        }
      }
    }

    revalidatePath('/pegawai');
    revalidatePath('/ketua_tim');
    revalidatePath('/pimpinan');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}

export async function approveAction(uploadId: string, action: string, catatan: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi berakhir' };
    }

    const adminClient = createAdminClient();
    let newStatus = action;

    if (action === 'reopened') {
      // Reopening an approved CKP should allow re-evaluation and re-approval.
      // If all entries already have scores, status is 'scored', otherwise 'submitted'.
      const { data: entries } = await adminClient
        .from('ckp_entries')
        .select('nilai')
        .eq('upload_id', uploadId);

      const allScored = entries && entries.length > 0 && entries.every(e => e.nilai !== null);
      newStatus = allScored ? 'scored' : 'submitted';
    }

    const isApproved = action === 'approved';

    const updateData: Record<string, unknown> = {
      status: newStatus,
      catatan_pimpinan: catatan || null,
    };
    
    if (isApproved) {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = user.id;
    } else if (action === 'reopened') {
      updateData.approved_at = null;
      updateData.approved_by = null;
    }

    const { error: updateError } = await adminClient
      .from('ckp_uploads')
      .update(updateData)
      .eq('id', uploadId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Insert approval history
    await adminClient.from('approvals').insert({ 
      upload_id: uploadId, 
      reviewer_id: user.id, 
      action: action as any, 
      catatan 
    });

    // Insert audit log
    await adminClient.from('audit_logs').insert({
      user_id: user.id, 
      action: `${action}_ckp`,
      entity_type: 'ckp_uploads', 
      entity_id: uploadId,
      new_data: { status: newStatus, catatan },
    });

    revalidatePath('/penilaian/[upload_id]', 'page');
    revalidatePath('/pimpinan');
    revalidatePath('/ketua_tim');
    revalidatePath('/pegawai');

    // Notifikasi ke pemilik upload (best-effort, tidak menggagalkan aksi)
    const copy = APPROVE_COPY[action];
    if (copy) {
      const ownerId = await getUploadOwnerId(uploadId);
      if (ownerId) {
        const period = await getUploadPeriodLabel(uploadId);
        const body = period
          ? `CKP periode ${period}${catatan ? ` — catatan: ${catatan}` : ''}`
          : (catatan || undefined);
        await notify({
          userId: ownerId,
          type: copy.type,
          title: copy.title,
          body,
          uploadId,
          actorId: user.id,
        });
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}
