const Emitter = require('./emitter');
const Suite = require('./suite');
const events = require('./events');

class HookVisitor extends Emitter {
  constructor(opt_options) {
    super();
    this._options = opt_options || {};
  }

  visit(hook) {
    if (hook instanceof Suite) {
      return this.visitSuite(hook);
    } else {
      throw new Error('Visitor entry point requires a Suite');
    }
  }

  visitSuite(hook) {
    this.emit(events.SUITE, hook);
  }

  visitTest(hook) {
    return this.emit(events.TEST, hook);
  }

  visitBefore(hook) {
    return this.emit(events.BEFORE, hook);
  }

  visitAfter(hook) {
    return this.emit(events.AFTER, hook);
  }

  visitBeforeEach(hook) {
    return this.emit(events.BEFORE_EACH, hook);
  }

  visitAfterEach(hook) {
    return this.emit(events.AFTER_EACH, hook);
  }
}

module.exports = HookVisitor;
