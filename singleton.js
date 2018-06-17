/*

Creational Patterns
Singleton
Ensure a class has only one instance and provide a global point of access to it.

*/

var Singleton = (function () {
  let instance = undefined;

  function createInstance() {
    let object = new Object("I am an instance!");
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

function run() {

  let instance1 = Singleton.getInstance();
  let instance2 = Singleton.getInstance();

  console.log("Same instance? " + (instance1 === instance2));
}

run();
