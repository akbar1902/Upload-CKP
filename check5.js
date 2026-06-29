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
  const akbar = users.find(u => u.full_name.toLowerCase().includes('yusman'));

  const { data: uploads } = await supabase.from('ckp_uploads').select('id, bulan, status').eq('user_id', akbar.id);
  const { data: entries } = await supabase.from('ckp_entries').select('rencana_kinerja').in('upload_id', uploads.map(u => u.id));
  const akbarRks = [...new Set(entries.map(e => e.rencana_kinerja))];
  
  const { data: mappings } = await supabase.from('rk_ketua_tim_mapping').select('*');
  const seraman = users.find(u => String(u.full_name).includes('Seraman'));
  const seramanRks = mappings.filter(m => m.ketua_tim_id === seraman.id).map(m => m.rencana_kinerja);

  const overlap = akbarRks.filter(rk => seramanRks.includes(rk));
  console.log('Overlap RKs between Akbarrullah Yusman and Seraman:', overlap);
  
  if (overlap.length === 0) {
     const skgbAkbar = akbarRks.filter(rk => rk.includes('SKGB'));
     console.log('Akbarrullah SKGB Uploads:', skgbAkbar);
     const skgbSeraman = seramanRks.filter(rk => rk.includes('SKGB'));
     console.log('Seraman SKGB Mappings:', skgbSeraman);
  }
}
check();
