import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TextDocument, History, insertText, deleteText } from './command.js';

test('undo restores the previous text', () => {
  const doc = new TextDocument();
  const history = new History();
  history.run(insertText(doc, 0, 'Hello'));
  history.run(insertText(doc, 5, ' world'));

  history.undo();
  assert.equal(doc.text, 'Hello');
});

test('redo reapplies an undone command', () => {
  const doc = new TextDocument();
  const history = new History();
  history.run(insertText(doc, 0, 'Hello world'));
  history.run(deleteText(doc, 5, 6));
  assert.equal(doc.text, 'Hello');

  history.undo();
  assert.equal(doc.text, 'Hello world');
  history.redo();
  assert.equal(doc.text, 'Hello');
});

test('a new command clears the redo stack', () => {
  const doc = new TextDocument();
  const history = new History();
  history.run(insertText(doc, 0, 'a'));
  history.undo();
  history.run(insertText(doc, 0, 'b'));

  assert.equal(history.redo(), false);
  assert.equal(doc.text, 'b');
});
