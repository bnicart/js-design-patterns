import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { memoize, memoizeByObject, memoizeAsync } from './memoize.js';

test('repeat calls with the same arguments hit the cache', () => {
  const shipping = mock.fn((country, kg) => (country === 'NZ' ? 5 : 20) * kg);
  const cost = memoize(shipping);

  assert.equal(cost('NZ', 2), 10);
  assert.equal(cost('NZ', 2), 10);
  assert.equal(cost('US', 2), 40);
  assert.equal(shipping.mock.callCount(), 2);
});

test('a WeakMap cache is keyed by object identity', () => {
  const wordCount = mock.fn((doc) => doc.text.split(' ').length);
  const count = memoizeByObject(wordCount);
  const doc = { text: 'hello there world' };

  assert.equal(count(doc), 3);
  assert.equal(count(doc), 3);
  assert.equal(count({ text: 'hello there world' }), 3);
  assert.equal(wordCount.mock.callCount(), 2);
});

test('concurrent async calls share one in-flight request', async () => {
  const fetchUser = mock.fn(async (id) => ({ id }));
  const getUser = memoizeAsync(fetchUser);

  const [a, b] = await Promise.all([getUser(1), getUser(1)]);
  assert.equal(a, b);
  assert.equal(fetchUser.mock.callCount(), 1);
});

test('a failed request is not cached', async () => {
  let fail = true;
  const getUser = memoizeAsync(async (id) => {
    if (fail) throw new Error('offline');
    return { id };
  });

  await assert.rejects(getUser(1), /offline/);
  fail = false;
  assert.deepEqual(await getUser(1), { id: 1 });
});
