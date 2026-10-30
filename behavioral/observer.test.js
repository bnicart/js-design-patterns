import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CartStore, UploadQueue } from './observer.js';

test('every subscriber hears about cart changes', () => {
  const cart = new CartStore();
  const badge = [];
  const totals = [];
  cart.subscribe(({ count }) => badge.push(count));
  cart.subscribe(({ total }) => totals.push(total));

  cart.add({ name: 'Mug', price: 12 });
  cart.add({ name: 'Tea', price: 8 });

  assert.deepEqual(badge, [1, 2]);
  assert.deepEqual(totals, [12, 20]);
});

test('calling the returned function unsubscribes', () => {
  const cart = new CartStore();
  const seen = [];
  const unsubscribe = cart.subscribe(({ count }) => seen.push(count));

  cart.add({ name: 'Mug', price: 12 });
  unsubscribe();
  cart.add({ name: 'Tea', price: 8 });

  assert.deepEqual(seen, [1]);
});

test('EventTarget listeners receive CustomEvent details and stop on abort', () => {
  const queue = new UploadQueue();
  const controller = new AbortController();
  const files = [];
  queue.addEventListener('uploaded', (event) => files.push(event.detail.fileName), {
    signal: controller.signal,
  });

  queue.complete('photo.jpg');
  controller.abort();
  queue.complete('notes.txt');

  assert.deepEqual(files, ['photo.jpg']);
});
