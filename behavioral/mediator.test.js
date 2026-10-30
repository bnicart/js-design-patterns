import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CheckoutForm } from './mediator.js';

test('submit stays disabled until both addresses are filled', () => {
  const form = new CheckoutForm();
  assert.equal(form.submit.disabled, true);

  form.shipping.input('1 Main St');
  assert.equal(form.submit.disabled, true);

  form.billing.input('9 Side Rd');
  assert.equal(form.submit.disabled, false);
});

test('ticking "same as shipping" copies and locks the billing field', () => {
  const form = new CheckoutForm();
  form.shipping.input('1 Main St');
  form.sameAsShipping.input(true);

  assert.equal(form.billing.value, '1 Main St');
  assert.equal(form.billing.disabled, true);

  form.shipping.input('2 New Ave');
  assert.equal(form.billing.value, '2 New Ave');
});
