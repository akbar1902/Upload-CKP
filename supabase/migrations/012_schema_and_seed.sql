-- Migration: Schema changes to support duplicate RK names across teams

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
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pelayanan Publik BPS Kabupaten Belitung', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksanya Manajemen Official Website BPS Kabupaten Belitung', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pendataan Survei Kebutuhan Data (SKD) 2026', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Coaching Clinic PEKPPP', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi Kabupaten Belitung Dalam Angka 2026', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pelayanan Statistik Terpadu (PST)', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Tugas Harian Pelayanan Pengaduan', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya menjadi petugas harian PST', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pelayanan Statistik Terpadu (PST) Yang Profresioanal', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pelayanan Statistik Terpadu (PST) Menjadi Petugas Pengaduan', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Coaching Clinic PEKPPP', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Menjadi petugas harian pengaduan', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan pendataan Survei Kebutuhan Data (SKD) 2026', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melakukan pengisian LKE Penilaian Mandiri PEKPPP', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Menjadi petugas harian PST', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Mengikuti Seminar/Pelatihan/Briefing terkait pelayanan publik', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan pendataan Survei Kebutuhan Data (SKD) 2026', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan petugas harian PST', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya petugas harian PST', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengisian LKE Penilaian Mandiri PEKPPP', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Tugas Harian Pelayanan Statistik Terpadu (PST)', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Seminar/Pelatihan/Briefing terkait Pelayanan Publik', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Tugas Harian Pengaduan', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Mengikuti Coaching Clinic PEKPPP', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melakukan pengelolaan official website BPS Kabupaten Belitung', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pelayanan Pengaduan', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya penyusunan laporan Survei Kebutuhan Data (SKD) Triwulanan 2026', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya penyusunan publikasi hasil Survei Kebutuhan Data (SKD) 2026', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya pendataan Survei Kebutuhan Data (SKD) 2026', 'Diseminasi Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Publisitas Data dan Kegiatan Perkantoran', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Peliputan Kegiatan, Manajemen Aset, dan Pengembangan Kehumasan', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pembuatan dan Publisitas Konten', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Liputan Kegiatan Kehumasan', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pengembangan Kehumasan', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Pembuatan dan Publisitas Konten', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Konferensi Pers dan Pengacaraan Kehumasan Lainnya', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Pembuatan dan Publisitas Konten', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Konferensi Pers dan Pengacaraan Kehumasan Lainnya', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Peliputan Kegiatan, Manajemen Aset, dan Pengembangan Kehumasan Tahun 2026', 'Hubungan Masyarakat')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terpenuhinya Dokumen Pendukung Implementasi SAKIP', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Laporan Cuti Pegawai', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksannya Pemilihan Pegawai Teladan Triwulanan Yang Profesiaonal', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksanannya Pemilihan Pegawai Teladan Triwulanan Tahun 2026 Yang Profesional', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pelaporan Cuti Pegawai', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersedianya Arsip Cuti Pegawai', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Upload data kepegawaian yang up to date pada aplikasi SIMPEG', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Pemilihan Pegawai Teladan Triwulanan Tahun 2026', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Mengikuti kegiatan pengembangan kompetensi pegawai (Non Teknis)', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan kegiatan Upload data kepegawaian yang up to date pada aplikasi SIMPEG', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Tercapainya Nilai Kinerja Anggaran minimal Baik', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksanakan kegiatan Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Pemilihan Pegawai Teladan Triwulanan Tahun 2026', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Tersedianya Arsip Cuti Pegawai', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pemeliharaan Sarana dan Prasarana TIK dan sarana prasarana perkantoran lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyelesaian pengadaan barang dan jasa TA 2026', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tercapainya Nilai Kinerja Anggaran minimal Baik', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Arsip Cuti Pegawai', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya penyusunan laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Upload Data Kepegawaian yang Up to Date pada Aplikasi SIMPEG', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tercapainya Nilai Kinerja Anggaran Minimal Baik', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pengembangan Kompetensi Pegawai (Non Teknis)', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terpenuhinya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersedianya Laporan/Dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terpenuhinya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terpenuhinya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pelaporan Arsip Cuti Pegawai', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersedianya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya data kepegawaian yang up to date pada aplikasi SIMPEG', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya pelaporan Cuti Pegawai', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersedianya sarana &amp;amp; prasarana gedung perkantoran yang bersih dan asri', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersedianya halaman Kantor yang bersih dan asri', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terciptanya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date dan baik sesuai dengan peraturan kearsipan', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Layanan Front Office yang baik', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Berkas Pengadaan terkait Pemeliharaan Sarana dan Prasarana TIK dan sarana prasarana perkantoran lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Layanan Keamanan Kantor yang aman', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('TerlaksananyaRapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersedianya bukti upload dokumen/laporan SPI setiap bulan Tahun 2026', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan pemeliharaan bangunan gedung dan peralatan mesin', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Membuat laporan BMN Semesteran dan Tahunan serta laporan BMN Lainnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Pengajuan Penetapan Status Penggunaan BMN', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Pembuatan Kartu kendali Persediaan dan Aset', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Penyusunan Rencana Kebutuhan Barang Milik Negara (RKBMN)', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Penyusunan BAST/tanda terima Persediaan, Aset dan barang habis pakai', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Pembuatan Surat keterangan, Surat Pernyataan, Surat Tangungjawab mutlak, Surat kuasa dll Tahun 2026', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan kegiatan penetapan status BMN dan pengendalian BMN', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terselesaikannya Penyusunan Laporan Keuangan Tahunan 2025', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terselesaikannya Penyusunan Laporan Keuangan tingkat satker periode semesteran TA 2026', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terselesaikannya Penyusunan Laporan Keuangan tingkat satker periode Triwulanan TA 2026', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersedianya Laporan Pertanggungjawaban (LPJ) Bendahara Pengeluaran dan dokumen pendukungnya', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersedianya bukti lapor pajak massa pph21 dan unifikasi melalui coretax', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersedianya Laporan KKP Triwulan Tahun 2026', 'Kasubag Umum, Perencanaan, dan Keuangan')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', 'Manajemen Resiko dan PK')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penjaminan Kualitas Sensus dan Survei', 'Manajemen Resiko dan PK')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', 'Manajemen Resiko dan PK')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', 'Manajemen Resiko dan PK')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penjaminan Kualitas Sensus dan Survei Kegiatan Tahun 2026', 'Manajemen Resiko dan PK')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', 'Manajemen Resiko dan PK')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei', 'Manajemen Resiko dan PK')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', 'Manajemen Resiko dan PK')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Publikasi/Laporan Neraca Produksi Yang Berkualitas', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Publikasi/Laporan Statistik Neraca Pengeluaran Yang Berkualitas', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Publikasi/laporan Analisis dan Pengembangan Statistik Yang Berkualitas', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi Statistik Daerah Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi Indikator Kesejahteraan Rakyat Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksanannya Kegiatan Survei Snapshot Triwulanan Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Survei Snapshot Triwulanan Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pelatihan Petugas SKNP Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan FGD PDRB Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Administrasi Survei Neraca Produksi', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Upload Angka PDRB dan Publikasi Menurut Lapangan Usaha Tahun 2021-2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Survei Khusus Neraca Produksi (SKNP) Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Konserda PDRB Menurut Lapangan Usaha Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Survei Khusus Triwulanan Neraca Produksi Barang dan Jasa Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Indepth Study SEEA Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengumpulan Data Survei Inventarisasi Data Sekunder Triwulanan Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Khusus Makanan Bergizi Gratis (MBG) Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pelatihan Petugas SKT Neraca Pengeluaran Tahunan Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Administrasi Survei Neraca Pengeluaran', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Upload Angka PDRB dan Publikasi Menurut Pengeluaran Tahun 2021-2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengumpulan Data Fenomena Ekonomi Pengeluaran Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Konserda PDRB Menurut Pengeluaran Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Survei Penyusunan Disagregasi PMTB Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan SKSPPI Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Khusus Lembaga Non Profit Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengumpulan Data R-APBD Triwulanan Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersusunnya Publikasi Statistik Daerah Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersusunnya Publikasi Indikator Kesejahteraan Rakyat Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tersusunnya Publikasi Indeks Pembangunan Manusia Tahun 2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya pemeriksaan layout Publikasi PDRB Menurut Lapangan Usaha Tahun 2021-2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya pemeriksaan layout Publikasi PDRB Menurut Pengeluaran Tahun 2021-2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksanya Upload Angka PDRB dan Publikasi Menurut Pengeluaran Tahun 2021-2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya pemeriksaan dan upload Publikasi Statistik Daerah Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya pemeriksaan dan upload Publikasi Indikator Kesejahteraan Rakyat Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya pemeriksaan dan upload Publikasi Indeks Pembangunan Manusia Tahun 2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Penyusunan Publikasi PDRB Menurut Lapangan Usaha Tahun 2021-2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Pelatihan Petugas SKNP Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan FGD PDRB Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Administrasi Survei Neraca Produksi', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Upload Angka PDRB dan Publikasi Menurut Lapangan Usaha Tahun 2021-2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Survei Khusus Neraca Produksi (SKNP) Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Penghitungan Angka PDRB Menurut Lapangan Usaha Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Mengikuti Konserda PDRB Menurut Lapangan Usaha Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Survei Khusus Triwulanan Neraca Produksi Barang dan Jasa Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Survei Indepth Study SEEA Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Pengumpulan Data Survei Inventarisasi Data Sekunder Triwulanan Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Survei Indepth Study Perekonomian Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Survei Khusus Makanan Bergizi Gratis (MBG) Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Penyusunan Publikasi PDRB Menurut Pengeluaran Tahun 2021-2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Pelatihan Petugas SKT Neraca Pengeluaran Tahunan Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Administrasi Survei Neraca Pengeluaran', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Upload Angka PDRB dan Publikasi Menurut Pengeluaran Tahun 2021-2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Penghitungan Angka PDRB Menurut Pengeluaran Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Pengumpulan Data Fenomena Ekonomi Pengeluaran Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Mengikuti Konserda PDRB Menurut Pengeluaran Tahunan dan Triwulanan', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Survei Khusus Lembaga Non Profit (SKLNP) Tahunan Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Survei Penyusunan Disagregasi PMTB Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Survei Khusus Lembaga Non Profit Triwulanan (SKLNPRT) Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Survei Snapshot Triwulanan Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Survei R-APBD Triwulanan Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Menyusun Publikasi Statistik Daerah Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Menyusun Publikasi Indikator Kesejahteraan Rakyat Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Menyusun Publikasi Indeks Pembangunan Manusia Tahun 2025', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Telaksananya Pembuatan Publikasi/Laporan dan Pengembangan Statistik yang Berkualitas Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Indikator Kesejahteraan Rakyat Tahun 2026', 'Neraca Wilayah dan Analisis Statistik')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terwujudnya Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah', 'Pembinaan Statistik Sektoral')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral', 'Pembinaan Statistik Sektoral')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pembinaan Statistik Sektoral', 'Pembinaan Statistik Sektoral')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah', 'Pembinaan Statistik Sektoral')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Evaluasi Penyelenggaraan Statistik Sektoral', 'Pembinaan Statistik Sektoral')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Rapat Internal Tim Pembinaan Statistik Sektoral', 'Pembinaan Statistik Sektoral')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Pembinaan Statistik Sektoral', 'Pembinaan Statistik Sektoral')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Evaluasi Penyelenggaraan Statistik Sektoral', 'Pembinaan Statistik Sektoral')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pembinaan Statistik Sektoral Tahun 2026', 'Pembinaan Statistik Sektoral')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksanya Pengembangan Metodologi Sensus dan Survei', 'Pengolahan & Teknologi Informasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi', 'Pengolahan & Teknologi Informasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', 'Pengolahan & Teknologi Informasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR) yang Akurat', 'Pengolahan & Teknologi Informasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', 'Pengolahan & Teknologi Informasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', 'Pengolahan & Teknologi Informasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', 'Pengolahan & Teknologi Informasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pemutakhiran MFD, MBS, dan MSLS', 'Pengolahan & Teknologi Informasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pemanfaatan Software Perwajahan Publikasi', 'Pengolahan & Teknologi Informasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Pengembangan Infrastruktur dan Layanan Tekonologi Informasi dan Komunikasi', 'Pengolahan & Teknologi Informasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksanya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)', 'Pengolahan & Teknologi Informasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pembangunan Zona Integritas yang Baik', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Implementasi Nilai Budaya Kerja yang Baik', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pembangunan Zona Integritas yang Baik Tahun 2026', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung Yang Baik', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS Yang Baik', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksaknanya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung', 'Reformasi Birokrasi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Jasa', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Rekrutmen Mitra Statistik BPS', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Produksi', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Pengeluaran', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Rekrutmen Mitra Statistik Tahun 2027', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Rekrutmen Mitra Statistik BPS Yang Profesional', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Rekrutmen Mitra Statistik dalam rangka SE2026', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Rekrutmen Mitra Statistik Tahun 2027', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Rekrutmen Mitra Statistik BPS', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Rekrutmen Mitra Statistik BPS Tahun 2027', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanaan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Produksi', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanaan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Pengeluaran', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Pengisian Matrik Rencana Kinerja Bulanan', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Rekrutmen Mitra Statistik dalam Rangka SE2026', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi Tahun 2026', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Rekrutmen Mitra Statistik dalam rangka SE2026', 'Sensus, dan Manajemen Lapangan & Mitra')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Statistik Distribusi', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Sensus Ekonomi 2026', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Statistik Distribusi', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Sensus Ekonomi 2026', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Statistik Distribusi', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Sensus Ekonomi 2026', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Penyusunan Publikasi/Laporan Sensus Ekonomi', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata Tahun 2026', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Sensus Ekonomi', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Statistik Distribusi Tahun 2026', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata (KTIP) Tahun 2026', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi 2026', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksannya Sensus Ekonomi 2026', 'Statistik Distribusi & KTIP')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/ laporan Survei Penyempurnaan Diagram Timbang Nilai Tukar Petani', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Statistik Harga', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Penyusunan Inflasi', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Biaya Hidup', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Statistik Harga Tahun 2026', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Bahan Tayang Rilis BRS Inflasi', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Statistik Harga', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Penyusunan Inflasi', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Survei Biaya Hidup', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi Yang Akurat dan Tepat Waktu', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi Inflasi', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya pemeriksaan bahan tayang rilis BRS Inflasi', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Bahan Tayang, Naskah, dan Laporan Rilis BRS Inflasi', 'Statistik Harga')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Hayati yang Berkualitas', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Mineral dan Konstruksi yang Berkualitas', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Lapangan Laporan Triwulanan Pelabuhan Perikanan dan Tempat Pelelangan Ikan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Perkebunan Bulanan', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Industri Besar Sedang (IBS) Triwulanan', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan pemeriksaan dan upload Publikasi Luas panen dan produksi padi', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya pemeriksaan dan upload Publikasi Direktori Perusahaan Industri Besar Sedang tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Tahunan Perusahaan Kehutanan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Laporan Perusahaan Budidaya Ikan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Penangkapan Ikan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Laporan Pemotongan Ternak Bulanan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Peternakan', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Jagung Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Padi', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Pangan/Palawija', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Padi', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Kering Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Giling tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Hortikultura tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Usaha Hortikultura Lainnya', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTP) Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTL) tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Survei Perkebunan Tahunan', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Updating Direktori Perusahaan Pertanian (DPP) dan Updating Direktori Usaha Pertanian Lainnya (DUTL)', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Palawija', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Alsintan', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Benih tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Lahan tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan penyusunan Publikasi Luas panen dan produksi padi', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pemutahiran Direktori Perusahaan Awal (DPA) Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Tahunan Perusahaan Industri Manufaktur Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Konstruksi Tahunan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Perusahaan Konstruksi Triwulanan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Perusahaan Tahunan Air Bersih Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Tahunan Usaha Penggalian Bahan Industri dan Konstruksi Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Triwulanan Air Bersih Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Triwulanan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Updating Direktori Perusahaan Pertambangan dan Energi Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Perusahaan Pertambangan Non MIGAS Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Tahunan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Publikasi Direktori Perusahaan Industri Besar Sedang tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Captive Power Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pelatihan Petugas Survei Kerangka Sampel Area (KSA) Padi sebagai Panitia', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan pemeriksaan Publikasi Luas Panen dan Produksi Padi Kabupaten Belitung', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya pemeriksaan Publikasi Direktori Perusahaan Industri Besar Sedang Kabupaten Belitung', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Peternakan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Industri Mikro Kecil Triwulanan Tahun 2026', 'Statistik Produksi')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pembinaan Desa Cantik Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan kegiatan Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Kegiatan Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Melaksanakan Pembinaan Desa Cantik Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Pembinaan Desa Cantik Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', 'Statistik Sosial')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Statistik Kependudukan Dan Ketenagakerjaan Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Statistik Sumber Daya Hayati yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Statistik Sumber Daya Mineral dan Konstruksi yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Statistik Industri Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Statistik Distribusi Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Statistik Harga Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Statistik Jasa yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Neraca Produksi Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Neraca Pengeluaran Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Publikasi/Laporan Analisis Statistik dan Neraca Satelit yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Persentase Kumulatif Desa Yang Berpredikat Desa Cinta Statistik', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Tingkat Penyelenggaraan Pembinaan Statistik Sektoral sesuai standar', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Indeks Pelayanan Publik - Penilaian Mandiri', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Nilai SAKIP oleh Inspektorat', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Indeks Implementasi BerAKHLAK', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terpenuhinya Dokumen Pendukung Implementasi SAKIP', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Hayati yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Mineral dan Konstruksi yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penjaminan Kualitas Sensus dan Survei', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pembangunan Zona Integritas yang Baik', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Implementasi Nilai Budaya Kerja yang Baik', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pelayanan Publik BPS Kabupaten Belitung', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksanya Manajemen Official Website BPS Kabupaten Belitung', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Publisitas Data dan Kegiatan Perkantoran', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Peliputan Kegiatan, Manajemen Aset, dan Pengembangan Kehumasan', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pembinaan Desa Cantik Tahun 2026', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/ laporan Survei Penyempurnaan Diagram Timbang Nilai Tukar Petani', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Publikasi/Laporan Neraca Produksi Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Publikasi/Laporan Statistik Neraca Pengeluaran Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Publikasi/laporan Analisis dan Pengembangan Statistik Yang Berkualitas', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terwujudnya Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Jasa', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Produksi', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Pengeluaran', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Rekrutmen Mitra Statistik BPS', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Statistik Distribusi', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksanya Pengembangan Metodologi Sensus dan Survei', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;
INSERT INTO public.rk_ketua_tim_mapping (rencana_kinerja, tim_kerja)
VALUES ('Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi', 'Team Belitung')
ON CONFLICT ON CONSTRAINT rk_ketua_tim_mapping_rk_tim_unique DO NOTHING;


