/**
 * Singleton (creational)
 * Ensure a class has only one instance and give everyone the same way to reach it.
 *
 * Modern JS: an ES module is evaluated once and cached, so exporting an
 * instance already gives you a singleton. The class version is shown for
 * the cases where you need lazy creation or a reset hook in tests.
 */

// The idiomatic version: the module system guarantees one instance.
export const settings = new Map([
  ['theme', 'light'],
  ['locale', 'en'],
]);

// The classic version: lazy, with a private static slot.
export class Config {
  static #instance = null;

  static get instance() {
    return (Config.#instance ??= new Config());
  }

  #values = {};

  constructor() {
    if (Config.#instance) throw new Error('Use Config.instance instead of new Config()');
  }

  get(key) {
    return this.#values[key];
  }

  set(key, value) {
    this.#values[key] = value;
    return this;
  }
}
