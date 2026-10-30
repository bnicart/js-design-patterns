import { test } from 'node:test';
import assert from 'node:assert/strict';
import { File, Folder, sizeVisitor, listingVisitor } from './visitor.js';

const project = new Folder('app', [
  new File('package.json', 300),
  new Folder('src', [new File('index.js', 1200), new File('util.js', 500)]),
]);

test('the size visitor totals bytes across the whole tree', () => {
  assert.equal(project.accept(sizeVisitor), 2000);
});

test('the listing visitor renders an indented tree', () => {
  assert.deepEqual(project.accept(listingVisitor()), [
    'app/',
    '  package.json',
    '  src/',
    '    index.js',
    '    util.js',
  ]);
});

test('a new operation needs no change to File or Folder', () => {
  const countFiles = { file: () => 1, folder(f) { return f.children.reduce((n, c) => n + c.accept(this), 0); } };
  assert.equal(project.accept(countFiles), 3);
});
