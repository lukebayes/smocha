const BaseReporter = require('./base_reporter');
const BddInterface = require('./bdd_interface');
const evaluateFiles = require('./evaluate_files');
const delegateEvents = require('./delegate_events');
const executeHooks = require('./execute_hooks');
const findFiles = require('./find_files');
const hooks = require('./hooks');

const DEFAULT_OPTIONS = {
  testDirectory: 'test',
  testExpression: /.*_test.js/,
  stdout: process.stdout,
  stderr: process.stderr,
};

/**
 * Load and run the tests that are associated with the provided test loaders.
 */
class TestRunner {
  constructor(opt_options, opt_reporter, opt_interface) {
    this._options = Object.assign(DEFAULT_OPTIONS, opt_options || {});

    this._interface = opt_interface || new BddInterface();
    this._reporter = opt_reporter || new BaseReporter(this._options.stdout, this._options.stderr);
    delegateEvents(this._interface, this._reporter);
  }

  /**
   * Load all loaders in parallel and wait for all files to be loaded and
   * evaluated.
   */
  run() {
    const opts = this._options;

    function onProgress(result) {
      const hook = result;
      if (hook instanceof hooks.Test) {
        if (result.failure) {
          reporter.onTestFail(hook);
        } else if (result.error) {
          reporter.onTestError(hook);
        } else {
          reporter.onTestPass(hook);
        }
      }
    };

    // TODO(lbayes): Spread execution across multiple child processes.
    return findFiles(opts.testExpression, opts.testDirectory)
      .then((fileAndStats) => {
        return evaluateFiles(this._interface.toSandbox(), fileAndStats);
      })
      .then(() => {
        return executeHooks(this._interface.getRoot(), onProgress);
      });
  }
}

module.exports = TestRunner;

