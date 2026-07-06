import { createClient } from "@supabase/supabase-js";

async function test() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log("URL:", supabaseUrl);
  console.log("Service Key starts with:", supabaseServiceKey?.substring(0, 10));
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabaseAdmin.from("users").select("id, email").eq("email", "muh.akbar@bps.go.id");
  console.log("public.users lookup:", data, error);

  // also try auth.admin
  try {
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    console.log("auth.users lookup:", authUsers?.users?.find(u => u.email === 'muh.akbar@bps.go.id')?.id, authError);
  } catch (e) {
    console.log("auth.admin.listUsers threw an error:", e.message);
  }
}
test();
