import test from 'node:test';
import assert from 'node:assert/strict';

import {
  MAX_XLSX_BYTES,
  buildRkIndex,
  buildSubRkIndex,
  findRkByName,
  normalizeRkName,
  resolveRkTarget,
  validateIntegrationUpload,
} from './payload.mjs';

test('normalizeRkName membuang tahun, tanda baca, dan spasi', () => {
  assert.equal(
    normalizeRkName('Terlaksananya Survei Harga Tahun 2026'),
    normalizeRkName('terlaksananya survei harga')
  );
  assert.equal(
    normalizeRkName('Terlaksananya Kegiatan (PST) 2026'),
    'terlaksananyakegiatanpst'
  );
});

test('findRkByName mencocokkan nama RK yang berbeda format', () => {
  const rks = [
    { id: 'rk-1', rencana_kinerja: 'Terlaksananya Survei Harga Tahun 2026' },
    { id: 'rk-2', rencana_kinerja: 'Terlaksananya Pelayanan Statistik Terpadu (PST)' },
  ];
  const index = buildRkIndex(rks);

  assert.equal(findRkByName(index, 'terlaksananya survei harga')?.id, 'rk-1');
  assert.equal(findRkByName(index, 'Terlaksananya Pelayanan Statistik Terpadu (PST)')?.id, 'rk-2');
  assert.equal(findRkByName(index, 'RK yang tidak ada'), null);
});

