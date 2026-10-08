"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { fetchAllRows } from '@/lib/supabase/read';
import masterMappingDataRaw from "@/data/master_mapping.json";

// Klien service role dibuat LAZY agar kegagalan konfigurasi (mis.
// SUPABASE_SERVICE_ROLE_KEY belum diset) muncul jelas saat action dipanggil —
// fail closed, tanpa fallback diam-diam ke anon key.
let adminClientSingleton: ReturnType<typeof createAdminClient> | null = null;
function adminDb() {
  if (!adminClientSingleton) adminClientSingleton = createAdminClient();
  return adminClientSingleton;
}

// ------------------------------------------------------------
// Otorisasi: hanya ADMIN yang boleh mengubah struktur RK.
// (Server actions bypass RLS, jadi harus dicek di sini.)
// ------------------------------------------------------------
async function requireAdmin(): Promise<{ ok: boolean; userId?: string; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Sesi berakhir' };
    const { data: me } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (!me || me.role !== 'admin') {
      return { ok: false, error: 'Hanya admin yang berwenang melakukan aksi ini.' };
    }
    return { ok: true, userId: user.id };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Gagal memverifikasi hak akses' };
  }
}

const VALID_ROLES = ['anggota', 'ketua_tim', 'pimpinan', 'admin'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

/** Pesan generik ke client; detail hanya di console server. */
const DB_ERROR_MESSAGE = 'Terjadi kesalahan pada server. Silakan coba lagi atau hubungi admin.';

interface AdminRkListRow {
  id: string;
  rencana_kinerja: string;
  tim_kerja?: string | null;
  ketua_tim_id?: string | null;
  is_active?: boolean;
  tahun?: number | null;
}

interface AdminKetuaTimRow {
  id: string;
  full_name: string;
  unit_kerja: string | null;
}

interface AdminSubRkRow {
  id: string;
  rk_id: string;
  kegiatan_nama: string;
  [key: string]: unknown;
}

export async function createEmployee(data: any) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  try {
    const email = String(data?.email || '').trim().toLowerCase();
    const password = String(data?.password || '');
    const fullName = String(data?.full_name || '').trim();
    const role = String(data?.role || '');

    if (!email || !EMAIL_RE.test(email)) {
      return { success: false, error: 'Email tidak valid.' };
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return { success: false, error: `Password minimal ${MIN_PASSWORD_LENGTH} karakter.` };
    }
    if (!fullName) {
      return { success: false, error: 'Nama lengkap wajib diisi.' };
    }
    // Whitelist role: jangan biarkan role bebas dari client.
    if (!VALID_ROLES.includes(role)) {
      return { success: false, error: 'Role tidak valid. Pilih salah satu: anggota, ketua_tim, pimpinan, admin.' };
    }

    // 1. Create user in auth.users
    const { data: authData, error: authError } = await adminDb().auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      }
    });

    if (authError) {
      console.error("Auth error:", authError);
      return { success: false, error: authError.message };
    }

    const userId = authData.user.id;

    // 2. Insert into public.users (if it doesn't auto-sync via trigger)
    const { error: dbError } = await adminDb().from('users').upsert({
      id: userId,
      email,
      full_name: fullName,
      nip: data.nip ? String(data.nip).trim() : null,
      role,
      unit_kerja: data.unit_kerja ? String(data.unit_kerja).trim() : null,
      is_active: true,
    });

    if (dbError) {
      console.error("DB error:", dbError);
      // Bersihkan auth user agar tidak yatim bila row public.users gagal.
      await adminDb().auth.admin.deleteUser(userId).catch((cleanupErr) =>
        console.warn('[createEmployee] Gagal membersihkan auth user yatim:', cleanupErr?.message)
      );
      return { success: false, error: DB_ERROR_MESSAGE };
    }

    // 3. Upsert into employee_profiles if jabatan or golongan provided
    if (data.jabatan || data.golongan) {
      await adminDb().from('employee_profiles').upsert({
        user_id: userId,
        jabatan: data.jabatan ? data.jabatan.trim() : null,
        golongan: data.golongan ? data.golongan.trim() : null,
      }, { onConflict: 'user_id' });
    }

    revalidatePath('/admin/pegawai');
    revalidatePath('/admin/export-penilaian');
    revalidatePath('/pimpinan/pegawai');
    return { success: true };
  } catch (error: any) {
    console.error('[createEmployee] Error:', error);
    return { success: false, error: DB_ERROR_MESSAGE };
  }
}

