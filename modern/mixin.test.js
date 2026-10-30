import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Note, Entity, Serializable, Timestamped, withLogging } from './mixin.js';

test('a class gains behaviour from several mixins', () => {
  const note = new Note(1, 'buy milk').touch(new Date(1000));

  assert.ok(note instanceof Entity);
  assert.equal(note.updatedAt.getTime(), 1000);
  assert.equal(JSON.parse(JSON.stringify(note)).text, 'buy milk');
});

test('a mixin can be applied to any base class', () => {
  class Upload {
    name = 'photo.png';
  }
  const SerializableUpload = Serializable(Upload);

  assert.equal(new SerializableUpload().toJSON().name, 'photo.png');
  assert.equal(typeof new (Timestamped(Upload))().touch, 'function');
});

test('composition wraps an object instead of subclassing it', () => {
  const log = [];
  const repo = { save: (id) => `saved ${id}` };

  assert.equal(withLogging(repo, log).save(7), 'saved 7');
  assert.deepEqual(log, ['save 7']);
});
