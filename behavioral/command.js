/**
 * Command (behavioral)
 * Wrap an action in an object so it can be queued, logged, undone and redone.
 *
 * Modern JS: a command can be a plain object with `execute` and `undo`
 * closures; no class hierarchy is needed. The history is just two arrays.
 */

export class TextDocument {
  text = '';
}

// Each command captures what it needs to reverse itself.
export const insertText = (doc, position, value) => ({
  execute() {
    doc.text = doc.text.slice(0, position) + value + doc.text.slice(position);
  },
  undo() {
    doc.text = doc.text.slice(0, position) + doc.text.slice(position + value.length);
  },
});

export const deleteText = (doc, position, length) => {
  let removed = '';
  return {
    execute() {
      removed = doc.text.slice(position, position + length);
      doc.text = doc.text.slice(0, position) + doc.text.slice(position + length);
    },
    undo() {
      doc.text = doc.text.slice(0, position) + removed + doc.text.slice(position);
    },
  };
};

export class History {
  #done = [];
  #undone = [];

  run(command) {
    command.execute();
    this.#done.push(command);
    this.#undone = []; // a new action invalidates the redo branch
  }

  undo() {
    const command = this.#done.pop();
    if (!command) return false;
    command.undo();
    this.#undone.push(command);
    return true;
  }

  redo() {
    const command = this.#undone.pop();
    if (!command) return false;
    command.execute();
    this.#done.push(command);
    return true;
  }
}
