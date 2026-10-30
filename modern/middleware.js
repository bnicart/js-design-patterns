/**
 * Middleware (modern)
 * Pass a request through a pipeline of functions that can act before and after the rest.
 *
 * Modern JS: async functions make the "onion" model natural. Each middleware
 * is `async (ctx, next) => {}` and `await next()` runs everything downstream.
 * This is the modern form of chain of responsibility, as used by Koa and Hono.
 */

export function compose(middleware) {
  return function run(ctx, last) {
    let index = -1;
    const dispatch = (i) => {
      // Calling next() twice would run downstream middleware twice.
      if (i <= index) return Promise.reject(new Error('next() called more than once'));
      index = i;
      const fn = i === middleware.length ? last : middleware[i];
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    };
    return dispatch(0);
  };
}

export const timing = (now = () => performance.now()) => async (ctx, next) => {
  const start = now();
  await next();
  ctx.headers['x-response-time'] = `${now() - start}ms`;
};

export const auth = async (ctx, next) => {
  if (!ctx.headers.authorization) {
    ctx.status = 401;
    return; // not calling next() stops the chain
  }
  await next();
};

export const errors = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
};
