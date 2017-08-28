const evaluateFile = require('./evaluate_file');
const readFile = require('./read_file');

/**
 * Read and evaluate the test files identified by the fileAndStats collection.
 */
function evaluateFiles(sandbox, fileAndStats) {
  return Promise.all(fileAndStats.map((fileAndStat) => {
    return readFile(fileAndStat.filename)
      .then((content) => {
        return evaluateFile(sandbox, content, fileAndStat.filename);
      });
  }));
};

module.exports = evaluateFiles;
