const Emitter = require('./emitter');
const Hook = require('./hook');
const events = require('./events');

class BaseReporter extends Emitter {
  constructor(stdout, stderr) {
    super();
    this._stdout = stdout;
    this._stderr = stderr;

    this._passingCount = 0;
    this._passed = [];
    this._failed = [];
    this._skipped = [];
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
    if (result.error) {
      this.onHookError(result);
    } else if (result.hook.isPending) {
      this.onHookSkipped(result);
    } else if (result.failure) {
      this.onHookFailure(result);
    } else if (result.hook.type === Hook.Types.Test) {
      this.onTestPass(result);
    }
  }

  onTestPass(result) {
    this._passed.push(result);
    this._stdout.write('.');
  }

  onHookSkipped(result) {
    this._skipped.push(result);
    this._stout.write(',');
  }

  onHookFailure(result) {
    this._failed.push(result);
    this._stdout.write('x');
  }

  onHookError(result) {
    this._errors.push(result);
    this._stdout.write('X');
  }

  onAfterEach(test) {
  }

  onAfterSuite(suite) {
  }

  onEnd() {
    this._durationMs = (new Date().getTime()) - this._startTimeMs;
    this._stdout.write('\n\n');
    this._stdout.write(`${this._passingCount} passing (${this._durationMs}ms)\n`);

    const passedCount = this._passed.length;
    const failedCount = this._failed.length;
    const skippedCount = this._skipped.length;
    const count = passedCount + failedCount + skippedCount;

    if (failedCount > 0) {
      this._stdout.write(`${failedCount} failing\n`);
    }
    if (skippedCount > 0) {
      this._stdout.write(`${skippedCount} skipped\n`);
    }

    this._printErrors();
    this._printFailures();
  }

  getResults() {
    return this._results;
  }

  _printErrors() {
    this._errors.forEach((result) => {
      this._stderr.write('\n');
      this._stderr.write('ERROR: ' + result.hook.getFullLabel() + '\n');
      this._stderr.write(result.error + '\n');
    });
  }

  _printFailures() {
    this._failed.forEach((result) => {
      this._stderr.write('\n');
      this._stderr.write('FAILURE: ' + result.hook.getFullLabel() + '\n');
      this._stderr.write(result.failure + '\n');
    });
  }
}

module.exports = BaseReporter;
