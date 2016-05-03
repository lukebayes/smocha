'use strict';
var EventEmitter = require('events').EventEmitter;
var Events = require('./models/events');
var Iterator = require('./array_iterator');
var Suite = require('./models/suite');
var TestStatus = require('./models/test').Status;
var defaultUi = require('./default_ui');
var util = require('util');
var vm = require('vm');

class RunnerData {
  constructor() {
    this.hooks = [];
    this.tests = [];

    this.status = TestStatus.INITIALIZED;
    // TODO(lbayes): Update RunnerData.failure to the first found failure if
    // a failure was encountered.
    this.failure = null;
  }
};

/**
 * Runs the provided Test (or Suite) by requesting all execution hooks as a
 * flattened Array and then executing each hook in order until all hooks
 * have been called.
 *
 * @see src/models/events.js For more details about the event stream that the
 *   Runner can emit.
 */
class Runner extends EventEmitter {
  constructor() {
    super();

    this._completeHandler = null;
    this._isStarted = false;
    this.data = new RunnerData();
  }

  /**
   * The runner has begun running.
   */
  onRunnerStarted() {
    // NOTE(lbayes): Subclasses (like FileRunner) may call this before calling
    // runTest, so we need to support calling this method more than once and
    // ensure we do not emit the event more than once.
    if (!this._isStarted) {
      this._isStarted = true;
      this.emit(Events.RUNNER_STARTED);
    }
  }

  /**
   * All Suites insert a hook at the beginning to notify the runner when they have
   * started.
   */
  onSuiteStarted(suiteData) {
    this.emit(Events.SUITE_STARTED, suiteData);
  }

  /**
   * All Suites insert a hook at the end to notify the runner when they are
   * complete.
   */
  onSuiteCompleted(suiteData) {
    this.emit(Events.SUITE_COMPLETED, suiteData);
  }

  /**
   * All Tests insert a hook at the beginning to notify the runner when they have
   * started.
   */
  onTestStarted(testData) {
    this.emit(Events.TEST_STARTED, testData);
  }


  onTestFailed(testData) {
    this.emit(Events.TEST_FAILED, testData);
  }

  onTestSucceeded(testData) {
    this.emit(Events.TEST_SUCCEEDED, testData);
  }

  /**
   * All Tests insert a hook at the end to notify the runner when they are
   * complete.
   */
  onTestCompleted(testData) {
    this.data.tests.push(testData);
    this.emit(Events.TEST_COMPLETED, testData);
  }

  /**
   * All user-defined hooks have been wrapped with functions that call this
   * method on the provided runner. This is how we balance the needs of fast
   * synchronous hooks and more complex asynchronous hooks.
   */
  onHookStarted(hookData) {
    this.emit(Events.HOOK_STARTED, hookData);
  }

  onHookPaused(hookData) {
    this.emit(Events.HOOK_PAUSED, hookData);
  }

  onHookSucceeded(hookData) {
    this.emit(Events.HOOK_SUCCEEDED, hookData);
  }

  onHookFailed(hookData) {
    if (!this.data.failure) {
      this.data.failure = hookData.failure;
      this.data.status = TestStatus.FAILED;
    }
    this.emit(Events.HOOK_FAILED, hookData);
  }

  onHookSkipped(hookData) {
    this.emit(Events.HOOK_SKIPPED, hookData);
  }

  onHookCompleted(hookData) {
    this.data.hooks.push(hookData);
    this.emit(Events.HOOK_COMPLETED, hookData);
    this._runNextHook();
  }

  /**
   * Run all hooks for the provided Test (or Suite which subclasses Test).
   */
  runTest(test, opt_completeHandler) {
    this._completeHandler = opt_completeHandler;
    this.onRunnerStarted();

    this._iterator = new Iterator(test.getHooks());
    this._runNextHook();
  }

  /**
   * Run the next hook by provided a reference to this runner and waiting for the
   * hook to call back into the Runner lifecycle methods before proceeding to the
   * next hook.
   *
   * If there are no more hooks, mark this Runner as completed and notify
   * listeners.
   */
  _runNextHook() {
    var itr = this._iterator;
    if (itr.hasNext()) {
      var hook = itr.next();
      hook(this);
    } else {
      this.emit(Events.RUNNER_COMPLETED, this.data);
      // Call the complete handler if one was provided to the `.run()` call.
      this._completeHandler && this._completeHandler(this.data.failure, this.data);
    }
  }
}

module.exports = Runner;

