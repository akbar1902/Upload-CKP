-- Auto-generated SQL Script from Excel

-- 1. Update roles for Pimpinan and Ketua Tim
UPDATE public.users SET role = 'pimpinan' WHERE email = 'baiqk@bps.go.id';

UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Sayyidah Maulani%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Radina Yasinta%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Muhammad Syafiudin%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Rio Prananda%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Susanti SST%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Agus Prianto%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Alfi Nurrahmah%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Qonita Iman%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Kunthi Arsih%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Rojani SST,%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Marta Puspitasari%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Seraman S.A.P.%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Irma Setiyani%';
UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Baiq Kurniawati%';

-- 2. Clear existing mappings to avoid duplicates
TRUNCATE TABLE public.rk_ketua_tim_mapping;

-- 3. Insert new mappings
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Publik BPS Kabupaten Belitung', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pendataan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Kabupaten Belitung Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Kabupaten Belitung Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya menjadi petugas harian PST', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST) Yang Profresioanal', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST) Menjadi Petugas Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST) Menjadi Petugas Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Menjadi petugas harian pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Menjadi petugas harian pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan pendataan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melakukan pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Menjadi petugas harian PST', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mengikuti Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pendataan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan petugas harian PST', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya petugas harian PST', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pendataan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Kabupaten Belitung Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Seminar/Pelatihan/Briefing terkait Pelayanan Publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan pendataan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mengikuti Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Menjadi petugas harian PST', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mengikuti Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Menjadi petugas harian pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melakukan pengelolaan official website BPS Kabupaten Belitung', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Kabupaten Belitung Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya menjadi petugas harian PST', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Menjadi petugas harian pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pendataan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya menjadi petugas harian PST', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya penyusunan laporan Survei Kebutuhan Data (SKD) Triwulanan 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya penyusunan publikasi hasil Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Statistik Terpadu (PST)', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pendataan Survei Kebutuhan Data (SKD) 2026', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Coaching Clinic PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya menjadi petugas harian PST', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Tugas Harian Pelayanan Pengaduan', id, 'Diseminasi Statistik'
FROM public.users WHERE full_name ILIKE '%Sayyidah Maulani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publisitas Data dan Kegiatan Perkantoran', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Peliputan Kegiatan, Manajemen Aset, dan Pengembangan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Liputan Kegiatan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengembangan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Liputan Kegiatan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengembangan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publisitas Data dan Kegiatan Perkantoran', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Liputan Kegiatan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengembangan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Liputan Kegiatan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengembangan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Liputan Kegiatan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengembangan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Liputan Kegiatan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Peliputan Kegiatan, Manajemen Aset, dan Pengembangan Kehumasan Tahun 2026', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengembangan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Liputan Kegiatan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengembangan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Peliputan Kegiatan, Manajemen Aset, dan Pengembangan Kehumasan Tahun 2026', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengembangan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publisitas Data dan Kegiatan Perkantoran', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publisitas Data dan Kegiatan Perkantoran', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengembangan Kehumasan', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Hubungan Masyarakat'
FROM public.users WHERE full_name ILIKE '%Radina Yasinta%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Laporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksannya Pemilihan Pegawai Teladan Triwulanan Yang Profesiaonal', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanannya Pemilihan Pegawai Teladan Triwulanan Tahun 2026 Yang Profesional', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Arsip Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Arsip Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Arsip Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Arsip Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mengikuti kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan kegiatan Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanakan kegiatan Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Tersedianya Arsip Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Arsip Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mengikuti kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemeliharaan Sarana dan Prasarana TIK dan sarana prasarana perkantoran lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian pengadaan barang dan jasa TA 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Arsip Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya penyusunan laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload Data Kepegawaian yang Up to Date pada Aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran Minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Arsip Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengembangan Kompetensi Pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Laporan/Dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Arsip Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Arsip Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya sarana &amp;amp; prasarana gedung perkantoran yang bersih dan asri', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya halaman Kantor yang bersih dan asri', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terciptanya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date dan baik sesuai dengan peraturan kearsipan', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Layanan Front Office yang baik', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Berkas Pengadaan terkait Pemeliharaan Sarana dan Prasarana TIK dan sarana prasarana perkantoran lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload Data Kepegawaian yang Up to Date pada Aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Layanan Keamanan Kantor yang aman', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya sarana &amp;amp; prasarana gedung perkantoran yang bersih dan asri', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya halaman Kantor yang bersih dan asri', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'TerlaksananyaRapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Layanan Front Office yang baik', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Layanan Keamanan Kantor yang aman', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Layanan Keamanan Kantor yang aman', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian pengadaan barang dan jasa TA 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya bukti upload dokumen/laporan SPI setiap bulan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemeliharaan Sarana dan Prasarana TIK dan sarana prasarana perkantoran lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan pemeliharaan bangunan gedung dan peralatan mesin', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian pengadaan barang dan jasa TA 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terciptanya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date dan baik sesuai dengan peraturan kearsipan', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Membuat laporan BMN Semesteran dan Tahunan serta laporan BMN Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Pengajuan Penetapan Status Penggunaan BMN', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Pembuatan Kartu kendali Persediaan dan Aset', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Penyusunan Rencana Kebutuhan Barang Milik Negara (RKBMN)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Penyusunan BAST/tanda terima Persediaan, Aset dan barang habis pakai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Pembuatan Surat keterangan, Surat Pernyataan, Surat Tangungjawab mutlak, Surat kuasa dll Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan kegiatan penetapan status BMN dan pengendalian BMN', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terciptanya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date dan baik sesuai dengan peraturan kearsipan', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terselesaikannya Penyusunan Laporan Keuangan Tahunan 2025', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terselesaikannya Penyusunan Laporan Keuangan tingkat satker periode semesteran TA 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terselesaikannya Penyusunan Laporan Keuangan tingkat satker periode Triwulanan TA 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian pengadaan barang dan jasa TA 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tercapainya Nilai Kinerja Anggaran minimal "Baik"', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelaporan Cuti Pegawai', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengembangan Kompetensi Pegawai (Non Teknis)', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Laporan Pertanggungjawaban (LPJ) Bendahara Pengeluaran dan dokumen pendukungnya', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya bukti lapor pajak massa pph21 dan unifikasi melalui coretax', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya bukti upload dokumen/laporan SPI setiap bulan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersedianya Laporan KKP Triwulan Tahun 2026', id, 'Kasubag Umum, Perencanaan, dan Keuangan'
FROM public.users WHERE full_name ILIKE '%Muhammad Syafiudin%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penjaminan Kualitas Sensus dan Survei Kegiatan Tahun 2026', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Manajemen Resiko dan PK'
FROM public.users WHERE full_name ILIKE '%Rio Prananda%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publikasi/Laporan Neraca Produksi Yang Berkualitas', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publikasi/Laporan Statistik Neraca Pengeluaran Yang Berkualitas', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publikasi/laporan Analisis dan Pengembangan Statistik Yang Berkualitas', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Statistik Daerah Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Indikator Kesejahteraan Rakyat Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanannya Kegiatan Survei Snapshot Triwulanan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Snapshot Triwulanan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelatihan Petugas SKNP Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan FGD PDRB Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Administrasi Survei Neraca Produksi', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload Angka PDRB dan Publikasi Menurut Lapangan Usaha Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Khusus Neraca Produksi (SKNP) Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Konserda PDRB Menurut Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Khusus Triwulanan Neraca Produksi Barang dan Jasa Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Indepth Study SEEA Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Survei Inventarisasi Data Sekunder Triwulanan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Khusus Makanan Bergizi Gratis (MBG) Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pelatihan Petugas SKT Neraca Pengeluaran Tahunan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Administrasi Survei Neraca Pengeluaran', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload Angka PDRB dan Publikasi Menurut Pengeluaran Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Fenomena Ekonomi Pengeluaran Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Konserda PDRB Menurut Pengeluaran Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Penyusunan Disagregasi PMTB Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan SKSPPI Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Khusus Lembaga Non Profit Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data R-APBD Triwulanan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersusunnya Publikasi Statistik Daerah Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersusunnya Publikasi Indikator Kesejahteraan Rakyat Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tersusunnya Publikasi Indeks Pembangunan Manusia Tahun 2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan layout Publikasi PDRB Menurut Lapangan Usaha Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload Angka PDRB dan Publikasi Menurut Lapangan Usaha Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan layout Publikasi PDRB Menurut Pengeluaran Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Upload Angka PDRB dan Publikasi Menurut Pengeluaran Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan dan upload Publikasi Statistik Daerah Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan dan upload Publikasi Indikator Kesejahteraan Rakyat Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan dan upload Publikasi Indeks Pembangunan Manusia Tahun 2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Penyusunan Publikasi PDRB Menurut Lapangan Usaha Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pelatihan Petugas SKNP Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan FGD PDRB Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Administrasi Survei Neraca Produksi', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Upload Angka PDRB dan Publikasi Menurut Lapangan Usaha Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Survei Khusus Neraca Produksi (SKNP) Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Penghitungan Angka PDRB Menurut Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mengikuti Konserda PDRB Menurut Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Survei Khusus Triwulanan Neraca Produksi Barang dan Jasa Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Survei Indepth Study SEEA Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pengumpulan Data Survei Inventarisasi Data Sekunder Triwulanan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Survei Indepth Study Perekonomian Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Survei Khusus Makanan Bergizi Gratis (MBG) Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Penyusunan Publikasi PDRB Menurut Pengeluaran Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pelatihan Petugas SKT Neraca Pengeluaran Tahunan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Administrasi Survei Neraca Pengeluaran', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Upload Angka PDRB dan Publikasi Menurut Pengeluaran Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Penghitungan Angka PDRB Menurut Pengeluaran Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pengumpulan Data Fenomena Ekonomi Pengeluaran Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mengikuti Konserda PDRB Menurut Pengeluaran Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Survei Khusus Lembaga Non Profit (SKLNP) Tahunan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Survei Penyusunan Disagregasi PMTB Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publikasi/Laporan Statistik Neraca Pengeluaran Yang Berkualitas', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Survei Khusus Lembaga Non Profit Triwulanan (SKLNPRT) Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Survei Snapshot Triwulanan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Survei R-APBD Triwulanan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Menyusun Publikasi Statistik Daerah Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Menyusun Publikasi Indikator Kesejahteraan Rakyat Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Menyusun Publikasi Indeks Pembangunan Manusia Tahun 2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan layout Publikasi PDRB Menurut Lapangan Usaha Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan layout Publikasi PDRB Menurut Pengeluaran Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanannya Kegiatan Survei Snapshot Triwulanan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan dan upload Publikasi Statistik Daerah Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan dan upload Publikasi Indikator Kesejahteraan Rakyat Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan dan upload Publikasi Indeks Pembangunan Manusia Tahun 2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanannya Kegiatan Survei Snapshot Triwulanan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Telaksananya Pembuatan Publikasi/Laporan dan Pengembangan Statistik yang Berkualitas Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Indikator Kesejahteraan Rakyat Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Statistik Daerah Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Indikator Kesejahteraan Rakyat Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Upload Angka PDRB dan Publikasi Menurut Lapangan Usaha Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Upload Angka PDRB dan Publikasi Menurut Pengeluaran Tahun 2021-2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan dan upload Publikasi Statistik Daerah Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan dan upload Publikasi Indikator Kesejahteraan Rakyat Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan dan upload Publikasi Indeks Pembangunan Manusia Tahun 2025', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Snapshot Triwulanan Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Statistik Daerah Tahun 2026', id, 'Neraca Wilayah dan Analisis Statistik'
FROM public.users WHERE full_name ILIKE '%Susanti SST%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terwujudnya Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terwujudnya Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terwujudnya Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Evaluasi Penyelenggaraan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Evaluasi Penyelenggaraan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Evaluasi Penyelenggaraan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral Tahun 2026', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Evaluasi Penyelenggaraan Statistik Sektoral', id, 'Pembinaan Statistik Sektoral'
FROM public.users WHERE full_name ILIKE '%Agus Prianto%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pengembangan Metodologi Sensus dan Survei', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR) yang Akurat', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pengembangan Metodologi Sensus dan Survei', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran MFD, MBS, dan MSLS', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemanfaatan Software Perwajahan Publikasi', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pengembangan Infrastruktur dan Layanan Tekonologi Informasi dan Komunikasi', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pengembangan Metodologi Sensus dan Survei', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran MFD, MBS, dan MSLS', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran MFD, MBS, dan MSLS', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemanfaatan Software Perwajahan Publikasi', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', id, 'Pengolahan & Teknologi Informasi'
FROM public.users WHERE full_name ILIKE '%Alfi Nurrahmah%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas yang Baik Tahun 2026', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung Yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS Yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksaknanya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', id, 'Reformasi Birokrasi'
FROM public.users WHERE full_name ILIKE '%Qonita Iman%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Jasa', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Produksi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Pengeluaran', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS Yang Profesional', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Rekrutmen Mitra Statistik BPS', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanaan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Produksi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanaan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Pengeluaran', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pengisian Matrik Rencana Kinerja Bulanan', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam Rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi Tahun 2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi Tahun 2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi Tahun 2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', id, 'Sensus, dan Manajemen Lapangan & Mitra'
FROM public.users WHERE full_name ILIKE '%Kunthi Arsih%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Distribusi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Distribusi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Distribusi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Statistik Distribusi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Distribusi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Penyusunan Publikasi/Laporan Sensus Ekonomi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata Tahun 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Distribusi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Statistik Distribusi Tahun 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata (KTIP) Tahun 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Statistik Distribusi Tahun 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata Tahun 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Statistik Distribusi Tahun 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata Tahun 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata Tahun 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Statistik Distribusi Tahun 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata Tahun 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Distribusi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksannya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Sensus Ekonomi 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Statistik Distribusi Tahun 2026', id, 'Statistik Distribusi & KTIP'
FROM public.users WHERE full_name ILIKE '%Rojani SST,%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/ laporan Survei Penyempurnaan Diagram Timbang Nilai Tukar Petani', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Penyusunan Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Penyusunan Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Penyusunan Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Harga Tahun 2026', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Bahan Tayang Rilis BRS Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Penyusunan Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi Yang Akurat dan Tepat Waktu', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi Yang Akurat dan Tepat Waktu', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Harga Tahun 2026', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Penyusunan Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan bahan tayang rilis BRS Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Penyusunan Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Harga Tahun 2026', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Penyusunan Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/ laporan Survei Penyempurnaan Diagram Timbang Nilai Tukar Petani', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Harga Tahun 2026', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan bahan tayang rilis BRS Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Harga Tahun 2026', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Bahan Tayang, Naskah, dan Laporan Rilis BRS Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Harga Tahun 2026', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Inflasi', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Statistik Harga Tahun 2026', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Biaya Hidup', id, 'Statistik Harga'
FROM public.users WHERE full_name ILIKE '%Marta Puspitasari%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Hayati yang Berkualitas', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Mineral dan Konstruksi yang Berkualitas', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Hayati yang Berkualitas', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Lapangan Laporan Triwulanan Pelabuhan Perikanan dan Tempat Pelelangan Ikan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Perkebunan Bulanan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Besar Sedang (IBS) Triwulanan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pemeriksaan dan upload Publikasi Luas panen dan produksi padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan dan upload Publikasi Direktori Perusahaan Industri Besar Sedang tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Kehutanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Laporan Perusahaan Budidaya Ikan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Penangkapan Ikan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Lapangan Laporan Triwulanan Pelabuhan Perikanan dan Tempat Pelelangan Ikan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Pemotongan Ternak Bulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Peternakan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Jagung Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Pangan/Palawija', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Kering Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Giling tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Hortikultura tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Usaha Hortikultura Lainnya', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTP) Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTL) tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perkebunan Tahunan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Perkebunan Bulanan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Updating Direktori Perusahaan Pertanian (DPP) dan Updating Direktori Usaha Pertanian Lainnya (DUTL)', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Palawija', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Alsintan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Benih tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Lahan tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan penyusunan Publikasi Luas panen dan produksi padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Besar Sedang (IBS) Triwulanan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutahiran Direktori Perusahaan Awal (DPA) Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Industri Manufaktur Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Konstruksi Tahunan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Perusahaan Konstruksi Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Perusahaan Tahunan Air Bersih Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Usaha Penggalian Bahan Industri dan Konstruksi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Triwulanan Air Bersih Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Triwulanan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Perusahaan Pertambangan dan Energi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Perusahaan Pertambangan Non MIGAS Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Publikasi Direktori Perusahaan Industri Besar Sedang tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Captive Power Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pelatihan Petugas Survei Kerangka Sampel Area (KSA) Padi sebagai Panitia', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Pangan/Palawija', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTP) Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTL) tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Updating Direktori Perusahaan Pertanian (DPP) dan Updating Direktori Usaha Pertanian Lainnya (DUTL)', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Besar Sedang (IBS) Triwulanan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutahiran Direktori Perusahaan Awal (DPA) Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Kehutanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Laporan Perusahaan Budidaya Ikan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Penangkapan Ikan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Lapangan Laporan Triwulanan Pelabuhan Perikanan dan Tempat Pelelangan Ikan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Pemotongan Ternak Bulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Peternakan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Jagung Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Pangan/Palawija', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Kering Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Giling tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Hortikultura tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Usaha Hortikultura Lainnya', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTP) Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTL) tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perkebunan Tahunan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Perkebunan Bulanan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Updating Direktori Perusahaan Pertanian (DPP) dan Updating Direktori Usaha Pertanian Lainnya (DUTL)', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan pemeriksaan Publikasi Luas Panen dan Produksi Padi Kabupaten Belitung', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Besar Sedang (IBS) Triwulanan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Industri Manufaktur Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Konstruksi Tahunan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Perusahaan Konstruksi Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Perusahaan Tahunan Air Bersih Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Usaha Penggalian Bahan Industri dan Konstruksi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Triwulanan Air Bersih Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Triwulanan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Perusahaan Pertambangan dan Energi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Perusahaan Pertambangan Non MIGAS Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya pemeriksaan Publikasi Direktori Perusahaan Industri Besar Sedang Kabupaten Belitung', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Captive Power Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Lapangan Laporan Triwulanan Pelabuhan Perikanan dan Tempat Pelelangan Ikan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Pemotongan Ternak Bulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Jagung Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Pangan/Palawija', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Kering Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Giling tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTP) Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perkebunan Tahunan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Perkebunan Bulanan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Updating Direktori Perusahaan Pertanian (DPP) dan Updating Direktori Usaha Pertanian Lainnya (DUTL)', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Palawija', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan penyusunan Publikasi Luas panen dan produksi padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Perusahaan Pertambangan dan Energi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Perusahaan Pertambangan Non MIGAS Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Publikasi Direktori Perusahaan Industri Besar Sedang tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Captive Power Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Kering Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Giling tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Kehutanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Laporan Perusahaan Budidaya Ikan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Penangkapan Ikan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Lapangan Laporan Triwulanan Pelabuhan Perikanan dan Tempat Pelelangan Ikan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Pemotongan Ternak Bulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Peternakan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Jagung Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Pangan/Palawija', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Kering Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Giling tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Hortikultura tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Usaha Hortikultura Lainnya', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTP) Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTL) tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perkebunan Tahunan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Perkebunan Bulanan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Updating Direktori Perusahaan Pertanian (DPP) dan Updating Direktori Usaha Pertanian Lainnya (DUTL)', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Palawija', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Alsintan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Benih tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Lahan tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan penyusunan Publikasi Luas panen dan produksi padi', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Besar Sedang (IBS) Triwulanan', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutahiran Direktori Perusahaan Awal (DPA) Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Industri Manufaktur Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Konstruksi Tahunan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Perusahaan Konstruksi Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Perusahaan Tahunan Air Bersih Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Usaha Penggalian Bahan Industri dan Konstruksi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Triwulanan Air Bersih Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Triwulanan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Updating Direktori Perusahaan Pertambangan dan Energi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Perusahaan Pertambangan Non MIGAS Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Publikasi Direktori Perusahaan Industri Besar Sedang tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Captive Power Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Triwulanan Tahun 2026', id, 'Statistik Produksi'
FROM public.users WHERE full_name ILIKE '%Seraman S.A.P.%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan kegiatan Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Melaksanakan Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pembinaan Desa Cantik Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Statistik Sosial'
FROM public.users WHERE full_name ILIKE '%Irma Setiyani%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Statistik Kependudukan Dan Ketenagakerjaan Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Statistik Sumber Daya Hayati yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Statistik Sumber Daya Mineral dan Konstruksi yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Statistik Industri Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Statistik Distribusi Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Statistik Harga Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Statistik Jasa yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Neraca Produksi Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Neraca Pengeluaran Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Publikasi/Laporan Analisis Statistik dan Neraca Satelit yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Persentase Kumulatif Desa Yang Berpredikat Desa Cinta Statistik', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Tingkat Penyelenggaraan Pembinaan Statistik Sektoral sesuai standar', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Indeks Pelayanan Publik - Penilaian Mandiri', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Nilai SAKIP oleh Inspektorat', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Indeks Implementasi BerAKHLAK', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Hayati yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Mineral dan Konstruksi yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penjaminan Kualitas Sensus dan Survei', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembangunan Zona Integritas yang Baik', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pelayanan Publik BPS Kabupaten Belitung', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publisitas Data dan Kegiatan Perkantoran', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Peliputan Kegiatan, Manajemen Aset, dan Pengembangan Kehumasan', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pembinaan Desa Cantik Tahun 2026', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/ laporan Survei Penyempurnaan Diagram Timbang Nilai Tukar Petani', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publikasi/Laporan Neraca Produksi Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publikasi/Laporan Statistik Neraca Pengeluaran Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Publikasi/laporan Analisis dan Pengembangan Statistik Yang Berkualitas', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terwujudnya Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Jasa', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Produksi', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Pengeluaran', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Rekrutmen Mitra Statistik BPS', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Distribusi', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksanya Pengembangan Metodologi Sensus dan Survei', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, ketua_tim_id, tim_kerja)
SELECT 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi', id, 'Team Belitung'
FROM public.users WHERE full_name ILIKE '%Baiq Kurniawati%'
LIMIT 1
ON CONFLICT (rencana_kinerja) DO UPDATE SET 
  ketua_tim_id = EXCLUDED.ketua_tim_id,
  tim_kerja = EXCLUDED.tim_kerja;
