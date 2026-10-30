/**
 * Observer (behavioral)
 * Let many listeners react when one object changes, without the object knowing who they are.
 *
 * Modern JS: browsers and Node ship `EventTarget` and `CustomEvent`, with
 * `AbortSignal` for removing listeners. A hand-rolled subject is still handy
 * for typed values, where returning an unsubscribe function keeps cleanup simple.
 */

export class Subject {
  #listeners = new Set();

  // Returning the cleanup function avoids holding on to the listener reference.
  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  notify(value) {
    for (const listener of this.#listeners) listener(value);
  }
}

export class CartStore extends Subject {
  #items = [];

  add(item) {
    this.#items.push(item);
    this.notify({ count: this.#items.length, total: this.total });
  }

  get total() {
    return this.#items.reduce((sum, item) => sum + item.price, 0);
  }
}

// The platform version: dispatch CustomEvents with a payload in `detail`.
export class UploadQueue extends EventTarget {
  complete(fileName) {
    this.dispatchEvent(new CustomEvent('uploaded', { detail: { fileName } }));
  }
}
