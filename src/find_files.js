const readEachFileMatching = require('fileutils').readEachFileMatching;

const DEFAULT_EXPRESSION = /.*_test.js/;
const DEFAULT_DIRECTORY = 'test';

function findFiles(opt_expressionStr, opt_directory) {
  const expr = opt_expressionStr ? new RegExp(opt_expressionStr) : DEFAULT_EXPRESSION;
  const dir = opt_directory || DEFAULT_DIRECTORY;

  return new Promise((resolve, reject) => {
    function completeHandler(err, files, stats, contents) {
      if (err) {
        reject(err);
      } else {
        resolve({
          files,
          stats,
          contents,
        });
      }
    }

    readEachFileMatching(expr, dir, function(err, file, stat, content) {
      console.log('>>>>>>>>>>> >YOOOOOOOO:', content);
      console.log(content);
      console.log('complete handler!', contents);
      if (err) {
        reject(err);
      } else {
        resolve({
          files,
          stats,
          contents,
        });
      }
    }, completeHandler);
  });
}

module.exports = findFiles;
