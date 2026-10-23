import test from 'node:test';
import assert from 'node:assert/strict';

import {
  extractBearerToken,
  generateIntegrationToken,
  hashIntegrationToken,
  isIntegrationToken,
  tokenPrefix,
} from './tokens.mjs';

test('hashIntegrationToken deterministik dan menghasilkan sha256 hex', () => {
  const a = hashIntegrationToken('ckp_contoh_token');
  const b = hashIntegrationToken('ckp_contoh_token');
  assert.equal(a, b);
  assert.match(a, /^[a-f0-9]{64}$/);
  assert.notEqual(a, hashIntegrationToken('ckp_contoh_token_lain'));
});

test('generateIntegrationToken membuat token dengan prefix dan hash yang cocok', () => {
  const hasil = generateIntegrationToken();
  assert.match(hasil.token, /^ckp_[A-Za-z0-9_-]{20,}$/);
  assert.equal(hasil.hash, hashIntegrationToken(hasil.token));
  assert.equal(hasil.prefix, tokenPrefix(hasil.token));
  assert.ok(hasil.token.startsWith(hasil.prefix));
});

test('isIntegrationToken menolak token yang jelas bukan format integrasi', () => {
  assert.equal(isIntegrationToken('pendek'), false);
  assert.equal(isIntegrationToken('Bearer ckp_abcdefghijklmnopqrstuvwxyz'), false);
  assert.equal(isIntegrationToken(generateIntegrationToken().token), true);
});

test('extractBearerToken mengambil token dari header Authorization', () => {
  const token = generateIntegrationToken().token;
  assert.equal(extractBearerToken(`Bearer ${token}`), token);
  assert.equal(extractBearerToken(`bearer   ${token}`), token);
  assert.equal(extractBearerToken(''), '');
  assert.equal(extractBearerToken('Basic abc'), '');
});
