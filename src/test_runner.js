const BaseReporter = require('./base_reporter');
const BddInterface = require('./bdd_interface');
const evaluateFiles = require('./evaluate_files');
const executeHooks = require('./execute_hooks');
const findFiles = require('./find_files');

const DEFAULT_OPTIONS = {
  testDirectory: 'test',
  testExpression: /.*_test.js/,
};

/**
 * Load and run the tests that are associated with the provided test loaders.
 */
class TestRunner {
  constructor(opt_options) {
    this._options = Object.assign(DEFAULT_OPTIONS, opt_options || {});
    this._reporter = new BaseReporter();
    this._interface = new BddInterface();
  }

  /**
   * Load all loaders in parallel and wait for all files to be loaded and
   * evaluated.
   */
  run() {
    const opts = this._options;

    // TODO(lbayes): Spread execution across multiple child processes.
    return findFiles(opts.testExpression, opts.testDirectory)
      .then((fileAndStats) => {
        return evaluateFiles(this._interface.toSandbox(), fileAndStats);
      })
      .then(() => {
        return executeHooks(this._interface.getRoot());
      });
  }
}

module.exports = TestRunner;

