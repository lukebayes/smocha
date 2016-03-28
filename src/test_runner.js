var EventEmitter = require('events').EventEmitter;
var Events = require('./models/events');
var Iterator = require('./array_iterator');
var TestStatus = require('./models/test').Status;
var util = require('util');

var TestRunnerData = function() {
  this.hooks = [];
  this.tests = [];

  this.status = TestStatus.INITIALIZED;
  // TODO(lbayes): Update TestRunnerData.failure to the first found failure if
  // a failure was encountered.
  this.failure = null;
};

/**
 * Runs the provided Test (or Suite) by requesting all execution hooks as a
 * flattened Array and then executing each hook in order until all hooks
 * have been called.
 *
 * @see src/models/events.js For more details about the event stream that the
 *   TestRunner can emit.
 */
var TestRunner = function(testOrSuite) {
  EventEmitter.call(this);

  this._test = testOrSuite || null;
  this._string = null;

  this._completeHandler = null;
  this._isStarted = false;
  this.data = new TestRunnerData();
};

util.inherits(TestRunner, EventEmitter);

TestRunner.prototype.withPath = function(path) {
  this._path = path;
  return this;
};

TestRunner.prototype.onRunnerStarted = function() {
  if (this._isStarted) {
    throw new Error('TestRunner can only be run once');
  }
  this._isStarted = true;
  this.emit(Events.RUNNER_STARTED);
};

/**
 * All Suites insert a hook at the beginning to notify the runner when they have
 * started.
 */
TestRunner.prototype.onSuiteStarted = function(suiteData) {
  this.emit(Events.SUITE_STARTED, suiteData);
};

/**
 * All Suites insert a hook at the end to notify the runner when they are
 * complete.
 */
TestRunner.prototype.onSuiteCompleted = function(suiteData) {
  this.emit(Events.SUITE_COMPLETED, suiteData);
};

/**
 * All Tests insert a hook at the beginning to notify the runner when they have
 * started.
 */
TestRunner.prototype.onTestStarted = function(testData) {
  this.emit(Events.TEST_STARTED, testData);
};


TestRunner.prototype.onTestFailed = function(testData) {
  this.emit(Events.TEST_FAILED, testData);
};

TestRunner.prototype.onTestSucceeded = function(testData) {
  this.emit(Events.TEST_SUCCEEDED, testData);
};

/**
 * All Tests insert a hook at the end to notify the runner when they are
 * complete.
 */
TestRunner.prototype.onTestCompleted = function(testData) {
  this.data.tests.push(testData);
  this.emit(Events.TEST_COMPLETED, testData);
};

/**
 * All user-defined hooks have been wrapped with functions that call this
 * method on the provided runner. This is how we balance the needs of fast
 * synchronous hooks and more complex asynchronous hooks.
 */
TestRunner.prototype.onHookStarted = function(hookData) {
  this.emit(Events.HOOK_STARTED, hookData);
};

TestRunner.prototype.onHookPaused = function(hookData) {
  this.emit(Events.HOOK_PAUSED, hookData);
};

TestRunner.prototype.onHookSucceeded = function(hookData) {
  this.emit(Events.HOOK_SUCCEEDED, hookData);
};

TestRunner.prototype.onHookFailed = function(hookData) {
  if (!this.data.failure) {
    this.data.failure = hookData.failure;
    this.data.status = TestStatus.FAILED;
  }
  this.emit(Events.HOOK_FAILED, hookData);
};

TestRunner.prototype.onHookSkipped = function(hookData) {
  this.emit(Events.HOOK_SKIPPED, hookData);
};

TestRunner.prototype.onHookCompleted = function(hookData) {
  this.data.hooks.push(hookData);
  this.emit(Events.HOOK_COMPLETED, hookData);
  this._runNext();
};

TestRunner.prototype._buildTest = function(callback) {
  if (this._test) {
    return callback(null, this._test);
  }

  if (this._path) {
    console.log('YOOOOOOOOOO', this._path);
  }

  if (!this._test) {
    throw new Error('Unable to run tests without test content');
  }
};

TestRunner.prototype.run = function(opt_completeHandler) {
  this._completeHandler = opt_completeHandler;

  this.onRunnerStarted();

  this._buildTest(function(err, test) {
    if (err) {
      this._completeHandler(err);
      return;
    }
    this._iterator = new Iterator(test.getHooks());
    this._runNext();
  }.bind(this));

  // TODO(lbayes): Return a promise too?
};

/**
 * Run the next hook by provided a reference to this runner and waiting for the
 * hook to call back into the Runner lifecycle methods before proceeding to the
 * next hook.
 *
 * If there are no more hooks, mark this Runner as completed and notify
 * listeners.
 */
TestRunner.prototype._runNext = function() {
  var itr = this._iterator;
  if (itr.hasNext()) {
    var hook = itr.next();
    hook(this);
  } else {
    this.emit(Events.RUNNER_COMPLETED, this.data);
    // Call the complete handler if one was provided to the `.run()` call.
    this._completeHandler && this._completeHandler(this.data.failure, this.data);
  }
};

/**
 * Create a new runner with the provided Test or Suite reference.
 */
TestRunner.create = function(testOrSuite) {
  return new TestRunner(testOrSuite);
};

module.exports = TestRunner;

