"use server";

import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function saveScoreAction(entryId: string, score: number | null) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Auth validation on the server
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi berakhir' };
    }

    const { error } = await supabase
      .from('ckp_entries')
      .update({ nilai_pimpinan: score })
      .eq('id', entryId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}

export async function bulkSaveScoreAction(uploadId: string, score: number | null) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi berakhir' };
    }

    const { error } = await supabase
      .from('ckp_entries')
      .update({ nilai_pimpinan: score })
      .eq('upload_id', uploadId);

    if (error) {
      return { success: false, error: error.message };
    }

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
      action, 
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
