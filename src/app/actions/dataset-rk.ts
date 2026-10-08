'use server';

import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { fetchAllRows } from '@/lib/supabase/read';
import { revalidatePath } from 'next/cache';
import type { ParsedDataset, DatasetTeam, DatasetSubRk } from '@/lib/excel/dataset-rk';

// ============================================================
// Impor "Dataset RK" (matriks per tim) ke database.
//   Parent (RK Ketua Tim)  -> rk_ketua_tim_mapping
//   Sub-RK (RK Anggota)    -> master_kegiatan_anggota
//   Penugasan              -> user_rk_assignments
//
// Multi-tahun: baris RK lama TIDAK dihapus, hanya is_active=false.
// Impor tahun baru menonaktifkan seluruh RK lama lalu mengaktifkan yang baru.
// ============================================================

export interface DatasetImportReport {
  year: number;
  teams: number;
  parents: number;
  subRks: number;
  assignments: number;
  missingEmployees: string[];
  warnings: string[];
  perTeam: {
    teamName: string;
    ketuaNama: string | null;
    ketuaFound: boolean;
    parents: number;
    subRks: number;
  }[];
}

export interface DatasetImportResult {
  success: boolean;
  error?: string;
  dryRun?: boolean;
  report?: DatasetImportReport;
}

