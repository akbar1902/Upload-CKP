"use server";

import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { notify, getUploadOwnerId, getUploadPeriodLabel } from '@/lib/notifications';
import { rkGroupKey, isRkGroupScored, normalizeRkName } from '@/lib/rk-scoring';

const APPROVE_COPY: Record<string, { type: 'approved' | 'rejected' | 'revision_required' | 'reopened'; title: string }> = {
  approved: { type: 'approved', title: 'CKP disetujui' },
  rejected: { type: 'rejected', title: 'CKP ditolak' },
  revision_required: { type: 'revision_required', title: 'CKP perlu revisi' },
  reopened: { type: 'reopened', title: 'CKP dibuka kembali' },
};

export async function gradeRencanaKinerjaAction(
  uploadIds: string | string[],
  rencanaKinerja: string,
  score: number | null,
  rkGroupKeyParam?: string | null,   // Kunci grup kontrak: 'id:<uuid>' data baru, 'legacy:<nama>' data lama
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Auth validation on the server
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi berakhir' };
    }

    // Accept both single string and array for backward compatibility
    const ids = Array.isArray(uploadIds) ? uploadIds : [uploadIds];

    if (ids.length === 0) {
      return { success: false, error: 'Upload tidak valid' };
    }

    // Kunci triwulan: >1 upload sekaligus ditolak agar rincian bulanan tidak hancur.
    // Penilaian triwulan harus dilakukan per bulan (satu upload per save).
    if (ids.length > 1) {
      return { success: false, error: 'Penilaian triwulan multi-upload dikunci — nilai per bulan agar rincian tidak tercampur' };
    }

    const adminClient = createAdminClient();

    // Larangan nilai diri sendiri: ketua_tim tidak boleh menilai upload miliknya
    // sendiri (dinilai pimpinan). Pimpinan/admin tetap boleh (jalur approval).
    // Cek role pemanggil + pemilik upload SEBELUM update apa pun.
    const { data: callerRow } = await adminClient
      .from('users')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle();
    if (callerRow?.role === 'ketua_tim') {
      const { data: targetUploads } = await adminClient
        .from('ckp_uploads')
        .select('id, user_id')
        .in('id', ids);
      if ((targetUploads || []).some((u: any) => u.user_id === user.id)) {
        return { success: false, error: 'Ketua tim tidak dapat menilai CKP milik sendiri — harus dinilai pimpinan' };
      }
    }

    // Parse kunci grup — dukung 'id:<uuid>', 'legacy:<nama>', plus UUID mentah (kompat ketua_tim lama)
    const keyParam = (rkGroupKeyParam ?? '').trim();
    let rkId: string | null = null;
    let isLegacyKey = false;
    let legacyNorm: string | null = null;
    if (keyParam) {
      if (keyParam.startsWith('id:')) {
        rkId = keyParam.slice(3).trim() || null;
      } else if (keyParam.startsWith('legacy:')) {
        isLegacyKey = true;
        legacyNorm = keyParam.slice(7).trim() || null;
      } else {
        const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRe.test(keyParam)) {
          rkId = keyParam;
        } else {
          isLegacyKey = true;
          legacyNorm = normalizeRkName(keyParam) || null;
        }
      }
    }

    const rkNameTrim = (rencanaKinerja ?? '').trim();
    const rkNameNorm = normalizeRkName(rencanaKinerja);
    const isUnknownName = !rkNameTrim || rkNameTrim === 'Tidak Diketahui';

    // Tolak bila keduanya kosong: tidak ada id RK dan tidak ada nama RK
    if (!rkId && (isUnknownName || !rkNameNorm)) {
      return { success: false, error: 'Rencana Kinerja kosong' };
    }

    // Gunakan adminClient agar tidak terblokir oleh RLS pada field sub-RK
    if (rkId) {
      // Data baru: filter TEGAS by rk_ketua_tim_id + rencana_kinerja (determinisme sub-RK).
      // Tanpa .or(...is.null) — legacy (NULL) tidak boleh ikut ter-update (korupsi nilai).
      let query = adminClient
        .from('ckp_entries')
        .update({
          nilai: score,
          dinilai_oleh: score !== null ? user.id : null
        })
        .in('upload_id', ids)
        .eq('rk_ketua_tim_id', rkId);
      if (!isUnknownName) {
        query = query.eq('rencana_kinerja', rkNameTrim);
      }
      const { error } = await query;
      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      // Data lama: filter by normalized rencana_kinerja + rk_ketua_tim_id IS NULL.
      if (isUnknownName || !rkNameNorm) {
        return { success: false, error: 'Rencana Kinerja kosong' };
      }
      if (legacyNorm && legacyNorm !== rkNameNorm) {
        return { success: false, error: 'Kunci grup tidak cocok dengan nama RK' };
      }
      const { data: candidates, error: fetchError } = await adminClient
        .from('ckp_entries')
        .select('id, rencana_kinerja')
        .in('upload_id', ids)
        .is('rk_ketua_tim_id', null);
      if (fetchError) {
        return { success: false, error: fetchError.message };
      }
      const targetIds = (candidates || [])
        .filter((c: any) => normalizeRkName(c.rencana_kinerja) === rkNameNorm)
        .map((c: any) => c.id);
      if (targetIds.length > 0) {
        const { error } = await adminClient
          .from('ckp_entries')
          .update({
            nilai: score,
            dinilai_oleh: score !== null ? user.id : null
          })
          .in('id', targetIds);
        if (error) {
          return { success: false, error: error.message };
        }
      }
    }

    // Auto-update status to 'scored' — recheck per-RK-id (rkGroupKey), bukan per-entry.
    // Satu grup lolos hanya bila SEMUA entry-nya bernilai (isRkGroupScored).
    const { data: uploads } = await adminClient
      .from('ckp_uploads')
      .select('id, status')
      .in('id', ids);

    for (const upload of uploads || []) {
      if (upload.status !== 'submitted' && upload.status !== 'scored') continue;

      const { data: entries } = await adminClient
        .from('ckp_entries')
        .select('nilai, rencana_kinerja, rk_ketua_tim_id')
        .eq('upload_id', upload.id);

      let allScored = false;
      if (entries && entries.length > 0) {
        const groups = new Map<string, { nilai: number | null }[]>();
        for (const e of entries) {
          const k = rkGroupKey(e as { rk_ketua_tim_id?: string | null; rencana_kinerja?: string | null });
          if (!groups.has(k)) groups.set(k, []);
          groups.get(k)!.push({ nilai: e.nilai ?? null });
        }
        allScored = groups.size > 0 && Array.from(groups.values()).every(isRkGroupScored);
      }
      const newStatus = allScored ? 'scored' : 'submitted';

      if (upload.status !== newStatus) {
        await adminClient
          .from('ckp_uploads')
          .update({ status: newStatus })
          .eq('id', upload.id);

        // Notifikasi 'sudah dinilai' ke pemilik saat semua entri selesai dinilai
        if (newStatus === 'scored') {
          const { data: owner } = await adminClient
            .from('ckp_uploads')
            .select('user_id')
            .eq('id', upload.id)
            .maybeSingle();
          if (owner?.user_id) {
            await notify({
              userId: owner.user_id,
              type: 'scored',
              title: 'CKP sudah dinilai',
              body: 'Semua kegiatan sudah dinilai — menunggu keputusan pimpinan.',
              uploadId: upload.id,
              actorId: user.id,
            });
          }
        }
      }
    }

    revalidatePath('/pegawai');
    revalidatePath('/ketua_tim');
    revalidatePath('/pimpinan');
    revalidatePath('/', 'layout');

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

    const adminClient = createAdminClient();
    let newStatus = action;

    if (action === 'reopened') {
      // Reopening an approved CKP should allow re-evaluation and re-approval.
      // If all entries already have scores, status is 'scored', otherwise 'submitted'.
      const { data: entries } = await adminClient
        .from('ckp_entries')
        .select('nilai')
        .eq('upload_id', uploadId);

      const allScored = entries && entries.length > 0 && entries.every(e => e.nilai !== null);
      newStatus = allScored ? 'scored' : 'submitted';
    }

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

    const { error: updateError } = await adminClient
      .from('ckp_uploads')
      .update(updateData)
      .eq('id', uploadId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Insert approval history
    await adminClient.from('approvals').insert({ 
      upload_id: uploadId, 
      reviewer_id: user.id, 
      action: action as any, 
      catatan 
    });

    // Insert audit log
    await adminClient.from('audit_logs').insert({
      user_id: user.id, 
      action: `${action}_ckp`,
      entity_type: 'ckp_uploads', 
      entity_id: uploadId,
      new_data: { status: newStatus, catatan },
    });

    revalidatePath('/penilaian/[upload_id]', 'page');
    revalidatePath('/pimpinan');
    revalidatePath('/ketua_tim');
    revalidatePath('/pegawai');

    // Notifikasi ke pemilik upload (best-effort, tidak menggagalkan aksi)
    const copy = APPROVE_COPY[action];
    if (copy) {
      const ownerId = await getUploadOwnerId(uploadId);
      if (ownerId) {
        const period = await getUploadPeriodLabel(uploadId);
        const body = period
          ? `CKP periode ${period}${catatan ? ` — catatan: ${catatan}` : ''}`
          : (catatan || undefined);
        await notify({
          userId: ownerId,
          type: copy.type,
          title: copy.title,
          body,
          uploadId,
          actorId: user.id,
        });
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server error' };
  }
}

export async function getRkDetailAction(rkId: string, bulan: string | number, tahun: number) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Sesi berakhir' };
    }

    const adminClient = createAdminClient();

    // 1. Get RK Ketua Tim mapping info
    const { data: mappingData, error: mapError } = await adminClient
      .from('rk_ketua_tim_mapping')
      .select('*')
      .eq('id', rkId)
      .single();

    if (mapError) throw mapError;
    if (!mappingData) throw new Error('Rencana Kinerja tidak ditemukan');

    const rkName = mappingData.rencana_kinerja;

    // 2. All RK IDs with same name (handle duplicates per tim_kerja)
    const { data: allRKsWithSameName } = await adminClient
      .from('rk_ketua_tim_mapping')
      .select('id')
      .eq('rencana_kinerja', rkName)
      .eq('is_active', true);
    const allRkIds = Array.from(new Set([rkId, ...(allRKsWithSameName?.map((r: any) => r.id) || [])]));

    // 3. Fetch uploads in this period
    let uploadsQuery = adminClient
      .from('ckp_uploads')
      .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
      .eq('tahun', tahun)
      .in('status', ['submitted', 'scored', 'approved', 'revision_required']);

    if (typeof bulan === 'string' && bulan.startsWith('T')) {
      const triwulanMap: Record<string, number[]> = {
        'T1': [1, 2, 3], 'T2': [4, 5, 6], 'T3': [7, 8, 9], 'T4': [10, 11, 12]
      };
      uploadsQuery = uploadsQuery.in('bulan', triwulanMap[bulan] || []);
    } else {
      uploadsQuery = uploadsQuery.eq('bulan', bulan);
    }

    const { data: uploadsData, error: uploadsError } = await uploadsQuery;
    if (uploadsError) throw uploadsError;

    const allUploadIds = (uploadsData || []).map((u: any) => u.id);
    if (allUploadIds.length === 0) {
      return { success: true, data: { rk: mappingData, entries: [], uploads: [] } };
    }

    // 4. Fetch entries with dual strategy
    let entriesData: any[] = [];
    const batchSize = 50;

    for (let i = 0; i < allUploadIds.length; i += batchSize) {
      const batchIds = allUploadIds.slice(i, i + batchSize);
      let from = 0;
      const limit = 999;

      // A) Data lama: rencana_kinerja = rkName
      while (true) {
        const { data: chunk, error: e1 } = await adminClient
          .from('ckp_entries')
          .select('*')
          .in('upload_id', batchIds)
          .eq('rencana_kinerja', rkName)
          .range(from, from + limit);
        if (e1) throw e1;
        if (chunk) entriesData.push(...chunk);
        if (!chunk || chunk.length <= limit) break;
        from += limit + 1;
      }

      // B) Data baru: rk_ketua_tim_id IN allRkIds
      from = 0;
      while (true) {
        const { data: chunk2, error: e2 } = await adminClient
          .from('ckp_entries')
          .select('*')
          .in('upload_id', batchIds)
          .in('rk_ketua_tim_id', allRkIds)
          .neq('rencana_kinerja', rkName)
          .range(from, from + limit);
        if (e2) throw e2;
        if (chunk2) entriesData.push(...chunk2);
        if (!chunk2 || chunk2.length <= limit) break;
        from += limit + 1;
      }
    }

    const entryMap = new Map<string, any>();
    entriesData.forEach(e => entryMap.set(e.id, e));
    const finalEntries = Array.from(entryMap.values());

    const entryUploadIds = new Set(finalEntries.map((e: any) => e.upload_id));
    const relevantUploads = (uploadsData || [])
      .filter((u: any) => entryUploadIds.has(u.id))
      .map((u: any) => ({ ...u, user: u.user })) as any[];

    return {
      success: true,
      data: {
        rk: mappingData,
        entries: finalEntries,
        uploads: relevantUploads,
      },
    };
  } catch (err: any) {
    console.error('[getRkDetailAction] Error:', err);
    return { success: false, error: err.message || 'Gagal memuat data RK' };
  }
}

