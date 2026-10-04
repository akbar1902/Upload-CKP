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
  bulan: number | string;
  tahun: number;
  entries: Partial<CKPEntry>[];
}

const WEEK_HEADER = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export function CalendarPreview({ bulan, tahun, entries }: CalendarPreviewProps) {
  const isTriwulan = typeof bulan === 'string' && bulan.startsWith('T');
  const triwulanMonths: Record<string, number[]> = {
    'T1': [1, 2, 3],
    'T2': [4, 5, 6],
    'T3': [7, 8, 9],
    'T4': [10, 11, 12],
  };
  const monthsInTriwulan = isTriwulan ? (triwulanMonths[bulan as string] || [1, 2, 3]) : [];
  
  const [selectedBulan, setSelectedBulan] = useState<number>(
    isTriwulan ? monthsInTriwulan[monthsInTriwulan.length - 1] : Number(bulan)
  );
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const effectiveBulan = isTriwulan ? selectedBulan : Number(bulan);

  const coverage = useMemo(() => {
    return calculateCalendarCoverage(effectiveBulan, tahun, entries);
  }, [effectiveBulan, tahun, entries]);

  const { period, months, totalWorkDays, filledWorkDays, emptyWorkDays } = coverage;

  return (
    <div className="space-y-4">
      {/* ─── Triwulan Month Tabs (if Triwulan) ─── */}
      {isTriwulan && (
        <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Bulan:</span>
          {monthsInTriwulan.map(m => {
            const mName = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][m];
            const isActive = selectedBulan === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedBulan(m)}
                className={`px-3 py-1 text-[12px] rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {mName}
              </button>
            );
          })}
        </div>
      )}

      {/* ─── Header Info Ringkas & Kalem ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Kalender Hari Kerja
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            ({period.periodLabel})
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {filledWorkDays} dari {totalWorkDays} hari kerja terisi
          </span>
          {emptyWorkDays.length > 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-[11px] bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {emptyWorkDays.length} belum terisi
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Lengkap
            </span>
          )}
        </div>
      </div>

      {/* ─── Grid Kalender Per Bulan ───────────────────────────────── */}
      <div className={`grid gap-5 ${months.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {months.map((m) => (
          <div
            key={`${m.year}-${m.month}`}
            className="rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/60 shadow-xs"
          >
            {/* Header Bulan */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/80">
              <div>
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  {m.monthName} {m.year}
                </span>
                <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">
                  ({m.periodSubtitle.replace('Periode: ', '')})
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {m.filledWorkDaysInPeriod}/{m.workDaysInPeriod} hari kerja
              </span>
            </div>

            {/* Header Hari (Sen - Min) */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800/80 text-center py-2 bg-slate-50/30 dark:bg-slate-900/40">
              {WEEK_HEADER.map((dayName, idx) => {
                const isWeekendCol = idx >= 5;
                return (
                  <span
                    key={dayName}
                    className={`text-[11px] font-medium ${
                      isWeekendCol
                        ? 'text-slate-400 dark:text-slate-500'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {dayName}
                  </span>
                );
              })}
            </div>

            {/* Kotak Tanggal */}
            <div className="p-2 grid grid-cols-7 gap-1.5">
              {m.calendarWeeks.flat().map((day, idx) => {
                // Di Luar Periode
                if (!day.isInPeriod) {
                  return (
                    <div
                      key={idx}
                      className="min-h-[68px] rounded-lg p-1.5 flex flex-col justify-start opacity-25 select-none bg-slate-50/40 dark:bg-slate-900/20"
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
                      className={`min-h-[68px] rounded-lg p-1.5 text-left flex flex-col justify-between transition-colors border ${
                        day.hasActivities
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                          : 'bg-slate-50/40 dark:bg-slate-900/30 border-dashed border-slate-200/70 dark:border-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                          {day.dayOfMonth}
                        </span>
                        {day.hasActivities && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                        )}
                      </div>

                      {day.hasActivities ? (
                        <span className="text-[10px] text-[var(--primary)] font-medium truncate">
                          {day.activities.length} keg (weekend)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-300 dark:text-slate-600">
                          Libur
                        </span>
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
                      className="min-h-[68px] rounded-lg p-1.5 text-left flex flex-col justify-between transition-all bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300/80 dark:border-amber-700/60 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                          {day.dayOfMonth}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      </div>

                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-100/90 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          Kosong
                        </span>
                        {day.holidayName ? (
                          <span className="block text-[9px] text-amber-700 dark:text-amber-400 truncate" title={day.holidayName}>
                            {day.holidayName}
                          </span>
                        ) : null}
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
                    className="min-h-[68px] rounded-lg p-1.5 text-left flex flex-col justify-between transition-all bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-2xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400">
                        {day.dayOfMonth}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[var(--primary)] font-medium block">
                        {day.activities.length} kegiatan
                      </span>
                      {day.activities[0]?.kegiatan && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-normal leading-tight">
                          {String(day.activities[0].kegiatan)}
                        </p>
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
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] inline-block" />
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
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary-ring)]">
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
                            <span className="inline-block text-[11px] font-medium text-[var(--primary)] bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md border border-[var(--primary-ring)]">
                              {act.rencana_kinerja}
                            </span>
                          )}

                          <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                            {act.kegiatan || '—'}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                            <span>Rentang: {formatEntryDateRange(act)}</span>
                            {isRange && (
                              <span className="text-[10px] text-[var(--primary)] font-medium">
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
                                className="inline-flex items-center gap-1 text-[var(--primary)] hover:underline"
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
