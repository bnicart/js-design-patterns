import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pool, createLimiter } from './concurrency-limit.js';

// A task that records how many tasks are running at the same time.
const tracker = () => {
  const t = { active: 0, peak: 0 };
  t.task = (value, fail = false) => async () => {
    t.peak = Math.max(t.peak, ++t.active);
    await new Promise((r) => setImmediate(r));
    t.active--;
    if (fail) throw new Error(`failed ${value}`);
    return value;
  };
  return t;
};

test('the pool never runs more than the limit at once', async () => {
  const t = tracker();
  const results = await pool([1, 2, 3, 4, 5, 6].map((n) => t.task(n)), 2);

  assert.equal(t.peak, 2);
  assert.deepEqual(results.map((r) => r.value), [1, 2, 3, 4, 5, 6]);
});

test('one failure does not stop the others', async () => {
  const t = tracker();
  const results = await pool([t.task('a'), t.task('b', true), t.task('c')], 2);

  assert.deepEqual(results.map((r) => r.status), ['fulfilled', 'rejected', 'fulfilled']);
  assert.match(results[1].reason.message, /failed b/);
});

test('a shared limiter caps calls made from anywhere', async () => {
  const t = tracker();
  const limit = createLimiter(3);
  const uploads = Array.from({ length: 10 }, (_, i) => limit(t.task(i)));

  assert.equal((await Promise.all(uploads)).length, 10);
  assert.equal(t.peak, 3);
});
