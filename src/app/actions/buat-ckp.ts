'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { getPeriodRange } from '@/lib/excel/parser';
import { loadSubRkContext, submitExcelForUser, type SubRkContext } from '@/lib/ckp/sub-rk-submit';
import { masalahBaris, type DraftRow } from '@/lib/ckp-builder/draft.mjs';
import { buildCkpWorkbook } from '@/lib/ckp-builder/excel.mjs';
import { BULAN } from '@/lib/ckp-builder/parser.mjs';
import defaultKamus from '@/lib/ckp-builder/default-kamus.json';

const MAX_ROWS = 1000;
const NAMA_BULAN = Object.values(BULAN).map((b) => b.nama);

export type KamusEntry = { singkatan: string; ekspansi: string };
export type AturanKunci = { rk: string; kunci: string[] };

export type SubRkPilihan = SubRkContext['subRks'][number] & { resmi: boolean };

export interface BuatCkpContext {
  user: { id: string; fullName: string; nip: string; unitKerja: string };
  bulan: number;
  tahun: number;
  periode: { mulai: string; selesai: string; locked: boolean };
  subRks: SubRkPilihan[];
  lastUpload: SubRkContext['lastUpload'];
  draft: { rows: DraftRow[]; driveFolderId: string | null; updatedAt: string | null };
  settings: { kamus: KamusEntry[]; rkKeywords: AturanKunci[]; isDefault: boolean };
}

type ActionResult<T> = ({ ok: true } & T) | { ok: false; error: string };

async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

function validPeriode(bulan: number, tahun: number) {
  return Number.isInteger(bulan) && bulan >= 1 && bulan <= 12 && Number.isInteger(tahun) && tahun >= 2020 && tahun <= 2100;
}

function isoUtc(date: Date) {
  return date.toISOString().slice(0, 10);
}

function teks(value: unknown, max = 2000) {
  return String(value ?? '').slice(0, max);
}

/** Bersihkan baris draft dari client sebelum disimpan / diproses. */
function sanitizeRows(input: unknown): DraftRow[] {
  if (!Array.isArray(input)) return [];
  return input.slice(0, MAX_ROWS).map((raw, i) => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const tanggal = (v: unknown) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v ?? '')) ? String(v) : '');
    return {
      id: teks(r.id, 64) || `r${i}`,
      namaFile: teks(r.namaFile, 300),
      fileId: r.fileId ? teks(r.fileId, 200) : null,
      link: /^https:\/\//.test(String(r.link ?? '')) ? teks(r.link, 500) : '',
      tanggalMulai: tanggal(r.tanggalMulai),
      tanggalSelesai: tanggal(r.tanggalSelesai),
      kegiatan: teks(r.kegiatan, 1000),
      rk: teks(r.rk, 1000),
      usulan: Array.isArray(r.usulan) ? r.usulan.slice(0, 3).map((u) => teks(u, 1000)) : [],
      rkManual: Boolean(r.rkManual),
      perluReview: Boolean(r.perluReview),
      alasan: teks(r.alasan, 300),
    };
  });
}

function sanitizeKamus(input: unknown): KamusEntry[] {
  if (!Array.isArray(input)) return [];
  return input
    .slice(0, 500)
    .map((e) => ({ singkatan: teks((e as KamusEntry)?.singkatan, 50).trim(), ekspansi: teks((e as KamusEntry)?.ekspansi, 300).trim() }))
    .filter((e) => e.singkatan && e.ekspansi);
}

function sanitizeKeywords(input: unknown): AturanKunci[] {
  if (!Array.isArray(input)) return [];
  return input
    .slice(0, 300)
    .map((e) => {
      const it = (e ?? {}) as { rk?: unknown; kunci?: unknown };
      const kunci = (Array.isArray(it.kunci) ? it.kunci : String(it.kunci ?? '').split(','))
        .map((k) => teks(k, 100).trim())
        .filter(Boolean);
      return { rk: teks(it.rk, 1000).trim(), kunci: [...new Set(kunci)].slice(0, 50) };
    })
    .filter((e) => e.rk && e.kunci.length);
}

/**
 * Semua Sub-RK milik pegawai adalah pilihan resmi.
 *
 * Dulu `master_kegiatan_anggota` ikut terisi nama KEGIATAN lewat jalur CKP App,
 * sehingga halaman ini harus menyaringnya. Aturan itu dihapus dan datanya
 * dibersihkan (8 Nov 2026, lihat DOKUMENTASI_RK.md §10.5), jadi kini semua baris
 * dianggap resmi, termasuk RK yang ditambahkan manual lewat menu Rencana Kinerja.
 * Kolom `resmi` dipertahankan agar picker tetap bisa memisahkan bila suatu saat
 * dibutuhkan lagi.
 */
