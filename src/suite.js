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
    this.suites = [];
    this.tests = [];
  }

  addTest(hook) {
    this.addChild(hook);
    this.tests.push(hook);
    return hook;
  }

  addSuite(hook) {
    this.addChild(hook);
    this.suites.push(hook);
    return hook;
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
