-- ============================================================
-- CREATE DUMMY USERS via SQL Editor
-- Jalankan seluruh script ini di: Supabase > SQL Editor > Run
-- ============================================================

-- ============================================================
-- LANGKAH 1: Pastikan trigger handle_new_user sudah benar
-- (Fix search_path agar tidak gagal saat insert ke auth.users)
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, nip, role, unit_kerja)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'nip',
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'pegawai'::public.user_role),
        NEW.raw_user_meta_data->>'unit_kerja'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- LANGKAH 2: Buat 2 user dummy menggunakan DO block
-- Password pimpinan : Pimpinan123!
-- Password pegawai  : Pegawai123!
-- ============================================================

DO $$
DECLARE
  v_pimpinan_id UUID := gen_random_uuid();
  v_pegawai_id  UUID := gen_random_uuid();
BEGIN

  -- ── Buat user PIMPINAN ──────────────────────────────────────
  -- Hapus jika email sudah ada (agar bisa dijalankan berulang)
  DELETE FROM auth.users WHERE email = 'pimpinan.dummy@bps.go.id';

  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_pimpinan_id,
    'authenticated',
    'authenticated',
    'pimpinan.dummy@bps.go.id',
    crypt('Pimpinan123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{
      "full_name": "Dr. Ahmad Sudirman, S.Si.",
      "role": "pimpinan",
      "nip": "197001011990011001",
      "unit_kerja": "Kepala BPS"
    }',
    NOW(),
    NOW(),
    '', '', '', ''
  );

  -- Identity pimpinan (dibutuhkan agar login email/password bekerja)
  INSERT INTO auth.identities (
    provider_id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    'pimpinan.dummy@bps.go.id',
    v_pimpinan_id,
    json_build_object('sub', v_pimpinan_id::text, 'email', 'pimpinan.dummy@bps.go.id'),
    'email',
    NOW(), NOW(), NOW()
  );

  -- ── Buat user PEGAWAI ───────────────────────────────────────
  DELETE FROM auth.users WHERE email = 'pegawai.dummy@bps.go.id';

  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_pegawai_id,
    'authenticated',
    'authenticated',
    'pegawai.dummy@bps.go.id',
    crypt('Pegawai123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{
      "full_name": "Siti Nurhaliza, S.Tr.Stat.",
      "role": "pegawai",
      "nip": "199501012020012001",
      "unit_kerja": "Seksi Statistik Produksi"
    }',
    NOW(),
    NOW(),
    '', '', '', ''
  );

  -- Identity pegawai
  INSERT INTO auth.identities (
    provider_id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    'pegawai.dummy@bps.go.id',
    v_pegawai_id,
    json_build_object('sub', v_pegawai_id::text, 'email', 'pegawai.dummy@bps.go.id'),
    'email',
    NOW(), NOW(), NOW()
  );

  RAISE NOTICE '✅ User PIMPINAN dibuat: pimpinan.dummy@bps.go.id (ID: %)', v_pimpinan_id;
  RAISE NOTICE '✅ User PEGAWAI  dibuat: pegawai.dummy@bps.go.id  (ID: %)', v_pegawai_id;

END;
$$;

-- ============================================================
-- LANGKAH 3: Verifikasi hasil
-- ============================================================

SELECT 
  u.email,
  u.full_name,
  u.role,
  u.unit_kerja,
  u.nip,
  u.created_at
FROM public.users u
ORDER BY u.created_at DESC;
