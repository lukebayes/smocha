
var suiteToGlobals = function(suite) {
  return {
    after: suite.onAfter.bind(suite),
    afterEach: suite.onAfterEach.bind(suite),
    before: suite.onBefore.bind(suite),
    beforeEach: suite.onBeforeEach.bind(suite),
    describe: suite.onSuite.bind(suite),
    it: suite.onTest.bind(suite)
  };
};

var updateGlobalsWithSuiteKeys = function(suite) {
  var globals = suiteToGlobals(suite);
  var originals = {};

  Object.keys(globals).forEach(function(key) {
    originals[key] = global[key];
    global[key] = globals[key];
  });

  return originals;
};


var resetGlobalKeys = function(globals) {
  if (globals) {
    Object.keys(globals).forEach(function(key) {
      // TODO(lbayes): Delete if necessary.
      global[key] = globals[key];
    });
  }
};

module.exports = function(file, suite, opt_completeHandler) {
  var globals = updateGlobalsWithSuiteKeys(suite);
  var error = null;

  try {
    require(file);
  } catch (err) {
    error = err;
  } finally {
    resetGlobalKeys(globals);
    opt_completeHandler && opt_completeHandler(error, suite);
  }

};

