var Composable = require('./composable'),
    util = require('util');

var Test = function(name, fn) {
  Composable.call(this, name);
  this._fn = fn;
};

Test.prototype.run = function() {
};

util.inherits(Test, Composable);

module.exports = Test;


