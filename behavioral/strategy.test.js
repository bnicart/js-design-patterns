import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Checkout, shippingStrategies, sortBy } from './strategy.js';

const order = { subtotal: 3000, weightKg: 2 };

test('the shipping strategy can be swapped at run time', () => {
  const checkout = new Checkout();
  assert.equal(checkout.total(order), 3499);

  checkout.setShipping(shippingStrategies.express);
  assert.equal(checkout.total(order), 4199);
});

test('any function with the right signature works as a strategy', () => {
  const flatRate = () => 300;
  assert.equal(new Checkout(flatRate).total(order), 3300);
});

test('sort takes a comparison strategy', () => {
  const items = [{ name: 'b', price: 2 }, { name: 'a', price: 3 }];
  assert.deepEqual(items.toSorted(sortBy.name).map((i) => i.name), ['a', 'b']);
  assert.deepEqual(items.toSorted(sortBy.price).map((i) => i.name), ['b', 'a']);
});
