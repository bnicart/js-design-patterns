import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LegacyCart } from './module.js';
import * as cart from './module.js';

test('the revealing module and the ES module behave the same', () => {
  LegacyCart.add('mug', 12);
  LegacyCart.add('tea', 8);
  cart.add('mug', 12);
  cart.add('tea', 8);

  assert.equal(LegacyCart.total(), 20);
  assert.equal(cart.total(), LegacyCart.total());
});

test('private state is unreachable in both', () => {
  assert.equal(LegacyCart.items, undefined);
  assert.equal(cart.items, undefined);
});

test('an ES module namespace is frozen', () => {
  assert.throws(() => {
    cart.total = () => 0;
  }, TypeError);
});
