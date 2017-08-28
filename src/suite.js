const Hook = require('./hook');

/**
 * Fundamental container for test hooks.
 */
class Suite extends Hook {
  constructor(label, handler, opt_isOnly, opt_isPending) {
    super(label, handler, opt_isOnly, opt_isPending);

    this.befores = [];
    this.afters = [];
    this.beforeEaches = [];
    this.afterEaches = [];
    this.tests = [];
  }

  execute() {
    // noop
  }

  addBefore(hook) {
    this.befores.push(hook);
  }

  addBeforeEach(hook) {
    this.beforeEaches.push(hook);
  }

  addAfter(hook) {
    this.afters.push(hook);
  }

  addAfterEach(hook) {
    this.afterEaches.push(hook);
  }

  addTest(hook) {
    this.addChild(hook);
    this.tests.push(hook);
  }

  getTests() {
    return this.tests;
  }

  getBefores() {
    return this.befores;
  }

  getAfters() {
    return this.afters;
  }

  getBeforeEaches() {
    return this.beforeEaches;
  }

  getAfterEaches() {
    return this.afterEaches;
  }

  /**
   * Flatten the entire tree of tests and suites and insert all before/after
   * hooks around each test or suite as the case may be.
   *
   * Return the array of hooks to be called serially.
   */
  toHooks() {
    let result = [];
    // Capture the suite-level before blocks
    result = result.concat(this.befores.slice());

    // Create a hook set for beforeEaches, its and afterEaches
    // this.tests.forEach((test) => {
      // NOTE(lbayes): All add all parent beforeEaches here
      // result = result.concat(test.getBeforeEaches());
      // result.push(test);
      // result = result.concat(test.getAfterEaches());
      // NOTE(lbayes): All add all parent afterEaches here
    // });

    // Nest the children as result
    this.forEach((child) => {
      result = result.concat(child.toHooks());
    });

    // Get the suite-level afters.
    return result.concat(this.afters);
  }
}

module.exports = Suite;
