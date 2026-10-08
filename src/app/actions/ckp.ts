'use server';

import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { fetchAllRows } from '@/lib/supabase/read';
import { revalidatePath } from 'next/cache';
import { notify, getReviewerIds } from '@/lib/notifications';
import { getBulanName } from '@/lib/utils';
import { normalizeRkName } from '@/lib/rk-scoring';

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

interface CkpEntryRow {
  id: string;
  upload_id: string;
  rencana_kinerja: string | null;
  rk_ketua_tim_id: string | null;
  kegiatan: string | null;
  nilai: number | null;
  dinilai_oleh: string | null;
  [key: string]: unknown;
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

    const supabaseAdmin = createAdminClient();

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

    // CEK SERVER-SIDE: periode dikunci? (jangan hanya andalkan client)
    const { data: periode } = await supabaseAdmin
      .from('periode_ckp')
      .select('is_locked')
      .eq('bulan', bulan)
      .eq('tahun', tahun)
      .maybeSingle();
    if (periode?.is_locked) {
      return { success: false, error: 'Periode CKP ini sedang dikunci oleh Admin. Upload tidak diizinkan.' };
    }

    // Load RK Ketua Tim mapping (id + rencana_kinerja) for resolving rk_ketua_tim_id.
    // Paginasi penuh — jangan terpotong diam-diam di 1000 baris.
    const rkMappingData = await fetchAllRows<{ id: string; rencana_kinerja: string | null }>((from, to) =>
      supabaseAdmin
        .from('rk_ketua_tim_mapping')
        .select('id, rencana_kinerja')
        .eq('is_active', true)
        .order('id', { ascending: true })
        .range(from, to)
    );

    // Gagalkan eksplisit bila master kosong — jangan fail-open (semua rk_ketua_tim_id jadi NULL).
    if (rkMappingData.length === 0) {
      return { success: false, error: 'Data master RK kosong. Muat ulang halaman dan coba lagi.' };
    }

