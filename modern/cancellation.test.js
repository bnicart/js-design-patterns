import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { delay, uploadChunks, withDeadline } from './cancellation.js';

test('aborting rejects a pending delay with the abort reason', async () => {
  const controller = new AbortController();
  const pending = delay(10_000, { signal: controller.signal });

  controller.abort(new Error('user left the page'));
  await assert.rejects(pending, /user left the page/);
});

test('a long job stops between steps once aborted', async () => {
  const controller = new AbortController();
  const send = async (chunk) => {
    if (chunk === 2) controller.abort();
  };

  await assert.rejects(uploadChunks([1, 2, 3], send, controller), { name: 'AbortError' });
});

test('an already-aborted signal fails immediately', async () => {
  await assert.rejects(delay(5, { signal: AbortSignal.abort() }), { name: 'AbortError' });
});

test('AbortSignal.any follows whichever source aborts first', async () => {
  const user = new AbortController();
  const signal = withDeadline(user.signal, 60_000);
  assert.equal(signal.aborted, false);

  user.abort();
  assert.equal(signal.aborted, true);
});

test('delay resolves normally under mock timers', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const pending = delay(1000);
    mock.timers.tick(1000);
    await pending;
  } finally {
    mock.timers.reset();
  }
});
