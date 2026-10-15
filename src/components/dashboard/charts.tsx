import React from 'react';

// ============================================================
// Komponen chart ringan (SVG/CSS murni) — tanpa library eksternal.
//
// Warna default memakai CSS variable aplikasi (--primary, --accent,
// --danger, dst.) sehingga otomatis mengikuti tema terang/gelap.
// Ukuran responsif: SVG memakai viewBox + w-full h-auto.
// ============================================================

// ── TrendLines: garis ganda (mis. nilai vs progres) ─────────
export interface TrendPoint {
  label: string;
  value: number | null;
  value2?: number | null;
}

export interface TrendLinesProps {
  data: TrendPoint[];
  label1?: string;
  label2?: string;
  color1?: string;
  color2?: string;
  /** Nilai maksimum sumbu Y. Bila kosong, dihitung otomatis. */
  maxValue?: number;
  height?: number;
  /** Suffix untuk tooltip (mis. '%'). */
  unit?: string;
  emptyText?: string;
}

const PADDING = { top: 18, right: 18, bottom: 34, left: 42 };
const VIEW_WIDTH = 720;

function niceMax(raw: number): number {
  if (raw <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / pow;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * pow;
}

function formatTick(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function TrendLines({
  data,
  label1 = 'Seri 1',
  label2,
  color1 = 'var(--primary)',
  color2 = 'var(--accent)',
  maxValue,
  height = 240,
  unit = '',
  emptyText = 'Belum ada data untuk ditampilkan',
}: TrendLinesProps) {
  const width = VIEW_WIDTH;
  const innerW = width - PADDING.left - PADDING.right;
  const innerH = height - PADDING.top - PADDING.bottom;

  const hasSeries2 = data.some((d) => typeof d.value2 === 'number' && Number.isFinite(d.value2));
  const allValues = data
    .flatMap((d) => [d.value, hasSeries2 ? d.value2 : null])
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  const max = maxValue ?? niceMax(allValues.length > 0 ? Math.max(...allValues) : 0);

  const x = (index: number) =>
    data.length <= 1
      ? PADDING.left + innerW / 2
      : PADDING.left + (index * innerW) / (data.length - 1);
  const y = (value: number) => PADDING.top + innerH - (value / max) * innerH;

  const buildSegments = (getter: (point: TrendPoint) => number | null | undefined): string[] => {
    const segments: string[] = [];
    let current: string[] = [];

    data.forEach((point, index) => {
      const value = getter(point);
      if (typeof value === 'number' && Number.isFinite(value)) {
        current.push(`${x(index).toFixed(1)},${y(value).toFixed(1)}`);
      } else if (current.length > 0) {
        segments.push(current.join(' '));
        current = [];
      }
    });

    if (current.length > 0) segments.push(current.join(' '));
    return segments;
  };

  const segments1 = buildSegments((d) => d.value);
  const segments2 = hasSeries2 ? buildSegments((d) => d.value2) : [];
  const gridSteps = 4;

  if (allValues.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl text-[13px]"
        style={{ height, color: 'var(--text-tertiary)', background: 'var(--bg-secondary)' }}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-4 mb-2">
        {label1 && (
          <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color1 }} aria-hidden="true" />
            {label1}
          </span>
        )}
        {hasSeries2 && label2 && (
          <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color2 }} aria-hidden="true" />
            {label2}
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={`${label1}${hasSeries2 && label2 ? ` dan ${label2}` : ''} per periode`}
      >
        {/* Grid horizontal + label sumbu Y */}
        {Array.from({ length: gridSteps + 1 }, (_, i) => {
          const tickValue = (max * i) / gridSteps;
          const tickY = y(tickValue);
          return (
            <g key={`grid-${i}`}>
              <line
                x1={PADDING.left}
                x2={width - PADDING.right}
                y1={tickY}
                y2={tickY}
                strokeWidth={1}
                style={{ stroke: 'var(--border-soft)' }}
              />
              <text
                x={PADDING.left - 6}
                y={tickY + 3.5}
                textAnchor="end"
                fontSize={10}
                style={{ fill: 'var(--text-tertiary)' }}
              >
                {formatTick(tickValue)}
              </text>
            </g>
          );
        })}

        {/* Garis seri 1 */}
        {segments1.map((segment, i) => (
          <polyline
            key={`line1-${i}`}
            points={segment}
            fill="none"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ stroke: color1 }}
          />
        ))}

        {/* Garis seri 2 (putus-putus agar tetap terbaca) */}
        {segments2.map((segment, i) => (
          <polyline
            key={`line2-${i}`}
            points={segment}
            fill="none"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ stroke: color2 }}
          />
        ))}

        {/* Titik data + tooltip native <title> */}
        {data.map((point, i) => (
          <React.Fragment key={`point-${i}-${point.label}`}>
            {typeof point.value === 'number' && Number.isFinite(point.value) && (
              <circle cx={x(i)} cy={y(point.value)} r={3.2} style={{ fill: color1 }}>
                <title>{`${point.label} — ${label1}: ${formatTick(point.value)}${unit}`}</title>
              </circle>
            )}
            {hasSeries2 && typeof point.value2 === 'number' && Number.isFinite(point.value2) && (
              <circle cx={x(i)} cy={y(point.value2)} r={3.2} style={{ fill: color2 }}>
                <title>{`${point.label} — ${label2}: ${formatTick(point.value2)}${unit}`}</title>
              </circle>
            )}
          </React.Fragment>
        ))}

        {/* Label sumbu X */}
        {data.map((point, i) => (
          <text
            key={`xlabel-${i}-${point.label}`}
            x={x(i)}
            y={height - 10}
            textAnchor="middle"
            fontSize={10}
            style={{ fill: 'var(--text-tertiary)' }}
          >
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ── StatusDonut: donat distribusi (SVG circle stroke) ───────
export interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

export interface StatusDonutProps {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  emptyText?: string;
}

export function StatusDonut({
  data,
  size = 168,
  thickness = 24,
  centerLabel,
  emptyText = 'Belum ada data',
}: StatusDonutProps) {
  const total = data.reduce((sum, d) => sum + (Number.isFinite(d.value) ? d.value : 0), 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          role="img"
          aria-label="Distribusi status upload"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
            style={{ stroke: 'var(--bg-secondary)' }}
          />
          {total > 0 &&
            data.map((slice, i) => {
              const value = Math.max(0, slice.value || 0);
              if (value <= 0) return null;

              const fraction = value / total;
              const arcLength = fraction * circumference;
              const gap = Math.min(2, arcLength / 4);
              const visibleLength = Math.max(0, arcLength - gap);
              const dashOffset = -(accumulated * circumference);
              accumulated += fraction;

              return (
                <circle
                  key={`${slice.label}-${i}`}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  strokeWidth={thickness}
                  strokeDasharray={`${visibleLength} ${circumference - visibleLength}`}
                  strokeDashoffset={dashOffset}
                  style={{ stroke: slice.color || 'var(--primary)' }}
                >
                  <title>{`${slice.label}: ${slice.value}`}</title>
                </circle>
              );
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[22px] font-bold tabular-nums leading-none" style={{ color: 'var(--text-primary)' }}>
            {total.toLocaleString('id-ID')}
          </span>
          {centerLabel && (
            <span className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {centerLabel}
            </span>
          )}
        </div>
      </div>

      {total > 0 ? (
        <ul className="flex-1 w-full space-y-1.5">
          {data.map((slice, i) => (
            <li key={`${slice.label}-${i}`} className="flex items-center gap-2 text-[12.5px]">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: slice.color || 'var(--primary)' }}
                aria-hidden="true"
              />
              <span className="flex-1 truncate" style={{ color: 'var(--text-secondary)' }} title={slice.label}>
                {slice.label}
              </span>
              <span className="font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {slice.value.toLocaleString('id-ID')}
              </span>
              <span className="tabular-nums w-10 text-right" style={{ color: 'var(--text-tertiary)' }}>
                {Math.round((slice.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
          {emptyText}
        </p>
      )}
    </div>
  );
}

// ── MiniBars: bar horizontal ringkas (CSS) ──────────────────
export interface MiniBarDatum {
  label: string;
  value: number;
  color?: string;
}

export interface MiniBarsProps {
  data: MiniBarDatum[];
  color?: string;
  maxValue?: number;
  valueSuffix?: string;
  emptyText?: string;
}

export function MiniBars({
  data,
  color = 'var(--accent)',
  maxValue,
  valueSuffix = '',
  emptyText = 'Belum ada data',
}: MiniBarsProps) {
  if (data.length === 0) {
    return (
      <p className="text-[13px] py-4" style={{ color: 'var(--text-tertiary)' }}>
        {emptyText}
      </p>
    );
  }

  const max = maxValue ?? Math.max(1, ...data.map((d) => (Number.isFinite(d.value) ? d.value : 0)));

  return (
    <ul className="space-y-2.5">
      {data.map((item, i) => {
        const value = Number.isFinite(item.value) ? item.value : 0;
        const widthPercent = Math.max(0, Math.min(100, (value / max) * 100));

        return (
          <li key={`${item.label}-${i}`} className="flex items-center gap-3">
            <span
              className="w-28 sm:w-36 text-[12px] truncate flex-shrink-0"
              style={{ color: 'var(--text-secondary)' }}
              title={item.label}
            >
              {item.label}
            </span>
            <span
              className="flex-1 h-2.5 rounded-full overflow-hidden min-w-[40px]"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <span
                className="block h-full rounded-full transition-all duration-300"
                style={{ width: `${widthPercent}%`, background: item.color || color }}
              />
            </span>
            <span
              className="text-[12px] font-semibold tabular-nums w-14 text-right flex-shrink-0"
              style={{ color: 'var(--text-primary)' }}
            >
              {value.toLocaleString('id-ID')}
              {valueSuffix}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
