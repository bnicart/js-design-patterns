import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HttpClient, LoggingClient, CachingClient, withRetry, memoize } from './decorator.js';

test('decorators stack and each delegates to the one it wraps', async () => {
  const log = [];
  const client = new CachingClient(new LoggingClient(new HttpClient(), log));

  await client.get('/users');
  const res = await client.get('/users');

  assert.deepEqual(res, { url: '/users', status: 200 });
  assert.deepEqual(log, ['GET /users']); // second call served from cache
});

test('withRetry wraps a flaky function without changing its signature', async () => {
  let calls = 0;
  const flaky = async (id) => {
    if (++calls < 3) throw new Error('timeout');
    return `user ${id}`;
  };

  assert.equal(await withRetry(flaky)(7), 'user 7');
  assert.equal(calls, 3);
});

test('withRetry rethrows the last error when every attempt fails', async () => {
  const broken = withRetry(async () => { throw new Error('down'); }, 2);
  await assert.rejects(broken(), /down/);
});

test('memoize calls the wrapped function once per argument', () => {
  let calls = 0;
  const square = memoize((n) => (calls++, n * n));

  square(4);
  assert.equal(square(4), 16);
  assert.equal(calls, 1);
});
