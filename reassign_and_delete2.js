const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const dummyId = '41c417b8-b25c-4d8b-9b1b-1a7fc4a1c600';
  const baiqId = '568729d6-dd67-45fe-859d-afb8f1f1a192';

  console.log(`Reassigning audit_logs from ${dummyId} to ${baiqId}...`);

  const { error: e7 } = await supabase.from('audit_logs').update({ user_id: baiqId }).eq('user_id', dummyId);
  if (e7) console.error('audit_logs.user_id error:', e7.message);

  console.log('Now deleting dummy...');
  
  const { error: delErr } = await supabase.from('users').delete().eq('id', dummyId);
  if (delErr) {
    console.error('Delete error:', delErr);
  } else {
    console.log('Dummy user successfully deleted.');
  }
}

main();
