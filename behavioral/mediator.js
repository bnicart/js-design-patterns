/**
 * Mediator (behavioral)
 * Let objects talk through one coordinator instead of referencing each other directly.
 *
 * Modern JS: an `EventTarget` or a small message bus often plays the
 * mediator role. A dedicated class is worth it when the coordination has
 * rules of its own, like the form below.
 */

// The fields know nothing about each other, only about the mediator.
export class Field {
  value = '';
  disabled = false;

  constructor(name, mediator) {
    this.name = name;
    this.mediator = mediator;
  }

  input(value) {
    this.value = value;
    this.mediator.notify(this, 'change');
  }
}

export class CheckoutForm {
  constructor() {
    this.shipping = new Field('shipping', this);
    this.sameAsShipping = new Field('sameAsShipping', this);
    this.billing = new Field('billing', this);
    this.submit = new Field('submit', this);
    this.#update();
  }

  // All cross-field rules live here, in one place.
  notify(sender, event) {
    if (event !== 'change') return;
    if (sender === this.shipping && this.sameAsShipping.value) this.billing.value = this.shipping.value;
    this.#update();
  }

  #update() {
    const same = Boolean(this.sameAsShipping.value);
    this.billing.disabled = same;
    if (same) this.billing.value = this.shipping.value;
    this.submit.disabled = !(this.shipping.value && this.billing.value);
  }
}
