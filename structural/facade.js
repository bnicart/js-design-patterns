/**
 * Facade (structural)
 * Give a simple entry point to a set of parts that are fiddly to use together.
 *
 * Modern JS: a facade is often just an exported async function that hides
 * the sequence of calls. `fetch`, for example, is a facade over sockets,
 * TLS, headers and streams.
 */

export class Inventory {
  #stock = new Map([['mug', 2]]);
  reserve(sku, qty) {
    const left = (this.#stock.get(sku) ?? 0) - qty;
    if (left < 0) throw new Error(`Out of stock: ${sku}`);
    this.#stock.set(sku, left);
  }
  release(sku, qty) {
    this.#stock.set(sku, (this.#stock.get(sku) ?? 0) + qty);
  }
}

export class Payments {
  async charge(cardToken, cents) {
    if (cardToken === 'declined') throw new Error('Card declined');
    return { id: `ch_${cents}` };
  }
}

export class Mailer {
  sent = [];
  async send(to, subject) {
    this.sent.push({ to, subject });
  }
}

// The facade knows the order of steps and how to undo them on failure.
export class Checkout {
  constructor({ inventory, payments, mailer }) {
    Object.assign(this, { inventory, payments, mailer });
  }

  async placeOrder({ sku, qty, cents, cardToken, email }) {
    this.inventory.reserve(sku, qty);
    try {
      const charge = await this.payments.charge(cardToken, cents * qty);
      await this.mailer.send(email, `Order confirmed: ${sku}`);
      return { ok: true, chargeId: charge.id };
    } catch (error) {
      this.inventory.release(sku, qty);
      return { ok: false, reason: error.message };
    }
  }
}