export async function updateEmployeeProfile(data: {
  id: string;
  full_name: string;
  nip?: string | null;
  unit_kerja?: string | null;
  role?: string;
  jabatan?: string | null;
  golongan?: string | null;
}) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  try {
    const fullName = String(data.full_name || '').trim();
    if (!fullName) {
      return { success: false, error: 'Nama lengkap wajib diisi.' };
    }
    if (data.role !== undefined && !VALID_ROLES.includes(String(data.role))) {
      return { success: false, error: 'Role tidak valid.' };
    }

    // 1. Update public.users
    const userUpdate: any = {
      full_name: fullName,
      updated_at: new Date().toISOString(),
    };
    if (data.nip !== undefined) userUpdate.nip = data.nip ? data.nip.trim() : null;
    if (data.unit_kerja !== undefined) userUpdate.unit_kerja = data.unit_kerja ? data.unit_kerja.trim() : null;
    if (data.role !== undefined) userUpdate.role = data.role;

    const { error: userError } = await adminDb()
      .from('users')
      .update(userUpdate)
      .eq('id', data.id);

    if (userError) {
      console.error('[updateEmployeeProfile] User error:', userError);
      return { success: false, error: DB_ERROR_MESSAGE };
    }

    // 2. Sync to auth.users user_metadata
    await adminDb().auth.admin.updateUserById(data.id, {
      user_metadata: {
        full_name: fullName,
        nip: data.nip ? data.nip.trim() : null,
        unit_kerja: data.unit_kerja ? data.unit_kerja.trim() : null,
        role: data.role || undefined,
      }
    }).catch((err) => console.warn('Could not sync auth metadata:', err?.message));

    // 3. Upsert into public.employee_profiles
    const { error: profileError } = await adminDb()
      .from('employee_profiles')
      .upsert({
        user_id: data.id,
        jabatan: data.jabatan ? data.jabatan.trim() : null,
        golongan: data.golongan ? data.golongan.trim() : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (profileError) {
      console.error('[updateEmployeeProfile] Profile error:', profileError);
      return { success: false, error: DB_ERROR_MESSAGE };
    }

    revalidatePath('/admin/pegawai');
    revalidatePath('/admin/export-penilaian');
    revalidatePath('/pimpinan/pegawai');

    return { success: true };
  } catch (error: any) {
    console.error('[updateEmployeeProfile] Catch error:', error);
    return { success: false, error: DB_ERROR_MESSAGE };
  }
}

/**
 * Kumpulkan seluruh path file di dalam folder user (best-effort).
 * Struktur storage: {userId}/{tahun}/{bulan}/file.xlsx — `list()` tidak
 * rekursif, folder ditandai `id === null`, jadi ditelusuri sampai kedalaman aman.
 */
async function collectStorageFilePaths(
  userId: string,
  prefix = userId,
  depth = 0
): Promise<string[]> {
  if (depth > 4) return [];
  const paths: string[] = [];
  try {
    const { data, error } = await adminDb().storage.from('ckp-files').list(prefix, { limit: 1000 });
    if (error) {
      console.warn('[deleteEmployee] Storage list warning:', error.message);
      return paths;
    }
    for (const item of data ?? []) {
      const fullPath = `${prefix}/${item.name}`;
      if (item.id === null) {
        paths.push(...(await collectStorageFilePaths(userId, fullPath, depth + 1)));
      } else {
        paths.push(fullPath);
      }
    }
  } catch (storageErr) {
    console.warn('[deleteEmployee] Storage traversal warning:', storageErr instanceof Error ? storageErr.message : storageErr);
  }
  return paths;
}

export async function deleteEmployee(userId: string) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  try {
    // 1. Ambil SEMUA upload_id milik user (paginasi — jangan terpotong di 1000)
    const uploads = await fetchAllRows<{ id: string }>((from, to) =>
      adminDb()
        .from('ckp_uploads')
        .select('id')
        .eq('user_id', userId)
        .order('id', { ascending: true })
        .range(from, to)
    );
    const uploadIds = uploads.map((u) => u.id);

    // 2. Hapus referensi dari approvals & entries per chunk (hindari URL raksasa)
    const CHUNK = 100;
    for (let i = 0; i < uploadIds.length; i += CHUNK) {
      const chunk = uploadIds.slice(i, i + CHUNK);
      const { error: apprErr } = await adminDb().from('approvals').delete().in('upload_id', chunk);
      if (apprErr) throw apprErr;
      const { error: entErr } = await adminDb().from('ckp_entries').delete().in('upload_id', chunk);
      if (entErr) throw entErr;
    }
    if (uploadIds.length > 0) {
      const { error: uploadDelErr } = await adminDb().from('ckp_uploads').delete().eq('user_id', userId);
      if (uploadDelErr) throw uploadDelErr;
    }

    // 3. Hapus data yang dimiliki user secara langsung
    const directDeletes: Array<PromiseLike<{ error: unknown }>> = [
      adminDb().from('user_rk_assignments').delete().eq('user_id', userId),
      adminDb().from('audit_logs').delete().eq('user_id', userId),
      adminDb().from('employee_profiles').delete().eq('user_id', userId),
      adminDb().from('approvals').delete().eq('reviewer_id', userId),
    ];
    for (const op of directDeletes) {
      const { error } = await op;
      if (error) throw error;
    }

    // 4. Nullify referensi di tabel lain (karena foreign key mungkin mencegah delete)
    const nullifyOps: Array<PromiseLike<{ error: unknown }>> = [
      adminDb().from('rk_ketua_tim_mapping').update({ ketua_tim_id: null }).eq('ketua_tim_id', userId),
      adminDb().from('ckp_uploads').update({ approved_by: null }).eq('approved_by', userId),
      adminDb().from('ckp_entries').update({ dinilai_oleh: null }).eq('dinilai_oleh', userId),
      adminDb().from('periode_ckp').update({ locked_by: null }).eq('locked_by', userId),
      adminDb().from('user_rk_assignments').update({ assigned_by: null }).eq('assigned_by', userId),
    ];
    for (const op of nullifyOps) {
      const { error } = await op;
      if (error) throw error;
    }

    // 5. Hapus file storage (best-effort — kegagalan storage TIDAK menggagalkan
    //    penghapusan akun; cukup dicatat untuk pembersihan manual).
    try {
      const storagePaths = await collectStorageFilePaths(userId);
      for (let i = 0; i < storagePaths.length; i += CHUNK) {
        const chunk = storagePaths.slice(i, i + CHUNK);
        const { error: removeErr } = await adminDb().storage.from('ckp-files').remove(chunk);
        if (removeErr) {
          console.warn('[deleteEmployee] Gagal hapus file storage:', removeErr.message);
        }
      }
    } catch (storageErr) {
      console.warn('[deleteEmployee] Storage cleanup warning:', storageErr instanceof Error ? storageErr.message : storageErr);
    }

    // 6. Hapus dari public.users
    const { error: publicUserErr } = await adminDb().from('users').delete().eq('id', userId);
    if (publicUserErr) throw publicUserErr;

    // 7. Terakhir, hapus dari auth.users
    const { error } = await adminDb().auth.admin.deleteUser(userId);
    if (error) {
      console.error('[deleteEmployee] Gagal hapus auth user:', error);
      return { success: false, error: DB_ERROR_MESSAGE };
    }

    revalidatePath('/admin/pegawai');
    return { success: true };
  } catch (error: any) {
    console.error('[deleteEmployee] Error:', error);
    return { success: false, error: DB_ERROR_MESSAGE };
  }
}

