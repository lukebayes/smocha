const BaseReporter = require('./base_reporter');
const BddInterface = require('./bdd_interface');
const Hook = require('./hook');
const evaluateFiles = require('./evaluate_files');
const executeHooks = require('./execute_hooks');
const findFiles = require('./find_files');
const suiteToHooks = require('./suite_to_hooks');

const DEFAULT_OPTIONS = {
  testDirectory: 'test',
  testExpression: /.*_test.js/,
  stdout: process.stdout,
  stderr: process.stderr,
};

/**
 * Sort function to sort file stat objects on modified time.
 */
function mtimeSort(stat) {
  return stat.mtimeMs;
}

/**
 * Load and run the tests that are associated with the provided test loaders.
 */
class TestRunner {
  constructor(opt_options, opt_reporter) {
    this._options = Object.assign(DEFAULT_OPTIONS, opt_options || {});
  }

  /**
   * Load all loaders in parallel and wait for all files to be loaded and
   * evaluated.
   */
  run() {
    const opts = this._options;
    const currentInterface = new BddInterface();
    const reporter = opts.reporter || new BaseReporter(opts.stdout, opts.stderr);
    reporter.onStart();

    return findFiles(opts.testExpression, opts.testDirectory)
      .then((filenames) => {
        // TODO(lbayes): Spread execution across multiple child processes.
        return evaluateFiles(currentInterface.toSandbox(), filenames);
      })
      .then(() => {
        return executeHooks(suiteToHooks(currentInterface.getRoot()), (result) => {
          reporter.onHookComplete(result);
        });
      })
      .catch((err) => {
        reporter.onError(err);
      })
      .then((results) => {
        reporter.onEnd();
        return results;
      });
  }
}

module.exports = TestRunner;

