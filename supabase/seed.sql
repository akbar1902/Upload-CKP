-- ============================================================
-- CKP BPS Belitung - Seed Data
-- ============================================================
-- NOTE: Before running this, create these users in Supabase Auth Dashboard first
-- Then update the UUIDs below to match the auth.users IDs

-- Example seed data (replace UUIDs with actual auth user IDs)

-- Insert pimpinan user
INSERT INTO public.users (id, email, full_name, nip, role, unit_kerja, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'pimpinan@bps.go.id', 'Dr. Ahmad Sudirman, S.Si., M.Stat.', '197001011990011001', 'pimpinan', 'Kepala BPS', true);

-- Insert pegawai users
INSERT INTO public.users (id, email, full_name, nip, role, unit_kerja, is_active) VALUES
('00000000-0000-0000-0000-000000000002', 'siti@bps.go.id', 'Siti Nurhaliza, S.Tr.Stat.', '199501012020012001', 'pegawai', 'Seksi Statistik Produksi', true),
('00000000-0000-0000-0000-000000000003', 'budi@bps.go.id', 'Budi Santoso, SST', '199601012021011001', 'pegawai', 'Seksi Statistik Distribusi', true),
('00000000-0000-0000-0000-000000000004', 'dewi@bps.go.id', 'Dewi Kartika, S.Tr.Stat.', '199701012022012001', 'pegawai', 'Seksi IPDS', true),
('00000000-0000-0000-0000-000000000005', 'andi@bps.go.id', 'Andi Pratama, SST', '199801012023011001', 'pegawai', 'Seksi Neraca dan Analisis', true),
('00000000-0000-0000-0000-000000000006', 'rina@bps.go.id', 'Rina Wulandari, S.Tr.Stat.', '199901012024012001', 'pegawai', 'Seksi Statistik Sosial', true);

-- Insert employee profiles
INSERT INTO public.employee_profiles (user_id, jabatan, golongan) VALUES
('00000000-0000-0000-0000-000000000001', 'Kepala BPS Kabupaten Belitung', 'IV/a'),
('00000000-0000-0000-0000-000000000002', 'Staf Seksi Statistik Produksi', 'III/a'),
('00000000-0000-0000-0000-000000000003', 'Staf Seksi Statistik Distribusi', 'III/a'),
('00000000-0000-0000-0000-000000000004', 'Staf Seksi IPDS', 'III/a'),
('00000000-0000-0000-0000-000000000005', 'Staf Seksi Neraca dan Analisis', 'III/a'),
('00000000-0000-0000-0000-000000000006', 'Staf Seksi Statistik Sosial', 'III/a');

-- Insert sample CKP uploads
INSERT INTO public.ckp_uploads (id, user_id, bulan, tahun, status, version, file_name, total_entries, avg_progres, uploaded_at) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 1, 2026, 'approved', 1, 'CKP_Siti_Januari_2026.xlsx', 5, 85.0, '2026-02-01 08:00:00+07'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 2, 2026, 'submitted', 1, 'CKP_Siti_Februari_2026.xlsx', 4, 72.5, '2026-03-01 09:00:00+07'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 1, 2026, 'approved', 1, 'CKP_Budi_Januari_2026.xlsx', 6, 90.0, '2026-02-02 10:00:00+07'),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 2, 2026, 'revision_required', 1, 'CKP_Budi_Februari_2026.xlsx', 3, 50.0, '2026-03-02 11:00:00+07'),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 1, 2026, 'submitted', 1, 'CKP_Dewi_Januari_2026.xlsx', 5, 78.0, '2026-02-03 08:30:00+07'),
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000005', 1, 2026, 'draft', 1, 'CKP_Andi_Januari_2026.xlsx', 4, 60.0, '2026-02-04 09:30:00+07');

