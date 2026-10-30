/**
 * Flyweight (structural)
 * Share the heavy, unchanging part of many similar objects instead of copying it.
 *
 * Modern JS: a `Map` keyed by the shared state is the whole factory. Engines
 * already share hidden classes and interned strings, so reach for this only
 * when the shared data is large (textures, glyph metrics, parsed configs).
 */

// Intrinsic state: the same for every tree of a kind, and never mutated.
export class TreeType {
  constructor(species, texture) {
    this.species = species;
    this.texture = texture;
    Object.freeze(this);
  }
}

export class TreeTypeFactory {
  static #types = new Map();

  static get(species, texture) {
    const key = `${species}|${texture}`;
    if (!TreeTypeFactory.#types.has(key)) {
      TreeTypeFactory.#types.set(key, new TreeType(species, texture));
    }
    return TreeTypeFactory.#types.get(key);
  }

  static get count() {
    return TreeTypeFactory.#types.size;
  }
}

// Extrinsic state (position) lives on each tree; the type is a shared reference.
export class Tree {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

export class Forest {
  trees = [];

  plant(x, y, species, texture) {
    this.trees.push(new Tree(x, y, TreeTypeFactory.get(species, texture)));
  }
}
