const Hook = require('./hook');

class Suite extends Hook {
  constructor(label, handler) {
    super(label, handler);
    this.befores = [];
    this.afters = [];
    this.beforeEaches = [];
    this.afterEaches = [];
    this.tests = [];
  }

  execute() {
    this.toHooks().forEach((hook) => {
      hook.execute();
    });
  }

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
