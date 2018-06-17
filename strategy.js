/*

Behavioral Patterns
Strategy
Define a family of algorithms, encapsulate each one, and make them interchangeable.
Strategy lets the algorithm vary independently from clients that use it.

*/
let Shipping = function() {
  this.company = "";
};

Shipping.prototype = {
  setStrategy: function(company) {
    this.company = company;
  },

  calculate: function(package) {
    return this.company.calculate(package);
  }
};

let UPS = function() {
  this.calculate = function(package) {
    // calculations...
    return "$45.95";
  }
};

let USPS = function() {
  this.calculate = function(package) {
    // calculations...
    return "$39.40";
  }
};

let Fedex = function() {
  this.calculate = function(package) {
    // calculations...
    return "$43.20";
  }
};

// log helper

let log = (function() {
  let log = "";

  return {
    add: function(msg) { log += msg + "\n"; },
    show: function() { console.log(log); log = ""; }
  }
})();

function run() {
  let package = { from: "76712", to: "10012", weigth: "lkg" };

  // the 3 strategies

  let ups = new UPS();
  let usps = new USPS();
  let fedex = new Fedex();

  let shipping = new Shipping();

  shipping.setStrategy(ups);
  log.add("UPS Strategy: " + shipping.calculate(package));
  shipping.setStrategy(usps);
  log.add("USPS Strategy: " + shipping.calculate(package));
  shipping.setStrategy(fedex);
  log.add("Fedex Strategy: " + shipping.calculate(package));

  log.show();
}
run();
