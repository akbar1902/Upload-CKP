import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generatePairingCode,
  generatePairingSecret,
  hashPairingSecret,
  isPairingCode,
} from './pairing.mjs';

test('generatePairingCode membuat kode 8 karakter tanpa huruf ambigu', () => {
  const code = generatePairingCode();
  assert.match(code, /^[A-Z2-9]{8}$/);
  assert.doesNotMatch(code, /[IO01]/);
  assert.equal(isPairingCode(code), true);
});

test('generatePairingSecret acak dan cukup panjang', () => {
  const a = generatePairingSecret();
  const b = generatePairingSecret();
  assert.notEqual(a, b);
  assert.match(a, /^[A-Za-z0-9_-]{30,}$/);
});

test('hashPairingSecret deterministik sha256', () => {
  const secret = generatePairingSecret();
  assert.equal(hashPairingSecret(secret), hashPairingSecret(secret));
  assert.match(hashPairingSecret(secret), /^[a-f0-9]{64}$/);
  assert.notEqual(hashPairingSecret(secret), hashPairingSecret(secret + 'x'));
});

test('isPairingCode menolak kode yang tidak valid', () => {
  assert.equal(isPairingCode('ABCD2345'), true);
  assert.equal(isPairingCode('abcd2345'), false);
  assert.equal(isPairingCode('ABC'), false);
  assert.equal(isPairingCode('ABCDEIO1'), false);
});
