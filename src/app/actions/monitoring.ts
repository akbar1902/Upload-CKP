"use server";

import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { rkGroupKey } from '@/lib/rk-scoring';

export interface PendingRkItem {
  key: string;
  subRk: string;
  parentRk: string | null;
  timKerja: string | null;
}

export interface PendingScoringKetuaTim {
  ketuaTim: {
    id: string;
    full_name: string;
    nip: string | null;
  };
  totalPendingRk: number;
  pegawaiDetails: {
    id: string;
    full_name: string;
    nip: string | null;
    unit_kerja: string | null;
    pendingRkCount: number;
    rkItems: PendingRkItem[];
  }[];
}

const TRIWULAN_MAP: Record<string, number[]> = {
  T1: [1, 2, 3],
  T2: [4, 5, 6],
  T3: [7, 8, 9],
  T4: [10, 11, 12],
};

interface RkMappingRow {
  id: string;
  rencana_kinerja: string;
  ketua_tim_id: string | null;
  tim_kerja: string | null;
}

type EntryRow = {
  id: string;
  upload_id: string;
  rencana_kinerja: string | null;
  rk_ketua_tim_id: string | null;
  nilai: number | null;
};

export async function getPendingScoringKetuaTim(
  bulan: number | string,
  tahun: number
): Promise<{ data: PendingScoringKetuaTim[] | null; error: string | null }> {
  try {
    // Auth check via RLS client; data via adminClient (bypass RLS)
    // konsisten dgn getRkDetailAction — agar entries Sub-RK baru ikut terbaca.
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'Sesi berakhir' };

    const admin = createAdminClient();

    // 1. Uploads dgn status yg masih relevan utk penilaian
    let uploadsQuery = admin
      .from('ckp_uploads')
      .select(`
        id, 
        user_id,
        user:user_id(id, full_name, nip, unit_kerja)
      `)
      .eq('tahun', tahun)
      .in('status', ['submitted', 'scored', 'revision_required']);

    if (typeof bulan === 'string' && bulan.startsWith('T')) {
      uploadsQuery = uploadsQuery.in('bulan', TRIWULAN_MAP[bulan] ?? []);
    } else {
      uploadsQuery = uploadsQuery.eq('bulan', Number(bulan));
    }

    const { data: uploads, error: uploadErr } = await uploadsQuery;

    if (uploadErr) throw uploadErr;
    if (!uploads || uploads.length === 0) return { data: [], error: null };

    const uploadIds = (uploads as { id: string }[]).map((u) => u.id);

    // 2. Entries yg belum dinilai — sertakan rk_ketua_tim_id (kunci join data baru)
    const { data: entries, error: entriesErr } = await admin
      .from('ckp_entries')
      .select('id, upload_id, rencana_kinerja, rk_ketua_tim_id, nilai')
      .in('upload_id', uploadIds)
      .is('nilai', null);

    if (entriesErr) throw entriesErr;
    if (!entries || entries.length === 0) return { data: [], error: null };

    const entryRows = entries as EntryRow[];

    // 3. Join mapping via mapping.id IN rk_ketua_tim_id (data baru / Sub-RK)
    const idSet = Array.from(
      new Set(entryRows.map((e) => e.rk_ketua_tim_id).filter((v): v is string => !!v))
    );
    const mappingById = new Map<string, RkMappingRow>();
    if (idSet.length > 0) {
      const { data: byId, error: byIdErr } = await admin
        .from('rk_ketua_tim_mapping')
        .select('id, rencana_kinerja, ketua_tim_id, tim_kerja')
        .in('id', idSet);
      if (byIdErr) throw byIdErr;
      ((byId ?? []) as RkMappingRow[]).forEach((m) => mappingById.set(m.id, m));
    }

    // 4. Fallback via NAMA hanya utk entries yg rk_ketua_tim_id-nya NULL (data lama)
    const legacyNames = Array.from(
      new Set(
        entryRows
          .filter((e) => !e.rk_ketua_tim_id)
          .map((e) => e.rencana_kinerja)
          .filter((v): v is string => !!v)
      )
    );
    const mappingByName = new Map<string, RkMappingRow>();
    if (legacyNames.length > 0) {
      const { data: byName, error: byNameErr } = await admin
        .from('rk_ketua_tim_mapping')
        .select('id, rencana_kinerja, ketua_tim_id, tim_kerja')
        .in('rencana_kinerja', legacyNames)
        .eq('is_active', true);
      if (byNameErr) throw byNameErr;
      ((byName ?? []) as RkMappingRow[])
        .filter((m) => m.ketua_tim_id)
        .forEach((m) => {
          if (!mappingByName.has(m.rencana_kinerja)) mappingByName.set(m.rencana_kinerja, m);
        });
    }

    const ketuaTimIds = Array.from(
      new Set(
        [...mappingById.values(), ...mappingByName.values()]
          .map((m) => m.ketua_tim_id)
          .filter((v): v is string => !!v)
      )
    );

    // 5. Users ketua tim + pimpinan (fallback bila RK tak ber-ketua-tim / milik sendiri)
    let ketuaTimUsers: { id: string; full_name: string; nip: string | null }[] = [];
    if (ketuaTimIds.length > 0) {
      const { data: ktUsers, error: ktErr } = await admin
        .from('users')
        .select('id, full_name, nip')
        .in('id', ketuaTimIds);
      if (ktErr) throw ktErr;
      ketuaTimUsers = (ktUsers ?? []) as typeof ketuaTimUsers;
    }
    const { data: pimpinanUser } = await admin
      .from('users')
      .select('id, full_name, nip')
      .eq('role', 'pimpinan')
      .limit(1)
      .maybeSingle();

    // Build Map Upload ID -> User (Pegawai)
    const uploadToUser = new Map<string, any>();
    (uploads as any[]).forEach((u) => uploadToUser.set(u.id, u.user));

    // Grouping pending per rkGroupKey (id utk data baru, legacy-nama utk data lama)
    const resultGroup = new Map<string, PendingScoringKetuaTim>();
    const seenGroup = new Set<string>();

    entryRows.forEach((entry) => {
      const mapping = entry.rk_ketua_tim_id
        ? mappingById.get(entry.rk_ketua_tim_id)
        : mappingByName.get(entry.rencana_kinerja || '');
      const ktId = mapping?.ketua_tim_id;
      const pegawai = uploadToUser.get(entry.upload_id);
      if (!pegawai) return;

      let finalKtUser;

      if (!ktId || pegawai.id === ktId) {
        // RK tanpa ketua tim ATAU RK milik Ketua Tim sendiri -> Pimpinan yg menilai
        if (!pimpinanUser) return;
        finalKtUser = pimpinanUser;
      } else {
        finalKtUser = ketuaTimUsers.find((u) => u.id === ktId);
      }

      if (!finalKtUser) return;

      const key = rkGroupKey(entry);
      const seenKey = `${finalKtUser.id}|${pegawai.id}|${key}`;
      if (seenGroup.has(seenKey)) return;
      seenGroup.add(seenKey);

      if (!resultGroup.has(finalKtUser.id)) {
        resultGroup.set(finalKtUser.id, {
          ketuaTim: finalKtUser as PendingScoringKetuaTim['ketuaTim'],
          totalPendingRk: 0,
          pegawaiDetails: [],
        });
      }

      const ktGroup = resultGroup.get(finalKtUser.id)!;

      let pegDetail = ktGroup.pegawaiDetails.find((p) => p.id === pegawai.id);
      if (!pegDetail) {
        pegDetail = {
          id: pegawai.id,
          full_name: pegawai.full_name,
          nip: pegawai.nip,
          unit_kerja: pegawai.unit_kerja,
          pendingRkCount: 0,
          rkItems: [],
        };
        ktGroup.pegawaiDetails.push(pegDetail);
      }

      const subRk = entry.rencana_kinerja || 'Tidak Diketahui';
      pegDetail.rkItems.push({
        key,
        subRk,
        parentRk: mapping?.rencana_kinerja ?? null,
        timKerja: mapping?.tim_kerja ?? null,
      });
      pegDetail.pendingRkCount++;
      ktGroup.totalPendingRk++;
    });

    // Convert map to array and sort by pending count descending; rkItems stabil alfabetis
    const finalData = Array.from(resultGroup.values()).sort((a, b) => b.totalPendingRk - a.totalPendingRk);
    finalData.forEach((g) =>
      g.pegawaiDetails.forEach((p) => p.rkItems.sort((a, b) => a.subRk.localeCompare(b.subRk)))
    );

    return { data: finalData, error: null };
  } catch (err: any) {
    console.error('getPendingScoringKetuaTim Error:', err);
    return { data: null, error: err.message || 'Terjadi kesalahan saat mengambil data' };
  }
}
