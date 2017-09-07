const Emitter = require('./emitter');
const Hook = require('./hook');
const events = require('./events');

class BaseReporter extends Emitter {
  constructor(stdout, stderr) {
    super();
    this._stdout = stdout;
    this._stderr = stderr;
    this._results = [];

    this._passingCount = 0;
    this._failures = [];
    this._errors = [];
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
    this._configureListener(events.HOOK_BEGIN, this.onHookBegin);
    this._configureListener(events.HOOK_COMPLETE, this.onHookComplete);
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

  onHookBegin(hook) {
  }

  onHookComplete(result) {
    this._duration += result.duration;

    if (result.hook.error) {
      this.onHookError(result);
    } else if (result.hook.failure) {
      this.onHookFailure(result);
    } else if (result.hook.type === Hook.Types.Test) {
      this.onTestPass(result);
    }
  }

  onHookFailure(result) {
    this._failures.push(result.hook);
    this._stderr.write('\n');
    this._stderr.write('FAILURE: ' + result.hook.getFullLabel() + '\n');
    this._stderr.write(result.failure + '\n');
  }

  onHookError(result) {
    this._errors.push(result.hook);
    this._stderr.write('\n');
    this._stderr.write('ERROR: ' + result.hook.getFullLabel() + '\n');
    this._stderr.write(result.error + '\n');
  }

  onTestPass(result) {
    this._results.push(result.hook);
    this._passingCount++;
    this._stdout.write('.');
  }

  onPending(test) {
  }

  onAfterEach(test) {
  }

  onAfterSuite(suite) {
  }

  onEnd() {
    this._durationMs = (new Date().getTime()) - this._startTimeMs;
    this._stdout.write('\n\n');
    this._stdout.write(`${this._passingCount} passing (${this._durationMs}ms)\n`);
  }

  getResults() {
    return this._results;
  }
}

module.exports = BaseReporter;
