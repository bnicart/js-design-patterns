import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EmailChannel, SmsChannel, UrgentNotification, DigestNotification } from './bridge.js';

test('any notification type works with any channel', () => {
  const email = new EmailChannel();
  const sms = new SmsChannel();

  new UrgentNotification(email).send('ana@example.com', 'Server down');
  new UrgentNotification(sms).send('+15550100', 'Server down');

  assert.equal(email.sent[0].text, 'URGENT: Server down');
  assert.equal(sms.sent[0].text, 'URGENT: Server down');
});

test('the channel applies its own rules, independent of the notification', () => {
  const sms = new SmsChannel();
  new DigestNotification(sms).send('+15550100', ['x'.repeat(200)]);

  assert.equal(sms.sent[0].text.length, 160);
});

test('the channel can be swapped at runtime', () => {
  const alert = new UrgentNotification(new EmailChannel());
  alert.channel = new SmsChannel();
  alert.send('+15550100', 'Disk full');

  assert.equal(alert.channel.sent[0].via, 'sms');
});
