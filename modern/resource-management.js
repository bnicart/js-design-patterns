/**
 * Resource management (modern)
 * Make sure files, locks and connections are released, even when code throws.
 *
 * Modern JS: `using` and `await using` call `[Symbol.dispose]()` or
 * `[Symbol.asyncDispose]()` when the block exits, in reverse order. No more
 * try/finally ladders. `DisposableStack` collects cleanups that are not
 * objects of their own. Supported in Node 24; check browser support before shipping.
 */

export class Lock {
  held = false;
  acquire() {
    this.held = true;
    return { [Symbol.dispose]: () => (this.held = false) };
  }
}

export class Connection {
  open = true;
  constructor(log) {
    this.log = log;
  }
  async query(sql) {
    if (!this.open) throw new Error('connection closed');
    return `rows for ${sql}`;
  }
  async [Symbol.asyncDispose]() {
    this.open = false;
    this.log.push('connection closed');
  }
}

export async function report(lock, log) {
  using _guard = lock.acquire();
  await using db = new Connection(log);
  return db.query('select * from orders');
}

// DisposableStack: register ad-hoc cleanups and release them together.
export function startEditor(log) {
  using stack = new DisposableStack();
  const timer = setInterval(() => {}, 60_000);
  stack.defer(() => {
    clearInterval(timer);
    log.push('autosave stopped');
  });
  stack.defer(() => log.push('draft flushed'));
  // move() hands ownership to the caller; without it, everything is disposed here.
  return stack.move();
}
