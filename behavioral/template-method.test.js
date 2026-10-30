import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DataExporter, CsvExporter, ActiveUsersMarkdown } from './template-method.js';

const users = [
  { name: 'Ana', email: 'ana@example.com', active: true },
  { name: 'Ben', email: 'ben@example.com', active: false },
];

test('the CSV exporter fills in the header and row steps', () => {
  assert.equal(new CsvExporter().export(users), 'name,email\nAna,ana@example.com\nBen,ben@example.com');
});

test('a subclass can override the include hook to filter rows', () => {
  assert.equal(new ActiveUsersMarkdown().export(users), '| Name |\n| --- |\n| Ana |');
});

test('forgetting the required step fails loudly', () => {
  class Broken extends DataExporter {}
  assert.throws(() => new Broken().export(users), /Broken must implement formatRow/);
});
