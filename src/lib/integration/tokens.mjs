import { createHash, randomBytes } from 'node:crypto';

export const TOKEN_PREFIX = 'ckp_';

/**
 * @param {string} token
 * @returns {string} sha256 hex
 */
export function hashIntegrationToken(token) {
  return createHash('sha256').update(String(token)).digest('hex');
}

/**
 * @param {string} token
 * @returns {string}
 */
export function tokenPrefix(token) {
  return String(token).slice(0, 12);
}

/**
 * @returns {{ token: string, hash: string, prefix: string }}
 */
export function generateIntegrationToken() {
  const token = `${TOKEN_PREFIX}${randomBytes(32).toString('base64url')}`;
  return {
    token,
    hash: hashIntegrationToken(token),
    prefix: tokenPrefix(token),
  };
}

/**
 * @param {string} token
 * @returns {boolean}
 */
export function isIntegrationToken(token) {
  return /^ckp_[A-Za-z0-9_-]{20,}$/.test(String(token || ''));
}

/**
 * @param {string | null | undefined} headerValue
 * @returns {string}
 */
export function extractBearerToken(headerValue) {
  const match = String(headerValue || '').match(/^\s*bearer\s+(\S+)\s*$/i);
  return match ? match[1] : '';
}
