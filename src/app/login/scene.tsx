/**
 * Ilustrasi latar halaman masuk — deretan ruko kolonial Tanjung Pandan
 * dengan papan nama "SIKAP", tiang listrik, dan pohon tropis.
 * Vektor murni (tanpa gambar raster) supaya tajam di semua ukuran.
 * viewBox 1600×1000; bangunan utama berpusat di x≈600 agar crop mobile
 * tetap menampilkan fasad dan papan nama.
 */

import { WORDMARK_PATHS, WORDMARK_TRANSFORM, WORDMARK_VIEWBOX } from './wordmark';
import s from './login.module.css';

function Wordmark({
  fill,
  x = 499,
  y = 624,
  width = 162,
  height = 41,
}: {
  fill: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) {
  return (
    <svg x={x} y={y} width={width} height={height} viewBox={WORDMARK_VIEWBOX}>
      <g transform={WORDMARK_TRANSFORM} fill={fill}>
        {WORDMARK_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

// Bintang: [x, y, r]
const STARS: ReadonlyArray<readonly [number, number, number]> = [
  [40, 40, 1.6], [200, 118, 1.2], [360, 40, 1.8], [420, 150, 1.2], [520, 70, 1.5],
  [610, 28, 1.2], [700, 128, 1.8], [780, 60, 1.2], [860, 176, 1.4], [960, 40, 1.6],
  [1100, 66, 1.2], [1170, 150, 1.8], [1240, 28, 1.3], [1320, 112, 1.2], [1400, 58, 1.7],
  [1470, 190, 1.2], [1540, 40, 1.4], [1585, 150, 1.6], [300, 200, 1], [1060, 220, 1.1],
  [-160, -200, 1.6], [-60, -90, 1.2], [80, -180, 1.8], [240, -60, 1.2], [380, -210, 1.4],
  [520, -120, 1.7], [660, -220, 1.2], [800, -80, 1.5], [940, -190, 1.2], [1220, -150, 1.8],
  [1360, -60, 1.2], [1500, -200, 1.6], [1650, -110, 1.3], [1760, -30, 1.7], [-120, 60, 1.2],
];

/**
 * Tagline raksasa di langit, di belakang bangunan.
 *   baris 1 "Organized Your" — kabut putih (siang) / cahaya bulan (malam)
 *   baris 2 "Work."          — lebih tebal, kuning matahari, miring sejajar
 *                               genteng & berakhir di ujung kanan rumah;
 *                               malam hari menyala hangat seperti jendela.
 * Lebar baris 1 dikunci (textLength) agar tak bergantung metrik font.
 */
const TAG_LEFT = -90;
const TAG_WIDTH = 1110;
// "Work." dimiringkan sejajar genteng ruko. Garis atap: (220,304) → (934,210),
// kemiringan 94/714 → ±7,5°. Baseline diletakkan ROOF_GAP unit di atas atap,
// jadi jaraknya sama sepanjang kata dan tak ada yang tertimpa.
const ROOF_SLOPE = 94 / 714;
const ROOF_ANGLE = (Math.atan(ROOF_SLOPE) * 180) / Math.PI;
const ROOF_GAP = 16;
const roofY = (x: number) => 304 - (x - 220) * ROOF_SLOPE;
// Ujung kanan "Work." (titiknya) sejajar ujung kanan rumah = tepi tutup atap.
const WORK_RIGHT = 972;
// Baseline di poros kanan, dihitung dari puncak genteng (x=934) supaya celah
// ROOF_GAP berlaku di sepanjang genteng.
const WORK_BASELINE = roofY(934) - ROOF_GAP - (WORK_RIGHT - 934) * ROOF_SLOPE;
const TAG_FONT = 'var(--font-sans, Poppins, Arial, sans-serif)';

function SkyTagline({ night = false }: { night?: boolean }) {
  return (
    <g className={s.tagline}>
    <g>
      <text
        x={TAG_LEFT}
        y={46}
        textLength={TAG_WIDTH}
        lengthAdjust="spacing"
        fill={night ? 'url(#ls-skyword-night)' : 'url(#ls-skyword)'}
        style={{ fontFamily: TAG_FONT, fontWeight: 600, fontSize: 147, letterSpacing: -3 }}
      >
        Organized Your
      </text>
      {/* "Work." (opacity 90%) — miring sejajar genteng, berporos di ujung kanan.
          Bayangan flat (siang) / pendar redup (malam). */}
      <g
        opacity={night ? 0.86 : 0.9}
        transform={`rotate(${-ROOF_ANGLE} ${WORK_RIGHT} ${WORK_BASELINE})`}
      >
        <text
          x={WORK_RIGHT + (night ? 0 : 6)}
          y={WORK_BASELINE + (night ? 0 : 6)}
          textAnchor="end"
          fill={night ? '#E8B45E' : '#C98410'}
          opacity={night ? 0.3 : 1}
          filter={night ? 'url(#ls-soft)' : undefined}
          style={{ fontFamily: TAG_FONT, fontWeight: 700, fontSize: 190, letterSpacing: -4 }}
        >
          Work.
        </text>
        <text
          x={WORK_RIGHT}
          y={WORK_BASELINE}
          textAnchor="end"
          fill={night ? '#F0D49A' : '#FFC93C'}
          style={{ fontFamily: TAG_FONT, fontWeight: 700, fontSize: 190, letterSpacing: -4 }}
        >
          Work.
        </text>
      </g>
    </g>
    </g>
  );
}

/** Kaca yang menyala hangat (dipakai di lapisan malam). */
function LitGlass({ x, y, w, h, dim = false }: { x: number; y: number; w: number; h: number; dim?: boolean }) {
  return <rect x={x} y={y} width={w} height={h} fill="url(#ls-lit)" opacity={dim ? 0.72 : 0.95} />;
}

const SLAT_IDS = [0, 1, 2, 3, 4, 5];

function Shutter({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="url(#ls-slats)" />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#1D4A3D" strokeWidth={4} />
      <rect x={x + w / 2 - 1} y={y} width={2} height={h} fill="#1D4A3D" opacity={0.6} />
    </g>
  );
}

function UpperWindow({ x }: { x: number }) {
  const y = 410;
  const w = 130;
  const h = 150;
  return (
    <g>
      <Shutter x={x - 60} y={y} w={56} h={h} />
      <Shutter x={x + w + 4} y={y} w={56} h={h} />
      <rect x={x} y={y} width={w} height={h} fill="#7A4D43" />
      <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} fill="url(#ls-glass)" />
      <rect x={x + w / 2 - 3} y={y + 10} width={6} height={h - 20} fill="#7A4D43" />
      <polygon points={`${x + 18},${y + 120} ${x + 52},${y + 20} ${x + 62},${y + 20} ${x + 28},${y + 120}`} fill="#fff" opacity={0.12} />
      <polygon points={`${x + 82},${y + 120} ${x + 108},${y + 44} ${x + 113},${y + 44} ${x + 87},${y + 120}`} fill="#fff" opacity={0.1} />
      <rect x={x - 8} y={y + h} width={w + 16} height={10} fill="#F8F6F1" />
      <rect x={x - 8} y={y + h + 10} width={w + 16} height={6} fill="#000" opacity={0.07} />
    </g>
  );
}

/** viewBox kanvas penuh (dipakai halaman login). */
export const SCENE_VIEWBOX = "-200 -250 2000 1250";

/**
 * Adegan ruko. Bisa dipakai ulang di tempat lain dengan potongan berbeda
 * (mis. hero dashboard memotong bagian fasad saja, tanpa tagline).
 */
export function LoginScene({
  className,
  viewBox = SCENE_VIEWBOX,
  preserveAspectRatio = "xMidYMax slice",
  showTagline = true,
}: {
  className?: string;
  viewBox?: string;
  preserveAspectRatio?: string;
  showTagline?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      role="img"
      aria-label="Ilustrasi deretan ruko dengan papan nama SIKAP"
    >
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6FC2E8" />
          <stop offset="0.22" stopColor="#8DD2EE" />
          <stop offset="0.55" stopColor="#C9EDF7" />
          <stop offset="1" stopColor="#E8F6F9" />
        </linearGradient>
        <linearGradient id="ls-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2F0EB" />
          <stop offset="1" stopColor="#E4E0D8" />
        </linearGradient>
        <linearGradient id="ls-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7DBA99" />
          <stop offset="1" stopColor="#68A684" />
        </linearGradient>
        <linearGradient id="ls-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B4241" />
          <stop offset="1" stopColor="#1E2322" />
        </linearGradient>
        <linearGradient id="ls-pole" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8F8680" />
          <stop offset="0.35" stopColor="#C3BAB3" />
          <stop offset="1" stopColor="#A69C95" />
        </linearGradient>
        <linearGradient id="ls-yellow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F5BE2E" />
          <stop offset="1" stopColor="#E9AE1E" />
        </linearGradient>
        <pattern id="ls-slats" width="10" height="9" patternUnits="userSpaceOnUse">
          <rect width="10" height="9" fill="#2F6E5A" />
          <rect y="5" width="10" height="4" fill="#245845" />
        </pattern>
        <pattern id="ls-panel" width="12" height="10" patternUnits="userSpaceOnUse">
          <rect width="12" height="10" fill="#4C8B6D" />
          <rect x="8" width="4" height="10" fill="#3F7A5E" />
        </pattern>
        <pattern id="ls-ribs" width="14" height="10" patternUnits="userSpaceOnUse">
          <rect width="14" height="10" fill="#ADA6A0" />
          <rect x="9" width="5" height="10" fill="#958E88" />
        </pattern>
        <linearGradient id="ls-lit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE3A1" />
          <stop offset="1" stopColor="#F0A04B" />
        </linearGradient>
        <radialGradient id="ls-glow">
          <stop offset="0" stopColor="#FFD98A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFD98A" stopOpacity="0" />
        </radialGradient>
        {/* kata raksasa: putih pekat di atas, larut ke kabut langit di bawah */}
        <linearGradient id="ls-skyword" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.96" />
          <stop offset="0.65" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.36" />
        </linearGradient>
        <filter id="ls-soft" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <linearGradient id="ls-skyword-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E6EAFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#E6EAFF" stopOpacity="0.2" />
        </linearGradient>
        {/* area langit di atas bangunan kuning (atas y=150) & atap utama */}
        <clipPath id="ls-sky-only">
          <polygon points="-200,-250 1800,-250 1800,232 1392,232 1392,340 972,340 972,214 934,210 220,304 220,330 260,330 260,150 -210,150" />
        </clipPath>
        <linearGradient id="ls-spill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5BE66" stopOpacity="0.32" />
          <stop offset="1" stopColor="#F5BE66" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ls-moonglow">
          <stop offset="0" stopColor="#FFF4D6" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFF4D6" stopOpacity="0" />
        </radialGradient>
        {/* bercak plester: noise frekuensi rendah → hanya titik terang yang tersisa */}
        <filter id="ls-stucco" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves="4" seed="7" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  3 0 0 0 -1.55" />
        </filter>
        <clipPath id="ls-wall-yellow">
          <rect x="-210" y="150" width="470" height="710" />
        </clipPath>
        <clipPath id="ls-wall-teal">
          <rect x="1404" y="246" width="400" height="614" />
        </clipPath>
        <clipPath id="ls-wall-main">
          <polygon points="250,318 910,232 910,860 250,860" />
        </clipPath>
        <filter id="ls-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* ── Langit ── */}
      <rect x="-200" y="-250" width="2000" height="1250" fill="url(#ls-sky)" />
      {/* awan lembut berlapis (gaya poster), bergeser pelan */}
      <g>
      <path d="M-200 -120 C -60 -190 120 -100 300 -160 C 420 -200 560 -130 700 -170 L 700 -250 L -200 -250 Z" fill="#fff" opacity="0.22" />
      <path d="M-200 130 C -60 60 120 150 380 96 C 470 58 560 126 640 112 C 700 104 760 60 800 30 L 800 -40 C 600 -10 300 20 -200 0 Z" fill="#fff" opacity="0.18" />
      <path d="M1040 -40 C 1110 36 1250 0 1330 56 C 1420 116 1560 46 1800 92 L 1800 -110 C 1600 -60 1300 -120 1040 -40 Z" fill="#fff" opacity="0.26" />
      </g>
      <polygon className={s.dayOnly} points="1150,-250 1800,-250 1800,430" fill="#fff" opacity="0.08" />

      {/* ── Kata raksasa melayang di langit, di belakang bangunan ──
          Bawah hurufnya tertutup atap & bangunan kuning; kabel dan tiang
          lewat di depannya → terasa berlapis seperti poster wisata. */}
      {showTagline && <SkyTagline />}

      {/* ── Rumah kolonial toska di kanan (balkon + jendela putih) ── */}
      <polygon points="1372,262 1404,246 1404,860 1372,860" fill="#15514E" />
      <rect x="1404" y="246" width="400" height="614" fill="#1E6B67" />
      <g clipPath="url(#ls-wall-teal)">
        <rect x="1404" y="246" width="400" height="614" filter="url(#ls-stucco)" opacity="0.12" />
      </g>
      {/* lis atap & pemisah lantai */}
      <rect x="1392" y="232" width="420" height="18" fill="#F3F0E8" />
      <rect x="1392" y="250" width="420" height="8" fill="#000" opacity="0.1" />
      <rect x="1404" y="540" width="400" height="12" fill="#F3F0E8" />
      {/* jendela lantai atas */}
      {[1440, 1560, 1680].map((wx) => (
        <g key={wx}>
          <rect x={wx} y="296" width="80" height="150" fill="#F3F0E8" />
          <rect x={wx + 8} y="304" width="64" height="134" fill="#123230" />
          <rect x={wx + 38} y="304" width="4" height="134" fill="#F3F0E8" />
          <rect x={wx + 8} y="364" width="64" height="4" fill="#F3F0E8" />
          <polygon points={`${wx + 14},430 ${wx + 34},312 ${wx + 38},312 ${wx + 18},430`} fill="#fff" opacity="0.12" />
        </g>
      ))}
      {/* balkon berpagar */}
      <rect x="1418" y="496" width="386" height="10" fill="#F3F0E8" />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={1424 + i * 16} y="506" width="5" height="30" fill="#F3F0E8" />
      ))}
      <rect x="1412" y="536" width="392" height="8" fill="#E2DED4" />
      <rect x="1412" y="552" width="392" height="10" fill="#000" opacity="0.1" />
      {/* lantai dasar: pintu melengkung + jendela */}
      <path d="M1460 860 L 1460 690 A 44 44 0 0 1 1548 690 L 1548 860 Z" fill="#F3F0E8" />
      <path d="M1468 860 L 1468 692 A 36 36 0 0 1 1540 692 L 1540 860 Z" fill="#123230" />
      <rect x="1502" y="700" width="4" height="160" fill="#2C5452" />
      <rect x="1610" y="640" width="140" height="120" fill="#F3F0E8" />
      <rect x="1618" y="648" width="124" height="104" fill="#123230" />
      <rect x="1678" y="648" width="4" height="104" fill="#F3F0E8" />
      <polygon points="1628,744 1660,656 1666,656 1634,744" fill="#fff" opacity="0.1" />
      <rect x="1604" y="760" width="152" height="10" fill="#F3F0E8" />

      {/* ── Taman kecil di antara bangunan ── */}
      {/* pohon ketapang: batang + tajuk berlapis tiga nada */}
      <path d="M1186 700 C 1180 630 1192 580 1182 520" stroke="#7A4630" strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d="M1184 590 C 1150 566 1118 556 1092 528" stroke="#7A4630" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M1186 560 C 1220 536 1250 530 1278 508" stroke="#7A4630" strokeWidth="9" fill="none" strokeLinecap="round" />
      <g>
        <ellipse cx="1180" cy="470" rx="190" ry="78" fill="#4E8C43" />
        <ellipse cx="1090" cy="500" rx="96" ry="48" fill="#4E8C43" />
        <ellipse cx="1280" cy="496" rx="100" ry="46" fill="#4E8C43" />
        <ellipse cx="1170" cy="430" rx="150" ry="64" fill="#62A552" />
        <ellipse cx="1260" cy="452" rx="90" ry="44" fill="#62A552" />
        <ellipse cx="1150" cy="396" rx="104" ry="44" fill="#7DBE62" />
        <ellipse cx="1110" cy="410" rx="44" ry="18" fill="#9BD07A" opacity="0.8" />
        <ellipse cx="1200" cy="384" rx="40" ry="14" fill="#9BD07A" opacity="0.7" />
        <ellipse cx="1180" cy="516" rx="170" ry="16" fill="#000" opacity="0.08" />
      </g>
      {/* lampu taman */}
      <rect x="1046" y="566" width="7" height="134" fill="#2F3537" />
      <rect x="1040" y="696" width="19" height="8" fill="#2F3537" />
      <polygon points="1038,542 1062,542 1066,566 1034,566" fill="#3A4244" />
      <rect x="1040" y="546" width="20" height="18" fill="#FFF3D2" />
      <rect x="1036" y="536" width="28" height="7" fill="#2F3537" />

      {/* ── Tembok taman + pagar semak ── */}
      {[1000, 1062, 1122, 1186, 1250, 1312, 1366].map((bx, i) => (
        <g key={bx}>
          <circle cx={bx} cy={690} r={i % 2 ? 40 : 46} fill="#4F8F43" />
          <circle cx={bx - 12} cy={680} r={i % 2 ? 24 : 28} fill="#6AAE55" />
        </g>
      ))}
      <rect x="962" y="700" width="442" height="160" fill="#DCC9B0" />
      <rect x="962" y="692" width="442" height="10" fill="#CBB698" />
      <rect x="962" y="828" width="442" height="32" fill="#8F9474" />
      {[1030, 1150, 1270].map((px) => (
        <rect key={px} x={px} y="702" width="10" height="126" fill="#CDB89C" />
      ))}

      {/* ── Bangunan kuning di kiri ── */}
      <rect x="-210" y="150" width="470" height="710" fill="url(#ls-yellow)" />
      <g clipPath="url(#ls-wall-yellow)">
        <rect x="-210" y="150" width="470" height="710" filter="url(#ls-stucco)" opacity="0.3" />
      </g>
      <rect x="-210" y="150" width="470" height="20" fill="#D69D16" />
      <rect x="-210" y="176" width="470" height="6" fill="#D69D16" opacity="0.6" />
      <rect x="-210" y="470" width="470" height="12" fill="#D9A11F" />
      <rect x="226" y="150" width="34" height="710" fill="#D69D16" opacity="0.55" />
      {[-150, 34].flatMap((wx) => [230, 560].map((wy) => (
        <g key={`${wx}-${wy}`}>
          <rect x={wx} y={wy} width="100" height="140" fill="#F7F2E6" />
          <rect x={wx + 8} y={wy + 8} width="84" height="124" fill="#163130" />
          <polygon points={`${wx + 18},${wy + 120} ${wx + 54},${wy + 16} ${wx + 62},${wy + 16} ${wx + 26},${wy + 120}`} fill="#fff" opacity="0.1" />
          <rect x={wx - 8} y={wy + 140} width="116" height="10" fill="#D69D16" />
        </g>
      )))}

      {/* ── Bangunan utama: lantai atas ── */}
      <polygon points="250,318 910,232 910,640 250,640" fill="url(#ls-wall)" />
      <rect x="250" y="640" width="660" height="220" fill="url(#ls-green)" />
      <g clipPath="url(#ls-wall-main)">
        <rect x="250" y="232" width="660" height="628" filter="url(#ls-stucco)" opacity="0.3" />
      </g>
      <polygon points="250,318 334,307 334,640 250,640" fill="#000" opacity="0.055" />
      {/* sisi kanan (kedalaman) */}
      <polygon points="910,232 962,238 962,860 910,860" fill="#D2CEC6" />
      {/* atap miring */}
      <polygon points="250,326 910,240 910,262 250,348" fill="#000" opacity="0.08" />
      <polygon points="220,304 934,210 946,234 232,328" fill="#8D5C50" />
      <polygon points="220,304 934,210 936,216 222,310" fill="#A9766A" />
      <polygon points="934,210 972,214 972,240 946,234" fill="#734A40" />

      <UpperWindow x={420} />
      <UpperWindow x={680} />

      {/* lampu dinding */}
      <g>
        <path d="M296 600 L 296 586 L 318 586" stroke="#2F3537" strokeWidth="5" fill="none" />
        <polygon points="306,520 330,520 336,544 300,544" fill="#3A4244" />
        <rect x="303" y="544" width="30" height="36" fill="#FFF6DD" />
        <rect x="303" y="544" width="30" height="36" fill="none" stroke="#3A4244" strokeWidth="4" />
        <rect x="300" y="580" width="36" height="6" fill="#3A4244" />
        <rect x="314" y="512" width="8" height="8" fill="#3A4244" />
      </g>

      {/* ── Lantai dasar hijau (dinding sudah digambar di atas) ── */}
      <rect x="250" y="640" width="84" height="220" fill="#000" opacity="0.06" />

      {/* papan nama */}
      <rect x="270" y="676" width="620" height="12" fill="#000" opacity="0.12" />
      <rect x="270" y="612" width="620" height="64" fill="#6E4A40" />
      <rect x="270" y="612" width="620" height="5" fill="#86594D" />
      {SLAT_IDS.map((i) => (
        <g key={i}>
          <rect x={284 + i * 18} y="620" width="9" height="48" fill="#5B3B32" />
          <rect x={867 - i * 18} y="620" width="9" height="48" fill="#5B3B32" />
        </g>
      ))}
      {/* huruf SIKAP dari wordmark logo, krem */}
      <Wordmark fill="#F3E7CF" />

      {/* pintu kaca */}
      <rect x="296" y="700" width="96" height="160" fill="#4C8B6D" />
      <rect x="308" y="712" width="72" height="148" fill="url(#ls-glass)" />
      <polygon points="314,800 352,716 362,716 324,800" fill="#fff" opacity="0.1" />
      <rect x="366" y="782" width="6" height="22" fill="#C9C3B8" />

      {/* etalase */}
      <rect x="418" y="700" width="234" height="160" fill="#4C8B6D" />
      <rect x="430" y="712" width="210" height="148" fill="url(#ls-glass)" />
      <polygon points="440,850 548,712 586,712 478,850" fill="#fff" opacity="0.08" />
      <polygon points="500,850 600,722 612,722 512,850" fill="#fff" opacity="0.07" />

      {/* jendela kanan + panel kayu */}
      <rect x="672" y="700" width="212" height="112" fill="#4C8B6D" />
      <rect x="682" y="710" width="192" height="94" fill="url(#ls-glass)" />
      <polygon points="700,800 760,710 784,710 724,800" fill="#fff" opacity="0.08" />
      <rect x="672" y="816" width="212" height="44" fill="url(#ls-panel)" />

      {/* pilar */}
      <rect x="916" y="640" width="92" height="12" fill="#F2F0EC" />
      <rect x="922" y="652" width="80" height="16" fill="#E6E3DE" />
      <rect x="930" y="668" width="64" height="192" fill="#ECEAE6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={938 + i * 12} y="672" width="4" height="184" fill="#D3CFC8" />
      ))}
      <rect x="930" y="668" width="10" height="192" fill="#000" opacity="0.05" />

      {/* tanaman pot */}
      <path d="M866 846 C 860 830 878 822 868 806" stroke="#5B4632" strokeWidth="6" fill="none" />
      <circle cx="868" cy="796" r="22" fill="#9ACB5A" />
      <circle cx="850" cy="810" r="16" fill="#86B94B" />
      <circle cx="886" cy="808" r="16" fill="#A6D466" />
      <circle cx="866" cy="780" r="13" fill="#B1DB72" />
      <rect x="844" y="836" width="48" height="20" rx="3" fill="#24474D" />
      <ellipse cx="868" cy="836" rx="24" ry="5" fill="#2E585F" />

      {/* berkas cahaya diagonal (siang saja) */}
      <g className={s.dayOnly}>
        <polygon points="560,232 740,232 430,860 250,860" fill="#fff" opacity="0.07" />
        <polygon points="800,232 880,232 640,860 560,860" fill="#fff" opacity="0.05" />
      </g>

      {/* ── Trotoar & jalan ── */}
      <rect x="-200" y="860" width="2000" height="46" fill="#C4C1BA" />
      <rect x="-200" y="860" width="2000" height="3" fill="#A9A69F" />
      <rect x="250" y="863" width="712" height="8" fill="#000" opacity="0.07" />
      <rect x="-200" y="906" width="2000" height="8" fill="#9C9992" />
      <rect x="-200" y="914" width="2000" height="86" fill="#8D8C87" />
      <rect x="-200" y="952" width="2000" height="5" fill="#A6A49E" opacity="0.7" />

      {/* ── Lapisan malam (hanya mode gelap) ── */}
      <g className={s.nightOnly}>
        {/* seluruh adegan digelapkan ke biru malam */}
        <rect x="-200" y="-250" width="2000" height="1250" fill="#2A3863" style={{ mixBlendMode: 'multiply' }} />

        {/* bulan & bintang */}
        <circle cx="1060" cy="-110" r="150" fill="url(#ls-moonglow)" />
        <circle cx="1060" cy="-110" r="36" fill="#FFF3D4" />
        <circle cx="1048" cy="-120" r="7" fill="#EFE0BC" opacity="0.6" />
        <circle cx="1072" cy="-98" r="5" fill="#EFE0BC" opacity="0.5" />
        {/* bintang berkelip ada di LoginSceneFx (lapisan terpisah) */}

        {/* kata raksasa diterangi bulan — dipotong mengikuti siluet bangunan
            supaya tetap terasa "di belakang rumah" */}
        <g clipPath="url(#ls-sky-only)">
          {showTagline && <SkyTagline night />}
        </g>

        {/* jendela lantai atas menyala */}
        <LitGlass x={430} y={420} w={110} h={130} dim />
        <LitGlass x={690} y={420} w={110} h={130} />
        <rect x="482" y="420" width="6" height="130" fill="#5A382F" />
        <rect x="742" y="420" width="6" height="130" fill="#5A382F" />
        {/* tirai separuh di jendela kanan */}
        <path d="M748 420 L 800 420 L 800 550 C 784 520 772 470 748 452 Z" fill="#C46A3C" opacity="0.55" />

        {/* lantai dasar: pintu, etalase, jendela */}
        <LitGlass x={308} y={712} w={72} h={148} dim />
        <LitGlass x={430} y={712} w={210} h={148} />
        <LitGlass x={682} y={710} w={192} h={94} />
        {/* lampu gantung di etalase */}
        <path d="M535 712 L 535 748" stroke="#5A3A2E" strokeWidth="2" />
        <polygon points="522,748 548,748 556,764 514,764" fill="#5A3A2E" />
        {/* meja di balik etalase */}
        <rect x="446" y="816" width="178" height="10" fill="#7A4A30" opacity="0.75" />
        <rect x="458" y="826" width="8" height="34" fill="#7A4A30" opacity="0.75" />
        <rect x="604" y="826" width="8" height="34" fill="#7A4A30" opacity="0.75" />

        {/* jendela tetangga */}
        <LitGlass x={42} y={238} w={84} h={124} dim />
        {/* rumah toska: satu jendela atas & pintu menyala */}
        <LitGlass x={1568} y={304} w={64} h={134} dim />
        <rect x="1598" y="304" width="4" height="134" fill="#C9C2B0" />
        <rect x="1568" y="364" width="64" height="4" fill="#C9C2B0" />
        <path d="M1468 860 L 1468 692 A 36 36 0 0 1 1540 692 L 1540 860 Z" fill="url(#ls-lit)" opacity="0.7" />
        <rect x="1502" y="700" width="4" height="160" fill="#7A5A3A" />

        {/* lampu taman */}
        <rect x="1040" y="546" width="20" height="18" fill="#FFE9A8" />

        {/* papan nama tersorot dari atas */}
        <ellipse cx="580" cy="640" rx="170" ry="34" fill="url(#ls-glow)" opacity="0.7" />
        <rect x="400" y="598" width="22" height="6" rx="2" fill="#2A2F33" />
        <rect x="738" y="598" width="22" height="6" rx="2" fill="#2A2F33" />
        <ellipse cx="411" cy="606" rx="10" ry="3" fill="#FFE7B0" opacity="0.9" />
        <ellipse cx="749" cy="606" rx="10" ry="3" fill="#FFE7B0" opacity="0.9" />
        <Wordmark fill="#F6E7C6" />

        {/* lampu dinding */}
        <rect x="303" y="544" width="30" height="36" fill="#FFE9A8" />
        <rect x="303" y="544" width="30" height="36" fill="none" stroke="#1F2427" strokeWidth="4" />

        {/* cahaya jatuh ke trotoar */}
        <polygon points="430,860 640,860 700,912 380,912" fill="url(#ls-spill)" />
        <polygon points="682,860 874,860 920,912 646,912" fill="url(#ls-spill)" opacity="0.7" />
        <polygon points="308,860 380,860 408,912 284,912" fill="url(#ls-spill)" opacity="0.6" />
      </g>

      {/* ── Tiang listrik (latar depan) ── */}
      <polygon className={s.dayOnly} points="112,1000 150,1000 470,860 432,860" fill="#000" opacity="0.1" />
      <g className={s.pole}>
      {/* trafo */}
      <rect x="-14" y="300" width="130" height="12" fill="#BDB6B0" />
      <rect x="-10" y="312" width="122" height="150" fill="url(#ls-ribs)" />
      <rect x="-10" y="312" width="122" height="150" fill="none" stroke="#7F7872" strokeWidth="3" />
      {/* palang atas */}
      <rect x="-20" y="72" width="370" height="20" fill="#A9A09A" stroke="#7F7771" strokeWidth="2" />
      <path d="M131 160 L 40 92 M 131 160 L 222 92" stroke="#958C86" strokeWidth="9" />
      {[16, 196, 306].map((ix) => (
        <g key={ix}>
          {[0, 1, 2].map((k) => (
            <ellipse key={k} cx={ix} cy={60 - k * 9} rx="13" ry="5" fill="#8C847E" />
          ))}
          <rect x={ix - 4} y="34" width="8" height="10" fill="#7F7771" />
        </g>
      ))}
      <rect x="112" y="-260" width="38" height="1260" fill="url(#ls-pole)" />
      <rect x="112" y="-260" width="38" height="1260" fill="none" stroke="#7B736D" strokeWidth="2" />
      <circle cx="131" cy="82" r="4" fill="#E2DCD6" />

      {/* kabel */}
      <path d="M16 36 C 560 260 1200 210 1800 40" stroke="#4E544F" strokeWidth="2.4" fill="none" />
      <path d="M196 36 C 680 210 1280 150 1800 -20" stroke="#4E544F" strokeWidth="2.2" fill="none" />
      <path d="M306 36 C 800 160 1320 100 1820 -70" stroke="#4E544F" strokeWidth="2" fill="none" />
      </g>

      {/* butir tekstur halus ala cetak */}
      <rect x="-200" y="-250" width="2000" height="1250" filter="url(#ls-grain)" opacity="0.09" style={{ mixBlendMode: 'multiply' }} />
    </svg>
  );
}

