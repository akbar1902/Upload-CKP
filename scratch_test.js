const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
        .from('ckp_uploads')
        .select('*, user:user_id(id, full_name, nip, unit_kerja), entries:ckp_entries(nilai, rencana_kinerja)')
        .eq('status', 'submitted')
        .limit(1);
        
  console.log('Error:', error);
  console.log('Data:', data ? 'Success' : 'None');
}
test();
