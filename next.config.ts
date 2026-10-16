import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // Jangan precache aset berat yang tidak dipakai saat runtime. Aset ini
  // (~2,5 MB: ZIP logo, logo.png, dan folder PNG alternatif) dulu ikut
  // diunduh service worker pada kunjungan pertama sehingga buka web terasa
  // lambat. File-nya tetap bisa diakses lewat URL, hanya tidak di-precache.
  publicExcludes: [
    "!noprecache/**/*",
    "!**/*.zip",
    "!logo.png",
    "!Logo Website SIKAP*/**",
  ],
});

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Cache navigasi client (App Router). Default Next 15/16 untuk halaman
    // dinamis = 0 detik, sehingga SETIAP pindah menu memicu render server ulang
    // (terasa "loading"). Dengan nilai ini, RSC payload yang sudah pernah
    // dimuat dipakai ulang → pindah menu terasa instan.
    staleTimes: {
      dynamic: 600, // detik (10 menit)
      static: 600,
    },
  },
};

export default withPWA(nextConfig);
