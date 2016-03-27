var Composable = require('./composable'),
    util = require('util');

var DEFAULT_NAME = 'Default Name',
    DEFAULT_HANDLER = function() {},
    DEFAULT_TIMEOUT = 2000,
    DEFAULT_RESULT = {};

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

Test.prototype.fullName = function() {
  var parts = [];

  var nameRoot = this.parent && this.parent.fullName() || null;

  if (nameRoot) {
    parts.push(nameRoot);
  }

  if (this.name) {
    parts.push(this.name);
  }

  return parts.join(' ');
};

Test.prototype._wrapHook = function() {
};

Test.prototype._getRunHandler = function() {
  return [function() {
    try {
      this.result = {
        name: this.fullName()
      };
      this.handler.call(this.context);
    } catch (err) {
      this.result.error = err;
    }
  }.bind(this)];
};

Test.prototype.getHooks = function() {
  return this.getBeforeEachHooks()
    .concat(this._getRunHandler())
    .concat(this.getAfterEachHooks())
    // Ensure each hook will be executed with the test context.
    .map(function(hook) {
      return hook.bind(this.context);
    }, this);
};

Test.prototype.run = function() {
  this.runHooks(this.getHooks());

  return this.result;
};

Test.DEFAULT_NAME = DEFAULT_NAME;
Test.DEFAULT_HANDLER = DEFAULT_HANDLER;

module.exports = Test;

