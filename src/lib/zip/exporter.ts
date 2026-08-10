import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getBulanName } from '@/lib/utils';
import type { CKPUpload, User } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

export async function downloadAllCkpZip(
  uploads: (CKPUpload & { user?: User })[],
  bulan: string | number,
  tahun: number
): Promise<void> {
  if (!uploads || uploads.length === 0) {
    throw new Error('Tidak ada data CKP untuk didownload');
  }

  const supabase = createClient();
  const zip = new JSZip();

  // Create a folder inside the ZIP
  const periodStr = typeof bulan === 'string' && bulan.startsWith('T')
    ? { 'T1': 'Triwulan_I', 'T2': 'Triwulan_II', 'T3': 'Triwulan_III', 'T4': 'Triwulan_IV' }[bulan] || bulan
    : getBulanName(bulan as number);
    
  const folderName = `Berkas_CKP_${periodStr}_${tahun}`;
  const folder = zip.folder(folderName);
  
  if (!folder) {
    throw new Error('Gagal membuat folder di dalam ZIP');
  }

  const failedFiles: string[] = [];
  
  // Download files concurrently using Promise.all
  const downloadPromises = uploads.map(async (upload) => {
    if (!upload.storage_path) {
      return; // Skip if no file uploaded
    }
    
    try {
      const { data, error } = await supabase.storage
        .from('ckp-files')
        .download(upload.storage_path);
        
      if (error || !data) {
        throw new Error(error?.message || 'Data tidak ditemukan');
      }
      
      const fileExt = upload.storage_path.split('.').pop() || 'xlsx';
      const safeName = (upload.user?.full_name || 'Tanpa Nama').replace(/[\\/:*?"<>|]/g, '_');
      const fileName = `${safeName} - CKP ${periodStr} ${tahun}.${fileExt}`;
      
      folder.file(fileName, data);
    } catch (err) {
      console.error(`Gagal mendownload file untuk ${upload.user?.full_name}:`, err);
      failedFiles.push(upload.user?.full_name || 'Tanpa Nama');
    }
  });

  await Promise.all(downloadPromises);

  // Note: JSZip creates a folder object but folder.files might not have the correct length 
  // directly for its children in some older versions, but zip.files has all files.
  const zipFilesCount = Object.keys(zip.files).length;
  // If only the folder exists, count is 1. If files exist, count > 1.
  if (zipFilesCount <= 1) {
    throw new Error('Tidak ada satupun file yang berhasil didownload (mungkin pegawai belum mengupload file aslinya)');
  }

  // Generate the zip and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${folderName}.zip`);
  
  if (failedFiles.length > 0) {
    throw new Error(`ZIP berhasil dibuat, namun gagal mendownload file dari: ${failedFiles.join(', ')}`);
  }
}
