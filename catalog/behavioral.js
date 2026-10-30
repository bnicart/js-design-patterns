export default [
  {
    id: 'chain-of-responsibility',
    name: 'Chain of Responsibility',
    problem: 'A request could be handled by one of several parties, and the sender should not have to know which one. Hard-coding the escalation rules in one big `if` ladder makes them hard to change.',
    solution: 'Line the handlers up in a chain where each one either handles the request or passes it to the next.',
    useWhen: [
      'Requests escalate through tiers, like support levels or approval limits.',
      'You want to add, remove or reorder steps without touching the sender.',
      'Middleware: logging, auth and validation run in order before the real work.',
    ],
    avoidWhen: [
      'Exactly one handler always applies. A lookup table is clearer.',
      'Every request must be handled. A chain can let requests fall off the end silently.',
    ],
    native: 'Express and Koa middleware use `next()` for this. An array of functions where the first non-`undefined` result wins is often enough.',
    diagram: `classDiagram
  class Handler {
    +setNext(handler) Handler
    +handle(ticket)
  }
  Handler <|-- Bot
  Handler <|-- SupportAgent
  Handler <|-- Engineer
  Handler --> Handler : next`,
  },
  {
    id: 'command',
    name: 'Command',
    problem: 'Actions run the moment they are called, so there is nothing to undo, replay or queue afterwards.',
    solution: 'Wrap each action in an object that knows how to execute and reverse itself, and keep those objects in a history.',
    useWhen: [
      'You need undo and redo in an editor or drawing tool.',
      'Actions should be queued, logged or retried later.',
    ],
    avoidWhen: [
      'Nothing needs to be undone or deferred. A direct function call is simpler.',
      'Reversing an action is impossible, like sending an email. Undo then misleads users.',
    ],
    native: 'A command can be a plain object of closures: `{ execute() {}, undo() {} }`. No class hierarchy is needed.',
    diagram: `classDiagram
  class History {
    -done
    -undone
    +run(command)
    +undo()
    +redo()
  }
  class Command {
    +execute()
    +undo()
  }
  History o-- Command
  Command ..> TextDocument : edits
  insertText ..> Command : creates
  deleteText ..> Command : creates`,
  },
  {
    id: 'interpreter',
    name: 'Interpreter',
    problem: 'Users need to write small rules, like feature-flag targeting, and checking them with ad hoc string handling gets fragile fast.',
    solution: 'Parse the rule into a tree of node objects that each know how to evaluate themselves against a context.',
    useWhen: [
      'You have a small, stable grammar such as filters, permissions or flag rules.',
      'Rules are parsed once and evaluated many times.',
    ],
    avoidWhen: [
      'The language will grow. Use a parser generator or an existing format like JSON Logic.',
      'You are tempted to use `eval` or `new Function` on user input. Never do that, but a full interpreter may be overkill too.',
    ],
    native: 'For tiny languages, plain objects and one `evaluate` function with a `switch` on the node type often read better than a class per rule.',
    diagram: `classDiagram
  class Expression {
    +evaluate(context)*
  }
  Expression <|-- Flag
  Expression <|-- Not
  Expression <|-- And
  Expression <|-- Or
  And o-- Expression : left, right
  parse ..> Expression : builds`,
  },
  {
    id: 'iterator',
    name: 'Iterator',
    problem: 'Callers want to loop over your collection, but exposing its internals, like linked-list nodes or API pages, ties them to how it is stored.',
    solution: 'Give the collection a standard way to hand out its items one at a time.',
    useWhen: [
      'A custom data structure should work with `for...of` and spread.',
      'Values are produced lazily or are infinite, like ID sequences.',
      'Data arrives in pages and callers should see one stream.',
    ],
    avoidWhen: [
      'The data is already an array. Use it directly.',
      'You need random access by index. Iterators only move forward.',
    ],
    native: 'Implement `[Symbol.iterator]` with a generator. Iterator helpers (`Iterator.from(x).filter().map().take()`) give lazy pipelines, and `for await` handles async sources.',
    diagram: `flowchart LR
  P["Playlist"] -->|"Symbol.iterator"| G["generator"]
  G -->|"Iterator.from"| F["filter"]
  F --> M["map"]
  M --> T["take"]
  T --> A["toArray"]`,
  },
  {
    id: 'mediator',
    name: 'Mediator',
    problem: 'Form fields or UI widgets that update each other directly end up in a web of references, where changing one means checking all the others.',
    solution: 'Route every interaction through one mediator that holds the coordination rules.',
    useWhen: [
      'Several components react to each other, like linked form fields.',
      'Cross-component rules should live in one place you can read and test.',
    ],
    avoidWhen: [
      'Only two objects interact. A direct call is clearer.',
      'The mediator starts absorbing every rule in the app and becomes a god object.',
    ],
    native: 'An `EventTarget` or a small message bus often plays the mediator role. Framework state stores do the same for UI components.',
    diagram: `classDiagram
  class CheckoutForm {
    +notify(sender, event)
  }
  class Field {
    +value
    +disabled
    +input(value)
  }
  Field --> CheckoutForm : notify
  CheckoutForm --> Field : updates
  note for CheckoutForm "Fields never reference each other"`,
  },
  {
    id: 'memento',
    name: 'Memento',
    problem: 'You want to save and restore an object, but copying its fields from outside means breaking its encapsulation.',
    solution: 'Let the object produce an opaque snapshot of itself and later restore from it, while a separate caretaker stores the snapshots.',
    useWhen: [
      'You need checkpoints or "revert to saved" in an editor or game.',
      'The object has private state that callers should not read.',
    ],
    avoidWhen: [
      'State is large and changes often. Full snapshots cost memory; store diffs or commands instead.',
      'The state is already plain, public data. Just clone it.',
    ],
    native: '`structuredClone` makes deep snapshots in one call, and `Object.freeze` keeps a saved snapshot from being changed.',
    diagram: `classDiagram
  class DrawingCanvas {
    -shapes
    -zoom
    +save() Memento
    +restore(memento)
  }
  class Memento {
    +state
  }
  class Checkpoints {
    +save(label)
    +restore(label)
  }
  DrawingCanvas ..> Memento : creates
  Checkpoints o-- Memento : stores
  Checkpoints --> DrawingCanvas`,
  },
  {
    id: 'observer',
    name: 'Observer',
    problem: 'Several parts of an app need to react when something changes, and having the changing object call each of them directly couples it to all of them.',
    solution: 'Let listeners subscribe to the object and have it notify every subscriber when it changes.',
    useWhen: [
      'UI pieces like a cart badge and a total must stay in sync with a store.',
      'The number of listeners varies at run time.',
    ],
    avoidWhen: [
      'There is only one listener that never changes. Call it directly.',
      'Update order matters or listeners trigger each other. The flow becomes hard to follow.',
      'You forget to unsubscribe. Listeners kept alive by a subject leak memory.',
    ],
    native: '`EventTarget` with `CustomEvent` is built into browsers and Node, and an `AbortSignal` removes listeners. A hand-rolled subject whose `subscribe` returns an unsubscribe function is still common.',
    diagram: `classDiagram
  class Subject {
    -listeners
    +subscribe(listener) Function
    +notify(value)
  }
  class CartStore {
    +add(item)
    +total
  }
  Subject <|-- CartStore
  EventTarget <|-- UploadQueue
  Subject --> Listener : notifies`,
  },
  {
    id: 'state',
    name: 'State',
    problem: 'An object behaves differently depending on what it is doing, and checking flags like `isPaused` and `isFailed` in every method leads to tangled conditionals and impossible combinations.',
    solution: 'Model the states and the allowed transitions between them explicitly, and route every change through them.',
    useWhen: [
      'An object has a clear lifecycle, like an upload, an order or a connection.',
      'Some actions are only valid in some states and should be refused otherwise.',
    ],
    avoidWhen: [
      'There are only two states. A boolean is fine.',
      'Transitions are trivial and unlikely to grow.',
    ],
    native: 'A transition table in a plain object is often enough and doubles as documentation. Libraries like XState add guards, timers and visualisation.',
    diagram: `flowchart LR
  idle -->|start| uploading
  uploading -->|pause| paused
  paused -->|resume| uploading
  uploading -->|fail| failed
  failed -->|retry| uploading
  uploading -->|finish| done
  paused -->|cancel| idle`,
  },
  {
    id: 'strategy',
    name: 'Strategy',
    problem: 'One operation has several ways to be done, like different shipping rates, and a growing `switch` inside the code mixes all of them together.',
    solution: 'Put each variant behind the same signature and pass in the one you want.',
    useWhen: [
      'The algorithm is chosen at run time, from user input or config.',
      'Callers should be able to plug in their own variant.',
    ],
    avoidWhen: [
      'There are only one or two fixed variants. An `if` is clearer.',
      'The variants need very different inputs, so they do not share a signature.',
    ],
    native: 'Functions are values, so a strategy is just a function. `Array.prototype.sort(compareFn)` is the built-in example.',
    diagram: `classDiagram
  class Checkout {
    -strategy
    +setShipping(strategy)
    +total(order)
  }
  class shippingStrategies {
    +standard(order)
    +express(order)
    +pickup()
  }
  Checkout --> shippingStrategies : uses one`,
  },
  {
    id: 'template-method',
    name: 'Template Method',
    problem: 'Several classes run the same sequence of steps and differ in only a few of them, so the shared sequence gets copied and drifts apart.',
    solution: 'Write the sequence once in a base class and let subclasses override only the steps that vary.',
    useWhen: [
      'Exporters, importers or reports share a fixed pipeline.',
      'A framework needs lifecycle hooks that users fill in.',
    ],
    avoidWhen: [
      'Inheritance is the only reason to share code. Pass the varying steps in as functions instead.',
      'Subclasses need to change the order of steps, not just their contents.',
    ],
    native: 'Higher-order functions or an options object of hooks give the same result without inheritance. Class lifecycle methods in UI frameworks are this pattern.',
    diagram: `classDiagram
  class DataExporter {
    +export(rows)
    +include(row)
    +header()
    +footer()
    +formatRow(row)*
  }
  DataExporter <|-- CsvExporter
  DataExporter <|-- ActiveUsersMarkdown
  note for DataExporter "export calls the steps in a fixed order"`,
  },
  {
    id: 'visitor',
    name: 'Visitor',
    problem: 'You keep adding operations over a tree of objects, like size, listing and search, and each one means editing every node class.',
    solution: 'Move each operation into a visitor object with one method per node type, and have nodes accept visitors.',
    useWhen: [
      'The node types are stable but new operations keep coming, as in ASTs or file trees.',
      'An operation needs different logic for each node type.',
    ],
    avoidWhen: [
      'New node types are added often. Every visitor must then change.',
      'The tree is plain data. A function with a `switch` on `type` is lighter.',
    ],
    native: 'Without overloading, JS dispatches on a `type` field: `visitor[node.type](node)`. Babel and ESLint plugins use visitor objects keyed by node type.',
    diagram: `classDiagram
  class File {
    +accept(visitor)
  }
  class Folder {
    +children
    +accept(visitor)
  }
  class Visitor {
    +file(file)
    +folder(folder)
  }
  Folder o-- File
  File ..> Visitor : visitor.file
  Folder ..> Visitor : visitor.folder
  Visitor <|.. sizeVisitor
  Visitor <|.. listingVisitor`,
  },
];
