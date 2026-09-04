const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read .env.local
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

// 2. Data from Google Spreadsheet (34 pegawai)
const employeeData = [
  { no: 1, nama: "Baiq Kurniawati, SST, M.Ak", jabatan: "Kepala BPS Kabupaten Belitung", golongan: "Pembina Tk.I, IV/b" },
  { no: 2, nama: "Rojani, SST, M.M.", jabatan: "Statistisi Ahli Madya", golongan: "Pembina, IV/a" },
  { no: 3, nama: "Muhammad Syafiudin, SST, M.S.E", jabatan: "Kepala Subbagian Umum", golongan: "Pembina, IV/a" },
  { no: 4, nama: "Erin Trivoni, S.ST, M.E.K.K.", jabatan: "Statistisi Ahli Muda", golongan: "Pembina, IV/a" },
  { no: 5, nama: "Susanti, SST, M.M.", jabatan: "Statistisi Ahli Muda", golongan: "Penata Tk.I, III/d" },
  { no: 6, nama: "Marta Puspitasari, SST", jabatan: "Analis Pengelolaan Keuangan APBN Ahli Muda", golongan: "Penata Tk.I, III/d" },
  { no: 7, nama: "Agus Prianto, SST", jabatan: "Statistisi Ahli Muda", golongan: "Penata Tk.I, III/d" },
  { no: 8, nama: "Seraman, S.A.P.", jabatan: "Statistisi Penyelia", golongan: "Penata Tk.I, III/d" },
  { no: 9, nama: "Kunthi Arsih, SE", jabatan: "Statistisi Ahli Muda", golongan: "Penata Tk.I, III/d" },
  { no: 10, nama: "Irma Setiyani Rahayu, SST", jabatan: "Statistisi Ahli Muda", golongan: "Penata Tk.I, III/d" },
  { no: 11, nama: "Nayusa, S.A.P", jabatan: "Statistisi Mahir", golongan: "Penata, III/c" },
  { no: 12, nama: "Yasrizal", jabatan: "Statistisi Mahir", golongan: "Penata Muda Tk.I, III/b" },
  { no: 13, nama: "Ismu Widati, A.Md", jabatan: "Statistisi Mahir", golongan: "Penata Muda Tk.I, III/b" },
  { no: 14, nama: "Nurlaila Fitriyah, S.M.", jabatan: "Statistisi Ahli Pertama", golongan: "Penata Muda Tk.I, III/b" },
  { no: 15, nama: "Tejo Laksono, A.Md", jabatan: "Pranata Komputer Mahir", golongan: "Penata Muda Tk.I, III/b" },
  { no: 16, nama: "Radina Yasinta Karolina, S.Tr.Stat.", jabatan: "Statistisi Ahli Pertama", golongan: "Penata Muda Tk.I, III/b" },
  { no: 17, nama: "Meta Septianingrum, S.Si", jabatan: "Statistisi Ahli Pertama", golongan: "Penata Muda Tk.I, III/b" },
  { no: 18, nama: "Sayyidah Maulani Khoirunnisa, S.Tr.Stat", jabatan: "Statistisi Ahli Pertama", golongan: "Penata Muda Tk.I, III/b" },
  { no: 19, nama: "Qonita Iman, S.Tr.Stat.", jabatan: "Statistisi Ahli Pertama", golongan: "Penata Muda Tk.I, III/b" },
  { no: 20, nama: "Rio Prananda Aditya, S.Tr.Stat.", jabatan: "Statistisi Ahli Pertama", golongan: "Penata Muda Tk.I, III/b" },
  { no: 21, nama: "Yerdi", jabatan: "Statistisi Mahir", golongan: "Penata Muda, III/a" },
  { no: 22, nama: "Alfi Nurrahmah, S.Tr.Stat.", jabatan: "Pranata Komputer Ahli Pertama", golongan: "Penata Muda, III/a" },
  { no: 23, nama: "Rananta Karina, A.Md.Stat", jabatan: "Statistisi Terampil", golongan: "Pengatur Tk.I, II/d" },
  { no: 24, nama: "Anis Athirah, A.Md.Stat.", jabatan: "Statistisi Terampil", golongan: "Pengatur Tk.I, II/d" },
  { no: 25, nama: "Nadita Riski Aulia, A.Md.Stat.", jabatan: "Statistisi Terampil", golongan: "Pengatur, II/c" },
  { no: 26, nama: "Dewi Putri Romadona, A.Md.Stat.", jabatan: "Statistisi Terampil", golongan: "Pengatur, II/c" },
  { no: 27, nama: "Muhammad Akbar, S.Tr.Stat.", jabatan: "Pelaksana", golongan: "Penata Muda, III/a" },
  { no: 28, nama: "Akbarrullah Yusman, A.Md.Stat.", jabatan: "Pelaksana", golongan: "Pengatur, II/c" },
  { no: 29, nama: "Andri Indra Rukmana, A.Md", jabatan: "Pranata SDM Aparatur Terampil", golongan: "VII" },
  { no: 30, nama: "Maya Andriani", jabatan: "Pelaksana", golongan: "Penata Muda, III/a" },
  { no: 31, nama: "Chandra Nela", jabatan: "Operator Layanan Operasional", golongan: "V" },
  { no: 32, nama: "Rachel Abiyoso", jabatan: "Operator Layanan Operasional", golongan: "V" },
  { no: 33, nama: "Rico Enfi", jabatan: "Operator Layanan Operasional", golongan: "V" },
  { no: 34, nama: "Rizky Tarmuzi", jabatan: "Pengelola Umum Operasional", golongan: "III" },
];

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z]/g, '');
}

async function seed() {
  console.log('Fetching existing users from Supabase...');
  const { data: users, error } = await supabase.from('users').select('id, full_name, nip, email');
  if (error) {
    console.error('Error fetching users:', error);
    process.exit(1);
  }

  console.log(`Found ${users.length} users in database.`);

  const profilesToUpsert = [];

  for (const emp of employeeData) {
    const sNorm = normalizeName(emp.nama.split(',')[0]);
    const user = users.find(u => {
      const uNorm = normalizeName(u.full_name.split(',')[0]);
      return uNorm.includes(sNorm) || sNorm.includes(uNorm);
    });

    if (!user) {
      console.warn(`[WARNING] No match found for: ${emp.nama}`);
      continue;
    }

    profilesToUpsert.push({
      user_id: user.id,
      jabatan: emp.jabatan.trim(),
      golongan: emp.golongan.trim(),
    });
    console.log(`[MATCH] ${emp.nama} -> ${user.full_name} (${user.id})`);
  }

  console.log(`\nUpserting ${profilesToUpsert.length} profiles into employee_profiles...`);

  const { data: upserted, error: upsertError } = await supabase
    .from('employee_profiles')
    .upsert(profilesToUpsert, { onConflict: 'user_id' })
    .select();

  if (upsertError) {
    console.error('Upsert failed:', upsertError);
    process.exit(1);
  }

  console.log(`\nSUCCESS! Successfully seeded ${upserted.length} employee profiles into database.`);
}

seed();
