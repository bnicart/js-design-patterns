/**
 * Composite (structural)
 * Treat single objects and groups of objects through the same interface.
 *
 * Modern JS: arrays, `reduce` and generators (`yield*`) make walking a tree
 * short. The pattern is still useful when callers should not care whether
 * they hold a leaf or a branch.
 */

export class FileNode {
  constructor(name, bytes) {
    this.name = name;
    this.bytes = bytes;
  }

  size() {
    return this.bytes;
  }

  *paths(prefix = '') {
    yield `${prefix}${this.name}`;
  }
}

export class Folder {
  #children = [];

  constructor(name) {
    this.name = name;
  }

  add(...nodes) {
    this.#children.push(...nodes);
    return this;
  }

  // Same method as FileNode, so callers never check which one they have.
  size() {
    return this.#children.reduce((total, child) => total + child.size(), 0);
  }

  *paths(prefix = '') {
    const here = `${prefix}${this.name}/`;
    for (const child of this.#children) yield* child.paths(here);
  }
}