export async function resetPassword(userId: string) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  try {
    const { error } = await adminDb().auth.admin.updateUserById(userId, {
      password: "Password123!"
    });
    
    if (error) {
      console.error('[resetPassword] Error:', error);
      return { success: false, error: DB_ERROR_MESSAGE };
    }

    return { success: true, message: "Password berhasil direset menjadi Password123!" };
  } catch (error: any) {
    console.error('[resetPassword] Error:', error);
    return { success: false, error: DB_ERROR_MESSAGE };
  }
}

export async function togglePeriodeLock(bulan: number, tahun: number, is_locked: boolean, adminId: string) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  // Parameter adminId dari client DIABAIKAN — audit memakai userId dari sesi.
  void adminId;

  try {
    const { error } = await adminDb().from('periode_ckp').upsert({
      bulan,
      tahun,
      is_locked,
      locked_by: guard.userId,
      locked_at: new Date().toISOString()
    }, { onConflict: 'bulan,tahun' });

    if (error) {
      console.error('[togglePeriodeLock] Error:', error);
      return { success: false, error: DB_ERROR_MESSAGE };
    }

    revalidatePath('/admin/periode');
    return { success: true };
  } catch (error: any) {
    console.error('[togglePeriodeLock] Error:', error);
    return { success: false, error: DB_ERROR_MESSAGE };
  }
}

