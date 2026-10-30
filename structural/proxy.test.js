import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validated, lazy, logged } from './proxy.js';

test('validated rejects a bad write and keeps the old value', () => {
  const user = validated({ age: 30 }, { age: (v) => Number.isInteger(v) && v >= 0 });

  assert.throws(() => { user.age = -1; }, /Invalid value for age/);
  user.age = 31;
  assert.equal(user.age, 31);
});

test('lazy does not build the object until it is used', () => {
  let built = 0;
  const editor = lazy(() => {
    built++;
    return { text: '', insert(s) { this.text += s; return this.text; } };
  });

  assert.equal(built, 0);
  editor.insert('hi');
  assert.equal(editor.text, 'hi');
  assert.equal(built, 1);
});

test('logged records reads and writes without changing results', () => {
  const log = [];
  const flags = logged({ darkMode: false }, log);

  flags.darkMode = true;
  assert.equal(flags.darkMode, true);
  assert.deepEqual(log, ['set darkMode', 'get darkMode']);
});
