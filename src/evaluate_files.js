const evaluateFile = require('./evaluate_file');
const readFile = require('./read_file');

/**
 * Read and evaluate the test files identified by the filenames collection.
 */
function evaluateFiles(sandbox, filenames) {
  return Promise.all(filenames.map((filename) => {
    return readFile(filename)
      .then((content) => {
        return evaluateFile(sandbox, content, filename);
      });
  }));
};

module.exports = evaluateFiles;
