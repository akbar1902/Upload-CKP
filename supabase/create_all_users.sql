-- ============================================================
-- BUAT AKUN AUTH SEMUA PEGAWAI BPS KABUPATEN BELITUNG
-- Password seragam: BPS@2026
-- Jalankan di: Supabase > SQL Editor > Run
-- ============================================================

DO $$
DECLARE
  v_uid  uuid;
  v_pwd  text := 'BPS@2026';
  v_user jsonb;

  v_users jsonb := '[
    {"email":"pimpinan@bps.go.id",          "name":"Kepala BPS Kabupaten Belitung",         "nip":"000000000000000000", "role":"pimpinan"},
    {"email":"baiqk@bps.go.id",             "name":"Baiq Kurniawati SST, M.Ak",             "nip":"197805052000122001", "role":"pegawai"},
    {"email":"apikudin@bps.go.id",          "name":"Muhammad Syafiudin SST, M.S.E",         "nip":"198311142008011004", "role":"pegawai"},
    {"email":"chandranela-pppk@bps.go.id",  "name":"Chandra Nela",                          "nip":"197308262025212006", "role":"pegawai"},
    {"email":"rizkytarmuzi-pppk@bps.go.id", "name":"Rizky Tarmuzi",                         "nip":"197605122025211029", "role":"pegawai"},
    {"email":"maya.andriani@bps.go.id",     "name":"Maya Andriani",                         "nip":"198903252007122001", "role":"pegawai"},
    {"email":"ricoenfi-pppk@bps.go.id",     "name":"Rico Enfi",                             "nip":"199112212025211034", "role":"pegawai"},
    {"email":"rachelabiyoso-pppk@bps.go.id","name":"Rachel Abiyoso",                        "nip":"199410142025211038", "role":"pegawai"},
    {"email":"andriindra-pppk@bps.go.id",   "name":"Andri Indra Rukmana A.Md",             "nip":"198912172024211004", "role":"pegawai"},
    {"email":"yasrizal@bps.go.id",          "name":"Yasrizal",                              "nip":"197407032007011002", "role":"pegawai"},
    {"email":"seraman@bps.go.id",           "name":"Seraman S.A.P.",                        "nip":"197707221999031003", "role":"pegawai"},
    {"email":"nayusa@bps.go.id",            "name":"Nayusa S.A.P",                          "nip":"197803102002121002", "role":"pegawai"},
    {"email":"yerdi@bps.go.id",             "name":"Yerdi",                                 "nip":"198101032006041016", "role":"pegawai"},
    {"email":"nurlaila.fitriyah@bps.go.id", "name":"Nurlaila Fitriyah S.M.",               "nip":"198207292011012015", "role":"pegawai"},
    {"email":"kunthiarsih@bps.go.id",       "name":"Kunthi Arsih SE",                      "nip":"198303062005022001", "role":"pegawai"},
    {"email":"susantea@bps.go.id",          "name":"Susanti SST, M.M.",                    "nip":"198405212007012004", "role":"pegawai"},
    {"email":"rojanirojes@bps.go.id",       "name":"Rojani SST, M.M.",                     "nip":"198409082009021003", "role":"pegawai"},
    {"email":"ismu.widati@bps.go.id",       "name":"Ismu Widati A.Md",                     "nip":"198605132010032001", "role":"pegawai"},
    {"email":"prianto_agus@bps.go.id",      "name":"Agus Prianto SST",                     "nip":"198608152009021001", "role":"pegawai"},
    {"email":"marta_ps@bps.go.id",          "name":"Marta Puspitasari SST",                "nip":"198703252009022003", "role":"pegawai"},
    {"email":"erint_eruno@bps.go.id",       "name":"Erin Trivoni S.ST, M.E.K.K.",          "nip":"198803092009122002", "role":"pegawai"},
    {"email":"tejo.laksono@bps.go.id",      "name":"Tejo Laksono A.Md",                    "nip":"198907042011011003", "role":"pegawai"},
    {"email":"irma.setiyani@bps.go.id",     "name":"Irma Setiyani Rahayu SST",             "nip":"199007042013112001", "role":"pegawai"},
    {"email":"meta.septia@bps.go.id",       "name":"Meta Septianingrum S.Si",              "nip":"199109032019032001", "role":"pegawai"},
    {"email":"radina.yk@bps.go.id",         "name":"Radina Yasinta Karolina S.Tr.Stat.",   "nip":"199603302019012001", "role":"pegawai"},
    {"email":"sayyidah.maulani@bps.go.id",  "name":"Sayyidah Maulani Khoirunnisa S.Tr.Stat","nip":"199802202019122002","role":"pegawai"},
    {"email":"qonita.iman@bps.go.id",       "name":"Qonita Iman S.Tr.Stat.",               "nip":"199904172022012005", "role":"pegawai"},
    {"email":"rio.aditya@bps.go.id",        "name":"Rio Prananda Aditya S.Tr.Stat.",       "nip":"199908262022011001", "role":"pegawai"},
    {"email":"anis.athirah@bps.go.id",      "name":"Anis Athirah A.Md.Stat.",              "nip":"200002102022012003", "role":"pegawai"},
    {"email":"rananta.karina@bps.go.id",    "name":"Rananta Karina A.Md.Stat",             "nip":"200007192021042001", "role":"pegawai"},
    {"email":"alfinur@bps.go.id",           "name":"Alfi Nurrahmah S.Tr.Stat.",            "nip":"200101132023022002", "role":"pegawai"},
    {"email":"nadita.riski@bps.go.id",      "name":"Nadita Riski Aulia A.Md.Stat.",        "nip":"200110032023022002", "role":"pegawai"},
    {"email":"putri.romadona@bps.go.id",    "name":"Dewi Putri Romadona A.Md.Stat.",       "nip":"200211092024122001", "role":"pegawai"},
    {"email":"muh.akbar@bps.go.id",         "name":"Muhammad Akbar S.Tr.Stat.",            "nip":"200309222026031001", "role":"pegawai"},
    {"email":"akbarrullahyusman@bps.go.id", "name":"Akbarrullah Yusman A.Md.Stat.",        "nip":"200412162026031001", "role":"pegawai"}
  ]';

