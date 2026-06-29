-- 3. Berikan akses Ketua Tim untuk melihat daftar pengguna (users) agar bisa merender nama di dashboard
CREATE POLICY "Ketua Tim can view all users"
    ON public.users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('ketua_tim', 'pimpinan', 'admin')
        )
    );