export async function uploadRencanaKinerjaBulk(data: any[], adminId: string) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  // Parameter adminId dari client DIABAIKAN — gunakan userId dari sesi.
  void adminId;

  try {
    if (!Array.isArray(data) || data.length === 0) {
      return { success: false, error: 'Data RK kosong / tidak valid.' };
    }
    if (data.length > 5000) {
      return { success: false, error: 'Data RK terlalu banyak (maksimal 5000 baris per impor).' };
    }

    let processedMaster = 0;
    let processedSub = 0;

    // Group by rk_utama
    const rkGroups: Record<string, any[]> = {};
    for (const row of data) {
      if (!row || typeof row !== 'object') continue;
      const rk = row.rk_utama?.trim() || row.rencana_kinerja?.trim();
      if (!rk) continue;
      if (!rkGroups[rk]) rkGroups[rk] = [];
      rkGroups[rk].push(row);
    }

    if (Object.keys(rkGroups).length === 0) {
      return { success: false, error: 'Tidak ada baris RK yang valid untuk diimpor.' };
    }

    // Fetch all existing mappings to inherit ketua_tim_id for existing teams
    const { data: existingMappings, error: mappingErr } = await adminDb()
      .from('rk_ketua_tim_mapping')
      .select('tim_kerja, ketua_tim_id')
      .eq('is_active', true)
      .not('ketua_tim_id', 'is', null);
    if (mappingErr) {
      console.error('[uploadRencanaKinerjaBulk] Mapping error:', mappingErr);
      return { success: false, error: 'Gagal memuat data tim kerja.' };
    }
    const timKerjaToKetuaId: Record<string, string> = {};
    (existingMappings || []).forEach(m => {
      if (m.tim_kerja && m.ketua_tim_id) {
        timKerjaToKetuaId[m.tim_kerja] = m.ketua_tim_id;
      }
    });

    // Tahun aktif saat ini (agar RK manual/bulk masuk ke periode yang benar)
    const { data: activeYearRow, error: yearErr } = await adminDb()
      .from('rk_ketua_tim_mapping')
      .select('tahun')
      .eq('is_active', true)
      .order('tahun', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (yearErr) {
      console.error('[uploadRencanaKinerjaBulk] Year error:', yearErr);
      return { success: false, error: 'Gagal menentukan tahun aktif.' };
    }
    const activeYear = activeYearRow?.tahun || new Date().getFullYear();

    for (const rk of Object.keys(rkGroups)) {
      const rows = rkGroups[rk];

      const timKerja = rows[0].tim_kerja?.trim() || rows[0].tim?.trim() || null;

      const payload: any = {
        rencana_kinerja: rk,
        tim_kerja: timKerja,
        tahun: activeYear,
        is_active: true,
      };

      // Auto inherit ketua_tim_id if it exists for this team
      if (timKerja && timKerjaToKetuaId[timKerja]) {
        payload.ketua_tim_id = timKerjaToKetuaId[timKerja];
      }

      // Upsert the Master RK
      const { data: upsertData, error: upsertError } = await adminDb()
        .from('rk_ketua_tim_mapping')
        .upsert(
          payload,
          { onConflict: 'rencana_kinerja,tim_kerja,tahun' }
        )
        .select()
        .single();

      if (upsertError || !upsertData) {
        console.error('[uploadRencanaKinerjaBulk] Upsert Master RK error:', upsertError);
        return {
          success: false,
          error: `Gagal menyimpan RK "${rk}". Impor dihentikan — periksa data lalu coba lagi.`,
        };
      }
      processedMaster++;

      // Process Sub RKs
      const subRks = new Set<string>();
      rows.forEach(r => {
        const sub = r.sub_rk?.trim() || r.kegiatan?.trim();
        if (sub) subRks.add(sub);
      });

      if (subRks.size > 0) {
        // Fetch existing sub RKs to prevent duplicate inserts
        const { data: existingSubs, error: subsErr } = await adminDb()
          .from('master_kegiatan_anggota')
          .select('kegiatan_nama')
          .eq('rk_id', upsertData.id);
        if (subsErr) {
          console.error('[uploadRencanaKinerjaBulk] Select Sub RK error:', subsErr);
          return {
            success: false,
            error: `Gagal memeriksa Sub-RK untuk "${rk}". Impor dihentikan — coba lagi.`,
          };
        }
        const existingSubNames = new Set((existingSubs || []).map(s => s.kegiatan_nama));

        const toInsert = Array.from(subRks)
          .filter(sub => !existingSubNames.has(sub))
          .map(sub => ({
            rk_id: upsertData.id,
            kegiatan_nama: sub,
            user_id: guard.userId, // audit: siapa yang menambahkan (dari sesi)
          }));

        if (toInsert.length > 0) {
          const { error: subError } = await adminDb().from('master_kegiatan_anggota').insert(toInsert);
          if (subError) {
            console.error('[uploadRencanaKinerjaBulk] Insert Sub RK error:', subError);
            return {
              success: false,
              error: `Gagal menyimpan Sub-RK untuk "${rk}". Impor dihentikan — coba lagi.`,
            };
          }
          processedSub += toInsert.length;
        }
      }
    }

    revalidatePath('/admin/rk');
    return { success: true, processed: processedMaster, processedSub };
  } catch (error: any) {
    console.error('[uploadRencanaKinerjaBulk] Error:', error);
    return { success: false, error: DB_ERROR_MESSAGE };
  }
}

