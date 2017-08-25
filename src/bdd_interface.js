const Hook = require('./hook');
const Suite = require('./suite');

const IS_ONLY = true;
const IS_PENDING = true;

/**
 * Bdd implementation of methods that are made available user-defined tests.
 *
 * This instance has a life cycle in that it is instantiated, then a sandbox
 * is requested (this an object containing bound method signatures) and then
 * tests are loaded against this instance and those sandboxed interface methods
 * are called by test definitions. After all tests have been processed, the
 * caller will ask for the root suite and can execute or analyze the assembled
 * tests as needed.
 */
class BddInterface {
  constructor() {
    this._currentSuite = null;
    this._configureAnnotations();
  }

  _configureAnnotations() {
    this.describe.only = (label, body) => {
      this.describe(label, body, IS_ONLY);
    };

    this.describe.skip = (label, body) => {
      this.describe(label, body, null, IS_PENDING);
    };

    this.it.only = (label, body) => {
      this.it(label, body, IS_ONLY);
    };

    this.it.skip = (label, body) => {
      this.it(label, body, null, IS_PENDING);
    };
  }

  describe(label, body, isOnly, isPending) {
    const parent = this._currentSuite;
    const child = new Suite(label, body, isOnly, isPending);

    if (parent) {
      // NOTE(lbayes): The current child MUST be attached to the tree before
      // the describe block is evaluated so that .only statements can message
      // the entire tree.
      parent.addChild(child);
    }

    this._currentSuite = child;

    // Evaluate the current describe block to construct a tree of Hooks and Suites
    if (body) {
      body();
    }

    if (parent) {
      this._currentSuite = parent;
    }
  }

  it(label, body, isOnly, isPending) {
    this._currentSuite.tests.push(new Hook(label, body, isOnly, isPending));
  }

  beforeEach(body) {
    this._currentSuite.beforeEaches.push(new Hook('beforeEach', body));
  }

  afterEach(body) {
    this._currentSuite.afterEaches.push(new Hook('afterEach', body));
  }

  before(body) {
    this._currentSuite.befores.push(new Hook('before', body));
  }

  after(body) {
    this._currentSuite.afters.push(new Hook('after', body));
  }

  getRoot() {
    return this._currentSuite.getRoot();
  }

  toSandbox() {
    return {
      after: this.after.bind(this),
      afterEach: this.afterEach.bind(this),
      before: this.before.bind(this),
      beforeEach: this.beforeEach.bind(this),
      describe: this.describe.bind(this),
      it: this.it.bind(this),
    };
  }
}

module.exports = BddInterface;
