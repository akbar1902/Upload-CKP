"use server";

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { gradeRencanaKinerjaAction as gradeRencanaKinerjaActionMain } from '@/app/actions/penilaian';

// This function grades ALL entries under a specific Rencana Kinerja for a given upload
export async function gradeRencanaKinerjaAction(uploadId: string, rencanaKinerja: string, score: number | null) {
  return gradeRencanaKinerjaActionMain(uploadId, rencanaKinerja, score);
}

export async function approveAction(uploadId: string, action: string, catatan: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi berakhir' };
    }

    const newStatus = action === 'reopened' ? 'draft' : action;
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

    const { error: updateError } = await supabase
      .from('ckp_uploads')
      .update(updateData)
      .eq('id', uploadId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Insert approval history
    await supabase.from('approvals').insert({ 
      upload_id: uploadId, 
      reviewer_id: user.id, 
      action: action as any, 
      catatan 
    });

    // Insert audit log
    await supabase.from('audit_logs').insert({
      user_id: user.id, 
      action: `${action}_ckp`,
      entity_type: 'ckp_uploads', 
      entity_id: uploadId,
      new_data: { status: newStatus, catatan },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}