    const rkNameToId = new Map<string, string>(); // nama (lower) → id
    const rkIdSet = new Set<string>();            // UUID mapping yg valid
    rkMappingData.forEach((r) => {
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
    let existingEntries: CkpEntryRow[] = [];

    if (existingUpload) {
      newVersion = existingUpload.version + 1;
      previousUploadId = existingUpload.id;

      // Paginasi penuh — upload lama bisa >1000 entri.
      existingEntries = await fetchAllRows<CkpEntryRow>((from, to) =>
        supabaseAdmin
          .from('ckp_entries')
          .select('*')
          .eq('upload_id', existingUpload.id)
          .order('id', { ascending: true })
          .range(from, to)
      );
    }

    // Validasi UUID matchedRkId SEBELUM upload storage / supersede versi lama,
    // supaya data buruk tidak meninggalkan file yatim / versi lama tertandai.
    for (const item of entries) {
      const candidateUuid = item?.matchedRkId ? String(item.matchedRkId).trim() : '';
      if (candidateUuid && !rkIdSet.has(candidateUuid)) {
        return {
          success: false,
          error: `RK tujuan "${candidateUuid}" tidak valid — UUID tidak ditemukan di master RK. Muat ulang halaman upload dan coba lagi.`,
        };
      }
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
      return { success: false, error: 'Gagal mengunggah file ke penyimpanan. Silakan coba lagi.' };
    }

    // 3. Mark previous upload as superseded
    if (previousUploadId) {
      const { error: supersedeError } = await supabaseAdmin
        .from('ckp_uploads')
        .update({ status: 'superseded' })
        .eq('id', previousUploadId);
      if (supersedeError) {
        console.error('[submitCkpUploadAction] Supersede error:', supersedeError);
        return { success: false, error: 'Gagal menonaktifkan versi CKP lama. Silakan coba lagi.' };
      }
    }

    // 4. Calculate total entries & avg progres
    const totalEntries = entries.length;
    const avgProgres = totalEntries > 0
      ? entries.reduce((s: number, e: UploadItem) => s + (Number((e.entry ?? e).progres) || 0), 0) / totalEntries
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
      return { success: false, error: 'Gagal menyimpan informasi upload. Silakan coba lagi.' };
    }

    // 6. Compare activities between old and new to preserve scores
    const normalize = (str: string) => (str || '').toLowerCase().replace(/tahun\s*20\d{2}/g, '').replace(/[^a-z0-9]/g, '');

    const oldRkActivities = new Map<string, Set<string>>();
    existingEntries.forEach((e: CkpEntryRow) => {
      const rk = normalize(e.rencana_kinerja || '');
      if (!oldRkActivities.has(rk)) oldRkActivities.set(rk, new Set());
      oldRkActivities.get(rk)!.add(normalize(e.kegiatan || ''));
    });

    const newRkActivities = new Map<string, Set<string>>();
    entries.forEach((e: UploadItem) => {
      const entry = (e.entry ?? e) as UploadEntryPayload;
      const rk = normalize(entry.rencana_kinerja || '');
      if (!newRkActivities.has(rk)) newRkActivities.set(rk, new Set());
      newRkActivities.get(rk)!.add(normalize(entry.kegiatan || ''));
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

    // Map pencarian lama dibangun SEKALI (O(n)) — pengganti existingEntries.find()
    // yang membuat keseluruhan loop O(n²). Kunci: normalize(kegiatan)|normalize(rk).
    const oldEntryIndex = new Map<string, { entry: CkpEntryRow; index: number }>();
    existingEntries.forEach((e: CkpEntryRow, index: number) => {
      const key = `${normalize(e.kegiatan || '')}|${normalize(e.rencana_kinerja || '')}`;
      if (!oldEntryIndex.has(key)) oldEntryIndex.set(key, { entry: e, index });
    });

    const entriesToInsert = entries.map((item: UploadItem) => {
      const entry = (item.entry ?? item) as UploadEntryPayload;
      // matchedRK = nama RK Ketua Tim (parent) hasil resolusi
      const matchedRK = item.matchedRK !== undefined ? item.matchedRK : entry.rencana_kinerja;
      // rawRK = nama sub-RK asli dari Excel pegawai (sebelum resolusi)
      // Jika item.rawRK tersedia, gunakan itu; jika tidak, pakai entry.rencana_kinerja
      const rawRK = item.rawRK !== undefined ? item.rawRK : entry.rencana_kinerja;
      const rk = normalize(matchedRK || '');
      const isRkUnchanged = unchangedRKs.has(rk);

      // Padanan PERSIS dari find() lama: kandidat pertama (indeks terkecil) yang
      // cocok via kunci raw ATAU kunci matched.
      const kegKey = normalize(entry.kegiatan || '');
      const rawRef = oldEntryIndex.get(`${kegKey}|${normalize(rawRK || '')}`);
      const matchedRef = oldEntryIndex.get(`${kegKey}|${normalize(matchedRK || '')}`);
      let matchingOldEntry: CkpEntryRow | null = null;
      if (rawRef && matchedRef) {
        matchingOldEntry = rawRef.index <= matchedRef.index ? rawRef.entry : matchedRef.entry;
      } else if (rawRef) {
        matchingOldEntry = rawRef.entry;
      } else if (matchedRef) {
        matchingOldEntry = matchedRef.entry;
      }

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
        return { success: false, error: 'Gagal menyimpan rincian kegiatan CKP. Silakan coba lagi.' };
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
          const { error: mapInsertErr } = await supabaseAdmin
            .from('master_kegiatan_anggota')
            .insert(newMappings);
          if (mapInsertErr) {
            console.warn('[submitCkpUploadAction] Insert mapping warning:', mapInsertErr.message);
          }
        }
      }

      if (validRKsToAssign.length > 0) {
        // validRKsToAssign berisi UUID mapping (dikirim client); nama lama tetap didukung utk kompat.
        const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const assignmentsToInsert: Array<{ rk_id: string; user_id: string; assigned_by: string }> = [];
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
          const { error: assignErr } = await supabaseAdmin
            .from('user_rk_assignments')
            .upsert(assignmentsToInsert, { onConflict: 'user_id, rk_id' });
          if (assignErr) {
            console.warn('[submitCkpUploadAction] Upsert assignment warning:', assignErr.message);
          }
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
    return { success: false, error: 'Terjadi kesalahan saat memproses upload. Silakan coba lagi.' };
  }
}

