/**
 * Kontrak payload integrasi CKP App → SIKAP.
 * File ini sengaja JavaScript murni (bukan TS) agar bisa diuji langsung
 * dengan `node --test` tanpa build tool.
 */

export const MAX_XLSX_BYTES = 10 * 1024 * 1024;

/**
 * @param {string | null | undefined} name
 * @returns {string}
 */
export function normalizeRkName(name) {
  return String(name ?? '')
    .toLowerCase()
    .replace(/\btahun\s*20\d{2}\b/g, '')
    .replace(/\b20\d{2}\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * @param {Array<{ id: string, rencana_kinerja: string | null }>} rks
 * @returns {Map<string, { id: string, rencana_kinerja: string | null }>}
 */
export function buildRkIndex(rks) {
  const index = new Map();
  for (const rk of Array.isArray(rks) ? rks : []) {
    const key = normalizeRkName(rk?.rencana_kinerja);
    if (key && !index.has(key)) index.set(key, rk);
  }
  return index;
}

/**
 * @param {Map<string, { id: string, rencana_kinerja: string | null }>} index
 * @param {string | null | undefined} name
 */
export function findRkByName(index, name) {
  const key = normalizeRkName(name);
  if (!key) return null;
  return index.get(key) || null;
}

/**
 * Indeks Sub-RK (RK Anggota) → id RK Ketua Tim (parent).
 * Satu nama Sub-RK bisa dipetakan ke lebih dari satu parent (data lama/keliru);
 * resolusi hanya boleh dipakai bila kandidatnya tunggal.
 *
 * @param {Array<{ kegiatan_nama?: string | null, rk_id?: string | null, user_id?: string | null }>} rows
 * @param {{ userId?: string | null, hanyaParent?: Set<string> | null }} [opsi]
 * @returns {Map<string, Set<string>>}
 */
export function buildSubRkIndex(rows, opsi = {}) {
  const index = new Map();
  const hanyaParent = opsi.hanyaParent || null;
  const userId = opsi.userId ? String(opsi.userId) : '';
  for (const row of Array.isArray(rows) ? rows : []) {
    const rkId = String(row?.rk_id || '').trim();
    if (!rkId) continue;
    if (hanyaParent && !hanyaParent.has(rkId)) continue;
    if (userId && String(row?.user_id || '') !== userId) continue;
    const key = normalizeRkName(row?.kegiatan_nama);
    if (!key) continue;
    if (!index.has(key)) index.set(key, new Set());
    index.get(key).add(rkId);
  }
  return index;
}

/** Kemiripan bigram (0..1) — sama dengan pencocokan di halaman upload SIKAP. */
export function bigramSimilarity(a, b) {
  const s1 = String(a || '');
  const s2 = String(b || '');
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return 0;
  const bg1 = new Set();
  const bg2 = new Set();
  for (let i = 0; i < s1.length - 1; i++) bg1.add(s1.slice(i, i + 2));
  for (let i = 0; i < s2.length - 1; i++) bg2.add(s2.slice(i, i + 2));
  let sama = 0;
  for (const bg of bg1) if (bg2.has(bg)) sama++;
  return (2 * sama) / (bg1.size + bg2.size);
}

function satuKandidat(ids) {
  if (!ids || ids.size !== 1) return null;
  return [...ids][0];
}

function cariSubRkMirip(key, index, ambang) {
  let terbaik = null;
  let skorTerbaik = 0;
  for (const [kunci, ids] of index) {
    if (ids.size !== 1) continue;
    const skor = bigramSimilarity(key, kunci);
    if (skor > skorTerbaik) {
      skorTerbaik = skor;
      terbaik = ids;
    }
  }
  return skorTerbaik >= ambang ? satuKandidat(terbaik) : null;
}

/**
 * Resolusi teks RK dari Excel CKP App ke RK Ketua Tim.
 * Urutan (paling spesifik dulu):
 *   1. Sub-RK milik pegawai (persis, kandidat tunggal)
 *   2. Sub-RK pegawai lain (persis, kandidat tunggal)
 *   3. Sub-RK mirip (bigram >= 0,9)
 *   4. Nama RK Ketua Tim (berkas lama yang sudah memakai nama parent)
 *
 * @param {string | null | undefined} rawRk
 * @param {{
 *   subRkSendiri?: Map<string, Set<string>>,
 *   subRkSemua?: Map<string, Set<string>>,
 *   rkUtama?: Map<string, { id: string, rencana_kinerja: string | null }> | null,
 * }} opsi
 * @returns {{ rkId: string, via: 'sub-rk' | 'sub-rk-global' | 'sub-rk-mirip' | 'rk-utama' } | null}
 */
export function resolveRkTarget(rawRk, opsi = {}) {
  const key = normalizeRkName(rawRk);
  if (!key) return null;
  const { subRkSendiri, subRkSemua, rkUtama } = opsi;

  let rkId = satuKandidat(subRkSendiri && subRkSendiri.get(key));
  if (rkId) return { rkId, via: 'sub-rk' };

  rkId = satuKandidat(subRkSemua && subRkSemua.get(key));
  if (rkId) return { rkId, via: 'sub-rk-global' };

  rkId =
    cariSubRkMirip(key, subRkSendiri || new Map(), 0.9) ||
    cariSubRkMirip(key, subRkSemua || new Map(), 0.9);
  if (rkId) return { rkId, via: 'sub-rk-mirip' };

  const parent = rkUtama ? findRkByName(rkUtama, rawRk) : null;
  if (parent?.id) return { rkId: String(parent.id), via: 'rk-utama' };

  return null;
}

/**
 * @param {{ bulan: unknown, tahun: unknown, fileName: unknown, fileSize: unknown }} input
 * @returns {{ ok: true, data: { bulan: number, tahun: number, fileName: string, fileSize: number } } | { ok: false, error: string }}
 */
export function validateIntegrationUpload({ bulan, tahun, fileName, fileSize }) {
  const nama = String(fileName || '').trim();
  if (!nama) return { ok: false, error: 'File Excel CKP wajib diunggah.' };
  if (!/\.(xlsx|xls)$/i.test(nama)) {
    return { ok: false, error: 'File harus berformat .xlsx atau .xls.' };
  }

  const ukuran = Number(fileSize);
  if (!Number.isFinite(ukuran) || ukuran <= 0) {
    return { ok: false, error: 'File Excel kosong atau tidak terbaca.' };
  }
  if (ukuran > MAX_XLSX_BYTES) {
    return { ok: false, error: 'File Excel terlalu besar (maksimal 10 MB).' };
  }

  const b = Number(bulan);
  const t = Number(tahun);
  if (!Number.isInteger(b) || b < 1 || b > 12) {
    return { ok: false, error: 'Bulan tidak valid (1–12).' };
  }
  if (!Number.isInteger(t) || t < 2020 || t > 2100) {
    return { ok: false, error: 'Tahun tidak valid.' };
  }

  return {
    ok: true,
    data: { bulan: b, tahun: t, fileName: nama, fileSize: ukuran },
  };
}
