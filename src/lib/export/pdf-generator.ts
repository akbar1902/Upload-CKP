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

  // ── 1. HEADER DOKUMEN ──────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('EVALUASI KINERJA PEGAWAI', 105, 14, { align: 'center' });
  doc.setFontSize(10);
  doc.text('PENDEKATAN HASIL KERJA KUALITATIF', 105, 19, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text(`Periode: Bulan ${bulanName} ${tahun}`, 105, 24, { align: 'center' });

  // Divider tebal header
  doc.setDrawColor(30, 41, 59); // slate-800
  doc.setLineWidth(0.4);
  doc.line(14, 26.5, 196, 26.5);

  const periodeText = getFormattedPenilaianPeriod(bulan, tahun);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Badan Pusat Statistik', 14, 30.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Periode Penilaian: ${periodeText}`, 196, 30.5, { align: 'right' });

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
    startY: 32.5,
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
      fontSize: 7.5,
      cellPadding: 1.6,
      lineColor: [148, 163, 184], // border-slate-400
      lineWidth: 0.2,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [15, 118, 110], // #0F766E (Hijau Tema SIKAP)
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      lineWidth: 0.2,
      lineColor: [15, 118, 110],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 51 },
      3: { cellWidth: 8, halign: 'center' },
      4: { cellWidth: 34, fontStyle: 'bold' },
      5: { cellWidth: 49 },
    },
    margin: { left: 14, right: 14 },
  });

  // ── 3. TABEL DETAIL HASIL KERJA & UMPAN BALIK (4 KOLOM) ───────────
  const groupedData = groupEntriesByRK(entries);

  // Siapkan teks representasi untuk perhitungan tinggi baris yang akurat oleh autoTable
  const entriesTableData = groupedData.length > 0
    ? groupedData.map((group, index) => {
        const kegiatanRaw = group.items
          .map((item, i) => {
            const prefix = group.items.length > 1 ? `${i + 1}. ` : '';
            const progresText = item.progres !== null && item.progres !== undefined ? ` (${item.progres}%)` : '';
            const buktiText = item.data_dukung ? `\nBukti dukung:\n${item.data_dukung}` : '\nBukti dukung: -';
            return `${prefix}${item.kegiatan || '-'}${progresText}${buktiText}\n`;
          })
          .join('\n');

        const scoreText = group.score !== null ? `\nNilai: ${group.score}` : '';
        const feedbackRaw = `${group.umpanBalik.label}${scoreText}\n\n`;

        return [
          String(index + 1),
          group.rencana_kinerja || '-',
          kegiatanRaw,
          feedbackRaw,
        ];
      })
    : [['-', 'Tidak ada kegiatan tercatat pada periode ini', '-', '-']];

  const afterProfileY = (doc as any).lastAutoTable.finalY + 4.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 118, 110); // #0F766E (Hijau Tema SIKAP, persis seperti web)
  doc.text('Hasil Kerja dan Umpan Balik Berkelanjutan:', 14, afterProfileY);

  (autoTable as any)(doc, {
    startY: afterProfileY + 2,
    head: [
      [
        { content: 'No', styles: { halign: 'center', cellWidth: 9 } },
        { content: 'Rencana Kinerja', styles: { halign: 'center', cellWidth: 46 } },
        { content: 'Kegiatan', styles: { halign: 'center', cellWidth: 84 } },
        { content: 'Umpan Balik Berkelanjutan\nBerdasarkan Bukti Dukung', styles: { halign: 'center', cellWidth: 43 } },
      ],
    ],
    body: entriesTableData,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2.8,
      lineColor: [148, 163, 184], // border-slate-400
      lineWidth: 0.2,
      textColor: [30, 41, 59],
      overflow: 'linebreak',
      minCellHeight: 16,
    },
    headStyles: {
      fillColor: [15, 118, 110], // #0F766E
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      lineWidth: 0.2,
      lineColor: [15, 118, 110],
    },
    columnStyles: {
      0: { cellWidth: 9, halign: 'center' },
      1: { cellWidth: 46, fontStyle: 'bold' },
      2: { cellWidth: 84 },
      3: { cellWidth: 43, halign: 'center' },
    },
    margin: { left: 14, right: 14 },
    rowPageBreak: 'avoid',
    willDrawCell: (data: any) => {
      // Hilangkan default rendering teks autoTable pada Kolom 2 & 3 agar kita gambar custom badge & link
      if (data.section === 'body' && (data.column.index === 2 || data.column.index === 3)) {
        if (groupedData.length > 0) {
          data.cell.text = [];
        }
      }
    },
    didDrawCell: (data: any) => {
      if (data.section !== 'body' || groupedData.length === 0) return;
      const group = groupedData[data.row.index];
      if (!group) return;

      // ── RENDER KOLOM 2: KEGIATAN DENGAN SPASI SEIMBANG & SEJAJAR ─────
      if (data.column.index === 2) {
        const { x, y, width } = data.cell;
        const padX = data.cell.padding('left') || 2.8;
        const padTop = data.cell.padding('top') || 2.8;
        const textW = width - (padX * 2);

        // Baseline offset presisi menyamakan baris pertama Kolom 1 (Rencana Kinerja)
        const baseLineOffset = (7.5 * 25.4 / 72) * 0.85;
        const lineHeight = (7.5 * 25.4 / 72) * 1.15; // 3.0427mm

        let curY = y + padTop + baseLineOffset;

        group.items.forEach((item, itemIdx) => {
          if (itemIdx > 0) {
            // Garis pemisah halus antar kegiatan dengan margin atas & bawah seimbang
            const divY = curY - (lineHeight * 0.6);
            doc.setDrawColor(226, 232, 240); // slate-200
            doc.setLineWidth(0.15);
            doc.line(x + padX, divY, x + width - padX, divY);
            curY += (lineHeight * 0.3);
          }

          // 1. Judul kegiatan (Normal, tidak di-bold) + Progres (%)
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(30, 41, 59); // slate-800
          const prefix = group.items.length > 1 ? `${itemIdx + 1}. ` : '';
          const progresText = item.progres !== null && item.progres !== undefined ? ` (${item.progres}%)` : '';
          const title = `${prefix}${item.kegiatan || '-'}${progresText}`;
          const titleLines = doc.splitTextToSize(title, textW);
          titleLines.forEach((line: string) => {
            doc.text(line, x + padX, curY);
            curY += lineHeight;
          });

          // 2. Label 'Bukti dukung:' (Abu-abu Slate)
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.0);
          doc.setTextColor(100, 116, 139); // slate-500
          doc.text('Bukti dukung:', x + padX, curY);
          curY += lineHeight;

          // 3. Link Bukti Dukung (Warna Biru, Digarisbawahi, dan Bisa Diklik)
          const url = item.data_dukung || '-';
          const isLink = url.startsWith('http://') || url.startsWith('https://');
          if (isLink) {
            doc.setTextColor(29, 78, 216); // #1D4ED8 (blue-700)
            doc.setFontSize(7.0);
            const urlLines = doc.splitTextToSize(url, textW);
            urlLines.forEach((line: string) => {
              doc.text(line, x + padX, curY);
              const lineW = doc.getTextWidth(line);
              doc.setDrawColor(29, 78, 216);
              doc.setLineWidth(0.15);
              doc.line(x + padX, curY + 0.3, x + padX + lineW, curY + 0.3);
              doc.link(x + padX, curY - 2.5, lineW, 3.2, { url });
              curY += lineHeight;
            });
          } else {
            doc.setTextColor(71, 85, 105);
            doc.setFontSize(7.0);
            doc.text(url, x + padX, curY);
            curY += lineHeight;
          }

          curY += (lineHeight * 0.3);
        });
      }

      // ── RENDER KOLOM 3: BADGE PILL UMPAN BALIK PERSIS SEPERTI WEB ──
      if (data.column.index === 3) {
        const { x, y, width } = data.cell;
        const padTop = data.cell.padding('top') || 2.8;
        const pillW = 34;
        const pillH = 5.8;
        const pillX = x + (width - pillW) / 2;
        const pillY = y + padTop;

        // Warna badge solid persis seperti tampilan website
        let fillColor: [number, number, number] = [100, 116, 139]; // slate-500
        if (group.umpanBalik.color === 'green') {
          fillColor = [22, 163, 74]; // #16A34A (Diatas Ekspektasi - Hijau)
        } else if (group.umpanBalik.color === 'blue') {
          fillColor = [2, 132, 199]; // #0284C7 (Sesuai Ekspektasi - Biru)
        } else if (group.umpanBalik.color === 'red') {
          fillColor = [220, 38, 38]; // #DC2626 (Dibawah Ekspektasi - Merah)
        }

        // Gambar badge kapsul rounded-pill
        doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        doc.roundedRect(pillX, pillY, pillW, pillH, 2.5, 2.5, 'F');

        // Teks label putih tebal di dalam pill
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.text(group.umpanBalik.label, x + width / 2, pillY + 4.0, { align: 'center' });

        // Teks nilai di bawah badge
        if (group.score !== null && group.score !== undefined) {
          doc.setTextColor(100, 116, 139); // slate-500
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.0);
          doc.text(`Nilai: ${group.score}`, x + width / 2, pillY + pillH + 4.0, { align: 'center' });
        }
      }
    },
  });

  // ── 4. TANDA TANGAN IBU PIMPINAN ───────────────────────────────────
  let currentY = (doc as any).lastAutoTable.finalY + 8;
  const pageHeight = doc.internal.pageSize.getHeight();

  // Bila ruang tidak mencukupi untuk blok tanda tangan, pindah ke halaman baru
  if (currentY + 45 > pageHeight - 15) {
    doc.addPage();
    currentY = 20;
  }

  const signX = 130;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(`Belitung, ${tanggalCetak}`, signX, currentY);
  currentY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Pejabat Penilai Kinerja,', signX, currentY);
  currentY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(pimpinan.jabatan || 'Kepala BPS Kabupaten Belitung', signX, currentY);

  // Ruang tanda tangan
  currentY += 20;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(pimpinan.nama || 'Baiq Kurniawati, SST, M.Ak', signX, currentY);
  // Garis bawah nama pejabat
  const nameW = doc.getTextWidth(pimpinan.nama || 'Baiq Kurniawati, SST, M.Ak');
  doc.setLineWidth(0.2);
  doc.setDrawColor(15, 23, 42);
  doc.line(signX, currentY + 0.5, signX + nameW, currentY + 0.5);

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
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

