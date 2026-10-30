/**
 * Cancellation (modern)
 * Let a caller stop async work it no longer needs.
 *
 * Modern JS: `AbortController` and `AbortSignal` are the standard cancel
 * token in browsers and Node. `fetch`, `addEventListener` and timers accept
 * a signal; `AbortSignal.timeout(ms)` and `AbortSignal.any([...])` combine
 * deadlines with user cancellation.
 */

// Make any wait abortable: reject with the signal's reason and clean up the timer.
export function delay(ms, { signal } = {}) {
  return new Promise((resolve, reject) => {
    signal?.throwIfAborted();
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(signal.reason);
    }
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

// A long job that checks the signal between steps.
export async function uploadChunks(chunks, send, { signal } = {}) {
  const sent = [];
  for (const chunk of chunks) {
    signal?.throwIfAborted();
    await send(chunk, { signal });
    sent.push(chunk);
  }
  return sent;
}

// Cancel when the user clicks cancel OR the deadline passes, whichever comes first.
export function withDeadline(userSignal, ms) {
  return AbortSignal.any([userSignal, AbortSignal.timeout(ms)]);
}
