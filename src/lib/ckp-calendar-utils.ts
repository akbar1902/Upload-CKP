import type { CKPEntry } from '@/types/database';

/** Map nama bulan Indonesia → nomor bulan */
export const INDONESIAN_MONTHS: Record<string, string> = {
  januari: '01', februari: '02', maret: '03', april: '04',
  mei: '05', juni: '06', juli: '07', agustus: '08',
  september: '09', oktober: '10', november: '11', desember: '12',
  jan: '01', feb: '02', mar: '03', apr: '04',
  jun: '06', jul: '07', agt: '08', agu: '08',
  sep: '09', okt: '10', nov: '11', des: '12',
};

export const INDONESIAN_MONTH_NAMES = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const INDONESIAN_DAY_NAMES = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

/**
 * Daftar Hari Libur Nasional & Cuti Bersama Indonesia (2024 - 2027)
 */
export const INDONESIAN_HOLIDAYS: Record<string, string> = {
  // 2024
  '2024-01-01': 'Tahun Baru 2024 Masehi',
  '2024-02-08': 'Isra Mikraj Nabi Muhammad SAW',
  '2024-02-09': 'Cuti Bersama Tahun Baru Imlek',
  '2024-02-10': 'Tahun Baru Imlek 2575 Kongzili',
  '2024-03-11': 'Hari Suci Nyepi',
  '2024-03-29': 'Wafat Yesus Kristus',
  '2024-03-31': 'Hari Paskah',
  '2024-04-10': 'Hari Raya Idul Fitri 1445 H',
  '2024-04-11': 'Hari Raya Idul Fitri 1445 H',
  '2024-05-01': 'Hari Buruh Internasional',
  '2024-05-09': 'Kenaikan Yesus Kristus',
  '2024-05-23': 'Hari Raya Waisak 2568 BE',
  '2024-06-01': 'Hari Lahir Pancasila',
  '2024-06-17': 'Hari Raya Idul Adha 1445 H',
  '2024-07-07': 'Tahun Baru Islam 1446 H',
  '2024-08-17': 'Hari Kemerdekaan RI',
  '2024-09-16': 'Maulid Nabi Muhammad SAW',
  '2024-12-25': 'Hari Raya Natal',
  '2024-12-26': 'Cuti Bersama Hari Raya Natal',

  // 2025
  '2025-01-01': 'Tahun Baru 2025 Masehi',
  '2025-01-27': 'Isra Mikraj Nabi Muhammad SAW',
  '2025-01-28': 'Cuti Bersama Tahun Baru Imlek',
  '2025-01-29': 'Tahun Baru Imlek 2576 Kongzili',
  '2025-03-28': 'Cuti Bersama Hari Suci Nyepi',
  '2025-03-29': 'Hari Suci Nyepi',
  '2025-03-31': 'Hari Raya Idul Fitri 1446 H',
  '2025-04-01': 'Hari Raya Idul Fitri 1446 H',
  '2025-04-02': 'Cuti Bersama Idul Fitri 1446 H',
  '2025-04-03': 'Cuti Bersama Idul Fitri 1446 H',
  '2025-04-04': 'Cuti Bersama Idul Fitri 1446 H',
  '2025-04-07': 'Cuti Bersama Idul Fitri 1446 H',
  '2025-04-18': 'Wafat Yesus Kristus',
  '2025-04-20': 'Hari Paskah',
  '2025-05-01': 'Hari Buruh Internasional',
  '2025-05-12': 'Hari Raya Waisak 2569 BE',
  '2025-05-13': 'Cuti Bersama Hari Raya Waisak',
  '2025-05-29': 'Kenaikan Yesus Kristus',
  '2025-05-30': 'Cuti Bersama Kenaikan Yesus Kristus',
  '2025-06-01': 'Hari Lahir Pancasila',
  '2025-06-06': 'Hari Raya Idul Adha 1446 H',
  '2025-06-09': 'Cuti Bersama Idul Adha 1446 H',
  '2025-06-27': 'Tahun Baru Islam 1447 H',
  '2025-08-17': 'Hari Kemerdekaan RI',
  '2025-09-05': 'Maulid Nabi Muhammad SAW',
  '2025-12-25': 'Hari Raya Natal',
  '2025-12-26': 'Cuti Bersama Hari Raya Natal',

  // 2026
  '2026-01-01': 'Tahun Baru 2026 Masehi',
  '2026-01-16': 'Isra Mikraj Nabi Muhammad SAW',
  '2026-02-17': 'Tahun Baru Imlek 2577 Kongzili',
  '2026-03-19': 'Hari Suci Nyepi',
  '2026-03-20': 'Hari Raya Idul Fitri 1447 H',
  '2026-03-21': 'Hari Raya Idul Fitri 1447 H',
  '2026-04-03': 'Wafat Yesus Kristus',
  '2026-04-05': 'Hari Paskah',
  '2026-05-01': 'Hari Buruh Internasional',
  '2026-05-14': 'Kenaikan Yesus Kristus',
  '2026-05-27': 'Hari Raya Idul Adha 1447 H',
  '2026-05-31': 'Hari Raya Waisak 2570 BE',
  '2026-06-01': 'Hari Lahir Pancasila',
  '2026-06-16': 'Tahun Baru Islam 1448 H',
  '2026-08-17': 'Hari Kemerdekaan RI',
  '2026-08-25': 'Maulid Nabi Muhammad SAW',
  '2026-12-25': 'Hari Raya Natal',

  // 2027
  '2027-01-01': 'Tahun Baru 2027 Masehi',
  '2027-02-05': 'Isra Mikraj Nabi Muhammad SAW',
  '2027-02-06': 'Tahun Baru Imlek 2578 Kongzili',
  '2027-03-09': 'Hari Raya Idul Fitri 1448 H',
  '2027-03-10': 'Hari Raya Idul Fitri 1448 H',
  '2027-03-26': 'Wafat Yesus Kristus',
  '2027-05-01': 'Hari Buruh Internasional',
  '2027-05-06': 'Kenaikan Yesus Kristus',
  '2027-05-20': 'Hari Raya Waisak 2571 BE',
  '2027-06-01': 'Hari Lahir Pancasila',
  '2027-08-17': 'Hari Kemerdekaan RI',
  '2027-12-25': 'Hari Raya Natal',
};

