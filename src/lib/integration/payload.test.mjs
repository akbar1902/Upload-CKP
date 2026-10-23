import test from 'node:test';
import assert from 'node:assert/strict';

import {
  MAX_XLSX_BYTES,
  buildRkIndex,
  findRkByName,
  normalizeRkName,
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
