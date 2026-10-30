export default [
  {
    id: 'singleton',
    name: 'Singleton',
    problem: 'Some things should exist exactly once: a config store, a connection pool, a logger. Creating a second one causes bugs that are hard to trace.',
    solution: 'Make the type hand out one shared instance and refuse to create another.',
    useWhen: [
      'A resource is expensive or must be coordinated (one pool, one cache).',
      'You need lazy creation, so the instance is only built on first use.',
    ],
    avoidWhen: [
      'It is just a way to make a global variable. Pass the dependency in instead.',
      'Tests need isolated state. Singletons leak between tests unless you add a reset hook.',
    ],
    native: 'An ES module runs once, so `export const store = new Store()` is already a singleton.',
    diagram: `classDiagram
  class Config {
    -instance$
    +instance() Config$
    +get(key)
    +set(key, value)
  }
  ModuleA ..> Config : Config.instance
  ModuleB ..> Config : Config.instance
  note for Config "One instance, created on first use"`,
  },
  {
    id: 'factory-method',
    name: 'Factory Method',
    problem: 'A base class owns a workflow, such as sending an alert, but the object it needs to create differs by situation. Hardcoding `new EmailNotifier()` in the workflow ties it to one choice.',
    solution: 'Put object creation in an overridable method, so subclasses pick the product while the base class keeps the workflow.',
    useWhen: [
      'A shared workflow needs a collaborator whose concrete type varies by subclass.',
      'Framework code must create objects that users of the framework define.',
    ],
    avoidWhen: [
      'You only need to pick a class by name. A lookup map such as `{ email: EmailNotifier }` is shorter.',
      'There is one product type. A plain `new` is clearer.',
    ],
    native: 'Classes are values, so a map from key to class or a function argument (`createNotifier = () => new EmailNotifier()`) often replaces the subclass.',
    diagram: `classDiagram
  class AlertService {
    +createNotifier()*
    +alert(user, message)
  }
  class EmailAlertService {
    +createNotifier()
  }
  class SmsAlertService {
    +createNotifier()
  }
  AlertService <|-- EmailAlertService
  AlertService <|-- SmsAlertService
  EmailAlertService ..> EmailNotifier : creates
  SmsAlertService ..> SmsNotifier : creates`,
  },
  {
    id: 'abstract-factory',
    name: 'Abstract Factory',
    problem: 'Some objects only work together, like an uploader and the URL builder for the same storage. Creating them separately makes it easy to mix parts from different families.',
    solution: 'Give clients one factory object that creates every part of a family, and swap the factory to swap the whole family.',
    useWhen: [
      'You switch between whole sets of parts by environment, platform or theme.',
      'Parts from different families must never be combined.',
    ],
    avoidWhen: [
      'There is only one family. The extra layer adds nothing.',
      'Families gain new kinds of parts often. Every factory has to change each time.',
    ],
    native: 'There are no interfaces in JS, so any object with the right methods works as a factory, including an object literal of arrow functions.',
    diagram: `classDiagram
  class LocalStorageFactory {
    +createUploader()
    +createUrls()
  }
  class CloudStorageFactory {
    +createUploader()
    +createUrls()
  }
  saveAvatar ..> LocalStorageFactory : uses
  saveAvatar ..> CloudStorageFactory : uses
  LocalStorageFactory ..> LocalUploader : creates
  LocalStorageFactory ..> LocalUrls : creates
  CloudStorageFactory ..> CloudUploader : creates
  CloudStorageFactory ..> CloudUrls : creates`,
  },
  {
    id: 'builder',
    name: 'Builder',
    problem: 'An object has many optional parts, some of which depend on each other. A constructor with eight positional arguments is unreadable and lets invalid combinations through.',
    solution: 'Collect the parts through named, chainable steps and validate everything once in a final `build()`.',
    useWhen: [
      'Construction has rules, such as a body requiring a content type.',
      'Callers set a few of many optional parts and the chain reads better than an options bag.',
    ],
    avoidWhen: [
      'An options object with defaults covers it. That is the usual case in JS.',
      'The object has two or three fields.',
    ],
    native: 'Destructured options with defaults (`function request(url, { method = \'GET\', headers = {} } = {})`) replace most builders. `URLSearchParams` and `Headers` are small built-in builders.',
    diagram: `classDiagram
  class RequestBuilder {
    -url
    -method
    -headers
    +method(name) RequestBuilder
    +header(name, value) RequestBuilder
    +query(name, value) RequestBuilder
    +json(data) RequestBuilder
    +build() Request
  }
  Client ..> RequestBuilder : chains steps
  RequestBuilder ..> Request : builds`,
  },
  {
    id: 'prototype',
    name: 'Prototype',
    problem: 'Setting up an object from scratch is repetitive when you already have one configured the way you want. Copying it by hand misses nested data or shares it by accident.',
    solution: 'Create new objects from an existing one, either by delegating to it or by making a deep copy.',
    useWhen: [
      'Many objects share defaults and behaviour, like enemies in a game.',
      'You keep configured templates and stamp out independent variations.',
    ],
    avoidWhen: [
      'A class with a constructor is clearer for the team. Classes use prototypes under the hood anyway.',
      'The object holds functions, DOM nodes or class instances. `structuredClone` cannot copy those faithfully.',
    ],
    native: 'JS is prototype-based: `Object.create(proto)` delegates, and `structuredClone(value)` deep-copies Maps, Sets, Dates and nested objects.',
    diagram: `classDiagram
  class enemyPrototype {
    +hp
    +speed
    +takeHit(damage)
    +alive()
  }
  bat ..> enemyPrototype : delegates
  slime ..> enemyPrototype : delegates
  goblinTemplate ..> goblinKing : structuredClone`,
  },
];
