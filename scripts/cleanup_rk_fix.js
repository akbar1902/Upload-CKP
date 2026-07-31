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

const fuzzyMatchGlobalKegiatan = (input, allKegs) => {
  if (!input) return null;
  const normInput = normalize(input);
  if (!normInput) return null;
  let bestMatch = null;
  let bestScore = 0;
  for (const keg of allKegs) {
    const normKeg = normalize(keg.nama);
    if (normKeg === normInput) return keg;
    const score = getSimilarity(normInput, normKeg);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = keg;
    }
  }
  // Lower threshold a bit to catch HTML entities differences etc
  if (bestScore > 0.85) return bestMatch;
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
  if (bestScore > 0.85) return bestMatch;
  return String(input).trim().replace(/\s+/g, ' ');
};

async function main() {
  console.log('Starting global data cleanup fix...');
  
  const data = JSON.parse(fs.readFileSync('data_rk.json', 'utf8'));
  const trueRks = new Set();
  const allSubActivities = [];
  
  data.forEach(emp => {
    emp.kegiatan_terkelompok.forEach(group => {
      const rkKetua = group.rk_ketua.trim();
      trueRks.add(rkKetua);
      group.kegiatan_anggota.forEach(keg => {
         allSubActivities.push({ nama: keg.trim(), trueRk: rkKetua });
      });
    });
  });
  const trueMasterNames = Array.from(trueRks);
  console.log(`Loaded ${trueMasterNames.length} True Master RKs and ${allSubActivities.length} sub-activities from JSON.`);

  let ckpEntries = [];
  let from = 0;
  while (true) {
    const { data: chunk } = await supabase.from('ckp_entries').select('*').range(from, from + 999);
    if (!chunk || chunk.length === 0) break;
    ckpEntries.push(...chunk);
    from += 1000;
  }
  const { data: rkMappings } = await supabase.from('rk_ketua_tim_mapping').select('id, rencana_kinerja').limit(5000);
  console.log(`Fetched ${ckpEntries.length} ckp_entries and ${rkMappings.length} rk_mappings.`);

  const groupedEntries = new Map();
  let changesToMake = [];

  for (const entry of ckpEntries) {
    const rawRK = entry.rencana_kinerja || '';
    let trueRK = '';
    
    // Check against global sub activities first
    const kMatch = fuzzyMatchGlobalKegiatan(rawRK, allSubActivities);
    
    if (kMatch) {
       trueRK = kMatch.trueRk;
    } else {
       trueRK = fuzzyMatchRK(rawRK, trueMasterNames);
    }
    
    const groupKey = `${entry.upload_id}_|_${trueRK}`;
    if (!groupedEntries.has(groupKey)) {
      groupedEntries.set(groupKey, []);
    }
    groupedEntries.get(groupKey).push({ ...entry, trueRK, originalRK: rawRK, wasKegiatan: !!kMatch });
  }

  for (const [groupKey, entriesList] of groupedEntries.entries()) {
    const [uploadId, trueRK] = groupKey.split('_|_');
    
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

    let finalScore = null;
    let dinilaiOleh = null;
    if (gradedCount > 0) {
      finalScore = Math.round(sumScore / gradedCount);
      const gradedEntry = entriesList.find(e => e.dinilai_oleh);
      dinilaiOleh = gradedEntry ? gradedEntry.dinilai_oleh : null;
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
        });
      });
    }
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

  const { data: updatedEntries } = await supabase.from('ckp_entries').select('rencana_kinerja').limit(10000);
  const usedRks = new Set(updatedEntries.map(e => e.rencana_kinerja));
  
  let deletedCount = 0;
  const fakeRksToDelete = [];
  
  for (const rk of rkMappings) {
    const matched = fuzzyMatchRK(rk.rencana_kinerja, trueMasterNames);
    if (!trueMasterNames.includes(matched)) {
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
