const Composite = require('./composite');
const nullFunction = require('./null_function');

/**
 * Default async hook timeout in milliseconds.
 */
const DEFAULT_TIMEOUT = 2000;

/**
 * Hooks are the base wrapper around all test declarations including describe,
 * before, after, beforeEach, afterEach and it.
 *
 * These declarations have subtly different syntax expectations, but in general
 * they can be synchronous or they can declare themselves as asynchronous by
 * either declaring a callback argument in the handler or returning a Promise
 * when the handler is called.
 */
class Hook extends Composite {
  constructor(label, opt_handler, opt_type, opt_isOnly, opt_isPending) {
    super();
    this.type = opt_type || Hook.Types.Default;
    this.isPending = typeof opt_isPending !== 'undefined' ? opt_isPending : !opt_handler || false;
    this.isOnly = opt_isOnly || false;
    this.handler = opt_handler || nullFunction;
    this.label = label || '';
    this.timeout = null;
  }

  getTimeout() {
    return this.timeout ? this.timeout : this.parent && this.parent.getTimeout() || DEFAULT_TIMEOUT;
  }

  /**
   * Get the full label (including parent labels) for this Hook.
   */
  getFullLabel() {
    const base = this.parent ? this.parent.getFullLabel() + ' ' : '';
    return `${base}${this.label}`;
  }

  toExecutable() {
    return {
      handler: this.handler,
      isOnly: this.isOnly,
      isPending: this.isPending,
      label: this.getFullLabel(),
      timeout: this.getTimeout(),
      type: this.type,
    };
  }
}

Hook.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;

Hook.Types = {
  After: 'After',
  AfterEach: 'AfterEach',
  Before: 'Before',
  BeforeEach: 'BeforeEach',
  Default: 'Default', // Used for tests
  Suite: 'Suite',
  Test: 'Test',
};

module.exports = Hook;

