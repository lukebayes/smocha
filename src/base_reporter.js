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
    this._startTimeMs = new Date().getTime();
  }

  onHookComplete(result) {
    if (result.error) {
      this._onHookError(result);
    } else if (result.failure) {
      this._onHookFailure(result);
    } else if (result.hook.isPending) {
      this._onHookSkipped(result);
    } else if (result.hook.type === Hook.Types.Test) {
      this._onTestPass(result);
    }
  }

  _onTestPass(result) {
    this._passed.push(result);
    this._stdout.write('.');
  }

  _onHookSkipped(result) {
    this._skipped.push(result);
    this._stdout.write(',');
  }

  _onHookFailure(result) {
    this._failed.push(result);
    this._stdout.write('x');
  }

  _onHookError(result) {
    this._errors.push(result);
    this._stdout.write('X');
  }

  onStart() {
    this._stdout.write('\n');
  }

  getResults() {
    return this._results;
  }

  _printErrors() {
    this._errors.forEach((result) => {
      this._stderr.write('\n');
      this._stderr.write('ERROR: ' + result.hook.getFullLabel() + '\n');
      this._stderr.write(result.error.stack);
      this._stderr.write('\n');
    });
  }

  _printFailures() {
    this._failed.forEach((result) => {
      this._stderr.write('\n');
      this._stderr.write('FAILURE: ' + result.hook.getFullLabel() + '\n');
      this._stderr.write(result.failure.stack);
      this._stderr.write('\n');
    });
  }

  onEnd() {
    const passedCount = this._passed.length;
    const failedCount = this._failed.length;
    const skippedCount = this._skipped.length;
    const count = passedCount + failedCount + skippedCount;
    const duration = (new Date().getTime()) - this._startTimeMs;

    this._stdout.write('\n\n');
    this._stdout.write(`${passedCount} passing (${duration}ms)\n`);

    if (failedCount > 0) {
      this._stdout.write(`${failedCount} failing\n`);
    }
    if (skippedCount > 0) {
      this._stdout.write(`${skippedCount} skipped\n`);
    }

    this._printErrors();
    this._printFailures();

    this._stdout.write('\n');
  }
}

module.exports = BaseReporter;
