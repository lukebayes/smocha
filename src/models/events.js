/**
 * The Runner is also an EventEmitter that will provide a stream of
 * notifications as tests are executed. Reporters, printers or other clients
 * may listen to this event stream. Each event will be accompanied by a
 * TestData object. The TestData object is defined in `src/models/test.js`.
 */
module.exports = {
  /**
   * A test file has been discovered.
   */
  FILE_DISCOVERED: 'fileDiscovered',

  /**
   * A Suite has been discovered,
   */
  SUITE_DISCOVERED: 'suiteDiscovered',

  /**
   * A Test method has been discovered.
   */
  TEST_DISCOVERED: 'testDiscovered',

  /**
   * Overall Runner has started execution.
   */
  RUNNER_STARTED: 'runnerStarted',

  /**
   * Suite execution has begun.
   */
  SUITE_STARTED: 'suiteStarted',

  /**
   * A before, beforeEach, after or afterEach hook has begun.
   */
  HOOK_STARTED: 'hookStarted',

  /**
   * A before, beforeEach, after or afterEach hook has paused.
   */
  HOOK_PAUSED: 'hookPaused',

  /**
   * A before, beforeEach, after or afterEach hook has succeeded.
   */
  HOOK_SUCCEEDED: 'hookSucceeded',

  /**
   * A before, beforeEach, after or afterEach hook has skipped.
   */
  HOOK_SKIPPED: 'hookSkipped',

  /**
   * A before, beforeEach, after or afterEach hook has failed.
   */
  HOOK_FAILED: 'hookFailed',

  /**
   * A before, beforeEach, after or afterEach hook has begun.
   */
  HOOK_COMPLETED: 'hookCompleted',

  /**
   * Execution has paused due to an asynchronous response from a hook or test.
   */
  RUN_PAUSED: 'testPaused',

  /**
   * Execution has resumed from a paused state.
   */
  RUN_RESUMED: 'testResumed',

  /**
   * A test method has begun execution.
   */
  TEST_STARTED: 'testStarted',

  /**
   * A test method has finished execution and succeeded.
   */
  TEST_SUCCEEDED: 'testSucceeded',

  /**
   * A test method has finished execution and failed.
   */
  TEST_FAILED: 'testFailed',

  /**
   * A test method has completed execution.
   */
  TEST_COMPLETED: 'testCompleted',

  /**
   * A Suite has completed execution.
   */
  SUITE_COMPLETED: 'suiteCompleted',

  /**
   * Overall Runner has completed execution.
   */
  RUNNER_COMPLETED: 'runnerCompleted'
};

