/**
 * Penyusun draft CKP dari daftar bukti dukung (port `susunDraft` CKP App),
 * plus validasi baris dan konversi ke baris Excel CKP.
 */

import { BULAN, expandKegiatan, parseFileName } from './parser.mjs';
import { suggestRK } from './matcher.mjs';

/**
 * @typedef {{
 *   id: string,
 *   namaFile: string,
 *   fileId: string | null,
 *   link: string,
 *   tanggalMulai: string,
 *   tanggalSelesai: string,
 *   kegiatan: string,
 *   rk: string,
 *   usulan: string[],
 *   rkManual: boolean,
 *   perluReview: boolean,
 *   alasan: string,
 * }} DraftRow
 * Tanggal berformat ISO `YYYY-MM-DD` (kosong bila belum terbaca).
 */

/** @typedef {{ namaFile: string, fileId?: string | null, link?: string | null, id?: string }} BuktiDukung */

/** @param {number} n */
const pad = (n) => String(n).padStart(2, '0');

/** @param {number | null | undefined} tahun @param {number | undefined} bulan @param {number | null | undefined} tgl */
export function isoDate(tahun, bulan, tgl) {
  if (!tahun || !bulan || !tgl) return '';
  return `${tahun}-${pad(bulan)}-${pad(tgl)}`;
}

/** @param {string} namaFile */
function idDari(namaFile) {
  let h = 0;
  for (let i = 0; i < namaFile.length; i += 1) h = (h * 31 + namaFile.charCodeAt(i)) | 0;
  return `r${(h >>> 0).toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Satu bukti dukung → satu baris draft.
 * @param {BuktiDukung} file
 * @param {{ kamus?: import('./parser.mjs').EntriKamus[], rkList: string[], aturanKustom?: import('./matcher.mjs').AturanKunci[], tahunDefault: number }} ctx
 * @returns {DraftRow}
 */
export function susunBaris(file, ctx) {
  const p = parseFileName(file.namaFile);
  const kegiatan = expandKegiatan(p.kegiatanRaw || file.namaFile, ctx.kamus);
  const usulan = suggestRK(kegiatan, ctx.rkList, 3, { namaFile: file.namaFile, aturanKustom: ctx.aturanKustom })
    .map((s) => s.rk);
  const tahun = p.tahun || ctx.tahunDefault;
  const mulai = isoDate(tahun, p.bulanIndex, p.tglAwal);
  const selesai = isoDate(tahun, p.bulanIndex, p.tglAkhir);
  return {
    id: file.id || idDari(file.namaFile),
    namaFile: file.namaFile,
    fileId: file.fileId ?? null,
    link: file.link || '',
    tanggalMulai: mulai,
    tanggalSelesai: selesai,
    kegiatan,
    rk: usulan[0] || '',
    usulan,
    rkManual: false,
    perluReview: !p.ok || !usulan[0],
    alasan: p.ok ? (usulan[0] ? '' : 'RK tidak yakin — pilih manual') : p.alasan,
  };
}

/** @param {DraftRow} a @param {DraftRow} b */
export function urutkanBaris(a, b) {
  return (a.tanggalMulai || '9999').localeCompare(b.tanggalMulai || '9999')
    || a.namaFile.localeCompare(b.namaFile, 'id');
}

/**
 * @param {BuktiDukung[]} files
 * @param {Parameters<typeof susunBaris>[1]} ctx
 * @returns {DraftRow[]}
 */
export function susunDraft(files, ctx) {
  return files.map((f) => susunBaris(f, ctx)).sort(urutkanBaris);
}

/**
 * Hitung ulang usulan RK; baris yang RK-nya dipilih manual tidak ditimpa.
 * @param {DraftRow[]} rows
 * @param {{ rkList: string[], aturanKustom?: import('./matcher.mjs').AturanKunci[] }} ctx
 */
export function hitungUlangRk(rows, ctx) {
  return rows.map((row) => {
    const usulan = suggestRK(row.kegiatan, ctx.rkList, 3, { namaFile: row.namaFile, aturanKustom: ctx.aturanKustom })
      .map((s) => s.rk);
    if (row.rkManual && row.rk) return { ...row, usulan };
    return { ...row, usulan, rk: usulan[0] || '', perluReview: !usulan[0] || !row.tanggalMulai };
  });
}

/**
 * Masalah yang membuat baris belum bisa disubmit.
 * @param {Pick<DraftRow, 'tanggalMulai' | 'tanggalSelesai' | 'kegiatan' | 'rk'>} row
 * @param {{ rkSet: Set<string>, periodeMulai: string, periodeSelesai: string }} ctx tanggal ISO
 * @returns {string[]}
 */
export function masalahBaris(row, ctx) {
  /** @type {string[]} */
  const masalah = [];
  const mulai = row.tanggalMulai;
  const selesai = row.tanggalSelesai || row.tanggalMulai;
  if (!mulai) masalah.push('Tanggal mulai kosong');
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(mulai)) masalah.push('Format tanggal mulai salah');
  if (selesai && selesai < mulai) masalah.push('Tanggal selesai sebelum tanggal mulai');
  if (mulai && (mulai < ctx.periodeMulai || mulai > ctx.periodeSelesai)) masalah.push('Tanggal di luar periode CKP');
  else if (selesai && selesai > ctx.periodeSelesai) masalah.push('Tanggal selesai di luar periode CKP');
  if (!String(row.kegiatan || '').trim()) masalah.push('Kegiatan kosong');
  if (!row.rk) masalah.push('RK belum dipilih');
  else if (!ctx.rkSet.has(row.rk)) masalah.push('RK bukan Sub-RK Anda');
  return masalah;
}

const NAMA_BULAN = Object.values(BULAN).map((b) => b.nama);

/** ISO → "21 Oktober 2026" (format yang dibaca parser Excel SIKAP). @param {string} iso */
export function tanggalTeks(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  return `${Number(m[3])} ${NAMA_BULAN[Number(m[2]) - 1]} ${m[1]}`;
}

/**
 * Baris draft → baris Excel CKP (urutan sesuai template SIKAP).
 * @param {DraftRow[]} rows
 */
export function barisExcel(rows) {
  return [...rows].sort(urutkanBaris).map((row, i) => {
    const kegiatan = row.kegiatan.trim();
    return {
      no: i + 1,
      tanggalMulai: tanggalTeks(row.tanggalMulai),
      tanggalSelesai: tanggalTeks(row.tanggalSelesai || row.tanggalMulai),
      rk: row.rk,
      kegiatan,
      progres: 100,
      capaian: kegiatan ? `Telah ${kegiatan}` : '',
      dataDukung: row.link,
    };
  });
}
