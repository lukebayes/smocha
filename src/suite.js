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

  /**
   * Override the underlying execute implementation so that we can be iterated
   * over without causing any delays.
   */
  execute() {
    // noop
    return this;
  }

  addTest(hook) {
    this.tests.push(hook);
    return hook;
  }

  addSuite(hook) {
    // NOTE(lbayes): REMOVE THIS!!!
    hook.parent = this;

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

  /**
   * Get a list of beforeEach hooks that has the deepest declaration first and
   * the nearest one last.
   */
  getAllBeforeEaches() {
    let current = this;
    let hooks = [];

    // This loop starts with the first parent..
    while (current && current.parent) {
      hooks = hooks.concat(current.getBeforeEaches());
      current = current.parent;
    }

    return hooks.concat(this.getBeforeEaches());
  }

  /**
   * Get a list of afterEach hooks that has the nearest declaration first and
   * the deepest one last.
   */
  getAllAfterEaches() {
    let current = this;
    // We begin with the parent's afterEaches.
    let hooks = [];

    // This loop starts with the first grandparent.
    while (current && current.parent) {
      hooks = current.getAfterEaches().concat(hooks);
      current = current.parent;
    }

    return hooks;
  }

  onEvaluationComplete() {
    if (!this._isEvaluationComplete) {
      this._isEvaluationComplete = true;
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
          this.getAllBeforeEaches().forEach((hook) => {
            this.addChild(hook);
          });
          // Attach each test.
          this.addChild(test);
          // Attach afterEach hooks for each test.
          this.getAllAfterEaches().forEach((hook) => {
            this.addChild(hook);
          });
        });

        // Attach child suites.
        this.suites.forEach((suite) => {
          this.addChild(suite);
          suite.onEvaluationComplete();
        });

        // Attach after hooks.
        this.afters.forEach((hook) => {
          this.addChild(hook);
        });
      }
    }
  }
}

module.exports = Suite;
