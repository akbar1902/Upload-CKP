// ============================================================
// Parser "Dataset RK" (matriks per tim)
// ------------------------------------------------------------
// Format file (1 sheet bernama "Matriks"):
//   Kolom A : Pegawai  -> "[NIP] Nama Lengkap"
//   Kolom B : Jabatan
//   Kolom C : Status   -> "Ketua" | "Anggota"
//   Kolom D..: "Rencana Kinerja 1", "2", ... (1 kolom = 1 RK Ketua Tim)
//
// Baris 1 (Status = Ketua)      -> RK Ketua Tim (parent), 1 RK per kolom.
// Baris 2+ (Status = Anggota)   -> tiap sel berisi 1..n poin RK Anggota (sub-RK).
//   Poin dipisah baris baru; tiap poin dipetakan ke parent pada kolom yang sama.
//
// Khusus "Team Belitung": ketuanya Pimpinan, anggotanya para Ketua Tim,
// dan poinnya adalah RK Ketua Tim (yang dinilai Pimpinan). Ditangani sama.
// ============================================================

import * as XLSX from 'xlsx';

export interface DatasetSubRk {
  text: string;
  nip: string | null;
  nama: string;
}

export interface DatasetParentRk {
  rk: string;
  columnIndex: number;
  subRks: DatasetSubRk[];
}

export interface DatasetKetua {
  nip: string | null;
  nama: string;
}

export interface DatasetTeam {
  fileName: string;
  teamName: string;
  ketua: DatasetKetua | null;
  parents: DatasetParentRk[];
}

export interface ParsedDataset {
  teams: DatasetTeam[];
  warnings: string[];
  totals: { teams: number; parents: number; subRks: number };
}

/** Decode HTML entities, termasuk yang ter-escape ganda (&amp;amp; -> &). */
export function decodeHtmlEntities(input: string): string {
  let s = String(input ?? '');
  for (let i = 0; i < 3; i++) {
    const next = s
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#0*39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, ' ');
    if (next === s) break;
    s = next;
  }
  return s;
}

