-- Pairing satu klik: CKP App membuat kode, user menyetujui di SIKAP,
-- CKP App mengambil token lewat polling dengan secret (bukan copy-paste).
CREATE TABLE IF NOT EXISTS public.integration_pairings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    secret_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    token_id UUID REFERENCES public.integration_tokens(id) ON DELETE SET NULL,
    -- Plaintext token hanya disimpan sampai diambil CKP App (maks 10 menit).
    token_plain TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    consumed_at TIMESTAMPTZ,
    CONSTRAINT integration_pairings_status CHECK (status IN ('pending', 'approved', 'expired')),
    CONSTRAINT integration_pairings_code_len CHECK (char_length(code) BETWEEN 6 AND 10),
    CONSTRAINT integration_pairings_secret_len CHECK (char_length(secret_hash) = 64)
);

CREATE INDEX IF NOT EXISTS idx_integration_pairings_code
    ON public.integration_pairings(code);
CREATE INDEX IF NOT EXISTS idx_integration_pairings_expires
    ON public.integration_pairings(expires_at);

ALTER TABLE public.integration_pairings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "integration_pairings deny client access" ON public.integration_pairings;
CREATE POLICY "integration_pairings deny client access"
    ON public.integration_pairings
    FOR ALL
    TO authenticated, anon
    USING (false)
    WITH CHECK (false);

COMMENT ON TABLE public.integration_pairings IS
    'Pairing sementara CKP App ↔ SIKAP. Diambil via secret, token_plain dihapus setelah dipakai.';
