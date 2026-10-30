/**
 * Module (modern)
 * Hide implementation details behind a small public surface.
 *
 * Modern JS: ES modules give every file its own private scope. Anything you
 * don't `export` is invisible to importers, so the IIFE / revealing-module
 * trick below is no longer needed. It is shown on purpose, as the old way.
 */

// The old way (pre-2015): an IIFE creates a closure, and the returned object
// "reveals" the public functions. `var` is kept to show the period style.
// eslint-disable-next-line no-var
export var LegacyCart = (function () {
  var items = [];
  function add(name, price) {
    items.push({ name, price });
  }
  function total() {
    return items.reduce((sum, item) => sum + item.price, 0);
  }
  return { add, total };
})();

// The modern way: module scope is already private. `items` is not exported,
// so no importer can reach it.
const items = [];

export function add(name, price) {
  items.push({ name, price });
}

export function total() {
  return items.reduce((sum, item) => sum + item.price, 0);
}
