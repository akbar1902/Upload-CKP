const fs = require('fs');

const content = fs.readFileSync('C:/Users/muhak/.gemini/antigravity-ide/brain/aa65590f-20e1-45d5-a2da-6efa1b904a21/.system_generated/steps/1201/content.md', 'utf8');
const lines = content.split('\n');

let dataStarted = false;
let sql = '-- Auto-generated SQL Script for user assignments\n\n';

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
    let rk = cols[3].trim().replace(/'/g, "''");
    
    // First, ensure the RK exists in rk_ketua_tim_mapping, otherwise FK will fail
    // But since the kamus was generated from another excel, they MIGHT perfectly match.
    // However, the user said "jangan terlewat satupun". We should UPSERT into rk_ketua_tim_mapping too just in case!
    let timKerja = cols[1].trim().replace(/'/g, "''");
    
    // UPSERT ke rk_ketua_tim_mapping dulu
    sql += `INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('${rk}', '${timKerja}')
ON CONFLICT (rencana_kinerja) DO NOTHING;\n\n`;

    let parts = name.split(' ');
    let searchName = name;
    if (parts.length >= 2) {
      searchName = '%' + parts[0] + ' ' + parts[1] + '%';
    } else {
      searchName = '%' + name + '%';
    }
    
    sql += `INSERT INTO public.user_rk_assignments (rencana_kinerja, user_id)
SELECT '${rk}', id
FROM public.users WHERE full_name ILIKE '${searchName}'
LIMIT 1
ON CONFLICT (rencana_kinerja, user_id) DO NOTHING;\n\n`;
  }
}

fs.writeFileSync('C:/Users/muhak/OneDrive/Documents/Latsar/Upload-CKP/supabase/migrations/011_seed_user_assignments.sql', sql);
console.log('Done generating migration');
