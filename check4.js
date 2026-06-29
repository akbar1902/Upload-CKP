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
    email: 'baiqk@bps.go.id',
    password: 'BPS@2026'
  });

  const { data: users } = await supabase.from('users').select('id, full_name, email');
  const akbar = users.find(u => u.full_name.toLowerCase().includes('akbar'));

  const { data: uploads } = await supabase.from('ckp_uploads').select('id, bulan, status').eq('user_id', akbar.id);
  const { data: entries } = await supabase.from('ckp_entries').select('rencana_kinerja').in('upload_id', uploads.map(u => u.id));
  
  const skgb = entries.filter(e => String(e.rencana_kinerja).includes('SKGB'));
  console.log('Akbar SKGB entries:', skgb);

  const { data: mappings } = await supabase.from('rk_ketua_tim_mapping').select('*').ilike('rencana_kinerja', '%SKGB%');
  console.log('Mapping SKGBs:', mappings);
}
check();
