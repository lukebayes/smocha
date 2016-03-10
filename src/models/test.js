var Composable = require('./composable'),
    util = require('util');

var DEFAULT_NAME = 'Default Name',
    DEFAULT_HANDLER = function() {};

var Test = function(nameOrHandler, opt_handler) {
  var name;

  if (opt_handler) {
    name = nameOrHandler;
    this.handler = opt_handler;
  } else if (typeof nameOrHandler === 'function') {
    name = DEFAULT_NAME;
    this.handler = nameOrHandler;
  } else if (typeof nameOrHandler === 'string') {
    name = nameOrHandler;
    this.handler = DEFAULT_HANDLER;
  }

  Composable.call(this, name);
};

util.inherits(Test, Composable);

Test.prototype.beforeRun = function() {
  // run ancestral beforeEach blocks
};

Test.prototype.run = function() {
  // run handler
  this.handler.call({});
};

Test.prototype.afterRun = function() {
  // run ancestral afterEach blocks
};

Test.DEFAULT_NAME = DEFAULT_NAME;
Test.DEFAULT_HANDLER = DEFAULT_HANDLER;

module.exports = Test;


