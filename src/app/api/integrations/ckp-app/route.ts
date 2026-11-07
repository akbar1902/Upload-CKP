import { createAdminClient } from '@/lib/supabase/server';
import { authenticateIntegrationRequest } from '@/lib/integration/auth';
import { validateIntegrationUpload } from '@/lib/integration/payload.mjs';
import { loadSubRkContext, submitExcelForUser } from '@/lib/ckp/sub-rk-submit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

    let context;
    try {
      context = await loadSubRkContext(admin, auth.userId, bulan, tahun);
    } catch (error) {
      console.error('[integration GET] konteks RK:', error);
      return json({ success: false, error: 'Gagal membaca penugasan RK.' }, 500);
    }

    return json({
      success: true,
      user: {
        id: auth.user.id,
        full_name: auth.user.full_name,
        nip: auth.user.nip,
        role: auth.user.role,
        unit_kerja: auth.user.unit_kerja,
      },
      rks: context.rks,
      // Sub-RK (RK Anggota) yang harus dicocokkan dengan kolom "Rencana Kinerja"
      // di Excel. `rks` di atas tetap dikirim untuk kompatibilitas aplikasi lama.
      subRks: context.subRks,
      source: context.source,
      periode: {
        bulan,
        tahun,
        locked: context.locked,
      },
      lastUpload: context.lastUpload,
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
    const expectedRows = Number(form.get('expectedRows'));
    const clientUploadId = String(form.get('clientUploadId') || '').trim().slice(0, 120) || null;

    // File Excel adalah sumber kebenaran (diparse di server), bukan JSON client.
    const outcome = await submitExcelForUser({
      userId: auth.userId,
      bulan,
      tahun,
      file,
      expectedRows: Number.isInteger(expectedRows) && expectedRows > 0 ? expectedRows : null,
      clientUploadId,
      source: 'ckp-app',
    });

    if (!outcome.ok) {
      const { status, ok: _ok, ...body } = outcome;
      void _ok;
      return json({ success: false, ...body }, status);
    }

    const { result, warnings } = outcome;
    if (!result.success) {
      return json({ success: false, error: result.error || 'Upload gagal diproses.' }, 400);
    }

    return json({
      success: true,
      uploadId: result.uploadId,
      version: result.version,
      status: result.status,
      duplicate: Boolean(result.duplicate),
      warnings,
      url: result.uploadId ? `/pegawai/ckp/${result.uploadId}` : null,
    });
  } catch (error) {
    console.error('[integration POST] Error:', error);
    return json({ success: false, error: 'Terjadi kesalahan pada server SIKAP saat menerima CKP.' }, 500);
  }
}
