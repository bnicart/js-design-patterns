import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse, And, Flag, Not } from './interpreter.js';

test('a rule is parsed once and evaluated against many users', () => {
  const rule = parse('beta and not suspended');

  assert.equal(rule.evaluate({ beta: true, suspended: false }), true);
  assert.equal(rule.evaluate({ beta: true, suspended: true }), false);
});

test('and binds tighter than or', () => {
  const rule = parse('staff or beta and paid');

  assert.equal(rule.evaluate({ staff: true }), true);
  assert.equal(rule.evaluate({ beta: true }), false);
  assert.equal(rule.evaluate({ beta: true, paid: true }), true);
});

test('trees can be built by hand without the parser', () => {
  const rule = new And(new Flag('admin'), new Not(new Flag('readOnly')));
  assert.equal(rule.evaluate({ admin: true }), true);
});

test('malformed rules are rejected', () => {
  assert.throws(() => parse('beta and'), SyntaxError);
  assert.throws(() => parse('beta paid'), SyntaxError);
});
