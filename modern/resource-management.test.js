import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Lock, Connection, report, startEditor } from './resource-management.js';

test('using releases resources when the block ends', async () => {
  const lock = new Lock();
  const log = [];

  assert.equal(await report(lock, log), 'rows for select * from orders');
  assert.equal(lock.held, false);
  assert.deepEqual(log, ['connection closed']);
});

test('resources are released even when the block throws', async () => {
  const log = [];
  await assert.rejects(async () => {
    await using db = new Connection(log);
    throw new Error('bad query');
  }, /bad query/);
  assert.deepEqual(log, ['connection closed']);
});

test('a DisposableStack runs deferred cleanups in reverse order', () => {
  const log = [];
  {
    using editor = startEditor(log);
    assert.deepEqual(log, []);
  }
  assert.deepEqual(log, ['draft flushed', 'autosave stopped']);
});