BEGIN
  FOR v_user IN SELECT * FROM jsonb_array_elements(v_users)
  LOOP
    -- Lewati jika email sudah terdaftar
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = v_user->>'email') THEN
      RAISE NOTICE 'Lewati (sudah ada): %', v_user->>'email';
      CONTINUE;
    END IF;

    v_uid := gen_random_uuid();

    -- Buat akun auth
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
      recovery_token,
      email_change,
      email_change_token_new,
      is_sso_user
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_uid,
      'authenticated',
      'authenticated',
      v_user->>'email',
      crypt(v_pwd, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'full_name', v_user->>'name',
        'role',      v_user->>'role',
        'nip',       v_user->>'nip'
      ),
      now(),
      now(),
      '', '', '', '',
      false
    );

    -- Buat identity record (diperlukan untuk login email)
    INSERT INTO auth.identities (
      provider_id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      v_user->>'email',
      v_uid,
      jsonb_build_object(
        'sub',   v_uid::text,
        'email', v_user->>'email',
        'email_verified', true
      ),
      'email',
      now(),
      now(),
      now()
    );

    RAISE NOTICE 'Berhasil dibuat: % (%)', v_user->>'name', v_user->>'email';
  END LOOP;

  RAISE NOTICE '✅ Selesai! Password semua akun: BPS@2026';
END;
$$;

-- ============================================================
-- VERIFIKASI: tampilkan semua akun yang sudah dibuat
-- ============================================================
SELECT
  u.email,
  p.full_name,
  p.nip,
  p.role,
  u.email_confirmed_at IS NOT NULL AS email_confirmed,
  u.created_at::date AS tgl_dibuat
FROM auth.users u
LEFT JOIN public.users p ON p.id = u.id
WHERE u.email LIKE '%@bps.go.id'
ORDER BY p.role DESC, p.full_name;
