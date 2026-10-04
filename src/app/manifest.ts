import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SIKAP - BPS Kab. Belitung',
    short_name: 'SIKAP',
    description: 'Sistem Rekap Capaian Kinerja Pegawai BPS Kabupaten Belitung',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F6EE',
    theme_color: '#0F766E',
    icons: [
      {
        src: '/logo-sikap.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-sikap.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
