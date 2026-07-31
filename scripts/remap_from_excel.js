const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const XLSX = require('xlsx');

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
  return (str || '').toString().toLowerCase().trim().replace(/\s+/g, ' ');
}

async function run() {
  console.log('Starting exact mapping from original Excel files...');
  
  const mappingData = JSON.parse(fs.readFileSync('master_mapping.json', 'utf8'));
  const parentMap = new Map(); // child -> parent

  for (const group of mappingData) {
     const parent = group.rk_ketua.trim();
     for (const child of group.sub_rk) {
        if (normalize(child) !== normalize(parent)) {
            parentMap.set(normalize(child), parent);
        }
     }
  }
  
  function getRoot(nodeRaw) {
     const curr = normalize(nodeRaw);
     if (parentMap.has(curr)) {
         return parentMap.get(curr);
     }
     
     // Fallback if the user explicitly typed the Master RK
     for (const rk of rkNameToId.keys()) {
        if (normalize(rk) === curr) return rk;
     }
     return null;
  }
  
  console.log(`Loaded ${parentMap.size} child->parent relationships.`);
  
  const { data: dbRKs } = await supabase.from('rk_ketua_tim_mapping').select('id, rencana_kinerja');
  const rkNameToId = new Map(dbRKs.map(r => [r.rencana_kinerja, r.id]));
  
  const { data: uploads } = await supabase.from('ckp_uploads').select('id, user_id, storage_path').not('storage_path', 'is', null);
  console.log(`Found ${uploads.length} Excel files to process.`);
  
  const allEntries = [];
  let from = 0;
  while(true) {
     const { data: chunk } = await supabase.from('ckp_entries').select('id, upload_id, row_number').range(from, from+999);
     if (!chunk || chunk.length === 0) break;
     allEntries.push(...chunk);
     from += 1000;
  }
  
  const entriesByUploadAndKeg = new Map();
  for (const e of allEntries) {
     const key = `${e.upload_id}_|_${e.row_number}`;
     entriesByUploadAndKeg.set(key, e.id);
  }
  
  let matchCount = 0;
  let updateQueue = [];
  let assignmentsToUpsert = new Set();
  
  for (let i=0; i<uploads.length; i++) {
     const upload = uploads[i];
     console.log(`Processing [${i+1}/${uploads.length}] ${upload.storage_path}`);
     
     const { data: fileData, error } = await supabase.storage.from('ckp-files').download(upload.storage_path);
     if (error || !fileData) {
        console.error(`Failed to download ${upload.storage_path}`, error);
        continue;
     }
     
     const buffer = await fileData.arrayBuffer();
     const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
     const sheet = workbook.Sheets[workbook.SheetNames[0]];
     const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
     
     let headerRowIndex = -1;
     for (let r=0; r<Math.min(rawData.length, 10); r++) {
        const row = rawData[r];
        if (row && row.some(cell => typeof cell === 'string' && cell.trim().length > 0)) {
           const texts = row.filter(c => typeof c === 'string' && c.trim().length > 0);
           if (texts.length >= 3) { headerRowIndex = r; break; }
        }
     }
     
     if (headerRowIndex === -1) continue;
     
     const headers = rawData[headerRowIndex].map(h => String(h || '').toLowerCase().replace(/[^a-z0-9]/g, ''));
     
     let kegiatanIdx = headers.findIndex(h => h.includes('kegiatan') || h === 'uraiankegiatan');
     let rkIdx = headers.findIndex(h => h.includes('rencanakinerja') || h === 'rk' || h === 'butirkegiatan');
     
     if (kegiatanIdx === -1 || rkIdx === -1) {
        console.warn(`Could not find columns in ${upload.storage_path}`);
        continue;
     }
     
     const dataRows = rawData.slice(headerRowIndex + 1);
     
     let rowNumber = 0;
     for (const row of dataRows) {
        const cells = row;
        const hasContent = cells.some(c => {
           const val = String(c ?? '').trim();
           return val.length > 0 && val !== '0';
        });
        if (!hasContent) continue;
        
        rowNumber++;
        const kegRaw = String(row[kegiatanIdx] || '').trim();
        const rkRaw = String(row[rkIdx] || '').trim();
        
        if (!kegRaw || !rkRaw) continue;
        
        const key = `${upload.id}_|_${rowNumber}`;
        const dbEntryId = entriesByUploadAndKeg.get(key);
        
        if (dbEntryId) {
           const trueRK = getRoot(rkRaw);
           if (trueRK) {
              updateQueue.push({ id: dbEntryId, rencana_kinerja: trueRK });
              
              const rkId = rkNameToId.get(trueRK);
              if (rkId) {
                 assignmentsToUpsert.add(`${upload.user_id}_|_${rkId}`);
              }
              matchCount++;
           }
        }
     }
  }
  
  console.log(`Found ${matchCount} exact mapping matches from original Excel files!`);
  
  if (updateQueue.length > 0) {
     console.log('Updating database entries...');
     let successCount = 0;
     for (const up of updateQueue) {
        const { error } = await supabase.from('ckp_entries').update({ rencana_kinerja: up.rencana_kinerja }).eq('id', up.id);
        if (!error) successCount++;
     }
     console.log(`Successfully updated ${successCount} entries!`);
  }
  
  if (assignmentsToUpsert.size > 0) {
     console.log('Upserting assignments...');
     const upsertData = Array.from(assignmentsToUpsert).map(str => {
        const [u, r] = str.split('_|_');
        return { user_id: u, rk_id: r };
     });
     const { error } = await supabase.from('user_rk_assignments').upsert(upsertData, { onConflict: 'user_id, rk_id' });
     if (error) console.error('Assignment error:', error);
     else console.log(`Upserted ${upsertData.length} assignments!`);
  }
  
  console.log('Re-averaging values for all true Master RK groups...');
  
  // Re-fetch grouped entries
  let allEntriesAfter = [];
  let fromAfter = 0;
  while(true) {
     const { data: chunk } = await supabase.from('ckp_entries').select('id, upload_id, rencana_kinerja, nilai').range(fromAfter, fromAfter+999);
     if (!chunk || chunk.length === 0) break;
     allEntriesAfter.push(...chunk);
     fromAfter += 1000;
  }
  
  const groupedEntries = new Map();
  for (const e of allEntriesAfter) {
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
  
  console.log(`Found average discrepancies: ${averageChanges.length}`);
  if (averageChanges.length > 0) {
     let updatedAvg = 0;
     for (const change of averageChanges) {
        const { error } = await supabase.from('ckp_entries').update({ nilai: change.nilai }).eq('id', change.id);
        if (!error) updatedAvg++;
     }
     console.log(`Successfully updated averages: ${updatedAvg}`);
  }

  console.log('Done!');
}
run().catch(console.error);
