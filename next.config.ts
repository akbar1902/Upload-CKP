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
  workboxOptions: {
    // PENTING: jangan precache seluruh aset build (~3,45 MB — chunk untuk
    // SEMUA rute, termasuk halaman yang belum pernah dibuka) pada kunjungan
    // pertama. Dulu service worker mengunduh semuanya di latar dan berebut
    // bandwidth tepat saat web baru dibuka.
    // Chunk JS/CSS/font tetap tercache otomatis begitu dipakai lewat
    // runtimeCaching bawaan plugin (next-static-js-assets, static-style-assets,
    // static-font-assets), jadi kunjungan berikutnya tetap instan.
    manifestTransforms: [
      (entries: Array<{ url: string; revision: string | null; size: number }>) => ({
        manifest: entries.filter((entry) => !entry.url.startsWith("/_next/static/")),
        warnings: [] as string[],
      }),
    ],
    runtimeCaching: [
      {
        // Panggilan API lintas-origin (Supabase) TIDAK boleh lewat NetworkFirst
        // bawaan plugin: itu menambah satu lapisan service worker pada setiap
        // query dan berisiko menyajikan respons lama dari cache. Teruskan
        // langsung ke jaringan (tanpa cache). Nama cache "cross-origin"
        // menimpa aturan bawaan.
        urlPattern: ({ sameOrigin }: { sameOrigin: boolean }) => !sameOrigin,
        handler: "NetworkOnly",
        options: { cacheName: "cross-origin" },
      },
    ],
  },
  // Tambahkan aturan runtimeCaching di atas TANPA membuang aturan bawaan plugin.
  extendDefaultRuntimeCaching: true,
});

const nextConfig: NextConfig = {
  // React Compiler: mengoptimalkan render komponen otomatis (mengurangi
  // re-render tanpa perlu banyak useMemo/useCallback manual).
  // Bila suatu saat terasa ada perilaku aneh, cukup ubah menjadi `false`.
  reactCompiler: true,
  // Tautan diperiksa tipe saat build — salah ketik href langsung ketahuan.
  typedRoutes: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // View Transitions bawaan browser untuk perpindahan halaman.
    viewTransition: true,
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
