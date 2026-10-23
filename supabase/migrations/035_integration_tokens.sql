-- Integrasi CKP App (lokal) → SIKAP.
-- Token disimpan sebagai hash SHA-256; plaintext hanya ditampilkan sekali saat dibuat.
CREATE TABLE IF NOT EXISTS public.integration_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'CKP App',
    token_hash TEXT NOT NULL UNIQUE,
    token_prefix TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    CONSTRAINT integration_tokens_hash_len CHECK (char_length(token_hash) = 64),
    CONSTRAINT integration_tokens_prefix_len CHECK (char_length(token_prefix) BETWEEN 4 AND 16)
);

CREATE INDEX IF NOT EXISTS idx_integration_tokens_user
    ON public.integration_tokens(user_id);

-- Tidak ada policy RLS: tabel hanya diakses server (service role)
-- setelah sesi/token diverifikasi. Jangan buka ke anon key.
ALTER TABLE public.integration_tokens ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.integration_tokens IS
    'Token akses CKP App per pegawai. Hash SHA-256, hanya untuk server.';

-- Penanda asal upload + idempotensi retry dari CKP App.
ALTER TABLE public.ckp_uploads
    ADD COLUMN IF NOT EXISTS source TEXT,
    ADD COLUMN IF NOT EXISTS client_upload_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS ckp_uploads_client_upload_unique
    ON public.ckp_uploads(user_id, client_upload_id)
    WHERE client_upload_id IS NOT NULL;
