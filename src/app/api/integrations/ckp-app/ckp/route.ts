import { createAdminClient } from '@/lib/supabase/server';
import { authenticateIntegrationRequest } from '@/lib/integration/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * CKP yang SUDAH ada di SIKAP, untuk extension CKP Companion (pengisi KipApp).
 *
 *   GET /api/integrations/ckp-app/ckp               → daftar CKP pegawai (versi terbaru per bulan)
 *   GET /api/integrations/ckp-app/ckp?bulan=&tahun= → kegiatan CKP bulan itu, siap diisi ke KipApp
 *
 * Auth: `Authorization: Bearer <token integrasi>` (sama dengan CKP App / pairing).
 * Hanya CKP milik pemilik token. Versi `superseded` (arsip) tidak pernah dikirim.
 */

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

type UploadRow = {
  id: string;
  bulan: number;
  tahun: number;
  version: number | null;
  status: string;
  uploaded_at: string | null;
  total_entries: number | null;
};

type EntryRow = {
  row_number: number | null;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  rencana_kinerja: string | null;
  kegiatan: string | null;
  progres: number | null;
  capaian: string | null;
  data_dukung: string | null;
};

function isoTanggal(value: string | null) {
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(String(value ?? ''));
  return m ? m[1] : '';
}

export async function GET(request: Request) {
  const auth = await authenticateIntegrationRequest(request);
  if (!auth.ok) return json({ success: false, error: auth.error }, auth.status);

  try {
    const admin = createAdminClient();
    const url = new URL(request.url);
    const bulanParam = url.searchParams.get('bulan');
    const tahunParam = url.searchParams.get('tahun');
    const user = { id: auth.user.id, full_name: auth.user.full_name, nip: auth.user.nip };

    const { data: uploads, error } = await admin
      .from('ckp_uploads')
      .select('id, bulan, tahun, version, status, uploaded_at, total_entries')
      .eq('user_id', auth.userId)
      .neq('status', 'superseded')
      .order('tahun', { ascending: false })
      .order('bulan', { ascending: false })
      .order('version', { ascending: false })
      .limit(60);
    if (error) throw error;

    // Versi terbaru per (tahun, bulan).
    const terbaru = new Map<string, UploadRow>();
    for (const u of (uploads ?? []) as UploadRow[]) {
      const key = `${u.tahun}-${u.bulan}`;
      if (!terbaru.has(key)) terbaru.set(key, u);
    }

    if (!bulanParam && !tahunParam) {
      return json({
        success: true,
        user,
        ckp: [...terbaru.values()].slice(0, 24).map((u) => ({
          bulan: u.bulan,
          tahun: u.tahun,
          version: u.version,
          status: u.status,
          totalEntries: u.total_entries,
          uploadedAt: u.uploaded_at,
        })),
      });
    }

    const bulan = Number(bulanParam);
    const tahun = Number(tahunParam);
    if (!Number.isInteger(bulan) || bulan < 1 || bulan > 12 || !Number.isInteger(tahun) || tahun < 2020 || tahun > 2100) {
      return json({ success: false, error: 'Bulan/tahun tidak valid.' }, 400);
    }

    const upload = terbaru.get(`${tahun}-${bulan}`);
    if (!upload) {
      return json({ success: false, error: 'Belum ada CKP untuk bulan ini di SIKAP.' }, 404);
    }

    const { data: entries, error: entriesError } = await admin
      .from('ckp_entries')
      .select('row_number, tanggal_mulai, tanggal_selesai, rencana_kinerja, kegiatan, progres, capaian, data_dukung')
      .eq('upload_id', upload.id)
      .order('row_number', { ascending: true })
      .limit(1000);
    if (entriesError) throw entriesError;

    const rows = ((entries ?? []) as EntryRow[]).map((e, i) => {
      const mulai = isoTanggal(e.tanggal_mulai);
      return {
        no: String(e.row_number ?? i + 1),
        tanggalMulai: mulai,
        tanggalSelesai: isoTanggal(e.tanggal_selesai) || mulai,
        rencanaKinerja: String(e.rencana_kinerja ?? '').trim(),
        kegiatan: String(e.kegiatan ?? '').trim(),
        progres: e.progres == null ? '100' : String(e.progres),
        capaian: String(e.capaian ?? '').trim(),
        dataDukung: String(e.data_dukung ?? '').trim(),
      };
    });

    return json({
      success: true,
      user,
      upload: {
        id: upload.id,
        bulan: upload.bulan,
        tahun: upload.tahun,
        version: upload.version,
        status: upload.status,
        uploadedAt: upload.uploaded_at,
      },
      rows,
    });
  } catch (error) {
    console.error('[integration ckp GET] Error:', error);
    return json({ success: false, error: 'Gagal membaca CKP dari SIKAP.' }, 500);
  }
}
