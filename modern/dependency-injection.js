/**
 * Dependency injection (modern)
 * Give an object its collaborators instead of letting it create them.
 *
 * Modern JS: constructor parameters with destructuring and defaults are all
 * you need most of the time. A container is optional; the tiny one here
 * shows the idea without decorators or reflection.
 */

export class HttpMailer {
  async send(to, subject) {
    const res = await fetch('https://mail.example.com/send', {
      method: 'POST',
      body: JSON.stringify({ to, subject }),
    });
    return res.ok;
  }
}

// The service never says `new HttpMailer()`, so tests can pass a fake.
export class SignupService {
  #mailer;
  #users;

  constructor({ mailer, users }) {
    this.#mailer = mailer;
    this.#users = users;
  }

  async register(email) {
    if (this.#users.has(email)) throw new Error(`${email} already registered`);
    this.#users.add(email);
    await this.#mailer.send(email, 'Welcome!');
    return email;
  }
}

// A tiny container: register factories by name, resolve lazily, cache singletons.
export class Container {
  #factories = new Map();
  #instances = new Map();

  register(name, factory) {
    this.#factories.set(name, factory);
    this.#instances.delete(name);
    return this;
  }

  resolve(name) {
    if (!this.#factories.has(name)) throw new Error(`Nothing registered as "${name}"`);
    if (!this.#instances.has(name)) this.#instances.set(name, this.#factories.get(name)(this));
    return this.#instances.get(name);
  }
}

export const createContainer = () =>
  new Container()
    .register('mailer', () => new HttpMailer())
    .register('users', () => new Set())
    .register('signup', (c) => new SignupService({ mailer: c.resolve('mailer'), users: c.resolve('users') }));
