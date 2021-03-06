/*

Behavioral Patterns
Chain of Responsibility
Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request.
Chain the receiving objects and pass the request along the chain until an object handles it.

*/
let Request = function(amount) {
  this.amount = amount;
  log.add("Requested: $" + amount + "\n");
}

Request.prototype = {
  get: function(bill) {
    let count = Math.floor(this.amount / bill);
    this.amount -= count * bill;
    log.add("Dispense " + count + " $" + bill + " bills");
    return this;
  }
}

// log helper

let log = (function() {
  let log = "";

  return {
    add: function(msg) { log += msg + "\n"; },
    show: function() { console.log(log); log = ""; }
  }
})();

function run() {
  let request = new Request(378);

  request.get(100).get(50).get(20).get(10).get(5).get(1);

  log.show();
}

run();
