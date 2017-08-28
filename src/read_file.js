const fs = require('fs');

/**
 * Read the content of the provided filename and return it in a promise.
 */
function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', function(err, contents) {
      if (err) return reject(err);
      resolve(contents);
    });
  });
};

module.exports = readFile;
