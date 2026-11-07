/**
 * Nama file bukti dukung → tanggal + kegiatan mentah.
 * Port dari CKP-App/src/parser.js (perilaku dan test sama).
 * JavaScript murni agar bisa diuji langsung dengan `node --test`.
 *
 * Pola utama (ekstensi diabaikan):
 *   "21 September_melakukan pelayanan PST"  -> tgl 21-21 September
 *   "20-27 September_Klasikal Latsar"       -> tgl 20-27 September
 * Varian: "1. Oktober_Apel", "1 Oktober 2026_Apel", "1 Okt 2026 - Apel",
 *   "01-10-2026_Apel", "2026-10-01", "Dokumentasi 5 Oktober_kegiatan",
 *   "IMG_20261021_103000_kegiatan", "WhatsApp Image 2026-10-21 at 10.30.00 - kegiatan".
 */

/** @typedef {{ index: number, nama: string }} Bulan */

/** @type {Record<string, Bulan>} */
export const BULAN = {
  januari: { index: 1, nama: 'Januari' },
  februari: { index: 2, nama: 'Februari' },
  maret: { index: 3, nama: 'Maret' },
  april: { index: 4, nama: 'April' },
  mei: { index: 5, nama: 'Mei' },
  juni: { index: 6, nama: 'Juni' },
  juli: { index: 7, nama: 'Juli' },
  agustus: { index: 8, nama: 'Agustus' },
  september: { index: 9, nama: 'September' },
  oktober: { index: 10, nama: 'Oktober' },
  november: { index: 11, nama: 'November' },
  desember: { index: 12, nama: 'Desember' },
};

/** @type {Record<string, string>} */
const ALIAS_BULAN = {
  jan: 'januari', january: 'januari',
  feb: 'februari', pebruari: 'februari', february: 'februari',
  mar: 'maret', march: 'maret',
  apr: 'april',
  may: 'mei',
  jun: 'juni', june: 'juni',
  jul: 'juli', july: 'juli',
  agu: 'agustus', agt: 'agustus', agust: 'agustus', aug: 'agustus', august: 'agustus',
  sep: 'september', sept: 'september', septem: 'september',
  okt: 'oktober', oct: 'oktober', october: 'oktober',
  nov: 'november', nop: 'november', nopember: 'november',
  des: 'desember', dec: 'desember', december: 'desember',
};

const MAKS_HARI = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** @param {string} s */
export function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** @param {unknown} token @returns {Bulan | null} */
export function cariBulan(token) {
  const t = String(token || '').toLowerCase().replace(/\./g, '').trim();
  if (!t) return null;
  const kunci = BULAN[t] ? t : ALIAS_BULAN[t];
  return kunci ? BULAN[kunci] : null;
}

/** @param {number} index */
function bulanDariIndex(index) {
  return Object.values(BULAN).find((b) => b.index === index) ?? null;
}

/** @param {unknown} namaFile */
function tanpaEkstensi(namaFile) {
  return String(namaFile || '')
    .replace(/\.[A-Za-z0-9]{1,5}$/, '')
    .replace(/[‒–—―]/g, '-')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[•·*]+\s*/, '');
}

/** Buang pemisah di awal sisa teks + keterangan jam kamera/WhatsApp. @param {unknown} sisa */
function bersihkanKegiatan(sisa) {
  return String(sisa || '')
    .replace(/^[\s_\-–—|.,:;()[\]]+/, '')
    .replace(/^(?:at|jam|pukul)\s+\d{1,2}[.:]\d{2}(?:[.:]\d{2})?\s*[-_ ]*/i, '')
    .replace(/^\d{6}\s*[-_ ]+/, '')
    .replace(/^[\s_\-–—|.,:;()[\]]+/, '')
    .replace(/_/g, ' ')
    .replace(/\s*\((?:copy\s*)?\d+\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s_|.,:;()[\]]+$/, '');
}

