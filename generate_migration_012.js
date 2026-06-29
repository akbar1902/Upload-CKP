const fs = require('fs');

const content = fs.readFileSync('C:/Users/muhak/.gemini/antigravity-ide/brain/aa65590f-20e1-45d5-a2da-6efa1b904a21/.system_generated/steps/1201/content.md', 'utf8');
const lines = content.split('\n');

let sql = `-- Migration: Schema changes to support duplicate RK names across teams

-- 1. Drop constraints
ALTER TABLE public.user_rk_assignments DROP CONSTRAINT IF EXISTS user_rk_assignments_rencana_kinerja_fkey;
ALTER TABLE public.rk_ketua_tim_mapping DROP CONSTRAINT IF EXISTS rk_ketua_tim_mapping_rencana_kinerja_key;

-- 2. TRUNCATE user_rk_assignments because we are changing its primary reference and re-seeding completely
TRUNCATE TABLE public.user_rk_assignments;

-- 3. Add new UNIQUE constraint to rk_ketua_tim_mapping
-- First, let's delete exact duplicates in rk_ketua_tim_mapping just in case they exist (though impossible due to old constraint)
-- Then we add a unique constraint on both columns
ALTER TABLE public.rk_ketua_tim_mapping ADD CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique UNIQUE (rencana_kinerja, tim_kerja);

-- 4. Modify user_rk_assignments schema
ALTER TABLE public.user_rk_assignments DROP COLUMN IF EXISTS rencana_kinerja CASCADE;
ALTER TABLE public.user_rk_assignments ADD COLUMN IF NOT EXISTS rk_id UUID REFERENCES public.rk_ketua_tim_mapping(id) ON DELETE CASCADE;

-- Add constraint to prevent same RK assigned to same user twice
ALTER TABLE public.user_rk_assignments ADD CONSTRAINT user_rk_assignments_user_rk_unique UNIQUE (user_id, rk_id);


-- 5. Seed Kamus Global (rk_ketua_tim_mapping) to make sure all RKs from CSV exist
`;

// Parse CSV
let dataStarted = false;
let records = [];
for (let line of lines) {
  if (line.startsWith('Nama,Tim kerja,Status,Rencana kinerja')) {
    dataStarted = true;
    continue;
  }
  if (!dataStarted || !line.trim()) continue;
  
  let cols = [];
  let current = '';
  let inQuotes = false;
  for(let i=0; i<line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    } else if (line[i] === ',' && !inQuotes) {
      cols.push(current);
      current = '';
    } else {
      current += line[i];
    }
  }
  cols.push(current);
  
  if (cols.length >= 4) {
    let name = cols[0].trim().replace(/'/g, "''");
    let timKerja = cols[1].trim().replace(/'/g, "''");
    let rk = cols[3].trim().replace(/'/g, "''");
    records.push({name, timKerja, rk});
  }
}

// 5. Build seed for Kamus Global
// We use a Set to get unique pairs of (rencana_kinerja, tim_kerja)
const uniqueRkTim = new Set();
for(let r of records) {
  uniqueRkTim.add(JSON.stringify({rk: r.rk, tim: r.timKerja}));
}

for (let rkt of uniqueRkTim) {
  const obj = JSON.parse(rkt);
  sql += `INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('${obj.rk}', '${obj.tim}')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;\n`;
}

sql += `\n\n-- 6. Seed user_rk_assignments based on the master Excel assignments\n\n`;

for(let r of records) {
  let parts = r.name.split(' ');
  let searchName = r.name;
  if (parts.length >= 2) {
    searchName = '%' + parts[0] + ' ' + parts[1] + '%';
  } else {
    searchName = '%' + r.name + '%';
  }
  
  // We look up the exact rk_id based on both rencana_kinerja AND tim_kerja
  sql += `INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '${searchName}' 
  AND rk.rencana_kinerja = '${r.rk}'
  AND rk.tim_kerja = '${r.timKerja}'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;\n\n`;
}

fs.writeFileSync('C:/Users/muhak/OneDrive/Documents/Latsar/Upload-CKP/supabase/migrations/012_schema_and_seed.sql', sql);
console.log('Migration 012 generated!');
