/**
 * Usulan Rencana Kinerja (Sub-RK) untuk satu kegiatan.
 * Port dari CKP-App/src/rk-matcher.js (perilaku dan test sama).
 *
 * Strategi berlapis (yang atas menang):
 *   1. Kata kunci KUSTOM pegawai: nama file/kegiatan memuat kuncinya → RK itu.
 *   2. Aturan kata kunci bawaan (ATURAN).
 *   3. Skor kemiripan kata, dengan ambang agar tidak menebak asal.
 * Daftar RK yang dipakai = Sub-RK milik pegawai di SIKAP.
 */

import { escapeRegExp } from './parser.mjs';

/** @typedef {{ rk: string, kunci: string[] }} AturanKunci */

/** Urutan = prioritas. Nama RK dipetakan ke Sub-RK terdekat milik pegawai. */
export const ATURAN = [
  { kunci: ['kcda', 'kecamatan dalam angka'], rk: 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026' },
  { kunci: ['pst', 'pelayanan statistik terpadu'], rk: 'Terlaksananya Pelayanan Statistik Terpadu (PST)' },
  { kunci: ['susenas'], rk: 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026' },
  { kunci: ['apel'], rk: 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)' },
  { kunci: ['berakhlak'], rk: 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS' },
  { kunci: ['rapat'], rk: 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya' },
  { kunci: ['brs', 'inflasi', 'pdrb', 'rilis'], rk: 'Terlaksananya Kegiatan Statistik Harga Tahun 2026' },
  { kunci: ['latsar', 'klasikal'], rk: 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)' },
  { kunci: ['konferensi pers', 'rri', 'siaran'], rk: 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya' },
  { kunci: ['video', 'flyer', 'konten', 'publisitas'], rk: 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten' },
  { kunci: ['humas', 'kehumasan'], rk: 'Terlaksananya Kegiatan Pengembangan Kehumasan' },
  { kunci: ['cuti'], rk: 'Terlaksananya Pelaporan Cuti Pegawai' },
  { kunci: ['simpeg', 'kepegawaian'], rk: 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG' },
  { kunci: ['pengaduan'], rk: 'Terlaksananya Tugas Harian Pelayanan Pengaduan' },
  { kunci: ['skd', 'kebutuhan data'], rk: 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026' },
  { kunci: ['sakernas'], rk: 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026' },
  { kunci: ['seruti'], rk: 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026' },
  { kunci: ['statpolkam'], rk: 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026' },
  { kunci: ['podes', 'potensi desa'], rk: 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026' },
  { kunci: ['dtsen'], rk: 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026' },
  { kunci: ['snlik', 'literasi', 'inklusi keuangan'], rk: 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026' },
  { kunci: ['sbr', 'direktori usaha', 'profiling'], rk: 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)' },
  { kunci: ['desa cantik'], rk: 'Melaksanakan Pembinaan Desa Cantik Tahun 2026' },
  { kunci: ['pegawai teladan'], rk: 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026' },
  { kunci: ['mitra'], rk: 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026' },
  { kunci: ['sensus ekonomi', 'se2026', 'usaha besar', 'penyisiran', 'prelist', 'nik', 'kartu keluarga', 'pendataan'], rk: 'Terlaksananya Kegiatan Sensus Ekonomi 2026' },
  { kunci: ['peta', 'batching', 'koordinat', 'wilayah', 'sls', 'ground check', 'gc pln', 'mfd', 'mbs', 'msls', 'assignment', 'banr', 'fasih'], rk: 'Terlaksananya Pemutakhiran MFD, MBS, dan MSLS' },
  { kunci: ['sakip', 'lke', 'pekppp', 'penilaian mandiri'], rk: 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP' },
  { kunci: ['sikap', 'aplikasi'], rk: 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi' },
  { kunci: ['senam', 'jus ceri', 'pantai'], rk: 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung' },
];

const STOPWORDS = new Set([
  'terlaksananya', 'telaksananya', 'melaksanakan', 'kegiatan', 'dalam',
  'rangka', 'yang', 'dan', 'tahun', 'secara', 'terkait', 'dengan',
  'untuk', 'dari', 'pada', 'atau', 'di', 'ke', 'non',
]);

/** Skor minimum tebakan kemiripan. Aturan kata kunci selalu bernilai 1000. */
const AMBANG_SKOR = 10;

/**
 * Kata kunci dicocokkan pada batas huruf: "SE" cocok pada "SE 2026"/"SE2026",
 * tetapi tidak pada "Susenas"/"Kesejahteraan".
 * @param {string} lower @param {unknown} kunci
 */
function cocokKunci(lower, kunci) {
  const k = String(kunci || '').trim().toLowerCase();
  if (!k) return false;
  return new RegExp(`(?<![a-z])${escapeRegExp(k)}(?![a-z])`, 'i').test(lower);
}

/** @param {string} rk */
function tokenizeRK(rk) {
  return rk
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
}

/** @param {unknown} nama */
export function normalizeNamaRk(nama) {
  return String(nama || '')
    .toLowerCase()
    .replace(/\btahun\s*20\d{2}\b/g, '')
    .replace(/\b20\d{2}\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/** @param {string[]} daftar @returns {Map<string, string>} */
function buildRkIndex(daftar) {
  const index = new Map();
  for (const rk of daftar) {
    const kunci = normalizeNamaRk(rk);
    if (kunci && !index.has(kunci)) index.set(kunci, rk);
  }
  return index;
}

/**
 * Cari RK yang benar-benar ada di daftar (nama bisa berubah antar versi).
 * @param {unknown} kandidat @param {string[]} daftar @param {Map<string, string> | null} [index]
 * @returns {string | null}
 */
export function resolveRkName(kandidat, daftar, index = null) {
  const nama = String(kandidat || '').trim();
  if (!nama || !Array.isArray(daftar) || daftar.length === 0) return null;
  if (daftar.includes(nama)) return nama;

  const peta = index || buildRkIndex(daftar);
  const exact = peta.get(normalizeNamaRk(nama));
  if (exact) return exact;

  const tokenKandidat = new Set(tokenizeRK(nama));
  if (tokenKandidat.size === 0) return null;

  let terbaik = null;
  let skorTerbaik = 0;
  for (const rk of daftar) {
    const tokenRk = new Set(tokenizeRK(rk));
    if (tokenRk.size === 0) continue;
    let sama = 0;
    for (const t of tokenKandidat) if (tokenRk.has(t)) sama += 1;
    const cakupan = sama / tokenKandidat.size;
    if (cakupan < 0.5) continue;
    const skor = cakupan + (sama / tokenRk.size) * 0.25;
    if (skor > skorTerbaik) {
      skorTerbaik = skor;
      terbaik = rk;
    }
  }
  return terbaik;
}

/** @param {string} rk */
function singkatanDiRK(rk) {
  const hasil = [];
  const re = /\(([A-Za-z0-9]{2,})\)/g;
  let m;
  while ((m = re.exec(rk)) !== null) hasil.push(m[1]);
  return hasil;
}

/**
 * @param {unknown} teks nama file + kegiatan
 * @param {AturanKunci[] | null | undefined} aturanKustom
 * @param {string[]} daftar
 * @param {Map<string, string> | null} [index]
 * @returns {string | null}
 */
export function cariKunciKustom(teks, aturanKustom, daftar, index = null) {
  const lower = String(teks || '').toLowerCase();
  const peta = index || buildRkIndex(daftar);
  for (const aturan of Array.isArray(aturanKustom) ? aturanKustom : []) {
    if (!aturan || !aturan.rk) continue;
    const tujuan = resolveRkName(aturan.rk, daftar, peta);
    if (!tujuan) continue;
    const kunci = Array.isArray(aturan.kunci) ? aturan.kunci : [];
    if (kunci.some((k) => cocokKunci(lower, k))) return tujuan;
  }
  return null;
}

/**
 * @param {unknown} kegiatan
 * @param {string[]} rkList
 * @param {number} [topN]
 * @param {{ namaFile?: string, aturanKustom?: AturanKunci[] | null }} [opsi]
 * @returns {Array<{ rk: string, skor: number }>}
 */
export function suggestRK(kegiatan, rkList, topN = 3, opsi = {}) {
  const teksKegiatan = String(kegiatan || '');
  const lower = teksKegiatan.toLowerCase();
  const daftar = Array.isArray(rkList) ? rkList : [];
  const petaRk = buildRkIndex(daftar);
  const namaFile = String(opsi?.namaFile || '').toLowerCase();
  const teksKustom = namaFile ? `${namaFile} ${lower}` : lower;

  let bonusRK = cariKunciKustom(teksKustom, opsi?.aturanKustom, daftar, petaRk);

  if (!bonusRK) {
    for (const aturan of ATURAN) {
      if (!aturan.kunci.some((k) => cocokKunci(lower, k))) continue;
      const tujuan = resolveRkName(aturan.rk, daftar, petaRk);
      if (tujuan) {
        bonusRK = tujuan;
        break;
      }
    }
  }

  const scored = daftar.map((rk) => {
    let skor = 0;
    if (rk === bonusRK) skor += 1000;
    for (const token of tokenizeRK(rk)) {
      if (lower.includes(token)) skor += token.length;
    }
    for (const abbr of singkatanDiRK(rk)) {
      if (new RegExp(`\\b${escapeRegExp(abbr)}\\b`, 'i').test(teksKegiatan)) skor += 40;
    }
    return { rk, skor };
  });

  scored.sort((a, b) => b.skor - a.skor);
  return scored.filter((s) => s.skor >= AMBANG_SKOR).slice(0, topN);
}
