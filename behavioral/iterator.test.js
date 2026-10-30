import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Playlist, idSequence, shortTracks, paginate } from './iterator.js';

const playlist = new Playlist()
  .add({ title: 'Intro', seconds: 60 })
  .add({ title: 'Epic', seconds: 600 })
  .add({ title: 'Single', seconds: 200 })
  .add({ title: 'Outro', seconds: 90 });

test('a playlist works with for...of and spread', () => {
  const titles = [];
  for (const track of playlist) titles.push(track.title);

  assert.deepEqual(titles, ['Intro', 'Epic', 'Single', 'Outro']);
  assert.equal([...playlist].length, 4);
});

test('iterator helpers build a lazy pipeline', () => {
  assert.deepEqual(shortTracks(playlist, 300, 2), ['Intro', 'Single']);
});

test('an infinite generator is consumed only as far as needed', () => {
  assert.deepEqual(idSequence('order').take(3).toArray(), ['order-1', 'order-2', 'order-3']);
});

test('for await reads every page of an API as one stream', async () => {
  const pages = { null: { items: [1, 2], next: 'p2' }, p2: { items: [3], next: null } };
  const items = [];
  for await (const item of paginate(async (cursor) => pages[cursor])) items.push(item);

  assert.deepEqual(items, [1, 2, 3]);
});
