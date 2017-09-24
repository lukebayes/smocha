const Hook = require('./hook');
const events = require('./events');
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
    return hook;
  }

  addSuite(hook) {
    hook.parent = this;
    this.suites.push(hook);
    return hook;
  }

  addBefore(hook) {
    hook.parent = this;
    this.befores.push(hook);
  }

  addBeforeEach(hook) {
    hook.parent = this;
    this.beforeEaches.push(hook);
  }

  addAfter(hook) {
    hook.parent = this;
    this.afters.push(hook);
  }

  addAfterEach(hook) {
    hook.parent = this;
    this.afterEaches.push(hook);
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
