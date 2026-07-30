"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from '@/lib/supabase/server';

// We use the service role key to bypass RLS and perform admin actions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function createEmployee(data: any) {
  try {
    // 1. Create user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.full_name,
      }
    });

    if (authError) {
      console.error("Auth error:", authError);
      return { success: false, error: authError.message };
    }

    const userId = authData.user.id;

    // 2. Insert into public.users (if it doesn't auto-sync via trigger)
    // Wait, let's check if there's a trigger. In previous files, usually there's no trigger or there is.
    // Assuming we insert manually just in case, but usually there's a trigger on auth.users.
    // Let's explicitly insert/update public.users
    const { error: dbError } = await supabaseAdmin.from('users').upsert({
      id: userId,
      email: data.email,
      full_name: data.full_name,
      nip: data.nip,
      role: data.role,
      unit_kerja: data.unit_kerja,
      is_active: true,
    });

    if (dbError) {
      console.error("DB error:", dbError);
      return { success: false, error: dbError.message };
    }

    revalidatePath('/admin/pegawai');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteEmployee(userId: string) {
  try {
    // 1. Ambil semua upload_id milik user ini
    const { data: uploads } = await supabaseAdmin.from('ckp_uploads').select('id').eq('user_id', userId);
    
    // 2. Hapus entri CKP yang terkait dengan upload milik user ini
    if (uploads && uploads.length > 0) {
      const uploadIds = uploads.map(u => u.id);
      // Hapus per batch atau langsung dengan .in()
      await supabaseAdmin.from('ckp_entries').delete().in('upload_id', uploadIds);
      // Hapus uploads
      await supabaseAdmin.from('ckp_uploads').delete().eq('user_id', userId);
    }

    // 3. Hapus data terkait lainnya secara manual untuk menghindari error Foreign Key
    await supabaseAdmin.from('user_rk_assignments').delete().eq('user_id', userId);
    await supabaseAdmin.from('rk_ketua_tim_mapping').update({ ketua_tim_id: null }).eq('ketua_tim_id', userId);
    await supabaseAdmin.from('audit_logs').delete().eq('user_id', userId);
    
    // Hapus dari public.users jika trigger tidak menangani cascade
    await supabaseAdmin.from('users').delete().eq('id', userId);

    // Terakhir, hapus dari auth.users
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/pegawai');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resetPassword(userId: string) {
  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: "Password123!"
    });
    
    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: "Password berhasil direset menjadi Password123!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function togglePeriodeLock(bulan: number, tahun: number, is_locked: boolean, adminId: string) {
  try {
    const { error } = await supabaseAdmin.from('periode_ckp').upsert({
      bulan,
      tahun,
      is_locked,
      locked_by: adminId,
      locked_at: new Date().toISOString()
    }, { onConflict: 'bulan,tahun' });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/periode');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function uploadRencanaKinerjaBulk(data: any[], adminId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Group data by rencana_kinerja
    const rkGroups: Record<string, any[]> = {};
    for (const row of data) {
      const rk = row.rencana_kinerja?.trim();
      if (!rk) continue;
      if (!rkGroups[rk]) rkGroups[rk] = [];
      rkGroups[rk].push(row);
    }

    let processed = 0;

    for (const rk of Object.keys(rkGroups)) {
      const rows = rkGroups[rk];
      
      // Find the row marked as 'Ketua Tim' or 'Ketua'
      const ketuaRow = rows.find((r: any) => r.status?.trim().toLowerCase() === 'ketua tim' || r.status?.trim().toLowerCase() === 'ketua');
      // If no ketua tim row, just use the first row's tim_kerja
      const timKerja = ketuaRow?.tim_kerja || rows[0].tim_kerja || null;

      let ketuaTimId = null;
      if (ketuaRow && ketuaRow.nama) {
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .ilike('full_name', `%${ketuaRow.nama.trim()}%`)
          .limit(1)
          .single();
        if (user) ketuaTimId = user.id;
      }

      // Upsert the RK mapping
      const { data: upsertData, error: upsertError } = await supabase.from('rk_ketua_tim_mapping').upsert({
        rencana_kinerja: rk,
        ketua_tim_id: ketuaTimId,
        tim_kerja: timKerja
      }, { onConflict: 'rencana_kinerja,tim_kerja' }).select().single();

      if (upsertError) {
        console.error("Upsert error:", upsertError);
        throw new Error(upsertError.message);
      }

      // Now process assignments (everyone who is NOT explicitly a Ketua Tim is considered Anggota)
      // We will first wipe existing assignments for this RK so the excel serves as the source of truth
      await supabase.from('user_rk_assignments').delete().eq('rk_id', upsertData.id);

      const anggotaRows = rows.filter((r: any) => r.status?.trim().toLowerCase() !== 'ketua tim' && r.status?.trim().toLowerCase() !== 'ketua');
      
      for (const ang of anggotaRows) {
        if (!ang.nama) continue;
        const { data: u } = await supabase
          .from('users')
          .select('id')
          .ilike('full_name', `%${ang.nama.trim()}%`)
          .limit(1)
          .single();

        if (u) {
          await supabase.from('user_rk_assignments').insert({
            rk_id: upsertData.id,
            user_id: u.id,
            assigned_by: adminId
          });
        }
      }

      processed++;
    }

    revalidatePath('/admin/rk');
    return { success: true, processed };
  } catch (error: any) {
    console.error("Bulk upload error:", error);
    return { success: false, error: error.message };
  }
}
