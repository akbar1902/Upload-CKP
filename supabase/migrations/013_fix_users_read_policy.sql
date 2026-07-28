-- Fix users read policy for pegawai
DROP POLICY IF EXISTS "Pimpinan can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;

CREATE POLICY "Anyone can view all users"
    ON public.users FOR SELECT
    USING (auth.uid() IS NOT NULL);
