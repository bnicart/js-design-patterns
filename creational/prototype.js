/**
 * Prototype (creational)
 * Make new objects by copying or delegating to an existing one instead of building from scratch.
 *
 * Modern JS: the language is prototype-based. `Object.create(proto)` makes an
 * object that delegates to another, and `structuredClone(value)` makes a deep,
 * independent copy (including Maps, Sets and Dates) without a hand-written clone().
 */

// Delegation: every enemy shares these methods and defaults through one prototype.
export const enemyPrototype = {
  hp: 100,
  speed: 1,
  takeHit(damage) {
    // Writing creates an own property, so the shared prototype is never changed.
    this.hp = Math.max(0, this.hp - damage);
    return this;
  },
  get alive() {
    return this.hp > 0;
  },
};

export function spawn(overrides = {}) {
  return Object.assign(Object.create(enemyPrototype), overrides);
}

// Copying: a configured template is cloned so each copy can change freely.
export const goblinTemplate = {
  name: 'Goblin',
  stats: { hp: 30, speed: 3 },
  loot: new Set(['coin']),
};

export function cloneTemplate(template, changes = {}) {
  return { ...structuredClone(template), ...changes };
}
