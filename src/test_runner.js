var EventEmitter = require('events').EventEmitter;
var Events = require('./models/events');
var Iterator = require('./array_iterator');
var util = require('util');

/**
 * Runs the provided Test (or Suite) by requesting all execution hooks as a
 * flattened Array and then executing each hook in order until all hooks
 * have been called.
 *
 *
 * @see src/models/events.js For more details about the event stream that the
 *   TestRunner can emit.
 */
var TestRunner = function(testOrSuite) {
  this._test = testOrSuite;
};

util.inherits(TestRunner, EventEmitter);

TestRunner.prototype.run = function() {
  this.emit(Events.STARTED, this._test.data);

  var itr = new Iterator(this._test.getHooks());
  while (itr.hasNext()) {
    itr.next().call();
  }
};

TestRunner.create = function(testOrSuite) {
  return new TestRunner(testOrSuite);
};

module.exports = TestRunner;