export interface PeriodInfo {
  startDateStr: string; // 'YYYY-MM-DD'
  endDateStr: string;   // 'YYYY-MM-DD'
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  monthsInPeriod: { year: number; month: number; label: string }[];
  periodLabel: string;
}

export interface CalendarDay {
  dateStr: string; // 'YYYY-MM-DD'
  dayOfMonth: number;
  month: number;
  year: number;
  dayOfWeek: number; // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  dayName: string;   // 'Senin', 'Selasa', ...
  isCurrentMonth: boolean;
  isInPeriod: boolean;
  isWorkDay: boolean; // Senin s/d Jumat
  isWeekend: boolean; // Sabtu & Minggu
  hasActivities: boolean;
  isMissingWorkDay: boolean; // isInPeriod && isWorkDay && !hasActivities
  activities: Partial<CKPEntry>[];
  holidayName?: string;
}

export interface MonthCalendarData {
  year: number;
  month: number;
  monthName: string;
  periodSubtitle: string;
  calendarWeeks: CalendarDay[][];
  totalDaysInPeriod: number;
  workDaysInPeriod: number;
  filledWorkDaysInPeriod: number;
  emptyWorkDaysInPeriod: number;
}

export interface CalendarCoverageResult {
  period: PeriodInfo;
  months: MonthCalendarData[];
  totalDays: number;
  totalWorkDays: number;
  filledWorkDays: number;
  emptyWorkDays: CalendarDay[];
  workDaysRatio: number; // 0 - 100
  allPeriodDays: CalendarDay[];
}

