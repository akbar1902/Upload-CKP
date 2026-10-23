'use server';

import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { fetchAllRows } from '@/lib/supabase/read';
import { revalidatePath } from 'next/cache';
import { normalizeRkName } from '@/lib/rk-scoring';
import { submitCkpUploadCore } from '@/lib/ckp/submit-upload';

interface MasterKegiatanRow {
  kegiatan_nama: string;
  rk_ketua_tim_mapping?: { rencana_kinerja: string } | null;
}

interface MasterRkRow {
  id: string;
  rencana_kinerja: string;
  tim_kerja: string | null;
  ketua_tim_id: string | null;
}

interface KetuaTimRow {
  id: string;
  full_name: string;
  unit_kerja: string | null;
}

interface RkMappingRow {
  id: string;
  rencana_kinerja: string;
  ketua_tim_id: string | null;
}

interface UploadEntryPayload {
  row_number?: number | null;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
  jam_mulai?: string | null;
  jam_selesai?: string | null;
  rencana_kinerja?: string | null;
  kegiatan?: string | null;
  progres?: number | string | null;
  capaian?: string | null;
  data_dukung?: string | null;
  extra_columns?: Record<string, unknown> | null;
  [key: string]: unknown;
}

interface UploadItem {
  entry?: UploadEntryPayload;
  matchedRK?: string | null;
  rawRK?: string | null;
  matchedRkId?: string | null;
  [key: string]: unknown;
}

interface TeamMappingValue {
  rk_id?: string | null;
}

export async function saveKegiatanAnggotaMapping(mappings: any[]) {
  try {
    // Wajib login (role apa pun) — aksi ini memakai service role.
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Sesi berakhir' };

    if (!Array.isArray(mappings) || mappings.length === 0 || mappings.length > 5000) {
      return { success: false, error: 'Data mapping kegiatan tidak valid.' };
    }

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from('master_kegiatan_anggota').insert(mappings);
    if (error) throw new Error(error.message);
    
    return { success: true };
  } catch (error: any) {
    console.error('[saveKegiatanAnggotaMapping] Error:', error);
    return { success: false, error: 'Gagal menyimpan mapping kegiatan.' };
  }
}


export async function getMasterKegiatanAnggota() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const supabaseAdmin = createAdminClient();
    const data = (await fetchAllRows<Record<string, unknown>>((from, to) =>
      supabaseAdmin
        .from('master_kegiatan_anggota')
        .select('kegiatan_nama, rk_ketua_tim_mapping!inner(rencana_kinerja)')
        .eq('rk_ketua_tim_mapping.is_active', true)
        .order('kegiatan_nama', { ascending: true })
        .range(from, to)
    )) as unknown as MasterKegiatanRow[];
    return data;
  } catch (error: any) {
    console.error('[getMasterKegiatanAnggota] Error:', error);
    return [];
  }
}

export async function getUploadMasterData() {
  // Wajib login sebelum memakai service role.
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Sesi berakhir');

  const supabaseAdmin = createAdminClient();

  const [masterRKs, ketuaTims, masterKegiatan] = await Promise.all([
    fetchAllRows<Record<string, unknown>>((from, to) =>
      supabaseAdmin
        .from('rk_ketua_tim_mapping')
        .select('id, rencana_kinerja, tim_kerja, ketua_tim_id')
        .eq('is_active', true)
        .order('id', { ascending: true })
        .range(from, to)
    ),
    fetchAllRows<KetuaTimRow>((from, to) =>
      supabaseAdmin
        .from('users')
        .select('id, full_name, unit_kerja')
        .in('role', ['ketua_tim', 'pimpinan', 'admin'])
        .order('id', { ascending: true })
        .range(from, to)
    ),
    fetchAllRows<Record<string, unknown>>((from, to) =>
      supabaseAdmin
        .from('master_kegiatan_anggota')
        .select('kegiatan_nama, rk_ketua_tim_mapping!inner(rencana_kinerja)')
        .eq('rk_ketua_tim_mapping.is_active', true)
        .order('kegiatan_nama', { ascending: true })
        .range(from, to)
    ),
  ]);

  // JANGAN telan error menjadi data kosong. Data kosong yang ter-cache membuat
  // RK yang sudah dikenal (termasuk hasil mapping upload sebelumnya) dianggap
  // "tak dikenal" lagi. fetchAllRows melempar error → client retry / pakai cache lama.
  return {
    masterRKs: masterRKs as unknown as MasterRkRow[],
    ketuaTims,
    masterKegiatan: masterKegiatan as unknown as MasterKegiatanRow[],
  };
}

