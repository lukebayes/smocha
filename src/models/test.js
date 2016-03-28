var Composable = require('./composable');
var Iterator = require('../array_iterator');
var util = require('util');

// TODO(lbayes): Is this the thinnest, simplest promise library?
var Promise = require('promise');

var DEFAULT_HANDLER = function() {};
var DEFAULT_NAME = 'Default Name';
var DEFAULT_TIMEOUT = 2000;
var SKIP_IF_FAILED = true;

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

Test.prototype.isPending = function() {
  return this.data.status === Status.PAUSED;
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
 * Some async hooks are written to expect a `done` method. Promisify these hooks
 * for consistent execution.
 */
Test.prototype.wrapCallbackHook = function(hook) {
  var self = this;

  return function() {
    return new Promise(function(fulfill, reject) {
      var done = function(err) {
        if (err) {
          reject(err);
          return;
        }

        fulfill();
      };

      hook.call(self.context, done)
    });
  };
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
 * executed quickly.
 *
 * Async Callback hooks expect a `done()` function as the only argument. This
 * function will be called whenever the hook is complete. If the hook calls the
 * function with a non-null argument, this is treated as an error and the
 * provided argument is expected to be an Error object.
 *
 * Async Promise hooks return a promise when called and should fulfill or
 * reject the promise to indicate success or failure. Rejections should include
 * a helpful Error to make debugging easier.
 *
 * We also need the Runner to emit events to notify Reporters during test
 * progress.
 */
Test.prototype.wrapHook = function(hook, skipIfFailed) {
  var self = this;
  var data = this.data;

  return function(runner) {
    try {
      if (hook.length === 1) {
        // We have a callback-style async hook, promisify it.
        hook = self.wrapCallbackHook(hook);
      }

      if (skipIfFailed && data.failure) {
        // We have encountered an existing failure, and this hook has been
        // identified as one that should NOT be executed if there was a previous
        // failure (before, beforeEach and it). Other subsequently-configured
        // hooks will likely be executed (after, afterEach).
        runner.onHookSkipped(data);
        runner.onHookCompleted(data);
        return;
      }

      var promise = hook.call(self.context);

      if (promise) {
        // We have a Promise hook, notify the runner.
        // TODO(lbayes): Set a timer to support too-long runtimes.
        runner.onHookPaused(data);

        // Manage responses from a promisified hook.
        promise
          .then(function() {
            // Execution has succeeded.
            runner.onHookSucceeded(data);
            runner.onHookCompleted(data);
          })
          .catch(function(err) {
            // Execution has been rejected.
            data.status = Status.FAILED;
            data.failure = err;
            runner.onHookFailed(data);
            runner.onHookCompleted(data);
          });
      } else {
        // We're running synchronously and have succeeded. Proceed immediately.
        runner.onHookSucceeded(data);
        runner.onHookCompleted(data);
      }
    } catch (err) {
      // We have encountered a synchronous failure, disregard async execution
      // status, propagate failure and proceed immediately.
      data.status = Status.FAILED;
      data.failure = err;
      runner.onHookFailed(data);
      runner.onHookCompleted(data);

      // TODO(lbayes): Ensure async responses do not make their way to the
      // runner, which has already moved on.
    }
  };
};

/**
 * Wrap the provided Array of hook functions so that they properly manage
 * asynchronous execution and aggregated iteration.
 */
Test.prototype.wrapHooks = function(hooks, skipIfFailed) {
  return hooks.map(function(hook) {
    return this.wrapHook(hook, skipIfFailed);
  }, this);
};

Test.prototype.testStartedHook = function(runner) {
  // Update the data with name.
  this.data.fullName = this.fullName();

  runner.onHookStarted(this.data);
  runner.onTestStarted(this.data);
  runner.onHookCompleted(this.data);
};

Test.prototype.testCompletedHook = function(runner) {
  if (this.data.failure) {
    runner.onTestFailed(this.data);
  } else {
    this.data.status = Status.SUCCEEDED;
    runner.onTestSucceeded(this.data);
  }

  runner.onHookStarted(this.data);
  runner.onTestCompleted(this.data);
  runner.onHookCompleted(this.data);
};

Test.prototype.getHooks = function() {
  // TODO(lbayes): Insert hooks that check and clear the global environment.

  // Wrap the before hooks with general wrapper.
  var hooks = this.wrapHooks(this.getBeforeEachHooks(), SKIP_IF_FAILED);
  // Wrap the test method with a special wrapper.
  hooks.push(this.wrapHook(this.handler, SKIP_IF_FAILED));
  // Wrap the after hooks with general wrapper.
  hooks = hooks.concat(this.wrapHooks(this.getAfterEachHooks()));

  // Insert the test start hook.
  hooks.unshift(this.testStartedHook.bind(this));

  // Insert the test completed hook.
  hooks.push(this.testCompletedHook.bind(this));

  return hooks;
};

Test.Status = Status;

Test.DEFAULT_HANDLER = DEFAULT_HANDLER;

module.exports = Test;

