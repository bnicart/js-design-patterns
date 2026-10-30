/**
 * Decorator (structural)
 * Add behaviour to an object by wrapping it in another object with the same interface.
 *
 * Modern JS: functions are values, so the usual form is a higher-order
 * function that takes a function and returns a wrapped one. The object form
 * is shown first; both wrap and delegate rather than modify the original.
 */

// Object form. Each decorator has the same interface and delegates to the one it wraps.
export class HttpClient {
  async get(url) {
    return { url, status: 200 };
  }
}

export class LoggingClient {
  constructor(inner, log = []) {
    this.inner = inner;
    this.log = log;
  }

  async get(url) {
    this.log.push(`GET ${url}`);
    return this.inner.get(url);
  }
}

export class CachingClient {
  #cache = new Map();

  constructor(inner) {
    this.inner = inner;
  }

  async get(url) {
    if (!this.#cache.has(url)) this.#cache.set(url, this.inner.get(url));
    return this.#cache.get(url);
  }
}

// Function form: wrap a function, return one with the same signature.
export const withRetry = (fn, attempts = 3) => async (...args) => {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn(...args);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export const memoize = (fn) => {
  const cache = new Map();
  return (arg) => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
};
