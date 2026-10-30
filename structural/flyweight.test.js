import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Forest, TreeTypeFactory } from './flyweight.js';

test('thousands of trees share a handful of types', () => {
  const forest = new Forest();
  const typesBefore = TreeTypeFactory.count;
  for (let i = 0; i < 1000; i++) {
    forest.plant(i, i * 2, i % 2 ? 'oak' : 'pine', i % 2 ? 'oak.png' : 'pine.png');
  }

  assert.equal(forest.trees.length, 1000);
  assert.equal(TreeTypeFactory.count - typesBefore, 2);
});

test('trees of the same kind hold the same type object', () => {
  const forest = new Forest();
  forest.plant(0, 0, 'birch', 'birch.png');
  forest.plant(5, 5, 'birch', 'birch.png');

  const [a, b] = forest.trees;
  assert.equal(a.type, b.type);
  assert.notEqual(a.x, b.x);
});

test('shared state is frozen so one tree cannot change it for all', () => {
  const type = TreeTypeFactory.get('elm', 'elm.png');
  assert.throws(() => { type.texture = 'other.png'; }, TypeError);
});
