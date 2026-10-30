import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  AlertService, EmailAlertService, SmsAlertService, SmsNotifier, notifierFor,
} from './factory-method.js';

test('each subclass decides which notifier the shared workflow uses', () => {
  const user = { contact: 'ana@example.com' };
  assert.deepEqual(new EmailAlertService().alert(user, 'disk full'), {
    channel: 'email', to: 'ana@example.com', text: '[alert] disk full',
  });
  assert.equal(new SmsAlertService().alert({ contact: '+15550100' }, 'x').channel, 'sms');
});

test('the base class refuses to guess a product', () => {
  assert.throws(() => new AlertService().alert({ contact: 'a' }, 'hi'), /createNotifier/);
});

test('a lookup map is enough when you just pick a class by name', () => {
  assert.ok(notifierFor('sms') instanceof SmsNotifier);
  assert.throws(() => notifierFor('pigeon'), /Unknown channel/);
});
