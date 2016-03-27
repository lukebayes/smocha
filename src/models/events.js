/**
 * The Runner is also an EventEmitter that will provide a stream of
 * notifications as tests are executed. Reporters, printers or other clients
 * may listen to this event stream. Each event will be accompanied by a
 * TestData object. The TestData object is defined in `src/models/test.js`.
 */
module.exports = {
  /**
   * Overall TestRunner has started execution.
   */
  STARTED: 'started',

  /**
   * Suite execution has begun.
   */
  SUITE_STARTED: 'suiteStarted',

  /**
   * A before, beforeEach, after or afterEach hook has begun.
   */
  HOOK_STARTED: 'hookStarted',

  /**
   * A before, beforeEach, after or afterEach hook has begun.
   */
  HOOK_ENDED: 'hookEnded',

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
   * A test method has finished execution and passed.
   */
  TEST_PASSED: 'testPassed',

  /**
   * A test method has finished execution and failed.
   */
  TEST_FAILED: 'testFailed',

  /**
   * A test method has completed execution.
   */
  TEST_ENDED: 'testEnded',

  /**
   * A Suite has completed execution.
   */
  SUITE_ENDED: 'suiteEnded',

  /**
   * Overall TestRunner has completed execution.
   */
  ENDED: 'ended'
};

