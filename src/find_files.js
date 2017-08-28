const eachFileMatching = require('fileutils').eachFileMatching;

const DEFAULT_EXPRESSION = /.*_test.js/;
const DEFAULT_DIRECTORY = 'test';

function findFiles(opt_expressionStr, opt_directory) {
  const expr = opt_expressionStr ? new RegExp(opt_expressionStr) : DEFAULT_EXPRESSION;
  const dir = opt_directory || DEFAULT_DIRECTORY;

  return new Promise((resolve, reject) => {
    function completeHandler(err, files, stats) {
      console.log('COMPLETE HANDER!!!!!!!!!!!!!!');
      if (err) return reject(err);

      resolve({
        files,
        stats,
      });
    }

    eachFileMatching(expr, dir, function(err, file, stat) {
      console.log('>>>>>>>>>>> >YOOOOOOOO:', stat);
      /*
      if (err) {
        reject(err);
      } else {
        resolve({
          files,
          stats,
          contents,
        });
      }
      */
    }, completeHandler);
  });
}

module.exports = findFiles;
