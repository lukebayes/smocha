var Composable = require('./composable'),
    util = require('util');

var DEFAULT_NAME = 'Default Name',
    DEFAULT_HANDLER = function() {};

var lastId = 0;

var Test = function(nameOrHandler, opt_handler) {
  var name;

  this.id = 'test-' + (lastId++);

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

Test.prototype.run = function() {
  var hooks = this.getBeforeEachHooks()
    .concat([this.handler])
    .concat(this.getAfterEachHooks());

  this.runHooks(hooks);
};

Test.DEFAULT_NAME = DEFAULT_NAME;
Test.DEFAULT_HANDLER = DEFAULT_HANDLER;

module.exports = Test;


