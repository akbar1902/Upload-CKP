-- Migration: 020_seed_employee_profiles.sql
-- Seed employee_profiles with jabatan and golongan from master database
-- and ensure all authenticated users can view employee profiles.

-- 1. Ensure RLS Policy allows authenticated users to read employee profiles
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view own employee profile" ON public.employee_profiles;
    DROP POLICY IF EXISTS "Pimpinan can view all employee profiles" ON public.employee_profiles;
    DROP POLICY IF EXISTS "Anyone can view all employee profiles" ON public.employee_profiles;
    
    CREATE POLICY "Anyone can view all employee profiles"
        ON public.employee_profiles FOR SELECT
        USING (auth.uid() IS NOT NULL);
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 2. Upsert employee profiles (jabatan & golongan)
INSERT INTO public.employee_profiles (user_id, jabatan, golongan, updated_at)
SELECT u.id, d.jabatan, d.golongan, NOW()
FROM (VALUES
  ('Baiq Kurniawati SST, M.Ak', 'Kepala BPS Kabupaten Belitung', 'Pembina Tk.I, IV/b'),
  ('Rojani SST, M.M.', 'Statistisi Ahli Madya', 'Pembina, IV/a'),
  ('Muhammad Syafiudin SST, M.S.E', 'Kepala Subbagian Umum', 'Pembina, IV/a'),
  ('Erin Trivoni S.ST, M.E.K.K.', 'Statistisi Ahli Muda', 'Pembina, IV/a'),
  ('Susanti SST, M.M.', 'Statistisi Ahli Muda', 'Penata Tk.I, III/d'),
  ('Marta Puspitasari SST', 'Analis Pengelolaan Keuangan APBN Ahli Muda', 'Penata Tk.I, III/d'),
  ('Agus Prianto SST', 'Statistisi Ahli Muda', 'Penata Tk.I, III/d'),
  ('Seraman S.A.P.', 'Statistisi Penyelia', 'Penata Tk.I, III/d'),
  ('Kunthi Arsih SE', 'Statistisi Ahli Muda', 'Penata Tk.I, III/d'),
  ('Irma Setiyani Rahayu SST', 'Statistisi Ahli Muda', 'Penata Tk.I, III/d'),
  ('Nayusa S.A.P', 'Statistisi Mahir', 'Penata, III/c'),
  ('Yasrizal', 'Statistisi Mahir', 'Penata Muda Tk.I, III/b'),
  ('Ismu Widati A.Md', 'Statistisi Mahir', 'Penata Muda Tk.I, III/b'),
  ('Nurlaila Fitriyah S.M.', 'Statistisi Ahli Pertama', 'Penata Muda Tk.I, III/b'),
  ('Tejo Laksono A.Md', 'Pranata Komputer Mahir', 'Penata Muda Tk.I, III/b'),
  ('Radina Yasinta Karolina S.Tr.Stat.', 'Statistisi Ahli Pertama', 'Penata Muda Tk.I, III/b'),
  ('Meta Septianingrum S.Si', 'Statistisi Ahli Pertama', 'Penata Muda Tk.I, III/b'),
  ('Sayyidah Maulani Khoirunnisa S.Tr.Stat', 'Statistisi Ahli Pertama', 'Penata Muda Tk.I, III/b'),
  ('Qonita Iman S.Tr.Stat.', 'Statistisi Ahli Pertama', 'Penata Muda Tk.I, III/b'),
  ('Rio Prananda Aditya S.Tr.Stat.', 'Statistisi Ahli Pertama', 'Penata Muda Tk.I, III/b'),
  ('Yerdi', 'Statistisi Mahir', 'Penata Muda, III/a'),
  ('Alfi Nurrahmah S.Tr.Stat.', 'Pranata Komputer Ahli Pertama', 'Penata Muda, III/a'),
  ('Rananta Karina A.Md.Stat', 'Statistisi Terampil', 'Pengatur Tk.I, II/d'),
  ('Anis Athirah A.Md.Stat.', 'Statistisi Terampil', 'Pengatur Tk.I, II/d'),
  ('Nadita Riski Aulia A.Md.Stat.', 'Statistisi Terampil', 'Pengatur, II/c'),
  ('Dewi Putri Romadona A.Md.Stat.', 'Statistisi Terampil', 'Pengatur, II/c'),
  ('Muhammad Akbar S.Tr.Stat.', 'Pelaksana', 'Penata Muda, III/a'),
  ('Akbarrullah Yusman A.Md.Stat.', 'Pelaksana', 'Pengatur, II/c'),
  ('Andri Indra Rukmana A.Md', 'Pranata SDM Aparatur Terampil', 'VII'),
  ('Maya Andriani', 'Pelaksana', 'Penata Muda, III/a'),
  ('Chandra Nela', 'Operator Layanan Operasional', 'V'),
  ('Rachel Abiyoso', 'Operator Layanan Operasional', 'V'),
  ('Rico Enfi', 'Operator Layanan Operasional', 'V'),
  ('Rizky Tarmuzi', 'Pengelola Umum Operasional', 'III')
) AS d(full_name, jabatan, golongan)
JOIN public.users u ON u.full_name = d.full_name
ON CONFLICT (user_id) 
DO UPDATE SET 
    jabatan = EXCLUDED.jabatan,
    golongan = EXCLUDED.golongan,
    updated_at = NOW();
