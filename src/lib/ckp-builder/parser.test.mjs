// Port test CKP-App/src/parser.test.js — format nama file nyata.
import test from 'node:test';
import assert from 'node:assert/strict';
import { expandKegiatan, parseFileName } from './parser.mjs';

/** @param {string} nama @param {Record<string, unknown>} harapan */
function cek(nama, harapan) {
  const p = parseFileName(nama);
  for (const [kunci, nilai] of Object.entries(harapan)) {
    assert.equal(p[kunci], nilai, `${nama} → ${kunci} harus ${nilai}, dapat ${p[kunci]}`);
  }
  return p;
}

test('format dasar', () => {
  cek('21 September_melakukan pelayanan PST', { ok: true, tglAwal: 21, tglAkhir: 21, bulan: 'September', tahun: null });
  cek('20-27 September_Klasikal Latsar', { ok: true, tglAwal: 20, tglAkhir: 27, bulan: 'September' });
  cek('1 Oktober_Menjadi Operator Rilis BRS', { ok: true, tglAwal: 1, tglAkhir: 1, bulan: 'Oktober' });
  cek('2 Oktober_Ganti wilayah dan koordinat.png', { ok: true, tglAwal: 2, bulan: 'Oktober' });
});

test('titik setelah tanggal & pemisah tanpa underscore', () => {
  cek('1. Oktober_Apel Hari Kesaktian Pancasila', { ok: true, tglAwal: 1, bulan: 'Oktober', kegiatanRaw: 'Apel Hari Kesaktian Pancasila' });
  cek('1 Oktober - Apel Hari Besar', { ok: true, tglAwal: 1, kegiatanRaw: 'Apel Hari Besar' });
  cek('1 Oktober Apel Hari Besar', { ok: true, tglAwal: 1, kegiatanRaw: 'Apel Hari Besar' });
  cek('1Oktober_Apel', { ok: true, tglAwal: 1, bulan: 'Oktober' });
  cek('01_Oktober_Apel', { ok: true, tglAwal: 1, bulan: 'Oktober' });
});

test('tahun di nama file', () => {
  cek('1 Oktober 2026_Apel', { ok: true, tglAwal: 1, bulan: 'Oktober', tahun: 2026 });
  cek('1 Oktober 2027 - Apel', { ok: true, tahun: 2027 });
  cek('22-23 Oktober 2027_Melakukan Pelatihan', { ok: true, tglAwal: 22, tglAkhir: 23, tahun: 2027 });
});

test('singkatan bulan', () => {
  const alias = {
    '1 Jan_Kegiatan': 'Januari', '1 Feb_Kegiatan': 'Februari', '1 Mar_Kegiatan': 'Maret',
    '1 Apr_Kegiatan': 'April', '1 Mei_Kegiatan': 'Mei', '1 Jun_Kegiatan': 'Juni',
    '1 Jul_Kegiatan': 'Juli', '1 Agt_Kegiatan': 'Agustus', '1 Agu_Kegiatan': 'Agustus',
    '1 Sept_Kegiatan': 'September', '1 Sep_Kegiatan': 'September', '1 Okt_Kegiatan': 'Oktober',
    '1 Nov_Kegiatan': 'November', '1 Nop_Kegiatan': 'November', '1 Des_Kegiatan': 'Desember',
  };
  for (const [nama, bulan] of Object.entries(alias)) cek(nama, { ok: true, bulan });
});

test('tanggal angka', () => {
  cek('2026-10-01_Apel', { ok: true, tglAwal: 1, bulan: 'Oktober', tahun: 2026 });
  cek('01-10-2026_Apel', { ok: true, tglAwal: 1, bulan: 'Oktober', tahun: 2026 });
  cek('01.10.2026 - Apel', { ok: true, tglAwal: 1, bulan: 'Oktober', tahun: 2026 });
  cek('01/10/2026_Apel', { ok: true, tglAwal: 1, bulan: 'Oktober', tahun: 2026 });
  cek('01-10_Apel', { ok: true, tglAwal: 1, bulan: 'Oktober', tahun: null });
});

test('tanggal di tengah / nama kamera', () => {
  cek('Dokumentasi 5 Oktober_kegiatan', { ok: true, tglAwal: 5, bulan: 'Oktober', kegiatanRaw: 'kegiatan' });
  cek('IMG_20261021_103000_Kegiatan', { ok: true, tglAwal: 21, bulan: 'Oktober', tahun: 2026, kegiatanRaw: 'Kegiatan' });
  cek('WhatsApp Image 2026-10-21 at 10.30.00 - Kegiatan', { ok: true, tglAwal: 21, bulan: 'Oktober', tahun: 2026, kegiatanRaw: 'Kegiatan' });
});

test('rentang s.d. dalam bulan yang sama', () => {
  cek('1 sd 3 Oktober_Kegiatan', { ok: true, tglAwal: 1, tglAkhir: 3, bulan: 'Oktober' });
  cek('1 s.d. 3 Oktober_Kegiatan', { ok: true, tglAwal: 1, tglAkhir: 3 });
});

test('tanggal tetap disimpan walau kegiatan kosong / lintas bulan', () => {
  const kosong = cek('1 Oktober', { ok: false, tglAwal: 1, bulan: 'Oktober' });
  assert.match(kosong.alasan, /Kegiatan kosong/);
  const lintas = cek('30 September-2 Oktober_kegiatan', { ok: false, tglAwal: 30, bulan: 'September' });
  assert.match(lintas.alasan, /lintas bulan/i);
});

test('nama tanpa tanggal tetap gagal dengan alasan jelas', () => {
  const p = cek('foto kegiatan', { ok: false });
  assert.match(p.alasan, /Tanggal tidak terbaca/);
  cek('SE2026_Melakukan Pendataan', { ok: false });
});

test('penanda duplikat dan kurung dibersihkan dari kegiatan', () => {
  cek('1 Oktober_Apel (1)', { ok: true, kegiatanRaw: 'Apel' });
  cek('1 Oktober 2026 (Apel)', { ok: true, kegiatanRaw: 'Apel' });
});

test('kamus singkatan mengembangkan kata utuh tanpa duplikasi', () => {
  const kamus = [{ singkatan: 'PST', ekspansi: 'Pelayanan Statistik Terpadu (PST)' }];
  assert.equal(expandKegiatan('melakukan pelayanan PST', kamus), 'melakukan Pelayanan Statistik Terpadu (PST)');
  assert.equal(expandKegiatan('rapat PST', kamus), 'rapat Pelayanan Statistik Terpadu (PST)');
  assert.equal(expandKegiatan('PSTN baru', kamus), 'PSTN baru');
});
