'use server';

import { createClient } from '@supabase/supabase-js';

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

export async function getExportPenilaianData(bulan: number, tahun: number, targetUserId?: string) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    // 2. Get uploads in this period
    let uploadsQuery = supabaseAdmin
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
      .neq('status', 'superseded')
      .order('uploaded_at', { ascending: false });

    if (targetUserId) {
      uploadsQuery = uploadsQuery.eq('user_id', targetUserId);
    }

    const { data: uploads, error: uploadsErr } = await uploadsQuery;

    if (uploadsErr) throw uploadsErr;

    // Filter to only the latest version per user
    const latestUploadsMap = new Map<string, any>();
    (uploads || []).forEach((u: any) => {
      if (!latestUploadsMap.has(u.user_id) || u.version > latestUploadsMap.get(u.user_id).version) {
        latestUploadsMap.set(u.user_id, u);
      }
    });

    const activeUploads = Array.from(latestUploadsMap.values());

    // 3. Fetch employee profiles
    let profilesQuery = supabaseAdmin
      .from('employee_profiles')
      .select('user_id, jabatan, golongan');

    if (targetUserId) {
      profilesQuery = profilesQuery.eq('user_id', targetUserId);
    }

    const { data: allProfiles } = await profilesQuery;

    const profileMap = new Map<string, { jabatan: string | null; golongan: string | null }>();
    (allProfiles || []).forEach((p: any) => {
      profileMap.set(p.user_id, p);
    });

    // 4. Fetch employees list
    let usersQuery = supabaseAdmin
      .from('users')
      .select('id, full_name, nip, unit_kerja, role')
      .eq('is_active', true)
      .order('full_name');

    if (targetUserId) {
      usersQuery = usersQuery.eq('id', targetUserId);
    } else {
      usersQuery = usersQuery.in('role', ['anggota', 'ketua_tim']);
    }

    const { data: allUsers } = await usersQuery;

    const mappedUploads: ExportPegawaiUpload[] = activeUploads.map((u: any) => ({
      ...u,
      profile: profileMap.get(u.user_id) || null,
    }));

    const mappedAllUsers = (allUsers || []).map((u: any) => ({
      ...u,
      profile: profileMap.get(u.id) || null,
    }));

    return {
      pimpinan,
      uploads: mappedUploads,
      allUsers: mappedAllUsers,
    };
  } catch (error: any) {
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
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: entries, error } = await supabaseAdmin
      .from('ckp_entries')
      .select('*')
      .eq('upload_id', uploadId)
      .order('row_number', { ascending: true });

    if (error) throw error;
    return entries || [];
  } catch (err: any) {
    console.error('[getExportEntriesForUpload] Error:', err);
    return [];
  }
}

export async function getAllEntriesForPeriodAction(bulan: number, tahun: number) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: uploads, error: uploadsErr } = await supabaseAdmin
      .from('ckp_uploads')
      .select('id, user_id, version')
      .eq('bulan', bulan)
      .eq('tahun', tahun)
      .neq('status', 'superseded')
      .order('version', { ascending: false });

    if (uploadsErr) throw uploadsErr;

    const seenUsers = new Set<string>();
    const latestUploadIds: string[] = [];
    (uploads || []).forEach((u: any) => {
      if (!seenUsers.has(u.user_id)) {
        seenUsers.add(u.user_id);
        latestUploadIds.push(u.id);
      }
    });

    if (latestUploadIds.length === 0) return {};

    const { data: entries, error: entriesErr } = await supabaseAdmin
      .from('ckp_entries')
      .select('*')
      .in('upload_id', latestUploadIds)
      .order('row_number', { ascending: true });

    if (entriesErr) throw entriesErr;

    const entriesByUploadId: Record<string, any[]> = {};
    (entries || []).forEach((entry: any) => {
      if (!entriesByUploadId[entry.upload_id]) {
        entriesByUploadId[entry.upload_id] = [];
      }
      entriesByUploadId[entry.upload_id].push(entry);
    });

    return entriesByUploadId;
  } catch (err: any) {
    console.error('[getAllEntriesForPeriodAction] Error:', err);
    return {};
  }
}
