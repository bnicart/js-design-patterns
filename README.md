# JavaScript Selected Design Patterns
> Referenced from http://www.dofactory.com/javascript/design-patterns

## Creational Patterns
> These kind of patterns focus on ways to create objects. When creating objects in large applications, the tendency to make things complex is always there. Creational design patterns solve this problem by controlling the object creation.

* Builder
  - Separate the construction of a complex object from its representation so that the same construction process can create different representations.

- Factory Method
  - Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.

* Prototype
  - Specify the kind of objects to create using a prototypical instance, and create new objects by copying this prototype.

- Singleton
  - Ensure a class has only one instance and provide a global point of access to it.


## Structural Patterns
> Structural patterns provide ways to manage relationships between objects and also create class structure. One way this is achieved is by using inheritance and composition to create a large object from small objects.

* Adapter
  - Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.

- Composite
  - Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.

- Decorator
  - Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.

* Facade
  - Provide a unified interface to a set of interfaces in a subsystem. Façade defines a higher-level interface that makes the subsystem easier to use.

## Behavioral Patterns
> Behavioral patterns are patterns that focus on interaction between objects. Where creational patterns describe a moment of time and structural patterns describe a more or less static structure, behavioral patterns describe a process or a flow.

* Chain of Responsibility
  - Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.


- Iterator
  - Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.

* Observer
  - Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.


- State
  - Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.


* Strategy
  - Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.
