import { createHash, randomBytes } from 'node:crypto';

// Tanpa I, O, 0, 1 agar kode mudah dibaca/diketik.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generatePairingCode(length = 8) {
  const n = Math.max(6, Math.min(10, Number(length) || 8));
  const bytes = randomBytes(n);
  let out = '';
  for (let i = 0; i < n; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function generatePairingSecret() {
  return randomBytes(32).toString('base64url');
}

export function hashPairingSecret(secret) {
  return createHash('sha256').update(String(secret)).digest('hex');
}

export function isPairingCode(code) {
  return /^[A-HJ-NP-Z2-9]{6,10}$/.test(String(code || ''));
}
