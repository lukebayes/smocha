const evaluateFile = require('./evaluate_file');
const readFile = require('./read_file');

/**
 * Read and evaluate the test files identified by the filenames collection.
 */
function evaluateFiles(testInterface, filenames) {
  const sandbox = testInterface.toSandbox();
  return Promise.all(filenames.map((filename) => {
    return readFile(filename)
      .then((content) => {
        return evaluateFile(sandbox, content, filename);
      });
  }))
  .then(() => {
    // Return the root suite to the waiting promise.
    return testInterface.getRoot();
  });
};

module.exports = evaluateFiles;
