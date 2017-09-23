const BaseReporter = require('./base_reporter');
const BddInterface = require('./bdd_interface');
const Hook = require('./hook');
const delegateEvents = require('./delegate_events');
const evaluateFiles = require('./evaluate_files');
const events = require('./events');
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
 * Load and run the tests that are associated with the provided test loaders.
 */
class TestRunner {
  constructor(opt_options, opt_reporter, opt_interface) {
    this._options = Object.assign(DEFAULT_OPTIONS, opt_options || {});
    this._interface = opt_interface || new BddInterface();
  }

  /**
   * Load all loaders in parallel and wait for all files to be loaded and
   * evaluated.
   */
  run() {
    const opts = this._options;
    const currentInterface = this._interface;
    const reporter = opts.reporter || new BaseReporter(opts.stdout, opts.stderr);
    reporter.onStart();

    // TODO(lbayes): Spread execution across multiple child processes.
    return findFiles(opts.testExpression, opts.testDirectory)
      .then((fileAndStats) => {
        return evaluateFiles(currentInterface.toSandbox(), fileAndStats);
      })
      .then(() => {
        const rootSuite = suiteToHooks(currentInterface.getRoot());
        rootSuite.on(events.HOOK_COMPLETE, reporter.onHookComplete.bind(reporter));
        return executeHooks(rootSuite, reporter);
      })
      .then((results) => {
        reporter.onEnd();
        return results;
      });
  }
}

module.exports = TestRunner;

