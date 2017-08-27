const Suite = require('./suite');
const nullFunction = require('./null_function');

class DelegateWrapper {
  constructor(delegate) {
    this._delegate = delegate;
  }

  onTest(hook) {
    if (!this._onTest) {
      console.log('assign onTest delegate');
      this._onTest = this._delegate.onTest instanceof Function ? this._delegate.onTest.bind(this._delegate) : nullFunction;
    }

    return this._onTest(hook);
  }
}

class HookVisitor {
  constructor(delegate, opt_options) {
    this._delegate = new DelegateWrapper(delegate);
    this._options = opt_options || {};
  }

  visitSuite(hook) {
  }

  visitHook(hook) {
  }

  visitTest(hook) {
    this._delegate.onTest(hook);
  }

  visitBefore(hook) {
  }

  visitAfter(hook) {
  }

  visitBeforeEach(hook) {
  }

  visitAfterEach(hook) {
  }
}

module.exports = HookVisitor;
