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
    this._configureAnnotations();
    this._onlys = [];
    this._currentSuite = new Suite();
  }

  _configureAnnotations() {
    this.describe.only = (label, body) => {
      this.describe(label, body, IS_ONLY);
    };

    this.describe.skip = (label, body) => {
      this.describe(label, body, null, IS_PENDING);
    };

    this.it.only = (label, body) => {
      const hook = this.it(label, body, IS_ONLY);
      this._onOnly(hook);
    };

    this.it.skip = (label, body) => {
      this.it(label, body, null, IS_PENDING);
    };
  }

  _clearNonOnlys() {
    const onlyLabels = this._onlys.map((only) => {
      return only.label;
    });

    this._currentSuite.getTests().forEach((testHook) => {
      if (onlyLabels.indexOf(testHook.label) === -1) {
        testHook.isDisabled = true;
      }
    });
  }

  _onOnly(hook) {
    this._onlys.push(hook);
  }

  describe(label, body, isOnly, isPending) {
    const parent = this._currentSuite;
    const child = new Suite(label, body, isOnly, isPending);

    parent.addSuite(child);

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
    return this._currentSuite.addTest(new Hook(label, body, Hook.Types.Test, isOnly, isPending));
  }

  beforeEach(body) {
    return this._currentSuite.addBeforeEach(new Hook('beforeEach', body, Hook.Types.BeforeEach));
  }

  afterEach(body) {
    return this._currentSuite.addAfterEach(new Hook('afterEach', body, Hook.Types.AfterEach));
  }

  before(body) {
    return this._currentSuite.addBefore(new Hook('before', body, Hook.Types.Before));
  }

  after(body) {
    return this._currentSuite.addAfter(new Hook('after', body, Hook.Types.After));
  }

  timeout(opt_duration) {
    this._currentSuite.timeout(opt_duration);
  }

  getRoot() {
    return this._currentSuite;
  }

  toSandbox() {
    const sandbox = {
      after: this.after.bind(this),
      afterEach: this.afterEach.bind(this),
      before: this.before.bind(this),
      beforeEach: this.beforeEach.bind(this),
      describe: this.describe.bind(this),
      it: this.it.bind(this),
    };
    sandbox.it.only = this.it.only.bind(this);
    sandbox.describe.only = this.describe.only.bind(this);
    sandbox.it.skip = this.it.skip.bind(this);
    sandbox.describe.skip = this.describe.skip.bind(this);

    return sandbox;
  }
}

module.exports = BddInterface;
