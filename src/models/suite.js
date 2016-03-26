var Test = require('./test'),
    util = require('util');

var nullFunction = function() {};
var lastId = 0;

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

Suite.prototype.run = function() {
  // Run each before hook before running suite.
  this.beforeHooks.forEach(function(hook) {
    hook.call(this);
  }, this);

  this.children.forEach(function(testOrSuite) {
    testOrSuite.run();
  }, this);

  this.afterHooks.forEach(function(hook) {
    hook.call(this);
  }, this);
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