/**
 * @typedef {{
 *   ok: boolean,
 *   tglAwal?: number | null,
 *   tglAkhir?: number | null,
 *   bulan?: string,
 *   bulanIndex?: number,
 *   tahun?: number | null,
 *   kegiatanRaw: string,
 *   alasan: string,
 * }} HasilParse
 */

/**
 * @param {{ tglAwal: number, tglAkhir: number | null, bulan: Bulan, tahun: number | null, sisa: string }} p
 * @returns {HasilParse}
 */
function tanggalHasil({ tglAwal, tglAkhir, bulan, tahun, sisa }) {
  const akhir = tglAkhir || tglAwal;
  const maks = MAKS_HARI[bulan.index - 1];
  if (tglAwal < 1 || tglAwal > maks || akhir < 1 || akhir > maks) {
    return { ok: false, alasan: 'Tanggal di luar rentang valid', kegiatanRaw: bersihkanKegiatan(sisa) };
  }
  if (akhir < tglAwal) {
    return { ok: false, alasan: 'Tanggal selesai lebih awal dari tanggal mulai', kegiatanRaw: bersihkanKegiatan(sisa) };
  }
  const kegiatanRaw = bersihkanKegiatan(sisa);
  return {
    ok: !!kegiatanRaw,
    tglAwal,
    tglAkhir: akhir,
    bulan: bulan.nama,
    bulanIndex: bulan.index,
    tahun: tahun || null,
    kegiatanRaw,
    alasan: kegiatanRaw ? '' : 'Kegiatan kosong setelah tanggal — tulis kegiatan manual',
  };
}

