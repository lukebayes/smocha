const Hook = require('./hook');
const events = require('./events');

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

  /**
   * Override the underlying execute implementation so that we can be iterated
   * over without causing any delays.
   */
  execute() {
    // noop
  }

  addTest(hook) {
    this.tests.push(hook);
    return hook;
  }

  addSuite(hook) {
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

  onEvaluationComplete() {
    if (this.tests.length === 0 && this.children.length === 0) {
      // Clear befores and afters if there are no tests or children.
      this.befores.length = 0;
      this.afters.length = 0;
    } else {
      // Attach before hooks.
      this.befores.forEach((hook) => {
        this.addChild(hook);
      });

      this.tests.forEach((test) => {
        // Attach beforeEach hooks for each test.
        this.beforeEaches.forEach((hook) => {
          this.addChild(hook);
        });
        // Attach each test.
        this.addChild(test);
        // Attach afterEach hooks for each test.
        this.afterEaches.forEach((hook) => {
          this.addChild(hook);
        });
      });

      // Attach child suites.
      this.suites.forEach((suite) => {
        this.addChild(suite);
      });

      // Attach after hooks.
      this.afters.forEach((hook) => {
        this.addChild(hook);
      });
    }
  }
}

module.exports = Suite;
