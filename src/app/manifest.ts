import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SIKAP - BPS Kab. Belitung',
    short_name: 'SIKAP',
    description: 'Sistem Rekap Capaian Kinerja Pegawai BPS Kabupaten Belitung',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F6F4',
    theme_color: '#0B2A24',
    // Nama file ikon diberi nama baru (bukan icon-192/512) supaya cache
    // browser & service worker lama tidak menyajikan logo lama.
    icons: [
      { src: '/icons/sikap-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/sikap-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/sikap-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/sikap-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