/**
 * Menghitung rentang tanggal periode CKP sesuai aturan BPS:
 * - Bulan 1 Triwulan (Jan, Apr, Jul, Okt): 1 s.d. 25 bulan tersebut
 * - Bulan 2 Triwulan (Feb, Mei, Agu, Nov): 26 bulan sebelumnya s.d. 25 bulan tersebut
 * - Bulan 3 Triwulan (Mar, Jun, Sep, Des): 26 bulan sebelumnya s.d. akhir bulan tersebut
 */
export function getPeriodDateInfo(bulan: number, tahun: number): PeriodInfo {
  let startYear = tahun;
  let startMonth = bulan;
  let startDay = 1;

  let endYear = tahun;
  let endMonth = bulan;
  let endDay = 25;

  if ([1, 4, 7, 10].includes(bulan)) {
    // Bulan Pertama Triwulan: Tgl 1 s.d 25
    startYear = tahun;
    startMonth = bulan;
    startDay = 1;
    endYear = tahun;
    endMonth = bulan;
    endDay = 25;
  } else if ([2, 5, 8, 11].includes(bulan)) {
    // Bulan Kedua Triwulan: Tgl 26 bulan lalu s.d 25 bulan ini
    if (bulan === 1) {
      startYear = tahun - 1;
      startMonth = 12;
    } else {
      startYear = tahun;
      startMonth = bulan - 1;
    }
    startDay = 26;
    endYear = tahun;
    endMonth = bulan;
    endDay = 25;
  } else {
    // Bulan Ketiga Triwulan: Tgl 26 bulan lalu s.d akhir bulan ini
    if (bulan === 1) {
      startYear = tahun - 1;
      startMonth = 12;
    } else {
      startYear = tahun;
      startMonth = bulan - 1;
    }
    startDay = 26;
    endYear = tahun;
    endMonth = bulan;
    endDay = new Date(tahun, bulan, 0).getDate();
  }

  const startDateStr = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
  const endDateStr = `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

  const monthsInPeriod: { year: number; month: number; label: string }[] = [];
  if (startYear === endYear && startMonth === endMonth) {
    monthsInPeriod.push({
      year: startYear,
      month: startMonth,
      label: `${INDONESIAN_MONTH_NAMES[startMonth]} ${startYear}`
    });
  } else {
    monthsInPeriod.push({
      year: startYear,
      month: startMonth,
      label: `${INDONESIAN_MONTH_NAMES[startMonth]} ${startYear}`
    });
    monthsInPeriod.push({
      year: endYear,
      month: endMonth,
      label: `${INDONESIAN_MONTH_NAMES[endMonth]} ${endYear}`
    });
  }

  const periodLabel = startYear === endYear && startMonth === endMonth
    ? `${startDay} - ${endDay} ${INDONESIAN_MONTH_NAMES[startMonth]} ${startYear}`
    : `${startDay} ${INDONESIAN_MONTH_NAMES[startMonth]} ${startYear !== endYear ? startYear : ''} - ${endDay} ${INDONESIAN_MONTH_NAMES[endMonth]} ${endYear}`.replace(/\s+/g, ' ');

  return {
    startDateStr,
    endDateStr,
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
    monthsInPeriod,
    periodLabel,
  };
}

/**
 * Parse single date string into 'YYYY-MM-DD'
 */
export function parseSingleIndonesianDate(
  dateStr: unknown,
  fallbackMonth?: number | string,
  fallbackYear?: number | string
): string | null {
  if (!dateStr) return null;
  if (dateStr instanceof Date) {
    if (isNaN(dateStr.getTime())) return null;
    const y = dateStr.getFullYear();
    const m = String(dateStr.getMonth() + 1).padStart(2, '0');
    const d = String(dateStr.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (typeof dateStr === 'number') {
    const d = new Date(Math.round((dateStr - 25569) * 86400 * 1000));
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    return null;
  }

  const s = String(dateStr).trim();
  const cleaned = s.replace(/^(senin|selasa|rabu|kamis|jumat|sabtu|minggu)[,\s]+/i, '').trim();

  // 1. YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  // 2. DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const numMatch = cleaned.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (numMatch) {
    const day = numMatch[1].padStart(2, '0');
    const month = numMatch[2].padStart(2, '0');
    let year = numMatch[3];
    if (year.length === 2) year = `20${year}`;
    return `${year}-${month}-${day}`;
  }

  // 3. DD Month YYYY (e.g. 1 September 2026 or 01 Sep 2026)
  const fullTextMatch = cleaned.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);
  if (fullTextMatch) {
    const day = fullTextMatch[1].padStart(2, '0');
    const mKey = fullTextMatch[2].toLowerCase();
    const year = fullTextMatch[3];
    const month = INDONESIAN_MONTHS[mKey];
    if (month) return `${year}-${month}-${day}`;
  }

  // 4. DD Month without year (e.g. 26 Agustus) -> use fallbackYear
  const noYearMatch = cleaned.match(/^(\d{1,2})\s+([a-zA-Z]+)$/);
  if (noYearMatch && fallbackYear) {
    const day = noYearMatch[1].padStart(2, '0');
    const mKey = noYearMatch[2].toLowerCase();
    const month = INDONESIAN_MONTHS[mKey];
    if (month) return `${fallbackYear}-${month}-${day}`;
  }

  // 5. Just DD (e.g. 1) -> use fallbackMonth and fallbackYear
  const justDayMatch = cleaned.match(/^(\d{1,2})$/);
  if (justDayMatch && fallbackMonth && fallbackYear) {
    const day = justDayMatch[1].padStart(2, '0');
    const m = String(fallbackMonth).padStart(2, '0');
    return `${fallbackYear}-${m}-${day}`;
  }

  return null;
}

/**
 * Parse an Indonesian date string or date range string.
 * Supports:
 * - "1 - 3 September 2026"
 * - "26 Agustus - 5 September 2026"
 * - "01/09/2026 s/d 03/09/2026"
 * - "1 s.d. 3 September 2026"
 * - "1 September 2026"
 */
export function parseIndonesianDateOrRange(input: unknown): { start: string | null; end: string | null } {
  if (!input) return { start: null, end: null };

  if (input instanceof Date || typeof input === 'number') {
    const single = parseSingleIndonesianDate(input);
    return { start: single, end: null };
  }

  const s = String(input).trim();

  // Check if contains range delimiter: " - ", " s/d ", " s.d. ", " s.d ", " sd ", " sampai "
  const rangeRegex = /\s*(?:-|–|—|s\/d|s\.d\.|s\.d|sd|sampai)\s*/i;
  if (rangeRegex.test(s)) {
    const parts = s.split(rangeRegex).map(p => p.trim()).filter(Boolean);
    if (parts.length === 2) {
      const rawStart = parts[0];
      const rawEnd = parts[1];

      // Extract year & month from end part if present
      let endYear: string | null = null;
      let endMonth: string | null = null;
      const endYearMatch = rawEnd.match(/\b(20\d{2})\b/);
      if (endYearMatch) endYear = endYearMatch[1];
      for (const [mName, mNum] of Object.entries(INDONESIAN_MONTHS)) {
        const r = new RegExp(`\\b${mName}\\b`, 'i');
        if (r.test(rawEnd)) {
          endMonth = mNum;
          break;
        }
      }

      const parsedEnd = parseSingleIndonesianDate(rawEnd, endMonth || undefined, endYear || undefined);
      const parsedStart = parseSingleIndonesianDate(rawStart, endMonth || undefined, endYear || undefined);

      if (parsedStart && parsedEnd) {
        return { start: parsedStart, end: parsedEnd };
      }
      if (parsedStart) return { start: parsedStart, end: null };
      if (parsedEnd) return { start: null, end: parsedEnd };
    }
  }

  const single = parseSingleIndonesianDate(s);
  return { start: single, end: null };
}

/**
 * Memeriksa apakah suatu tanggal ('YYYY-MM-DD') tercakup dalam rentang kegiatan (entry).
 * Mengakomodasi jika kegiatan menggunakan rentang tanggal (misal 1 Sep - 3 Sep, maka 2 Sep juga terhitung).
 */
export function isDateCoveredByEntry(targetDateStr: string, entry: Partial<CKPEntry>): boolean {
  const mStr = entry.tanggal_mulai ? String(entry.tanggal_mulai).trim() : null;
  const sStr = entry.tanggal_selesai ? String(entry.tanggal_selesai).trim() : null;

  if (mStr && sStr) {
    const start = mStr <= sStr ? mStr : sStr;
    const end = mStr <= sStr ? sStr : mStr;
    return targetDateStr >= start && targetDateStr <= end;
  }

  if (mStr) {
    return targetDateStr === mStr;
  }

  if (sStr) {
    return targetDateStr === sStr;
  }

  return false;
}

/**
 * Format tanggal 'YYYY-MM-DD' ke format lengkap Indonesia: "Senin, 1 September 2026"
 */
export function formatIndonesianFullDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dayName = INDONESIAN_DAY_NAMES[date.getDay()];
    const monthName = INDONESIAN_MONTH_NAMES[m];
    return `${dayName}, ${d} ${monthName} ${y}`;
  } catch {
    return dateStr;
  }
}

/**
 * Format rentang tanggal singkat untuk kegiatan: "01 Sep 2026" atau "01 - 03 Sep 2026"
 */
export function formatEntryDateRange(entry: Partial<CKPEntry>): string {
  const m = entry.tanggal_mulai;
  const s = entry.tanggal_selesai;

  const formatDateShort = (str: string) => {
    try {
      const [y, month, d] = str.split('-').map(Number);
      return `${d} ${INDONESIAN_MONTH_NAMES[month]?.slice(0, 3)} ${y}`;
    } catch {
      return str;
    }
  };

  if (m && s && m !== s) {
    return `${formatDateShort(m)} s.d. ${formatDateShort(s)}`;
  }
  if (m) return formatDateShort(m);
  if (s) return formatDateShort(s);
  return '—';
}

/**
 * Menghitung kalender kerja dan cakupan kegiatan untuk periode CKP.
 */
export function calculateCalendarCoverage(
  bulan: number,
  tahun: number,
  entries: Partial<CKPEntry>[]
): CalendarCoverageResult {
  const period = getPeriodDateInfo(bulan, tahun);
  const allPeriodDays: CalendarDay[] = [];
  const emptyWorkDays: CalendarDay[] = [];

  const monthsData: MonthCalendarData[] = period.monthsInPeriod.map(mInfo => {
    const year = mInfo.year;
    const month = mInfo.month;
    const monthName = INDONESIAN_MONTH_NAMES[month];

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 = Sunday, 1 = Monday
    // Col 0 = Monday, ..., Col 6 = Sunday
    const startCol = (firstDayOfMonth + 6) % 7;

    const calendarWeeks: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];

    // Padding before day 1 of month
    for (let c = 0; c < startCol; c++) {
      const prevDate = new Date(year, month - 1, 1 - (startCol - c));
      const prevDay = prevDate.getDate();
      const prevMonth = prevDate.getMonth() + 1;
      const prevYear = prevDate.getFullYear();
      const prevDateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`;
      const dayOfWeek = prevDate.getDay();

      currentWeek.push({
        dateStr: prevDateStr,
        dayOfMonth: prevDay,
        month: prevMonth,
        year: prevYear,
        dayOfWeek,
        dayName: INDONESIAN_DAY_NAMES[dayOfWeek],
        isCurrentMonth: false,
        isInPeriod: false,
        isWorkDay: dayOfWeek >= 1 && dayOfWeek <= 5,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        hasActivities: false,
        isMissingWorkDay: false,
        activities: [],
      });
    }

    let totalDaysInPeriod = 0;
    let workDaysInPeriod = 0;
    let filledWorkDaysInPeriod = 0;
    let emptyWorkDaysInPeriod = 0;

    // Fill days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateObj = new Date(year, month - 1, day);
      const dayOfWeek = dateObj.getDay();
      const isWorkDay = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isInPeriod = dateStr >= period.startDateStr && dateStr <= period.endDateStr;

      // Filter activities that cover this day (supports date ranges!)
      const coveringActivities = isInPeriod
        ? entries.filter(e => isDateCoveredByEntry(dateStr, e))
        : [];
      const hasActivities = coveringActivities.length > 0;
      const holidayName = INDONESIAN_HOLIDAYS[dateStr];
      const isMissingWorkDay = isInPeriod && isWorkDay && !hasActivities;

      const dayItem: CalendarDay = {
        dateStr,
        dayOfMonth: day,
        month,
        year,
        dayOfWeek,
        dayName: INDONESIAN_DAY_NAMES[dayOfWeek],
        isCurrentMonth: true,
        isInPeriod,
        isWorkDay,
        isWeekend,
        hasActivities,
        isMissingWorkDay,
        activities: coveringActivities,
        holidayName,
      };

      if (isInPeriod) {
        totalDaysInPeriod++;
        allPeriodDays.push(dayItem);
        if (isWorkDay) {
          workDaysInPeriod++;
          if (hasActivities) {
            filledWorkDaysInPeriod++;
          } else {
            emptyWorkDaysInPeriod++;
            emptyWorkDays.push(dayItem);
          }
        }
      }

      currentWeek.push(dayItem);

      if (currentWeek.length === 7) {
        calendarWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Padding after last day of month to complete the row
    if (currentWeek.length > 0) {
      let nextDayCounter = 1;
      while (currentWeek.length < 7) {
        const nextDate = new Date(year, month, nextDayCounter);
        const nextDay = nextDate.getDate();
        const nextMonth = nextDate.getMonth() + 1;
        const nextYear = nextDate.getFullYear();
        const nextDateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
        const dayOfWeek = nextDate.getDay();

        currentWeek.push({
          dateStr: nextDateStr,
          dayOfMonth: nextDay,
          month: nextMonth,
          year: nextYear,
          dayOfWeek,
          dayName: INDONESIAN_DAY_NAMES[dayOfWeek],
          isCurrentMonth: false,
          isInPeriod: false,
          isWorkDay: dayOfWeek >= 1 && dayOfWeek <= 5,
          isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
          hasActivities: false,
          isMissingWorkDay: false,
          activities: [],
        });
        nextDayCounter++;
      }
      calendarWeeks.push(currentWeek);
    }

    // Compute period subtitle for this month
    let periodSubtitle = '';
    if (year === period.startYear && month === period.startMonth && year === period.endYear && month === period.endMonth) {
      periodSubtitle = `Periode: ${period.startDay} - ${period.endDay} ${monthName}`;
    } else if (year === period.startYear && month === period.startMonth) {
      periodSubtitle = `Periode: ${period.startDay} - ${daysInMonth} ${monthName}`;
    } else if (year === period.endYear && month === period.endMonth) {
      periodSubtitle = `Periode: 1 - ${period.endDay} ${monthName}`;
    } else {
      periodSubtitle = `Periode: Seluruh Bulan`;
    }

    return {
      year,
      month,
      monthName,
      periodSubtitle,
      calendarWeeks,
      totalDaysInPeriod,
      workDaysInPeriod,
      filledWorkDaysInPeriod,
      emptyWorkDaysInPeriod,
    };
  });

  const totalDays = allPeriodDays.length;
  const totalWorkDays = allPeriodDays.filter(d => d.isWorkDay).length;
  const filledWorkDays = allPeriodDays.filter(d => d.isWorkDay && d.hasActivities).length;
  const workDaysRatio = totalWorkDays > 0 ? Math.round((filledWorkDays / totalWorkDays) * 100) : 100;

  return {
    period,
    months: monthsData,
    totalDays,
    totalWorkDays,
    filledWorkDays,
    emptyWorkDays,
    workDaysRatio,
    allPeriodDays,
  };
}
