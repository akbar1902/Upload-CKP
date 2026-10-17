#!/usr/bin/env node
/**
 * sw-size.js — Menghitung berapa besar data yang akan diunduh service worker
 * pada kunjungan PERTAMA.
 *
 * Latar belakang: banyak konfigurasi PWA (mis. next-pwa bawaan) mem-precache
 * SELURUH aset build, termasuk chunk untuk rute yang belum tentu dibuka.
 * Di SIKAP ini sempat mencapai 3,58 MB dan membuat buka-pertama terasa berat.
 *
 * Cara pakai:
 *   npm run build
 *   node scripts/sw-size.js
 *
 * Target: jauh di bawah 1 MB.
 */

const fs = require('fs');
const path = require('path');

const SW = path.join('public', 'sw.js');

if (!fs.existsSync(SW)) {
  console.error('public/sw.js tidak ditemukan. Jalankan "npm run build" lebih dulu.');
  process.exit(1);
}

const sw = fs.readFileSync(SW, 'utf8');
const match =
  sw.match(/precacheAndRoute\(\[(.*?)\]\)/s) || sw.match(/precacheAndRoute\(\[(.*?)\],/s);
const body = match ? match[1] : '';
const urls = [...body.matchAll(/url:"([^"]+)"/g)].map((m) => m[1]);

let total = 0;
let totalBuild = 0;
const missing = [];

for (const url of urls) {
  const local = url.startsWith('/_next/')
    ? path.join('.next', url.slice('/_next/'.length))
    : path.join('public', url.replace(/^\//, ''));
  try {
    const size = fs.statSync(local).size;
    total += size;
    if (url.startsWith('/_next/')) totalBuild += size;
  } catch {
    missing.push(url); // entri ber-%5B (dynamic route) tidak ada sebagai file
  }
}

const mb = (n) => (n / 1048576).toFixed(2) + ' MB';
const kb = (n) => Math.round(n / 1024) + ' KB';

console.log('\n=== Analisa precache service worker ===\n');
console.log(`Entri precache        : ${urls.length}`);
console.log(`Total akan diunduh    : ${mb(total)}`);
console.log(`  dari aset build     : ${mb(totalBuild)}`);
console.log(`  dari folder public  : ${kb(total - totalBuild)}`);

const terbesar = urls
  .map((url) => {
    const local = url.startsWith('/_next/')
      ? path.join('.next', url.slice('/_next/'.length))
      : path.join('public', url.replace(/^\//, ''));
    try {
      return { url, size: fs.statSync(local).size };
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .sort((a, b) => b.size - a.size)
  .slice(0, 10);

console.log('\n10 entri terbesar:');
for (const e of terbesar) console.log(`  ${String(Math.round(e.size / 1024)).padStart(6)} KB  ${e.url}`);

if (totalBuild > 1024 * 1024) {
  console.log(
    '\n⚠️  Aset build > 1 MB ikut di-precache. Pertimbangkan menyaring `/_next/static/`\n' +
      '    lewat `workboxOptions.manifestTransforms` (lihat PLAYBOOK_PERFORMA.md Bab 5.1).'
  );
}
console.log('');
