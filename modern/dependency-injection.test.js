import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SignupService, createContainer } from './dependency-injection.js';

class FakeMailer {
  sent = [];
  async send(to, subject) {
    this.sent.push({ to, subject });
    return true;
  }
}

test('constructor injection lets a test pass a fake mailer', async () => {
  const mailer = new FakeMailer();
  const signup = new SignupService({ mailer, users: new Set() });

  await signup.register('ada@example.com');

  assert.deepEqual(mailer.sent, [{ to: 'ada@example.com', subject: 'Welcome!' }]);
});

test('the container wires dependencies and returns the same instance', () => {
  const c = createContainer();
  assert.equal(c.resolve('signup'), c.resolve('signup'));
});

test('swapping a registration in the container replaces the real mailer', async () => {
  const fake = new FakeMailer();
  const c = createContainer().register('mailer', () => fake);

  await c.resolve('signup').register('grace@example.com');

  assert.equal(fake.sent.length, 1);
  await assert.rejects(c.resolve('signup').register('grace@example.com'), /already registered/);
});
