import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FileNode, Folder } from './composite.js';

const project = () =>
  new Folder('app').add(
    new FileNode('package.json', 300),
    new Folder('src').add(new FileNode('index.js', 1200), new FileNode('util.js', 500)),
  );

test('a folder reports the total size of everything inside it', () => {
  assert.equal(project().size(), 2000);
});

test('a file and a folder answer the same question', () => {
  const nodes = [new FileNode('notes.txt', 10), new Folder('empty')];
  assert.deepEqual(nodes.map((n) => n.size()), [10, 0]);
});

test('paths walks the whole tree', () => {
  assert.deepEqual([...project().paths()], [
    'app/package.json',
    'app/src/index.js',
    'app/src/util.js',
  ]);
});
