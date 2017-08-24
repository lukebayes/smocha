const TestFile = require('./test_file');
const fs = require('fs');

/**
 * Loads the file and returns an executor that is bound to the provided
 * definitions.
 */
class NodeLoader {
  constructor(file, runner) {
    this.file = file;
    this.runner = runner;
  }

  load() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(new TestFile(this.file, data.toString()));
        }
      });
    });
  }
}

module.exports = NodeLoader;
