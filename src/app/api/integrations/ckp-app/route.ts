import { createAdminClient } from '@/lib/supabase/server';
import { fetchAllRows } from '@/lib/supabase/read';
import { authenticateIntegrationRequest } from '@/lib/integration/auth';
import {
  buildRkIndex,
  findRkByName,
  validateIntegrationUpload,
} from '@/lib/integration/payload.mjs';
import { parseExcelFile } from '@/lib/excel/parser';
import { submitCkpUploadCore, type UploadItem } from '@/lib/ckp/submit-upload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface RkRow {
  id: string;
  rencana_kinerja: string;
  tim_kerja: string | null;
  tahun: number | null;
}

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function periodeSekarang() {
  const now = new Date();
  return { bulan: now.getMonth() + 1, tahun: now.getFullYear() };
}

export async function GET(request: Request) {
  const auth = await authenticateIntegrationRequest(request);
  if (!auth.ok) return json({ success: false, error: auth.error }, auth.status);

  try {
    const admin = createAdminClient();
    const url = new URL(request.url);
    const sekarang = periodeSekarang();
    const bulan = Number(url.searchParams.get('bulan')) || sekarang.bulan;
    const tahun = Number(url.searchParams.get('tahun')) || sekarang.tahun;
    if (!Number.isInteger(bulan) || bulan < 1 || bulan > 12 || !Number.isInteger(tahun) || tahun < 2020 || tahun > 2100) {
      return json({ success: false, error: 'Bulan/tahun tidak valid.' }, 400);
    }

    const [mapping, assignments, periode, lastUpload] = await Promise.all([
      fetchAllRows<RkRow>((from, to) =>
        admin
          .from('rk_ketua_tim_mapping')
          .select('id, rencana_kinerja, tim_kerja, tahun')
          .eq('is_active', true)
          .order('rencana_kinerja', { ascending: true })
          .range(from, to),
      ),
      admin
        .from('user_rk_assignments')
        .select('rk_id')
        .eq('user_id', auth.userId),
      admin
        .from('periode_ckp')
        .select('is_locked')
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .maybeSingle(),
      admin
        .from('ckp_uploads')
        .select('id, version, status, uploaded_at, total_entries')
        .eq('user_id', auth.userId)
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (assignments.error) {
      console.error('[integration GET] assignments:', assignments.error.message);
      return json({ success: false, error: 'Gagal membaca penugasan RK.' }, 500);
    }

    const assignedIds = new Set(
      (assignments.data ?? []).map((row) => String(row.rk_id || '')).filter(Boolean),
    );
    const mappingTahun = mapping.filter((rk) => rk.tahun == null || rk.tahun === tahun);
    const sudah = new Set();
    const rks = (assignedIds.size > 0
      ? mappingTahun.filter((rk) => assignedIds.has(String(rk.id)))
      : mappingTahun
    ).filter((rk) => {
      const kunci = String(rk.rencana_kinerja || '').toLowerCase().replace(/\btahun\s*20\d{2}\b/g, '').replace(/\b20\d{2}\b/g, '').replace(/[^a-z0-9]/g, '');
      if (!kunci || sudah.has(kunci)) return false;
      sudah.add(kunci);
      return true;
    });

    return json({
      success: true,
      user: {
        id: auth.user.id,
        full_name: auth.user.full_name,
        nip: auth.user.nip,
        role: auth.user.role,
        unit_kerja: auth.user.unit_kerja,
      },
      rks,
      source: assignedIds.size > 0 ? 'assigned' : 'master',
      periode: {
        bulan,
        tahun,
        locked: Boolean(periode.data?.is_locked),
      },
      lastUpload: lastUpload.data ?? null,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[integration GET] Error:', error);
    return json({ success: false, error: 'Gagal membaca data integrasi.' }, 500);
  }
}

export async function POST(request: Request) {
  const auth = await authenticateIntegrationRequest(request);
  if (!auth.ok) return json({ success: false, error: auth.error }, auth.status);

  try {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return json({ success: false, error: 'Payload harus berupa multipart/form-data.' }, 400);
    }

    const fileValue = form.get('file');
    if (!fileValue || typeof fileValue === 'string') {
      return json({ success: false, error: 'File Excel CKP wajib diunggah.' }, 400);
    }
    const file = fileValue as File;

    const valid = validateIntegrationUpload({
      bulan: form.get('bulan'),
      tahun: form.get('tahun'),
      fileName: file.name,
      fileSize: file.size,
    });
    if (!valid.ok) return json({ success: false, error: valid.error }, 400);

    const { bulan, tahun } = valid.data;

    // Parse file di server — file Excel adalah sumber kebenaran, bukan JSON
    // dari client. Ini mencegah entri dan file yang tersimpan tidak sinkron.
    const parsed = await parseExcelFile(file, bulan, tahun);
    if (!parsed.success || parsed.entries.length === 0) {
      return json(
        {
          success: false,
          error: parsed.errors[0] || 'File Excel tidak dapat dibaca.',
          errors: parsed.errors,
          warnings: parsed.warnings,
        },
        422,
      );
    }

    const expectedRows = Number(form.get('expectedRows'));
    if (Number.isInteger(expectedRows) && expectedRows > 0 && parsed.entries.length !== expectedRows) {
      return json(
        {
          success: false,
          error: `Sebagian baris di luar periode SIKAP: terbaca ${parsed.entries.length} dari ${expectedRows} baris. Periksa tanggal draft.`,
          warnings: parsed.warnings,
        },
        422,
      );
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
      return json(
        { success: false, error: 'Master RK di SIKAP masih kosong. Hubungi admin.' },
        422,
      );
    }

    const mappingTahun = mapping.filter((rk) => rk.tahun == null || rk.tahun === tahun);
    if (mappingTahun.length === 0) {
      return json(
        { success: false, error: `Belum ada RK aktif untuk tahun ${tahun} di SIKAP.` },
        422,
      );
    }

    const index = buildRkIndex(mappingTahun);
    const unmatchedRks = new Set<string>();
    const rkTeamMapping: Record<string, { rk_id: string }> = {};
    const validRKsToAssign = new Set<string>();

    const entries: UploadItem[] = parsed.entries.map((entry) => {
      const rawRK = String(entry.rencana_kinerja || '').trim();
      const hit = findRkByName(index, rawRK);
      if (!hit) {
        if (rawRK) unmatchedRks.add(rawRK);
        return { entry, rawRK };
      }

      validRKsToAssign.add(hit.id);
      const kegiatan = String(entry.kegiatan || '').trim();
      if (kegiatan) rkTeamMapping[kegiatan] = { rk_id: hit.id };

      return {
        entry,
        matchedRK: hit.rencana_kinerja,
        rawRK: rawRK || hit.rencana_kinerja,
        matchedRkId: hit.id,
      };
    });

    if (unmatchedRks.size > 0) {
      return json(
        {
          success: false,
          error: 'Ada RK di file Excel yang belum terdaftar di SIKAP.',
          unmatchedRks: [...unmatchedRks],
          hint: 'Buka CKP App → Profil & rekan → Tarik RK dari SIKAP, lalu susun ulang draft.',
        },
        422,
      );
    }

    const clientUploadId = String(form.get('clientUploadId') || '').trim().slice(0, 120) || null;

    const result = await submitCkpUploadCore({
      userId: auth.userId,
      bulan,
      tahun,
      file,
      entries,
      rkTeamMapping,
      validRKsToAssign: [...validRKsToAssign],
      clientUploadId,
      source: 'ckp-app',
    });

    if (!result.success) {
      return json({ success: false, error: result.error || 'Upload gagal diproses.' }, 400);
    }

    return json({
      success: true,
      uploadId: result.uploadId,
      version: result.version,
      status: result.status,
      duplicate: Boolean(result.duplicate),
      warnings: parsed.warnings,
      url: result.uploadId ? `/pegawai/ckp/${result.uploadId}` : null,
    });
  } catch (error) {
    console.error('[integration POST] Error:', error);
    return json({ success: false, error: 'Terjadi kesalahan pada server SIKAP saat menerima CKP.' }, 500);
  }
}