function tandaiSubRkResmi(subRks: SubRkContext['subRks']): SubRkPilihan[] {
  return subRks.map((s) => ({ ...s, resmi: true }));
}

export async function getBuatCkpContextAction(bulan: number, tahun: number): Promise<ActionResult<{ context: BuatCkpContext }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: 'Sesi berakhir. Silakan login ulang.' };
  if (!validPeriode(bulan, tahun)) return { ok: false, error: 'Bulan/tahun tidak valid.' };

  try {
    const admin = createAdminClient();
    const [ctx, profile, draft, settings] = await Promise.all([
      loadSubRkContext(admin, user.id, bulan, tahun),
      admin.from('users').select('full_name, nip, unit_kerja').eq('id', user.id).maybeSingle(),
      admin.from('ckp_drafts').select('rows, drive_folder_id, updated_at').eq('user_id', user.id).eq('bulan', bulan).eq('tahun', tahun).maybeSingle(),
      admin.from('user_ckp_settings').select('kamus, rk_keywords').eq('user_id', user.id).maybeSingle(),
    ]);
    if (draft.error) throw draft.error;
    if (settings.error) throw settings.error;

    const range = getPeriodRange(bulan, tahun);
    const subRks = tandaiSubRkResmi(ctx.subRks);
    return {
      ok: true,
      context: {
        user: {
          id: user.id,
          fullName: profile.data?.full_name ?? '',
          nip: profile.data?.nip ?? '',
          unitKerja: profile.data?.unit_kerja ?? '',
        },
        bulan,
        tahun,
        periode: { mulai: isoUtc(range.start), selesai: isoUtc(range.end), locked: ctx.locked },
        subRks,
        lastUpload: ctx.lastUpload,
        draft: {
          rows: sanitizeRows(draft.data?.rows),
          driveFolderId: draft.data?.drive_folder_id ?? null,
          updatedAt: draft.data?.updated_at ?? null,
        },
        settings: settings.data
          ? { kamus: sanitizeKamus(settings.data.kamus), rkKeywords: sanitizeKeywords(settings.data.rk_keywords), isDefault: false }
          : { kamus: sanitizeKamus(defaultKamus), rkKeywords: [], isDefault: true },
      },
    };
  } catch (error) {
    console.error('[buat-ckp] konteks:', error);
    const pesan = error instanceof Error ? error.message : String(error);
    if (/ckp_drafts|user_ckp_settings/.test(pesan)) {
      return { ok: false, error: 'Tabel Buat CKP belum ada. Admin perlu menjalankan migrasi 038_buat_ckp.sql.' };
    }
    return { ok: false, error: 'Gagal memuat data Buat CKP.' };
  }
}

export async function saveBuatCkpDraftAction(input: {
  bulan: number;
  tahun: number;
  rows: unknown;
  driveFolderId?: string | null;
}): Promise<ActionResult<{ updatedAt: string }>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: 'Sesi berakhir. Silakan login ulang.' };
  if (!validPeriode(input.bulan, input.tahun)) return { ok: false, error: 'Bulan/tahun tidak valid.' };

  const rows = sanitizeRows(input.rows);
  const updatedAt = new Date().toISOString();
  const { error } = await createAdminClient()
    .from('ckp_drafts')
    .upsert(
      {
        user_id: user.id,
        bulan: input.bulan,
        tahun: input.tahun,
        rows,
        drive_folder_id: input.driveFolderId ? teks(input.driveFolderId, 200) : null,
        updated_at: updatedAt,
      },
      { onConflict: 'user_id,bulan,tahun' },
    );
  if (error) {
    console.error('[buat-ckp] simpan draft:', error);
    return { ok: false, error: 'Draft gagal disimpan.' };
  }
  return { ok: true, updatedAt };
}

export async function deleteBuatCkpDraftAction(bulan: number, tahun: number): Promise<ActionResult<object>> {
  const user = await requireUser();
  if (!user) return { ok: false, error: 'Sesi berakhir. Silakan login ulang.' };
  const { error } = await createAdminClient().from('ckp_drafts').delete().eq('user_id', user.id).eq('bulan', bulan).eq('tahun', tahun);
  if (error) return { ok: false, error: 'Draft gagal dihapus.' };
  return { ok: true };
}

