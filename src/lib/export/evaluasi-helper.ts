import { rkGroupKey, rkGroupAvg } from '@/lib/rk-scoring';

export interface RKItem {
  id?: string;
  kegiatan: string;
  data_dukung: string | null;
  progres?: number | null;
  nilai?: number | null;
}

export interface UmpanBalikCategory {
  label: string;
  color: 'green' | 'blue' | 'red' | 'gray';
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeBgHex: string;
  textColorHex: string;
}

export interface GroupedRK {
  /** Nama tampil: Sub-RK asli (data baru) atau nama parent RK (data lama). */
  rencana_kinerja: string;
  /** Kunci grup stabil dari kontrak rk-scoring: 'id:<uuid>' / 'legacy:<nama>'. */
  rkGroupKey: string;
  /** Nama parent RK dari rk_ketua_tim_mapping; null untuk data lama / tanpa mapping. */
  parentRkName: string | null;
  items: RKItem[];
  score: number | null;
  umpanBalik: UmpanBalikCategory;
}

/**
 * Threshold TEGAS pada nilai mentah 1 desimal — TANPA Math.round dulu:
 * 99 - 100  : Diatas Ekspektasi (Green)
 * 80 - <99  : Sesuai Ekspektasi (Blue)
 * 0  - <80  : Dibawah Ekspektasi (Red)
 * Contoh: 79.5 tetap Dibawah Ekspektasi (tidak naik kelas ke 80).
 */
export function getUmpanBalikCategory(score: number | null | undefined): UmpanBalikCategory {
  if (score === null || score === undefined || isNaN(score)) {
    return {
      label: 'Belum Dinilai',
      color: 'gray',
      bgClass: 'bg-slate-200 text-slate-700',
      textClass: 'text-slate-600 dark:text-slate-400',
      borderClass: 'border-slate-300',
      badgeBgHex: '#6E6759',
      textColorHex: '#FFFFFF',
    };
  }

  const v = Number(score);

  if (v >= 99) {
    return {
      label: 'Diatas Ekspektasi',
      color: 'green',
      bgClass: 'bg-[#46583E] text-white',
      textClass: 'text-[#3A4A34]',
      borderClass: 'border-green-600',
      badgeBgHex: '#46583E',
      textColorHex: '#FFFFFF',
    };
  }

  if (v >= 80) {
    return {
      label: 'Sesuai Ekspektasi',
      color: 'blue',
      bgClass: 'bg-[#0F766E] text-white',
      textClass: 'text-[#0F766E]',
      borderClass: 'border-sky-600',
      badgeBgHex: '#0F766E',
      textColorHex: '#FFFFFF',
    };
  }

  return {
    label: 'Dibawah Ekspektasi',
    color: 'red',
    bgClass: 'bg-[#A8442F] text-white',
    textClass: 'text-[#A8442F]',
    borderClass: 'border-red-600',
    badgeBgHex: '#A8442F',
    textColorHex: '#FFFFFF',
  };
}

/** Map id parent RK (uuid) -> nama parent RK. */
export type RkParentMap = Record<string, string> | Map<string, string>;

function lookupParentName(map: RkParentMap | undefined, id: string | null | undefined): string | null {
  if (!map || !id) return null;
  const v = map instanceof Map ? map.get(id) : map[id];
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;
}

/** Parent RK yang mungkin sudah ikut ter-join di entry (forward-compat bila layer data menambahkannya). */
function readInlineParentName(entry: any): string | null {
  const v =
    entry?.parentRkName ??
    entry?.parent_rk_name ??
    entry?.parent_rk ??
    entry?.rk_parent_name ??
    entry?.rk_ketua_tim_nama;
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;
}

/** Pecah teks jadi himpunan kata (huruf/angka saja, huruf kecil). */
function rkTokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean),
  );
}

/**
 * True bila parent RK praktis sama dengan sub-RK, sehingga menampilkan
 * "(parent)" hanya membuat label dobel. Contoh: sub "Terlaksananya Kegiatan
 * Survei ... Tahun 2026" vs parent "Terlaksananya Survei ... Tahun 2026"
 * (beda hanya kata "Kegiatan").
 */
