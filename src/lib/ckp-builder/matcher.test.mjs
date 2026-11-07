// Port test CKP-App/src/rk-matcher.test.js — kata kunci pendek tidak menyerobot.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cariKunciKustom, suggestRK } from './matcher.mjs';

const rkList = JSON.parse(readFileSync(new URL('./fixtures/rk-list.json', import.meta.url), 'utf8'));
const SENSUS = 'Terlaksananya Kegiatan Sensus Ekonomi 2026';
const SUSENAS = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026';
const aturanSE = [{ rk: SENSUS, kunci: ['SE'] }];

/** @param {string} namaFile @param {Array<{rk: string, kunci: string[]}>} [aturanKustom] @param {string} [kegiatan] */
function top(namaFile, aturanKustom = aturanSE, kegiatan = '') {
  const hasil = suggestRK(kegiatan, rkList, 1, { namaFile, aturanKustom });
  return hasil[0] ? hasil[0].rk : '';
}

test('kata kunci SE menangkap singkatan SE / SE2026', () => {
  assert.equal(top('13 Oktober_Melakukan Pendataan ASN SE2026 di Membalong.jpeg', aturanSE, 'Melakukan Pendataan ASN SE2026 di Membalong'), SENSUS);
  assert.equal(top('2 Oktober_Ganti wilayah dan koordinat SE 2026.png', aturanSE, 'Ganti wilayah dan koordinat SE 2026'), SENSUS);
  assert.equal(top('1 Oktober_Penugasan SE.jpeg', aturanSE, 'Penugasan SE'), SENSUS);
});

test('kata kunci SE tidak menyerobot Susenas / Kesejahteraan', () => {
  assert.equal(top('5 Oktober_Melakukan Validasi Susenas.png', aturanSE, 'Melakukan Validasi Susenas'), SUSENAS);
  assert.notEqual(top('2 Oktober_Mengisi Survei Kesejahteraan Pegawai.png', aturanSE, 'Mengisi Survei Kesejahteraan Pegawai'), SENSUS);
});

test('aturan bawaan Susenas tetap jalan tanpa aturan kustom', () => {
  assert.equal(top('5 Oktober_Melakukan Validasi Susenas.png', [], 'Melakukan Validasi Susenas'), SUSENAS);
});

test('kata kunci frasa tetap dicocokkan', () => {
  const aturan = [{ rk: 'Terlaksananya Pelayanan Statistik Terpadu (PST)', kunci: ['pelayanan statistik'] }];
  assert.equal(
    top('3 Oktober_Melakukan Pelayanan Statistik untuk mahasiswa.png', aturan, 'Melakukan Pelayanan Statistik untuk mahasiswa'),
    'Terlaksananya Pelayanan Statistik Terpadu (PST)',
  );
});

test('kata kunci pendek tidak menangkap potongan kata lain', () => {
  const aturan = [{ rk: 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', kunci: ['apel'] }];
  assert.equal(cariKunciKustom('4 oktober_menerima rapel gaji', aturan, rkList), null);
  assert.equal(cariKunciKustom('4 oktober_menerima rapel gaji', aturanSE, rkList), null);
  assert.equal(cariKunciKustom('1 oktober_apel pagi bersama', aturan, rkList), aturan[0].rk);
});

test('kegiatan tanpa kecocokan kuat tidak diberi RK asal-asalan', () => {
  const hasil = suggestRK('Mengisi Survei Kesejahteraan Pegawai', rkList, 3, {
    namaFile: '2 Oktober_Mengisi Survei Kesejahteraan Pegawai.png',
    aturanKustom: aturanSE,
  });
  assert.deepEqual(hasil, []);
});

const RK_SINKRON = [
  'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi',
  'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026',
  'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya',
];

test('kata kunci SE tetap menemukan RK Sensus Ekonomi setelah daftar RK berubah', () => {
  const hasil = suggestRK('Ganti wilayah dan koordinat SE 2026', RK_SINKRON, 1, {
    namaFile: '2 Oktober_Ganti wilayah dan koordinat SE 2026.png',
    aturanKustom: [{ rk: 'Terlaksananya Kegiatan Sensus Ekonomi 2026', kunci: ['SE'] }],
  });
  assert.equal(hasil[0]?.rk, 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi');
});

test('aturan bawaan SE tetap menemukan RK pengganti di daftar SIKAP', () => {
  const hasil = suggestRK('Mengisi keterangan pendapatan Usaha Besar (UB)', RK_SINKRON, 1, {
    namaFile: '2 Oktober_Mengisi keterangan pendapatan Usaha Besar (UB).png',
    aturanKustom: [],
  });
  assert.equal(hasil[0]?.rk, 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi');
});
