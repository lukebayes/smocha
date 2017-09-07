const Composite = require('./composite');
const generateId = require('./generate_id');
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
    this.id = generateId();
    this.isPending = typeof opt_isPending !== 'undefined' ? opt_isPending : !opt_handler || false;
    this.isOnly = opt_isOnly || false;
    this.isDisabled = false;
    this.isComplete = false;
    this.handler = opt_handler || nullFunction;
    this.duration = 0;

    this._label = label;
    this._timeout = null;
  }

  /**
   * Set or get the timeout value for the current hook.
   *
   * This method will delegate to the nearest parent configuration if a local
   * value is not found.
   *
   * NOTE(lbayes): This method signature is only this way in order to support
   * legacy mocha tests.
   */
  timeout(opt_value) {
    if (opt_value) {
      this._timeout = opt_value;
    }

    if (this._timeout !== null) {
      return this._timeout;
    }

    return this.parent && this.parent.timeout() || DEFAULT_TIMEOUT;
  }

  /**
   * Get the full label (including parent labels) for this Hook.
   */
  getFullLabel() {
    const base = this.parent ? this.parent.getFullLabel() + ' ' : '';
    return `${base}${this._label}`;
  }

  /**
   * Get the local label only.
   */
  getLabel() {
    return this._label;
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

