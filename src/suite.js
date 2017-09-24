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
}

module.exports = Suite;