function normName(input: unknown): string {
  return String(input ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

interface MiniUser {
  id: string;
  full_name: string;
  nip: string | null;
}

/** Cocokkan pegawai dataset ke user SIKAP: NIP dulu, lalu nama (longest match). */
function makeResolver(users: MiniUser[]) {
  const byNip = new Map<string, MiniUser>();
  const byName = new Map<string, MiniUser[]>();
  for (const u of users) {
    if (u.nip) byNip.set(String(u.nip).trim(), u);
    const key = normName(u.full_name);
    if (!key) continue;
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key)!.push(u);
  }

  return function resolve(
    nip: string | null | undefined,
    nama: string | null | undefined
  ): MiniUser | null {
    const cleanNip = nip ? String(nip).trim() : '';
    if (cleanNip && byNip.has(cleanNip)) return byNip.get(cleanNip)!;

    const key = normName(nama);
    if (!key) return null;
    if (byName.has(key)) return byName.get(key)![0];

    // Containment (nama dataset sering memuat gelar, mis. "Irma Setiyani Rahayu SST").
    let best: MiniUser | null = null;
    let bestLen = 0;
    for (const [uKey, list] of byName) {
      if (!uKey) continue;
      if (uKey.length < 5) continue;
      if (key.includes(uKey) || uKey.includes(key)) {
        if (uKey.length > bestLen) {
          bestLen = uKey.length;
          best = list[0];
        }
      }
    }
    return best;
  };
}

async function chunkedUpsert<T>(
  rows: T[],
  size: number,
  fn: (chunk: T[]) => Promise<void>
): Promise<void> {
  for (let i = 0; i < rows.length; i += size) {
    await fn(rows.slice(i, i + size));
  }
}

export async function importDatasetRkAction(
  dataset: ParsedDataset,
  year: number,
  dryRun = false
): Promise<DatasetImportResult> {
  try {
    const authClient = await createServerSupabaseClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();
    if (!user) return { success: false, error: 'Sesi berakhir' };

    const { data: me } = await authClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    if (!me || me.role !== 'admin') {
      return { success: false, error: 'Hanya admin yang boleh mengimpor Dataset RK.' };
    }

    if (!dataset || !Array.isArray(dataset.teams) || dataset.teams.length === 0) {
      return { success: false, error: 'Dataset kosong / tidak valid.' };
    }
    const tahun = Number(year) || new Date().getFullYear();

    const admin = createAdminClient();

    // Paginasi penuh — daftar user bisa >1000 baris.
    const usersData = await fetchAllRows<MiniUser>((from, to) =>
      admin
        .from('users')
        .select('id, full_name, nip')
        .order('id', { ascending: true })
        .range(from, to)
    );

    const resolveUser = makeResolver(usersData);

    const report: DatasetImportReport = {
      year: tahun,
      teams: dataset.teams.length,
      parents: 0,
      subRks: 0,
      assignments: 0,
      missingEmployees: [],
      warnings: [...(dataset.warnings ?? [])],
      perTeam: [],
    };
    const missing = new Set<string>();

    // Catatan: DEAKTIVASI tahun lama dilakukan SETELAH impor sukses
    // (lihat akhir fungsi) supaya kalau impor gagal, tahun lama tetap aktif.

    for (const team of dataset.teams as DatasetTeam[]) {
      const ketuaUser = team.ketua
        ? resolveUser(team.ketua.nip, team.ketua.nama)
        : null;
      if (team.ketua && !ketuaUser) {
        missing.add(`${team.ketua.nama}${team.ketua.nip ? ` (NIP ${team.ketua.nip})` : ''}`);
      }
      if (!team.ketua) {
        report.warnings.push(`[${team.teamName}] Ketua tim tidak terbaca.`);
      }

      let teamParents = 0;
      let teamSubs = 0;

      for (const parent of team.parents) {
        teamParents++;
        report.parents++;

        let parentId: string | null = null;
        if (!dryRun) {
          const { data: up, error: upErr } = await admin
            .from('rk_ketua_tim_mapping')
            .upsert(
              {
                rencana_kinerja: parent.rk,
                tim_kerja: team.teamName,
                ketua_tim_id: ketuaUser?.id ?? null,
                tahun,
                is_active: false, // diaktifkan sekaligus setelah seluruh impor sukses
                created_by: user.id,
              },
              { onConflict: 'rencana_kinerja,tim_kerja,tahun' }
            )
            .select('id')
            .single();
          if (upErr) {
            report.warnings.push(
              `[${team.teamName}] Gagal simpan RK "${parent.rk}": ${upErr.message}`
            );
            continue;
          }
          parentId = up.id;
        }

        // Sub-RK + assignment per anggota.
        const subRows: { rk_id: string; user_id: string; kegiatan_nama: string }[] = [];
        const assignRows: { rk_id: string; user_id: string; assigned_by: string }[] = [];
        const subSeen = new Set<string>();

        for (const sub of parent.subRks as DatasetSubRk[]) {
          const subUser = resolveUser(sub.nip, sub.nama);
          if (!subUser) {
            missing.add(`${sub.nama}${sub.nip ? ` (NIP ${sub.nip})` : ''}`);
            continue;
          }
          teamSubs++;
          report.subRks++;
          if (parentId) {
            const key = `${parentId}|${subUser.id}|${sub.text.toLowerCase()}`;
            if (!subSeen.has(key)) {
              subSeen.add(key);
              subRows.push({ rk_id: parentId, user_id: subUser.id, kegiatan_nama: sub.text });
            }
            assignRows.push({ rk_id: parentId, user_id: subUser.id, assigned_by: user.id });
          }
        }

        if (!dryRun && parentId && subRows.length > 0) {
          await chunkedUpsert(subRows, 500, async (chunk) => {
            const { error } = await admin
              .from('master_kegiatan_anggota')
              .upsert(chunk, {
                onConflict: 'rk_id,user_id,kegiatan_nama',
                ignoreDuplicates: true,
              });
            if (error) throw error;
          });
        }

        if (!dryRun && assignRows.length > 0) {
          const uniqueAssign = new Map<string, { rk_id: string; user_id: string; assigned_by: string }>();
          for (const a of assignRows) uniqueAssign.set(`${a.user_id}|${a.rk_id}`, a);
          await chunkedUpsert(Array.from(uniqueAssign.values()), 500, async (chunk) => {
            const { error } = await admin
              .from('user_rk_assignments')
              .upsert(chunk, { onConflict: 'user_id,rk_id', ignoreDuplicates: true });
            if (error) throw error;
          });
          report.assignments += uniqueAssign.size;
        }
      }

      report.perTeam.push({
        teamName: team.teamName,
        ketuaNama: team.ketua?.nama ?? null,
        ketuaFound: !!ketuaUser,
        parents: teamParents,
        subRks: teamSubs,
      });
    }

    report.missingEmployees = Array.from(missing).sort();

    // Aktifkan HANYA tahun yang baru diimpor; tahun lain tetap tersimpan sebagai arsip.
    // Dilakukan belakangan agar bila impor gagal di tengah, tahun lama tidak ikut nonaktif.
    if (!dryRun) {
      const { error: onErr } = await admin
        .from('rk_ketua_tim_mapping')
        .update({ is_active: true })
        .eq('tahun', tahun);
      if (onErr) throw onErr;

      const { error: offErr } = await admin
        .from('rk_ketua_tim_mapping')
        .update({ is_active: false })
        .neq('tahun', tahun);
      if (offErr) throw offErr;
    }

    if (!dryRun) {
      await admin.from('audit_logs').insert({
        user_id: user.id,
        action: 'dataset_rk_imported',
        entity_type: 'rencana_kinerja',
        entity_id: null,
        new_data: {
          tahun,
          teams: report.teams,
          parents: report.parents,
          sub_rks: report.subRks,
          assignments: report.assignments,
          missing_count: report.missingEmployees.length,
        },
      });

      revalidatePath('/admin/rk');
      revalidatePath('/rencana_kinerja');
      revalidatePath('/pegawai');
      revalidatePath('/ketua_tim');
      revalidatePath('/', 'layout');
    }

    return { success: true, dryRun, report };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[importDatasetRkAction] Error:', message);
    return { success: false, error: message };
  }
}
