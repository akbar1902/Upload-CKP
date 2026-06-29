const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/^['"]|['"]$/g, '');
  return acc;
}, {});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email: 'seraman@bps.go.id',
    password: 'BPS@2026'
  });

  const { data: mappingData } = await supabase.from('rk_ketua_tim_mapping').select('rencana_kinerja').eq('ketua_tim_id', session.user.id);
  const rkList = mappingData.map(m => m.rencana_kinerja);
  console.log('Seraman mapping rkList length:', rkList.length);
  
  if (rkList.length > 0) {
    const { data: entries, error: entriesError } = await supabase.from('ckp_entries').select('upload_id, rencana_kinerja').in('rencana_kinerja', rkList);
    console.log('Entries fetched for these RKs:', entries?.length, 'Error:', entriesError);
    if (entries?.length) console.log('Found:', entries);
  }
}
check();
