const Composite = require('./composite');

class Hook extends Composite {
  constructor(label, handler, onAsync) {
    super();
    this.label = label;
    this.handler = handler;
    this.onAsync = onAsync;
  }

  execute() {
    this.handler();
  }

  getLabel() {
    const base = this.parent ? this.parent.getLabel : '';
    return `${base} ${this.label}`;
  }
}

module.exports = Hook;

