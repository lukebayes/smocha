
const events = {
  AFTER_BEGIN: 'AfterBegin',
  AFTER_EACH_BEGIN: 'AfterEachBegin',
  AFTER_EACH_END: 'AfterEachEnd',
  AFTER_END: 'AfterEnd',
  BEFORE_BEGIN: 'BeforeBegin',
  BEFORE_EACH_BEGIN: 'BeforeEachBegin',
  BEFORE_END: 'BeforeEnd',
  ERROR: 'Error',
  FORK_BEGIN: 'ForkBegin',
  FORK_END: 'ForkEnd',
  RUNNER_BEGIN: 'RunnerBegin',
  RUNNER_END: 'RunnerEnd',
  SUITE_BEGIN: 'SuiteBegin',
  SUITE_END: 'SuiteEnd',
  TEST_BEGIN: 'TestBegin',
  TEST_FAIL: 'TestFail',
  TEST_PASS: 'TestPass',
  TEST_TIMEOUT: 'TestTimeout',
};

module.exports = events;