-- 6. Seed user_rk_assignments based on the master Excel assignments

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Publik BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pendataan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Kabupaten Belitung Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Kabupaten Belitung Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya menjadi petugas harian PST'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST) Yang Profresioanal'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST) Menjadi Petugas Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST) Menjadi Petugas Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Menjadi petugas harian pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Menjadi petugas harian pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan pendataan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melakukan pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Menjadi petugas harian PST'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Mengikuti Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pendataan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan petugas harian PST'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya petugas harian PST'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pendataan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Kabupaten Belitung Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Seminar/Pelatihan/Briefing terkait Pelayanan Publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan pendataan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Mengikuti Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Menjadi petugas harian PST'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Mengikuti Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Menjadi petugas harian pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melakukan pengelolaan official website BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadiyah Hanifah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadiyah Hanifah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Kabupaten Belitung Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya menjadi petugas harian PST'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Menjadi petugas harian pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pendataan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya menjadi petugas harian PST'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya penyusunan laporan Survei Kebutuhan Data (SKD) Triwulanan 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya penyusunan publikasi hasil Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Kecamatan Dalam Angka 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Statistik Terpadu (PST)'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya pendataan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Coaching Clinic PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya pengisian LKE Penilaian Mandiri PEKPPP'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya menjadi petugas harian PST'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Seminar/Pelatihan/Briefing terkait pelayanan publik'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Tugas Harian Pelayanan Pengaduan'
  AND rk.tim_kerja = 'Diseminasi Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publisitas Data dan Kegiatan Perkantoran'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Peliputan Kegiatan, Manajemen Aset, dan Pengembangan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Liputan Kegiatan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengembangan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Liputan Kegiatan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengembangan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publisitas Data dan Kegiatan Perkantoran'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Liputan Kegiatan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengembangan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadiyah Hanifah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadiyah Hanifah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Liputan Kegiatan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengembangan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Liputan Kegiatan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengembangan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Liputan Kegiatan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Peliputan Kegiatan, Manajemen Aset, dan Pengembangan Kehumasan Tahun 2026'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengembangan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Liputan Kegiatan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengembangan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Peliputan Kegiatan, Manajemen Aset, dan Pengembangan Kehumasan Tahun 2026'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengembangan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publisitas Data dan Kegiatan Perkantoran'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publisitas Data dan Kegiatan Perkantoran'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Melaksanakan Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Manajemen Aset dan Laporan Kehumasan Tahun 2026'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengembangan Kehumasan'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembuatan dan Publisitas Konten'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Hubungan Masyarakat'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Laporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksannya Pemilihan Pegawai Teladan Triwulanan Yang Profesiaonal'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksanannya Pemilihan Pegawai Teladan Triwulanan Tahun 2026 Yang Profesional'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Tersedianya Arsip Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Tersedianya Arsip Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Tersedianya Arsip Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Tersedianya Arsip Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Mengikuti kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Melaksanakan kegiatan Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksanakan kegiatan Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Tersedianya Arsip Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Tersedianya Arsip Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Mengikuti kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemeliharaan Sarana dan Prasarana TIK dan sarana prasarana perkantoran lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian pengadaan barang dan jasa TA 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Arsip Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya penyusunan laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload Data Kepegawaian yang Up to Date pada Aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran Minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Tersedianya Arsip Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengembangan Kompetensi Pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Tersedianya Laporan/Dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Arsip Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Arsip Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Tersedianya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terpenuhinya laporan/dokumen Monitoring &amp;amp; Evaluasi Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Tersedianya sarana &amp;amp; prasarana gedung perkantoran yang bersih dan asri'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Tersedianya halaman Kantor yang bersih dan asri'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terciptanya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date dan baik sesuai dengan peraturan kearsipan'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksananya Layanan Front Office yang baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Berkas Pengadaan terkait Pemeliharaan Sarana dan Prasarana TIK dan sarana prasarana perkantoran lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload Data Kepegawaian yang Up to Date pada Aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Layanan Keamanan Kantor yang aman'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'Tersedianya sarana &amp;amp; prasarana gedung perkantoran yang bersih dan asri'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'Tersedianya halaman Kantor yang bersih dan asri'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'TerlaksananyaRapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Layanan Front Office yang baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Layanan Keamanan Kantor yang aman'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Layanan Keamanan Kantor yang aman'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian pengadaan barang dan jasa TA 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Tersedianya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Tersedianya bukti upload dokumen/laporan SPI setiap bulan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemeliharaan Sarana dan Prasarana TIK dan sarana prasarana perkantoran lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Melaksanakan pemeliharaan bangunan gedung dan peralatan mesin'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian pengadaan barang dan jasa TA 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terciptanya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date dan baik sesuai dengan peraturan kearsipan'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengembangan kompetensi pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Membuat laporan BMN Semesteran dan Tahunan serta laporan BMN Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Pengajuan Penetapan Status Penggunaan BMN'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Pembuatan Kartu kendali Persediaan dan Aset'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Penyusunan Rencana Kebutuhan Barang Milik Negara (RKBMN)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Penyusunan BAST/tanda terima Persediaan, Aset dan barang habis pakai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Pembuatan Surat keterangan, Surat Pernyataan, Surat Tangungjawab mutlak, Surat kuasa dll Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Melaksanakan kegiatan penetapan status BMN dan pengendalian BMN'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terciptanya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date dan baik sesuai dengan peraturan kearsipan'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terselesaikannya Penyusunan Laporan Keuangan Tahunan 2025'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terselesaikannya Penyusunan Laporan Keuangan tingkat satker periode semesteran TA 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terselesaikannya Penyusunan Laporan Keuangan tingkat satker periode Triwulanan TA 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload data kepegawaian yang up to date pada aplikasi SIMPEG'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian pengadaan barang dan jasa TA 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyelesaian Pembayaran Tagihan Yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Tercapainya Nilai Kinerja Anggaran minimal Baik'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Tersedianya Arsip Keuangan &amp;amp; Berkas Pendukung lainnya Yang Up To Date'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Budaya Organisasi (Apel Mingguan/Bulanan dan Apel/Upacara Hari Besar)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Terkait Kegiatan Subbagian Umum dan Dukungan Manajemen Lainnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemilihan Pegawai Teladan Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelaporan Cuti Pegawai'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengembangan Kompetensi Pegawai (Non Teknis)'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Kinerja Dalam Rangka Implementasi SAKIP'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Tersedianya Laporan Pertanggungjawaban (LPJ) Bendahara Pengeluaran dan dokumen pendukungnya'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Tersedianya bukti lapor pajak massa pph21 dan unifikasi melalui coretax'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Tersedianya bukti upload dokumen/laporan SPI setiap bulan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Tersedianya Laporan KKP Triwulan Tahun 2026'
  AND rk.tim_kerja = 'Kasubag Umum, Perencanaan, dan Keuangan'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penjaminan Kualitas Sensus dan Survei Kegiatan Tahun 2026'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Melaksanakan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan yang Berkaitan dengan Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Manajemen Resiko dan PK'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publikasi/Laporan Neraca Produksi Yang Berkualitas'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publikasi/Laporan Statistik Neraca Pengeluaran Yang Berkualitas'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publikasi/laporan Analisis dan Pengembangan Statistik Yang Berkualitas'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Statistik Daerah Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Indikator Kesejahteraan Rakyat Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksanannya Kegiatan Survei Snapshot Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Snapshot Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelatihan Petugas SKNP Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan FGD PDRB Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Administrasi Survei Neraca Produksi'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload Angka PDRB dan Publikasi Menurut Lapangan Usaha Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Khusus Neraca Produksi (SKNP) Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Konserda PDRB Menurut Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Khusus Triwulanan Neraca Produksi Barang dan Jasa Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Indepth Study SEEA Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Survei Inventarisasi Data Sekunder Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Khusus Makanan Bergizi Gratis (MBG) Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pelatihan Petugas SKT Neraca Pengeluaran Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Administrasi Survei Neraca Pengeluaran'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload Angka PDRB dan Publikasi Menurut Pengeluaran Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Fenomena Ekonomi Pengeluaran Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Konserda PDRB Menurut Pengeluaran Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Penyusunan Disagregasi PMTB Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan SKSPPI Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Khusus Lembaga Non Profit Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data R-APBD Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Tersusunnya Publikasi Statistik Daerah Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Tersusunnya Publikasi Indikator Kesejahteraan Rakyat Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Tersusunnya Publikasi Indeks Pembangunan Manusia Tahun 2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan layout Publikasi PDRB Menurut Lapangan Usaha Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload Angka PDRB dan Publikasi Menurut Lapangan Usaha Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan layout Publikasi PDRB Menurut Pengeluaran Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksanya Upload Angka PDRB dan Publikasi Menurut Pengeluaran Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan dan upload Publikasi Statistik Daerah Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan dan upload Publikasi Indikator Kesejahteraan Rakyat Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan dan upload Publikasi Indeks Pembangunan Manusia Tahun 2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Penyusunan Publikasi PDRB Menurut Lapangan Usaha Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pelatihan Petugas SKNP Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan FGD PDRB Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Administrasi Survei Neraca Produksi'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Upload Angka PDRB dan Publikasi Menurut Lapangan Usaha Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Survei Khusus Neraca Produksi (SKNP) Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Penghitungan Angka PDRB Menurut Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Mengikuti Konserda PDRB Menurut Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Survei Khusus Triwulanan Neraca Produksi Barang dan Jasa Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Survei Indepth Study SEEA Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pengumpulan Data Survei Inventarisasi Data Sekunder Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Survei Indepth Study Perekonomian Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Survei Khusus Makanan Bergizi Gratis (MBG) Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Penyusunan Publikasi PDRB Menurut Pengeluaran Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pelatihan Petugas SKT Neraca Pengeluaran Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Administrasi Survei Neraca Pengeluaran'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Upload Angka PDRB dan Publikasi Menurut Pengeluaran Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Penghitungan Angka PDRB Menurut Pengeluaran Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pengumpulan Data Fenomena Ekonomi Pengeluaran Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Mengikuti Konserda PDRB Menurut Pengeluaran Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Survei Khusus Lembaga Non Profit (SKLNP) Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Survei Penyusunan Disagregasi PMTB Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publikasi/Laporan Statistik Neraca Pengeluaran Yang Berkualitas'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Survei Khusus Lembaga Non Profit Triwulanan (SKLNPRT) Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Survei Snapshot Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Survei R-APBD Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Menyusun Publikasi Statistik Daerah Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Menyusun Publikasi Indikator Kesejahteraan Rakyat Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Menyusun Publikasi Indeks Pembangunan Manusia Tahun 2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan layout Publikasi PDRB Menurut Lapangan Usaha Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan layout Publikasi PDRB Menurut Pengeluaran Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksanannya Kegiatan Survei Snapshot Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan dan upload Publikasi Statistik Daerah Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan dan upload Publikasi Indikator Kesejahteraan Rakyat Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan dan upload Publikasi Indeks Pembangunan Manusia Tahun 2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksanannya Kegiatan Survei Snapshot Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Telaksananya Pembuatan Publikasi/Laporan dan Pengembangan Statistik yang Berkualitas Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Indikator Kesejahteraan Rakyat Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Statistik Daerah Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Indikator Kesejahteraan Rakyat Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Upload Angka PDRB dan Publikasi Menurut Lapangan Usaha Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksanya Upload Angka PDRB dan Publikasi Menurut Pengeluaran Tahun 2021-2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan dan upload Publikasi Statistik Daerah Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan dan upload Publikasi Indikator Kesejahteraan Rakyat Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan dan upload Publikasi Indeks Pembangunan Manusia Tahun 2025'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Fenomena Ekonomi Lapangan Usaha Tahunan dan Triwulanan'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Snapshot Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Statistik Daerah Tahun 2026'
  AND rk.tim_kerja = 'Neraca Wilayah dan Analisis Statistik'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terwujudnya Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terwujudnya Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terwujudnya Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Evaluasi Penyelenggaraan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Evaluasi Penyelenggaraan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Evaluasi Penyelenggaraan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral Tahun 2026'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rapat Internal Tim Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Evaluasi Penyelenggaraan Statistik Sektoral'
  AND rk.tim_kerja = 'Pembinaan Statistik Sektoral'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pengembangan Metodologi Sensus dan Survei'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR) yang Akurat'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pengembangan Metodologi Sensus dan Survei'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran MFD, MBS, dan MSLS'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemanfaatan Software Perwajahan Publikasi'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pengembangan Infrastruktur dan Layanan Tekonologi Informasi dan Komunikasi'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pengembangan Metodologi Sensus dan Survei'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran MFD, MBS, dan MSLS'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksanya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran MFD, MBS, dan MSLS'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemanfaatan Software Perwajahan Publikasi'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Updating Direktori Usaha/Perusahaan Ekonomi (Profilling SBR)'
  AND rk.tim_kerja = 'Pengolahan & Teknologi Informasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas yang Baik Tahun 2026'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung Yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS Yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'Terlaksaknanya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Mendukung Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadiyah Hanifah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Internal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas di Eksternal BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemenuhan LKE ZI yang Lengkap dan Tepat Waktu'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Implementasi Nilai BerAKHLAK dan Budaya Organisasi BPS'
  AND rk.tim_kerja = 'Reformasi Birokrasi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Jasa'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Produksi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Pengeluaran'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS Yang Profesional'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Rekrutmen Mitra Statistik BPS'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanaan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Produksi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanaan Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Pengeluaran'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pengisian Matrik Rencana Kinerja Bulanan'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam Rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Melaksanakan Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi Tahun 2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi Tahun 2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi Tahun 2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik dalam rangka SE2026'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik Tahun 2027'
  AND rk.tim_kerja = 'Sensus, dan Manajemen Lapangan & Mitra'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Distribusi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Distribusi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Distribusi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Statistik Distribusi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Distribusi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Penyusunan Publikasi/Laporan Sensus Ekonomi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata Tahun 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Distribusi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Statistik Distribusi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata (KTIP) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Statistik Distribusi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata Tahun 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Statistik Distribusi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata Tahun 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata Tahun 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Statistik Distribusi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Telaksananya Kegiatan Survei Statistik Keuangan, Teknologi Informasi, dan Pariwisata Tahun 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Distribusi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Keuangan, Teknologi Informasi, dan Pariwisata'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Chandra Nela%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rico Enfi%' 
  AND rk.rencana_kinerja = 'Terlaksannya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rizky Tarmuzi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Sensus Ekonomi 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rachel Abiyoso%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Statistik Distribusi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Distribusi & KTIP'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/ laporan Survei Penyempurnaan Diagram Timbang Nilai Tukar Petani'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Harga Tahun 2026'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Bahan Tayang Rilis BRS Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi Yang Akurat dan Tepat Waktu'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi Yang Akurat dan Tepat Waktu'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Harga Tahun 2026'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan bahan tayang rilis BRS Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Harga Tahun 2026'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Erin Trivoni%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/ laporan Survei Penyempurnaan Diagram Timbang Nilai Tukar Petani'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Harga Tahun 2026'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan bahan tayang rilis BRS Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Harga Tahun 2026'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Bahan Tayang, Naskah, dan Laporan Rilis BRS Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Harga Tahun 2026'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Inflasi'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Statistik Harga Tahun 2026'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Statistik Harga'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Hayati yang Berkualitas'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Mineral dan Konstruksi yang Berkualitas'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Hayati yang Berkualitas'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadiyah Hanifah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Lapangan Laporan Triwulanan Pelabuhan Perikanan dan Tempat Pelelangan Ikan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadiyah Hanifah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Perkebunan Bulanan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadiyah Hanifah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Besar Sedang (IBS) Triwulanan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadiyah Hanifah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pemeriksaan dan upload Publikasi Luas panen dan produksi padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan dan upload Publikasi Direktori Perusahaan Industri Besar Sedang tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Kehutanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Laporan Perusahaan Budidaya Ikan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Penangkapan Ikan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Lapangan Laporan Triwulanan Pelabuhan Perikanan dan Tempat Pelelangan Ikan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Pemotongan Ternak Bulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Peternakan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Jagung Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Pangan/Palawija'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Kering Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Giling tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Hortikultura tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Usaha Hortikultura Lainnya'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTP) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTL) tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perkebunan Tahunan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Perkebunan Bulanan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Updating Direktori Perusahaan Pertanian (DPP) dan Updating Direktori Usaha Pertanian Lainnya (DUTL)'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Palawija'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Alsintan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Benih tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Lahan tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan penyusunan Publikasi Luas panen dan produksi padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Besar Sedang (IBS) Triwulanan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutahiran Direktori Perusahaan Awal (DPA) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Industri Manufaktur Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Konstruksi Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Perusahaan Konstruksi Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Perusahaan Tahunan Air Bersih Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Usaha Penggalian Bahan Industri dan Konstruksi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Triwulanan Air Bersih Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Triwulanan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Perusahaan Pertambangan dan Energi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Perusahaan Pertambangan Non MIGAS Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Publikasi Direktori Perusahaan Industri Besar Sedang tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Captive Power Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pelatihan Petugas Survei Kerangka Sampel Area (KSA) Padi sebagai Panitia'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Pangan/Palawija'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTP) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTL) tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Updating Direktori Perusahaan Pertanian (DPP) dan Updating Direktori Usaha Pertanian Lainnya (DUTL)'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Besar Sedang (IBS) Triwulanan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutahiran Direktori Perusahaan Awal (DPA) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Kehutanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Laporan Perusahaan Budidaya Ikan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Penangkapan Ikan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Lapangan Laporan Triwulanan Pelabuhan Perikanan dan Tempat Pelelangan Ikan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Pemotongan Ternak Bulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Peternakan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Jagung Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Pangan/Palawija'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Kering Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Giling tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Hortikultura tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Usaha Hortikultura Lainnya'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTP) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTL) tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perkebunan Tahunan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Perkebunan Bulanan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Updating Direktori Perusahaan Pertanian (DPP) dan Updating Direktori Usaha Pertanian Lainnya (DUTL)'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan pemeriksaan Publikasi Luas Panen dan Produksi Padi Kabupaten Belitung'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Besar Sedang (IBS) Triwulanan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Industri Manufaktur Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Konstruksi Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Perusahaan Konstruksi Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Perusahaan Tahunan Air Bersih Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Usaha Penggalian Bahan Industri dan Konstruksi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Triwulanan Air Bersih Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Triwulanan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Perusahaan Pertambangan dan Energi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Perusahaan Pertambangan Non MIGAS Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya pemeriksaan Publikasi Direktori Perusahaan Industri Besar Sedang Kabupaten Belitung'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Captive Power Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Lapangan Laporan Triwulanan Pelabuhan Perikanan dan Tempat Pelelangan Ikan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Pemotongan Ternak Bulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Jagung Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Pangan/Palawija'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Kering Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Giling tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTP) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perkebunan Tahunan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Perkebunan Bulanan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Updating Direktori Perusahaan Pertanian (DPP) dan Updating Direktori Usaha Pertanian Lainnya (DUTL)'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Palawija'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan penyusunan Publikasi Luas panen dan produksi padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Perusahaan Pertambangan dan Energi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Perusahaan Pertambangan Non MIGAS Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Publikasi Direktori Perusahaan Industri Besar Sedang tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Captive Power Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Kering Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Giling tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Kehutanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Laporan Perusahaan Budidaya Ikan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Penangkapan Ikan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Lapangan Laporan Triwulanan Pelabuhan Perikanan dan Tempat Pelelangan Ikan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Pemotongan Ternak Bulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Laporan Tahunan Perusahaan Peternakan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Survei Kesejahteraan Petani Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Jagung Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Kerangka Sampel Area (KSA) Padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Pangan/Palawija'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Ubinan Pertanian Tanaman Padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Kering Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Konversi Gabah ke Beras (SKGB) Giling tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Hortikultura tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Usaha Hortikultura Lainnya'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTP) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Produksi Hortikultura (UTL) tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perkebunan Tahunan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Survei Perusahaan Perkebunan Bulanan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Updating Direktori Perusahaan Pertanian (DPP) dan Updating Direktori Usaha Pertanian Lainnya (DUTL)'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Palawija'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Alsintan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Benih tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pendataan Lapangan Statistik Pertanian (SP) Lahan tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan penyusunan Publikasi Luas panen dan produksi padi'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Besar Sedang (IBS) Triwulanan'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutahiran Direktori Perusahaan Awal (DPA) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Industri Manufaktur Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Konstruksi Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Perusahaan Konstruksi Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Perusahaan Tahunan Air Bersih Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Usaha Penggalian Bahan Industri dan Konstruksi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Triwulanan Air Bersih Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Triwulanan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Updating Direktori Perusahaan Pertambangan dan Energi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Perusahaan Pertambangan Non MIGAS Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Tahunan Perusahaan Penggalian Bahan Industri dan Konstruksi Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Publikasi Direktori Perusahaan Industri Besar Sedang tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro dan Kecil Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Captive Power Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Tahunan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Industri Mikro Kecil Triwulanan Tahun 2026'
  AND rk.tim_kerja = 'Statistik Produksi'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yerdi%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nayusa S.A.P%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan kegiatan Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Yasrizal%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Meta Septianingrum%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ghaida Nasria%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Melaksanakan Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Andri Indra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Dewi Putri%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Akbar%' 
  AND rk.rencana_kinerja = 'Melaksanakan Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Akbarrullah Yusman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rananta Karina%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Ismu Widati%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Tejo Laksono%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Anis Athirah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadita Riski%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nadiyah Hanifah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Ekonomi Rumah Tangga Triwulanan (Seruti) 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurzikri Saputra%' 
  AND rk.rencana_kinerja = 'Terlaksananya kegiatan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Nurlaila Fitriyah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Maya Andriani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Statistik Sosial'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Statistik Kependudukan Dan Ketenagakerjaan Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Statistik Sumber Daya Hayati yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Statistik Sumber Daya Mineral dan Konstruksi yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Statistik Industri Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Statistik Distribusi Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Statistik Harga Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Statistik Jasa yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Neraca Produksi Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Neraca Pengeluaran Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Publikasi/Laporan Analisis Statistik dan Neraca Satelit yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Persentase Kumulatif Desa Yang Berpredikat Desa Cinta Statistik'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Tingkat Penyelenggaraan Pembinaan Statistik Sektoral sesuai standar'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Indeks Pelayanan Publik - Penilaian Mandiri'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Nilai SAKIP oleh Inspektorat'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Baiq Kurniawati%' 
  AND rk.rencana_kinerja = 'Indeks Implementasi BerAKHLAK'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Muhammad Syafiudin%' 
  AND rk.rencana_kinerja = 'Terpenuhinya Dokumen Pendukung Implementasi SAKIP'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Hayati yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Sumber Daya Mineral dan Konstruksi yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Seraman S.A.P.%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Industri Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penerapan Manajemen Risiko Secara Komprehensif dan Berkelanjutan'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rio Prananda%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penjaminan Kualitas Sensus dan Survei'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembangunan Zona Integritas yang Baik'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Qonita Iman%' 
  AND rk.rencana_kinerja = 'Terlaksananya Implementasi Nilai Budaya Kerja yang Baik'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi Daerah Dalam Angka 2026'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Kegiatan Survei Kebutuhan Data (SKD) 2026'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik (PEKPPP)'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pelayanan Publik BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Sayyidah Maulani%' 
  AND rk.rencana_kinerja = 'Terlaksanya Manajemen Official Website BPS Kabupaten Belitung'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publisitas Data dan Kegiatan Perkantoran'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Peliputan Kegiatan, Manajemen Aset, dan Pengembangan Kehumasan'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Radina Yasinta%' 
  AND rk.rencana_kinerja = 'Terlaksananya Konferensi Pers dan Pengacaraan Kehumasan Lainnya'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Angkatan Kerja Nasional (Sakernas) Tahun 2026'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Sosial Ekonomi Nasional (Susenas) Tahun 2026'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Survei Ekonomi Rumah Tangga Triwulanan (Seruti) Tahun 2026'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Tunggal Sosial Ekonomi Nasional (DTSEN) Tahun 2026'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pendataan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) Tahun 2026'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengumpulan Data Statistik Politik dan Keamanan (Statpolkam) Tahun 2026'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pemutakhiran Data Potensi Desa (Podes) Tahun 2026'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Irma Setiyani%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pembinaan Desa Cantik Tahun 2026'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Harga'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Penyusunan Inflasi'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Survei Biaya Hidup'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Marta Puspitasari%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/ laporan Survei Penyempurnaan Diagram Timbang Nilai Tukar Petani'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publikasi/Laporan Neraca Produksi Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publikasi/Laporan Statistik Neraca Pengeluaran Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Susanti SST%' 
  AND rk.rencana_kinerja = 'Terlaksananya Publikasi/laporan Analisis dan Pengembangan Statistik Yang Berkualitas'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Agus Prianto%' 
  AND rk.rencana_kinerja = 'Terwujudnya Penguatan Penyelenggaraan Pembinaan Statistik Sektoral Kementerian/Lembaga/Pemerintah Daerah'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kependudukan Dan Ketenagakerjaan'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Kesejahteraan Rakyat'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Ketahanan Sosial'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Hayati'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Sumber Daya Mineral dan Konstruksi'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Industri'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Distribusi'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Harga'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Statistik Jasa'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Produksi'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengelolaan Manajemen Lapangan dan Mitra pada Kegiatan Neraca Pengeluaran'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Rekrutmen Mitra Statistik BPS'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Kunthi Arsih%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengisian Matrik Rencana Kinerja Bulanan'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Statistik Distribusi'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Sensus Ekonomi'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Rojani SST,%' 
  AND rk.rencana_kinerja = 'Terlaksananya Penyusunan Publikasi/Laporan Keuangan, Teknologi Informasi, dan Pariwisata'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksanya Pengembangan Metodologi Sensus dan Survei'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

INSERT INTO public.user_rk_assignments (rk_id, user_id)
SELECT rk.id, u.id
FROM public.users u
CROSS JOIN public.rk_ketua_tim_mapping rk
WHERE u.full_name ILIKE '%Alfi Nurrahmah%' 
  AND rk.rencana_kinerja = 'Terlaksananya Pengembangan Infrastruktur dan Layanan Teknologi Informasi dan Komunikasi'
  AND rk.tim_kerja = 'Team Belitung'
LIMIT 1
ON CONFLICT ON CONSTRAINT user_rk_assignments_user_rk_unique DO NOTHING;

