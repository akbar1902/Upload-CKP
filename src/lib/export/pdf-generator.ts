import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getBulanName, getFormattedPenilaianPeriod } from '@/lib/utils';
import type { PimpinanInfo } from '@/app/actions/export';
import { groupEntriesByRK } from '@/lib/export/evaluasi-helper';

export interface ExportPdfParams {
  pegawai: {
    full_name: string;
    nip: string | null;
    unit_kerja: string | null;
    jabatan?: string | null;
    golongan?: string | null;
  };
  pimpinan: PimpinanInfo;
  bulan: number;
  tahun: number;
  tanggalCetak: string;
  entries: {
    rencana_kinerja: string | null;
    kegiatan: string | null;
    data_dukung: string | null;
    progres?: number | null;
    nilai?: number | null;
  }[];
}

export function generateEvaluationPdf({
  pegawai,
  pimpinan,
  bulan,
  tahun,
  tanggalCetak,
  entries,
}: ExportPdfParams): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const bulanName = getBulanName(bulan);
  const lastDay = new Date(tahun, bulan, 0).getDate();

  // ── 1. HEADER DOKUMEN ──────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('EVALUASI KINERJA PEGAWAI', 105, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text('PENDEKATAN HASIL KERJA KUALITATIF', 105, 20, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Periode: Bulan ${bulanName}`, 105, 25, { align: 'center' });

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(14, 27, 196, 27);

  const periodeText = getFormattedPenilaianPeriod(bulan, tahun);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Badan Pusat Statistik', 14, 31);
  doc.setFont('helvetica', 'normal');
  doc.text(`Periode Penilaian: ${periodeText}`, 196, 31, { align: 'right' });

  // ── 2. TABEL PROFIL PEGAWAI & PEJABAT PENILAI ──────────────────────
  const profileTableData = [
    [
      '1', 'Nama', pegawai.full_name || '-',
      '1', 'Nama', pimpinan.nama || 'Baiq Kurniawati SST, M.Ak',
    ],
    [
      '2', 'NIP', pegawai.nip || '-',
      '2', 'NIP', pimpinan.nip || '197805052000122001',
    ],
    [
      '3', 'Pangkat / Golongan', pegawai.golongan || '-',
      '3', 'Pangkat / Golongan', pimpinan.pangkatGolongan || 'Pembina Tk.I, IV/b',
    ],
    [
      '4', 'Jabatan', pegawai.jabatan || '-',
      '4', 'Jabatan', pimpinan.jabatan || 'Kepala BPS Kabupaten Belitung',
    ],
    [
      '5', 'Unit Kerja', pegawai.unit_kerja || 'BPS Kabupaten Belitung',
      '5', 'Unit Kerja', pimpinan.unitKerja || 'BPS Kabupaten Belitung',
    ],
  ];

  (autoTable as any)(doc, {
    startY: 33,
    head: [
      [
        { content: 'No', styles: { halign: 'center', cellWidth: 8 } },
        { content: 'Pegawai yang Dinilai', colSpan: 2, styles: { halign: 'left' } },
        { content: 'No', styles: { halign: 'center', cellWidth: 8 } },
        { content: 'Pejabat Penilai Kinerja', colSpan: 2, styles: { halign: 'left' } },
      ],
    ],
    body: profileTableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 1.5,
      lineColor: [180, 180, 180],
      lineWidth: 0.2,
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: [15, 118, 110], // #0F766E (Hijau Tema SIKAP)
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      lineWidth: 0.2,
      lineColor: [15, 118, 110],
    },
    columnStyles: {
      0: { cellWidth: 7, halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 52 },
      3: { cellWidth: 7, halign: 'center' },
      4: { cellWidth: 34, fontStyle: 'bold' },
      5: { cellWidth: 50 },
    },
    margin: { left: 14, right: 14 },
  });

  // ── 3. TABEL DETAIL HASIL KERJA & UMPAN BALIK (4 KOLOM) ───────────
  const groupedData = groupEntriesByRK(entries);

  const entriesTableData = groupedData.map((group, index) => {
    const kegiatanText = group.items
      .map((item, i) => {
        const prefix = group.items.length > 1 ? `${i + 1}. ` : '';
        const progresText = item.progres !== null && item.progres !== undefined ? ` (${item.progres}%)` : '';
        const buktiText = item.data_dukung ? `\n   Bukti dukung: ${item.data_dukung}` : '\n   Bukti dukung: -';
        return `${prefix}${item.kegiatan}${progresText}${buktiText}`;
      })
      .join('\n\n');

    const scoreText = group.score !== null ? `\n(Nilai: ${group.score})` : '';
    const feedbackText = `${group.umpanBalik.label}${scoreText}`;

    return [
      String(index + 1),
      group.rencana_kinerja || '-',
      kegiatanText || '-',
      feedbackText,
    ];
  });

  const afterProfileY = (doc as any).lastAutoTable.finalY + 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Hasil Kerja dan Umpan Balik Berkelanjutan:', 14, afterProfileY);

  (autoTable as any)(doc, {
    startY: afterProfileY + 2,
    head: [
      [
        { content: 'No', styles: { halign: 'center', cellWidth: 8 } },
        { content: 'Rencana Kinerja', styles: { halign: 'center', cellWidth: 48 } },
        { content: 'Kegiatan', styles: { halign: 'center', cellWidth: 84 } },
        { content: 'Umpan Balik Berkelanjutan Berdasarkan Bukti Dukung', styles: { halign: 'center', cellWidth: 42 } },
      ],
    ],
    body: entriesTableData.length > 0 ? entriesTableData : [['-', 'Tidak ada kegiatan tercatat pada periode ini', '-', '-']],
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      lineColor: [180, 180, 180],
      lineWidth: 0.2,
      textColor: [30, 30, 30],
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [15, 118, 110], // #0F766E (Hijau Tema SIKAP)
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      lineWidth: 0.2,
      lineColor: [15, 118, 110],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 48, fontStyle: 'bold' },
      2: { cellWidth: 84 },
      3: { cellWidth: 42, halign: 'center' },
    },
    margin: { left: 14, right: 14 },
    didParseCell: (data: any) => {
      // Style Umpan Balik column text
      if (data.section === 'body' && data.column.index === 3) {
        data.cell.styles.halign = 'center';
        data.cell.styles.fontStyle = 'bold';
        const raw = String(data.cell.raw || '');
        if (raw.includes('Diatas Ekspektasi')) {
          data.cell.styles.textColor = [22, 163, 74]; // #16A34A (Green)
        } else if (raw.includes('Sesuai Ekspektasi')) {
          data.cell.styles.textColor = [2, 132, 199]; // #0284C7 (Blue)
        } else if (raw.includes('Dibawah Ekspektasi')) {
          data.cell.styles.textColor = [220, 38, 38]; // #DC2626 (Red)
        } else {
          data.cell.styles.textColor = [100, 116, 139]; // #64748B (Gray)
        }
      }
    },
  });

  // ── 4. TANDA TANGAN IBU PIMPINAN ───────────────────────────────────
  let currentY = (doc as any).lastAutoTable.finalY + 8;
  const pageHeight = doc.internal.pageSize.getHeight();

  // If there's not enough room for the signature block on current page, add new page
  if (currentY + 45 > pageHeight - 15) {
    doc.addPage();
    currentY = 20;
  }

  const signX = 130; // Position on the right side
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Belitung, ${tanggalCetak}`, signX, currentY);
  currentY += 4.5;
  doc.text('Pejabat Penilai Kinerja,', signX, currentY);
  currentY += 4;
  doc.text(pimpinan.jabatan || 'Kepala BPS Kabupaten Belitung', signX, currentY);

  // Space for signature
  currentY += 22;

  doc.setFont('helvetica', 'bold');
  doc.text(pimpinan.nama || 'Baiq Kurniawati, SST, M.Ak', signX, currentY);
  currentY += 4;
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${pimpinan.nip || '197805052000122001'}`, signX, currentY);

  // ── 5. FOOTER SETIAP HALAMAN ───────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `* Dokumen Rekap Penilaian Kinerja Bulanan - Dicetak otomatis oleh Sistem Informasi Rekap CKP (SIKAP) pada ${tanggalCetak}`,
      14,
      pageHeight - 6
    );
    doc.text(`Hal. ${i} / ${pageCount}`, 196, pageHeight - 6, { align: 'right' });
  }

  return doc;
}
