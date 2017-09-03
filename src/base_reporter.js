const Emitter = require('./emitter');
const events = require('./events');

class BaseReporter extends Emitter {
  constructor(stdout, stderr) {
    super();
    this._stdout = stdout;
    this._stderr = stderr;
    this._results = [];

    this._passingCount = 0;
    this._failures = [];
    this._startTimeMs = 0;
    this._durationMs = 0;
    this._startTimeMs = new Date().getTime();
    this._configureListeners();
  }

  _configureListener(eventName, handler) {
    this.on(eventName, handler.bind(this));
  }

  _configureListeners() {
    this._configureListener(events.START, this.onStart);
    this._configureListener(events.TEST_BEGIN, this.onTestBegin);
    this._configureListener(events.TEST_PASS, this.onTestPass);
    this._configureListener(events.TEST_FAIL, this.onTestFail);
    this._configureListener(events.END, this.onEnd);
  }

  onLoadFiles() {
  }

  onStart(suite) {
    // this._stdout.write('onStart\n');
  }

  onBefore(suite) {
  }

  onAfter(suite) {
  }

  onBeforeEach(test) {
  }

  onSuite(suite) {
  }

  onTestBegin(suite) {
  }

  onTestPass(test) {
    this._results.push(test);
    this._passingCount++;
    // TODO(lbayes): Get test duration.
    this._stdout.write('.');
  }

  onTestFail(test) {
    this._failures.push(test);
    this._stderr.write('\n');
    this._stderr.write('FAILURE: ' + test.getFullLabel());
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
