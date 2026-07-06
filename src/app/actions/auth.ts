"use server";

import { createClient } from "@supabase/supabase-js";

export async function resetPasswordDirectAction(email: string, newPassword: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return { success: false, error: "Konfigurasi server tidak lengkap." };
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Get user id from public.users table by email
    const { data: users, error: dbError } = await supabaseAdmin
      .from("users")
      .select("id")
      .ilike("email", email.trim())
      .limit(1);

    if (dbError) {
      console.error("DB Error:", dbError);
      return { success: false, error: "Terjadi kesalahan database (mungkin Service Role Key tidak valid)." };
    }

    if (!users || users.length === 0) {
      return { success: false, error: "Email tidak ditemukan." };
    }

    const userId = users[0].id;

    // 2. Update password in auth.users using admin api
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Auth Admin Error:", updateError);
      return { success: false, error: "Gagal mengupdate password: " + updateError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Action Error:", err);
    return { success: false, error: err.message || "Terjadi kesalahan tidak terduga" };
  }
}
