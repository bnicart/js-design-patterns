/**
 * Retry (modern)
 * Try a flaky async operation again, waiting longer each time, and give up on errors retrying won't fix.
 *
 * Modern JS: async/await turns retry into a plain loop. `AbortSignal` lets
 * the caller stop waiting, and injecting `sleep` and `random` keeps tests instant.
 */

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class HttpError extends Error {
  constructor(status) {
    super(`HTTP ${status}`);
    this.status = status;
  }
}

// 4xx means the request itself is wrong, so trying again won't help (except 429).
export const isRetryable = (err) => !(err instanceof HttpError) || err.status === 429 || err.status >= 500;

export async function retry(
  operation,
  { retries = 3, baseMs = 100, maxMs = 5000, shouldRetry = isRetryable, wait = sleep, random = Math.random } = {},
) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await operation(attempt);
    } catch (err) {
      if (attempt >= retries || !shouldRetry(err)) throw err;
      // Full jitter: a random delay up to the exponential cap, so clients
      // that failed together don't all retry at the same moment.
      const cap = Math.min(maxMs, baseMs * 2 ** attempt);
      await wait(Math.round(random() * cap));
    }
  }
}
