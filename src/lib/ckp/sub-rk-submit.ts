/**
 * Jalur bersama "konteks Sub-RK" dan "submit Excel CKP" untuk:
 *  - API integrasi CKP App (`/api/integrations/ckp-app`), dan
 *  - fitur Buat CKP di SIKAP (`/pegawai/buat-ckp`).
 *
 * Aturan RK dua level (lihat DOKUMENTASI_RK.md): kolom "Rencana Kinerja" di
 * Excel berisi Sub-RK (master_kegiatan_anggota); parent dicari lewat Sub-RK.
 * Pemanggil WAJIB sudah memverifikasi identitas dan menetapkan userId.
 */
import { createAdminClient } from '@/lib/supabase/server';
import { fetchAllRows } from '@/lib/supabase/read';
import { buildRkIndex, buildSubRkIndex, resolveRkTarget } from '@/lib/integration/payload.mjs';
import { parseExcelFile } from '@/lib/excel/parser';
import { submitCkpUploadCore, type SubmitCkpUploadResult, type UploadItem } from '@/lib/ckp/submit-upload';

type Admin = ReturnType<typeof createAdminClient>;

export interface RkRow {
  id: string;
  rencana_kinerja: string;
  tim_kerja: string | null;
  tahun: number | null;
}

export interface SubRkItem {
  kegiatan_nama: string;
  rk_id: string;
  rencana_kinerja: string;
}

export interface SubRkContext {
  rks: RkRow[];
  subRks: SubRkItem[];
  source: 'assigned' | 'master';
  locked: boolean;
  lastUpload: {
    id: string;
    version: number;
    status: string;
    uploaded_at: string | null;
    total_entries: number | null;
  } | null;
}

