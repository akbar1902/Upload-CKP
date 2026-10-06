import * as React from 'react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════
   Komponen grafik ringan berbasis SVG (tanpa dependensi baru).
   Semua warna memakai token tema agar menyatu dgn neumorphism.
   ═══════════════════════════════════════════════════════════ */

/* ── Warna seri standar ───────────────────────────────────── */
export const CHART_COLORS = {
  primary: 'var(--primary)',
  accent: 'var(--accent)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  taupe: 'var(--tertiary-text)',
};

/* ── Kartu pembungkus grafik ──────────────────────────────── */
export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
  footer,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className={cn('neu-raised rounded-2xl p-5', className)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h4 className="text-[14px] font-semibold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h4>
          {subtitle && (
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
      {footer}
    </div>
  );
}

export function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px]" style={{ color: 'var(--text-secondary)' }}>
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} aria-hidden="true" />
      {label}
    </span>
  );
}

export function ChartEmpty({ label = 'Belum ada data untuk periode ini' }: { label?: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl py-10 text-[12.5px]"
      style={{ color: 'var(--text-tertiary)', boxShadow: 'var(--neu-inset-sm)' }}
    >
      {label}
    </div>
  );
}

/* ── Line chart (multi-seri, dukung nilai kosong) ─────────── */
export interface LineSeries {
  name: string;
  color: string;
  values: (number | null)[];
}

