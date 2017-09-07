
const events = {
  HOOK_BEGIN: 'HookBegin',
  HOOK_COMPLETE: 'HookComplete',


  AFTER: 'After',
  AFTER_BEGIN: 'AfterBegin',
  AFTER_EACH: 'AfterEach',
  AFTER_EACH_BEGIN: 'AfterEachBegin',
  AFTER_EACH_END: 'AfterEachEnd',
  AFTER_END: 'AfterEnd',
  BEFORE: 'Before',
  BEFORE_BEGIN: 'BeforeBegin',
  BEFORE_EACH: 'BeforeEach',
  BEFORE_EACH_BEGIN: 'BeforeEachBegin',
  BEFORE_END: 'BeforeEnd',
  END: 'End',
  ERROR: 'Error',
  FORK_BEGIN: 'ForkBegin',
  FORK_END: 'ForkEnd',
  RUNNER_BEGIN: 'RunnerBegin',
  RUNNER_END: 'RunnerEnd',
  START: 'Start',
  SUITE: 'Suite',
  SUITE_BEGIN: 'SuiteBegin',
  SUITE_END: 'SuiteEnd',
  TEST: 'Test',
  TEST_BEGIN: 'TestBegin',
  TEST_FAIL: 'TestFail',
  TEST_ERROR: 'TestError',
  TEST_PASS: 'TestPass',
  TEST_TIMEOUT: 'TestTimeout',
};

module.exports = events;
