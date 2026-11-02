import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchAllRows } from '@/lib/supabase/read';

/**
 * Data rekap monitoring CKP (dipakai halaman /monitoring).
 *
 * Query dijalankan lewat klien service-role di server agar SEMUA peran bisa
 * melihat rekap seluruh pegawai — RLS `ckp_uploads` hanya membuka baris milik
 * sendiri untuk anggota, sehingga query langsung dari browser akan tampak
 * "cuma 1 pegawai". Hak menilai/menyetujui tetap dijaga di UI & server action.
 */

export interface MonitoringRekapUser {
  id: string;
  email: string | null;
  full_name: string;
  nip: string | null;
  role: string;
  unit_kerja: string | null;
  is_active: boolean;
}

export interface MonitoringRekapUpload {
  id: string;
  user_id: string;
  bulan: number | string;
  tahun: number;
  status: string;
  total_entries: number | null;
  avg_progres: number | null;
  rata_rata_nilai: number | null;
  uploaded_at: string | null;
  version?: number | null;
  user: MonitoringRekapUser | null;
}

export interface MonitoringRekapData {
  uploads: MonitoringRekapUpload[];
  users: MonitoringRekapUser[];
}

/** Hanya admin & pimpinan yang boleh melihat nilai (skor SKP). */
export function canViewMonitoringScores(role: string | null | undefined): boolean {
  return role === 'pimpinan' || role === 'admin';
}

/**
 * Buang nilai dari payload untuk peran yang tidak berhak. Menyembunyikan di
 * UI saja tidak cukup — data tetap terkirim ke browser.
 */
export function stripMonitoringScores(data: MonitoringRekapData): MonitoringRekapData {
  return {
    users: data.users,
    uploads: data.uploads.map((upload) => ({ ...upload, rata_rata_nilai: null })),
  };
}

const TRIWULAN_MAP: Record<string, number[]> = {
  T1: [1, 2, 3],
  T2: [4, 5, 6],
  T3: [7, 8, 9],
  T4: [10, 11, 12],
};

type RawUserRow = Omit<MonitoringRekapUser, 'unit_kerja'> & {
  unit_kerja: string | null;
  rk_ketua_tim_mapping?: { tim_kerja: string | null }[] | null;
};

export async function fetchMonitoringRekap(
  admin: SupabaseClient,
  bulan: number | string,
  tahun: number
): Promise<MonitoringRekapData> {
  const buildUploads = () => {
    let query = admin
      .from('ckp_uploads')
      .select('*, user:user_id(id, email, full_name, nip, role, unit_kerja, is_active)')
      .eq('tahun', tahun)
      .order('uploaded_at', { ascending: false });

    query =
      typeof bulan === 'string' && bulan.startsWith('T')
        ? query.in('bulan', TRIWULAN_MAP[bulan] ?? [])
        : query.eq('bulan', bulan);

    return query;
  };

  const [uploadsRaw, usersRaw] = await Promise.all([
    fetchAllRows<MonitoringRekapUpload>((from, to) =>
      buildUploads().order('id', { ascending: true }).range(from, to)
    ),
    fetchAllRows<RawUserRow>((from, to) =>
      admin
        .from('users')
        .select(
          'id, email, full_name, nip, role, unit_kerja, is_active, rk_ketua_tim_mapping!rk_ketua_tim_mapping_ketua_tim_id_fkey(tim_kerja)'
        )
        .in('role', ['anggota', 'ketua_tim'])
        .eq('is_active', true)
        .order('full_name')
        .range(from, to)
    ),
  ]);

  // unit_kerja: pakai tim kerja dari mapping RK bila ada (sama seperti
  // dashboard pimpinan), fallback ke kolom unit_kerja.
  const users: MonitoringRekapUser[] = usersRaw.map((u) => {
    const mappings = u.rk_ketua_tim_mapping ?? [];
    const timKerja = mappings.find((m) => m.tim_kerja)?.tim_kerja ?? null;
    return {
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      nip: u.nip,
      role: u.role,
      unit_kerja: timKerja || u.unit_kerja || null,
      is_active: u.is_active,
    };
  });

  return { uploads: uploadsRaw, users };
}
