"use server";

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { User } from '@/types/database';

export interface PendingScoringKetuaTim {
  ketuaTim: {
    id: string;
    full_name: string;
    nip: string | null;
  };
  totalPendingKegiatan: number;
  pegawaiDetails: {
    id: string;
    full_name: string;
    nip: string | null;
    unit_kerja: string | null;
    pendingKegiatanCount: number;
    kegiatanNames: string[];
  }[];
}

export async function getPendingScoringKetuaTim(
  bulan: number,
  tahun: number
): Promise<{ data: PendingScoringKetuaTim[] | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Ambil upload yang berstatus submitted
    const { data: uploads, error: uploadErr } = await supabase
      .from('ckp_uploads')
      .select(`
        id, 
        user_id,
        user:user_id(id, full_name, nip, unit_kerja)
      `)
      .eq('bulan', bulan)
      .eq('tahun', tahun)
      .eq('status', 'submitted');

    if (uploadErr) throw uploadErr;
    if (!uploads || uploads.length === 0) return { data: [], error: null };

    const uploadIds = uploads.map((u) => u.id);

    // 2. Ambil entri yang nilai-nya null
    const { data: entries, error: entriesErr } = await supabase
      .from('ckp_entries')
      .select('id, upload_id, rencana_kinerja, kegiatan')
      .in('upload_id', uploadIds)
      .is('nilai', null);

    if (entriesErr) throw entriesErr;
    if (!entries || entries.length === 0) return { data: [], error: null };

    // 3. Ambil mapping RK ke Ketua Tim
    // Kita ambil semua RK karena jumlahnya tidak terlalu banyak, 
    // atau gunakan in() jika supabase mendukung array of strings (bisa panjang)
    const uniqueRk = Array.from(new Set(entries.map((e) => e.rencana_kinerja).filter(Boolean))) as string[];
    
    if (uniqueRk.length === 0) return { data: [], error: null };

    const { data: rkMappings, error: rkErr } = await supabase
      .from('rk_ketua_tim_mapping')
      .select('rencana_kinerja, ketua_tim_id')
      .in('rencana_kinerja', uniqueRk);

    if (rkErr) throw rkErr;

    // Filter yang punya ketua tim
    const validMappings = (rkMappings || []).filter(m => m.ketua_tim_id);
    if (validMappings.length === 0) return { data: [], error: null };

    const ketuaTimIds = Array.from(new Set(validMappings.map(m => m.ketua_tim_id))) as string[];

    // 4. Ambil data User untuk Ketua Tim
    const { data: ketuaTimUsers, error: ktErr } = await supabase
      .from('users')
      .select('id, full_name, nip')
      .in('id', ketuaTimIds);

    if (ktErr) throw ktErr;

    // Build Map RK -> Ketua Tim ID
    const rkToKetuaTim = new Map<string, string>();
    validMappings.forEach(m => rkToKetuaTim.set(m.rencana_kinerja, m.ketua_tim_id!));

    // Build Map Upload ID -> User (Pegawai)
    const uploadToUser = new Map<string, any>();
    uploads.forEach(u => uploadToUser.set(u.id, u.user));

    // Grouping
    const resultGroup = new Map<string, PendingScoringKetuaTim>();

    entries.forEach(entry => {
      const ktId = rkToKetuaTim.get(entry.rencana_kinerja || '');
      if (!ktId) return; // Bukan wewenang ketua tim (atau belum di-map)

      const ktUser = ketuaTimUsers?.find(u => u.id === ktId);
      if (!ktUser) return;

      const pegawai = uploadToUser.get(entry.upload_id);
      if (!pegawai) return; // Should not happen, but safeguard

      if (!resultGroup.has(ktId)) {
        resultGroup.set(ktId, {
          ketuaTim: ktUser,
          totalPendingKegiatan: 0,
          pegawaiDetails: [],
        });
      }

      const ktGroup = resultGroup.get(ktId)!;
      ktGroup.totalPendingKegiatan++;

      let pegDetail = ktGroup.pegawaiDetails.find(p => p.id === pegawai.id);
      if (!pegDetail) {
        pegDetail = {
          id: pegawai.id,
          full_name: pegawai.full_name,
          nip: pegawai.nip,
          unit_kerja: pegawai.unit_kerja,
          pendingKegiatanCount: 0,
          kegiatanNames: [],
        };
        ktGroup.pegawaiDetails.push(pegDetail);
      }

      pegDetail.pendingKegiatanCount++;
      if (entry.kegiatan) {
        pegDetail.kegiatanNames.push(entry.kegiatan);
      }
    });

    // Convert map to array and sort by pending count descending
    const finalData = Array.from(resultGroup.values()).sort((a, b) => b.totalPendingKegiatan - a.totalPendingKegiatan);

    return { data: finalData, error: null };
  } catch (err: any) {
    console.error('getPendingScoringKetuaTim Error:', err);
    return { data: null, error: err.message || 'Terjadi kesalahan saat mengambil data' };
  }
}
