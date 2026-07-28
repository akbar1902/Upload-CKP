-- ============================================================
-- Fix Trigger & Seed Akun Admin Khusus
-- ============================================================

-- 1. Fix trigger karena enum 'pegawai' sudah diubah menjadi 'anggota'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, nip, role, unit_kerja)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'nip',
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'anggota'::public.user_role),
        NEW.raw_user_meta_data->>'unit_kerja'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Seed Admin
DO $$
DECLARE
  admin_uid UUID := uuid_generate_v4();
BEGIN
  -- Insert ke auth.users (trigger handle_new_user akan otomatis memasukkannya ke public.users)
  -- Password default: AdminBps123!
  INSERT INTO auth.users (
    id, 
    instance_id, 
    aud, 
    role, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    created_at, 
    updated_at
  ) VALUES (
    admin_uid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@bps.go.id',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Administrator", "role":"admin"}',
    now(),
    now()
  );

END $$;
