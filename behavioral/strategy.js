/**
 * Strategy (behavioral)
 * Define a family of interchangeable algorithms and pick one at run time.
 *
 * Modern JS: functions are values, so a strategy is just a function. A map
 * of named functions replaces the strategy interface and its subclasses.
 */

// Each shipping strategy has the same signature: (order) => cost in cents.
export const shippingStrategies = {
  standard: (order) => (order.subtotal >= 5000 ? 0 : 499),
  express: (order) => 999 + order.weightKg * 100,
  pickup: () => 0,
};

export class Checkout {
  #strategy;

  constructor(strategy = shippingStrategies.standard) {
    this.#strategy = strategy;
  }

  setShipping(strategy) {
    this.#strategy = strategy;
  }

  total(order) {
    return order.subtotal + this.#strategy(order);
  }
}

// The built-in example: Array.prototype.sort takes its comparison strategy.
export const sortBy = {
  price: (a, b) => a.price - b.price,
  name: (a, b) => a.name.localeCompare(b.name),
};
