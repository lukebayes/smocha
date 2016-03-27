
var Status = {
  FAILED: 'failed',
  INITIALIZED: 'initialized',
  SKIPPED: 'skipped',
  STARTED: 'started',
  SUCCEEDED: 'succeeded'
};

var TestData = function(fullName, opt_status, opt_failure) {
  this.fullName = fullName;
  this.status = opt_status || Status.INITIALIZED;
  this.failure = opt_failure || null;

  // Timings
  this.preHooksStartNs = null;
  this.testStartNs = null;
  this.testEndNs = null;
  this.postHooksStartNs = null;

  this.cumulativeDurationNs = null;
};

TestData.Status = Status;

module.exports = TestData;

