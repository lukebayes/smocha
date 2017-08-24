const Hook = require('./hook');
const Suite = require('./suite');

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
  }

  describe(label, body) {
    const parent = this._currentSuite;
    const child = new Suite(label, body);

    if (parent) {
      parent.addChild(child);
    }

    this._currentSuite = child;

    body();

    if (parent) {
      this._currentSuite = parent;
    }

  }

  it(label, body, onAsync) {
    this._currentSuite.tests.push(new Hook(label, body, onAsync));
  }

  beforeEach(body, onAsync) {
    this._currentSuite.beforeEaches.push(new Hook('beforeEach', body, onAsync));
  }

  afterEach(body, onAsync) {
    this._currentSuite.afterEaches.push(new Hook('afterEach', body, onAsync));
  }

  before(body, onAsync) {
    this._currentSuite.befores.push(new Hook('before', body, onAsync));
  }

  after(body, onAsync) {
    this._currentSuite.afters.push(new Hook('after', body, onAsync));
  }

  execute() {
    throw new Error('no longer implemented');
    this._currentSuite.execute();
  }

  getRoot() {
    return this._currentSuite;
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
