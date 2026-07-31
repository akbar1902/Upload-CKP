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

const supabase = createClient(supabaseUrl, supabaseKey);

function normalize(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return 0;
  let bg1 = new Set();
  for(let i=0; i<s1.length-1; i++) bg1.add(s1.substring(i, i+2));
  let bg2 = new Set();
  for(let i=0; i<s2.length-1; i++) bg2.add(s2.substring(i, i+2));
  let intersection = 0;
  for(let item of bg1) if (bg2.has(item)) intersection++;
  return (2.0 * intersection) / (bg1.size + bg2.size);
}

async function run() { 
  console.log('Starting absolute final cleanup...');
  const data = JSON.parse(fs.readFileSync('data_rk.json', 'utf8'));
  const allMasterRKs = new Map(); // rk_ketua -> array of sub-activities
  for (const emp of data) {
     for (const group of emp.kegiatan_terkelompok) {
        const rk = group.rk_ketua.trim();
        if (!allMasterRKs.has(rk)) allMasterRKs.set(rk, new Set());
        group.kegiatan_anggota.forEach(k => allMasterRKs.get(rk).add(k.trim()));
     }
  }

  const { data: dbRKs } = await supabase.from('rk_ketua_tim_mapping').select('id, rencana_kinerja');
  const rkIdToName = new Map(dbRKs.map(r => [r.id, r.rencana_kinerja]));

  let uploads = [];
  let from = 0;
  while(true) {
     const { data: chunk } = await supabase.from('ckp_uploads').select('id, user_id').range(from, from+999);
     if (!chunk || chunk.length === 0) break;
     uploads.push(...chunk);
     from += 1000;
  }
  const uploadToUser = new Map(uploads.map(u => [u.id, u.user_id]));

  let assignments = [];
  from = 0;
  while(true) {
     const { data: chunk } = await supabase.from('user_rk_assignments').select('user_id, rk_id').range(from, from+999);
     if (!chunk || chunk.length === 0) break;
     assignments.push(...chunk);
     from += 1000;
  }
  const userAssignments = new Map();
  for (const a of assignments) {
     if (!userAssignments.has(a.user_id)) userAssignments.set(a.user_id, new Set());
     userAssignments.get(a.user_id).add(rkIdToName.get(a.rk_id));
  }

  let entries = [];
  from = 0;
  while(true) {
     const { data: chunk } = await supabase.from('ckp_entries').select('id, upload_id, rencana_kinerja, kegiatan, nilai').range(from, from+999);
     if (!chunk || chunk.length === 0) break;
     entries.push(...chunk);
     from += 1000;
  }
  
  let changes = [];
  
  for (const entry of entries) {
     const userId = uploadToUser.get(entry.upload_id);
     const assignedRkNames = userAssignments.get(userId) || new Set();
     
     if (assignedRkNames.size === 0) {
        continue;
     }

     const strToMatch = [entry.kegiatan, entry.rencana_kinerja].filter(Boolean);
     let bestScore = 0;
     let bestMasterRK = null;

     for (const rkName of assignedRkNames) {
        const subActivities = allMasterRKs.get(rkName) || new Set();
        // Also add the Master RK name itself
        subActivities.add(rkName);
        
        for (const sub of subActivities) {
           for (const input of strToMatch) {
              const score = getSimilarity(normalize(input), normalize(sub));
              if (score > bestScore) {
                 bestScore = score;
                 bestMasterRK = rkName;
              }
           }
        }
     }
     
     if (bestScore > 0.1 && bestMasterRK !== entry.rencana_kinerja) {
         changes.push({ id: entry.id, rencana_kinerja: bestMasterRK });
     }
  }

  console.log('Found changes:', changes.length);
  
  if (changes.length > 0) {
     let updated = 0;
     for (const change of changes) {
        const { error } = await supabase.from('ckp_entries').update({ rencana_kinerja: change.rencana_kinerja }).eq('id', change.id);
        if (error) {
           console.error('Error updating', change.id, error);
        } else {
           updated++;
        }
     }
     console.log('Successfully updated', updated);
  }
  
  // Re-average the values now that they are grouped properly
  console.log('Re-averaging values for all true Master RK groups...');
  
  // Re-fetch grouped entries
  let allEntries = [];
  from = 0;
  while(true) {
     const { data: chunk } = await supabase.from('ckp_entries').select('id, upload_id, rencana_kinerja, nilai').range(from, from+999);
     if (!chunk || chunk.length === 0) break;
     allEntries.push(...chunk);
     from += 1000;
  }
  
  const groupedEntries = new Map();
  for (const e of allEntries) {
     const key = `${e.upload_id}_|_${e.rencana_kinerja}`;
     if (!groupedEntries.has(key)) groupedEntries.set(key, []);
     groupedEntries.get(key).push(e);
  }
  
  let averageChanges = [];
  for (const [groupKey, list] of groupedEntries.entries()) {
     let sumScore = 0;
     let gradedCount = 0;
     list.forEach(e => {
        if (e.nilai !== null) {
           sumScore += e.nilai;
           gradedCount++;
        }
     });
     let finalScore = null;
     if (gradedCount > 0) {
        finalScore = Math.round(sumScore / gradedCount);
     }
     
     list.forEach(e => {
        if (e.nilai !== finalScore) {
           averageChanges.push({ id: e.id, nilai: finalScore });
        }
     });
  }
  
  console.log('Found average discrepancies:', averageChanges.length);
  if (averageChanges.length > 0) {
     let updatedAvg = 0;
     for (const change of averageChanges) {
        const { error } = await supabase.from('ckp_entries').update({ nilai: change.nilai }).eq('id', change.id);
        if (!error) updatedAvg++;
     }
     console.log('Successfully updated averages:', updatedAvg);
  }

  console.log('Cleanup completed!');
}

run().catch(console.error);
