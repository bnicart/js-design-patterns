/*

Creational Patterns
Prototype
Specify the kind of objects to create using a prototypical instance, and create new objects by copying this prototype.

*/

function Customer(firstName, lastName, status) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.status = status;

  this.say = function () {
    console.log(`Name: ${this.firstName} ${this.lastName}, Status: ${this.status}`);
  };
}

function CustomerPrototype(prototype) {
  this.prototype = prototype;

  this.clone = function () {
    let customer = new Customer();

    customer.firstName = this.prototype.firstName;
    customer.lastName = this.prototype.lastName;
    customer.status = this.prototype.status;

    return customer;
  };
}

function run() {

  let proto = new Customer("n/a", "Nicart", "pending");
  let prototype = new CustomerPrototype(proto);

  let customer1 = prototype.clone();
  let customer2 = prototype.clone();
  customer1.say();
  customer2.say();
}

run();
