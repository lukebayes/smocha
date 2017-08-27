const Emitter = require('./emitter');
const Suite = require('./suite');
const events = require('./events');

class HookVisitor extends Emitter {
  constructor(opt_options) {
    super();
    this._options = opt_options || {};
  }

  visitSuite(hook) {
    this.emit(events.SUITE, hook);
  }

  visitTest(hook) {
    this.emit(events.TEST, hook);
  }

  visitBefore(hook) {
    this.emit(events.BEFORE, hook);
  }

  visitAfter(hook) {
    this.emit(events.AFTER, hook);
  }

  visitBeforeEach(hook) {
    this.emit(events.BEFORE_EACH, hook);
  }

  visitAfterEach(hook) {
    this.emit(events.AFTER_EACH, hook);
  }
}

module.exports = HookVisitor;
