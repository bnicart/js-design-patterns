/*

Behavioral Patterns
Observer
Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

*/

function Click() {
  this.handlers = [];  // observers
}

Click.prototype = {

  subscribe: function(fn) {
    this.handlers.push(fn);
  },

  unsubscribe: function(fn) {
    this.handlers = this.handlers.filter(
      function(item) {
        if (item !== fn) {
          return item;
        }
      }
    );
  },

  fire: function(o, thisObj) {
    let scope = thisObj || window;
    this.handlers.forEach(function(item) {
      item.call(scope, o);
    });
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

  let clickHandler = function(item) {
    log.add("fired: " + item);
  };

  let click = new Click();

  click.subscribe(clickHandler);
  click.fire('event #1');
  click.unsubscribe(clickHandler);
  click.fire('event #2');
  click.subscribe(clickHandler);
  click.fire('event #3');

  log.show();
}

run();
