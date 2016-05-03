require('/home/lukebayes/Projects/krypton/experimental/test/bootstrap.js');
require('/home/lukebayes/Projects/krypton/experimental/modules/browser/kr-react/bootstrap.js');

var FileRunner = require('./file_runner');
var files = require('./files');
var path = require('path');

var Smocha = function(options) {
  this._options = options;
};

Smocha.prototype.run = function() {
  console.log('running now!');
  this._options.files && this._options.files.forEach(function(file) {
    console.log('file:', file);
    var runner = new FileRunner();
    runner.runFile(path.resolve(file), function(err, status) {
      if (err) {
        console.log('ERRR:', err.stack);
      }
      console.log('FINISHED:', file);
    });
  });
};

module.exports = Smocha;


if (require.main === module) {
  files.scan('modules/common/kr-utils/test/*_test.js', function(err, result) {
    var instance = new Smocha({files: result.paths});
    instance.run();
  });
}
