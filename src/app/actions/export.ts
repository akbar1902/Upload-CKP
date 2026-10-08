'use server';

import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { fetchAllRows } from '@/lib/supabase/read';

export interface PimpinanInfo {
  nama: string;
  nip: string;
  pangkatGolongan: string;
  jabatan: string;
  unitKerja: string;
}

export interface ExportPegawaiUpload {
  id: string;
  user_id: string;
  bulan: number;
  tahun: number;
  status: string;
  version: number;
  total_entries: number;
  avg_progres: number;
  rata_rata_nilai: number | null;
  uploaded_at: string;
  approved_at: string | null;
  user: {
    id: string;
    full_name: string;
    nip: string | null;
    unit_kerja: string | null;
    role: string;
  };
  profile: {
    jabatan: string | null;
    golongan: string | null;
  } | null;
}

/** Baris upload (join user) yang dikembalikan Supabase. */
interface UploadRow {
  id: string;
  user_id: string;
  bulan: number;
  tahun: number;
  status: string;
  version: number;
  total_entries: number;
  avg_progres: number;
  rata_rata_nilai: number | null;
  uploaded_at: string;
  approved_at: string | null;
  user: ExportPegawaiUpload['user'] | null;
}

interface ProfileRow {
  user_id: string;
  jabatan: string | null;
  golongan: string | null;
}

interface UserRow {
  id: string;
  full_name: string;
  nip: string | null;
  unit_kerja: string | null;
  role: string;
}

/**
 * Ambil identitas pemanggil dari sesi + role dari DB.
 * Melempar error bila belum login — service role TIDAK boleh dipakai tanpa ini.
 */
async function getCaller(): Promise<{ userId: string; role: string }> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Sesi berakhir');
  const { data: me } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (!me?.role) throw new Error('Akun tidak ditemukan');
  return { userId: user.id, role: me.role as string };
}

function isPimpinanOrAdmin(role: string): boolean {
  return role === 'pimpinan' || role === 'admin';
}

export async function getExportPenilaianData(bulan: number, tahun: number, targetUserId?: string) {
  // ── Otorisasi (SEBELUM service role) ──────────────────────────────
  // Pimpinan/admin bebas; anggota/ketua_tim hanya boleh target dirinya
  // sendiri (dipakai /pegawai/evaluasi-penilaian). Tanpa target → tolak.
  const caller = await getCaller();
  const privileged = isPimpinanOrAdmin(caller.role);
  if (!privileged) {
    if (!targetUserId || targetUserId !== caller.userId) {
      throw new Error('Anda tidak berwenang mengakses data evaluasi pegawai lain.');
    }
  }
  const effectiveTargetUserId = privileged ? targetUserId : caller.userId;

  try {
    const supabaseAdmin = createAdminClient();

    // 1. Get Pimpinan info from database or default
    const { data: pimpinanUser } = await supabaseAdmin
      .from('users')
      .select('id, full_name, nip, unit_kerja, role')
      .eq('role', 'pimpinan')
      .maybeSingle();

    const { data: pimpinanProfile } = pimpinanUser
      ? await supabaseAdmin
          .from('employee_profiles')
          .select('jabatan, golongan')
          .eq('user_id', pimpinanUser.id)
          .maybeSingle()
      : { data: null };

    const pimpinan: PimpinanInfo = {
      nama: pimpinanUser?.full_name || 'Baiq Kurniawati, SST, M.Ak',
      nip: pimpinanUser?.nip || '197805052000122001',
      pangkatGolongan: pimpinanProfile?.golongan || 'Pembina Tk. I / IV/b',
      jabatan: pimpinanProfile?.jabatan || 'Kepala BPS Kabupaten Belitung',
      unitKerja: pimpinanUser?.unit_kerja || 'BPS Kabupaten Belitung',
    };

    // 2. Get uploads in this period (paginasi penuh)
    const buildUploadsQuery = () => {
      let q = supabaseAdmin
        .from('ckp_uploads')
        .select(`
          id,
          user_id,
          bulan,
          tahun,
          status,
          version,
          total_entries,
          avg_progres,
          rata_rata_nilai,
          uploaded_at,
          approved_at,
          user:user_id(id, full_name, nip, unit_kerja, role)
        `)
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .neq('status', 'superseded');
      if (effectiveTargetUserId) {
        q = q.eq('user_id', effectiveTargetUserId);
      }
      return q;
    };

    const uploadsRaw = await fetchAllRows<Record<string, unknown>>((from, to) =>
      buildUploadsQuery()
        .order('uploaded_at', { ascending: false })
        .order('id', { ascending: true })
        .range(from, to)
    );
    const uploads = uploadsRaw as unknown as UploadRow[];

    // Filter to only the latest version per user
    const latestUploadsMap = new Map<string, UploadRow>();
    uploads.forEach((u) => {
      const current = latestUploadsMap.get(u.user_id);
      if (!current || u.version > current.version) {
        latestUploadsMap.set(u.user_id, u);
      }
    });

    const activeUploads = Array.from(latestUploadsMap.values());

    // 3. Fetch employee profiles (paginasi penuh)
    const buildProfilesQuery = () => {
      let q = supabaseAdmin
        .from('employee_profiles')
        .select('user_id, jabatan, golongan')
        .order('user_id', { ascending: true });
      if (effectiveTargetUserId) {
        q = q.eq('user_id', effectiveTargetUserId);
      }
      return q;
    };

    const allProfiles = await fetchAllRows<ProfileRow>((from, to) =>
      buildProfilesQuery().range(from, to)
    );

    const profileMap = new Map<string, { jabatan: string | null; golongan: string | null }>();
    allProfiles.forEach((p) => {
      profileMap.set(p.user_id, p);
    });

    // 4. Fetch employees list (paginasi penuh)
    const buildUsersQuery = () => {
      let q = supabaseAdmin
        .from('users')
        .select('id, full_name, nip, unit_kerja, role')
        .eq('is_active', true)
        .order('full_name', { ascending: true })
        .order('id', { ascending: true });
      if (effectiveTargetUserId) {
        q = q.eq('id', effectiveTargetUserId);
      } else {
        q = q.in('role', ['anggota', 'ketua_tim']);
      }
      return q;
    };

    const allUsers = await fetchAllRows<UserRow>((from, to) =>
      buildUsersQuery().range(from, to)
    );

    const mappedUploads: ExportPegawaiUpload[] = activeUploads.map((u) => ({
      ...u,
      profile: profileMap.get(u.user_id) || null,
    })) as ExportPegawaiUpload[];

    const mappedAllUsers = allUsers.map((u) => ({
      ...u,
      profile: profileMap.get(u.id) || null,
    }));

    return {
      pimpinan,
      uploads: mappedUploads,
      allUsers: mappedAllUsers,
    };
  } catch (error) {
    console.error('[getExportPenilaianData] Error:', error);
    return {
      pimpinan: {
        nama: 'Baiq Kurniawati, SST, M.Ak',
        nip: '197805052000122001',
        pangkatGolongan: 'Pembina Tk. I / IV/b',
        jabatan: 'Kepala BPS Kabupaten Belitung',
        unitKerja: 'BPS Kabupaten Belitung',
      },
      uploads: [],
      allUsers: [],
    };
  }
}

