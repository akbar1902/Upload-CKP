/**
 * Membuat file Excel CKP dengan tata letak template SIKAP (sama seperti
 * CKP-App/src/excel-builder.js): baris 1 judul, 2–6 metadata, 8 header
 * kolom, 9+ data, sheet "Sheet3" berisi daftar RK.
 * Memakai SheetJS (sudah dipakai SIKAP); gaya sel tidak ditulis karena
 * parser SIKAP hanya membaca struktur dan isi.
 */

import * as XLSX from 'xlsx';
import { barisExcel } from './draft.mjs';

export const HEADER_KOLOM = [
  'No',
  'Tanggal Mulai',
  'Tanggal Selesai',
  'Jam Mulai',
  'Jam Selesai',
  'Rencana Kinerja',
  'Kegiatan',
  'Progres (%)',
  'Capaian',
  'Data Dukung',
  'Capaian SKP',
];

const LEBAR = [4.5, 15.4, 16.5, 10.5, 13, 36.5, 35.4, 12.4, 39.7, 28.1, 13.9];

/** @param {unknown} nama */
export function sanitizeSheetName(nama) {
  const bersih = String(nama || 'CKP').replace(/[[\]:*?/\\]/g, ' ').trim() || 'CKP';
  return bersih.slice(0, 31);
}

/**
 * @param {{
 *   rows: import('./draft.mjs').DraftRow[],
 *   header: { pegawai: string, tahun: number | string, periode: string, wilayah?: string, unitKerja?: string },
 *   rkList: string[],
 *   sheetName?: string,
 * }} opts
 * @returns {Uint8Array} isi file .xlsx
 */
export function buildCkpWorkbook({ rows, header, rkList, sheetName }) {
  const data = barisExcel(rows);
  /** @type {unknown[][]} */
  const aoa = [
    ['Capaian Kinerja Perhari (CKP)'],
    ['Pegawai', null, `: ${header.pegawai || ''}`],
    ['Tahun', null, `: ${header.tahun || ''}`],
    ['Periode SKP', null, `: ${header.periode || ''}`],
    ['Wilayah', null, `: ${header.wilayah || ''}`],
    ['Unit Kerja', null, `: ${header.unitKerja || ''}`],
    [],
    HEADER_KOLOM,
    ...data.map((d) => [
      d.no,
      d.tanggalMulai,
      d.tanggalSelesai,
      null,
      null,
      d.rk,
      d.kegiatan,
      d.progres,
      d.capaian,
      d.dataDukung,
      'Ya',
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
    ...[1, 2, 3, 4, 5].flatMap((r) => [
      { s: { r, c: 0 }, e: { r, c: 1 } },
      { s: { r, c: 2 }, e: { r, c: 10 } },
    ]),
    { s: { r: 6, c: 0 }, e: { r: 6, c: 10 } },
  ];
  ws['!cols'] = LEBAR.map((wch) => ({ wch }));

  // Link bukti dukung bisa diklik di Excel.
  data.forEach((d, i) => {
    const ref = XLSX.utils.encode_cell({ r: 8 + i, c: 9 });
    if (d.dataDukung && ws[ref]) ws[ref].l = { Target: d.dataDukung };
  });

  const wsRk = XLSX.utils.aoa_to_sheet([['Rencana Kerja'], ...(rkList || []).map((rk) => [rk])]);
  wsRk['!cols'] = [{ wch: 87 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(sheetName || header.periode || 'CKP'));
  XLSX.utils.book_append_sheet(wb, wsRk, 'Sheet3');
  const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return new Uint8Array(out);
}
