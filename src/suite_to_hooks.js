const Hook = require('./hook');
const nullFunction = require('./null_function');

/**
 * Get a list of beforeEach hooks that has the deepest declaration first and
 * the nearest one last.
 */
function getBeforeEachesFor(suiteDeclaration) {
  let current = suiteDeclaration;
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
function getAfterEachesFor(suiteDeclaration) {
  let current = suiteDeclaration;
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
function suiteToHooks(suiteDeclaration) {
  const result = suiteDeclaration.clone();
  if (suiteDeclaration.tests.length > 0 || suiteDeclaration.suites.length > 0) {

    suiteDeclaration.getBefores().forEach((hook) => {
      result.addChild(hook.clone());
    });

    suiteDeclaration.tests.forEach((test) => {
      getBeforeEachesFor(suiteDeclaration).forEach((hook) => {
        result.addChild(hook.clone());
      });

      result.addChild(test.clone());

      getAfterEachesFor(suiteDeclaration).forEach((hook) => {
        result.addChild(hook.clone());
      });
    });

    suiteDeclaration.suites.forEach((childSuite) => {
      result.addChild(suiteToHooks(childSuite));
    });

    suiteDeclaration.getAfters().forEach((hook) => {
      result.addChild(hook.clone());
    });
  }

  return result;
}

module.exports = suiteToHooks;