export async function checkPeriodStatusAction(userId: string, bulan: number, tahun: number) {
  try {
    // Wajib login.
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { isLocked: false, existingUpload: null };

    const bulanNum = Number(bulan);
    const tahunNum = Number(tahun);
    if (!Number.isInteger(bulanNum) || bulanNum < 1 || bulanNum > 12 || !Number.isInteger(tahunNum)) {
      return { isLocked: false, existingUpload: null };
    }

    // Bila userId ≠ sesi: hanya pimpinan/admin yang boleh melihat user lain;
    // selain itu pakai id sesi (cegah enumerasi status unggahan orang lain).
    let effectiveUserId = user.id;
    if (userId && userId !== user.id) {
      const { data: me } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      const isPrivileged = me?.role === 'pimpinan' || me?.role === 'admin';
      if (isPrivileged) effectiveUserId = userId;
    }

    const supabaseAdmin = createAdminClient();

    const [lockRes, uploadRes] = await Promise.all([
      supabaseAdmin.from('periode_ckp').select('is_locked').eq('bulan', bulanNum).eq('tahun', tahunNum).maybeSingle(),
      supabaseAdmin
        .from('ckp_uploads')
        // KONTRAK dengan halaman upload: sertakan alasan revisi & nilai rata-rata.
        .select('id, version, status, catatan_pimpinan, rata_rata_nilai, approved_at')
        .eq('user_id', effectiveUserId)
        .eq('bulan', bulanNum)
        .eq('tahun', tahunNum)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle(),
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
      throw new Error('Sesi berakhir');
    }

    const supabaseAdmin = createAdminClient();

    // Role pemanggil (pimpinan/admin boleh menghapus upload orang lain).
    const { data: me } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    const isPrivileged = me?.role === 'pimpinan' || me?.role === 'admin';

    // 1. Fetch the upload to verify ownership and status
    const { data: upload, error: fetchError } = await supabaseAdmin
      .from('ckp_uploads')
      .select('user_id, status, storage_path, bulan, tahun')
      .eq('id', uploadId)
      .single();

    if (fetchError || !upload) {
      throw new Error('Data CKP tidak ditemukan');
    }

    if (upload.user_id !== user.id && !isPrivileged) {
      throw new Error('Anda tidak memiliki akses untuk menghapus CKP ini');
    }

    if (upload.status === 'approved') {
      throw new Error('CKP yang sudah disetujui (Approved) tidak dapat dihapus');
    }

    // Tolak bila periode terkunci — kecuali pimpinan/admin.
    if (!isPrivileged) {
      const { data: periode } = await supabaseAdmin
        .from('periode_ckp')
        .select('is_locked')
        .eq('bulan', upload.bulan)
        .eq('tahun', upload.tahun)
        .maybeSingle();
      if (periode?.is_locked) {
        throw new Error('Periode CKP sedang dikunci. Penghapusan tidak diizinkan.');
      }
    }

    // 2. Delete the actual record (service role — otorisasi sudah dicek manual)
    const { error: entriesError } = await supabaseAdmin
      .from('ckp_entries')
      .delete()
      .eq('upload_id', uploadId);
    if (entriesError) {
      console.error('[deleteCkpUploadAction] Delete entries error:', entriesError);
      throw new Error('Gagal menghapus rincian kegiatan CKP.');
    }

    const { error: deleteError } = await supabaseAdmin
      .from('ckp_uploads')
      .delete()
      .eq('id', uploadId);

    if (deleteError) {
      console.error('[deleteCkpUploadAction] Delete upload error:', deleteError);
      throw new Error('Gagal menghapus data CKP.');
    }

    // 3. Delete the file from storage (best-effort — DB sudah terhapus).
    if (upload.storage_path) {
      const { error: storageRemoveError } = await supabaseAdmin.storage
        .from('ckp-files')
        .remove([upload.storage_path]);
      if (storageRemoveError) {
        console.warn('[deleteCkpUploadAction] Gagal hapus file storage:', storageRemoveError.message);
      }
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
      throw new Error('Sesi berakhir');
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!userData || !['ketua_tim', 'pimpinan', 'admin'].includes(userData.role)) {
      throw new Error('Unauthorized: Hanya pimpinan atau ketua tim yang dapat memindah RK.');
    }
    const callerRole = userData.role;

    // Bypass RLS using service role — otorisasi ditegakkan manual di bawah.
    const supabaseAdmin = createAdminClient();

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
    const { data: entriesRaw, error: eErr } = await supabaseAdmin
      .from('ckp_entries')
      .select('id, upload_id, rk_ketua_tim_id, rencana_kinerja')
      .in('id', entryIds);
    const entries = (entriesRaw ?? []) as Array<{
      id: string;
      upload_id: string;
      rk_ketua_tim_id: string | null;
      rencana_kinerja: string | null;
    }>;
    if (eErr || entries.length === 0) {
      throw new Error('Data kegiatan tidak ditemukan.');
    }
    if (entries.length !== entryIds.length) {
      throw new Error('Sebagian kegiatan tidak ditemukan. Muat ulang dan coba lagi.');
    }
    const uploadIds = Array.from(new Set(entries.map((e: any) => e.upload_id)));
    const { data: uploads, error: uploadsErr } = await supabaseAdmin
      .from('ckp_uploads')
      .select('id, status, user_id')
      .in('id', uploadIds);
    if (uploadsErr) {
      throw new Error('Gagal memeriksa data upload tujuan.');
    }
    if ((uploads || []).some((u: any) => u.status === 'approved')) {
      throw new Error('CKP yang sudah disetujui (Approved) tidak dapat dipindah.');
    }
    // Ketua tim tidak boleh memindah kegiatan miliknya sendiri (dinilai pimpinan).
    if (callerRole === 'ketua_tim' && (uploads || []).some((u: any) => u.user_id === user.id)) {
      throw new Error('Ketua tim tidak dapat memindah kegiatan milik sendiri — harus dinilai pimpinan.');
    }

    // Ketua tim hanya boleh memindah kegiatan dari RK timnya (ownership ASAL).
    if (callerRole === 'ketua_tim') {
      const { data: myMappings, error: myMapErr } = await supabaseAdmin
        .from('rk_ketua_tim_mapping')
        .select('id, rencana_kinerja')
        .eq('ketua_tim_id', user.id)
        .eq('is_active', true);
      if (myMapErr) {
        throw new Error('Gagal memverifikasi kepemilikan RK asal.');
      }
      const myMappingRows = (myMappings ?? []) as RkMappingRow[];
      const ownedIds = new Set(myMappingRows.map((m) => m.id));
      const ownedNorms = new Set(
        myMappingRows.map((m) => normalizeRkName(m.rencana_kinerja))
      );
      const allOwned = entries.every((e) =>
        (e.rk_ketua_tim_id && ownedIds.has(e.rk_ketua_tim_id)) ||
        (!e.rk_ketua_tim_id && ownedNorms.has(normalizeRkName(e.rencana_kinerja)))
      );
      if (!allOwned) {
        throw new Error('Anda hanya dapat memindah kegiatan dari RK tim Anda sendiri.');
      }
    }

    // Update ATOMIK nama + UUID dalam 1 update (hindari split-brain).
    const { error } = await supabaseAdmin
      .from('ckp_entries')
      .update({ rencana_kinerja: targetRkName, rk_ketua_tim_id: targetRkId })
      .in('id', entryIds);

    if (error) {
      throw new Error('Gagal memindahkan kegiatan. Silakan coba lagi.');
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
      throw new Error('Sesi berakhir');
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!userData || !['ketua_tim', 'pimpinan', 'admin'].includes(userData.role)) {
      throw new Error('Unauthorized: Hanya reviewer yang dapat memberikan catatan.');
    }

    const supabaseAdmin = createAdminClient();

    // Baca entry dulu: pemilik upload + info RK (untuk verifikasi wewenang ketua tim).
    const { data: targetEntry, error: targetErr } = await supabaseAdmin
      .from('ckp_entries')
      .select('id, upload_id, catatan_koreksi, rk_ketua_tim_id, rencana_kinerja, ckp_uploads!inner(user_id)')
      .eq('id', entryId)
      .maybeSingle();

    if (targetErr || !targetEntry) {
      throw new Error('Data kegiatan tidak ditemukan.');
    }
    const ownerRel = targetEntry.ckp_uploads as
      | { user_id: string }
      | { user_id: string }[]
      | null;
    const ownerId = Array.isArray(ownerRel) ? ownerRel[0]?.user_id : ownerRel?.user_id;

    if (userData.role === 'ketua_tim') {
      // Ketua tim tidak boleh memberi catatan koreksi ke CKP miliknya sendiri.
      if (ownerId === user.id) {
        throw new Error('Ketua tim tidak dapat memberi catatan ke CKP milik sendiri — harus dinilai pimpinan.');
      }

      // Entry harus milik RK yang di-mapping ke ketua tim ini.
      let owns = false;
      if (targetEntry.rk_ketua_tim_id) {
        const { data: mapping, error: mapErr } = await supabaseAdmin
          .from('rk_ketua_tim_mapping')
          .select('id, ketua_tim_id')
          .eq('id', targetEntry.rk_ketua_tim_id)
          .maybeSingle();
        if (mapErr) {
          throw new Error('Gagal memverifikasi kepemilikan RK.');
        }
        owns = !!mapping && mapping.ketua_tim_id === user.id;
      } else {
        const norm = normalizeRkName(targetEntry.rencana_kinerja);
        if (norm) {
          const { data: myMappings, error: myMapErr } = await supabaseAdmin
            .from('rk_ketua_tim_mapping')
            .select('rencana_kinerja')
            .eq('ketua_tim_id', user.id)
            .eq('is_active', true);
          if (myMapErr) {
            throw new Error('Gagal memverifikasi kepemilikan RK.');
          }
          const myMappingRows = (myMappings ?? []) as RkMappingRow[];
          owns = myMappingRows.some(
            (m) => normalizeRkName(m.rencana_kinerja) === norm
          );
        }
      }

      if (!owns) {
        throw new Error('Anda tidak berwenang menilai RK ini');
      }
    }

    const previousCatatan = targetEntry.catatan_koreksi ?? null;

    // Update the entry
    const { error: entryError } = await supabaseAdmin
      .from('ckp_entries')
      .update({ catatan_koreksi: catatanKoreksi || null })
      .eq('id', entryId);

    if (entryError) {
      console.error('[markEntryAction] Entry update error:', entryError);
      throw new Error('Gagal menyimpan catatan.');
    }

    // If a note was added, we should set the upload status to revision_required
    // so the Pegawai sees the warning on their dashboard immediately.
    // Jangan tinggalkan catatan tersimpan tanpa perubahan status: bila update
    // status gagal, kembalikan catatan lama lalu laporkan error.
    if (catatanKoreksi && targetEntry.upload_id) {
      const { error: uploadError } = await supabaseAdmin
        .from('ckp_uploads')
        .update({ status: 'revision_required' })
        .eq('id', targetEntry.upload_id)
        .eq('status', 'submitted'); // Only change if it's currently submitted to prevent overriding 'approved' etc

      if (uploadError) {
        console.error('[markEntryAction] Failed to update upload status:', uploadError);
        const { error: rollbackErr } = await supabaseAdmin
          .from('ckp_entries')
          .update({ catatan_koreksi: previousCatatan })
          .eq('id', entryId);
        if (rollbackErr) {
          console.error('[markEntryAction] Rollback catatan gagal:', rollbackErr);
        }
        return {
          success: false,
          error: 'Gagal memperbarui status revisi. Catatan tidak disimpan — silakan coba lagi.',
        };
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
    // 0. WAJIB sesi login — jangan percaya userId dari FormData.
    const supabase = await createServerSupabaseClient();
    const { data: { user: sessionUser } } = await supabase.auth.getUser();
    if (!sessionUser) {
      return { success: false, error: 'Sesi berakhir. Silakan login ulang.' };
    }

    const file = formData.get('file') as File;
    const userIdFromForm = String(formData.get('userId') || '').trim();
    const bulan = Number(formData.get('bulan'));
    const tahun = Number(formData.get('tahun'));
    const entriesJson = formData.get('entries') as string;
    const rkTeamMappingJson = formData.get('rkTeamMapping') as string;
    const validRKsToAssignJson = formData.get('validRKsToAssign') as string;

    if (!file || !entriesJson || !Number.isInteger(bulan) || !Number.isInteger(tahun)) {
      return { success: false, error: 'Data upload tidak lengkap.' };
    }
    if (bulan < 1 || bulan > 12) {
      return { success: false, error: 'Bulan tidak valid.' };
    }
    if (tahun < 2020 || tahun > 2100) {
      return { success: false, error: 'Tahun tidak valid.' };
    }

    // Parsing aman: jangan biarkan JSON rusak melempar error mentah ke client.
    let entries: UploadItem[];
    let rkTeamMapping: Record<string, TeamMappingValue>;
    let validRKsToAssign: unknown[];
    try {
      entries = JSON.parse(entriesJson) as UploadItem[];
      rkTeamMapping = (rkTeamMappingJson
        ? JSON.parse(rkTeamMappingJson)
        : {}) as Record<string, TeamMappingValue>;
      validRKsToAssign = validRKsToAssignJson
        ? (JSON.parse(validRKsToAssignJson) as unknown[])
        : [];
    } catch {
      return { success: false, error: 'Format data entri tidak valid.' };
    }

    if (!Array.isArray(entries) || entries.length === 0) {
      return { success: false, error: 'Tidak ada entri kegiatan yang dikirim.' };
    }
    if (entries.length > 5000) {
      return { success: false, error: 'Terlalu banyak entri (maksimal 5000 per upload).' };
    }
    if (!entries.every((e: unknown) => e && typeof e === 'object' && !Array.isArray(e))) {
      return { success: false, error: 'Format entri kegiatan tidak valid.' };
    }
    if (!Array.isArray(validRKsToAssign)) validRKsToAssign = [];
    if (!rkTeamMapping || typeof rkTeamMapping !== 'object' || Array.isArray(rkTeamMapping)) {
      rkTeamMapping = {};
    }

    // Bila userId FormData ≠ sesi, hanya pimpinan/admin yang boleh upload
    // untuk pegawai lain. Selain itu selalu pakai id sesi.
    let userId = sessionUser.id;
    if (userIdFromForm && userIdFromForm !== sessionUser.id) {
      const { data: me } = await supabase
        .from('users')
        .select('role')
        .eq('id', sessionUser.id)
        .maybeSingle();
      const privileged = me?.role === 'pimpinan' || me?.role === 'admin';
      if (!privileged) {
        return { success: false, error: 'Anda tidak berwenang mengunggah CKP untuk pegawai lain.' };
      }
      userId = userIdFromForm;
    }

    return submitCkpUploadCore({
      userId,
      bulan,
      tahun,
      file,
      entries,
      rkTeamMapping,
      validRKsToAssign,
      source: 'web',
    });
  } catch (error: unknown) {
    console.error('[submitCkpUploadAction] Error:', error);
    return { success: false, error: 'Terjadi kesalahan saat memproses upload. Silakan coba lagi.' };
  }
}

