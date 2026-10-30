/**
 * Memento (behavioral)
 * Capture an object's state as a snapshot so it can be restored later, without exposing its internals.
 *
 * Modern JS: `structuredClone` makes deep snapshots trivial, and
 * `Object.freeze` keeps a saved snapshot from being changed afterwards.
 */

export class DrawingCanvas {
  #shapes = [];
  #zoom = 1;

  addShape(shape) { this.#shapes.push(shape); }
  setZoom(zoom) { this.#zoom = zoom; }
  get shapes() { return structuredClone(this.#shapes); }
  get zoom() { return this.#zoom; }

  // The memento is opaque to callers: they store it, they don't read it.
  save() {
    return Object.freeze({ state: structuredClone({ shapes: this.#shapes, zoom: this.#zoom }) });
  }

  restore(memento) {
    const { shapes, zoom } = structuredClone(memento.state);
    this.#shapes = shapes;
    this.#zoom = zoom;
  }
}

// The caretaker keeps snapshots but never looks inside them.
export class Checkpoints {
  #saved = new Map();

  constructor(canvas) { this.canvas = canvas; }

  save(label) { this.#saved.set(label, this.canvas.save()); }

  restore(label) {
    const memento = this.#saved.get(label);
    if (!memento) throw new Error(`No checkpoint called "${label}"`);
    this.canvas.restore(memento);
  }
}