/** Posisi titik kanvas (viewBox -200 -250 2000 1250) dalam % lapisan efek. */
const px = (x: number) => `${((x + 200) / 2000) * 100}%`;
const py = (y: number) => `${((y + 250) / 1250) * 100}%`;

/** Pendar lampu: [x, y, radius] dalam unit kanvas. */
const GLOWS: ReadonlyArray<readonly [number, number, number]> = [
  [318, 562, 95],
  [1050, 556, 80],
  [535, 772, 40],
];

/**
 * Lapisan efek malam — bintang berkelip & pendar lampu.
 * Elemen HTML biasa (bukan SVG) yang HANYA dianimasikan lewat opacity,
 * sehingga dijalankan compositor/GPU tanpa repaint. Lapisan ini memakai
 * ukuran & posisi yang sama persis dengan SVG adegan (lihat .fx di CSS),
 * dan SVG adegan sendiri 100% statis.
 */
export function LoginSceneFx() {
  return (
    <div className={s.fx} aria-hidden="true">
      {STARS.map(([x, y, r]) => (
        <span
          key={`${x}-${y}`}
          className={s.star}
          style={{
            left: px(x),
            top: py(y),
            width: `${r * 2}px`,
            height: `${r * 2}px`,
            animationDelay: `-${((x * 7 + y * 3 + 4000) % 40) / 10}s`,
          }}
        />
      ))}
      {GLOWS.map(([x, y, r], i) => (
        <span
          key={`g${i}`}
          className={s.flicker}
          style={{
            left: px(x),
            top: py(y),
            width: `${((r * 2) / 2000) * 100}%`,
            animationDelay: `-${i * 2.1}s`,
          }}
        />
      ))}
    </div>
  );
}
