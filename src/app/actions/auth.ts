"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

/** Pesan netral — tidak membocorkan apakah email terdaftar atau tidak. */
const NEUTRAL_RESET_MESSAGE = "Jika email terdaftar, tautan reset telah dikirim.";

/**
 * Resolusi origin untuk `redirectTo` tautan reset.
 * Prioritas: NEXT_PUBLIC_SITE_URL → header request (x-forwarded-host/host)
 * → fallback http://localhost:3000.
 */
async function resolveOrigin(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) return envUrl.replace(/\/+$/, "");

  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    if (host) {
      const proto = h.get("x-forwarded-proto") || "http";
      return `${proto}://${host}`;
    }
  } catch (err) {
    console.warn("[requestPasswordResetAction] Gagal membaca header request:", err);
  }

  return "http://localhost:3000";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Kirim tautan reset password via Supabase Auth (alur standar).
 *
 * Keamanan: memakai client ANON tanpa session + `resetPasswordForEmail`
 * sehingga password TIDAK PERNAH diubah langsung dari server. Ini menutup
 * celah account takeover pada aksi lama `resetPasswordDirectAction`.
 *
 * Anti-enumeration: hasil selalu `{ success: true }` dengan pesan netral,
 * apa pun status email (terdaftar / tidak / error kirim). Detail error
 * hanya dicatat ke console server.
 */
export async function requestPasswordResetAction(email: string) {
  try {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
      return { success: false, error: "Masukkan alamat email yang valid." };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("[requestPasswordResetAction] Konfigurasi Supabase tidak lengkap.");
      return { success: false, error: "Konfigurasi server tidak lengkap." };
    }

    const origin = await resolveOrigin();

    // Client anon sekali-pakai: tanpa session, tanpa refresh token.
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${origin}/reset-password`,
    });

    if (error) {
      // Jangan bocorkan ke client — cukup catat untuk admin/SMTP monitoring.
      console.warn(
        "[requestPasswordResetAction] resetPasswordForEmail gagal:",
        error.message
      );
    }

    return { success: true, message: NEUTRAL_RESET_MESSAGE };
  } catch (err) {
    console.error("[requestPasswordResetAction] Error:", err);
    return { success: true, message: NEUTRAL_RESET_MESSAGE };
  }
}
