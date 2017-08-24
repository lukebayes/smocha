const Hook = require('./hook');
const Suite = require('./suite');

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
    this._currentSuite.execute();
  }

  toSandbox() {
    return {
      after: this.after.bind(this),
      afterEach: this.afterEach.bind(this),
      before: this.before.bind(this),
      beforeEach: this.beforeEach.bind(this),
      describe: this.describe.bind(this),
      it: this.it.bind(this),
    }
  }
}

module.exports = BddInterface;
