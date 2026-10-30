import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FileUpload } from './state.js';

test('an upload moves through its states as events arrive', () => {
  const upload = new FileUpload();
  upload.send('start').send('progress', 40).send('pause');
  assert.equal(upload.state, 'paused');
  assert.equal(upload.percent, 40);

  upload.send('resume').send('finish');
  assert.equal(upload.state, 'done');
  assert.equal(upload.percent, 100);
});

test('events that make no sense in the current state are refused', () => {
  const upload = new FileUpload();
  assert.equal(upload.can('pause'), false);
  assert.throws(() => upload.send('pause'), /Cannot "pause" while idle/);
});

test('a failed upload can be retried', () => {
  const upload = new FileUpload().send('start').send('fail');
  assert.equal(upload.can('retry'), true);
  assert.equal(upload.send('retry').state, 'uploading');
});
