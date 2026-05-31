// ============================================================
// Column Mapping: Excel column headers → database field names
// ============================================================

export interface ColumnMap {
  excelHeaders: string[];   // Possible header names (case-insensitive)
  dbField: string;
  required: boolean;
  type: 'text' | 'date' | 'time' | 'number';
}

export const COLUMN_MAPPINGS: ColumnMap[] = [
  {
    excelHeaders: ['no', 'no.', 'nomor', 'number'],
    dbField: 'row_number',
    required: false,
    type: 'number',
  },
  {
    excelHeaders: ['tanggal mulai', 'tgl mulai', 'tgl. mulai', 'start date', 'tanggal_mulai', 'mulai'],
    dbField: 'tanggal_mulai',
    required: false,
    type: 'date',
  },
  {
    excelHeaders: ['tanggal selesai', 'tgl selesai', 'tgl. selesai', 'end date', 'tanggal_selesai', 'selesai'],
    dbField: 'tanggal_selesai',
    required: false,
    type: 'date',
  },
  {
    excelHeaders: ['jam mulai', 'waktu mulai', 'start time', 'jam_mulai'],
    dbField: 'jam_mulai',
    required: false,
    type: 'time',
  },
  {
    excelHeaders: ['jam selesai', 'waktu selesai', 'end time', 'jam_selesai'],
    dbField: 'jam_selesai',
    required: false,
    type: 'time',
  },
  {
    excelHeaders: ['rencana kinerja', 'rencana', 'target kinerja', 'rencana_kinerja', 'sasaran kinerja'],
    dbField: 'rencana_kinerja',
    required: false,
    type: 'text',
  },
  {
    excelHeaders: ['kegiatan', 'uraian kegiatan', 'aktivitas', 'deskripsi kegiatan', 'uraian'],
    dbField: 'kegiatan',
    required: true,
    type: 'text',
  },
  {
    excelHeaders: ['progres', 'progres (%)', 'progress', 'progress (%)', 'persentase', '%', 'persen'],
    dbField: 'progres',
    required: false,
    type: 'number',
  },
  {
    excelHeaders: ['capaian', 'hasil', 'output', 'result', 'capaian kinerja'],
    dbField: 'capaian',
    required: false,
    type: 'text',
  },
  {
    excelHeaders: ['data dukung', 'bukti dukung', 'link bukti', 'bukti', 'evidence', 'data_dukung', 'link', 'link drive'],
    dbField: 'data_dukung',
    required: false,
    type: 'text',
  },
];

// Required columns for validation
export const REQUIRED_COLUMNS = COLUMN_MAPPINGS.filter(m => m.required).map(m => m.dbField);

// Minimum columns to identify as CKP template
export const MIN_IDENTIFIABLE_COLUMNS = ['kegiatan'];

/**
 * Find the matching database field for an Excel header.
 * Priority: exact match > starts-with > contains.
 */
export function findColumnMapping(header: string): ColumnMap | null {
  const normalizedHeader = header.trim().toLowerCase();

  // 1. Exact match
  let found = COLUMN_MAPPINGS.find(m =>
    m.excelHeaders.some(h => h === normalizedHeader)
  );
  if (found) return found;

  // 2. Starts-with match
  found = COLUMN_MAPPINGS.find(m =>
    m.excelHeaders.some(h => normalizedHeader.startsWith(h) || h.startsWith(normalizedHeader))
  );
  if (found) return found;

  // 3. Contains match (last resort)
  found = COLUMN_MAPPINGS.find(m =>
    m.excelHeaders.some(h => normalizedHeader.includes(h) || h.includes(normalizedHeader))
  );
  return found || null;
}

/**
 * Build a mapping from Excel column index to database field.
 * Each dbField can only be mapped once (first occurrence wins).
 */
export function buildHeaderMapping(headers: string[]): Record<number, ColumnMap> {
  const mapping: Record<number, ColumnMap> = {};
  const usedDbFields = new Set<string>();

  headers.forEach((header, index) => {
    if (!header || header.trim().length === 0) return;
    const match = findColumnMapping(header);
    if (match && !usedDbFields.has(match.dbField)) {
      mapping[index] = match;
      usedDbFields.add(match.dbField);
    }
  });

  return mapping;
}
