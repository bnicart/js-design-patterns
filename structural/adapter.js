/**
 * Adapter (structural)
 * Convert the interface of one object into the interface your code expects.
 *
 * Modern JS: often a plain function or object literal that maps one shape to
 * another is enough. A class helps when the adapter keeps state or wraps a
 * long-lived client.
 */

// The interface the app codes against.
// interface Storage { get(key): Promise<value>; set(key, value): Promise<void> }

// A third-party key-value client with a different, callback-free but oddly
// named API that returns JSON strings.
export class LegacyKvClient {
  #data = new Map();

  async fetchItem(namespace, key) {
    return this.#data.get(`${namespace}:${key}`) ?? null;
  }

  async putItem(namespace, key, json) {
    this.#data.set(`${namespace}:${key}`, json);
  }
}

// Adapts LegacyKvClient to the Storage interface: fixed namespace, JSON in and out.
export class KvStorageAdapter {
  #client;
  #namespace;

  constructor(client, namespace = 'app') {
    this.#client = client;
    this.#namespace = namespace;
  }

  async get(key) {
    const json = await this.#client.fetchItem(this.#namespace, key);
    return json === null ? undefined : JSON.parse(json);
  }

  async set(key, value) {
    await this.#client.putItem(this.#namespace, key, JSON.stringify(value));
  }
}

// App code only knows the Storage interface.
export async function saveCart(storage, userId, items) {
  await storage.set(`cart:${userId}`, { items, savedAt: 0 });
  return storage.get(`cart:${userId}`);
}
