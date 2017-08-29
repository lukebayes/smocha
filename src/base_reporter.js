
class BaseReporter {
  constructor(stdout, stderr) {
    this._stdout = stdout;
    this._stderr = stderr;
    this._results = [];

    this._passingCount = 0;
    this._failures = [];
    this._startTimeMs = 0;
    this._durationMs = 0;
  }

  onStart(suite) {
    this._startTimeMs = new Date().getTime();

  }

  onBefore(suite) {
  }

  onAfter(suite) {
  }

  onBeforeEach(test) {
  }

  onSuite(suite) {
  }

  onTest(suite) {
  }

  onPass(test) {
    // TODO(lbayes): Get test duration.
    this._stdout.write('.');
    this._results.push(test);
    this._passingCount++;
  }

  onFail(test) {
  }

  onPending(test) {
  }

  onAfterEach(test) {
  }

  onAfterSuite(suite) {
  }

  onEnd() {
    this._durationMs = (new Date().getTime()) - this._startTimeMs;
    this._stdout.write('\n');
    this._stdout.write(`${this._passingCount} passing (${this._durationMs}ms)\n`);
  }

  getResults() {
    return this._results;
  }
}

module.exports = BaseReporter;
