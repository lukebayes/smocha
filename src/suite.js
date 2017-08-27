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

  getBefores() {
    return this.befores;
  }

  getAfters() {
    return this.afters;
  }

  /**
   * Get a list of beforeEach hooks that has the deepest declaration first and
   * the nearest one last.
   */
  getBeforeEaches() {
    let hooks = [];
    let current = this;

    while (current.parent) {
      current = current.parent;
      hooks = hooks.concat(current.beforeEaches);
    }

    hooks = hooks.concat(this.beforeEaches);

    return hooks;
  }

  /**
   * Get a list of afterEach hooks that has the nearest declaration first and
   * the deepest one last.
   */
  getAfterEaches() {
    let hooks = this.afterEaches;
    let current = this;

    while (current.parent) {
      current = current.parent;
      hooks = current.afterEaches.concat(hooks);
    }

    return hooks;
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
      // NOTE(lbayes): All add all parent beforeEaches here
      result = result.concat(this.getBeforeEaches());
      result.push(test);
      result = result.concat(this.getAfterEaches());
      // NOTE(lbayes): All add all parent afterEaches here
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
