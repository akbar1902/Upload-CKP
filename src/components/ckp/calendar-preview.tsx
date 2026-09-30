"use client";

import React, { useState, useMemo } from 'react';
import type { CKPEntry } from '@/types/database';
import {
  calculateCalendarCoverage,
  formatIndonesianFullDate,
  formatEntryDateRange,
  type CalendarDay,
} from '@/lib/ckp-calendar-utils';
import {
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface CalendarPreviewProps {
  bulan: number;
  tahun: number;
  entries: Partial<CKPEntry>[];
}

const WEEK_HEADER = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export function CalendarPreview({ bulan, tahun, entries }: CalendarPreviewProps) {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const coverage = useMemo(() => {
    return calculateCalendarCoverage(bulan, tahun, entries);
  }, [bulan, tahun, entries]);

  const { period, months, totalWorkDays, filledWorkDays, emptyWorkDays } = coverage;

  // Default to the month with the most workdays (e.g. September), or 'all' if only 1 month
  const defaultMonthKey = useMemo(() => {
    if (!months || months.length === 0) return 'all';
    if (months.length === 1) return `${months[0].year}-${months[0].month}`;
    const sorted = [...months].sort((a, b) => b.workDaysInPeriod - a.workDaysInPeriod);
    return sorted[0] ? `${sorted[0].year}-${sorted[0].month}` : 'all';
  }, [months]);

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(defaultMonthKey);

  // Sync if coverage changes
  React.useEffect(() => {
    if (selectedMonthKey !== 'all' && !months.some(m => `${m.year}-${m.month}` === selectedMonthKey)) {
      setSelectedMonthKey(defaultMonthKey);
    }
  }, [months, defaultMonthKey, selectedMonthKey]);

  const displayedMonths = useMemo(() => {
    if (selectedMonthKey === 'all' || months.length <= 1) {
      return months;
    }
    const filtered = months.filter(m => `${m.year}-${m.month}` === selectedMonthKey);
    return filtered.length > 0 ? filtered : months;
  }, [months, selectedMonthKey]);

  return (
    <div className="space-y-5">
      {/* ─── Header Info & Month Tabs ──────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-2xs">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Kalender Hari Kerja
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
                ({period.periodLabel})
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span>{filledWorkDays} dari {totalWorkDays} hari kerja terisi</span>
              <span>•</span>
              {emptyWorkDays.length > 0 ? (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {emptyWorkDays.length} belum terisi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  100% Lengkap
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Month Selector Tabs (jika terdapat lintas bulan) ── */}
        {months.length > 1 && (
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-700/60 self-start md:self-auto">
            {months.map((m) => {
              const key = `${m.year}-${m.month}`;
              const isActive = selectedMonthKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedMonthKey(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs border border-slate-200/60 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{m.monthName} {m.year}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive 
                      ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800' 
                      : 'bg-slate-200/60 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {m.filledWorkDaysInPeriod}/{m.workDaysInPeriod}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setSelectedMonthKey('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedMonthKey === 'all'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Semua Bulan
            </button>
          </div>
        )}
      </div>

      {/* ─── Tampilan Kalender (Full-Width per Bulan, Lapang & Elegan) ─── */}
      <div className="space-y-6">
        {displayedMonths.map((m) => (
          <div
            key={`${m.year}-${m.month}`}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/70 shadow-xs"
          >
            {/* Header Bulan */}
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/90">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-800 dark:text-slate-100">
                  {m.monthName} {m.year}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                  {m.periodSubtitle.replace('Periode: ', '')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {m.filledWorkDaysInPeriod} dari {m.workDaysInPeriod} hari kerja terisi
                </span>
              </div>
            </div>

            {/* Header Hari (Sen - Min) */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800/80 text-center py-2.5 bg-slate-50/40 dark:bg-slate-900/50 font-semibold text-xs">
              {WEEK_HEADER.map((dayName, idx) => {
                const isWeekendCol = idx >= 5;
                return (
                  <span
                    key={dayName}
                    className={
                      isWeekendCol
                        ? 'text-slate-400 dark:text-slate-500'
                        : 'text-slate-700 dark:text-slate-200'
                    }
                  >
                    {dayName}
                  </span>
                );
              })}
            </div>

            {/* Kotak Tanggal Lapang & Modern */}
            <div className="p-3 grid grid-cols-7 gap-2">
              {m.calendarWeeks.flat().map((day, idx) => {
                // Di Luar Periode
                if (!day.isInPeriod) {
                  return (
                    <div
                      key={idx}
                      className="min-h-[92px] sm:min-h-[105px] rounded-xl p-2 flex flex-col justify-start opacity-30 select-none bg-slate-50/30 dark:bg-slate-900/20 border border-slate-100/40 dark:border-slate-800/30"
                    >
                      <span className="text-xs text-slate-400 dark:text-slate-600 font-medium">
                        {day.dayOfMonth}
                      </span>
                    </div>
                  );
                }

                // Akhir Pekan (Sabtu / Minggu)
                if (day.isWeekend) {
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`min-h-[92px] sm:min-h-[105px] rounded-xl p-2.5 text-left flex flex-col justify-between transition-all border cursor-pointer ${
                        day.hasActivities
                          ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-800/50 hover:border-blue-300 shadow-2xs'
                          : 'bg-slate-50/50 dark:bg-slate-900/40 border-dashed border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500">
                          {day.dayOfMonth}
                        </span>
                        {day.hasActivities ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {day.activities.length} keg
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300 dark:text-slate-600 font-medium">
                            Libur
                          </span>
                        )}
                      </div>

                      {day.hasActivities && (
                        <div className="space-y-1 mt-1.5">
                          {day.activities.slice(0, 2).map((act, i) => (
                            <div
                              key={i}
                              className="text-[11px] leading-tight text-blue-800 dark:text-blue-200 bg-white/80 dark:bg-blue-900/40 px-1.5 py-1 rounded border border-blue-200/60 dark:border-blue-800/40 truncate font-normal"
                              title={String(act.kegiatan || '')}
                            >
                              {String(act.kegiatan || '—')}
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                }

                // Hari Kerja (Senin - Jumat) - KOSONG (Belum Ada Kegiatan)
                if (day.isMissingWorkDay) {
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className="min-h-[92px] sm:min-h-[105px] rounded-xl p-2.5 text-left flex flex-col justify-between transition-all bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300/90 dark:border-amber-700/70 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer shadow-2xs group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                          {day.dayOfMonth}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/80 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Kosong
                        </span>
                      </div>

                      <div className="mt-1 space-y-1">
                        <span className="block text-[11px] text-amber-700/90 dark:text-amber-400 font-medium">
                          Belum ada entri
                        </span>
                        {day.holidayName && (
                          <span className="block text-[10px] font-semibold text-rose-700 dark:text-rose-400 truncate" title={day.holidayName}>
                            ★ {day.holidayName}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                }

                // Hari Kerja (Senin - Jumat) - TERISI (Ada Kegiatan)
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className="min-h-[92px] sm:min-h-[105px] rounded-xl p-2.5 text-left flex flex-col justify-between transition-all bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400">
                        {day.dayOfMonth}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                        {day.activities.length} keg
                      </span>
                    </div>

                    <div className="space-y-1 mt-1.5">
                      {day.activities.slice(0, 2).map((act, i) => (
                        <div
                          key={i}
                          className="text-[11px] leading-tight text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 group-hover:bg-teal-50/40 dark:group-hover:bg-slate-800 px-1.5 py-1 rounded border border-slate-200/60 dark:border-slate-700/60 truncate transition-colors font-normal"
                          title={String(act.kegiatan || '')}
                        >
                          {String(act.kegiatan || '—')}
                        </div>
                      ))}
                      {day.activities.length > 2 && (
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold pl-0.5 block">
                          +{day.activities.length - 2} kegiatan lainnya
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Legenda Sederhana & Kalem ────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 inline-block" />
            <span>Terisi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span className="text-amber-700 dark:text-amber-400 font-medium">Belum ada kegiatan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" />
            <span>Akhir pekan</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Klik pada tanggal untuk melihat rincian kegiatan
        </span>
      </div>

      {/* ─── Modal Rincian Kegiatan Tanggal ───────────────────────── */}
      <Dialog open={!!selectedDay} onClose={() => setSelectedDay(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          {selectedDay && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3 pr-6">
                  <div>
                    <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                      {formatIndonesianFullDate(selectedDay.dateStr)}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedDay.isWorkDay ? 'Hari Kerja' : 'Akhir Pekan'}
                      {selectedDay.holidayName ? ` · Libur: ${selectedDay.holidayName}` : ''}
                    </DialogDescription>
                  </div>

                  {selectedDay.isMissingWorkDay ? (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Belum Terisi
                    </span>
                  ) : selectedDay.hasActivities ? (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {selectedDay.activities.length} Kegiatan
                    </span>
                  ) : null}
                </div>
              </DialogHeader>

              <div className="px-7 pb-7 pt-2 space-y-3">
                {selectedDay.activities.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedDay.activities.map((act, i) => {
                      const isRange = act.tanggal_mulai && act.tanggal_selesai && act.tanggal_mulai !== act.tanggal_selesai;
                      return (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2"
                        >
                          {act.rencana_kinerja && (
                            <span className="inline-block text-[11px] font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md border border-teal-200/50 dark:border-teal-900/50">
                              {act.rencana_kinerja}
                            </span>
                          )}

                          <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                            {act.kegiatan || '—'}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                            <span>Rentang: {formatEntryDateRange(act)}</span>
                            {isRange && (
                              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                                (kegiatan multi-hari)
                              </span>
                            )}
                            {act.progres !== undefined && (
                              <span>Progres: {Number(act.progres || 0).toFixed(0)}%</span>
                            )}
                            {(act.jam_mulai || act.jam_selesai) && (
                              <span>Waktu: {act.jam_mulai || '-'} s.d. {act.jam_selesai || '-'}</span>
                            )}
                            {act.data_dukung && String(act.data_dukung).startsWith('http') && (
                              <a
                                href={String(act.data_dukung)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Bukti</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 px-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      Tidak ada catatan kegiatan pada tanggal ini.
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      Jika tanggal ini merupakan hari libur nasional atau cuti bersama, CKP tetap sah dan dapat disubmit.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
