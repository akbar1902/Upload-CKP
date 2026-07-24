import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RencanaKinerjaClient } from "./_client";

export const metadata = {
  title: "Manajemen Rencana Kinerja",
};

export default async function RencanaKinerjaPage() {
  const supabase = await createServerSupabaseClient();
  // 1. Dapatkan info auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Fetch data independen secara paralel
  const [
    currentUserRes,
    allRKsRes,
    myAssignmentsRes,
    allUsersRes
  ] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('rk_ketua_tim_mapping').select('*, ketua_tim:users!ketua_tim_id(full_name)').order('rencana_kinerja', { ascending: true }),
    supabase.from('user_rk_assignments').select('id, rk:rk_ketua_tim_mapping!rk_id(id, rencana_kinerja, tim_kerja), assigned_by_user:users!assigned_by(full_name)').eq('user_id', user.id),
    supabase.from('users').select('id, full_name, role').order('full_name', { ascending: true })
  ]);

  const currentUser = currentUserRes.data;
  const allRKs = allRKsRes.data;
  const myAssignments = myAssignmentsRes.data;
  const allUsers = allUsersRes.data;

  const isKetuaTimOrAdmin = ['ketua_tim', 'pimpinan', 'admin'].includes(currentUser?.role || '');

  // 3. Fetch data yang bergantung pada role (jika ada)
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

  // 4. Fetch audit logs (History)
  const { data: auditLogsRes } = await supabase
    .from('audit_logs')
    .select('*, user:users(full_name, role)')
    .eq('entity_type', 'rencana_kinerja')
    .order('created_at', { ascending: false })
    .limit(100);

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
      auditLogs={auditLogsRes || []}
    />
  );
}
