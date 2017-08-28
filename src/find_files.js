const eachFileMatching = require('fileutils').eachFileMatching;
const path = require('path');

const DEFAULT_EXPRESSION = /.*_test.js/;
const DEFAULT_DIRECTORY = 'test';

/**
 * Get all matching files and stats as an array of objects that are sorted with
 * the most recently modified files first.
 *
 * Subsequent processes will read these files buffers and execute the tests.
 */
function findFiles(opt_expressionStr, opt_directory) {
  let expr;
  if (opt_expressionStr) {
    expr = opt_expressionStr instanceof RegExp ? opt_expressionStr : new RegExp(opt_expressionStr);
  } else {
    expr = DEFAULT_EXPRESSION;
  }

  const dir = opt_directory || DEFAULT_DIRECTORY;

  return new Promise((resolve, reject) => {
    eachFileMatching(expr, dir, null, function completeHandler(err, fileAndStats, stats) {
      if (err) return reject(err);
      const results = fileAndStats.map((file, index) => {
        return {
          filename: path.resolve(file),
          stat: stats[index],
        };
      }).sort((a, b) => {
        return b.stat.mtimeMs - a.stat.mtimeMs;
      });
      resolve(results);
    });
  });
}

module.exports = findFiles;