export async function toggleEmployeeStatus(userId: string, currentStatus: boolean) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  try {
    const newStatus = !currentStatus;
    
    // Update in public.users
    const { error: dbError } = await adminDb()
      .from('users')
      .update({ is_active: newStatus })
      .eq('id', userId);

    if (dbError) throw dbError;

    // Optional: block login via Auth API if deactivating (though useAuth might already redirect out)
    // Actually, setting ban_duration is a robust way to prevent login.
    if (!newStatus) {
      await adminDb().auth.admin.updateUserById(userId, { ban_duration: '87600h' }); // 10 years ban
    } else {
      await adminDb().auth.admin.updateUserById(userId, { ban_duration: 'none' });
    }

    revalidatePath('/admin/pegawai');
    return { success: true };
  } catch (error: any) {
    console.error('[toggleEmployeeStatus] Error:', error);
    return { success: false, error: DB_ERROR_MESSAGE };
  }
}

export async function replaceKetuaTim(oldUserId: string, newUserId: string) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  try {
    // 1. Ambil data ketua tim lama untuk mewariskan unit_kerja (nama tim)
    const { data: oldUser, error: oldUserErr } = await adminDb()
      .from('users')
      .select('unit_kerja')
      .eq('id', oldUserId)
      .single();
    if (oldUserErr || !oldUser) {
      console.error('[replaceKetuaTim] Ketua tim lama tidak ditemukan:', oldUserErr);
      return { success: false, error: 'Ketua tim lama tidak ditemukan.' };
    }
    const oldUnitKerja = oldUser?.unit_kerja || null;

    // 2. Ambil nama ketua tim baru untuk log atau verifikasi
    const { data: newUser, error: fetchError } = await adminDb()
      .from('users')
      .select('full_name, role')
      .eq('id', newUserId)
      .single();

    if (fetchError || !newUser) {
      return { success: false, error: 'Pengganti tidak ditemukan' };
    }

    // 2. Update rk_ketua_tim_mapping (HANYA tahun aktif, agar arsip tidak berubah)
    const { error: updateMappingError } = await adminDb()
      .from('rk_ketua_tim_mapping')
      .update({ ketua_tim_id: newUserId })
      .eq('ketua_tim_id', oldUserId)
      .eq('is_active', true);

    if (updateMappingError) throw updateMappingError;

    // 3. Jadikan ketua tim lama sebagai anggota (jika belum dideaktifasi)
    const { error: demoteError } = await adminDb()
      .from('users')
      .update({ role: 'anggota' })
      .eq('id', oldUserId)
      .eq('role', 'ketua_tim');
    
    if (demoteError) throw demoteError;

    // 4. Jadikan penggantinya sebagai ketua tim dan warisi nama tim (unit_kerja)
    const { error: promoteError } = await adminDb()
      .from('users')
      .update({ role: 'ketua_tim', unit_kerja: oldUnitKerja })
      .eq('id', newUserId);

    if (promoteError) throw promoteError;

    // 5. Update auth metadata for the new ketua_tim so their session reflects the new role
    // and also for old user.
    const meta1 = await adminDb().auth.admin.updateUserById(newUserId, { user_metadata: { role: 'ketua_tim' } });
    if (meta1.error) throw meta1.error;
    const meta2 = await adminDb().auth.admin.updateUserById(oldUserId, { user_metadata: { role: 'anggota' } });
    if (meta2.error) throw meta2.error;

    revalidatePath('/admin/pegawai');
    revalidatePath('/admin/rk');
    return { success: true };
  } catch (error: any) {
    console.error('[replaceKetuaTim] Error:', error);
    return { success: false, error: DB_ERROR_MESSAGE };
  }
}

