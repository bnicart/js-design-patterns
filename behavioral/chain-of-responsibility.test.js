import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSupportChain, chain } from './chain-of-responsibility.js';

test('a password reset is handled by the bot without escalating', () => {
  const support = buildSupportChain();
  assert.equal(support.handle({ topic: 'password-reset', severity: 1 }).handledBy, 'bot');
});

test('tickets escalate until a tier can handle them', () => {
  const support = buildSupportChain();
  assert.equal(support.handle({ topic: 'billing', severity: 2 }).handledBy, 'agent');
  assert.equal(support.handle({ topic: 'outage', severity: 4 }).handledBy, 'engineer');
});

test('a ticket nobody can handle falls off the end', () => {
  const support = buildSupportChain();
  assert.equal(support.handle({ topic: 'data-loss', severity: 5 }).handledBy, null);
});

test('plain functions form a chain too', () => {
  const approve = chain(
    (amount) => (amount <= 100 ? 'auto-approved' : undefined),
    (amount) => (amount <= 5000 ? 'manager' : undefined),
    () => 'finance director',
  );
  assert.equal(approve(50), 'auto-approved');
  assert.equal(approve(800), 'manager');
  assert.equal(approve(20000), 'finance director');
});
