import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Config, settings } from './singleton.js';

test('every caller gets the same Config', () => {
  Config.instance.set('apiUrl', 'https://api.example.com');

  assert.equal(Config.instance, Config.instance);
  assert.equal(Config.instance.get('apiUrl'), 'https://api.example.com');
});

test('new Config() is refused once an instance exists', () => {
  Config.instance;
  assert.throws(() => new Config(), /Config.instance/);
});

test('an exported module value is shared by every importer', async () => {
  const again = await import('./singleton.js');
  assert.equal(again.settings, settings);
});
