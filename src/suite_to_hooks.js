const Hook = require('./hook');
const nullFunction = require('./null_function');

/**
 * Get a list of beforeEach hooks that has the deepest declaration first and
 * the nearest one last.
 */
function getBeforeEachesFor(suite) {
  let current = suite;
  let hooks = [];

  while (current) {
    hooks = current.getBeforeEaches().concat(hooks);
    current = current.parent;
  }

  return hooks;
}

/**
 * Get a list of afterEach hooks that has the nearest declaration first and
 * the deepest one last.
 */
function getAfterEachesFor(suite) {
  let current = suite;
  let hooks = [];

  while (current) {
    hooks = hooks.concat(current.getAfterEaches());
    current = current.parent;
  }

  return hooks;
}

/**
 * Recursively transform the provided Suite (and it's children) into a tree of
 * executable Hooks.
 */
function suiteToHooks(suite) {
  const result = suite.clone();
  if (suite.tests.length > 0 || suite.suites.length > 0) {

    suite.befores.forEach((hook) => {
      result.addChild(hook.clone());
    });

    suite.tests.forEach((test) => {
      getBeforeEachesFor(suite).forEach((hook) => {
        result.addChild(hook.clone());
      });

      result.addChild(test.clone());

      getAfterEachesFor(suite).forEach((hook) => {
        result.addChild(hook.clone());
      });
    });

    suite.suites.forEach((childSuite) => {
      result.addChild(suiteToHooks(childSuite));
    });
  }

  return result;
}

module.exports = suiteToHooks;
