/**
 * Ilustrasi latar halaman masuk — deretan ruko kolonial Tanjung Pandan
 * dengan papan nama "SIKAP", tiang listrik, dan pohon tropis.
 * Vektor murni (tanpa gambar raster) supaya tajam di semua ukuran.
 * viewBox 1600×1000; bangunan utama berpusat di x≈600 agar crop mobile
 * tetap menampilkan fasad dan papan nama.
 */

import { WORDMARK_PATHS, WORDMARK_TRANSFORM, WORDMARK_VIEWBOX } from './wordmark';
import s from './login.module.css';

function Wordmark({ fill }: { fill: string }) {
  return (
    <svg x="499" y="624" width="162" height="41" viewBox={WORDMARK_VIEWBOX}>
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
];

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

export function LoginScene({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Ilustrasi deretan ruko dengan papan nama SIKAP"
    >
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8DD2EE" />
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
        <linearGradient id="ls-spill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5BE66" stopOpacity="0.32" />
          <stop offset="1" stopColor="#F5BE66" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ls-moonglow">
          <stop offset="0" stopColor="#FFF4D6" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFF4D6" stopOpacity="0" />
        </radialGradient>
        <filter id="ls-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* bercak plester: noise frekuensi rendah → hanya titik terang yang tersisa */}
        <filter id="ls-stucco" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves="4" seed="7" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  3 0 0 0 -1.55" />
        </filter>
        <clipPath id="ls-wall-yellow">
          <rect x="-10" y="150" width="270" height="710" />
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
      <rect width="1600" height="1000" fill="url(#ls-sky)" />
      <path d="M0 130 C 120 70 250 150 380 96 C 470 58 560 126 640 112 L 640 0 L 0 0 Z" fill="#fff" opacity="0.28" />
      <path d="M1040 0 C 1110 76 1250 40 1330 96 C 1420 156 1520 86 1600 112 L 1600 0 Z" fill="#fff" opacity="0.3" />
      <polygon className={s.dayOnly} points="1150,0 1600,0 1600,430" fill="#fff" opacity="0.08" />

      {/* ── Bangunan putih jauh di kanan ── */}
      <polygon points="1392,280 1430,256 1430,860 1392,860" fill="#CBC8C2" />
      <rect x="1430" y="256" width="170" height="604" fill="#E6E4E0" />
      {[320, 450, 580].map((wy) => (
        <g key={wy}>
          <rect x="1462" y={wy} width="64" height="84" fill="#2F3D3C" />
          <polygon points={`${1470},${wy + 76} ${1500},${wy + 8} ${1508},${wy + 8} ${1478},${wy + 76}`} fill="#fff" opacity="0.1" />
          <rect x="1456" y={wy + 84} width="76" height="7" fill="#F4F3F0" />
        </g>
      ))}

      {/* ── Pohon di belakang (blur = kedalaman) ── */}
      <g filter="url(#ls-blur)">
        <path d="M1150 720 C 1146 640 1160 590 1150 540" stroke="#8A4B32" strokeWidth="20" fill="none" />
        <path d="M1150 600 C 1120 570 1090 560 1070 540" stroke="#8A4B32" strokeWidth="10" fill="none" />
        <circle cx="1060" cy="470" r="105" fill="#8CBF5E" />
        <circle cx="1180" cy="420" r="120" fill="#93C463" />
        <circle cx="1290" cy="480" r="98" fill="#86B856" />
        <circle cx="1150" cy="540" r="96" fill="#7AAE4C" />
      </g>

      {/* ── Tembok pagar ── */}
      <rect x="940" y="700" width="660" height="160" fill="#DCC9B0" />
      <rect x="940" y="692" width="660" height="10" fill="#CBB698" />
      <rect x="940" y="828" width="660" height="32" fill="#8F9474" />

      {/* ── Bangunan kuning di kiri ── */}
      <rect x="-10" y="150" width="270" height="710" fill="url(#ls-yellow)" />
      <g clipPath="url(#ls-wall-yellow)">
        <rect x="-10" y="150" width="270" height="710" filter="url(#ls-stucco)" opacity="0.3" />
      </g>
      <rect x="-10" y="150" width="270" height="20" fill="#D69D16" />
      <rect x="-10" y="176" width="270" height="6" fill="#D69D16" opacity="0.6" />
      <rect x="-10" y="470" width="270" height="12" fill="#D9A11F" />
      <rect x="226" y="150" width="34" height="710" fill="#D69D16" opacity="0.55" />
      {[230, 560].map((wy) => (
        <g key={wy}>
          <rect x="34" y={wy} width="100" height="140" fill="#F7F2E6" />
          <rect x="42" y={wy + 8} width="84" height="124" fill="#163130" />
          <polygon points={`${52},${wy + 120} ${88},${wy + 16} ${96},${wy + 16} ${60},${wy + 120}`} fill="#fff" opacity="0.1" />
          <rect x="26" y={wy + 140} width="116" height="10" fill="#D69D16" />
        </g>
      ))}

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
      <rect x="0" y="860" width="1600" height="46" fill="#C4C1BA" />
      <rect x="0" y="860" width="1600" height="3" fill="#A9A69F" />
      <rect x="250" y="863" width="712" height="8" fill="#000" opacity="0.07" />
      <rect x="0" y="906" width="1600" height="8" fill="#9C9992" />
      <rect x="0" y="914" width="1600" height="86" fill="#8D8C87" />
      <rect x="0" y="952" width="1600" height="5" fill="#A6A49E" opacity="0.7" />

      {/* ── Lapisan malam (hanya mode gelap) ── */}
      <g className={s.nightOnly}>
        {/* seluruh adegan digelapkan ke biru malam */}
        <rect width="1600" height="1000" fill="#2A3863" style={{ mixBlendMode: 'multiply' }} />

        {/* bulan & bintang */}
        <circle cx="1010" cy="118" r="120" fill="url(#ls-moonglow)" />
        <circle cx="1010" cy="118" r="30" fill="#FFF3D4" />
        <circle cx="1000" cy="110" r="6" fill="#EFE0BC" opacity="0.6" />
        <circle cx="1020" cy="128" r="4" fill="#EFE0BC" opacity="0.5" />
        {STARS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#FFF7E0" opacity="0.85" />
        ))}

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
        <circle cx="535" cy="772" r="40" fill="url(#ls-glow)" />
        {/* meja di balik etalase */}
        <rect x="446" y="816" width="178" height="10" fill="#7A4A30" opacity="0.75" />
        <rect x="458" y="826" width="8" height="34" fill="#7A4A30" opacity="0.75" />
        <rect x="604" y="826" width="8" height="34" fill="#7A4A30" opacity="0.75" />

        {/* jendela tetangga */}
        <LitGlass x={42} y={238} w={84} h={124} dim />
        <LitGlass x={1462} y={450} w={64} h={84} dim />

        {/* papan nama tersorot dari atas */}
        <ellipse cx="580" cy="640" rx="170" ry="34" fill="url(#ls-glow)" opacity="0.7" />
        <rect x="400" y="598" width="22" height="6" rx="2" fill="#2A2F33" />
        <rect x="738" y="598" width="22" height="6" rx="2" fill="#2A2F33" />
        <ellipse cx="411" cy="606" rx="10" ry="3" fill="#FFE7B0" opacity="0.9" />
        <ellipse cx="749" cy="606" rx="10" ry="3" fill="#FFE7B0" opacity="0.9" />
        <Wordmark fill="#F6E7C6" />

        {/* lampu dinding */}
        <circle cx="318" cy="562" r="95" fill="url(#ls-glow)" />
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
      <rect x="112" y="-20" width="38" height="1020" fill="url(#ls-pole)" />
      <rect x="112" y="-20" width="38" height="1020" fill="none" stroke="#7B736D" strokeWidth="2" />
      <circle cx="131" cy="82" r="4" fill="#E2DCD6" />

      {/* kabel */}
      <path d="M16 36 C 520 250 1080 200 1600 60" stroke="#4E544F" strokeWidth="2.4" fill="none" />
      <path d="M196 36 C 640 200 1180 150 1600 4" stroke="#4E544F" strokeWidth="2.2" fill="none" />
      <path d="M306 36 C 760 150 1220 100 1620 -30" stroke="#4E544F" strokeWidth="2" fill="none" />
      </g>

      {/* butir tekstur halus ala cetak */}
      <rect width="1600" height="1000" filter="url(#ls-grain)" opacity="0.09" style={{ mixBlendMode: 'multiply' }} />
    </svg>
  );
}
