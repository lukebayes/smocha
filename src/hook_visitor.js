const Suite = require('./suite');

class HookVisitor {
  constructor(delegate, opt_options) {
    this._delegate = delegate;
    this._options = opt_options || {};
  }

  visitSuite(hook) {
  }

  visitHook(hook) {
  }

  visitTest(hook) {
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
