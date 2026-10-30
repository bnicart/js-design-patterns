import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Checkout, Inventory, Payments, Mailer } from './facade.js';

const setup = () => {
  const parts = { inventory: new Inventory(), payments: new Payments(), mailer: new Mailer() };
  return { parts, checkout: new Checkout(parts) };
};

test('one call reserves stock, charges the card and sends a receipt', async () => {
  const { parts, checkout } = setup();

  const result = await checkout.placeOrder({ sku: 'mug', qty: 1, cents: 1200, cardToken: 'tok', email: 'ana@example.com' });

  assert.deepEqual(result, { ok: true, chargeId: 'ch_1200' });
  assert.equal(parts.mailer.sent.length, 1);
});

test('a declined card releases the reserved stock', async () => {
  const { parts, checkout } = setup();

  const result = await checkout.placeOrder({ sku: 'mug', qty: 2, cents: 1200, cardToken: 'declined', email: 'ana@example.com' });

  assert.deepEqual(result, { ok: false, reason: 'Card declined' });
  assert.doesNotThrow(() => parts.inventory.reserve('mug', 2));
});