function isRedundantParent(sub: string, parent: string): boolean {
  const a = rkTokens(sub);
  const b = rkTokens(parent);
  if (a.size === 0 || b.size === 0) return false;

  let inter = 0;
  a.forEach((t) => {
    if (b.has(t)) inter += 1;
  });
  const union = a.size + b.size - inter;
  const jaccard = union > 0 ? inter / union : 0;
  if (jaccard >= 0.8) return true;

  // Salah satu himpunan kata termuat penuh di himpunan lain
  const minSize = Math.min(a.size, b.size);
  return minSize > 0 && inter === minSize;
}

/**
 * Label tampil RK: 'Sub-RK (Parent RK)' bila parent ada dan benar-benar
 * berbeda dari sub; fallback nama sub apa adanya (data lama / tanpa mapping).
 * Parent yang nyaris identik dengan sub tidak ditampilkan agar tidak dobel.
 */
export function formatRkLabel(
  subName: string | null | undefined,
  parentName: string | null | undefined,
): string {
  const sub = (subName ?? '').trim() || 'Lainnya / Tidak Ditentukan';
  const parent = (parentName ?? '').trim();
  if (!parent) return sub;
  const normSub = sub.toLowerCase().replace(/\s+/g, ' ');
  const normParent = parent.toLowerCase().replace(/\s+/g, ' ');
  if (normParent === normSub) return sub;
  if (isRedundantParent(sub, parent)) return sub;
  return `${sub} (${parent})`;
}

/** Label tampil untuk satu grup hasil groupEntriesByRK. */
export function getGroupedRkDisplayName(group: {
  rencana_kinerja: string;
  parentRkName?: string | null;
}): string {
  return formatRkLabel(group.rencana_kinerja, group.parentRkName ?? null);
}

/**
 * Groups flat entries by kontrak rkGroupKey (bukan nama mentah),
 * sehingga sub-RK senama dari parent berbeda tidak tercampur.
 * Preserves original order. Skor rata-rata via rkGroupAvg (1 desimal,
 * null bila belum ada nilai -> kategori Belum Dinilai).
 */
export function groupEntriesByRK(entries: any[], parentMap?: RkParentMap): GroupedRK[] {
  if (!entries || entries.length === 0) return [];

  const map = new Map<string, { displayName: string; parentRkName: string | null; items: RKItem[] }>();
  const order: string[] = [];

  for (const entry of entries) {
    const key = rkGroupKey(entry ?? {});
    const rawSub = typeof entry?.rencana_kinerja === 'string' ? entry.rencana_kinerja.trim() : '';
    const fallbackName = rawSub.length > 0 ? rawSub : 'Lainnya / Tidak Ditentukan';

    let group = map.get(key);
    if (!group) {
      group = { displayName: fallbackName, parentRkName: null, items: [] };
      map.set(key, group);
      order.push(key);
    }

    if (!group.parentRkName && entry?.rk_ketua_tim_id) {
      const fromMap = lookupParentName(parentMap, entry.rk_ketua_tim_id);
      if (fromMap) group.parentRkName = fromMap;
    }
    if (!group.parentRkName) {
      const inline = readInlineParentName(entry);
      if (inline) group.parentRkName = inline;
    }

    group.items.push({
      id: entry.id,
      kegiatan: entry.kegiatan || '-',
      data_dukung: entry.data_dukung ? entry.data_dukung.trim() : null,
      progres: entry.progres !== undefined && entry.progres !== null ? entry.progres : null,
      nilai: entry.nilai !== undefined && entry.nilai !== null ? entry.nilai : null,
    });
  }

  return order.map((key) => {
    const group = map.get(key)!;
    const finalScore = rkGroupAvg(group.items.map((i) => ({ nilai: i.nilai ?? null })));
    return {
      rencana_kinerja: group.displayName,
      rkGroupKey: key,
      parentRkName: group.parentRkName,
      items: group.items,
      score: finalScore,
      umpanBalik: getUmpanBalikCategory(finalScore),
    };
  });
}
