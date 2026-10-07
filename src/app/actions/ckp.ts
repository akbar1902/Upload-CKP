'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { notify, getReviewerIds } from '@/lib/notifications';
import { getBulanName } from '@/lib/utils';

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
      .select('kegiatan_nama, rk_ketua_tim_mapping!inner(rencana_kinerja)')
      .eq('rk_ketua_tim_mapping.is_active', true)
      .limit(10000);
      
    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: any) {
    console.error('[getMasterKegiatanAnggota] Error:', error);
    return [];
  }
}

export async function getUploadMasterData() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [rksRes, ketuasRes, kegiatanRes] = await Promise.all([
    supabaseAdmin.from('rk_ketua_tim_mapping').select('id, rencana_kinerja, tim_kerja, ketua_tim_id').eq('is_active', true).limit(10000),
    supabaseAdmin.from('users').select('id, full_name, unit_kerja').in('role', ['ketua_tim', 'pimpinan', 'admin']),
    supabaseAdmin.from('master_kegiatan_anggota').select('kegiatan_nama, rk_ketua_tim_mapping!inner(rencana_kinerja)').eq('rk_ketua_tim_mapping.is_active', true).limit(10000),
  ]);

  // JANGAN telan error menjadi data kosong. Data kosong yang ter-cache membuat
  // RK yang sudah dikenal (termasuk hasil mapping upload sebelumnya) dianggap
  // "tak dikenal" lagi. Biarkan error naik agar client retry / pakai cache lama.
  if (rksRes.error) throw new Error(rksRes.error.message);
  if (ketuasRes.error) throw new Error(ketuasRes.error.message);
  if (kegiatanRes.error) throw new Error(kegiatanRes.error.message);

  return {
    masterRKs: rksRes.data || [],
    ketuaTims: ketuasRes.data || [],
    masterKegiatan: kegiatanRes.data || [],
  };
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

    revalidatePath('/pegawai');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (error: any) {
    console.error('[deleteCkpUploadAction] Error:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan' };
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function moveEntriesAction(entryIds: string[], targetMoveRk: string) {
  try {
    if (!Array.isArray(entryIds) || entryIds.length === 0) {
      throw new Error('Tidak ada kegiatan yang dipilih untuk dipindah.');
    }
    const targetRaw = (targetMoveRk || '').trim();
    if (!targetRaw) {
      throw new Error('Target RK tidak valid.');
    }

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
    const callerRole = userData.role;

    // Bypass RLS using service role — otorisasi ditegakkan manual di bawah.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Resolve target: UUID langsung, atau nama (kompat dialog lama yg kirim string nama).
    let targetRkId: string;
    let targetRkName: string;
    if (UUID_RE.test(targetRaw)) {
      const { data: m, error: mErr } = await supabaseAdmin
        .from('rk_ketua_tim_mapping')
        .select('id, rencana_kinerja, ketua_tim_id')
        .eq('id', targetRaw)
        .maybeSingle();
      if (mErr || !m) {
        throw new Error('Target RK tidak dikenal. Pilih dari daftar yang tersedia.');
      }
      targetRkId = m.id;
      targetRkName = m.rencana_kinerja;
      if (callerRole === 'ketua_tim' && m.ketua_tim_id !== user.id) {
        throw new Error('Anda hanya dapat memindah ke RK tim Anda sendiri.');
      }
    } else {
      const { data: matches, error: mErr } = await supabaseAdmin
        .from('rk_ketua_tim_mapping')
        .select('id, rencana_kinerja, ketua_tim_id')
        .ilike('rencana_kinerja', targetRaw)
        .eq('is_active', true);
      if (mErr) {
        throw new Error(`Gagal memvalidasi RK tujuan: ${mErr.message}`);
      }
      const norm = targetRaw.toLowerCase();
      const exact = (matches || []).filter((m: any) => String(m.rencana_kinerja).toLowerCase() === norm);
      const cands = exact.length > 0 ? exact : (matches || []);
      if (cands.length === 0) {
        throw new Error(`RK "${targetRaw}" tidak dikenal. Pilih dari daftar yang tersedia.`);
      }
      if (cands.length > 1) {
        throw new Error(`Nama RK "${targetRaw}" ambigu (${cands.length} kandidat tim berbeda). Minta pimpinan/admin memindah via UUID.`);
      }
      const m = cands[0];
      targetRkId = m.id;
      targetRkName = m.rencana_kinerja;
      if (callerRole === 'ketua_tim' && m.ketua_tim_id !== user.id) {
        throw new Error('Anda hanya dapat memindah ke RK tim Anda sendiri.');
      }
    }

    // Tolak bila ada upload yg sudah approved.
    const { data: entries, error: eErr } = await supabaseAdmin
      .from('ckp_entries')
      .select('id, upload_id')
      .in('id', entryIds);
    if (eErr || !entries || entries.length === 0) {
      throw new Error('Data kegiatan tidak ditemukan.');
    }
    if (entries.length !== entryIds.length) {
      throw new Error('Sebagian kegiatan tidak ditemukan. Muat ulang dan coba lagi.');
    }
    const uploadIds = Array.from(new Set(entries.map((e: any) => e.upload_id)));
    const { data: uploads } = await supabaseAdmin
      .from('ckp_uploads')
      .select('id, status, user_id')
      .in('id', uploadIds);
    if ((uploads || []).some((u: any) => u.status === 'approved')) {
      throw new Error('CKP yang sudah disetujui (Approved) tidak dapat dipindah.');
    }
    // Ketua tim tidak boleh memindah kegiatan miliknya sendiri (dinilai pimpinan).
    if (callerRole === 'ketua_tim' && (uploads || []).some((u: any) => u.user_id === user.id)) {
      throw new Error('Ketua tim tidak dapat memindah kegiatan milik sendiri — harus dinilai pimpinan.');
    }

    // Update ATOMIK nama + UUID dalam 1 update (hindari split-brain).
    const { error } = await supabaseAdmin
      .from('ckp_entries')
      .update({ rencana_kinerja: targetRkName, rk_ketua_tim_id: targetRkId })
      .in('id', entryIds);

    if (error) {
      throw new Error(`Gagal update DB: ${error.message}`);
    }

    try {
      await supabaseAdmin.from('audit_logs').insert({
        user_id: user.id,
        action: 'move_entries',
        entity_type: 'ckp_entries',
        entity_id: entryIds.length === 1 ? entryIds[0] : null,
        new_data: { entry_ids: entryIds, target_rk_id: targetRkId, target_rk_name: targetRkName },
      });
    } catch (auditErr) {
      console.warn('[moveEntriesAction] Audit log warning:', auditErr);
    }

    revalidatePath('/ketua_tim');
    revalidatePath('/pimpinan');
    revalidatePath('/', 'layout');

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

    // Ketua tim tidak boleh memberi catatan koreksi ke CKP miliknya sendiri.
    if (userData.role === 'ketua_tim') {
      const { data: targetEntry } = await supabaseAdmin
        .from('ckp_entries')
        .select('upload_id, ckp_uploads!inner(user_id)')
        .eq('id', entryId)
        .maybeSingle();
      const ownerId = (targetEntry?.ckp_uploads as any)?.user_id;
      if (ownerId === user.id) {
        throw new Error('Ketua tim tidak dapat memberi catatan ke CKP milik sendiri — harus dinilai pimpinan.');
      }
    }
    
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

export async function submitCkpUploadAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const bulan = Number(formData.get('bulan'));
    const tahun = Number(formData.get('tahun'));
    const entriesJson = formData.get('entries') as string;
    const rkTeamMappingJson = formData.get('rkTeamMapping') as string;
    const validRKsToAssignJson = formData.get('validRKsToAssign') as string;

    if (!file || !userId || !bulan || !tahun || !entriesJson) {
      return { success: false, error: 'Data upload tidak lengkap.' };
    }

    const entries = JSON.parse(entriesJson);
    const rkTeamMapping = rkTeamMappingJson ? JSON.parse(rkTeamMappingJson) : {};
    const validRKsToAssign: string[] = validRKsToAssignJson ? JSON.parse(validRKsToAssignJson) : [];

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Load RK Ketua Tim mapping (id + rencana_kinerja) for resolving rk_ketua_tim_id
    const { data: rkMappingData } = await supabaseAdmin
      .from('rk_ketua_tim_mapping')
      .select('id, rencana_kinerja')
      .eq('is_active', true)
      .limit(10000);

    // Gagalkan eksplisit bila master kosong — jangan fail-open (semua rk_ketua_tim_id jadi NULL).
    if (entries.length > 0 && (!rkMappingData || rkMappingData.length === 0)) {
      return { success: false, error: 'Data master RK kosong. Muat ulang halaman dan coba lagi.' };
    }

    const rkNameToId = new Map<string, string>(); // nama (lower) → id
    const rkIdSet = new Set<string>();            // UUID mapping yg valid
    (rkMappingData || []).forEach((r: any) => {
      rkIdSet.add(String(r.id));
      rkNameToId.set(String(r.rencana_kinerja).toLowerCase(), String(r.id));
    });

    // 1. Check existing upload for versioning
    const { data: existingUpload } = await supabaseAdmin
      .from('ckp_uploads')
      .select('id, version, status')
      .eq('user_id', userId)
      .eq('bulan', bulan)
      .eq('tahun', tahun)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingUpload?.status === 'approved') {
      return { success: false, error: 'CKP periode ini sudah disetujui. Tidak dapat mengupload ulang.' };
    }

    let newVersion = 1;
    let previousUploadId: string | null = null;
    let existingEntries: any[] = [];

    if (existingUpload) {
      newVersion = existingUpload.version + 1;
      previousUploadId = existingUpload.id;

      const { data: oldEntries } = await supabaseAdmin
        .from('ckp_entries')
        .select('*')
        .eq('upload_id', existingUpload.id);
      if (oldEntries) existingEntries = oldEntries;
    }

    // 2. Upload file to Supabase Storage via admin client
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const storagePath = `${userId}/${tahun}/${bulan}/v${newVersion}_${Date.now()}_${sanitizedFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: storageError } = await supabaseAdmin.storage
      .from('ckp-files')
      .upload(storagePath, buffer, {
        upsert: true,
        contentType: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

    if (storageError) {
      console.error('[submitCkpUploadAction] Storage upload error:', storageError);
      return { success: false, error: `Gagal upload ke storage: ${storageError.message}` };
    }

    // 3. Mark previous upload as superseded
    if (previousUploadId) {
      await supabaseAdmin
        .from('ckp_uploads')
        .update({ status: 'superseded' })
        .eq('id', previousUploadId);
    }

    // 4. Calculate total entries & avg progres
    const totalEntries = entries.length;
    const avgProgres = totalEntries > 0
      ? entries.reduce((s: number, e: any) => s + (Number(e.progres) || 0), 0) / totalEntries
      : 0;

    // 5. Create new ckp_uploads record
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .from('ckp_uploads')
      .insert({
        user_id: userId,
        bulan,
        tahun,
        version: newVersion,
        file_name: file.name,
        storage_path: storagePath,
        status: 'submitted',
        total_entries: totalEntries,
        avg_progres: avgProgres,
      })
      .select()
      .single();

    if (uploadError || !uploadData) {
      console.error('[submitCkpUploadAction] Insert upload error:', uploadError);
      return { success: false, error: `Gagal menyimpan info upload: ${uploadError?.message}` };
    }

    // 6. Compare activities between old and new to preserve scores
    const normalize = (str: string) => (str || '').toLowerCase().replace(/tahun\s*20\d{2}/g, '').replace(/[^a-z0-9]/g, '');

    const oldRkActivities = new Map<string, Set<string>>();
    existingEntries.forEach((e: any) => {
      const rk = normalize(e.rencana_kinerja || '');
      if (!oldRkActivities.has(rk)) oldRkActivities.set(rk, new Set());
      oldRkActivities.get(rk)!.add(normalize(e.kegiatan || ''));
    });

    const newRkActivities = new Map<string, Set<string>>();
    entries.forEach((e: any) => {
      const rk = normalize(e.rencana_kinerja || '');
      if (!newRkActivities.has(rk)) newRkActivities.set(rk, new Set());
      newRkActivities.get(rk)!.add(normalize(e.kegiatan || ''));
    });

    const unchangedRKs = new Set<string>();
    newRkActivities.forEach((newActs, rk) => {
      const oldActs = oldRkActivities.get(rk);
      if (oldActs && oldActs.size === newActs.size) {
        let isSame = true;
        for (const act of newActs) {
          if (!oldActs.has(act)) {
            isSame = false;
            break;
          }
        }
        if (isSame) unchangedRKs.add(rk);
      }
    });

    const entriesToInsert = entries.map((item: any) => {
      const entry = item.entry || item;
      // matchedRK = nama RK Ketua Tim (parent) hasil resolusi
      const matchedRK = item.matchedRK !== undefined ? item.matchedRK : entry.rencana_kinerja;
      // rawRK = nama sub-RK asli dari Excel pegawai (sebelum resolusi)
      // Jika item.rawRK tersedia, gunakan itu; jika tidak, pakai entry.rencana_kinerja
      const rawRK = item.rawRK !== undefined ? item.rawRK : entry.rencana_kinerja;
      const rk = normalize(matchedRK || '');
      const isRkUnchanged = unchangedRKs.has(rk);

      const matchingOldEntry = existingEntries.find((e: any) =>
        normalize(e.kegiatan || '') === normalize(entry.kegiatan || '') &&
        (normalize(e.rencana_kinerja || '') === normalize(rawRK || '') ||
         normalize(e.rencana_kinerja || '') === normalize(matchedRK || ''))
      );

      // Resolve rk_ketua_tim_id — prioritaskan item.matchedRkId (UUID tervalidasi dari client).
      // Error eksplisit bila UUID tak dikenal (jangan silent NULL).
      let rkKetuaTimId: string | null = null;
      const candidateUuid = item.matchedRkId ? String(item.matchedRkId).trim() : '';
      if (candidateUuid) {
        if (!rkIdSet.has(candidateUuid)) {
          throw new Error(
            `RK tujuan "${candidateUuid}" tidak valid — UUID tidak ditemukan di master RK. Muat ulang halaman upload dan coba lagi.`
          );
        }
        rkKetuaTimId = candidateUuid;
      } else if (matchedRK) {
        rkKetuaTimId = rkNameToId.get(matchedRK.toLowerCase()) || null;
      }

      return {
        upload_id: uploadData.id,
        row_number: entry.row_number || 0,
        tanggal_mulai: entry.tanggal_mulai || null,
        tanggal_selesai: entry.tanggal_selesai || null,
        jam_mulai: entry.jam_mulai || null,
        jam_selesai: entry.jam_selesai || null,
        // Simpan sub-RK asli (bukan parent RK) agar bisa dirate per sub-RK
        rencana_kinerja: rawRK || matchedRK || null,
        rk_ketua_tim_id: rkKetuaTimId,
        kegiatan: entry.kegiatan || null,
        progres: Number(entry.progres) || 0,
        capaian: entry.capaian || null,
        data_dukung: entry.data_dukung || null,
        extra_columns: entry.extra_columns || {},
        nilai: (isRkUnchanged && matchingOldEntry) ? matchingOldEntry.nilai : null,
        dinilai_oleh: (isRkUnchanged && matchingOldEntry) ? matchingOldEntry.dinilai_oleh : null,
        catatan_koreksi: null,
      };
    });

    // 7. Batch insert entries (chunk of 200)
    const CHUNK_SIZE = 200;
    for (let i = 0; i < entriesToInsert.length; i += CHUNK_SIZE) {
      const chunk = entriesToInsert.slice(i, i + CHUNK_SIZE);
      const { error: chunkErr } = await supabaseAdmin.from('ckp_entries').insert(chunk);
      if (chunkErr) {
        console.error('[submitCkpUploadAction] Insert chunk error:', chunkErr);
        throw chunkErr;
      }
    }

    // 8. Non-critical tasks (mappings, RK assignment, audit)
    try {
      if (Object.keys(rkTeamMapping).length > 0) {
        const newMappings = Object.keys(rkTeamMapping).map(rk => ({
          user_id: userId,
          rk_id: rkTeamMapping[rk]?.rk_id || null,
          kegiatan_nama: rk,
        })).filter(m => m.rk_id !== null && m.rk_id !== '');
        if (newMappings.length > 0) {
          await supabaseAdmin.from('master_kegiatan_anggota').insert(newMappings);
        }
      }

      if (validRKsToAssign.length > 0) {
        // validRKsToAssign berisi UUID mapping (dikirim client); nama lama tetap didukung utk kompat.
        const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const assignmentsToInsert: any[] = [];
        for (const rkItem of validRKsToAssign) {
          const rkStr = String(rkItem || '').trim();
          if (!rkStr) continue;
          if (uuidRe.test(rkStr)) {
            if (rkIdSet.has(rkStr)) {
              assignmentsToInsert.push({ rk_id: rkStr, user_id: userId, assigned_by: userId });
            }
          } else {
            const hitId = rkNameToId.get(rkStr.toLowerCase());
            if (hitId) {
              assignmentsToInsert.push({ rk_id: hitId, user_id: userId, assigned_by: userId });
            }
          }
        }
        if (assignmentsToInsert.length > 0) {
          await supabaseAdmin.from('user_rk_assignments').upsert(assignmentsToInsert, { onConflict: 'user_id, rk_id' });
        }
      }

      await supabaseAdmin.from('audit_logs').insert({
        user_id: userId,
        action: 'upload_ckp',
        entity_type: 'ckp_uploads',
        entity_id: uploadData.id,
        new_data: { bulan, tahun, version: newVersion, total_entries: entriesToInsert.length },
      });
    } catch (bgErr) {
      console.warn('[submitCkpUploadAction] Background task warning:', bgErr);
    }

    revalidatePath('/pegawai');
    revalidatePath(`/pegawai/ckp/${uploadData.id}`);
    revalidatePath('/', 'layout');

    // Notifikasi ke pimpinan/admin bahwa ada CKP baru menunggu review
    const reviewers = await getReviewerIds();
    const periodLabel = `${getBulanName(bulan)} ${tahun}`;
    await Promise.all(
      reviewers
        .filter((rid) => rid !== userId)
        .map((rid) =>
          notify({
            userId: rid,
            type: 'submitted',
            title: 'CKP baru menunggu review',
            body: `Periode ${periodLabel} — versi ${newVersion}.`,
            uploadId: uploadData.id,
            actorId: userId,
          })
        )
    );

    return { success: true, uploadId: uploadData.id };
  } catch (error: any) {
    console.error('[submitCkpUploadAction] Error:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan saat memproses upload' };
  }
}

