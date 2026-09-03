'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

export async function saveKegiatanAnggotaMapping(mappings: any[]) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { error } = await supabaseAdmin.from('master_kegiatan_anggota').insert(mappings);
    if (error) throw new Error(error.message);
    
    return { success: true };
  } catch (error: any) {
    console.error('[saveKegiatanAnggotaMapping] Error:', error);
    return { success: false, error: error.message };
  }
}


export async function getMasterKegiatanAnggota() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data, error } = await supabaseAdmin
      .from('master_kegiatan_anggota')
      .select('kegiatan_nama, rk_ketua_tim_mapping(rencana_kinerja)')
      .limit(10000);
      
    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: any) {
    console.error('[getMasterKegiatanAnggota] Error:', error);
    return [];
  }
}

export async function getUploadMasterData() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const [rksRes, ketuasRes, kegiatanRes] = await Promise.all([
      supabaseAdmin.from('rk_ketua_tim_mapping').select('id, rencana_kinerja, tim_kerja, ketua_tim_id').limit(10000),
      supabaseAdmin.from('users').select('id, full_name, unit_kerja').in('role', ['ketua_tim', 'pimpinan', 'admin']),
      supabaseAdmin.from('master_kegiatan_anggota').select('kegiatan_nama, rk_ketua_tim_mapping(rencana_kinerja)').limit(10000),
    ]);

    return {
      masterRKs: rksRes.data || [],
      ketuaTims: ketuasRes.data || [],
      masterKegiatan: kegiatanRes.data || [],
    };
  } catch (error: any) {
    console.error('[getUploadMasterData] Error:', error);
    return { masterRKs: [], ketuaTims: [], masterKegiatan: [] };
  }
}

export async function checkPeriodStatusAction(userId: string, bulan: number, tahun: number) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const [lockRes, uploadRes] = await Promise.all([
      supabaseAdmin.from('periode_ckp').select('is_locked').eq('bulan', bulan).eq('tahun', tahun).maybeSingle(),
      supabaseAdmin.from('ckp_uploads').select('id, version, status').eq('user_id', userId).eq('bulan', bulan).eq('tahun', tahun).order('version', { ascending: false }).limit(1).maybeSingle(),
    ]);

    return {
      isLocked: !!lockRes.data?.is_locked,
      existingUpload: uploadRes.data || null,
    };
  } catch (error: any) {
    console.error('[checkPeriodStatusAction] Error:', error);
    return { isLocked: false, existingUpload: null };
  }
}

export async function deleteCkpUploadAction(uploadId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // 1. Fetch the upload to verify ownership and status
    const { data: upload, error: fetchError } = await supabase
      .from('ckp_uploads')
      .select('user_id, status, storage_path')
      .eq('id', uploadId)
      .single();

    if (fetchError || !upload) {
      throw new Error('Data CKP tidak ditemukan');
    }

    if (upload.user_id !== user.id) {
      throw new Error('Anda tidak memiliki akses untuk menghapus CKP ini');
    }

    if (upload.status === 'approved') {
      throw new Error('CKP yang sudah disetujui (Approved) tidak dapat dihapus');
    }

    // 2. Delete the actual record
    await supabase.from('ckp_entries').delete().eq('upload_id', uploadId);

    const { error: deleteError } = await supabase
      .from('ckp_uploads')
      .delete()
      .eq('id', uploadId);

    if (deleteError) {
      throw new Error(`Gagal menghapus dari database: ${deleteError.message}`);
    }

    // 3. Delete the file from storage if it exists
    if (upload.storage_path) {
      supabase.storage.from('ckp-files').remove([upload.storage_path]).catch((err: any) => {
        console.error('Failed to remove file from storage:', err);
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('[deleteCkpUploadAction] Error:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan' };
  }
}

export async function moveEntriesAction(entryIds: string[], targetMoveRk: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || !['ketua_tim', 'pimpinan', 'admin'].includes(userData.role)) {
      throw new Error('Unauthorized: Hanya pimpinan atau ketua tim yang dapat memindah RK.');
    }

    // Bypass RLS using service role to prevent any policy issues when moving across teams
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { error } = await supabaseAdmin
      .from('ckp_entries')
      .update({ rencana_kinerja: targetMoveRk })
      .in('id', entryIds);

    if (error) {
      throw new Error(`Gagal update DB: ${error.message}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('[moveEntriesAction] Error:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan' };
  }
}

export async function markEntryAction(entryId: string, catatanKoreksi: string | null) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || !['ketua_tim', 'pimpinan', 'admin'].includes(userData.role)) {
      throw new Error('Unauthorized: Hanya reviewer yang dapat memberikan catatan.');
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Update the entry
    const { data: entryData, error: entryError } = await supabaseAdmin
      .from('ckp_entries')
      .update({ catatan_koreksi: catatanKoreksi || null })
      .eq('id', entryId)
      .select('upload_id')
      .single();

    if (entryError) {
      throw new Error(`Gagal menyimpan catatan: ${entryError.message}`);
    }

    // If a note was added, we should set the upload status to revision_required
    // so the Pegawai sees the warning on their dashboard immediately
    if (catatanKoreksi && entryData?.upload_id) {
      const { error: uploadError } = await supabaseAdmin
        .from('ckp_uploads')
        .update({ status: 'revision_required' })
        .eq('id', entryData.upload_id)
        .eq('status', 'submitted'); // Only change if it's currently submitted to prevent overriding 'approved' etc
        
      if (uploadError) {
        console.error('[markEntryAction] Failed to update upload status:', uploadError);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('[markEntryAction] Error:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan' };
  }
}

