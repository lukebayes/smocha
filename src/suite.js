const Hook = require('./hook');
const nullFunction = require('./null_function');

/**
 * Fundamental container for test hooks.
 */
class Suite extends Hook {
  constructor(label, handler, opt_isOnly, opt_isPending) {
    super(label, handler, Hook.Types.Suite, opt_isOnly, opt_isPending);

    this._isEvaluationComplete = false;
    this.befores = [];
    this.afters = [];
    this.beforeEaches = [];
    this.afterEaches = [];
    this.suites = [];
    this.tests = [];
    // There is no runtime execution for suites, their handlers are executed
    // during file evaluation.
    this.handler = nullFunction;
  }

  addTest(hook) {
    hook.parent = this;
    this.tests.push(hook);
    return this;
  }

  addSuite(hook) {
    hook.parent = this;
    this.suites.push(hook);
    return this;
  }

  addBefore(hook) {
    hook.parent = this;
    this.befores.push(hook);
    return this;
  }

  addBeforeEach(hook) {
    hook.parent = this;
    this.beforeEaches.push(hook);
    return this;
  }

  addAfter(hook) {
    hook.parent = this;
    this.afters.push(hook);
    return this;
  }

  addAfterEach(hook) {
    hook.parent = this;
    this.afterEaches.push(hook);
    return this;
  }
}

module.exports = Suite;
