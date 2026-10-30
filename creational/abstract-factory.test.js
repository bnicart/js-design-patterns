import { test } from 'node:test';
import assert from 'node:assert/strict';
import { saveAvatar, storageFor, CloudStorageFactory } from './abstract-factory.js';

test('production gets matching cloud parts', () => {
  assert.deepEqual(saveAvatar(storageFor('production'), 'me.png'), {
    path: 's3://app-bucket/me.png',
    url: 'https://cdn.example.com/me.png',
  });
});

test('development gets matching local parts', () => {
  const { path, url } = saveAvatar(storageFor('development'), 'me.png');
  assert.equal(path, '/var/uploads/me.png');
  assert.equal(url, 'http://localhost:3000/uploads/me.png');
});

test('any object with the right shape works as a factory', () => {
  const fake = {
    createUploader: () => ({ upload: (n) => `mem:${n}` }),
    createUrls: () => ({ urlFor: (n) => `test://${n}` }),
  };
  assert.deepEqual(saveAvatar(fake, 'a.png'), { path: 'mem:a.png', url: 'test://a.png' });
  assert.ok(storageFor('production') instanceof CloudStorageFactory);
});
