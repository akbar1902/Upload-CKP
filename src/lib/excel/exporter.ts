import * as XLSX from 'xlsx';
import type { CKPEntry, CKPUpload, User } from '@/types/database';
import { getBulanName } from '@/lib/utils';

interface ExportData {
  upload: CKPUpload;
  entries: CKPEntry[];
  user: User;
}

/**
 * Export CKP data to Excel file and trigger download
 */
export function exportToExcel({ upload, entries, user }: ExportData): void {
  const wb = XLSX.utils.book_new();

  // Header info rows
  const headerRows = [
    ['CAPAIAN KINERJA PEGAWAI (CKP)'],
    ['BPS Kabupaten Belitung'],
    [],
    ['Nama Pegawai', user.full_name],
    ['NIP', user.nip || '-'],
    ['Unit Kerja', user.unit_kerja || '-'],
    ['Periode', `${getBulanName(upload.bulan)} ${upload.tahun}`],
    ['Status', upload.status.toUpperCase()],
    [],
  ];

  // Data headers
  const dataHeaders = [
    'No',
    'Tanggal Mulai',
    'Tanggal Selesai',
    'Jam Mulai',
    'Jam Selesai',
    'Rencana Kinerja',
    'Kegiatan',
    'Progres (%)',
    'Capaian',
    'Nilai Capaian SKP',
    'Data Dukung',
  ];

  // Data rows
  const dataRows = entries.map((entry) => [
    entry.row_number,
    entry.tanggal_mulai || '',
    entry.tanggal_selesai || '',
    entry.jam_mulai || '',
    entry.jam_selesai || '',
    entry.rencana_kinerja || '',
    entry.kegiatan || '',
    entry.progres,
    entry.capaian || '',
    entry.nilai !== null ? entry.nilai : '',
    entry.data_dukung || '',
  ]);

  // Summary row
  const avgProgres = entries.length > 0
    ? entries.reduce((sum, e) => sum + (e.progres || 0), 0) / entries.length
    : 0;

  const summaryRows = [
    [],
    ['', '', '', '', '', '', 'Rata-rata Progres:', `${avgProgres.toFixed(1)}%`],
    ['', '', '', '', '', '', 'Rata-rata Nilai SKP:', upload.rata_rata_nilai ? upload.rata_rata_nilai.toFixed(1) : '-'],
    ['', '', '', '', '', '', 'Total Kegiatan:', entries.length],
  ];

  const allRows = [...headerRows, dataHeaders, ...dataRows, ...summaryRows];

  const ws = XLSX.utils.aoa_to_sheet(allRows);

  // Set column widths
  ws['!cols'] = [
    { wch: 5 },   // No
    { wch: 14 },  // Tanggal Mulai
    { wch: 14 },  // Tanggal Selesai
    { wch: 10 },  // Jam Mulai
    { wch: 10 },  // Jam Selesai
    { wch: 25 },  // Rencana Kinerja
    { wch: 40 },  // Kegiatan
    { wch: 12 },  // Progres
    { wch: 30 },  // Capaian
    { wch: 18 },  // Nilai Capaian SKP
    { wch: 40 },  // Data Dukung
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'CKP');

  const fileName = `CKP_${user.full_name.replace(/\s+/g, '_')}_${getBulanName(upload.bulan)}_${upload.tahun}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Export multiple uploads summary to Excel (for pimpinan)
 */
export function exportRekapToExcel(uploads: (CKPUpload & { user?: User })[], bulan: number, tahun: number): void {
  const wb = XLSX.utils.book_new();

  const headerRows = [
    ['REKAP CAPAIAN KINERJA PEGAWAI (CKP)'],
    ['BPS Kabupaten Belitung'],
    [`Periode: ${getBulanName(bulan)} ${tahun}`],
    [],
  ];

  const dataHeaders = [
    'No',
    'Nama Pegawai',
    'NIP',
    'Unit Kerja',
    'Total Kegiatan',
    'Rata-rata Progres (%)',
    'Rata-rata Nilai SKP',
    'Status',
    'Tanggal Upload',
    'Versi',
  ];

  const dataRows = uploads.map((upload, index) => [
    index + 1,
    upload.user?.full_name || '-',
    upload.user?.nip || '-',
    upload.user?.unit_kerja || '-',
    upload.total_entries,
    upload.avg_progres?.toFixed(1) || '0',
    upload.rata_rata_nilai?.toFixed(1) || '-',
    upload.status,
    upload.uploaded_at ? new Date(upload.uploaded_at).toLocaleDateString('id-ID') : '-',
    upload.version,
  ]);

  const allRows = [...headerRows, dataHeaders, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(allRows);

  ws['!cols'] = [
    { wch: 5 },
    { wch: 30 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 18 },
    { wch: 8 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Rekap CKP');

  const fileName = `Rekap_CKP_${getBulanName(bulan)}_${tahun}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
