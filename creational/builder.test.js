import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RequestBuilder } from './builder.js';

test('a chain of steps produces a ready-to-send request', () => {
  const req = new RequestBuilder('https://api.example.com/orders')
    .method('post')
    .header('Authorization', 'Bearer t0k3n')
    .json({ sku: 'A1', qty: 2 })
    .build();

  assert.equal(req.method, 'POST');
  assert.equal(req.headers['content-type'], 'application/json');
  assert.equal(req.body, '{"sku":"A1","qty":2}');
});

test('unset parts fall back to sensible defaults', () => {
  const req = new RequestBuilder('/search').query('q', 'shoes').query('page', '2').build();
  assert.equal(req.method, 'GET');
  assert.equal(req.url, '/search?q=shoes&page=2');
  assert.equal(req.body, undefined);
});

test('build() rejects an inconsistent request', () => {
  assert.throws(() => new RequestBuilder('/x').json({}).build(), /cannot have a body/);
});
