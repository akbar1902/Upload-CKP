const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const env = envLocal.split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) acc[key.trim()] = value.join('=').trim();
  return acc;
}, {});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function normalize(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function seed() {
  console.log('--- Memulai Seeding master_kegiatan_anggota ---');

  const mm = JSON.parse(fs.readFileSync('master_mapping.json', 'utf8'));
  const drk = JSON.parse(fs.readFileSync('data_rk.json', 'utf8'));

  const { data: rks, error: rksErr } = await supabase
    .from('rk_ketua_tim_mapping')
    .select('id, rencana_kinerja, ketua_tim_id, tim_kerja');

  if (rksErr) {
    console.error('Gagal fetch RK mappings:', rksErr);
    process.exit(1);
  }

  const { data: adminUser } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single();

  const defaultUserId = adminUser?.id;

  const rkMap = new Map();
  rks.forEach(r => rkMap.set(normalize(r.rencana_kinerja), r));

  const { data: existingSubs } = await supabase
    .from('master_kegiatan_anggota')
    .select('rk_id, kegiatan_nama');

  const existingSet = new Set((existingSubs || []).map(s => s.rk_id + '_|_' + normalize(s.kegiatan_nama)));
  console.log(`Sub-RK existing di DB saat ini: ${existingSubs ? existingSubs.length : 0}`);

  const toInsert = [];

  // 1. Dari master_mapping.json
  for (const group of mm) {
    const rkObj = rkMap.get(normalize(group.rk_ketua));
    if (!rkObj) continue;

    const seenSub = new Set();
    for (const sub of (group.sub_rk || [])) {
      const subTrimmed = sub.trim();
      const normSub = normalize(subTrimmed);
      if (!normSub || seenSub.has(normSub)) continue;
      seenSub.add(normSub);

      const key = rkObj.id + '_|_' + normSub;
      if (!existingSet.has(key)) {
        toInsert.push({
          rk_id: rkObj.id,
          user_id: rkObj.ketua_tim_id || defaultUserId,
          kegiatan_nama: subTrimmed,
        });
        existingSet.add(key);
      }
    }
  }

  // 2. Dari data_rk.json untuk RK yang belum ada sub
  for (const rk of rks) {
    const normRk = normalize(rk.rencana_kinerja);
    const seenKeg = new Set();
    for (const d of drk) {
      for (const g of d.kegiatan_terkelompok) {
        if (normalize(g.rk_ketua) === normRk) {
          for (const k of g.kegiatan_anggota) {
            const kTrimmed = k.trim();
            const normK = normalize(kTrimmed);
            if (!normK || seenKeg.has(normK)) continue;
            seenKeg.add(normK);

            const key = rk.id + '_|_' + normK;
            if (!existingSet.has(key)) {
              toInsert.push({
                rk_id: rk.id,
                user_id: rk.ketua_tim_id || defaultUserId,
                kegiatan_nama: kTrimmed,
              });
              existingSet.add(key);
            }
          }
        }
      }
    }
  }

  console.log(`Menyiapkan ${toInsert.length} Sub-RK baru untuk di-insert...`);

  const CHUNK_SIZE = 100;
  let insertedCount = 0;

  for (let i = 0; i < toInsert.length; i += CHUNK_SIZE) {
    const chunk = toInsert.slice(i, i + CHUNK_SIZE);
    const { error: insErr } = await supabase
      .from('master_kegiatan_anggota')
      .insert(chunk);

    if (insErr) {
      console.error(`Error inserting chunk ${i / CHUNK_SIZE + 1}:`, insErr);
    } else {
      insertedCount += chunk.length;
      console.log(`Berhasil insert ${insertedCount}/${toInsert.length} data...`);
    }
  }

  const { count: finalCount } = await supabase
    .from('master_kegiatan_anggota')
    .select('*', { count: 'exact', head: true });

  console.log(`--- Seeding selesai! Total Sub-RK di DB sekarang: ${finalCount} ---`);
}

seed().catch(console.error);
