import test from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
import { barisExcel, hitungUlangRk, masalahBaris, susunDraft, tanggalTeks } from './draft.mjs';
import { buildCkpWorkbook, HEADER_KOLOM } from './excel.mjs';

const SUSENAS = 'Survei Sosial Ekonomi Nasional (Susenas)';
const APEL = 'Penerapan Budaya Organisasi (Apel Mingguan/Bulanan)';
const rkList = [SUSENAS, APEL];
const ctx = { rkList, kamus: [], aturanKustom: [], tahunDefault: 2026 };

test('susunDraft: tanggal ISO, usulan RK, urut tanggal', () => {
  const rows = susunDraft(
    [
      { namaFile: '5 Oktober_Melakukan Validasi Susenas.png', fileId: 'f2', link: 'https://drive/f2' },
      { namaFile: '1 Oktober_Apel Hari Kesaktian Pancasila.jpg', fileId: 'f1', link: 'https://drive/f1' },
      { namaFile: '22-23 Oktober 2027_Pelatihan.pdf', fileId: 'f3', link: 'https://drive/f3' },
    ],
    ctx,
  );
  assert.deepEqual(rows.map((r) => r.tanggalMulai), ['2026-10-01', '2026-10-05', '2027-10-22']);
  assert.equal(rows[0].rk, APEL);
  assert.equal(rows[1].rk, SUSENAS);
  assert.equal(rows[2].tanggalSelesai, '2027-10-23');
  assert.equal(rows[2].rk, '');
  assert.equal(rows[2].perluReview, true);
  assert.equal(rows[0].link, 'https://drive/f1');
});

test('nama file tanpa tanggal ditandai perlu review', () => {
  const [row] = susunDraft([{ namaFile: 'foto kegiatan.jpg' }], ctx);
  assert.equal(row.tanggalMulai, '');
  assert.equal(row.perluReview, true);
  assert.match(row.alasan, /Tanggal tidak terbaca/);
});

test('hitungUlangRk tidak menimpa pilihan manual', () => {
  const rows = susunDraft([{ namaFile: '5 Oktober_Validasi Susenas.png' }], ctx);
  const manual = [{ ...rows[0], rk: APEL, rkManual: true }];
  assert.equal(hitungUlangRk(manual, ctx)[0].rk, APEL);
  const otomatis = [{ ...rows[0], rk: '' }];
  assert.equal(hitungUlangRk(otomatis, ctx)[0].rk, SUSENAS);
});

test('masalahBaris: periode, RK, kegiatan', () => {
  const periode = { rkSet: new Set(rkList), periodeMulai: '2026-10-01', periodeSelesai: '2026-10-25' };
  const baik = { tanggalMulai: '2026-10-05', tanggalSelesai: '2026-10-05', kegiatan: 'Validasi', rk: SUSENAS };
  assert.deepEqual(masalahBaris(baik, periode), []);
  assert.deepEqual(masalahBaris({ ...baik, tanggalMulai: '2026-10-28', tanggalSelesai: '' }, periode), ['Tanggal di luar periode CKP']);
  assert.deepEqual(masalahBaris({ ...baik, rk: 'RK lain' }, periode), ['RK bukan Sub-RK Anda']);
  assert.deepEqual(masalahBaris({ ...baik, kegiatan: ' ', rk: '' }, periode), ['Kegiatan kosong', 'RK belum dipilih']);
  assert.deepEqual(masalahBaris({ ...baik, tanggalSelesai: '2026-10-01' }, periode), ['Tanggal selesai sebelum tanggal mulai']);
});

test('tanggalTeks dan barisExcel memakai format "21 Oktober 2026"', () => {
  assert.equal(tanggalTeks('2026-10-21'), '21 Oktober 2026');
  assert.equal(tanggalTeks(''), '');
  const [row] = barisExcel(susunDraft([{ namaFile: '1 Oktober_Apel pagi', link: 'L' }], ctx));
  assert.equal(row.tanggalMulai, '1 Oktober 2026');
  assert.equal(row.tanggalSelesai, '1 Oktober 2026');
  assert.equal(row.capaian, 'Telah Apel pagi');
  assert.equal(row.dataDukung, 'L');
});

test('buildCkpWorkbook: header baris 8, data mulai baris 9, Sheet3 berisi RK', () => {
  const rows = susunDraft(
    [
      { namaFile: '1 Oktober_Apel pagi.jpg', link: 'https://drive.google.com/file/d/a' },
      { namaFile: '5 Oktober_Validasi Susenas.png', link: 'https://drive.google.com/file/d/b' },
    ],
    ctx,
  );
  const bytes = buildCkpWorkbook({
    rows,
    header: { pegawai: '[1990] Uji', tahun: 2026, periode: 'Oktober' },
    rkList,
  });
  const wb = XLSX.read(bytes, { type: 'array' });
  assert.deepEqual(wb.SheetNames, ['Oktober', 'Sheet3']);
  const aoa = XLSX.utils.sheet_to_json(wb.Sheets.Oktober, { header: 1, blankrows: true, defval: null });
  assert.deepEqual(aoa[7], HEADER_KOLOM);
  assert.equal(aoa[8][1], '1 Oktober 2026');
  assert.equal(aoa[8][5], APEL);
  assert.equal(aoa[9][5], SUSENAS);
  assert.equal(aoa[9][9], 'https://drive.google.com/file/d/b');
  const rk = XLSX.utils.sheet_to_json(wb.Sheets.Sheet3, { header: 1 });
  assert.deepEqual(rk.flat(), ['Rencana Kerja', ...rkList]);
});
