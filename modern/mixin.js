/**
 * Mixin (modern)
 * Add reusable behaviour to classes without building a deep inheritance tree.
 *
 * Modern JS: class expressions make a mixin a plain function from class to
 * class, `(Base) => class extends Base {}`. Mixins stack with ordinary
 * function calls, and `super` still works through the chain.
 */

export const Serializable = (Base) =>
  class extends Base {
    toJSON() {
      return { ...this };
    }
  };

export const Timestamped = (Base) =>
  class extends Base {
    createdAt = new Date(0);
    touch(now = new Date()) {
      this.updatedAt = now;
      return this;
    }
  };

export class Entity {
  constructor(id) {
    this.id = id;
  }
}

// Compose behaviours instead of inheriting a "SerializableTimestampedEntity".
export class Note extends Serializable(Timestamped(Entity)) {
  constructor(id, text) {
    super(id);
    this.text = text;
  }
}

// Composition over inheritance: plain objects can mix in functions too.
export const withLogging = (obj, log) => ({
  ...obj,
  save(...args) {
    log.push(`save ${args.join(',')}`);
    return obj.save(...args);
  },
});
