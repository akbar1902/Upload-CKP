import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CKP Digital - BPS Kab. Belitung',
    short_name: 'CKP Digital',
    description: 'Sistem Rekap Capaian Kinerja Pegawai BPS Kabupaten Belitung',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0071E3',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
