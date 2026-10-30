/**
 * Proxy (structural)
 * Stand in for another object to control access to it.
 *
 * Modern JS: the built-in `Proxy` intercepts property reads, writes and
 * calls without a hand-written wrapper class, and `Reflect` forwards the
 * operation to the target with the default behaviour.
 */

// Validation: reject bad writes before they reach the object.
export function validated(target, schema) {
  return new Proxy(target, {
    set(obj, prop, value, receiver) {
      const check = schema[prop];
      if (check && !check(value)) throw new TypeError(`Invalid value for ${String(prop)}: ${value}`);
      return Reflect.set(obj, prop, value, receiver);
    },
  });
}

// Lazy loading: build the real object on first property access.
export function lazy(create) {
  let real;
  return new Proxy({}, {
    get(_, prop) {
      real ??= create();
      const value = Reflect.get(real, prop, real);
      return typeof value === 'function' ? value.bind(real) : value;
    },
  });
}

// Access logging: record every read and write, then forward.
export function logged(target, log = []) {
  return new Proxy(target, {
    get(obj, prop, receiver) {
      log.push(`get ${String(prop)}`);
      return Reflect.get(obj, prop, receiver);
    },
    set(obj, prop, value, receiver) {
      log.push(`set ${String(prop)}`);
      return Reflect.set(obj, prop, value, receiver);
    },
  });
}
