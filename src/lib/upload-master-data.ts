import { getUploadMasterData } from '@/app/actions/ckp';
import { withTimeoutRetry } from '@/lib/supabase/read';

export type UploadMasterData = Awaited<ReturnType<typeof getUploadMasterData>>;

/** Kunci cache tunggal untuk master data upload (dipakai sidebar & halaman upload). */
export const uploadMasterDataQueryKey = ['upload-master-data'] as const;

/**
 * SUMBER TUNGGAL master data upload. WAJIB dipakai oleh sidebar (prefetch)
 * maupun halaman upload supaya bentuk objeknya identik.
 *
 * Dulu sidebar menulis cache `['upload-master-data']` TANPA `masterKegiatan`.
 * RK seperti "rapat humas" dikenali lewat `masterKegiatan` (hasil mapping
 * upload sebelumnya), bukan sebagai parent RK. Selama cache masih fresh
 * prefetch tidak menimpa; tapi setelah cache kadaluarsa (mis. tab idle lama),
 * prefetch menimpa cache dengan objek tanpa `masterKegiatan` — sehingga RK
 * yang seharusnya dikenal jadi dianggap "tak dikenal" lagi.
 *
 * Memakai `withTimeoutRetry` (client baru + timeout + retry) agar fetch tidak
 * menggantung pasca-idle dan error tidak berubah menjadi data kosong.
 */
export function fetchUploadMasterData(): Promise<UploadMasterData> {
  return withTimeoutRetry(
    () => getUploadMasterData(),
    { attempts: 3, timeoutMs: 10000 }
  );
}
