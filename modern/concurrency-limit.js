/**
 * Concurrency limit (modern)
 * Run many async tasks, but never more than K at once.
 *
 * Modern JS: `Promise.allSettled` collects every outcome without stopping at
 * the first failure, and `Promise.withResolvers()` hands out a promise with
 * its resolve function, which is what a waiting queue needs.
 */

// Run all tasks (functions returning promises) with at most `limit` in flight.
// Results come back in input order, as allSettled-style records.
export async function pool(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;
  // Each worker pulls the next task until none are left.
  const worker = async () => {
    while (next < tasks.length) {
      const i = next++;
      try {
        results[i] = { status: 'fulfilled', value: await tasks[i]() };
      } catch (reason) {
        results[i] = { status: 'rejected', reason };
      }
    }
  };
  await Promise.allSettled(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

// A reusable limiter: wrap calls anywhere in the app and they share the K slots.
export function createLimiter(limit) {
  let active = 0;
  const queue = [];
  const release = () => {
    active--;
    queue.shift()?.resolve();
  };
  return async (fn) => {
    if (active >= limit) {
      const { promise, resolve } = Promise.withResolvers();
      queue.push({ resolve });
      await promise;
    }
    active++;
    try {
      return await fn();
    } finally {
      release();
    }
  };
}