export function LineChart({
  labels,
  series,
  max = 100,
  height = 240,
  valueSuffix = '',
}: {
  labels: string[];
  series: LineSeries[];
  max?: number;
  height?: number;
  valueSuffix?: string;
}) {
  const W = 760;
  const H = height;
  const pl = 38;
  const pr = 18;
  const pt = 16;
  const pb = 30;
  const iw = W - pl - pr;
  const ih = H - pt - pb;
  const n = Math.max(labels.length, 1);

  const x = (i: number) => (n === 1 ? pl + iw / 2 : pl + (i * iw) / (n - 1));
  const y = (v: number) => pt + (1 - Math.max(0, Math.min(v, max)) / max) * ih;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(t * max));

  const linePath = (values: (number | null)[]) => {
    let d = '';
    let started = false;
    values.forEach((v, i) => {
      if (v == null) {
        started = false;
        return;
      }
      d += `${started ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
      started = true;
    });
    return d.trim();
  };

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Grafik garis">
        {/* Grid + label sumbu Y */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={pl}
              x2={W - pr}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--border-soft)"
              strokeWidth={1}
            />
            <text x={pl - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="var(--text-tertiary)">
              {t}
            </text>
          </g>
        ))}

        {/* Label sumbu X */}
        {labels.map((l, i) => (
          <text key={i} x={x(i)} y={H - 10} textAnchor="middle" fontSize={10.5} fill="var(--text-tertiary)">
            {l}
          </text>
        ))}

        {/* Seri */}
        {series.map((s) => (
          <g key={s.name}>
            <path d={linePath(s.values)} fill="none" stroke={s.color} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
            {s.values.map((v, i) =>
              v == null ? null : (
                <circle key={i} cx={x(i)} cy={y(v)} r={3.2} fill="var(--neu-surface)" stroke={s.color} strokeWidth={2}>
                  <title>{`${labels[i]}: ${v}${valueSuffix}`}</title>
                </circle>
              )
            )}
          </g>
        ))}
      </svg>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {series.map((s) => (
          <LegendDot key={s.name} color={s.color} label={s.name} />
        ))}
      </div>
    </div>
  );
}

/* ── Bar chart vertikal (opsional garis referensi) ────────── */
export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

export function BarChart({
  data,
  max,
  height = 240,
  valueSuffix = '',
  referenceValue,
  referenceLabel,
  showValues = true,
}: {
  data: BarDatum[];
  max?: number;
  height?: number;
  valueSuffix?: string;
  referenceValue?: number;
  referenceLabel?: string;
  showValues?: boolean;
}) {
  const W = 760;
  const H = height;
  const pl = 30;
  const pr = 16;
  const pt = 22;
  const pb = 30;
  const iw = W - pl - pr;
  const ih = H - pt - pb;
  const n = Math.max(data.length, 1);
  const maxV = max ?? Math.max(...data.map((d) => d.value), 1);
  const safeMax = maxV <= 0 ? 1 : maxV;

  const slot = iw / n;
  const bw = Math.min(42, slot * 0.58);
  const y = (v: number) => pt + (1 - Math.max(0, Math.min(v, safeMax)) / safeMax) * ih;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Grafik batang">
        {/* Garis referensi (mis. total pegawai) */}
        {referenceValue != null && referenceValue <= safeMax && (
          <g>
            <line
              x1={pl}
              x2={W - pr}
              y1={y(referenceValue)}
              y2={y(referenceValue)}
              stroke="var(--text-tertiary)"
              strokeWidth={1.2}
              strokeDasharray="5 5"
            />
            {referenceLabel && (
              <text x={W - pr} y={y(referenceValue) - 5} textAnchor="end" fontSize={10} fill="var(--text-tertiary)">
                {referenceLabel}
              </text>
            )}
          </g>
        )}

        {data.map((d, i) => {
          const bx = pl + slot * i + (slot - bw) / 2;
          const by = y(d.value);
          const bh = Math.max(pt + ih - by, d.value > 0 ? 2 : 0);
          const color = d.color ?? CHART_COLORS.primary;
          return (
            <g key={i}>
              <rect x={bx} y={by} width={bw} height={bh} rx={7} fill={color} opacity={d.value === 0 ? 0.25 : 1}>
                <title>{`${d.label}: ${d.value}${valueSuffix}`}</title>
              </rect>
              {showValues && d.value > 0 && (
                <text x={bx + bw / 2} y={by - 6} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="var(--text-secondary)">
                  {d.value}
                </text>
              )}
              <text x={bx + bw / 2} y={H - 10} textAnchor="middle" fontSize={10.5} fill="var(--text-tertiary)">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Donut chart ──────────────────────────────────────────── */
export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  data,
  size = 200,
  thickness = 22,
  centerValue,
  centerLabel,
}: {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  centerValue?: string;
  centerLabel?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  let acc = 0;
  const segments = data.map((d) => {
    const len = total > 0 ? (d.value / total) * c : 0;
    const seg = { ...d, len, offset: -acc };
    acc += len;
    return seg;
  });

  return (
    <div className="flex items-center gap-5 flex-wrap">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Diagram lingkaran">
          <g transform={`rotate(-90 ${cx} ${cy})`}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--neu-surface-2)" strokeWidth={thickness} />
            {total > 0 &&
              segments.map((s, i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${s.len} ${c - s.len}`}
                  strokeDashoffset={s.offset}
                >
                  <title>{`${s.label}: ${s.value}`}</title>
                </circle>
              ))}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[26px] font-bold tabular-nums leading-none" style={{ color: 'var(--text-primary)' }}>
            {centerValue ?? total}
          </span>
          {centerLabel && (
            <span className="text-[11px] mt-1 text-center" style={{ color: 'var(--text-tertiary)' }}>
              {centerLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-[140px] space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between gap-3">
            <LegendDot color={d.color} label={d.label} />
            <span className="text-[12.5px] font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {d.value}
              {total > 0 && (
                <span className="ml-1 text-[11px] font-normal" style={{ color: 'var(--text-tertiary)' }}>
                  {Math.round((d.value / total) * 100)}%
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Horizontal bar (baris HTML, mudah dibaca) ────────────── */
export interface HBarDatum {
  label: string;
  value: number;
  color?: string;
  caption?: string;
}

export function HBarChart({
  data,
  max,
  valueSuffix = '',
  decimals = 0,
  emptyLabel = 'Belum ada data',
}: {
  data: HBarDatum[];
  max?: number;
  valueSuffix?: string;
  decimals?: number;
  emptyLabel?: string;
}) {
  if (data.length === 0) return <ChartEmpty label={emptyLabel} />;
  const maxV = max ?? Math.max(...data.map((d) => d.value), 1);
  const safeMax = maxV <= 0 ? 1 : maxV;

  return (
    <div className="space-y-3.5">
      {data.map((d, i) => {
        const pct = Math.max(0, Math.min((d.value / safeMax) * 100, 100));
        return (
          <div key={i}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[12.5px] font-medium truncate" style={{ color: 'var(--text-primary)' }} title={d.label}>
                {d.label}
              </span>
              <span className="text-[12.5px] font-bold tabular-nums flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                {d.value.toFixed(decimals)}
                {valueSuffix}
              </span>
            </div>
            <div
              className="h-2.5 rounded-full overflow-hidden"
              style={{ background: 'var(--neu-surface-2)', boxShadow: 'var(--neu-inset-sm)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: d.color ?? CHART_COLORS.primary }}
              />
            </div>
            {d.caption && (
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {d.caption}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
