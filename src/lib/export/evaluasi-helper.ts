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
  rencana_kinerja: string;
  items: RKItem[];
  score: number | null;
  umpanBalik: UmpanBalikCategory;
}

/**
 * Categorize score into feedback status based on thresholds:
 * 99 - 100 : Diatas Ekspektasi (Green)
 * 80 - 98  : Sesuai Ekspektasi (Blue)
 * 0 - 79   : Dibawah Ekspektasi (Red)
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

  // Rounded to handle floats like 98.8 or 79.5 cleanly
  const rounded = Math.round(score);

  if (rounded >= 99) {
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

  if (rounded >= 80) {
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

/**
 * Groups flat entries by `rencana_kinerja` while preserving original order.
 */
export function groupEntriesByRK(entries: any[]): GroupedRK[] {
  if (!entries || entries.length === 0) return [];

  const map = new Map<string, { items: RKItem[]; scores: number[] }>();

  for (const entry of entries) {
    const rawRk = entry.rencana_kinerja?.trim();
    const rkKey = rawRk && rawRk.length > 0 ? rawRk : 'Lainnya / Tidak Ditentukan';

    if (!map.has(rkKey)) {
      map.set(rkKey, { items: [], scores: [] });
    }

    const group = map.get(rkKey)!;
    group.items.push({
      id: entry.id,
      kegiatan: entry.kegiatan || '-',
      data_dukung: entry.data_dukung ? entry.data_dukung.trim() : null,
      progres: entry.progres !== undefined && entry.progres !== null ? entry.progres : null,
      nilai: entry.nilai !== undefined && entry.nilai !== null ? entry.nilai : null,
    });

    if (entry.nilai !== undefined && entry.nilai !== null && !isNaN(entry.nilai)) {
      group.scores.push(Number(entry.nilai));
    }
  }

  const result: GroupedRK[] = [];

  for (const [rkName, val] of map.entries()) {
    let finalScore: number | null = null;
    if (val.scores.length > 0) {
      // Calculate average score for this RK
      const sum = val.scores.reduce((a, b) => a + b, 0);
      finalScore = Math.round((sum / val.scores.length) * 10) / 10;
    }

    result.push({
      rencana_kinerja: rkName,
      items: val.items,
      score: finalScore,
      umpanBalik: getUmpanBalikCategory(finalScore),
    });
  }

  return result;
}
