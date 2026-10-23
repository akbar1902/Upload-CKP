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
