var Composable = require('./composable'),
    util = require('util');

var DEFAULT_NAME = 'Default Name',
    DEFAULT_HANDLER = function() {},
    DEFAULT_TIMEOUT = 2000;

var lastId = 0;

var Test = function(nameOrHandler, opt_handler) {
  var name;

  this.id = 'test-' + (lastId++);
  this.timeout = DEFAULT_TIMEOUT;
  this.context = {
    timeout: this._timeout.bind(this)
  };

  if (opt_handler) {
    name = nameOrHandler;
    this.handler = opt_handler;
  } else if (typeof nameOrHandler === 'function') {
    name = DEFAULT_NAME;
    this.handler = nameOrHandler;
  } else if (typeof nameOrHandler === 'string') {
    name = nameOrHandler;
    this.handler = DEFAULT_HANDLER;
  }

  Composable.call(this, name);
};

util.inherits(Test, Composable);

Test.prototype._timeout = function(value) {
  this.timeout = value;
};

Test.prototype.getBeforeEachHooks = function() {
  return this.parent && this.parent.getBeforeEachHooks() || [];
};

Test.prototype.getAfterEachHooks = function() {
  return this.parent && this.parent.getAfterEachHooks() || [];
};

Test.prototype.runHooks = function(hooks) {
  hooks.forEach(function(hook) {
    hook.call(this);
  });
};

Test.prototype.getHooks = function() {
  return this.getBeforeEachHooks()
    .concat([this.handler])
    .concat(this.getAfterEachHooks())
    // Ensure each hook will be executed with the test context.
    .map(function(hook) {
      return hook.bind(this.context);
    }, this);
};

Test.prototype.run = function() {
  this.runHooks(this.getHooks());
};

Test.DEFAULT_NAME = DEFAULT_NAME;
Test.DEFAULT_HANDLER = DEFAULT_HANDLER;

module.exports = Test;


