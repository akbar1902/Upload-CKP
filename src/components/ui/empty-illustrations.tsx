import s from './empty-illustrations.module.css';

/**
 * Ilustrasi kecil untuk empty state — bahasa visual yang sama dengan adegan
 * ruko di halaman masuk (flat, blok warna hangat). Statis, warna lewat token
 * CSS sehingga otomatis ikut terang/gelap.
 *
 *   empty  → ruko dengan pintu gulung tertutup ("belum ada apa-apa")
 *   search → lampu jalan menyorot trotoar kosong ("tidak ditemukan")
 *   done   → ruko dengan papan centang & jendela terang ("semua beres")
 */
export type EmptyIllustrationKind = 'empty' | 'search' | 'done';

export function EmptyIllustration({ kind, className }: { kind: EmptyIllustrationKind; className?: string }) {
  return (
    <svg
      className={`${s.art} ${className ?? ''}`}
      viewBox="0 0 200 130"
      width="200"
      height="130"
      aria-hidden="true"
    >
      {/* tanah */}
      <rect x="6" y="118" width="188" height="4" rx="2" className={s.ground} />
      {kind === 'search' ? <Lamp /> : <Shop done={kind === 'done'} />}
    </svg>
  );
}

function Shop({ done }: { done: boolean }) {
  return (
    <g>
      {/* dinding atas & atap miring */}
      <polygon points="44,48 156,34 156,118 44,118" className={s.wall} />
      <polygon points="38,46 160,30 162,36 40,52" className={s.roof} />
      {/* jendela atas berjalusi */}
      <rect x="62" y="58" width="22" height="22" className={s.frame} />
      <rect x="65" y="61" width="16" height="16" className={done ? s.lit : s.glass} />
      <rect x="116" y="54" width="22" height="22" className={s.frame} />
      <rect x="119" y="57" width="16" height="16" className={s.glass} />
      {/* lantai dasar hijau */}
      <rect x="44" y="88" width="112" height="30" className={s.green} />
      {/* papan nama */}
      <rect x="50" y="84" width="100" height="10" rx="1.5" className={s.sign} />
      {done && (
        <path d="M94 89 l3.5 3 l6.5 -6" fill="none" className={s.check} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {done ? (
        <>
          {/* pintu terbuka, ruangan terang */}
          <rect x="62" y="98" width="30" height="20" className={s.lit} />
          <rect x="102" y="98" width="38" height="14" className={s.lit} />
        </>
      ) : (
        <>
          {/* pintu gulung tertutup */}
          <rect x="58" y="97" width="84" height="21" className={s.shutter} />
          {[100, 104, 108, 112, 116].map((y) => (
            <rect key={y} x="58" y={y} width="84" height="1.4" className={s.shutterLine} />
          ))}
        </>
      )}
      {/* tanaman pot */}
      <rect x="150" y="110" width="12" height="8" rx="1.5" className={s.pot} />
      <circle cx="156" cy="104" r="7" className={s.leaf} />
      <circle cx="152" cy="107" r="4.5" className={s.leafDark} />
    </g>
  );
}

function Lamp() {
  return (
    <g>
      {/* cahaya menyorot trotoar */}
      <polygon points="92,40 108,40 140,118 60,118" className={s.beam} />
      {/* tiang & kepala lampu */}
      <rect x="98" y="38" width="4" height="80" className={s.post} />
      <rect x="93" y="116" width="14" height="3" rx="1" className={s.post} />
      <polygon points="90,22 110,22 113,36 87,36" className={s.lampHead} />
      <rect x="92" y="25" width="16" height="10" className={s.lit} />
      <rect x="88" y="18" width="24" height="5" rx="1.5" className={s.lampHead} />
      {/* daun gugur */}
      <path d="M150 70 c5 2 6 8 0 11 c-6 -3 -5 -9 0 -11 Z" className={s.leaf} />
      <path d="M54 92 c4 1.5 4.5 6 0 8.5 c-4.5 -2.5 -4 -7 0 -8.5 Z" className={s.leafWarm} />
    </g>
  );
}
