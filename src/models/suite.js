var Test = require('./test'),
    util = require('util');

var nullFunction = function() {};

var Suite = function(name, handler) {
  Test.call(this, name, handler);

  this.beforeHooks = [];
  this.beforeEachHooks = [];
  this.tests = [];
  this.afterEachHooks = [];
  this.afterHooks = [];
  this.isBuilt = false;

  this._preHooks = null;
  this._postHooks = null;
};

Suite.prototype.beforeRun = function() {
  // Run before blocks
};

Suite.prototype.build = function() {
  this.children.forEach(function(child) {
    child.build();
  });

  this.handler.call(null);
  this.isBuilt = true;
};

Suite.prototype.run = function() {
  if (!this.isBuilt) {
    this.build();
  }

  this.tests.forEach(test => test.run());
};

Suite.prototype.afterRun = function() {
  // Run after blocks
};

Suite.prototype.onSuite = function(nameOrHandler, opt_handler) {
  this.addChild(new Suite(nameOrHandler, opt_handler));
  return this;
};

Suite.prototype.onBefore = function(handler) {
  this.beforeHooks.push(handler);
  return this;
};

Suite.prototype.onBeforeEach = function(handler) {
  this.beforeEachHooks.push(handler);
  return this;
}

Suite.prototype.onTest = function(nameOrHandler, opt_handler) {
  this.tests.push(new Test(nameOrHandler, opt_handler));
  return this;
};

Suite.prototype.onAfterEach = function(handler) {
  this.afterEachHooks.push(handler);
  return this;
};

Suite.prototype.onAfter = function(handler) {
  this.afterHooks.push(handler);
  return this;
};

util.inherits(Suite, Test);

module.exports = Suite;

