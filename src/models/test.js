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


/**
 * A test hook can be a before, beforeEach, afterEach, after or it block.
 *
 * We have 3 kinds of test hook implementations:
 *
 * 1) Synchronous
 * 2) Async Callback
 * 3) Async Promise
 *
 * Synchronous hooks are often lightweight, simple functions and should be
 * executed quicklky.
 *
 * Async Callback hooks require a `done()` function as the only argument.
 *
 * Async Promise hooks return a promise when called.
 *
 * We also need the Runner to emit events to notify Reporters during test
 * progress.
 *
 */
Test.prototype.wrapHook = function(hook) {
  var self = this;
  var data = this.data;

  return function(runner) {
    try {
      if (hook.length === 1) {
        // We have a callback-style async hook.
        throw new Error('Not yet implemented');
      }

      var promise = hook.call(self.context);

      if (promise) {
        runner.onHookPaused(data);
      } else {
        runner.onHookCompleted(data);
      }
    } catch (err) {
      data.status = Status.FAILED;
      data.failure = err;
      runner.onHookFailed(data);
    } finally {
      runner.onHookCompleted(data);
    }
  };
};

/**
 * Wrap the provided Array of hook functions so that they properly manage
 * asynchronous execution and aggregated iteration.
 */
Test.prototype.wrapHooks = function(hooks) {
  return hooks.map(function(hook) {
    return this.wrapHook(hook);
  }, this);
};

Test.prototype.testStartHook = function(runner) {
  this.data.fullName = this.fullName();
  runner.onHookStarted(this.data);
  runner.onTestStarted(this.data);
  runner.onHookCompleted(this.data);
};

Test.prototype.testCompleteHook = function(runner) {
  runner.onHookStarted(this.data);
  runner.onTestCompleted(this.data);
  runner.onHookCompleted(this.data);
};

Test.prototype.getHooks = function() {
  var hooks = this.getBeforeEachHooks()
      .concat([this.handler])
      .concat(this.getAfterEachHooks());

  hooks = this.wrapHooks(hooks);

  hooks.unshift(this.testStartHook.bind(this));
  hooks.push(this.testCompleteHook.bind(this));

  return hooks;
};

Test.DEFAULT_NAME = DEFAULT_NAME;
Test.DEFAULT_HANDLER = DEFAULT_HANDLER;

module.exports = Test;

