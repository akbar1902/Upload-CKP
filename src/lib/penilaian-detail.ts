import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchAllRows } from '@/lib/supabase/read';
import { filterEntriesByOwnRk, rkMappingOwnerFilter } from '@/lib/rk-scoring';
import type { CKPUpload, CKPEntry, Approval, User } from '@/types/database';

/**
 * Data halaman detail/penilaian CKP.
 *
 * Dipakai bersama oleh server page (prefetch) dan server action (mode
 * Monitoring CKP). Dengan klien service-role, SEMUA baris kegiatan terbaca —
 * RLS `ckp_entries` membatasi ketua tim ke RK miliknya dan menutup rapat
 * upload pegawai lain, sehingga tanpa ini detail dari menu monitoring hanya
 * menampilkan sebagian RK atau gagal total.
 */

const TRIWULAN_MAP: Record<string, number[]> = {
  T1: [1, 2, 3],
  T2: [4, 5, 6],
  T3: [7, 8, 9],
  T4: [10, 11, 12],
};

export interface PenilaianMasterRk {
  id: string;
  rencana_kinerja: string;
  tim_kerja: string | null;
}

export interface PenilaianDetailData {
  upload: CKPUpload;
  employee: User;
  entries: CKPEntry[];
  calendarEntries: CKPEntry[];
  approvals: Approval[];
  masterRks: PenilaianMasterRk[];
  targetUploadIds: string[];
}

export interface PenilaianDetailOptions {
  paramBulan?: string;
  paramTahun?: string;
  source?: string;
  viewer?: { id: string; role: string | null | undefined };
  /** Buang nilai/skor dari payload (peran tanpa hak melihat nilai). */
  stripScores?: boolean;
}

export async function fetchPenilaianDetail(
  supabase: SupabaseClient,
  uploadId: string,
  options: PenilaianDetailOptions = {}
): Promise<PenilaianDetailData> {
  const { paramBulan, paramTahun, source, viewer, stripScores = false } = options;
  const isTriwulan = typeof paramBulan === 'string' && paramBulan.startsWith('T');

  const { data: uploadRaw, error: uploadError } = await supabase
    .from('ckp_uploads')
    .select('*')
    .eq('id', uploadId)
    .single();
  if (uploadError) throw new Error(uploadError.message);
  if (!uploadRaw) throw new Error('Upload tidak ditemukan');

  const uploadData = uploadRaw as CKPUpload;
  let targetUploads: CKPUpload[] = [uploadData];
  let targetUploadIds: string[] = [uploadId];
  const targetYear = paramTahun ? parseInt(paramTahun, 10) : uploadData.tahun;

  if (isTriwulan) {
    const targetMonths = TRIWULAN_MAP[paramBulan!] ?? [];
    const { data: qUploads } = await supabase
      .from('ckp_uploads')
      .select('*')
      .eq('user_id', uploadData.user_id)
      .eq('tahun', targetYear)
      .in('bulan', targetMonths)
      .order('bulan', { ascending: true });

    if (qUploads && qUploads.length > 0) {
      targetUploads = qUploads as CKPUpload[];
      targetUploadIds = targetUploads.map((u) => u.id);
    }
  }

  const [employeeRes, entriesRows, approvalsRows, masterRkRes] = await Promise.all([
    supabase.from('users').select('*').eq('id', uploadData.user_id).single(),
    fetchAllRows<CKPEntry>((from, to) =>
      supabase
        .from('ckp_entries')
        .select('*')
        .in('upload_id', targetUploadIds)
        .order('row_number')
        .range(from, to)
    ),
    fetchAllRows<Approval>((from, to) =>
      supabase
        .from('approvals')
        .select('*, reviewer:reviewer_id(id, full_name)')
        .in('upload_id', targetUploadIds)
        .order('created_at', { ascending: false })
        .range(from, to)
    ),
    supabase
      .from('rk_ketua_tim_mapping')
      .select('id, rencana_kinerja, tim_kerja')
      .eq('is_active', true)
      .order('rencana_kinerja'),
  ]);

  const uploadMonthMap = new Map(targetUploads.map((u) => [u.id, u.bulan]));
  const rawEntries = entriesRows.map((e) => ({
    ...e,
    bulan: uploadMonthMap.get(e.upload_id) ?? uploadData.bulan,
  })) as CKPEntry[];
  const employeeData = employeeRes.data as User;

  // Pimpinan yang membuka CKP ketua tim dari dashboard ketua tim hanya
  // menilai RK miliknya sendiri (perilaku lama, tidak berlaku di monitoring).
  let entriesData = rawEntries;
  if (source === 'ketua_tim' && viewer?.role === 'pimpinan' && employeeData?.role === 'ketua_tim') {
    const { data: rkMapping } = await supabase
      .from('rk_ketua_tim_mapping')
      .select('id, rencana_kinerja')
      .or(rkMappingOwnerFilter(employeeData.id, viewer.id))
      .eq('is_active', true);
    entriesData = filterEntriesByOwnRk(entriesData, rkMapping);
  }

  let finalUpload = uploadData;
  if (isTriwulan) {
    const totalEntries = entriesData.length;
    const avgProgres =
      targetUploads.reduce((sum, u) => sum + (u.avg_progres || 0), 0) / targetUploads.length;
    const scoredUploads = targetUploads.filter(
      (u) => u.rata_rata_nilai !== null && u.rata_rata_nilai !== undefined
    );
    const avgScore =
      scoredUploads.length > 0
        ? scoredUploads.reduce((sum, u) => sum + (u.rata_rata_nilai || 0), 0) /
          scoredUploads.length
        : null;

    let aggregatedStatus = targetUploads[targetUploads.length - 1].status;
    if (targetUploads.some((u) => u.status === 'revision_required')) {
      aggregatedStatus = 'revision_required';
    } else if (targetUploads.some((u) => u.status === 'submitted')) {
      aggregatedStatus = 'submitted';
    } else if (targetUploads.some((u) => u.status === 'scored')) {
      aggregatedStatus = 'scored';
    } else if (targetUploads.every((u) => u.status === 'approved')) {
      aggregatedStatus = 'approved';
    }

    finalUpload = {
      ...targetUploads[targetUploads.length - 1],
      id: uploadId,
      bulan: paramBulan as unknown as CKPUpload['bulan'],
      tahun: targetYear,
      total_entries: totalEntries,
      avg_progres: avgProgres,
      rata_rata_nilai: avgScore,
      status: aggregatedStatus,
    };
  }

  const result: PenilaianDetailData = {
    upload: finalUpload,
    employee: employeeData,
    entries: entriesData,
    calendarEntries: rawEntries,
    approvals: approvalsRows,
    masterRks: (masterRkRes.data ?? []) as PenilaianMasterRk[],
    targetUploadIds,
  };

  if (!stripScores) return result;

  // Peran tanpa hak melihat nilai: buang dari payload, bukan hanya di UI.
  return {
    ...result,
    upload: { ...result.upload, rata_rata_nilai: null },
    entries: result.entries.map((e) => ({ ...e, nilai: null, dinilai_oleh: null })),
    calendarEntries: result.calendarEntries.map((e) => ({ ...e, nilai: null, dinilai_oleh: null })),
  };
}
