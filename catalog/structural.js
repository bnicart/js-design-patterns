export default [
  {
    id: 'adapter',
    name: 'Adapter',
    problem: 'A library or service does what you need but its methods and data shapes do not match the interface the rest of your code uses. Calling it directly spreads its quirks everywhere.',
    solution: 'Put a small wrapper in between that offers your interface and translates each call to the other one.',
    useWhen: [
      'You are integrating a third-party client whose API you do not control.',
      'You want to swap one vendor for another without touching calling code.',
    ],
    avoidWhen: [
      'You own both sides. Change one of them to match instead.',
      'The mismatch is a single field rename. A one-line mapping function is enough.',
    ],
    native: 'A plain function or object literal that maps one shape to another often does the job without a class.',
    diagram: `classDiagram
  class KvStorageAdapter {
    +get(key)
    +set(key, value)
  }
  class LegacyKvClient {
    +fetchItem(namespace, key)
    +putItem(namespace, key, json)
  }
  saveCart ..> KvStorageAdapter : uses
  KvStorageAdapter --> LegacyKvClient : translates to`,
  },
  {
    id: 'bridge',
    name: 'Bridge',
    problem: 'Two things vary at once, such as the kind of notification and the channel that delivers it. Subclassing every combination gives you UrgentEmail, UrgentSms, DigestEmail and so on.',
    solution: 'Keep the two hierarchies separate and have the abstraction hold a reference to an implementation object.',
    useWhen: [
      'You have two independent dimensions of variation that would otherwise multiply subclasses.',
      'You want to choose or switch the implementation at runtime.',
    ],
    avoidWhen: [
      'There is only one implementation and no sign of a second.',
      'The split adds indirection that makes a small feature harder to follow.',
    ],
    native: 'Passing the implementation into the constructor is ordinary dependency injection. Any object with the right methods fits, so no interface type is needed.',
    diagram: `classDiagram
  class Notification {
    +channel
    +send(to, message)
    +format(message)
  }
  Notification <|-- UrgentNotification
  Notification <|-- DigestNotification
  Notification o-- EmailChannel : channel
  Notification o-- SmsChannel : channel`,
  },
  {
    id: 'composite',
    name: 'Composite',
    problem: 'Your data is a tree, like folders and files or nested menu items. Code that walks it fills up with checks for whether each node is a leaf or a group.',
    solution: 'Give leaves and groups the same interface, and let a group answer by asking its children.',
    useWhen: [
      'You model part-whole hierarchies: file trees, UI components, org charts.',
      'Callers should run the same operation on one item or a whole subtree.',
    ],
    avoidWhen: [
      'Leaves and groups need very different operations, so the shared interface becomes awkward.',
      'The structure is flat. An array is enough.',
    ],
    native: 'Generators with `yield*` make tree walks short, and `reduce` handles aggregation over children.',
    diagram: `classDiagram
  class FileNode {
    +size()
    +paths()
  }
  class Folder {
    +add(nodes)
    +size()
    +paths()
  }
  Folder o-- FileNode : children
  Folder o-- Folder : children`,
  },
  {
    id: 'decorator',
    name: 'Decorator',
    problem: 'You want to add logging, caching or retries to something without editing it and without a subclass for every combination of extras.',
    solution: 'Wrap the object or function in another with the same interface that adds its behaviour and delegates the rest.',
    useWhen: [
      'You need to combine optional behaviours, such as caching plus logging, in different orders.',
      'You cannot or should not change the original code.',
      'You want cross-cutting concerns like retries applied to plain functions.',
    ],
    avoidWhen: [
      'Deep stacks of wrappers make stack traces and debugging harder.',
      'Behaviour depends on the order of wrappers in ways that are easy to get wrong.',
    ],
    native: 'Higher-order functions are the usual JS form: `const safeFetch = withRetry(fetch)`. TC39 `@decorator` syntax for classes is in progress and needs a transpiler today.',
    diagram: `classDiagram
  class HttpClient {
    +get(url)
  }
  class LoggingClient {
    +inner
    +get(url)
  }
  class CachingClient {
    +inner
    +get(url)
  }
  CachingClient --> LoggingClient : delegates
  LoggingClient --> HttpClient : delegates`,
  },
  {
    id: 'facade',
    name: 'Facade',
    problem: 'Doing one task means calling several subsystems in the right order and cleaning up when a step fails. Every caller repeats that sequence and gets it slightly wrong.',
    solution: 'Offer one higher-level entry point that runs the sequence and hides the parts behind it.',
    useWhen: [
      'A workflow spans several services, such as stock, payment and email in a checkout.',
      'You want to give most callers a simple path while experts can still reach the parts.',
    ],
    avoidWhen: [
      'The facade grows into a god object that knows everything.',
      'Callers need fine control over each step, so the facade just gets in the way.',
    ],
    native: 'Often an exported async function is enough. `fetch` itself is a facade over sockets, TLS, headers and streams.',
    diagram: `classDiagram
  class Checkout {
    +placeOrder(order)
  }
  Checkout --> Inventory : reserve, release
  Checkout --> Payments : charge
  Checkout --> Mailer : send`,
  },
  {
    id: 'flyweight',
    name: 'Flyweight',
    problem: 'You need thousands of similar objects, and each one carries a copy of the same heavy data, like a texture or glyph metrics. Memory use grows with every copy.',
    solution: 'Store the shared, unchanging data once and let each object keep only a reference plus its own small state.',
    useWhen: [
      'There are very many objects and most of their data is identical.',
      'The shared part can be made immutable.',
    ],
    avoidWhen: [
      'There are only a few objects. The saving is not worth the extra factory.',
      'The shared data needs to change per object.',
    ],
    native: 'A `Map` keyed by the shared state is the whole factory, and `Object.freeze` keeps the shared part safe. Engines already share hidden classes and interned strings.',
    diagram: `classDiagram
  class TreeTypeFactory {
    +get(species, texture)$
  }
  class TreeType {
    +species
    +texture
  }
  class Tree {
    +x
    +y
    +type
  }
  Forest o-- Tree
  Tree --> TreeType : shared
  TreeTypeFactory ..> TreeType : creates once`,
  },
  {
    id: 'proxy',
    name: 'Proxy',
    problem: 'You need to check, delay or record access to an object, but you do not want every caller to remember to do it.',
    solution: 'Hand out a stand-in with the same interface that intercepts each access and forwards it to the real object.',
    useWhen: [
      'Writes must be validated before they land.',
      'An object is expensive to build and should only be created on first use.',
      'You want to log or observe access for debugging or reactivity.',
    ],
    avoidWhen: [
      'Hot paths, where the interception overhead adds up.',
      'The hidden behaviour surprises readers. An explicit method call can be clearer.',
    ],
    native: 'The built-in `Proxy` intercepts get, set, has and more. `Reflect` forwards an operation with the default behaviour.',
    diagram: `sequenceDiagram
  participant Caller
  participant Proxy as validated proxy
  participant Target as user object
  Caller->>Proxy: user.age = 31
  Proxy->>Proxy: schema.age check
  Proxy->>Target: Reflect.set
  Caller->>Proxy: user.age = -1
  Proxy-->>Caller: throws TypeError`,
  },
];
