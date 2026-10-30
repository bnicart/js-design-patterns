/**
 * Chain of Responsibility (behavioral)
 * Pass a request along a chain of handlers until one of them deals with it.
 *
 * Modern JS: a handler can just be a function that returns a result or calls
 * `next()`. Express and Koa middleware are this pattern. The class version
 * below makes each link explicit.
 */

export class Handler {
  #next = null;

  setNext(handler) {
    this.#next = handler;
    return handler; // lets you write a.setNext(b).setNext(c)
  }

  handle(ticket) {
    if (this.#next) return this.#next.handle(ticket);
    return { handledBy: null, ticket };
  }
}

// Each tier knows only its own limit and whether to escalate.
export class Bot extends Handler {
  handle(ticket) {
    if (ticket.topic === 'password-reset') return { handledBy: 'bot', ticket };
    return super.handle(ticket);
  }
}

export class SupportAgent extends Handler {
  handle(ticket) {
    if (ticket.severity <= 2) return { handledBy: 'agent', ticket };
    return super.handle(ticket);
  }
}

export class Engineer extends Handler {
  handle(ticket) {
    if (ticket.severity <= 4) return { handledBy: 'engineer', ticket };
    return super.handle(ticket);
  }
}

export function buildSupportChain() {
  const bot = new Bot();
  bot.setNext(new SupportAgent()).setNext(new Engineer());
  return bot;
}

// The functional form: an array of handlers, each may return a result or defer.
export function chain(...handlers) {
  return (request) => {
    for (const handler of handlers) {
      const result = handler(request);
      if (result !== undefined) return result;
    }
  };
}
