import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DrawingCanvas, Checkpoints } from './memento.js';

test('restoring a checkpoint brings back the earlier drawing', () => {
  const canvas = new DrawingCanvas();
  const checkpoints = new Checkpoints(canvas);
  canvas.addShape({ type: 'circle', r: 10 });
  checkpoints.save('first');

  canvas.addShape({ type: 'square', size: 4 });
  canvas.setZoom(2);
  checkpoints.restore('first');

  assert.deepEqual(canvas.shapes, [{ type: 'circle', r: 10 }]);
  assert.equal(canvas.zoom, 1);
});

test('a snapshot is not affected by later edits', () => {
  const canvas = new DrawingCanvas();
  canvas.addShape({ type: 'line' });
  const snapshot = canvas.save();
  canvas.addShape({ type: 'dot' });

  canvas.restore(snapshot);
  assert.equal(canvas.shapes.length, 1);
  assert.ok(Object.isFrozen(snapshot));
});

test('restoring an unknown checkpoint throws', () => {
  const checkpoints = new Checkpoints(new DrawingCanvas());
  assert.throws(() => checkpoints.restore('nope'), /No checkpoint/);
});
