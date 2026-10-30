/**
 * Memoize (modern)
 * Cache a function's result so repeat calls with the same arguments are free.
 *
 * Modern JS: `Map` keys can be anything, and `WeakMap` lets cached entries for
 * objects be garbage-collected with the object. Caching a promise rather than
 * its result means concurrent callers share one in-flight request.
 */

// Primitive arguments: join them into a key. Good for pure functions.
export function memoize(fn, key = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  const memo = (...args) => {
    const k = key(...args);
    if (!cache.has(k)) cache.set(k, fn(...args));
    return cache.get(k);
  };
  memo.cache = cache;
  return memo;
}

// One object argument: a WeakMap does not keep the object alive.
export function memoizeByObject(fn) {
  const cache = new WeakMap();
  return (obj) => {
    if (!cache.has(obj)) cache.set(obj, fn(obj));
    return cache.get(obj);
  };
}

// Async: cache the promise, and forget it on failure so the next call retries.
export function memoizeAsync(fn, key = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return (...args) => {
    const k = key(...args);
    if (!cache.has(k)) {
      const promise = fn(...args).catch((err) => {
        cache.delete(k);
        throw err;
      });
      cache.set(k, promise);
    }
    return cache.get(k);
  };
}
