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

const fuzzyMatchKegiatan = (input, masterKegs) => {
  if (!input) return null;
  const normInput = normalize(input);
  if (!normInput) return null;
  let bestMatch = null;
  let bestScore = 0;
  for (const master of masterKegs) {
    const normMaster = normalize(master.kegiatan_nama);
    if (normMaster === normInput) return master;
    const score = getSimilarity(normInput, normMaster);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = master;
    }
  }
  if (bestScore > 0.90) return bestMatch;
  return null;
};

const fuzzyMatchRK = (input, masterNames) => {
  if (!input) return input;
  const normInput = normalize(input);
  if (!normInput) return input;
  let bestMatch = '';
  let bestScore = 0;
  for (const master of masterNames) {
    const normMaster = normalize(master);
    if (normMaster === normInput) return master;
    const score = getSimilarity(normInput, normMaster);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = master;
    }
  }
  if (bestScore > 0.95) return bestMatch;
  return String(input).trim().replace(/\s+/g, ' ');
};

async function main() {
  console.log('Starting data cleanup...');
  
  // 1. Get True Master RKs from JSON
  const data = JSON.parse(fs.readFileSync('data_rk.json', 'utf8'));
  const trueRks = new Set();
  data.forEach(emp => {
    emp.kegiatan_terkelompok.forEach(group => {
      trueRks.add(group.rk_ketua.trim());
    });
  });
  const trueMasterNames = Array.from(trueRks);
  console.log(`Found ${trueMasterNames.length} True Master RKs from JSON.`);

  // 2. Fetch required DB data
  const { data: masterKegiatanData } = await supabase.from('master_kegiatan_anggota').select('kegiatan_nama, user_id, rk_ketua_tim_mapping(rencana_kinerja)').limit(10000);
  
  let ckpEntries = [];
  let from = 0;
  while (true) {
    const { data: chunk } = await supabase.from('ckp_entries').select('*').range(from, from + 999);
    if (!chunk || chunk.length === 0) break;
    ckpEntries.push(...chunk);
    from += 1000;
  }
  
  const { data: ckpUploads } = await supabase.from('ckp_uploads').select('id, user_id').limit(10000);
  const { data: rkMappings } = await supabase.from('rk_ketua_tim_mapping').select('id, rencana_kinerja').limit(5000);

  console.log(`Fetched ${ckpEntries.length} ckp_entries and ${rkMappings.length} rk_mappings.`);

  const uploadsMap = new Map();
  ckpUploads.forEach(u => uploadsMap.set(u.id, u.user_id));

  // 3. Process each ckp_entry
  // Group by upload_id + TrueRK
  const groupedEntries = new Map(); // key: uploadId_trueRK
  
  let changesToMake = [];

  for (const entry of ckpEntries) {
    const userId = uploadsMap.get(entry.upload_id);
    if (!userId) continue;

    // Get masterKegiatan for this specific user
    const userKegiatan = masterKegiatanData.filter(k => k.user_id === userId);
    
    const rawRK = entry.rencana_kinerja || '';
    let trueRK = '';
    
    const kMatch = fuzzyMatchKegiatan(rawRK, userKegiatan);
    
    if (kMatch) {
       trueRK = kMatch.rk_ketua_tim_mapping.rencana_kinerja;
    } else {
       trueRK = fuzzyMatchRK(rawRK, trueMasterNames);
    }
    
    const groupKey = `${entry.upload_id}_|_${trueRK}`;
    if (!groupedEntries.has(groupKey)) {
      groupedEntries.set(groupKey, []);
    }
    groupedEntries.get(groupKey).push({ ...entry, trueRK, originalRK: rawRK, wasKegiatan: !!kMatch });
  }

  // 4. Calculate averages and prepare updates
  for (const [groupKey, entriesList] of groupedEntries.entries()) {
    const [uploadId, trueRK] = groupKey.split('_|_');
    
    // Check if there's a need to update
    let needsUpdate = false;
    let sumScore = 0;
    let gradedCount = 0;
    
    entriesList.forEach(e => {
      if (e.rencana_kinerja !== trueRK) needsUpdate = true;
      if (e.nilai !== null) {
        sumScore += e.nilai;
        gradedCount++;
      }
    });

    // We also want to consolidate scores if there are multiple entries with different scores or some without scores
    let finalScore = null;
    let dinilaiOleh = null;
    if (gradedCount > 0) {
      finalScore = Math.round(sumScore / gradedCount);
      const gradedEntry = entriesList.find(e => e.dinilai_oleh);
      dinilaiOleh = gradedEntry ? gradedEntry.dinilai_oleh : null;
      // If any entry has a different score than the average, we must update
      if (entriesList.some(e => e.nilai !== finalScore)) needsUpdate = true;
    }

    if (needsUpdate) {
      entriesList.forEach(e => {
        let newKegiatan = e.kegiatan;
        if (e.wasKegiatan && (!e.kegiatan || e.kegiatan.trim() === '')) {
           newKegiatan = e.originalRK;
        }

        changesToMake.push({
          id: e.id,
          upload_id: e.upload_id,
          row_number: e.row_number,
          rencana_kinerja: trueRK,
          kegiatan: newKegiatan,
          nilai: finalScore,
          dinilai_oleh: dinilaiOleh,
          // keep other fields intact via upsert, but Supabase update is better.
          // Wait, upsert needs all non-null fields or we can just use update in a loop.
        });
      });
    }
  }

  console.log(`Found ${changesToMake.length} ckp_entries that need updating.`);
  
  // 5. Execute Updates
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

  // 6. Delete fake RKs from rk_ketua_tim_mapping
  // Any RK not in trueMasterNames and not currently used in ckp_entries
  // Since we just updated ckp_entries, let's fetch the unique RKs used now
  const { data: updatedEntries } = await supabase.from('ckp_entries').select('rencana_kinerja').limit(10000);
  const usedRks = new Set(updatedEntries.map(e => e.rencana_kinerja));
  
  let deletedCount = 0;
  const fakeRksToDelete = [];
  
  for (const rk of rkMappings) {
    const matched = fuzzyMatchRK(rk.rencana_kinerja, trueMasterNames);
    if (!trueMasterNames.includes(matched)) {
      // It's a fake RK. Is it used?
      if (!usedRks.has(rk.rencana_kinerja)) {
        fakeRksToDelete.push(rk.id);
      }
    }
  }

  console.log(`Found ${fakeRksToDelete.length} fake RKs to delete.`);
  for (let i = 0; i < fakeRksToDelete.length; i += 100) {
    const chunk = fakeRksToDelete.slice(i, i + 100);
    const { error: delErr } = await supabase.from('rk_ketua_tim_mapping').delete().in('id', chunk);
    if (delErr) {
      console.error('Error deleting fake RKs:', delErr);
    } else {
      deletedCount += chunk.length;
    }
  }
  
  console.log(`Successfully deleted ${deletedCount} fake RKs.`);
  console.log('Cleanup completed!');
}

main().catch(console.error);
