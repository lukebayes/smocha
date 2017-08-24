const Hook = require('./hook');

/**
 * Fundamental container for test hooks.
 */
class Suite extends Hook {
  constructor(label, handler) {
    super(label, handler);
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
    const hooks = this.toHooks();
  }

  /**
   * Flatten the entire tree of tests and suites and insert all before/after
   * hooks around each test or suite as the case may be.
   *
   * Return the array of hooks to be called serially.
   */
  toHooks() {
    // Capture the suite-level before blocks
    let hooks = this.befores.slice();

    // Create a hook set for beforeEaches, its and afterEaches
    this.tests.forEach((test) => {
      hooks = hooks.concat(this.beforeEaches);
      hooks.push(test);
      hooks = hooks.concat(this.afterEaches);
    });

    // Nest the children as hooks
    this.forEach((child) => {
      hooks.concat(child.toHooks());
    });

    // Get the suite-level afters.
    return hooks.concat(this.afters);
    return hooks;
  }
}

module.exports = Suite;
