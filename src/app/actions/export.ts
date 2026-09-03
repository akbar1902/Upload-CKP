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

export async function getExportPenilaianData(bulan: number, tahun: number) {
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

    // 2. Get all uploads in this period
    const { data: uploads, error: uploadsErr } = await supabaseAdmin
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

    if (uploadsErr) throw uploadsErr;

    // Filter to only the latest version per user
    const latestUploadsMap = new Map<string, any>();
    (uploads || []).forEach((u: any) => {
      if (!latestUploadsMap.has(u.user_id) || u.version > latestUploadsMap.get(u.user_id).version) {
        latestUploadsMap.set(u.user_id, u);
      }
    });

    const activeUploads = Array.from(latestUploadsMap.values());

    // 3. For all users with uploads, fetch their employee profiles
    const userIds = activeUploads.map((u: any) => u.user_id);
    const { data: profiles } = userIds.length > 0
      ? await supabaseAdmin
          .from('employee_profiles')
          .select('user_id, jabatan, golongan')
          .in('user_id', userIds)
      : { data: [] };

    const profileMap = new Map<string, { jabatan: string | null; golongan: string | null }>();
    (profiles || []).forEach((p: any) => {
      profileMap.set(p.user_id, p);
    });

    // 4. Also fetch all active employees list
    const { data: allUsers } = await supabaseAdmin
      .from('users')
      .select('id, full_name, nip, unit_kerja, role')
      .in('role', ['anggota', 'ketua_tim'])
      .eq('is_active', true)
      .order('full_name');

    const mappedUploads: ExportPegawaiUpload[] = activeUploads.map((u: any) => ({
      ...u,
      profile: profileMap.get(u.user_id) || null,
    }));

    return {
      pimpinan,
      uploads: mappedUploads,
      allUsers: allUsers || [],
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
