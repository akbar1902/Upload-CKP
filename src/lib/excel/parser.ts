import * as XLSX from 'xlsx';
import { buildHeaderMapping } from './column-mapping';
import type { CKPEntry } from '@/types/database';

export interface ParseResult {
  success: boolean;
  entries: Partial<CKPEntry>[];
  headers: string[];
  mappedFields: string[];
  unmappedHeaders: string[];
  errors: string[];
  warnings: string[];
  totalRows: number;
}

/**
 * Parse an Excel file and extract CKP entry data.
 * Works client-side in the browser.
 */
export async function parseExcelFile(file: File): Promise<ParseResult> {
  const result: ParseResult = {
    success: false,
    entries: [],
    headers: [],
    mappedFields: [],
    unmappedHeaders: [],
    errors: [],
    warnings: [],
    totalRows: 0,
  };

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

    // Use first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      result.errors.push('File Excel tidak memiliki sheet.');
      return result;
    }

    const sheet = workbook.Sheets[sheetName];
    const rawData: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    if (rawData.length < 2) {
      result.errors.push('File Excel tidak memiliki data yang cukup. Minimal harus ada 1 baris header dan 1 baris data.');
      return result;
    }

    // Find header row (first row with meaningful content)
    let headerRowIndex = 0;
    for (let i = 0; i < Math.min(rawData.length, 10); i++) {
      const row = rawData[i];
      if (row && row.some(cell => typeof cell === 'string' && cell.trim().length > 0)) {
        const cellTexts = row.filter(c => typeof c === 'string' && c.trim().length > 0);
        if (cellTexts.length >= 3) {
          headerRowIndex = i;
          break;
        }
      }
    }

    const headers = (rawData[headerRowIndex] as unknown[]).map(h =>
      String(h ?? '').trim()
    );
    result.headers = headers;

    // Build column mapping
    const headerMapping = buildHeaderMapping(headers);
    const mappedIndices = Object.keys(headerMapping).map(Number);

    result.mappedFields = mappedIndices.map(i => headerMapping[i].dbField);

    // Find unmapped headers
    result.unmappedHeaders = headers.filter((h, i) =>
      h.length > 0 && !mappedIndices.includes(i)
    );

    // Check if we have minimum required columns
    if (!result.mappedFields.includes('kegiatan')) {
      result.errors.push(
        'Kolom "Kegiatan" tidak ditemukan. Pastikan file menggunakan template CKP yang benar.'
      );
      return result;
    }

    // Parse data rows
    const dataRows = rawData.slice(headerRowIndex + 1);
    let rowNumber = 0;

    for (const row of dataRows) {
      const cells = row as unknown[];

      // Skip empty rows
      const hasContent = cells.some(c => {
        const val = String(c ?? '').trim();
        return val.length > 0 && val !== '0';
      });
      if (!hasContent) continue;

      rowNumber++;
      const entry: Partial<CKPEntry> = {
        row_number: rowNumber,
        extra_columns: {},
      };

      // Map each cell to database field
      for (let colIdx = 0; colIdx < cells.length; colIdx++) {
        const cellValue = cells[colIdx];
        const mapping = headerMapping[colIdx];

        if (mapping) {
          const value = processCellValue(cellValue, mapping.type);
          (entry as Record<string, unknown>)[mapping.dbField] = value;
        } else if (headers[colIdx] && String(headers[colIdx]).trim().length > 0) {
          // Store unmapped columns in extra_columns
          const extraKey = String(headers[colIdx]).trim();
          (entry.extra_columns as Record<string, unknown>)[extraKey] = String(cellValue ?? '').trim();
        }
      }

      // Validate required fields
      if (!entry.kegiatan || String(entry.kegiatan).trim().length === 0) {
        result.warnings.push(`Baris ${rowNumber}: Kolom "Kegiatan" kosong, baris tetap disimpan.`);
      }

      // Validate progress range
      if (entry.progres !== undefined && entry.progres !== null) {
        const progres = Number(entry.progres);
        if (isNaN(progres)) {
          entry.progres = 0;
          result.warnings.push(`Baris ${rowNumber}: Nilai progres tidak valid, diset ke 0.`);
        } else if (progres > 100) {
          entry.progres = 100;
          result.warnings.push(`Baris ${rowNumber}: Progres melebihi 100%, dikoreksi ke 100%.`);
        } else if (progres < 0) {
          entry.progres = 0;
          result.warnings.push(`Baris ${rowNumber}: Progres negatif, dikoreksi ke 0%.`);
        }
      }

      result.entries.push(entry);
    }

    result.totalRows = result.entries.length;

    if (result.entries.length === 0) {
      result.errors.push('Tidak ada data yang dapat dibaca dari file Excel.');
      return result;
    }

    const filteredUnmapped = result.unmappedHeaders.filter(h => !h.toLowerCase().includes('capaian skp') && !h.toLowerCase().includes('nilai capaian skp'));
    if (filteredUnmapped.length > 0) {
      result.warnings.push(
        `Kolom berikut tidak dikenali dan disimpan sebagai data tambahan: ${filteredUnmapped.join(', ')}`
      );
    }

    result.success = true;
  } catch (error) {
    result.errors.push(`Gagal membaca file Excel: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Process a cell value based on expected type
 */
function processCellValue(value: unknown, type: string): unknown {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }

  switch (type) {
    case 'date': {
      // Date object from xlsx (cellDates: true)
      if (value instanceof Date) {
        if (isNaN(value.getTime())) return null;
        return formatDateForDB(value);
      }
      // Numeric serial (Excel date serial number)
      if (typeof value === 'number') {
        const d = new Date(Math.round((value - 25569) * 86400 * 1000));
        if (!isNaN(d.getTime())) return formatDateForDB(d);
        return null;
      }
      const dateStr = String(value).trim();
      const parsed = parseIndonesianDate(dateStr);
      // Only return if parsed result is a valid ISO date
      if (parsed && isValidDateForDB(parsed)) return parsed;
      // If not parseable, return null (better than crashing the DB insert)
      return null;
    }
    case 'time': {
      if (value instanceof Date) {
        return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
      }
      const timeStr = String(value).trim();
      // Handle various time formats
      const timeMatch = timeStr.match(/(\d{1,2})[:.](\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
      }
      return timeStr;
    }
    case 'number': {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    }
    case 'text':
    default:
      return String(value).trim();
  }
}


function formatDateForDB(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Map nama bulan Indonesia → nomor bulan */
const INDONESIAN_MONTHS: Record<string, string> = {
  januari: '01', februari: '02', maret: '03', april: '04',
  mei: '05', juni: '06', juli: '07', agustus: '08',
  september: '09', oktober: '10', november: '11', desember: '12',
  // singkatan
  jan: '01', feb: '02', mar: '03', apr: '04',
  jun: '06', jul: '07', agt: '08', agu: '08',
  sep: '09', okt: '10', nov: '11', des: '12',
};

/**
 * Parse berbagai format tanggal ke format YYYY-MM-DD.
 * Mendukung: DD/MM/YYYY, DD-MM-YYYY, "4 Mei 2026",
 * "Senin, 4 Mei 2026", serial number Excel, dsb.
 */
function parseIndonesianDate(dateStr: string): string | null {
  const s = dateStr.trim();

  // Hilangkan nama hari di depan, misal "Senin, " atau "Kamis "
  const cleanedS = s.replace(/^(senin|selasa|rabu|kamis|jumat|sabtu|minggu)[,\s]+/i, '').trim();

  // 1. Format "4 Mei 2026" atau "04 Mei 2026"
  const idMonthMatch = cleanedS.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);
  if (idMonthMatch) {
    const day = idMonthMatch[1].padStart(2, '0');
    const monthKey = idMonthMatch[2].toLowerCase();
    const year = idMonthMatch[3];
    const month = INDONESIAN_MONTHS[monthKey];
    if (month) return `${year}-${month}-${day}`;
  }

  // 2. Format DD/MM/YYYY atau DD-MM-YYYY atau DD.MM.YYYY
  const numericMatch = cleanedS.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (numericMatch) {
    const day = numericMatch[1].padStart(2, '0');
    const month = numericMatch[2].padStart(2, '0');
    let year = numericMatch[3];
    if (year.length === 2) year = `20${year}`;
    return `${year}-${month}-${day}`;
  }

  // 3. Format YYYY-MM-DD (sudah benar)
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanedS)) {
    return cleanedS;
  }

  return null;
}

/**
 * Validasi apakah string adalah tanggal yang valid untuk PostgreSQL date.
 */
function isValidDateForDB(value: unknown): boolean {
  if (!value) return false;
  const d = new Date(String(value));
  return !isNaN(d.getTime()) && d.getFullYear() > 1900 && d.getFullYear() < 2100;
}