export async function getExportEntriesForUpload(uploadId: string) {
  // Otorisasi: pemilik ATAU ketua_tim (penilai) ATAU pimpinan/admin.
  const caller = await getCaller();
  const supabaseAdmin = createAdminClient();

  try {
    const { data: upload, error: uploadErr } = await supabaseAdmin
      .from('ckp_uploads')
      .select('user_id')
      .eq('id', uploadId)
      .maybeSingle();
    if (uploadErr) throw uploadErr;
    if (!upload) throw new Error('Data CKP tidak ditemukan');

    const allowed =
      upload.user_id === caller.userId ||
      caller.role === 'ketua_tim' ||
      isPimpinanOrAdmin(caller.role);
    if (!allowed) {
      throw new Error('Anda tidak berwenang mengakses rincian CKP ini.');
    }

    // Paginasi penuh (upload bisa >1000 entri).
    const entries = await fetchAllRows<Record<string, unknown>>((from, to) =>
      supabaseAdmin
        .from('ckp_entries')
        .select('*')
        .eq('upload_id', uploadId)
        .order('row_number', { ascending: true })
        .order('id', { ascending: true })
        .range(from, to)
    );

    return entries;
  } catch (err) {
    console.error('[getExportEntriesForUpload] Error:', err);
    return [];
  }
}

export async function getAllEntriesForPeriodAction(bulan: number, tahun: number) {
  // Otorisasi: pimpinan/admin melihat semua; role lain hanya upload sendiri.
  const caller = await getCaller();
  const privileged = isPimpinanOrAdmin(caller.role);

  try {
    const supabaseAdmin = createAdminClient();

    const buildUploadsQuery = () => {
      let q = supabaseAdmin
        .from('ckp_uploads')
        .select('id, user_id, version')
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .neq('status', 'superseded');
      if (!privileged) {
        q = q.eq('user_id', caller.userId);
      }
      return q;
    };

    const uploads = await fetchAllRows<{ id: string; user_id: string; version: number }>((from, to) =>
      buildUploadsQuery()
        .order('version', { ascending: false })
        .order('id', { ascending: true })
        .range(from, to)
    );

    const seenUsers = new Set<string>();
    const latestUploadIds: string[] = [];
    uploads.forEach((u) => {
      if (!seenUsers.has(u.user_id)) {
        seenUsers.add(u.user_id);
        latestUploadIds.push(u.id);
      }
    });

    if (latestUploadIds.length === 0) return {};

    const entries: Record<string, unknown>[] = [];
    const batchSize = 50;
    for (let i = 0; i < latestUploadIds.length; i += batchSize) {
      const batchIds = latestUploadIds.slice(i, i + batchSize);
      const chunk = await fetchAllRows<Record<string, unknown>>((from, to) =>
        supabaseAdmin
          .from('ckp_entries')
          .select('*')
          .in('upload_id', batchIds)
          .order('row_number', { ascending: true })
          .order('id', { ascending: true })
          .range(from, to)
      );
      entries.push(...chunk);
    }

    const entriesByUploadId: Record<string, Record<string, unknown>[]> = {};
    entries.forEach((entry) => {
      const uploadId = String(entry.upload_id);
      if (!entriesByUploadId[uploadId]) {
        entriesByUploadId[uploadId] = [];
      }
      entriesByUploadId[uploadId].push(entry);
    });

    return entriesByUploadId;
  } catch (err) {
    console.error('[getAllEntriesForPeriodAction] Error:', err);
    return {};
  }
}
