import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compose, auth, errors, timing } from './middleware.js';

const request = (headers = {}) => ({ headers, status: 200, body: null });

test('middleware runs like an onion: in on the way down, out on the way up', async () => {
  const order = [];
  const app = compose([
    async (ctx, next) => { order.push('a in'); await next(); order.push('a out'); },
    async (ctx, next) => { order.push('b in'); await next(); order.push('b out'); },
  ]);

  await app(request());
  assert.deepEqual(order, ['a in', 'b in', 'b out', 'a out']);
});

test('a middleware can stop the chain by not calling next', async () => {
  let reached = false;
  const ctx = request();
  await compose([auth, async () => { reached = true; }])(ctx);

  assert.equal(ctx.status, 401);
  assert.equal(reached, false);
});

test('an outer middleware catches errors from inner ones', async () => {
  const ctx = request({ authorization: 'Bearer t' });
  let t = 0;
  await compose([errors, timing(() => (t += 5)), auth, () => { throw new Error('db down'); }])(ctx);

  assert.equal(ctx.status, 500);
  assert.deepEqual(ctx.body, { error: 'db down' });
});

test('calling next twice is rejected', async () => {
  const app = compose([async (ctx, next) => { await next(); await next(); }]);
  await assert.rejects(app(request()), /more than once/);
});