function kunciRk(nama: string | null | undefined) {
  return String(nama || '')
    .toLowerCase()
    .replace(/\btahun\s*20\d{2}\b/g, '')
    .replace(/\b20\d{2}\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/** RK parent aktif, Sub-RK milik pegawai, status kunci periode, dan upload terakhir. */
export async function loadSubRkContext(admin: Admin, userId: string, bulan: number, tahun: number): Promise<SubRkContext> {
  const [mapping, assignments, periode, lastUpload, subRkRows] = await Promise.all([
    fetchAllRows<RkRow>((from, to) =>
      admin
        .from('rk_ketua_tim_mapping')
        .select('id, rencana_kinerja, tim_kerja, tahun')
        .eq('is_active', true)
        .order('rencana_kinerja', { ascending: true })
        .range(from, to),
    ),
    admin.from('user_rk_assignments').select('rk_id').eq('user_id', userId),
    admin.from('periode_ckp').select('is_locked').eq('bulan', bulan).eq('tahun', tahun).maybeSingle(),
    admin
      .from('ckp_uploads')
      .select('id, version, status, uploaded_at, total_entries')
      .eq('user_id', userId)
      .eq('bulan', bulan)
      .eq('tahun', tahun)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle(),
    fetchAllRows<{ kegiatan_nama: string | null; rk_id: string | null }>((from, to) =>
      admin
        .from('master_kegiatan_anggota')
        .select('kegiatan_nama, rk_id')
        .eq('user_id', userId)
        .order('kegiatan_nama', { ascending: true })
        .range(from, to),
    ),
  ]);

  if (assignments.error) throw new Error(`Gagal membaca penugasan RK: ${assignments.error.message}`);

  const assignedIds = new Set((assignments.data ?? []).map((row) => String(row.rk_id || '')).filter(Boolean));
  const mappingTahun = mapping.filter((rk) => rk.tahun == null || rk.tahun === tahun);
  const sudah = new Set<string>();
  const rks = (assignedIds.size > 0 ? mappingTahun.filter((rk) => assignedIds.has(String(rk.id))) : mappingTahun).filter(
    (rk) => {
      const kunci = kunciRk(rk.rencana_kinerja);
      if (!kunci || sudah.has(kunci)) return false;
      sudah.add(kunci);
      return true;
    },
  );

  const parentTahun = new Map(mappingTahun.map((rk) => [String(rk.id), rk]));
  const subRks = (Array.isArray(subRkRows) ? subRkRows : [])
    .map((row) => {
      const parent = parentTahun.get(String(row.rk_id || ''));
      const kegiatan = String(row.kegiatan_nama || '').trim();
      if (!parent || !kegiatan) return null;
      return { kegiatan_nama: kegiatan, rk_id: String(parent.id), rencana_kinerja: parent.rencana_kinerja };
    })
    .filter((row): row is SubRkItem => Boolean(row))
    .sort((a, b) => a.kegiatan_nama.localeCompare(b.kegiatan_nama));

  return {
    rks,
    subRks,
    source: assignedIds.size > 0 ? 'assigned' : 'master',
    locked: Boolean(periode.data?.is_locked),
    lastUpload: (lastUpload.data as SubRkContext['lastUpload']) ?? null,
  };
}

export type SubmitExcelResult =
  | { ok: true; result: SubmitCkpUploadResult; warnings: string[] }
  | {
      ok: false;
      status: number;
      error: string;
      errors?: string[];
      warnings?: string[];
      unmatchedRks?: string[];
      hint?: string;
    };

/**
 * Parse Excel CKP di server (file = sumber kebenaran), cocokkan kolom
 * "Rencana Kinerja" ke Sub-RK → parent, lalu simpan lewat submitCkpUploadCore.
 * Tidak ada data yang tersimpan bila ada RK yang tidak cocok.
 */
export async function submitExcelForUser({
  userId,
  bulan,
  tahun,
  file,
  expectedRows,
  clientUploadId,
  source,
}: {
  userId: string;
  bulan: number;
  tahun: number;
  file: File;
  expectedRows?: number | null;
  clientUploadId?: string | null;
  source: string;
}): Promise<SubmitExcelResult> {
  const parsed = await parseExcelFile(file, bulan, tahun);
  if (!parsed.success || parsed.entries.length === 0) {
    return {
      ok: false,
      status: 422,
      error: parsed.errors[0] || 'File Excel tidak dapat dibaca.',
      errors: parsed.errors,
      warnings: parsed.warnings,
    };
  }

  if (Number.isInteger(expectedRows) && (expectedRows as number) > 0 && parsed.entries.length !== expectedRows) {
    return {
      ok: false,
      status: 422,
      error: `Sebagian baris di luar periode SIKAP: terbaca ${parsed.entries.length} dari ${expectedRows} baris. Periksa tanggal draft.`,
      warnings: parsed.warnings,
    };
  }

  const admin = createAdminClient();
  const mapping = await fetchAllRows<RkRow>((from, to) =>
    admin
      .from('rk_ketua_tim_mapping')
      .select('id, rencana_kinerja, tim_kerja, tahun')
      .eq('is_active', true)
      .order('rencana_kinerja', { ascending: true })
      .range(from, to),
  );
  if (mapping.length === 0) {
    return { ok: false, status: 422, error: 'Master RK di SIKAP masih kosong. Hubungi admin.' };
  }

  const mappingTahun = mapping.filter((rk) => rk.tahun == null || rk.tahun === tahun);
  if (mappingTahun.length === 0) {
    return { ok: false, status: 422, error: `Belum ada RK aktif untuk tahun ${tahun} di SIKAP.` };
  }

  const parentById = new Map(mappingTahun.map((rk) => [String(rk.id), rk]));
  const parentIds = new Set(parentById.keys());

  // Sub-RK milik pegawai diprioritaskan; Sub-RK pegawai lain hanya fallback.
  const subRkRows = await fetchAllRows<{ kegiatan_nama: string | null; rk_id: string | null; user_id: string | null }>(
    (from, to) =>
      admin
        .from('master_kegiatan_anggota')
        .select('kegiatan_nama, rk_id, user_id')
        .order('kegiatan_nama', { ascending: true })
        .range(from, to),
  );
  const subRkSendiri = buildSubRkIndex(subRkRows, { hanyaParent: parentIds, userId });
  const subRkSemua = buildSubRkIndex(subRkRows, { hanyaParent: parentIds });
  const rkUtama = buildRkIndex(mappingTahun);

  const unmatchedRks = new Set<string>();
  const validRKsToAssign = new Set<string>();

  const entries: UploadItem[] = parsed.entries.map((entry) => {
    const rawRK = String(entry.rencana_kinerja || '').trim();
    const target = resolveRkTarget(rawRK, { subRkSendiri, subRkSemua, rkUtama });
    const parent = target ? parentById.get(target.rkId) : null;
    if (!parent) {
      if (rawRK) unmatchedRks.add(rawRK);
      return { entry, rawRK };
    }

    validRKsToAssign.add(String(parent.id));

    return {
      entry,
      matchedRK: parent.rencana_kinerja,
      rawRK: rawRK || parent.rencana_kinerja,
      matchedRkId: String(parent.id),
    };
  });

  if (unmatchedRks.size > 0) {
    return {
      ok: false,
      status: 422,
      error: 'Ada RK di file Excel yang tidak cocok dengan Sub-RK (RK Anggota) pegawai ini.',
      unmatchedRks: [...unmatchedRks],
      hint: 'Pastikan kolom "Rencana Kinerja" berisi Sub-RK yang ditugaskan ke pegawai ini (SIKAP → Manajemen RK → Sub-RK Anggota). Di CKP App, tekan "Tarik RK dari SIKAP" lalu pilih RK yang sesuai.',
    };
  }

  const result = await submitCkpUploadCore({
    userId,
    bulan,
    tahun,
    file,
    entries,
    // Sengaja kosong: nama KEGIATAN tidak boleh disimpan sebagai Sub-RK
    // (master_kegiatan_anggota). Sub-RK hanya berasal dari Dataset RK atau
    // ditambahkan lewat menu Rencana Kinerja / pemetaan manual teks RK.
    rkTeamMapping: {},
    validRKsToAssign: [...validRKsToAssign],
    clientUploadId: clientUploadId || null,
    source,
  });
  return { ok: true, result, warnings: parsed.warnings };
}
