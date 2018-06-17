/*

Behavioral Patterns
Iterator
Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.

*/

let Iterator = function(items) {
  this.index = 0;
  this.items = items;
}

Iterator.prototype = {
  first: function() {
    this.reset();
    return this.next();
  },
  next: function() {
    return this.items[this.index++];
  },
  hasNext: function() {
    return this.index <= this.items.length;
  },
  reset: function() {
    this.index = 0;
  },
  each: function(callback) {
    for (let item = this.first(); this.hasNext(); item = this.next()) {
      callback(item);
    }
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
  let items = ["one", 2, "circle", true, "Applepie"];
  let iter = new Iterator(items);

  // using for loop

  for (let item = iter.first(); iter.hasNext(); item = iter.next()) {
    log.add(item);
  }
  log.add("");

  // using Iterator's each method

  iter.each(function(item) {
    log.add(item);
  });

  log.show();
}

run();
