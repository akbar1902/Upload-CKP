import { createAdminClient } from '@/lib/supabase/server';
import { fetchAllRows } from '@/lib/supabase/read';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import { notify, getReviewerIds } from '@/lib/notifications';
import { getBulanName } from '@/lib/utils';

export interface MasterKegiatanRow {
  kegiatan_nama: string;
  rk_ketua_tim_mapping?: { rencana_kinerja: string } | null;
}

export interface MasterRkRow {
  id: string;
  rencana_kinerja: string;
  tim_kerja: string | null;
  ketua_tim_id: string | null;
}

export interface KetuaTimRow {
  id: string;
  full_name: string;
  unit_kerja: string | null;
}

export interface CkpEntryRow {
  id: string;
  upload_id: string;
  rencana_kinerja: string | null;
  rk_ketua_tim_id: string | null;
  kegiatan: string | null;
  nilai: number | null;
  dinilai_oleh: string | null;
  [key: string]: unknown;
}

export interface RkMappingRow {
  id: string;
  rencana_kinerja: string;
  ketua_tim_id: string | null;
}

export interface UploadEntryPayload {
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

export interface UploadItem {
  entry?: UploadEntryPayload;
  matchedRK?: string | null;
  rawRK?: string | null;
  matchedRkId?: string | null;
  [key: string]: unknown;
}

export interface TeamMappingValue {
  rk_id?: string | null;
}

export interface SubmitCkpUploadInput {
  userId: string;
  bulan: number;
  tahun: number;
  file: File;
  entries: UploadItem[];
  rkTeamMapping?: Record<string, TeamMappingValue>;
  validRKsToAssign?: unknown[];
  /** Idempotensi retry dari CKP App. */
  clientUploadId?: string | null;
  /** 'web' (default) atau 'ckp-app'. */
  source?: string | null;
}

export interface SubmitCkpUploadResult {
  success: boolean;
  uploadId?: string;
  version?: number;
  status?: string;
  duplicate?: boolean;
  error?: string;
}

/**
 * Inti penyimpanan upload CKP. Dipakai oleh server action web dan API integrasi
 * CKP App. Pemanggil WAJIB sudah memverifikasi identitas (sesi atau token) dan
 * menetapkan userId — fungsi ini tidak membaca sesi cookie.
 */
export async function submitCkpUploadCore({
  userId,
  bulan,
  tahun,
  file,
  entries,
  rkTeamMapping = {},
  validRKsToAssign = [],
  clientUploadId = null,
  source = 'web',
}: SubmitCkpUploadInput): Promise<SubmitCkpUploadResult> {
  const t0 = Date.now();
  const supabaseAdmin = createAdminClient();

  if (clientUploadId) {
    const { data: existing, error: idemError } = await supabaseAdmin
      .from('ckp_uploads')
      .select('id, version, status')
      .eq('user_id', userId)
      .eq('client_upload_id', clientUploadId)
      .neq('status', 'superseded')
      .maybeSingle();
    if (!idemError && existing) {
      return {
        success: true,
        uploadId: existing.id,
        version: existing.version,
        status: existing.status,
        duplicate: true,
      };
    }
  }

  try {
    const tAuth = Date.now();
    // CEK SERVER-SIDE: periode dikunci? (jangan hanya andalkan client)
    // Ketiga pembacaan di bawah INDEPENDEN — jalankan bersamaan supaya total
    // waktu = round-trip terlama, bukan jumlah semuanya (dulu serial).
    const [periodeRes, rkMappingData, existingUploadRes] = await Promise.all([
      supabaseAdmin
        .from('periode_ckp')
        .select('is_locked')
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .maybeSingle(),
      // Load RK Ketua Tim mapping (id + rencana_kinerja) for resolving rk_ketua_tim_id.
      // Paginasi penuh — jangan terpotong diam-diam di 1000 baris.
      fetchAllRows<{ id: string; rencana_kinerja: string | null }>((from, to) =>
        supabaseAdmin
          .from('rk_ketua_tim_mapping')
          .select('id, rencana_kinerja')
          .eq('is_active', true)
          .order('id', { ascending: true })
          .range(from, to)
      ),
      // 1. Check existing upload for versioning
      supabaseAdmin
        .from('ckp_uploads')
        .select('id, version, status')
        .eq('user_id', userId)
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const tReads = Date.now();
    if (periodeRes.data?.is_locked) {
      return { success: false, error: 'Periode CKP ini sedang dikunci oleh Admin. Upload tidak diizinkan.' };
    }

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

    const existingUpload = existingUploadRes.data;

    if (existingUpload?.status === 'approved') {
      return { success: false, error: 'CKP periode ini sudah disetujui. Tidak dapat mengupload ulang.' };
    }

    let newVersion = 1;
    let previousUploadId: string | null = null;
    let existingEntries: CkpEntryRow[] = [];

    if (existingUpload) {
      newVersion = existingUpload.version + 1;
      previousUploadId = existingUpload.id;
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

    // 2. Upload file to Supabase Storage via admin client — DIJALANKAN BERSAMAAN
    //    dengan pengambilan entri versi lama (dua operasi jaringan independen),
    //    sehingga durasi keduanya tidak saling menambah.
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const storagePath = `${userId}/${tahun}/${bulan}/v${newVersion}_${Date.now()}_${sanitizedFileName}`;

    const storageUploadPromise = file.arrayBuffer().then((arrayBuffer) =>
      supabaseAdmin.storage
        .from('ckp-files')
        .upload(storagePath, Buffer.from(arrayBuffer), {
          upsert: true,
          contentType: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
    );

    // Paginasi penuh — upload lama bisa >1000 entri.
    const existingEntriesPromise: Promise<CkpEntryRow[]> = previousUploadId
      ? fetchAllRows<CkpEntryRow>((from, to) =>
          supabaseAdmin
            .from('ckp_entries')
            .select('*')
            .eq('upload_id', previousUploadId)
            .order('id', { ascending: true })
            .range(from, to)
        )
      : Promise.resolve([]);

    const [storageResult, fetchedExistingEntries] = await Promise.all([
      storageUploadPromise,
      existingEntriesPromise,
    ]);
    existingEntries = fetchedExistingEntries;

    const tStorage = Date.now();
    const { error: storageError } = storageResult;
    if (storageError) {
      console.error('[submitCkpUploadAction] Storage upload error:', storageError);
      return { success: false, error: 'Gagal mengunggah file ke penyimpanan. Silakan coba lagi.' };
    }

    // 4. Calculate total entries & avg progres
    const totalEntries = entries.length;
    const avgProgres = totalEntries > 0
      ? entries.reduce((s: number, e: UploadItem) => s + (Number((e.entry ?? e).progres) || 0), 0) / totalEntries
      : 0;

    // 3 & 5. Tandai versi lama "superseded" DAN buat record upload baru —
    //        dua operasi independen, dijalankan bersamaan.
    const [supersedeRes, insertRes] = await Promise.all([
      previousUploadId
        ? supabaseAdmin
            .from('ckp_uploads')
            .update({ status: 'superseded' })
            .eq('id', previousUploadId)
        : Promise.resolve({ error: null }),
      supabaseAdmin
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
          source: source || 'web',
          client_upload_id: clientUploadId || null,
        })
        .select()
        .single(),
    ]);

    if (supersedeRes.error) {
      console.error('[submitCkpUploadAction] Supersede error:', supersedeRes.error);
      return { success: false, error: 'Gagal menonaktifkan versi CKP lama. Silakan coba lagi.' };
    }

    const uploadData = insertRes.data;
    const uploadError = insertRes.error;

    const tWrites = Date.now();
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

    // 7. Batch insert entries — beberapa chunk dijalankan BERSAMAAN (bukan satu
    //    per satu) agar ribuan baris tidak menunggu round-trip berantai.
    const CHUNK_SIZE = 200;
    const chunks: (typeof entriesToInsert)[] = [];
    for (let i = 0; i < entriesToInsert.length; i += CHUNK_SIZE) {
      chunks.push(entriesToInsert.slice(i, i + CHUNK_SIZE));
    }
    const INSERT_CONCURRENCY = 6;
    for (let i = 0; i < chunks.length; i += INSERT_CONCURRENCY) {
      const batch = chunks.slice(i, i + INSERT_CONCURRENCY);
      const results = await Promise.all(
        batch.map((chunk) => supabaseAdmin.from('ckp_entries').insert(chunk))
      );
      const failed = results.find((r) => r.error);
      if (failed?.error) {
        console.error('[submitCkpUploadAction] Insert chunk error:', failed.error);
        return { success: false, error: 'Gagal menyimpan rincian kegiatan CKP. Silakan coba lagi.' };
      }
    }

    try {
      revalidatePath('/pegawai');
      revalidatePath(`/pegawai/ckp/${uploadData.id}`);
      revalidatePath('/', 'layout');
    } catch (revalidateErr) {
      // Cache revalidation bukan bagian dari integritas data. Jangan gagalkan
      // upload yang sudah tersimpan hanya karena konteks cache berbeda.
      console.warn('[submitCkpUploadCore] revalidatePath warning:', revalidateErr);
    }

    const tEntries = Date.now();
    // 8. Tugas non-kritis (mapping, assignment, audit log, notifikasi) dijalankan
    //    SETELAH respons dikirim — user tidak lagi menunggu pekerjaan ini.
    //    Tidak ada yang memengaruhi hasil upload, jadi kegagalannya cukup di-warn.
    const periodLabel = `${getBulanName(bulan)} ${tahun}`;
    try {
      after(async () => {
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
          new_data: { bulan, tahun, version: newVersion, total_entries: entriesToInsert.length, source },
        });

        // Notifikasi ke pimpinan/admin bahwa ada CKP baru menunggu review
        const reviewers = await getReviewerIds();
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
      } catch (bgErr) {
        console.warn('[submitCkpUploadAction] Background task warning:', bgErr);
      }
      });
    } catch (afterErr) {
      console.warn('[submitCkpUploadCore] after() warning:', afterErr);
    }

    const serverMs = Date.now() - t0;
    // Log ringkas ke server (Vercel logs) — berguna bila ada keluhan lambat lagi.
    if (process.env.NODE_ENV !== 'production' || serverMs > 1000) {
      console.log('[submitCkpUploadAction] timing', {
        serverMs,
        authMs: tAuth - t0,
        readMs: tReads - tAuth,
        storageMs: tStorage - tReads,
        writeMs: tWrites - tStorage,
        entriesMs: tEntries - tWrites,
      });
    }

    return { success: true, uploadId: uploadData.id, version: newVersion, status: 'submitted' };
  } catch (error: unknown) {
    console.error('[submitCkpUploadCore] Error:', error);
    return { success: false, error: 'Terjadi kesalahan saat memproses upload. Silakan coba lagi.' };
  }
}
