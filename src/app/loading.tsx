import { PageSkeleton } from '@/components/ui/page-skeleton';

/**
 * Loading boundary tingkat akar.
 *
 * Next App Router memakai file ini sebagai Suspense boundary untuk semua rute
 * yang tidak punya `loading.tsx` sendiri, sehingga kerangka halaman langsung
 * muncul saat berpindah rute (streaming), bukan layar kosong.
 */
export default function RootLoading() {
  return <PageSkeleton variant="dashboard" />;
}