-- Insert sample CKP entries for Siti - Januari 2026
INSERT INTO public.ckp_entries (upload_id, row_number, tanggal_mulai, tanggal_selesai, jam_mulai, jam_selesai, rencana_kinerja, kegiatan, progres, capaian, data_dukung) VALUES
('10000000-0000-0000-0000-000000000001', 1, '2026-01-02', '2026-01-02', '08:00', '12:00', 'Pengolahan Data Survei', 'Entri data Survei Sosial Ekonomi Nasional', 100, 'Data terentri 100%', 'https://drive.google.com/file/d/example1'),
('10000000-0000-0000-0000-000000000001', 2, '2026-01-03', '2026-01-05', '08:00', '16:00', 'Pengolahan Data Survei', 'Validasi dan cleaning data Susenas', 80, 'Validasi selesai 80%', 'https://drive.google.com/file/d/example2'),
('10000000-0000-0000-0000-000000000001', 3, '2026-01-06', '2026-01-06', '08:00', '11:00', 'Rapat Koordinasi', 'Rapat koordinasi pengolahan data triwulan I', 100, 'Notulen rapat tersedia', 'https://drive.google.com/file/d/example3'),
('10000000-0000-0000-0000-000000000001', 4, '2026-01-07', '2026-01-10', '08:00', '16:00', 'Penyusunan Laporan', 'Penyusunan laporan bulanan statistik produksi', 75, 'Laporan draft selesai', 'https://drive.google.com/file/d/example4'),
('10000000-0000-0000-0000-000000000001', 5, '2026-01-13', '2026-01-15', '08:00', '16:00', 'Pengumpulan Data', 'Pencacahan lapangan Survei Harga Konsumen', 85, '85% responden tercacah', 'https://drive.google.com/file/d/example5');

-- Insert sample CKP entries for Budi - Januari 2026
INSERT INTO public.ckp_entries (upload_id, row_number, tanggal_mulai, tanggal_selesai, jam_mulai, jam_selesai, rencana_kinerja, kegiatan, progres, capaian, data_dukung) VALUES
('10000000-0000-0000-0000-000000000003', 1, '2026-01-02', '2026-01-03', '08:00', '16:00', 'Pengolahan Data', 'Entri data Survei Harga Produsen', 100, 'Selesai 100%', 'https://drive.google.com/file/d/example6'),
('10000000-0000-0000-0000-000000000003', 2, '2026-01-06', '2026-01-08', '08:00', '16:00', 'Pengolahan Data', 'Tabulasi data distribusi perdagangan', 90, '90% tabel selesai', 'https://drive.google.com/file/d/example7'),
('10000000-0000-0000-0000-000000000003', 3, '2026-01-09', '2026-01-09', '09:00', '12:00', 'Koordinasi', 'Rapat evaluasi kinerja distribusi', 100, 'Notulen rapat', NULL),
('10000000-0000-0000-0000-000000000003', 4, '2026-01-13', '2026-01-17', '08:00', '16:00', 'Laporan', 'Penyusunan publikasi statistik distribusi', 85, 'Draft publikasi selesai', 'https://drive.google.com/file/d/example8'),
('10000000-0000-0000-0000-000000000003', 5, '2026-01-20', '2026-01-22', '08:00', '16:00', 'Survei Lapangan', 'Pencacahan Survei Harga Konsumen', 95, '95% selesai', 'https://drive.google.com/file/d/example9'),
('10000000-0000-0000-0000-000000000003', 6, '2026-01-23', '2026-01-24', '08:00', '14:00', 'Administrasi', 'Penyelesaian administrasi keuangan survei', 100, 'Laporan keuangan selesai', NULL);

-- Insert sample approvals
INSERT INTO public.approvals (upload_id, reviewer_id, action, catatan, created_at) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'approved', 'CKP Januari sudah lengkap dan sesuai target.', '2026-02-05 10:00:00+07'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'approved', 'Baik, kegiatan sudah terdokumentasi dengan baik.', '2026-02-06 11:00:00+07'),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'revision_required', 'Mohon lengkapi data dukung untuk kegiatan rapat dan administrasi.', '2026-03-05 14:00:00+07');

-- Insert sample audit logs
INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, created_at) VALUES
('00000000-0000-0000-0000-000000000002', 'upload_ckp', 'ckp_uploads', '10000000-0000-0000-0000-000000000001', '2026-02-01 08:00:00+07'),
('00000000-0000-0000-0000-000000000001', 'approve_ckp', 'ckp_uploads', '10000000-0000-0000-0000-000000000001', '2026-02-05 10:00:00+07'),
('00000000-0000-0000-0000-000000000003', 'upload_ckp', 'ckp_uploads', '10000000-0000-0000-0000-000000000003', '2026-02-02 10:00:00+07'),
('00000000-0000-0000-0000-000000000001', 'approve_ckp', 'ckp_uploads', '10000000-0000-0000-0000-000000000003', '2026-02-06 11:00:00+07'),
('00000000-0000-0000-0000-000000000001', 'request_revision', 'ckp_uploads', '10000000-0000-0000-0000-000000000004', '2026-03-05 14:00:00+07');
