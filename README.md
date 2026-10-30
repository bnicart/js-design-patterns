# JavaScript Design Patterns

The 23 Gang of Four patterns rewritten in modern JavaScript (ES2022+), plus 10 patterns that JavaScript grew on its own: modules, middleware, signals, cancellation, `using` and more.

Every pattern comes with:

- **working code**: small, original, dependency-free examples
- **tests that double as usage examples**: `node:test`, nothing to install
- **a diagram**, the problem it solves, when to use it, when to skip it, and **what modern JavaScript now gives you for free**

## Browse it

The homepage shows each pattern with its diagram, code and tests side by side.

```sh
npm start        # serves the repo at http://localhost:8000
```

It is a plain static page (`index.html`), so GitHub Pages can host it as-is: Settings → Pages → deploy from the `master` branch, root folder.

## Run the tests

Requires Node 24 or later.

```sh
npm test
```

## Patterns

### Creational

| # | Pattern | Therefore… | Modern JS |
|---|---|---|---|
| 1 | [Singleton](creational/singleton.js) | Make the type hand out one shared instance and refuse to create another. | An ES module runs once, so `export const store = new Store()` is already a singleton. |
| 2 | [Factory Method](creational/factory-method.js) | Put object creation in an overridable method, so subclasses pick the product while the base class keeps the workflow. | Classes are values, so a map from key to class or a function argument (`createNotifier = () => new EmailNotifier()`) often replaces the subclass. |
| 3 | [Abstract Factory](creational/abstract-factory.js) | Give clients one factory object that creates every part of a family, and swap the factory to swap the whole family. | There are no interfaces in JS, so any object with the right methods works as a factory, including an object literal of arrow functions. |
| 4 | [Builder](creational/builder.js) | Collect the parts through named, chainable steps and validate everything once in a final `build()`. | Destructured options with defaults (`function request(url, { method = 'GET', headers = {} } = {})`) replace most builders. `URLSearchParams` and `Headers` are small built-in builders. |
| 5 | [Prototype](creational/prototype.js) | Create new objects from an existing one, either by delegating to it or by making a deep copy. | JS is prototype-based: `Object.create(proto)` delegates, and `structuredClone(value)` deep-copies Maps, Sets, Dates and nested objects. |

### Structural

| # | Pattern | Therefore… | Modern JS |
|---|---|---|---|
| 6 | [Adapter](structural/adapter.js) | Put a small wrapper in between that offers your interface and translates each call to the other one. | A plain function or object literal that maps one shape to another often does the job without a class. |
| 7 | [Bridge](structural/bridge.js) | Keep the two hierarchies separate and have the abstraction hold a reference to an implementation object. | Passing the implementation into the constructor is ordinary dependency injection. Any object with the right methods fits, so no interface type is needed. |
| 8 | [Composite](structural/composite.js) | Give leaves and groups the same interface, and let a group answer by asking its children. | Generators with `yield*` make tree walks short, and `reduce` handles aggregation over children. |
| 9 | [Decorator](structural/decorator.js) | Wrap the object or function in another with the same interface that adds its behaviour and delegates the rest. | Higher-order functions are the usual JS form: `const safeFetch = withRetry(fetch)`. TC39 `@decorator` syntax for classes is in progress and needs a transpiler today. |
| 10 | [Facade](structural/facade.js) | Offer one higher-level entry point that runs the sequence and hides the parts behind it. | Often an exported async function is enough. `fetch` itself is a facade over sockets, TLS, headers and streams. |
| 11 | [Flyweight](structural/flyweight.js) | Store the shared, unchanging data once and let each object keep only a reference plus its own small state. | A `Map` keyed by the shared state is the whole factory, and `Object.freeze` keeps the shared part safe. Engines already share hidden classes and interned strings. |
| 12 | [Proxy](structural/proxy.js) | Hand out a stand-in with the same interface that intercepts each access and forwards it to the real object. | The built-in `Proxy` intercepts get, set, has and more. `Reflect` forwards an operation with the default behaviour. |

### Behavioral

