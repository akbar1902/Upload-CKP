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

    // Insert Audit Log for creation
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'rk_created',
      entity_type: 'rencana_kinerja',
      entity_id: rkData.id,
      new_data: { rencana_kinerja: rencanaKinerja, tim_kerja: timKerja }
    });

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
      } else {
        // Log mass assignment? Optional, we can skip for now or log individual
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

    // Get old RK for audit log
    const { data: oldRk } = await supabase.from('rk_ketua_tim_mapping').select('*').eq('id', rkId).single();

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

    if (oldRk && (oldRk.rencana_kinerja !== newRencanaKinerja || oldRk.tim_kerja !== timKerja)) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'rk_updated',
        entity_type: 'rencana_kinerja',
        entity_id: rkId,
        old_data: { rencana_kinerja: oldRk.rencana_kinerja, tim_kerja: oldRk.tim_kerja },
        new_data: { rencana_kinerja: newRencanaKinerja, tim_kerja: timKerja }
      });
    }

    // Fetch old assignments for audit
    const { data: oldAssignments } = await supabase.from('user_rk_assignments').select('user_id').eq('rk_id', rkId);
    const oldAssigneeIds = (oldAssignments || []).map(a => a.user_id);

    // Sync assignments
    await supabase.from('user_rk_assignments').delete().eq('rk_id', rkId);
    if (assigneeIds.length > 0) {
      const newAssignments = assigneeIds.map(userId => ({
        rk_id: rkId,
        user_id: userId,
        assigned_by: user.id
      }));
      await supabase.from('user_rk_assignments').insert(newAssignments);
    }

    // Log assignment changes
    const addedIds = assigneeIds.filter(id => !oldAssigneeIds.includes(id));
    const removedIds = oldAssigneeIds.filter(id => !assigneeIds.includes(id));

    if (addedIds.length > 0 || removedIds.length > 0) {
      const { data: usersData } = await supabase.from('users').select('id, full_name').in('id', [...addedIds, ...removedIds]);
      const userMap = new Map((usersData || []).map(u => [u.id, u.full_name]));

      const auditLogsToInsert = [];
      for (const id of addedIds) {
        auditLogsToInsert.push({
          user_id: user.id,
          action: 'rk_assigned',
          entity_type: 'rencana_kinerja',
          entity_id: rkId,
          new_data: { rencana_kinerja: newRencanaKinerja, tim_kerja: timKerja, assignee_name: userMap.get(id) || 'Pegawai' }
        });
      }
      for (const id of removedIds) {
        auditLogsToInsert.push({
          user_id: user.id,
          action: 'rk_unassigned',
          entity_type: 'rencana_kinerja',
          entity_id: rkId,
          old_data: { rencana_kinerja: newRencanaKinerja, tim_kerja: timKerja, assignee_name: userMap.get(id) || 'Pegawai' }
        });
      }
      
      if (auditLogsToInsert.length > 0) {
        const { error: insertError } = await supabase.from('audit_logs').insert(auditLogsToInsert);
        if (insertError) {
          console.error("Failed to insert audit logs:", insertError);
        }
      }
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Sesi berakhir' };

    const { data: oldRk } = await supabase.from('rk_ketua_tim_mapping').select('*').eq('id', rkId).single();

    const { error } = await supabase
      .from('rk_ketua_tim_mapping')
      .delete()
      .eq('id', rkId);

    if (error) return { success: false, error: error.message };

    if (oldRk) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'rk_deleted',
        entity_type: 'rencana_kinerja',
        entity_id: rkId, // Even if deleted, keep reference
        old_data: { rencana_kinerja: oldRk.rencana_kinerja, tim_kerja: oldRk.tim_kerja }
      });
    }
    
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

    const { data: rk } = await supabase.from('rk_ketua_tim_mapping').select('*').eq('id', rkId).single();

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

    if (rk) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'rk_self_assigned',
        entity_type: 'rencana_kinerja',
        entity_id: rkId,
        new_data: { rencana_kinerja: rk.rencana_kinerja, tim_kerja: rk.tim_kerja }
      });
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Sesi berakhir' };

    // Note: TypeScript doesn't natively know about the join without explicit cast if we use loosely typed supabase
    const { data: assignmentData } = await supabase
      .from('user_rk_assignments')
      .select('*, rk:rk_ketua_tim_mapping(id, rencana_kinerja, tim_kerja)')
      .eq('id', id)
      .single() as any;

    const { error } = await supabase
      .from('user_rk_assignments')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    if (assignmentData && assignmentData.rk) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'rk_unassigned',
        entity_type: 'rencana_kinerja',
        entity_id: assignmentData.rk.id,
        old_data: { rencana_kinerja: assignmentData.rk.rencana_kinerja, tim_kerja: assignmentData.rk.tim_kerja }
      });
    }
    
    revalidatePath('/rencana_kinerja');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}
