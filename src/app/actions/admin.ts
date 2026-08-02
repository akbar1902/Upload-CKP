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
    
    // 2. Hapus referensi dari approvals untuk upload milik user ini
    if (uploads && uploads.length > 0) {
      const uploadIds = uploads.map(u => u.id);
      await supabaseAdmin.from('approvals').delete().in('upload_id', uploadIds);
      await supabaseAdmin.from('ckp_entries').delete().in('upload_id', uploadIds);
      await supabaseAdmin.from('ckp_uploads').delete().eq('user_id', userId);
    }

    // 3. Hapus data yang dimiliki user secara langsung
    await supabaseAdmin.from('user_rk_assignments').delete().eq('user_id', userId);
    await supabaseAdmin.from('audit_logs').delete().eq('user_id', userId);
    await supabaseAdmin.from('employee_profiles').delete().eq('user_id', userId);
    await supabaseAdmin.from('approvals').delete().eq('reviewer_id', userId);
    
    // 4. Nullify referensi di tabel lain (karena foreign key mungkin mencegah delete)
    await supabaseAdmin.from('rk_ketua_tim_mapping').update({ ketua_tim_id: null }).eq('ketua_tim_id', userId);
    await supabaseAdmin.from('ckp_uploads').update({ approved_by: null }).eq('approved_by', userId);
    await supabaseAdmin.from('ckp_entries').update({ dinilai_oleh: null }).eq('dinilai_oleh', userId);
    await supabaseAdmin.from('periode_ckp').update({ locked_by: null }).eq('locked_by', userId);
    await supabaseAdmin.from('user_rk_assignments').update({ assigned_by: null }).eq('assigned_by', userId);

    // Hapus dari public.users
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
    
    let processedMaster = 0;
    let processedSub = 0;

    // Group by rk_utama
    const rkGroups: Record<string, any[]> = {};
    for (const row of data) {
      const rk = row.rk_utama?.trim() || row.rencana_kinerja?.trim();
      if (!rk) continue;
      if (!rkGroups[rk]) rkGroups[rk] = [];
      rkGroups[rk].push(row);
    }

    // Fetch all existing mappings to inherit ketua_tim_id for existing teams
    const { data: existingMappings } = await supabase.from('rk_ketua_tim_mapping').select('tim_kerja, ketua_tim_id').not('ketua_tim_id', 'is', null);
    const timKerjaToKetuaId: Record<string, string> = {};
    if (existingMappings) {
      existingMappings.forEach(m => {
        if (m.tim_kerja && m.ketua_tim_id) {
           timKerjaToKetuaId[m.tim_kerja] = m.ketua_tim_id;
        }
      });
    }

    for (const rk of Object.keys(rkGroups)) {
      const rows = rkGroups[rk];
      
      const timKerja = rows[0].tim_kerja?.trim() || rows[0].tim?.trim() || null;
      
      const payload: any = {
        rencana_kinerja: rk,
        tim_kerja: timKerja
      };

      // Auto inherit ketua_tim_id if it exists for this team
      if (timKerja && timKerjaToKetuaId[timKerja]) {
        payload.ketua_tim_id = timKerjaToKetuaId[timKerja];
      }
      
      // Upsert the Master RK
      const { data: upsertData, error: upsertError } = await supabase.from('rk_ketua_tim_mapping').upsert(
        payload, 
        { onConflict: 'rencana_kinerja,tim_kerja' }
      ).select().single();

      if (upsertError) {
        console.error("Upsert Master RK error:", upsertError);
        throw new Error(upsertError.message);
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
         const { data: existingSubs } = await supabase.from('master_kegiatan_anggota').select('kegiatan_nama').eq('rk_id', upsertData.id);
         const existingSubNames = new Set((existingSubs || []).map(s => s.kegiatan_nama));
         
         const toInsert = Array.from(subRks)
            .filter(sub => !existingSubNames.has(sub))
            .map(sub => ({
               rk_id: upsertData.id,
               kegiatan_nama: sub,
               user_id: adminId // Store who added it
            }));
            
         if (toInsert.length > 0) {
            const { error: subError } = await supabase.from('master_kegiatan_anggota').insert(toInsert);
            if (subError) console.error("Insert Sub RK error:", subError);
            else processedSub += toInsert.length;
         }
      }
    }

    revalidatePath('/admin/rk');
    return { success: true, processed: processedMaster, processedSub };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