export async function getAdminRkDataAction(tahun?: number) {
  // Read-only: cukup login. Halaman /rencana_kinerja memang bisa dilihat semua
  // role (read-only; tombol edit hanya admin) dan data RK bukan data sensitif.
  // Penulisan RK tetap admin-only lewat action terpisah (addRkMasterAction dll).
  // Service role dipakai agar sub-RK & tahun arsip terbaca utuh (bypass RLS).
  let sessionUserId: string | null = null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    sessionUserId = user?.id ?? null;
  } catch {
    sessionUserId = null;
  }
  if (!sessionUserId) {
    return {
      success: false,
      error: 'Sesi berakhir',
      rks: [],
      subsByRk: {},
      ketuaTims: [],
      years: [],
      activeYear: new Date().getFullYear(),
      selectedYear: tahun ?? new Date().getFullYear(),
    };
  }

  try {
    // 1. Semua tahun yang tersedia + tahun aktif (untuk filter tahun)
    const yearRows = await fetchAllRows<{ tahun: number | null; is_active: boolean }>((from, to) =>
      adminDb()
        .from('rk_ketua_tim_mapping')
        .select('tahun, is_active')
        .order('tahun', { ascending: true })
        .range(from, to)
    );

    const rows = yearRows;
    const years = Array.from(
      new Set(rows.map((r) => r.tahun).filter((t): t is number => typeof t === 'number'))
    ).sort((a, b) => b - a);
    const activeYear =
      rows
        .filter((r) => r.is_active && typeof r.tahun === 'number')
        .map((r) => r.tahun as number)
        .sort((a, b) => b - a)[0] ??
      years[0] ??
      new Date().getFullYear();
    const selectedYear = typeof tahun === 'number' && tahun > 0 ? tahun : activeYear;

    // 2. RK untuk tahun terpilih
    const rkList = await fetchAllRows<AdminRkListRow>((from, to) =>
      adminDb()
        .from('rk_ketua_tim_mapping')
        .select('*, ketua_tim:users!ketua_tim_id(full_name)')
        .eq('tahun', selectedYear)
        .order('tim_kerja', { ascending: true })
        .order('rencana_kinerja', { ascending: true })
        .order('id', { ascending: true })
        .range(from, to)
    );

    const ketuaTims = await fetchAllRows<AdminKetuaTimRow>((from, to) =>
      adminDb()
        .from('users')
        .select('id, full_name, unit_kerja')
        .in('role', ['ketua_tim', 'pimpinan', 'admin'])
        .order('id', { ascending: true })
        .range(from, to)
    );

    const rkIds = rkList.map((r) => r.id);

    // 3. Sub-RK khusus RK tahun terpilih (chunk agar aman URL-nya)
    const subs: any[] = [];
    for (let i = 0; i < rkIds.length; i += 150) {
      const chunk = rkIds.slice(i, i + 150);
      const chunkSubs = await fetchAllRows<AdminSubRkRow>((from, to) =>
        adminDb()
          .from('master_kegiatan_anggota')
          .select('*')
          .in('rk_id', chunk)
          .order('kegiatan_nama', { ascending: true })
          .order('id', { ascending: true })
          .range(from, to)
      );
      subs.push(...chunkSubs);
    }

    // Group Sub-RKs by rk_id with case-insensitive deduplication
    const subsByRk: Record<string, any[]> = {};
    for (const sub of subs) {
      if (!subsByRk[sub.rk_id]) subsByRk[sub.rk_id] = [];
      const isDuplicate = subsByRk[sub.rk_id].some(
        (existing: any) => existing.kegiatan_nama.trim().toLowerCase() === sub.kegiatan_nama.trim().toLowerCase()
      );
      if (!isDuplicate) {
        subsByRk[sub.rk_id].push(sub);
      }
    }

    // Defensive fallback: hanya untuk tahun AKTIF, jika RK di DB belum punya sub
    if (selectedYear === activeYear) {
      const normalize = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const mmMap = new Map<string, string[]>();
      (masterMappingDataRaw as Array<{ rk_ketua: string; sub_rk: string[] }>).forEach(item => {
        mmMap.set(normalize(item.rk_ketua), item.sub_rk || []);
      });

      for (const rk of rkList) {
        if (!subsByRk[rk.id] || subsByRk[rk.id].length === 0) {
          const fallbackSubs = mmMap.get(normalize(rk.rencana_kinerja));
          if (fallbackSubs && fallbackSubs.length > 0) {
            subsByRk[rk.id] = fallbackSubs.map((name, idx) => ({
              id: `fallback-${rk.id}-${idx}`,
              rk_id: rk.id,
              kegiatan_nama: name,
              is_fallback: true
            }));
          }
        }
      }
    }

    return {
      success: true,
      rks: rkList,
      subsByRk,
      ketuaTims,
      years,
      activeYear,
      selectedYear,
    };
  } catch (error: any) {
    console.error('[getAdminRkDataAction] Error:', error);
    return {
      success: false,
      error: DB_ERROR_MESSAGE,
      rks: [],
      subsByRk: {},
      ketuaTims: [],
      years: [],
      activeYear: new Date().getFullYear(),
      selectedYear: tahun ?? new Date().getFullYear(),
    };
  }
}

