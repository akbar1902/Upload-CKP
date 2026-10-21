// Kontrak bersama Sub-RK — dipakai jalur penilaian, approval, monitoring, export.
// Data baru: rk_ketua_tim_id = UUID parent di rk_ketua_tim_mapping,
//            rencana_kinerja = nama Sub-RK asli.
// Data lama: rk_ketua_tim_id = NULL, rencana_kinerja = nama parent RK.
// JANGAN ubah signature fungsi di file ini tanpa koordinasi.

export function normalizeRkName(name: string | null | undefined): string {
  return (name ?? '')
    .toLowerCase()
    .replace(/tahun\s*20\d{2}/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/** Pemisah id parent RK dan nama Sub-RK di dalam kunci grup. */
export const RK_GROUP_NAME_SEP = '::';

/**
 * Kunci grup RK (per Sub-RK):
 *  - data baru : `id:<uuid parent>::<nama sub-RK ternormalisasi>`
 *  - data lama : `legacy:<nama ternormalisasi>`
 *
 * Nama Sub-RK WAJIB ikut di kunci. Satu parent RK (`rk_ketua_tim_mapping.id`)
 * bisa punya beberapa Sub-RK (baris `rencana_kinerja` berbeda). Dulu kunci
 * hanya memakai id, sehingga beberapa Sub-RK tergabung jadi satu kartu: nilai
 * yang diketik untuk satu Sub-RK tampil sebagai rata-rata gabungan (90 -> 90,9
 * karena satu kegiatan Sub-RK lain masih 97) dan hanya sebagian kegiatan yang
 * benar-benar tersimpan.
 */
export function rkGroupKey(e: {
  rk_ketua_tim_id?: string | null;
  rencana_kinerja?: string | null;
}): string {
  const name = normalizeRkName(e.rencana_kinerja);
  if (e.rk_ketua_tim_id) {
    return `id:${e.rk_ketua_tim_id}${RK_GROUP_NAME_SEP}${name}`;
  }
  return `legacy:${name}`;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ParsedRkGroupKey {
  /** Id parent RK (`rk_ketua_tim_mapping.id`) untuk data baru. */
  rkId: string | null;
  /** Nama ternormalisasi untuk data lama (rk_ketua_tim_id NULL). */
  legacyNorm: string | null;
  /** Nama Sub-RK ternormalisasi yang ikut di kunci (null bila tidak ada). */
  nameNorm: string | null;
}

/**
 * Baca kunci grup dari `rkGroupKey`. Menerima format baru
 * (`id:<uuid>::<nama>`, `legacy:<nama>`) plus UUID mentah untuk kompatibilitas
 * pemanggil lama. Selalu pakai helper ini, jangan parsing manual.
 */
export function parseRkGroupKey(key: string | null | undefined): ParsedRkGroupKey {
  const k = (key ?? '').trim();
  if (!k) return { rkId: null, legacyNorm: null, nameNorm: null };

  if (k.startsWith('id:')) {
    const body = k.slice(3);
    const sep = body.indexOf(RK_GROUP_NAME_SEP);
    const id = (sep === -1 ? body : body.slice(0, sep)).trim();
    const name = sep === -1 ? '' : body.slice(sep + RK_GROUP_NAME_SEP.length).trim();
    return { rkId: id || null, legacyNorm: null, nameNorm: name || null };
  }

  if (k.startsWith('legacy:')) {
    const name = k.slice(7).trim();
    return { rkId: null, legacyNorm: name || null, nameNorm: name || null };
  }

  if (UUID_RE.test(k)) return { rkId: k, legacyNorm: null, nameNorm: null };

  const norm = normalizeRkName(k) || null;
  return { rkId: null, legacyNorm: norm, nameNorm: norm };
}

/** Satu grup RK dianggap selesai hanya jika SEMUA entry-nya bernilai. */
export function isRkGroupScored<T extends { nilai: number | null }>(
  es: T[],
): boolean {
  return es.length > 0 && es.every((x) => x.nilai !== null);
}

/** Rata-rata 1 desimal dari nilai non-null; null bila belum ada nilai. */
export function rkGroupAvg<T extends { nilai: number | null }>(
  es: T[],
): number | null {
  const s = es.filter((x) => x.nilai !== null);
  if (s.length === 0) return null;
  return (
    Math.round(
      (s.reduce((a, b) => a + (b.nilai as number), 0) / s.length) * 10,
    ) / 10
  );
}

/** Display selalu 1 desimal; '-' bila null. */
export function formatScore1(n: number | null | undefined): string {
  if (n === null || n === undefined) return '-';
  return Number(n).toFixed(1);
}

/**
 * Rata-rata BILANGAN BULAT untuk nilai RK.
 * Nilai RK (bulanan maupun triwulan) tidak boleh berkoma: rata-rata
 * dibulatkan ke bilangan bulat terdekat (96.7 -> 97). Dipakai untuk nilai RK
 * per bulan, nilai triwulan, dan rincian bulan di dalam triwulan.
 */
export function rkGroupAvgInt<T extends { nilai: number | null }>(
  es: T[],
): number | null {
  const s = es.filter((x) => x.nilai !== null);
  if (s.length === 0) return null;
  return Math.round(s.reduce((a, b) => a + (b.nilai as number), 0) / s.length);
}

/** Display nilai RK sebagai bilangan bulat; '-' bila null. */
export function formatScore0(n: number | null | undefined): string {
  if (n === null || n === undefined) return '-';
  return Math.round(Number(n)).toString();
}

// ─────────────────────────────────────────────────────────────
// Filter "RK milik ketua tim" — SATU sumber untuk server & client.
//
// Halaman Detail CKP menyaring entri agar hanya menampilkan RK milik ketua
// tim yang direview. Dulu server membandingkan NAMA parent vs `rencana_kinerja`
// entri (yang berisi nama Sub-RK) sementara client membandingkan
// `rk_ketua_tim_id` — akibatnya hasil server 0 dan di-hydrate ke client
// (staleTime 5 menit) sehingga daftar RK tampak kosong. Gunakan helper ini
// di MANA PUN agar filter tidak pernah berbeda perilaku lagi.
// ─────────────────────────────────────────────────────────────

/** Nilai untuk argumen `.or(...)` PostgREST: mapping milik ketua tim (dan penilai). */
export function rkMappingOwnerFilter(
  ketuaTimId: string,
  reviewerId?: string | null,
): string {
  const parts = [`ketua_tim_id.eq.${ketuaTimId}`];
  if (reviewerId) parts.push(`ketua_tim_id.eq.${reviewerId}`);
  return parts.join(',');
}

export interface RkOwnerMapping {
  id: string;
  rencana_kinerja: string | null;
}

/**
 * Saring entri CKP agar hanya menyisakan milik RK ketua tim tsb.
 * - Data baru: cocokkan `rk_ketua_tim_id` ke id mapping.
 * - Data lama: fallback cocokkan nama parent (dinormalisasi).
 * Mengembalikan array kosong bila mapping kosong (perilaku server lama).
 */
export function filterEntriesByOwnRk<
  T extends {
    rk_ketua_tim_id?: string | null;
    rencana_kinerja?: string | null;
  },
>(entries: T[], mappings: RkOwnerMapping[] | null | undefined): T[] {
  if (!mappings || mappings.length === 0) return [];
  const ownIds = new Set(
    mappings.map((m) => m.id).filter((id): id is string => Boolean(id)),
  );
  const ownNorms = new Set(
    mappings.map((m) => normalizeRkName(m.rencana_kinerja)),
  );
  return entries.filter(
    (e) =>
      (e.rk_ketua_tim_id && ownIds.has(e.rk_ketua_tim_id)) ||
      (!e.rk_ketua_tim_id &&
        e.rencana_kinerja &&
        ownNorms.has(normalizeRkName(e.rencana_kinerja))),
  );
}
