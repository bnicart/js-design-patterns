# JavaScript Selected Design Patterns
> Referenced from http://www.dofactory.com/javascript/design-patterns

## Creational Patterns

* Builder
  - Separate the construction of a complex object from its representation so that the same construction process can create different representations.

- Factory Method
  - Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.

* Prototype
  - Specify the kind of objects to create using a prototypical instance, and create new objects by copying this prototype.

- Singleton
  - Ensure a class has only one instance and provide a global point of access to it.


## Structural Patterns

* Adapter
  - Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.

- Decorator
  - Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.


## Behavioral Patterns

* Chain of Responsibility
  - Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.


- Iterator
  - Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.


* State
  - Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.


- Strategy
  - Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.
