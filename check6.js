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

  const { data: users, error: uError } = await supabase.from('users').select('id, full_name');
  console.log('Seraman fetched users length:', users?.length, 'Error:', uError);
}
check();