| # | Pattern | Therefore… | Modern JS |
|---|---|---|---|
| 13 | [Chain of Responsibility](behavioral/chain-of-responsibility.js) | Line the handlers up in a chain where each one either handles the request or passes it to the next. | Express and Koa middleware use `next()` for this. An array of functions where the first non-`undefined` result wins is often enough. |
| 14 | [Command](behavioral/command.js) | Wrap each action in an object that knows how to execute and reverse itself, and keep those objects in a history. | A command can be a plain object of closures: `{ execute() {}, undo() {} }`. No class hierarchy is needed. |
| 15 | [Interpreter](behavioral/interpreter.js) | Parse the rule into a tree of node objects that each know how to evaluate themselves against a context. | For tiny languages, plain objects and one `evaluate` function with a `switch` on the node type often read better than a class per rule. |
| 16 | [Iterator](behavioral/iterator.js) | Give the collection a standard way to hand out its items one at a time. | Implement `[Symbol.iterator]` with a generator. Iterator helpers (`Iterator.from(x).filter().map().take()`) give lazy pipelines, and `for await` handles async sources. |
| 17 | [Mediator](behavioral/mediator.js) | Route every interaction through one mediator that holds the coordination rules. | An `EventTarget` or a small message bus often plays the mediator role. Framework state stores do the same for UI components. |
| 18 | [Memento](behavioral/memento.js) | Let the object produce an opaque snapshot of itself and later restore from it, while a separate caretaker stores the snapshots. | `structuredClone` makes deep snapshots in one call, and `Object.freeze` keeps a saved snapshot from being changed. |
| 19 | [Observer](behavioral/observer.js) | Let listeners subscribe to the object and have it notify every subscriber when it changes. | `EventTarget` with `CustomEvent` is built into browsers and Node, and an `AbortSignal` removes listeners. A hand-rolled subject whose `subscribe` returns an unsubscribe function is still common. |
| 20 | [State](behavioral/state.js) | Model the states and the allowed transitions between them explicitly, and route every change through them. | A transition table in a plain object is often enough and doubles as documentation. Libraries like XState add guards, timers and visualisation. |
| 21 | [Strategy](behavioral/strategy.js) | Put each variant behind the same signature and pass in the one you want. | Functions are values, so a strategy is just a function. `Array.prototype.sort(compareFn)` is the built-in example. |
| 22 | [Template Method](behavioral/template-method.js) | Write the sequence once in a base class and let subclasses override only the steps that vary. | Higher-order functions or an options object of hooks give the same result without inheritance. Class lifecycle methods in UI frameworks are this pattern. |
| 23 | [Visitor](behavioral/visitor.js) | Move each operation into a visitor object with one method per node type, and have nodes accept visitors. | Without overloading, JS dispatches on a `type` field: `visitor[node.type](node)`. Babel and ESLint plugins use visitor objects keyed by node type. |

### Modern JavaScript

| # | Pattern | Therefore… | Modern JS |
|---|---|---|---|
| 24 | [Module](modern/module.js) | Keep state private to a module and expose only a small public interface. | ES modules: every file has its own scope and only `export`ed names are visible. Namespace objects from `import * as` are frozen. |
| 25 | [Mixin](modern/mixin.js) | Write each behaviour as a function that takes a class and returns a subclass, then stack the ones you need. | Class expressions make a mixin `(Base) => class extends Base {}`. For plain objects, spread syntax and `Object.assign` compose behaviour. |
| 26 | [Dependency injection](modern/dependency-injection.js) | Pass collaborators in through the constructor, and optionally let a small container build and wire them. | Destructured constructor parameters with defaults, `constructor({ mailer, users })`. No decorators or reflection needed. |
| 27 | [Middleware](modern/middleware.js) | Run the request through a composed chain of `async (ctx, next)` functions, each of which can act before and after the rest. | Async functions and `await next()` give the onion model for free. This is the modern form of chain of responsibility, used by Koa, Hono and Express 5. |
| 28 | [Signals](modern/signals.js) | Wrap values in signals that record who reads them, and re-run only those readers when the value changes. | Not built in yet. The TC39 Signals proposal aims to standardize this; Solid, Preact Signals, Vue refs and Angular signals use the same idea today. |
| 29 | [Memoize](modern/memoize.js) | Cache results keyed by the arguments, and for async work cache the in-flight promise so concurrent callers share it. | `Map` takes any key, and `WeakMap` lets entries for object keys be garbage-collected with the object. |
| 30 | [Retry with backoff](modern/retry.js) | Retry a limited number of times with exponentially growing, randomized delays, and stop at once on errors retrying cannot fix. | async/await makes retry a plain loop. Pass an `AbortSignal` so callers can stop waiting. |
| 31 | [Cancellation](modern/cancellation.js) | Pass an `AbortSignal` into async work and stop, clean up and reject when it fires. | `AbortController` and `AbortSignal` work in browsers and Node. `fetch`, `addEventListener` and timers accept a signal; `AbortSignal.timeout(ms)` and `AbortSignal.any([...])` combine sources. |
| 32 | [Concurrency limit](modern/concurrency-limit.js) | Keep a pool of K workers that pull tasks from a queue, so at most K run at a time. | `Promise.allSettled` collects every outcome, and `Promise.withResolvers()` gives a queue the resolve function it needs. |
| 33 | [Resource management](modern/resource-management.js) | Give resources a `Symbol.dispose` or `Symbol.asyncDispose` method and declare them with `using`, so they are released in reverse order when the block exits. | `using`, `await using`, `Symbol.dispose`, `Symbol.asyncDispose`, `DisposableStack` and `AsyncDisposableStack` (Node 24). |

## Layout

```
creational/  structural/  behavioral/  modern/   <id>.js + <id>.test.js
catalog/                                          prose and Mermaid diagrams for each pattern
index.html                                        the homepage
```

To add a pattern, see [CONTRIBUTING.md](CONTRIBUTING.md).

## History

This started in 2018 as notes taken while reading [dofactory's JavaScript design patterns](https://www.dofactory.com/javascript/design-patterns). In 2026 every example was rewritten from scratch in modern JavaScript, and the remaining GoF patterns and a modern section were added.