/** Bersihkan teks RK satu baris (untuk nama parent). */
export function cleanRkText(input: unknown): string {
  return decodeHtmlEntities(String(input ?? ''))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Ambil NIP dari format "[340020086] Nama". */
export function extractNip(value: unknown): string | null {
  const m = String(value ?? '').match(/\[(\d+)\]/);
  return m ? m[1] : null;
}

/** Ambil nama tanpa prefix "[NIP] ". */
export function extractNama(value: unknown): string {
  return String(value ?? '')
    .replace(/^\s*\[\d+\]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const BULLET_RE = /^[\u2022\u2023\u25AA\u25E6\u00B7\u25CF\u25CB\-\*]\s*/;

/**
 * Pecah isi satu sel menjadi daftar poin RK Anggota.
 * - Pisah berdasarkan baris baru.
 * - Dukung bullet yang berdiri sendiri ("•") di baris terpisah dari teksnya.
 * - Buang bullet kosong.
 * - Dedupe (case-insensitive) di dalam satu sel.
 */
export function splitCellPoints(raw: unknown): string[] {
  const decoded = decodeHtmlEntities(String(raw ?? '')).replace(/\r\n?/g, '\n');
  const points: string[] = [];
  const seen = new Set<string>();

  for (const rawLine of decoded.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    // Bullet yang berdiri sendiri -> buang, teks ada di baris berikutnya.
    if (/^[\u2022\u2023\u25AA\u25E6\u00B7\u25CF\u25CB\-\*]$/.test(line)) continue;

    const text = line.replace(BULLET_RE, '').trim();
    if (!text) continue;

    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    points.push(text);
  }

  return points;
}

function isKetuaStatus(status: unknown): boolean {
  return /ketua/i.test(String(status ?? '').trim());
}

/** Parse satu sheet matriks menjadi struktur tim. */
export function parseDatasetRkSheet(
  rows: unknown[][],
  fileName: string
): { team: DatasetTeam; warnings: string[] } {
  const warnings: string[] = [];
  const teamName = fileName.replace(/\.xlsx?$/i, '').trim();
  const team: DatasetTeam = { fileName, teamName, ketua: null, parents: [] };

  if (!Array.isArray(rows) || rows.length === 0) {
    warnings.push(`[${fileName}] Sheet kosong / tidak terbaca.`);
    return { team, warnings };
  }

  const header = (rows[0] as unknown[]) || [];

  // Kolom Pegawai & Status (fallback ke indeks A & C bila header tak dikenali).
  let pegawaiIdx = header.findIndex((h) => /pegawai/i.test(String(h ?? '')));
  if (pegawaiIdx < 0) pegawaiIdx = 0;
  let statusIdx = header.findIndex((h) => /status/i.test(String(h ?? '')));
  if (statusIdx < 0) statusIdx = 2;

  // Kolom RK: yang headernya memuat "rencana kinerja".
  const rkColIdxs: number[] = [];
  header.forEach((h, i) => {
    if (/rencana\s*kinerja/i.test(String(h ?? ''))) rkColIdxs.push(i);
  });
  if (rkColIdxs.length === 0) {
    // Fallback: semua kolom setelah Status.
    for (let i = statusIdx + 1; i < header.length; i++) rkColIdxs.push(i);
  }

  if (rkColIdxs.length === 0) {
    warnings.push(`[${fileName}] Tidak menemukan kolom Rencana Kinerja.`);
    return { team, warnings };
  }

  const dataRows = rows.slice(1) as unknown[][];

  // Baris ketua = baris pertama dengan Status "Ketua".
  const ketuaRow = dataRows.find((r) => isKetuaStatus(r?.[statusIdx]));
  if (!ketuaRow) {
    warnings.push(`[${fileName}] Tidak ditemukan baris Ketua (Status = "Ketua").`);
    return { team, warnings };
  }

  team.ketua = {
    nip: extractNip(ketuaRow[pegawaiIdx]),
    nama: extractNama(ketuaRow[pegawaiIdx]),
  };

  // Parent per kolom RK (RK Ketua Tim).
  const parentsByCol = new Map<number, DatasetParentRk>();
  for (const c of rkColIdxs) {
    const rk = cleanRkText(ketuaRow[c]);
    if (!rk) {
      warnings.push(
        `[${fileName}] Kolom RK ${c + 1} tidak punya RK Ketua Tim — dilewati.`
      );
      continue;
    }
    parentsByCol.set(c, { rk, columnIndex: c, subRks: [] });
  }

  // Baris anggota -> pecah poin -> tempel ke parent kolom yang sama.
  for (const row of dataRows) {
    if (!row) continue;
    if (row === ketuaRow) continue;
    if (isKetuaStatus(row[statusIdx])) continue;

    const nama = extractNama(row[pegawaiIdx]);
    if (!nama) continue;
    const nip = extractNip(row[pegawaiIdx]);

    for (const c of rkColIdxs) {
      const parent = parentsByCol.get(c);
      if (!parent) continue;
      const points = splitCellPoints(row[c]);
      for (const text of points) {
        parent.subRks.push({ text, nip, nama });
      }
    }
  }

  team.parents = rkColIdxs
    .map((c) => parentsByCol.get(c))
    .filter((p): p is DatasetParentRk => !!p);

  return { team, warnings };
}

/** Parse satu file .xlsx menjadi struktur tim. */
export function parseDatasetRkWorkbook(
  fileName: string,
  data: ArrayBuffer | Uint8Array
): { team: DatasetTeam; warnings: string[] } {
  const wb = XLSX.read(data instanceof Uint8Array ? data : new Uint8Array(data), {
    type: 'array',
  });
  const sheetName = wb.SheetNames.includes('Matriks') ? 'Matriks' : wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: '',
    blankrows: false,
  });
  return parseDatasetRkSheet(rows, fileName);
}

/** Susun ParsedDataset dari beberapa file tim. */
export function buildParsedDataset(
  parts: Array<{ team: DatasetTeam; warnings: string[] }>
): ParsedDataset {
  const teams = parts.map((p) => p.team);
  const warnings = parts.flatMap((p) => p.warnings);
  const parents = teams.reduce((n, t) => n + t.parents.length, 0);
  const subRks = teams.reduce(
    (n, t) => n + t.parents.reduce((m, p) => m + p.subRks.length, 0),
    0
  );
  return { teams, warnings, totals: { teams: teams.length, parents, subRks } };
}
