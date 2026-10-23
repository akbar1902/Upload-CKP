-- Tegaskan bahwa integration_tokens tidak bisa dibaca/ditulis dari client.
-- Service role (server) tetap bisa karena bypass RLS.
DROP POLICY IF EXISTS "integration_tokens deny client access" ON public.integration_tokens;
CREATE POLICY "integration_tokens deny client access"
    ON public.integration_tokens
    FOR ALL
    TO authenticated, anon
    USING (false)
    WITH CHECK (false);