export async function saveBuatCkpSettingsAction(input: { kamus: unknown; rkKeywords: unknown }): Promise<
  ActionResult<{ kamus: KamusEntry[]; rkKeywords: AturanKunci[] }>
> {
  const user = await requireUser();
  if (!user) return { ok: false, error: 'Sesi berakhir. Silakan login ulang.' };
  const kamus = sanitizeKamus(input.kamus);
  const rkKeywords = sanitizeKeywords(input.rkKeywords);
  const { error } = await createAdminClient()
    .from('user_ckp_settings')
    .upsert({ user_id: user.id, kamus, rk_keywords: rkKeywords, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (error) {
    console.error('[buat-ckp] simpan pengaturan:', error);
    return { ok: false, error: 'Pengaturan gagal disimpan.' };
  }
  return { ok: true, kamus, rkKeywords };
}

export async function submitBuatCkpAction(input: {
  bulan: number;
  tahun: number;
  rows: unknown;
  clientUploadId: string;
}): Promise<
  | { ok: true; uploadId: string; version: number | null; duplicate: boolean }
  | { ok: false; error: string; unmatchedRks?: string[]; rowIssues?: Array<{ id: string; masalah: string[] }> }
> {
  const user = await requireUser();
  if (!user) return { ok: false, error: 'Sesi berakhir. Silakan login ulang.' };
  const { bulan, tahun } = input;
  if (!validPeriode(bulan, tahun)) return { ok: false, error: 'Bulan/tahun tidak valid.' };

  const rows = sanitizeRows(input.rows);
  if (rows.length === 0) return { ok: false, error: 'Draft masih kosong.' };

  try {
    const admin = createAdminClient();
    const [ctx, profile] = await Promise.all([
      loadSubRkContext(admin, user.id, bulan, tahun),
      admin.from('users').select('full_name, nip, unit_kerja').eq('id', user.id).maybeSingle(),
    ]);
    if (ctx.locked) return { ok: false, error: 'Periode CKP ini sedang dikunci admin.' };

    // Validasi ulang di server: client tidak dipercaya.
    const range = getPeriodRange(bulan, tahun);
    const rkSet = new Set(ctx.subRks.map((s) => s.kegiatan_nama));
    const rowIssues = rows
      .map((row) => ({ id: row.id, masalah: masalahBaris(row, { rkSet, periodeMulai: isoUtc(range.start), periodeSelesai: isoUtc(range.end) }) }))
      .filter((r) => r.masalah.length > 0);
    if (rowIssues.length > 0) {
      return { ok: false, error: `${rowIssues.length} baris belum valid. Perbaiki dulu sebelum submit.`, rowIssues };
    }

    const namaBulan = NAMA_BULAN[bulan - 1];
    const pegawai = profile.data ? `[${profile.data.nip ?? ''}] ${profile.data.full_name ?? ''}`.trim() : '';
    const bytes = buildCkpWorkbook({
      rows,
      header: { pegawai, tahun, periode: namaBulan, wilayah: 'Kabupaten Belitung', unitKerja: profile.data?.unit_kerja ?? '' },
      rkList: [...rkSet],
      sheetName: namaBulan,
    });
    const file = new File([bytes as BlobPart], `CKP_${namaBulan}_${tahun}.xlsx`, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const outcome = await submitExcelForUser({
      userId: user.id,
      bulan,
      tahun,
      file,
      expectedRows: rows.length,
      clientUploadId: teks(input.clientUploadId, 120) || null,
      source: 'buat-ckp',
    });
    if (!outcome.ok) return { ok: false, error: outcome.error, unmatchedRks: outcome.unmatchedRks };
    if (!outcome.result.success || !outcome.result.uploadId) {
      return { ok: false, error: outcome.result.error || 'Submit gagal diproses.' };
    }

    await admin.from('ckp_drafts').delete().eq('user_id', user.id).eq('bulan', bulan).eq('tahun', tahun);
    revalidatePath('/pegawai');
    return {
      ok: true,
      uploadId: outcome.result.uploadId,
      version: outcome.result.version ?? null,
      duplicate: Boolean(outcome.result.duplicate),
    };
  } catch (error) {
    console.error('[buat-ckp] submit:', error);
    return { ok: false, error: 'Terjadi kesalahan di server saat submit CKP.' };
  }
}
