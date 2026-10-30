import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enemyPrototype, spawn, goblinTemplate, cloneTemplate } from './prototype.js';

test('spawned objects delegate to the shared prototype', () => {
  const bat = spawn({ speed: 4 });
  assert.equal(Object.getPrototypeOf(bat), enemyPrototype);
  assert.equal(bat.hp, 100);
  assert.equal(bat.speed, 4);
});

test('changing one instance leaves the prototype and siblings alone', () => {
  const a = spawn();
  const b = spawn();
  a.takeHit(120);
  assert.equal(a.alive, false);
  assert.equal(b.hp, 100);
  assert.equal(enemyPrototype.hp, 100);
});

test('structuredClone gives a deep copy of a template', () => {
  const boss = cloneTemplate(goblinTemplate, { name: 'Goblin King' });
  boss.stats.hp = 300;
  boss.loot.add('crown');

  assert.equal(goblinTemplate.stats.hp, 30);
  assert.deepEqual([...goblinTemplate.loot], ['coin']);
  assert.equal(boss.name, 'Goblin King');
});
