var Test = require('./test'),
    util = require('util');

var Suite = function(name, fn) {
  Test.call(this, name);
  this._fn = fn;
};

util.inherits(Suite, Test);

module.exports = Suite;

