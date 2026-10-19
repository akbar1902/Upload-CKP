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
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
