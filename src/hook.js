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
 * These declarations have subtle but important differences in terms of when
 * and how they are executed.
 *
 * Suite (describe) blocks are executed at evaluation time and given an
 * Interface as the calling context, while other blocks (Test, Before, etc.)
 * are executed later with a simplified context that only includes a function
 * for setting or retrieving async timeout.
 *
 * Handlers for non-Suite hooks may be synchronous or asynchronous, but suite
 * hooks must be synchronous.
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

  /**
   * Get the async timeout value for this location in the tree.
   */
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

  /**
   * When we transition from evaluation to execution, we operate over a list
   * instead of a tree. Copy flattened values from each nested hook and simplify
   * the surface for execution.
   */
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

