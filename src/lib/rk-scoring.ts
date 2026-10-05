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

/** Kunci grup RK: 'id:<uuid>' untuk data baru, 'legacy:<nama>' untuk data lama. */
export function rkGroupKey(e: {
  rk_ketua_tim_id?: string | null;
  rencana_kinerja?: string | null;
}): string {
  if (e.rk_ketua_tim_id) return `id:${e.rk_ketua_tim_id}`;
  return `legacy:${normalizeRkName(e.rencana_kinerja)}`;
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
