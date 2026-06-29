-- 1. Set Baiq Kurniawati sebagai Pimpinan
UPDATE public.users 
SET role = 'pimpinan' 
WHERE email = 'baiqk@bps.go.id';

-- 2. Set Seraman sebagai Ketua Tim
UPDATE public.users 
SET role = 'ketua_tim' 
WHERE full_name ILIKE '%Seraman%';

-- 3. (Opsional) Jika ada ketua tim lain, copy paste baris di bawah ini dan ubah namanya
-- UPDATE public.users SET role = 'ketua_tim' WHERE full_name ILIKE '%Nama_Ketua_Tim%';