/** @param {string} teks @returns {HasilParse | null} */
function cariTanggal(teks) {
  // 1. Rentang lintas bulan: "30 September-2 Oktober_kegiatan".
  const lintas = teks.match(/(\d{1,2})\s*(?:\.\s*)?([A-Za-z]+)\s*(?:-|s\.?\s?d\.?|s\/d|sampai(?:\s+dengan)?|hingga)\s*(\d{1,2})\s+([A-Za-z]+)\s*(?:(\d{4}))?/i);
  if (lintas && lintas.index !== undefined) {
    const bAwal = cariBulan(lintas[2]);
    const bAkhir = cariBulan(lintas[4]);
    if (bAwal && bAkhir && bAwal.index !== bAkhir.index) {
      const tglAwal = parseInt(lintas[1], 10);
      if (tglAwal >= 1 && tglAwal <= MAKS_HARI[bAwal.index - 1]) {
        return {
          ok: false,
          tglAwal,
          tglAkhir: null,
          bulan: bAwal.nama,
          bulanIndex: bAwal.index,
          tahun: lintas[5] ? parseInt(lintas[5], 10) : null,
          kegiatanRaw: bersihkanKegiatan(teks.slice(lintas.index + lintas[0].length)),
          alasan: 'Rentang lintas bulan — tanggal selesai isi manual',
        };
      }
    }
  }

  // 2. Tanggal dengan nama bulan (boleh rentang dalam bulan yang sama), di mana saja.
  const polaNamaBulan = /(?<!\d)(\d{1,2})\s*(?:\.\s*)?(?:(?:-|s\.?\s?d\.?|s\/d|sampai(?:\s+dengan)?|hingga)\s*(\d{1,2}))?\s*[._\-/]?\s*([A-Za-z]+)\s*(?:(\d{4}))?/gi;
  for (const m of teks.matchAll(polaNamaBulan)) {
    const bulan = cariBulan(m[3]);
    if (!bulan || m.index === undefined) continue;
    return tanggalHasil({
      tglAwal: parseInt(m[1], 10),
      tglAkhir: m[2] ? parseInt(m[2], 10) : null,
      bulan,
      tahun: m[4] ? parseInt(m[4], 10) : null,
      sisa: teks.slice(m.index + m[0].length),
    });
  }

  // 3. Tanggal angka: 2026-10-21 / 21-10-2026 / 21.10.2026 / 21/10/2026.
  const angka = teks.match(/(?<!\d)(\d{4})[._/-](\d{1,2})[._/-](\d{1,2})(?!\d)/)
    || teks.match(/(?<!\d)(\d{1,2})[._/-](\d{1,2})[._/-](\d{4})(?!\d)/);
  if (angka && angka.index !== undefined) {
    let th; let bl; let tg;
    if (angka[1].length === 4) { th = +angka[1]; bl = +angka[2]; tg = +angka[3]; }
    else { tg = +angka[1]; bl = +angka[2]; th = +angka[3]; }
    const bulan = bulanDariIndex(bl);
    if (bulan) {
      return tanggalHasil({ tglAwal: tg, tglAkhir: null, bulan, tahun: th, sisa: teks.slice(angka.index + angka[0].length) });
    }
  }

  // 4. Tanggal angka tanpa tahun: "01-10_kegiatan" / "1.10 - kegiatan".
  const pendek = teks.match(/(?<!\d)(\d{1,2})[./-](\d{1,2})(?![./-]?\d)(?!\d)/);
  if (pendek && pendek.index !== undefined) {
    const tg = +pendek[1];
    const bulan = bulanDariIndex(+pendek[2]);
    if (bulan && tg >= 1 && tg <= MAKS_HARI[bulan.index - 1]) {
      return tanggalHasil({ tglAwal: tg, tglAkhir: null, bulan, tahun: null, sisa: teks.slice(pendek.index + pendek[0].length) });
    }
  }

  // 5. Nama kamera/WhatsApp: "IMG_20261021_103000_kegiatan".
  const kamera = teks.match(/(?<!\d)(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(?!\d)/);
  if (kamera && kamera.index !== undefined) {
    const bulan = bulanDariIndex(+kamera[2]);
    if (bulan) {
      return tanggalHasil({ tglAwal: +kamera[3], tglAkhir: null, bulan, tahun: +kamera[1], sisa: teks.slice(kamera.index + kamera[0].length) });
    }
  }

  return null;
}

/** @param {unknown} namaFile @returns {HasilParse} */
export function parseFileName(namaFile) {
  const teks = tanpaEkstensi(namaFile);
  if (!teks) return { ok: false, alasan: 'Nama file kosong', kegiatanRaw: '' };
  const hasil = cariTanggal(teks);
  if (hasil) return hasil;
  return {
    ok: false,
    alasan: 'Tanggal tidak terbaca dari nama file (contoh benar: "21 September_kegiatan")',
    kegiatanRaw: teks,
  };
}

/** @typedef {{ singkatan: string, ekspansi: string }} EntriKamus */

/**
 * Kembangkan singkatan kata utuh (case-insensitive) memakai kamus.
 * Aturan terpanjang dulu; dilewati bila ekspansinya sudah ada di teks.
 * @param {unknown} teks
 * @param {EntriKamus[] | null | undefined} kamus
 */
export function expandKegiatan(teks, kamus) {
  let hasil = String(teks || '');
  const daftar = [...(kamus || [])]
    .filter((e) => e && e.singkatan && e.ekspansi)
    .sort((a, b) => b.singkatan.length - a.singkatan.length);

  for (const { singkatan, ekspansi } of daftar) {
    if (hasil.toLowerCase().includes(ekspansi.toLowerCase())) continue;
    // "pelayanan PST" -> langsung ekspansi (hindari "pelayanan Pelayanan ...").
    const kataPertama = ekspansi.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
    if (kataPertama) {
      const reDobel = new RegExp(`\\b${escapeRegExp(kataPertama)}\\s+${escapeRegExp(singkatan)}\\b`, 'gi');
      hasil = hasil.replace(reDobel, ekspansi);
      if (hasil.toLowerCase().includes(ekspansi.toLowerCase())) continue;
    }
    hasil = hasil.replace(new RegExp(`\\b${escapeRegExp(singkatan)}\\b`, 'gi'), ekspansi);
  }
  return hasil.replace(/\s+/g, ' ').trim();
}
