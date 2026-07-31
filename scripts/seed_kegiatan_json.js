const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const env = envLocal.split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) acc[key.trim()] = value.join('=').trim();
  return acc;
}, {});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY. Please ensure .env.local exists.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function normalize(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function main() {
  const data = JSON.parse(fs.readFileSync('data_rk.json', 'utf8'));
  console.log(`Loaded ${data.length} employees from JSON`);

  // 1. Fetch users
  const { data: users, error: usersErr } = await supabase.from('users').select('id, full_name, unit_kerja');
  if (usersErr) throw usersErr;
  
  // 2. Fetch RK mappings
  const { data: rks, error: rksErr } = await supabase.from('rk_ketua_tim_mapping').select('id, rencana_kinerja, tim_kerja');
  if (rksErr) throw rksErr;

  const userMap = new Map();
  users.forEach(u => userMap.set(normalize(u.full_name), u));

  const rkMap = new Map();
  rks.forEach(r => rkMap.set(normalize(r.rencana_kinerja), r));

  let totalInsertedKegiatan = 0;
  let totalMissingUsers = 0;
  let totalMissingRks = 0;
  
  for (const emp of data) {
    const empNameNorm = normalize(emp.nama_pegawai);
    const dbUser = userMap.get(empNameNorm);
    
    if (!dbUser) {
      console.log(`Warning: User not found in DB: ${emp.nama_pegawai}`);
      totalMissingUsers++;
      continue;
    }
    const userId = dbUser.id;

    for (const group of emp.kegiatan_terkelompok) {
      const rkNameNorm = normalize(group.rk_ketua);
      let rkObj = rkMap.get(rkNameNorm);
      
      let rkId;
      if (!rkObj) {
        console.log(`Warning: RK not found in DB: "${group.rk_ketua}". Inserting it newly...`);
        // We insert a new RK mapping
        const { data: newRk, error: insRkErr } = await supabase.from('rk_ketua_tim_mapping').insert({
          rencana_kinerja: group.rk_ketua.trim(),
          tim_kerja: dbUser.unit_kerja || 'Umum',
          created_by: userId
        }).select('id, rencana_kinerja, tim_kerja').single();
        
        if (insRkErr) {
          console.error(`Failed to insert new RK: ${group.rk_ketua}`, insRkErr.message);
          totalMissingRks++;
          continue;
        }
        rkId = newRk.id;
        rkMap.set(rkNameNorm, newRk);
      } else {
        rkId = rkObj.id;
      }
      
      // Upsert into master_kegiatan_anggota
      const kegiatanInserts = group.kegiatan_anggota.map(keg => ({
        rk_id: rkId,
        user_id: userId,
        kegiatan_nama: keg.trim()
      }));
      
      if (kegiatanInserts.length > 0) {
        const { error: insErr } = await supabase.from('master_kegiatan_anggota').upsert(
          kegiatanInserts, 
          { onConflict: 'rk_id, user_id, kegiatan_nama' }
        );
        if (insErr) {
          console.error(`Error inserting kegiatan for ${emp.nama_pegawai}:`, insErr.message);
        } else {
          totalInsertedKegiatan += kegiatanInserts.length;
        }
      }
      
      // Ensure user is assigned to this RK
      const { error: assignErr } = await supabase.from('user_rk_assignments').upsert(
        { rk_id: rkId, user_id: userId },
        { onConflict: 'rk_id, user_id' }
      );
      if (assignErr) {
         console.error('Error assigning user to rk:', assignErr.message);
      }
    }
  }

  console.log(`\n============================`);
  console.log(`Done! Summary:`);
  console.log(`- Users missing from DB: ${totalMissingUsers}`);
  console.log(`- RK missing and failed to insert: ${totalMissingRks}`);
  console.log(`- Total Kegiatan Anggota saved to DB: ${totalInsertedKegiatan}`);
  console.log(`============================\n`);
}

main().catch(console.error);
