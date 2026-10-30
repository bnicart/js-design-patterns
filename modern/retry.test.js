import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { retry, HttpError } from './retry.js';

const instant = () => {
  const delays = [];
  return { delays, wait: async (ms) => { delays.push(ms); } };
};

test('a flaky call succeeds after a few retries with growing delays', async () => {
  const { delays, wait } = instant();
  let calls = 0;
  const result = await retry(async () => {
    if (++calls < 4) throw new HttpError(503);
    return 'ok';
  }, { wait, random: () => 1 });

  assert.equal(result, 'ok');
  assert.deepEqual(delays, [100, 200, 400]);
});

test('jitter spreads the delay below the cap', async () => {
  const { delays, wait } = instant();
  await assert.rejects(retry(async () => { throw new Error('reset'); }, { retries: 2, wait, random: () => 0.5 }));
  assert.deepEqual(delays, [50, 100]);
});

test('non-retryable errors fail at once', async () => {
  const op = mock.fn(async () => { throw new HttpError(404); });
  await assert.rejects(retry(op, instant()), /HTTP 404/);
  assert.equal(op.mock.callCount(), 1);
});

test('the real sleep works with mock timers', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    let calls = 0;
    const pending = retry(async () => (++calls === 1 ? Promise.reject(new Error('x')) : 'done'), { random: () => 1 });
    // Let the first attempt fail and schedule its timer (setImmediate is not mocked).
    await new Promise((r) => setImmediate(r));
    mock.timers.tick(100);
    assert.equal(await pending, 'done');
  } finally {
    mock.timers.reset();
  }
});
