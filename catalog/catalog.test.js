import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { patterns } from './index.js';

const root = new URL('../', import.meta.url);
const readme = readFileSync(new URL('README.md', root), 'utf8');
const fields = ['id', 'name', 'problem', 'solution', 'useWhen', 'avoidWhen', 'native', 'diagram'];

test('pattern ids are unique', () => {
  const ids = patterns.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

for (const p of patterns) {
  test(`${p.name}: catalog entry is complete and its files exist`, () => {
    for (const f of fields) assert.ok(p[f]?.length, `${p.id} is missing ${f}`);
    assert.ok(existsSync(new URL(p.file, root)), `${p.file} missing`);
    assert.ok(existsSync(new URL(p.testFile, root)), `${p.testFile} missing`);
    assert.ok(readme.includes(`](${p.file})`), `README does not link ${p.file}`);
  });
}
