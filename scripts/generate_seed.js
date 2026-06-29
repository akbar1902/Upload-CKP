const XLSX = require('xlsx');
const fs = require('fs');

try {
  // 1. Read the Excel file
  const workbook = XLSX.readFile('Rekap_RK_Gabungan_14_Tim.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Build a map of Tim -> Ketua
  const timToKetua = {};
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 3) continue;
    
    const nama = row[0] ? String(row[0]).trim() : '';
    const tim = row[1] ? String(row[1]).trim() : '';
    const status = row[2] ? String(row[2]).trim() : '';
    
    if (status.toLowerCase() === 'ketua' && nama && tim) {
      timToKetua[tim] = nama;
    }
  }

  const mapping = [];
  const uniqueKetua = new Set();
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 4) continue;

    const tim = row[1] ? String(row[1]).trim() : '';
    const rk = row[3] ? String(row[3]).trim() : '';
    const ketua = timToKetua[tim];

    if (rk && rk !== 'Rencana kinerja' && ketua) {
      mapping.push({ tim, rk, ketua });
      uniqueKetua.add(ketua);
    }
  }

  // 2. Generate SQL
  let sql = `-- Auto-generated SQL Script from Excel\n\n`;
  sql += `-- 1. Update roles for Pimpinan and Ketua Tim\n`;
  sql += `UPDATE public.users SET role = 'pimpinan' WHERE email = 'baiqk@bps.go.id';\n\n`;

  Array.from(uniqueKetua).forEach(ketua => {
    // Escape single quotes just in case
    const safeKetua = ketua.replace(/'/g, "''");
    // Since names in DB might not have titles, we take the first 2 words
    const nameParts = ketua.split(' ').slice(0, 2).join(' ');
    const safeNameParts = nameParts.replace(/'/g, "''");
    sql += `UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%${safeNameParts}%';\n`;
  });

  sql += `\n-- 2. Clear existing mappings to avoid duplicates\n`;
  sql += `TRUNCATE TABLE public.rk_ketua_tim_mapping;\n\n`;

  sql += `-- 3. Insert new mappings\n`;
  mapping.forEach(m => {
    const safeRk = m.rk.replace(/'/g, "''");
    const safeTim = m.tim.replace(/'/g, "''");
    const nameParts = m.ketua.split(' ').slice(0, 2).join(' ');
    const safeNameParts = nameParts.replace(/'/g, "''");

    sql += `INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT '${safeRk}', id, '${safeTim}'
FROM public.users WHERE full_name ILIKE '%${safeNameParts}%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;\n`;
  });

  fs.writeFileSync('supabase/migrations/005_seed_from_excel.sql', sql);
  console.log('Successfully generated SQL script at supabase/migrations/005_seed_from_excel.sql');
  console.log(`Found ${uniqueKetua.size} unique Ketua Tim and ${mapping.length} Rencana Kinerja.`);

} catch (e) {
  console.error("Error generating SQL:", e);
}