test('validateIntegrationUpload menerima file Excel dan periode yang valid', () => {
  const result = validateIntegrationUpload({
    bulan: 10,
    tahun: 2026,
    fileName: 'CKP_Oktober.xlsx',
    fileSize: 1024,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.data, {
    bulan: 10,
    tahun: 2026,
    fileName: 'CKP_Oktober.xlsx',
    fileSize: 1024,
  });
});

test('validateIntegrationUpload menolak ekstensi selain Excel', () => {
  const result = validateIntegrationUpload({
    bulan: 10,
    tahun: 2026,
    fileName: 'CKP_Oktober.zip',
    fileSize: 1024,
  });

  assert.equal(result.ok, false);
  assert.match(result.error, /xlsx|xls/i);
});

test('validateIntegrationUpload menolak bulan dan tahun tidak valid', () => {
  assert.equal(validateIntegrationUpload({ bulan: 13, tahun: 2026, fileName: 'a.xlsx', fileSize: 1 }).ok, false);
  assert.equal(validateIntegrationUpload({ bulan: 0, tahun: 2026, fileName: 'a.xlsx', fileSize: 1 }).ok, false);
  assert.equal(validateIntegrationUpload({ bulan: 10, tahun: 1999, fileName: 'a.xlsx', fileSize: 1 }).ok, false);
});

test('validateIntegrationUpload menolak file kosong atau terlalu besar', () => {
  assert.equal(validateIntegrationUpload({ bulan: 10, tahun: 2026, fileName: 'a.xlsx', fileSize: 0 }).ok, false);
  assert.equal(
    validateIntegrationUpload({ bulan: 10, tahun: 2026, fileName: 'a.xlsx', fileSize: MAX_XLSX_BYTES + 1 }).ok,
    false
  );
});

// ─── Pencocokan RK: Sub-RK (RK Anggota) → RK Ketua Tim ────────────────────────

const parentA = { id: 'parent-a', rencana_kinerja: 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026' };
const parentB = { id: 'parent-b', rencana_kinerja: 'Terlaksananya Pelayanan Publik BPS Kabupaten Belitung' };

const subRkRows = [
  {
    user_id: 'user-1',
    rk_id: 'parent-a',
    kegiatan_nama: 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026',
  },
  {
    user_id: 'user-1',
    rk_id: 'parent-b',
    kegiatan_nama: 'Terlaksananya Tugas Harian Pelayanan Pengaduan',
  },
  {
    user_id: 'user-2',
    rk_id: 'parent-b',
    kegiatan_nama: 'Terlaksananya Pelayanan Statistik Terpadu (PST)',
  },
];

const parents = new Set(['parent-a', 'parent-b']);

test('buildSubRkIndex menormalkan nama Sub-RK dan memfilter parent/user', () => {
  const semua = buildSubRkIndex(subRkRows, { hanyaParent: parents });
  assert.equal(semua.size, 3);
  assert.deepEqual([...semua.get(normalizeRkName('Terlaksananya Tugas Harian Pelayanan Pengaduan'))], ['parent-b']);

  const milikUser1 = buildSubRkIndex(subRkRows, { hanyaParent: parents, userId: 'user-1' });
  assert.equal(milikUser1.size, 2);
  assert.equal(milikUser1.has(normalizeRkName('Terlaksananya Pelayanan Statistik Terpadu (PST)')), false);
});

test('resolveRkTarget memprioritaskan Sub-RK milik pegawai sendiri', () => {
  const rkUtama = buildRkIndex([parentA, parentB]);
  const subRkSendiri = buildSubRkIndex(subRkRows, { hanyaParent: parents, userId: 'user-1' });
  const subRkSemua = buildSubRkIndex(subRkRows, { hanyaParent: parents });

  const hasil = resolveRkTarget(
    'terlaksananya kegiatan survei sosial ekonomi nasional (susenas)',
    { subRkSendiri, subRkSemua, rkUtama }
  );
  assert.deepEqual(hasil, { rkId: 'parent-a', via: 'sub-rk' });
});

test('resolveRkTarget memakai Sub-RK pegawai lain bila tidak ada di daftar sendiri', () => {
  const rkUtama = buildRkIndex([parentA, parentB]);
  const subRkSendiri = buildSubRkIndex(subRkRows, { hanyaParent: parents, userId: 'user-1' });
  const subRkSemua = buildSubRkIndex(subRkRows, { hanyaParent: parents });

  const hasil = resolveRkTarget('Terlaksananya Pelayanan Statistik Terpadu (PST)', {
    subRkSendiri,
    subRkSemua,
    rkUtama,
  });
  assert.deepEqual(hasil, { rkId: 'parent-b', via: 'sub-rk-global' });
});

test('resolveRkTarget mencocokkan Sub-RK mirip (beda ejaan kecil)', () => {
  const rkUtama = buildRkIndex([parentA, parentB]);
  const subRkSemua = buildSubRkIndex(subRkRows, { hanyaParent: parents });

  const hasil = resolveRkTarget('Terlaksananya Tugas Harian Pelayanan Pengaduann', {
    subRkSendiri: new Map(),
    subRkSemua,
    rkUtama,
  });
  assert.equal(hasil?.rkId, 'parent-b');
  assert.match(hasil?.via || '', /sub-rk/);
});

test('resolveRkTarget tetap menerima nama RK Ketua Tim (berkas lama)', () => {
  const rkUtama = buildRkIndex([parentA, parentB]);
  const hasil = resolveRkTarget(parentA.rencana_kinerja, {
    subRkSendiri: new Map(),
    subRkSemua: new Map(),
    rkUtama,
  });
  assert.deepEqual(hasil, { rkId: 'parent-a', via: 'rk-utama' });
});

test('resolveRkTarget mengembalikan null untuk RK yang benar-benar asing', () => {
  const rkUtama = buildRkIndex([parentA, parentB]);
  const subRkSemua = buildSubRkIndex(subRkRows, { hanyaParent: parents });
  assert.equal(
    resolveRkTarget('Membuat laporan bulanan yang tidak ada di SIKAP', {
      subRkSendiri: new Map(),
      subRkSemua,
      rkUtama,
    }),
    null
  );
});

test('resolveRkTarget tidak menebak bila satu Sub-RK dipetakan ke dua parent', () => {
  const rkUtama = buildRkIndex([parentA, parentB]);
  const ambigu = buildSubRkIndex(
    [
      { user_id: 'user-1', rk_id: 'parent-a', kegiatan_nama: 'Kegiatan Ganda' },
      { user_id: 'user-1', rk_id: 'parent-b', kegiatan_nama: 'Kegiatan Ganda' },
    ],
    { hanyaParent: parents, userId: 'user-1' }
  );
  const hasil = resolveRkTarget('Kegiatan Ganda', {
    subRkSendiri: ambigu,
    subRkSemua: ambigu,
    rkUtama,
  });
  // Boleh jatuh ke nama parent bila ada; di sini tidak ada → null (tidak menebak).
  assert.equal(hasil, null);
});
