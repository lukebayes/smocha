
/**
 * Run
 */
var TestRunner = function(testOrSuite) {
  this._test = testOrSuite;
};

TestRunner.prototype.run = function() {
};

TestRunner.create = function(testOrSuite) {
  return new TestRunner(testOrSuite);
};

module.exports = TestRunner;

