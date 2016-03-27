var Test = require('./test'),
    util = require('util');

var nullFunction = function() {};
var lastId = 0;

/**
 * Event Stream triggered by calling `run()`
 *   - `start`  execution started
 *   - `end`  execution complete
 *   - `suite`  (suite) test suite execution started
 *   - `suite end`  (suite) all tests (and sub-suites) have finished
 *   - `test`  (test) test execution started
 *   - `test end`  (test) test completed
 *   - `hook`  (hook) hook execution started
 *   - `hook end`  (hook) hook complete
 *   - `pass`  (test) test passed
 *   - `fail`  (test, err) test failed
 *   - `pending`  (test) test pending
 */
var Suite = function(nameOrHandler, opt_handler) {
  Test.call(this, nameOrHandler, opt_handler);

  this.beforeHooks = [];
  this.beforeEachHooks = [];
  this.suiteStack = [];
  this.afterEachHooks = [];
  this.afterHooks = [];
  this.isBuilt = false;

  this.id = 'suite-' + (lastId++);

  this._preHooks = null;
  this._postHooks = null;
};

util.inherits(Suite, Test);

/**
 * Get a flat array of all wrapped hooks for all tests defined within this
 * Suite.
 */
Suite.prototype.getHooks = function() {
  var hooks = this.beforeHooks.slice();

  this.children.forEach(function(testOrSuite) {
    hooks = hooks.concat(testOrSuite.getHooks());
  });

  hooks = hooks.concat(this.afterHooks);

  return hooks;
};

/**
 * Run this Suite and all nested hooks and tests.
 */
Suite.prototype.run = function() {
  this.getHooks().forEach(function(hook) {
    hook();
  });
};

Suite.prototype.getBeforeEachHooks = function() {
  var hooks = Test.prototype.getBeforeEachHooks.call(this)
    .concat(this.beforeEachHooks);

  return hooks;
};

Suite.prototype.getAfterEachHooks = function() {
  var hooks = Test.prototype.getAfterEachHooks.call(this)
    .concat(this.afterEachHooks);

  return hooks;
};

Suite.prototype._getCurrentSuite = function() {
  return this.suiteStack[this.suiteStack.length - 1] || this;
};

Suite.prototype.onSuite = function(nameOrHandler, opt_handler) {
  var child = new Suite(nameOrHandler, opt_handler);
  var parent = this._getCurrentSuite();

  // Build the stack of suites and run the declaration handler.
  this.suiteStack.push(child);
  parent.addChild(child);
  child.handler.call(child);
  this.suiteStack.pop();

  return this;
};

Suite.prototype.onBefore = function(handler) {
  var suite = this._getCurrentSuite();
  suite.beforeHooks.push(handler);
  return suite;
};

Suite.prototype.onBeforeEach = function(handler) {
  var suite = this._getCurrentSuite();
  suite.beforeEachHooks.push(handler);
  return suite;
}

Suite.prototype.onTest = function(nameOrHandler, opt_handler) {
  var suite = this._getCurrentSuite();
  suite.addChild(new Test(nameOrHandler, opt_handler));
  return suite;
};

Suite.prototype.onAfterEach = function(handler) {
  var suite = this._getCurrentSuite();
  suite.afterEachHooks.push(handler);
  return suite;
};

Suite.prototype.onAfter = function(handler) {
  var suite = this._getCurrentSuite();
  suite.afterHooks.push(handler);
  return suite;
};

module.exports = Suite;

