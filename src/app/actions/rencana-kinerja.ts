"use server";

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Interface for action responses
interface ActionResponse {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Add a new Rencana Kinerja to the global dictionary
 * and assign it to selected employees.
 */
export async function addRencanaKinerjaAction(
  rencanaKinerja: string,
  timKerja: string,
  ketuaTimId: string,
  assigneeIds: string[] = []
): Promise<ActionResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Sesi berakhir' };

    // 1. Insert to rk_ketua_tim_mapping (Global Dictionary)
    const { data: rkData, error: rkError } = await supabase
      .from('rk_ketua_tim_mapping')
      .insert({
        rencana_kinerja: rencanaKinerja,
        ketua_tim_id: ketuaTimId,
        tim_kerja: timKerja,
        created_by: user.id
      })
      .select('id, rencana_kinerja')
      .single();

    if (rkError) {
      if (rkError.code === '23505') { // Unique violation
        return { success: false, error: 'Rencana Kinerja tersebut sudah terdaftar di tim ini.' };
      }
      return { success: false, error: rkError.message };
    }

    // 2. Insert assignments to user_rk_assignments
    if (assigneeIds.length > 0 && rkData) {
      const assignments = assigneeIds.map(userId => ({
        rk_id: rkData.id,
        user_id: userId,
        assigned_by: user.id
      }));

      const { error: assignError } = await supabase
        .from('user_rk_assignments')
        .insert(assignments);

      if (assignError) {
        console.error('Error assigning users:', assignError);
        // We don't fail the whole action if just assignments fail, 
        // because the RK is already created. But we could return a warning.
      }
    }

    revalidatePath('/rencana_kinerja');
    return { success: true, data: rkData };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}

/**
 * Update an existing Rencana Kinerja and its assignments.
 */
export async function updateRencanaKinerjaAction(
  rkId: string,
  newRencanaKinerja: string,
  timKerja: string,
  assigneeIds: string[] = []
): Promise<ActionResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Sesi berakhir' };

    // 1. Update the rk_ketua_tim_mapping
    // Note: updating primary/unique key can be risky if referenced elsewhere without CASCADE.
    // In our schema, user_rk_assignments has ON UPDATE CASCADE.
    // ckp_entries only has it as a plain TEXT column, so it won't break foreign keys, 
    // but it WILL detach from old CKP entries unless we also update ckp_entries manually.
    // For now, let's just update the mapping table.
    const { error: updateError } = await supabase
      .from('rk_ketua_tim_mapping')
      .update({
        rencana_kinerja: newRencanaKinerja,
        tim_kerja: timKerja,
      })
      .eq('id', rkId);

    if (updateError) {
      if (updateError.code === '23505') return { success: false, error: 'Nama RK baru sudah digunakan.' };
      return { success: false, error: updateError.message };
    }

    // Since user_rk_assignments cascades, the rencana_kinerja column there is updated.
    // Now we need to sync the assignees.
    // Easiest way: delete all current assignments for this RK, then re-insert.
    // But we only delete assignments made by this user, OR just delete all assignments for this RK if the user owns it.
    
    await supabase.from('user_rk_assignments').delete().eq('rk_id', rkId);
    
    if (assigneeIds.length > 0) {
      const newAssignments = assigneeIds.map(userId => ({
        rk_id: rkId,
        user_id: userId,
        assigned_by: user.id
      }));
      await supabase.from('user_rk_assignments').insert(newAssignments);
    }

    revalidatePath('/rencana_kinerja');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}

/**
 * Delete a Rencana Kinerja from the global dictionary.
 */
export async function deleteRencanaKinerjaAction(
  rkId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('rk_ketua_tim_mapping')
      .delete()
      .eq('id', rkId);

    if (error) return { success: false, error: error.message };
    
    revalidatePath('/rencana_kinerja');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}

/**
 * Assign the logged-in user to an existing Rencana Kinerja (Self-assign)
 */
export async function assignSelfToRencanaKinerjaAction(
  rkId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Sesi berakhir' };

    const { error } = await supabase
      .from('user_rk_assignments')
      .insert({
        rk_id: rkId,
        user_id: user.id,
        assigned_by: user.id
      });

    if (error) {
      if (error.code === '23505') return { success: false, error: 'Anda sudah tertugaskan pada RK ini.' };
      return { success: false, error: error.message };
    }

    revalidatePath('/rencana_kinerja');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}

/**
 * Remove an assignment (Unassign)
 */
export async function removeAssignmentAction(
  id: string
): Promise<ActionResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('user_rk_assignments')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    
    revalidatePath('/rencana_kinerja');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}
