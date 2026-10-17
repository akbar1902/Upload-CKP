#!/usr/bin/env node
/**
 * chunk-map.js — Peta isi chunk hasil build.
 *
 * Gunanya: mengetahui library berat (xlsx, jspdf, jszip, html-to-image,
 * framer-motion, dsb.) berada di chunk mana dan berapa ukurannya, tanpa perlu
 * bundle analyzer.
 *
 * Cara pakai:
 *   npm run build
 *   node scripts/chunk-map.js
 *
 * Cara membaca nama chunk Next:
 *   nama-<hash>.js  -> chunk SINKRON (ikut terunduh di awal)
 *   nama.<hash>.js  -> chunk ASYNC (lazy, baru diunduh saat dipakai)
 *
 * Kalau setelah di-lazy nama chunk berubah dari strip ke titik, berarti berhasil.
 *
 * PERINGATAN positif palsu: penanda berbasis string bisa cocok dengan kode Anda
 * sendiri (mis. modul yang memuat baris `await import('jspdf')`). Selalu periksa
 * konteks kemunculan sebelum menyimpulkan.
 */

const fs = require('fs');
const path = require('path');

const ROOT = '.next/static/chunks';

// Tambahkan penanda library lain sesuai kebutuhan proyek Anda.
const MARKER = {
  'xlsx (SheetJS)': ['SheetJS'],
  'jspdf': ['jsPDF'],
  'jspdf-autotable': ['jspdfAutoTable'],
  'jszip': ['JSZip'],
  'html-to-image': ['toPng'],
  'framer-motion': ['AnimatePresence', 'framerAppearId'],
  'supabase': ['GoTrueClient', 'PostgrestClient'],
  'react-query': ['QueryClient'],
  'lucide': ['createLucideIcon'],
  'sonner': ['sonner'],
  'date-fns': ['startOfDay', 'formatDistance'],
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.js')) out.push(p);
  }
  return out;
}

if (!fs.existsSync(ROOT)) {
  console.error(`Folder ${ROOT} tidak ditemukan. Jalankan "npm run build" lebih dulu.`);
  process.exit(1);
}

const rows = [];
for (const file of walk(ROOT)) {
  const src = fs.readFileSync(file, 'utf8');
  const hits = Object.entries(MARKER)
    .filter(([, needles]) => needles.some((n) => src.includes(n)))
    .map(([name]) => name);
  if (hits.length) {
    rows.push({ file: file.replace(/\\/g, '/'), kb: Math.round(fs.statSync(file).size / 1024), hits });
  }
}

rows.sort((a, b) => b.kb - a.kb);

console.log('\nLibrary berat per chunk (urut dari terbesar):\n');
for (const r of rows) {
  const kind = /\/[^/]+\.[0-9a-f]{6,}\.js$/.test(r.file) ? 'ASYNC (lazy)' : 'SINKRON (awal)';
  console.log(`${String(r.kb).padStart(5)} KB  [${kind.padEnd(13)}] ${r.file.replace(ROOT + '/', '')}`);
  console.log(`           -> ${r.hits.join(', ')}`);
}
console.log(`\nTotal chunk dipindai: ${walk(ROOT).length}\n`);
