var Iterator = require('../array_iterator');
var Composable = require('./composable');
var util = require('util');

var DEFAULT_NAME = 'Default Name';
var DEFAULT_HANDLER = function() {};
var DEFAULT_TIMEOUT = 2000;

var lastId = 0;

var Status = {
  FAILED: 'failed',
  INITIALIZED: 'initialized',
  PAUSED: 'paused',
  SKIPPED: 'skipped',
  STARTED: 'started',
  SUCCEEDED: 'succeeded'
};

/**
 * Serializable payload that will be provided to reporters.
 */
var TestData = function() {
  this.fullName = null;
  this.status = Status.INITIALIZED;
  this.failure = null;
  this.durationNs = null;

  // Timings for each hook (pre and post)
  this.durationsNs = [];
};

/**
 * Fundamental building block tests.
 */
var Test = function(nameOrHandler, opt_handler) {
  var name;

  this.id = 'test-' + (lastId++);
  this.timeoutMs = DEFAULT_TIMEOUT;
  this.context = {
    timeout: this.setTimeout.bind(this)
  };

  this.data = new TestData();

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

Test.Status = Status;

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

Test.prototype.setTimeout = function(value) {
  this.timeoutMs = value;
};

Test.prototype.getBeforeEachHooks = function() {
  return this.parent && this.parent.getBeforeEachHooks() || [];
};

Test.prototype.getAfterEachHooks = function() {
  return this.parent && this.parent.getAfterEachHooks() || [];
};

Test.prototype.runHooks = function(itr) {
  while (itr.hasNext()) {
    itr.next().call(this);
  }
};

Test.prototype._wrapHook = function(hook) {
  var self = this;

  return function() {
    try {
      var promise = hook.call(self.context);
    } catch (err) {
      self.data.status = Status.FAILED;
      self.data.failure = err;
    }
  };
};

Test.prototype.getHooks = function() {
  return this.getBeforeEachHooks()
    .concat(this._wrapHook(this.handler))
    .concat(this.getAfterEachHooks())
    // Ensure each hook will be executed with the test context.
    .map(function(hook) {
      return hook.bind(this.context);
    }, this);
};

Test.prototype.run = function() {
  this.runHooks(new Iterator(this.getHooks()));

  return this.data;
};

Test.DEFAULT_NAME = DEFAULT_NAME;
Test.DEFAULT_HANDLER = DEFAULT_HANDLER;

module.exports = Test;

