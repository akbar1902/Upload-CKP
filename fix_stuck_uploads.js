const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
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
  const { data: uploads, error: uError } = await supabase
    .from('ckp_uploads')
    .select('id, user_id, status, user:users!ckp_uploads_user_id_fkey(full_name)')
    .eq('status', 'submitted');
    
  if (uError) {
    console.error(uError);
    return;
  }
  
  const uploadIds = uploads.map(u => u.id);
  if (uploadIds.length === 0) {
    console.log('No submitted uploads');
    return;
  }

  const { data: entries, error: eError } = await supabase
    .from('ckp_entries')
    .select('upload_id, rencana_kinerja, nilai')
    .in('upload_id', uploadIds);
    
  if (eError) {
    console.error(eError);
    return;
  }
  
  const entriesByUpload = new Map();
  entries.forEach(e => {
    if (!entriesByUpload.has(e.upload_id)) entriesByUpload.set(e.upload_id, []);
    entriesByUpload.get(e.upload_id).push(e);
  });
  
  const toUpdate = [];
  
  uploads.forEach(u => {
    const uEntries = entriesByUpload.get(u.id) || [];
    const rks = new Set(uEntries.map(e => e.rencana_kinerja || 'Tidak Diketahui'));
    
    let allScored = false;
    if (rks.size > 0) {
       const rkGroups = Array.from(rks).map(rk => {
          const e = uEntries.find(en => (en.rencana_kinerja || 'Tidak Diketahui') === rk);
          return e ? e.nilai : null;
       });
       allScored = rkGroups.every(score => score !== null);
    }
    
    if (allScored && uEntries.length > 0) {
       console.log(`Upload ${u.id} (${u.user?.full_name}) is fully scored but status is 'submitted'.`);
       toUpdate.push(u.id);
    }
  });
  
  console.log(`Found ${toUpdate.length} uploads to fix.`);
  
  if (toUpdate.length > 0) {
    const { error: updErr } = await supabase
      .from('ckp_uploads')
      .update({ status: 'scored' })
      .in('id', toUpdate);
      
    if (updErr) console.error('Error updating:', updErr);
    else console.log('Successfully updated to scored!');
  }
}

main();
