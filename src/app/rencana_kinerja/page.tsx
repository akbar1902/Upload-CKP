import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAdminRkDataAction } from "@/app/actions/admin";
import { RkManagementView } from "@/components/rk/rk-management-view";

export const metadata = {
  title: "Rencana Kinerja",
};

export default async function RencanaKinerjaPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  // Tampilan sama untuk semua akun; hanya admin yang bisa mengubah.
  const { data: me } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const canEdit = me?.role === "admin";

  const initialData = await getAdminRkDataAction();

  return <RkManagementView initialData={initialData} canEdit={canEdit} />;
}
