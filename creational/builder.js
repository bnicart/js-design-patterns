/**
 * Builder (creational)
 * Assemble a complex object step by step, so callers only state the parts they care about.
 *
 * Modern JS: an options object with defaults (`{ method = 'GET', ...rest }`)
 * covers most cases. A builder earns its place when steps need validation,
 * depend on each other, or read better as a chain.
 */

export class RequestBuilder {
  #url;
  #method = 'GET';
  #headers = {};
  #query = new URLSearchParams();
  #body;

  constructor(url) {
    this.#url = url;
  }

  method(name) {
    this.#method = name.toUpperCase();
    return this;
  }

  header(name, value) {
    this.#headers[name.toLowerCase()] = value;
    return this;
  }

  query(name, value) {
    this.#query.append(name, value);
    return this;
  }

  json(data) {
    // Setting a body implies a content type, so the builder keeps them in sync.
    this.#body = JSON.stringify(data);
    return this.header('Content-Type', 'application/json');
  }

  build() {
    if (this.#body && this.#method === 'GET') {
      throw new Error('GET requests cannot have a body');
    }
    const qs = this.#query.size ? `?${this.#query}` : '';
    return Object.freeze({
      url: this.#url + qs,
      method: this.#method,
      headers: { ...this.#headers },
      body: this.#body,
    });
  }
}