export async function addRkMasterAction(payload: { rencana_kinerja: string; tim_kerja: string; ketua_tim_id: string; created_by?: string; tahun?: number }) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { success: false, error: guard.error };
    const { data: activeYearRow } = await adminDb()
      .from('rk_ketua_tim_mapping')
      .select('tahun')
      .eq('is_active', true)
      .order('tahun', { ascending: false })
      .limit(1)
      .maybeSingle();
    const activeYear = activeYearRow?.tahun || new Date().getFullYear();
    // Bila tahun tak dikirim, pakai tahun aktif. RK yang ditambah ke tahun arsip -> nonaktif.
    const tahun = payload.tahun ?? activeYear;

    const { error } = await adminDb().from('rk_ketua_tim_mapping').insert({
      rencana_kinerja: payload.rencana_kinerja.trim(),
      tim_kerja: payload.tim_kerja.trim(),
      ketua_tim_id: payload.ketua_tim_id,
      created_by: payload.created_by || null,
      tahun,
      is_active: tahun === activeYear,
    });
    if (error) throw error;
    revalidatePath('/admin/rk');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addSubRkAction(payload: { rk_id: string; kegiatan_nama: string; user_id?: string }) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { success: false, error: guard.error };
    const { error } = await adminDb().from('master_kegiatan_anggota').insert({
      rk_id: payload.rk_id,
      kegiatan_nama: payload.kegiatan_nama.trim(),
      user_id: payload.user_id || guard.userId || null,
    });
    if (error) throw error;
    revalidatePath('/admin/rk');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function moveSubRkAction(subId: string, targetRkId: string) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { success: false, error: guard.error };
    const { error } = await adminDb()
      .from('master_kegiatan_anggota')
      .update({ rk_id: targetRkId })
      .eq('id', subId);
    if (error) throw error;
    revalidatePath('/admin/rk');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteRkOrSubAction(id: string, type: 'master' | 'sub') {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { success: false, error: guard.error };
    if (type === 'master') {
      const { error } = await adminDb().from('rk_ketua_tim_mapping').delete().eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await adminDb().from('master_kegiatan_anggota').delete().eq('id', id);
      if (error) throw error;
    }
    revalidatePath('/admin/rk');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================
// Bersih-bersih per TAHUN (arsip)
// ============================================================
export interface RkYearStats {
  tahun: number;
  rk: number;
  subs: number;
  assignments: number;
  entries: number;
}

/** Hitung berapa banyak objek yang terkait dengan sebuah tahun RK. */
export async function getRkYearStatsAction(tahun: number) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { success: false, error: guard.error };
    const { data: rks, error } = await adminDb()
      .from('rk_ketua_tim_mapping')
      .select('id')
      .eq('tahun', tahun);
    if (error) throw error;
    const ids = (rks || []).map((r: any) => r.id);

    let subs = 0;
    let assignments = 0;
    let entries = 0;
    const CH = 150;
    for (let i = 0; i < ids.length; i += CH) {
      const chunk = ids.slice(i, i + CH);
      const [s, a, e] = await Promise.all([
        adminDb().from('master_kegiatan_anggota').select('id', { count: 'exact', head: true }).in('rk_id', chunk),
        adminDb().from('user_rk_assignments').select('id', { count: 'exact', head: true }).in('rk_id', chunk),
        adminDb().from('ckp_entries').select('id', { count: 'exact', head: true }).in('rk_ketua_tim_id', chunk),
      ]);
      subs += s.count || 0;
      assignments += a.count || 0;
      entries += e.count || 0;
    }

    const stats: RkYearStats = { tahun, rk: ids.length, subs, assignments, entries };
    return { success: true, stats };
  } catch (error: any) {
    console.error('[getRkYearStatsAction] Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Hapus seluruh RK satu tahun (Sub-RK & penugasan ikut via CASCADE).
 * Tahun aktif tidak boleh dihapus. Bila masih ada entri CKP yang menunjuk
 * RK tahun tsb, wajib force=true (tautan entri akan jadi NULL).
 */
export async function deleteRkYearAction(tahun: number, force = false) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return { success: false, error: guard.error };
    const user = { id: guard.userId! };

    const { data: activeRow } = await adminDb()
      .from('rk_ketua_tim_mapping')
      .select('tahun')
      .eq('is_active', true)
      .order('tahun', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (activeRow?.tahun === tahun) {
      return { success: false, error: `Tahun ${tahun} sedang aktif dan tidak boleh dihapus.` };
    }

    const statsRes = await getRkYearStatsAction(tahun);
    const stats = statsRes.stats;
    if (!stats) return { success: false, error: statsRes.error || 'Gagal menghitung data.' };

    if (stats.entries > 0 && !force) {
      return {
        success: false,
        needsConfirm: true,
        stats,
        error: `${stats.entries} entri CKP menunjuk RK tahun ${tahun}. Tautan entri akan menjadi kosong bila tetap dihapus.`,
      };
    }

    const { error: delErr } = await adminDb()
      .from('rk_ketua_tim_mapping')
      .delete()
      .eq('tahun', tahun);
    if (delErr) throw delErr;

    // Pastikan selalu ada satu tahun aktif.
    const { data: stillActive } = await adminDb()
      .from('rk_ketua_tim_mapping')
      .select('tahun')
      .eq('is_active', true)
      .limit(1);
    if (!stillActive || stillActive.length === 0) {
      const { data: newest } = await adminDb()
        .from('rk_ketua_tim_mapping')
        .select('tahun')
        .order('tahun', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (newest?.tahun) {
        await adminDb()
          .from('rk_ketua_tim_mapping')
          .update({ is_active: true })
          .eq('tahun', newest.tahun);
      }
    }

    await adminDb().from('audit_logs').insert({
      user_id: user.id,
      action: 'rk_year_deleted',
      entity_type: 'rencana_kinerja',
      entity_id: null,
      old_data: { ...stats },
    });

    revalidatePath('/admin/rk');
    revalidatePath('/rencana_kinerja');
    revalidatePath('/', 'layout');
    return { success: true, stats };
  } catch (error: any) {
    console.error('[deleteRkYearAction] Error:', error);
    return { success: false, error: error.message };
  }
}

