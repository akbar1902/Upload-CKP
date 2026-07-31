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

function fuzzyMatch(input, arrayStr, threshold = 0.85) {
  const normInput = normalize(input);
  if (!normInput) return null;
  let bestMatch = null;
  let bestScore = 0;
  for (const str of arrayStr) {
    const normStr = normalize(str);
    if (normStr === normInput) return str;
    const score = getSimilarity(normInput, normStr);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = str;
    }
  }
  if (bestScore >= threshold) return bestMatch;
  return null;
}

async function main() {
  console.log('Starting FINAL targeted data cleanup fix...');
  
  const data = JSON.parse(fs.readFileSync('data_rk.json', 'utf8'));
  const jsonUserNames = data.map(d => d.nama_pegawai);
  
  let ckpEntries = [];
  let from = 0;
  while (true) {
    const { data: chunk } = await supabase.from('ckp_entries').select('*').range(from, from + 999);
    if (!chunk || chunk.length === 0) break;
    ckpEntries.push(...chunk);
    from += 1000;
  }
  
  const { data: uploads } = await supabase.from('ckp_uploads').select('id, user_id').limit(10000);
  const { data: users } = await supabase.from('users').select('id, full_name').limit(10000);
  
  const uploadToUser = new Map();
  uploads.forEach(u => uploadToUser.set(u.id, u.user_id));
  
  const userIdToName = new Map();
  users.forEach(u => userIdToName.set(u.id, u.full_name));

  // Map DB Users to JSON Employees
  const dbUserToJsonEmp = new Map();
  for (const user of users) {
     const matchedName = fuzzyMatch(user.full_name, jsonUserNames, 0.7);
     if (matchedName) {
        const emp = data.find(d => d.nama_pegawai === matchedName);
        dbUserToJsonEmp.set(user.id, emp);
     }
  }

  const groupedEntries = new Map();

  for (const entry of ckpEntries) {
    const userId = uploadToUser.get(entry.upload_id);
    const emp = dbUserToJsonEmp.get(userId);
    
    let trueRK = entry.rencana_kinerja;
    let foundMatch = false;

    if (emp) {
      // Find the best match for entry.kegiatan OR entry.rencana_kinerja in this specific employee's JSON profile
      let bestScore = 0;
      let matchedRK = null;
      
      const strToMatch = [entry.kegiatan, entry.rencana_kinerja].filter(Boolean);
      
      for (const group of emp.kegiatan_terkelompok) {
         for (const keg of group.kegiatan_anggota) {
            for (const input of strToMatch) {
               const normInput = normalize(input);
               const normKeg = normalize(keg);
               const score = getSimilarity(normInput, normKeg);
               if (score > bestScore) {
                  bestScore = score;
                  matchedRK = group.rk_ketua.trim();
               }
            }
         }
      }
      
      // If we found a reasonable match in THEIR OWN list
      if (bestScore > 0.6) {
         trueRK = matchedRK;
         foundMatch = true;
      }
    }

    if (!foundMatch) {
      // Fallback for safety, just keep what it is but try to normalize if it's already a master RK
      const allMasterRKs = [...new Set(data.flatMap(d => d.kegiatan_terkelompok.map(g => g.rk_ketua.trim())))];
      const matchMaster = fuzzyMatch(entry.rencana_kinerja, allMasterRKs, 0.85);
      if (matchMaster) trueRK = matchMaster;
    }
    
    const groupKey = `${entry.upload_id}_|_${trueRK}`;
    if (!groupedEntries.has(groupKey)) {
      groupedEntries.set(groupKey, []);
    }
    groupedEntries.get(groupKey).push({ ...entry, trueRK, originalRK: entry.rencana_kinerja });
  }

  let changesToMake = [];

  for (const [groupKey, entriesList] of groupedEntries.entries()) {
    const [uploadId, trueRK] = groupKey.split('_|_');
    
    let sumScore = 0;
    let gradedCount = 0;
    
    entriesList.forEach(e => {
      if (e.nilai !== null) {
        sumScore += e.nilai;
        gradedCount++;
      }
    });

    let finalScore = null;
    let dinilaiOleh = null;
    if (gradedCount > 0) {
      finalScore = Math.round(sumScore / gradedCount);
      const gradedEntry = entriesList.find(e => e.dinilai_oleh);
      dinilaiOleh = gradedEntry ? gradedEntry.dinilai_oleh : null;
    }

    entriesList.forEach(e => {
      if (e.rencana_kinerja !== trueRK || e.nilai !== finalScore) {
        changesToMake.push({
          id: e.id,
          upload_id: e.upload_id,
          row_number: e.row_number,
          rencana_kinerja: trueRK,
          kegiatan: e.kegiatan || (e.rencana_kinerja !== trueRK ? e.rencana_kinerja : null),
          nilai: finalScore,
          dinilai_oleh: dinilaiOleh,
        });
      }
    });
  }

  console.log(`Found ${changesToMake.length} ckp_entries that need updating.`);
  
  let updatedCount = 0;
  for (let i = 0; i < changesToMake.length; i += 100) {
    const chunk = changesToMake.slice(i, i + 100);
    const { error: updErr } = await supabase.from('ckp_entries').upsert(chunk, { onConflict: 'id' });
    if (updErr) {
      console.error('Error updating entries chunk:', updErr);
    } else {
      updatedCount += chunk.length;
    }
  }
  console.log(`Successfully updated ${updatedCount} ckp_entries.`);
  console.log('Cleanup completed!');
}

main().catch(console.error);
