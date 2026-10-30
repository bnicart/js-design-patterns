import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signal, computed, effect } from './signals.js';

test('an effect re-runs when a signal it read changes', () => {
  const count = signal(1);
  const seen = [];
  effect(() => seen.push(count.value));

  count.value = 2;
  count.value = 2; // same value, no re-run
  assert.deepEqual(seen, [1, 2]);
});

test('computed values derive from signals and stay current', () => {
  const price = signal(10);
  const qty = signal(3);
  const total = computed(() => price.value * qty.value);

  qty.value = 5;
  assert.equal(total.value, 50);
});

test('dependencies are tracked per run, so unused branches stop triggering', () => {
  const loggedIn = signal(true);
  const name = signal('Ada');
  let runs = 0;
  effect(() => {
    runs++;
    if (loggedIn.value) name.value;
  });

  loggedIn.value = false;
  name.value = 'Grace';
  assert.equal(runs, 2);
});

test('disposing an effect stops updates', () => {
  const theme = signal('light');
  const seen = [];
  const dispose = effect(() => seen.push(theme.value));

  dispose();
  theme.value = 'dark';
  assert.deepEqual(seen, ['light']);
});
