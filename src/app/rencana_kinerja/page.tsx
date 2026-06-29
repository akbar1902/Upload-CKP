import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RencanaKinerjaClient } from "./_client";

export const metadata = {
  title: "Manajemen Rencana Kinerja",
};

export default async function RencanaKinerjaPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Ambil data user saat ini untuk cek role
  const { data: currentUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const isKetuaTimOrAdmin = ['ketua_tim', 'pimpinan', 'admin'].includes(currentUser?.role || '');

  // Fetch semua RK (Kamus Global) untuk dropdown tambah ke akun
  const { data: allRKs } = await supabase
    .from('rk_ketua_tim_mapping')
    .select('*, ketua_tim:users!ketua_tim_id(full_name)')
    .order('rencana_kinerja', { ascending: true });

  // Fetch RK yang ditugaskan ke user ini (RK Saya)
  const { data: myAssignments } = await supabase
    .from('user_rk_assignments')
    .select('id, rk:rk_ketua_tim_mapping!rk_id(id, rencana_kinerja, tim_kerja), assigned_by_user:users!assigned_by(full_name)')
    .eq('user_id', user.id);

  // Fetch RK yang dibuat/dimanage oleh user ini (jika Ketua Tim)
  let myManagedRKs: any[] = [];
  if (isKetuaTimOrAdmin) {
    const { data } = await supabase
      .from('rk_ketua_tim_mapping')
      .select(`
        *,
        assignments:user_rk_assignments(
          user_id,
          users!user_id(full_name)
        )
      `)
      .or(`created_by.eq.${user.id},ketua_tim_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
    myManagedRKs = data || [];
  }

  // Fetch daftar seluruh pegawai untuk dropdown penugasan
  const { data: allUsers } = await supabase
    .from('users')
    .select('id, full_name, role')
    .order('full_name', { ascending: true });

  // Ambil daftar unik tim_kerja untuk autocomplete
  const timKerjaList = Array.from(new Set((allRKs || []).map(rk => rk.tim_kerja).filter(Boolean)));

  return (
    <RencanaKinerjaClient 
      currentUser={currentUser}
      allRKs={allRKs || []}
      myAssignments={myAssignments || []}
      myManagedRKs={myManagedRKs}
      allUsers={allUsers || []}
      timKerjaList={timKerjaList}
    />
  );
}
