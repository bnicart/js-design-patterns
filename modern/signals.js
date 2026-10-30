/**
 * Signals (modern)
 * Reactive values that track who reads them and notify only those readers on change.
 *
 * Modern JS: this is the idea behind Solid, Preact Signals, Angular signals
 * and the TC39 Signals proposal. Until that lands, a few closures and a Set
 * per signal are enough for automatic dependency tracking.
 */

// The effect or computed currently running. Reads register against it.
let current = null;

export function signal(initial) {
  let value = initial;
  const subscribers = new Set();
  return {
    get value() {
      if (current) {
        subscribers.add(current);
        current.deps.add(subscribers);
      }
      return value;
    },
    set value(next) {
      if (Object.is(next, value)) return;
      value = next;
      // Copy first: running a subscriber re-subscribes it during iteration.
      for (const sub of [...subscribers]) sub.run();
    },
    peek: () => value,
  };
}

export function effect(fn) {
  const runner = {
    deps: new Set(),
    run() {
      // Drop old dependencies so branches no longer taken stop triggering us.
      for (const dep of runner.deps) dep.delete(runner);
      runner.deps.clear();
      const prev = current;
      current = runner;
      try {
        fn();
      } finally {
        current = prev;
      }
    },
  };
  runner.run();
  return () => {
    for (const dep of runner.deps) dep.delete(runner);
    runner.deps.clear();
  };
}

// Simplification: eager, recomputes on every change via an effect. Real libraries are lazy and glitch-free (no stale
// intermediate reads when two inputs change together); use one of them in production.
export function computed(fn) {
  const result = signal(undefined);
  effect(() => {
    result.value = fn();
  });
  return {
    get value() {
      return result.value;
    },
  };
}
