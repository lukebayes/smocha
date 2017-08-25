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

  /**
   * Execute all hooks, in order and wait for any asynchronous hooks to
   * complete before proceeding to the next one.
   */
  execute() {
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
    this.tests.forEach((test) => {
      result = result.concat(this.beforeEaches);
      result.push(test);
      result = result.concat(this.afterEaches);
    });

    // Nest the children as result
    this.forEach((child) => {
      result.concat(child.toHooks());
    });

    // Get the suite-level afters.
    return result.concat(this.afters);
    return result;
  }
}

module.exports = Suite;
