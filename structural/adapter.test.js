import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LegacyKvClient, KvStorageAdapter, saveCart } from './adapter.js';

test('app code uses get/set while the client sees fetchItem/putItem', async () => {
  const storage = new KvStorageAdapter(new LegacyKvClient(), 'shop');

  const cart = await saveCart(storage, 42, ['book']);

  assert.deepEqual(cart, { items: ['book'], savedAt: 0 });
});

test('values are stored as JSON under the adapter namespace', async () => {
  const client = new LegacyKvClient();
  await new KvStorageAdapter(client, 'shop').set('theme', 'dark');

  assert.equal(await client.fetchItem('shop', 'theme'), '"dark"');
});

test('a missing key reads as undefined, not null', async () => {
  const storage = new KvStorageAdapter(new LegacyKvClient());
  assert.equal(await storage.get('nope'), undefined);
});
