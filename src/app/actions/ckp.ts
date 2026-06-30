'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

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
