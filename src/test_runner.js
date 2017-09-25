const BaseReporter = require('./base_reporter');
const BddInterface = require('./bdd_interface');
const Hook = require('./hook');
const Iterator = require('./iterator');
const evaluateFiles = require('./evaluate_files');
const executeHooks = require('./execute_hooks');
const childProcess = require('child_process');
const chunk = require('./chunk');
const findFiles = require('./find_files');
const os = require('os');
const suiteToHooks = require('./suite_to_hooks');

const DEFAULT_OPTIONS = {
  coreCount: 4,
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


function getWorkerCount(files, opt_coreCount) {
  return Math.min(files.length, opt_coreCount || os.cpus().length);
}

function createWorkersFor(files, opt_coreCount) {
  const workPool = [];
  let workerCount = getWorkerCount(files, opt_coreCount);
  console.log('workerCount:', workerCount);
  while (workerCount > 0) {
    const child = childProcess.fork('./bin/smocha_child');
    workPool.push(child);
    workerCount--;
  }
  return workPool;
}

function spreadExecution(workPool, iterator, onHookComplete) {
  let activeWorkerCount = workPool.length;
  console.log('WORKERS:', activeWorkerCount);

  return new Promise((resolve, reject) => {
    workPool.forEach((child) => {
      child.on('error', (err) => {
        console.log('CHILD ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!:', err);
      });
      child.on('message', (payload) => {
        // console.log('CHILD MESSAGE RECEIVED:', payload);
        switch (payload.type) {
          case 'HookComplete':
            onHookComplete(payload.result);
            break;
          case 'Ready':
          case 'FileComplete':
            if (iterator.hasNext()) {
              child.send({type: 'Execute', filename: iterator.next()});
            } else {
              if (activeWorkerCount > 0) {
                child.disconnect();
                activeWorkerCount--;
              }

              if (activeWorkerCount === 0) {
                // Now we're really done!
                resolve();
              }
            }
            break;
        }
      });
    });
  });
}

// TODO(lbayes): Heading somewhere like this...
// chunk(filenames).forEach((chunk) => {
  // execChildWith(chunk);
// });

// const currentInterface = new BddInterface();
// TODO(lbayes): Spread execution across multiple child processes.
// return evaluateFiles(currentInterface, filenames);
// .then((rootSuite) => {
// return executeHooks(suiteToHooks(rootSuite), onHookComplete);
// })

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
    const reporter = opts.reporter || new BaseReporter(opts.stdout, opts.stderr);
    reporter.onStart();

    const onHookComplete = reporter.onHookComplete.bind(reporter);

    return findFiles(opts.testExpression, opts.testDirectory)
      .then((filenames) => {
        const pool = createWorkersFor(filenames, opts.coreCount);
        return spreadExecution(pool, new Iterator(filenames), onHookComplete);
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

