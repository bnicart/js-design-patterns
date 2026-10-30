export default [
  {
    id: 'module',
    name: 'Module',
    problem: 'Scripts that share one global scope overwrite each other\'s variables, and any code can reach in and change internal state.',
    solution: 'Keep state private to a module and expose only a small public interface.',
    useWhen: [
      'A piece of code has internal state that callers should not touch.',
      'You want a clear public API for a feature, such as a cart or a cache.',
    ],
    avoidWhen: [
      'You are writing new code. Use ES modules rather than IIFEs or the revealing module trick.',
      'Tests need fresh state each time. Module state lives for the whole process, so export a factory instead.',
    ],
    native: 'ES modules: every file has its own scope and only `export`ed names are visible. Namespace objects from `import * as` are frozen.',
    diagram: `flowchart LR
  A["LegacyCart (IIFE closure)"] -->|reveals| B["{ add, total }"]
  C["module.js scope"] -->|export| D["add, total"]
  C -.-|not exported| E["items"]`,
  },
  {
    id: 'mixin',
    name: 'Mixin',
    problem: 'Several unrelated classes need the same behaviour, and a single inheritance chain forces you into deep, awkward hierarchies.',
    solution: 'Write each behaviour as a function that takes a class and returns a subclass, then stack the ones you need.',
    useWhen: [
      'A capability like serialization or timestamps applies to many unrelated classes.',
      'You want to combine behaviours freely instead of naming every combination as a class.',
    ],
    avoidWhen: [
      'Mixins add methods with clashing names. Later mixins silently override earlier ones.',
      'Plain composition (holding a helper object) would do. It is easier to read and test.',
    ],
    native: 'Class expressions make a mixin `(Base) => class extends Base {}`. For plain objects, spread syntax and `Object.assign` compose behaviour.',
    diagram: `classDiagram
  class Entity {
    +id
  }
  class Timestamped {
    +touch(now)
  }
  class Serializable {
    +toJSON()
  }
  class Note {
    +text
  }
  Entity <|-- Timestamped
  Timestamped <|-- Serializable
  Serializable <|-- Note`,
  },
  {
    id: 'dependency-injection',
    name: 'Dependency injection',
    problem: 'A class that creates its own mailer, database or HTTP client is tied to them, so you cannot test it without sending real email.',
    solution: 'Pass collaborators in through the constructor, and optionally let a small container build and wire them.',
    useWhen: [
      'A class talks to the network, disk, clock or anything else you want to fake in tests.',
      'The same service runs with different implementations in different environments.',
    ],
    avoidWhen: [
      'The dependency is a pure helper with no side effects. Just import it.',
      'A container adds indirection a small app does not need. Plain constructor arguments are often enough.',
    ],
    native: 'Destructured constructor parameters with defaults, `constructor({ mailer, users })`. No decorators or reflection needed.',
    diagram: `classDiagram
  class Container {
    +register(name, factory)
    +resolve(name)
  }
  class SignupService {
    +register(email)
  }
  class HttpMailer {
    +send(to, subject)
  }
  Container ..> SignupService : builds
  SignupService --> HttpMailer : mailer
  note for SignupService "Tests pass a fake mailer instead"`,
  },
  {
    id: 'middleware',
    name: 'Middleware',
    problem: 'Every request needs logging, auth, error handling and timing, and putting all of that in each handler repeats code and mixes concerns.',
    solution: 'Run the request through a composed chain of `async (ctx, next)` functions, each of which can act before and after the rest.',
    useWhen: [
      'Requests, jobs or messages pass through several independent steps.',
      'A step needs to wrap the rest, such as timing, error handling or a transaction.',
    ],
    avoidWhen: [
      'Order-dependent middleware gets hard to follow when the chain grows long.',
      'There are only one or two steps. A direct function call is clearer.',
    ],
    native: 'Async functions and `await next()` give the onion model for free. This is the modern form of chain of responsibility, used by Koa, Hono and Express 5.',
    diagram: `sequenceDiagram
  participant compose
  participant errors
  participant auth
  participant handler
  compose->>errors: ctx
  errors->>auth: await next()
  auth->>handler: await next()
  handler-->>auth: done
  auth-->>errors: done
  errors-->>compose: ctx.status, ctx.body`,
  },
  {
    id: 'signals',
    name: 'Signals',
    problem: 'Keeping derived values and the UI in sync by hand means remembering every place that depends on a value, and forgetting one causes stale screens.',
    solution: 'Wrap values in signals that record who reads them, and re-run only those readers when the value changes.',
    useWhen: [
      'UI or derived state depends on a few changing values.',
      'You want fine-grained updates without diffing a whole tree.',
    ],
    avoidWhen: [
      'State changes rarely and a plain re-render is cheap enough.',
      'Effects that write to signals they read can loop. Keep effects for side effects only.',
    ],
    native: 'Not built in yet. The TC39 Signals proposal aims to standardize this; Solid, Preact Signals, Vue refs and Angular signals use the same idea today.',
    diagram: `flowchart LR
  A["signal(price)"] --> C["computed(total)"]
  B["signal(qty)"] --> C
  C --> D["effect(render)"]`,
  },
  {
    id: 'memoize',
    name: 'Memoize',
    problem: 'An expensive function or request runs again and again with the same inputs, wasting time and network calls.',
    solution: 'Cache results keyed by the arguments, and for async work cache the in-flight promise so concurrent callers share it.',
    useWhen: [
      'A pure function is called often with repeated arguments.',
      'Several parts of the page request the same resource at the same time.',
    ],
    avoidWhen: [
      'Results change over time. A plain memo cache never expires, so add a TTL or use a real cache.',
      'Arguments are rarely repeated. The cache only grows and costs memory.',
    ],
    native: '`Map` takes any key, and `WeakMap` lets entries for object keys be garbage-collected with the object.',
    diagram: `flowchart LR
  A["getUser(1)"] --> C{"cache.has(key)?"}
  B["getUser(1)"] --> C
  C -->|no| D["fetchUser(1)"]
  C -->|yes| E["cached promise"]
  D --> E`,
  },
  {
    id: 'retry',
    name: 'Retry with backoff',
    problem: 'Network calls fail now and then for reasons that pass on their own, but retrying instantly and forever overloads the server and hides real errors.',
    solution: 'Retry a limited number of times with exponentially growing, randomized delays, and stop at once on errors retrying cannot fix.',
    useWhen: [
      'Calling a remote service that sometimes returns 503, 429 or drops the connection.',
      'Many clients might fail together and should not all retry at the same moment.',
    ],
    avoidWhen: [
      'The operation is not idempotent. Retrying a payment can charge twice.',
      'The error is a 4xx or a validation failure. It will fail the same way again.',
    ],
    native: 'async/await makes retry a plain loop. Pass an `AbortSignal` so callers can stop waiting.',
    diagram: `sequenceDiagram
  participant retry
  participant operation
  retry->>operation: attempt 0
  operation-->>retry: HttpError 503
  Note over retry: wait random up to 100ms
  retry->>operation: attempt 1
  operation-->>retry: HttpError 503
  Note over retry: wait random up to 200ms
  retry->>operation: attempt 2
  operation-->>retry: ok`,
  },
  {
    id: 'cancellation',
    name: 'Cancellation',
    problem: 'A user navigates away or a deadline passes, but the upload or request keeps running, wasting work and sometimes writing stale results.',
    solution: 'Pass an `AbortSignal` into async work and stop, clean up and reject when it fires.',
    useWhen: [
      'Requests or jobs can outlive the screen or operation that started them.',
      'Work must finish within a deadline, or be cancelled by the user, whichever comes first.',
    ],
    avoidWhen: [
      'The work is short and side-effect free. Ignoring the result is enough.',
      'The underlying operation cannot actually stop. Aborting only stops waiting, not the work.',
    ],
    native: '`AbortController` and `AbortSignal` work in browsers and Node. `fetch`, `addEventListener` and timers accept a signal; `AbortSignal.timeout(ms)` and `AbortSignal.any([...])` combine sources.',
    diagram: `sequenceDiagram
  participant caller
  participant AbortController
  participant uploadChunks
  caller->>uploadChunks: start with signal
  uploadChunks->>uploadChunks: send chunk 1
  caller->>AbortController: abort()
  AbortController-->>uploadChunks: abort event
  uploadChunks-->>caller: reject AbortError`,
  },
  {
    id: 'concurrency-limit',
    name: 'Concurrency limit',
    problem: 'Starting hundreds of uploads or requests at once trips rate limits, exhausts sockets and makes everything slower.',
    solution: 'Keep a pool of K workers that pull tasks from a queue, so at most K run at a time.',
    useWhen: [
      'Processing a large batch of files, URLs or records against a rate-limited service.',
      'Several parts of an app share one limited resource and should queue for it.',
    ],
    avoidWhen: [
      'The batch is small. `Promise.all` is simpler.',
      'The work is CPU-bound. A promise pool does not add parallelism; use workers.',
    ],
    native: '`Promise.allSettled` collects every outcome, and `Promise.withResolvers()` gives a queue the resolve function it needs.',
    diagram: `flowchart LR
  T["tasks"] --> Q["pool queue"]
  Q --> W1["worker 1"]
  Q --> W2["worker 2"]
  W1 --> R["results in order"]
  W2 --> R`,
  },
  {
    id: 'resource-management',
    name: 'Resource management',
    problem: 'Locks, connections and timers must be released even when code throws, and nested try/finally blocks are easy to get wrong.',
    solution: 'Give resources a `Symbol.dispose` or `Symbol.asyncDispose` method and declare them with `using`, so they are released in reverse order when the block exits.',
    useWhen: [
      'Code acquires something that must be released: a lock, a file handle, a database connection.',
      'Several cleanups must run in reverse order even if one step fails.',
    ],
    avoidWhen: [
      'You must support browsers or runtimes without `using`. Check support or fall back to try/finally.',
      'The resource lifetime does not match a block, such as a connection held by a long-lived service.',
    ],
    native: '`using`, `await using`, `Symbol.dispose`, `Symbol.asyncDispose`, `DisposableStack` and `AsyncDisposableStack` (Node 24).',
    diagram: `classDiagram
  class Lock {
    +acquire()
  }
  class Connection {
    +query(sql)
    +asyncDispose()
  }
  class DisposableStack {
    +defer(fn)
    +move()
    +dispose()
  }
  report ..> Lock : using
  report ..> Connection : await using
  startEditor ..> DisposableStack : using`,
  },
];
