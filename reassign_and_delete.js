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

  console.log(`Reassigning references from ${dummyId} to ${baiqId}...`);

  const { error: e1 } = await supabase.from('ckp_uploads').update({ user_id: baiqId }).eq('user_id', dummyId);
  if (e1) console.error('ckp_uploads.user_id error:', e1.message);

  const { error: e2 } = await supabase.from('ckp_uploads').update({ approved_by: baiqId }).eq('approved_by', dummyId);
  if (e2) console.error('ckp_uploads.approved_by error:', e2.message);

  const { error: e3 } = await supabase.from('ckp_entries').update({ dinilai_oleh: baiqId }).eq('dinilai_oleh', dummyId);
  if (e3) console.error('ckp_entries.dinilai_oleh error:', e3.message);

  const { error: e4 } = await supabase.from('approvals').update({ reviewer_id: baiqId }).eq('reviewer_id', dummyId);
  if (e4) console.error('approvals.reviewer_id error:', e4.message);

  const { error: e5 } = await supabase.from('rk_ketua_tim_mapping').update({ ketua_tim_id: baiqId }).eq('ketua_tim_id', dummyId);
  if (e5) console.error('rk_ketua_tim_mapping.ketua_tim_id error:', e5.message);

  // Note: user_rk_assignments has a unique constraint on (user_id, rk_id).
  // Blindly updating might violate it. I will just delete dummy's assignments since Baiq is Pimpinan anyway.
  const { error: e6 } = await supabase.from('user_rk_assignments').delete().eq('user_id', dummyId);
  if (e6) console.error('user_rk_assignments.delete error:', e6.message);

  console.log('Reassignment finished. Now deleting dummy...');
  
  const { error: delErr } = await supabase.from('users').delete().eq('id', dummyId);
  if (delErr) {
    console.error('Delete error:', delErr);
  } else {
    console.log('Dummy user successfully deleted.');
  }
}

main();
