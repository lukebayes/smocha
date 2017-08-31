const Composite = require('./composite');
const generateId = require('./generate_id');

/**
 * Default async hook timeout in milliseconds.
 */
const DEFAULT_TIMEOUT = 2000;
const DEFAULT_TYPE = 'hook';

// Shared stub function implementation, for hooks that have no handler.ca.
function nullFunction() {};

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
  constructor(label, handler, type, opt_isOnly, opt_isPending) {
    super();
    this.type = type || DEFAULT_TYPE;
    this.id = generateId();
    this.isPending = opt_isPending || false;
    this.isOnly = opt_isOnly || false;
    this.isDisabled = false;
    this.isComplete = false;
    this.duration = 0;

    this._label = label;
    this._preparedHandler = this._prepareHandler(handler);
    this._timeout = null;
  }

  /**
   * Ensure we at least have a null function to call if the handler is
   * undefined and otherwise prepare the provided handler by checking to see if
   * it expects a callback argument, so that we can wrap it in a promise, or
   * finally, ensure that we return whatever the implementation returns, which
   * should either be a promise or undefined.
   */
  _prepareHandler(handler) {
    // TODO(lbayes): Timeouts
    // This looks like a declaration that expects an async callback.
    if (handler && handler.length > 0) {
      function asyncHandler() {
        return new Promise((resolve, reject) => {
          function callbackToPromise(err) {
            if (err) {
              reject(err);
            }
            resolve();
          }
          // TODO(lbayes): Call the handler with a context, so that
          // implementations can call this.timeout(2000), and possibly other
          // methods.
          handler.call(this, callbackToPromise);
        });
      }
      return asyncHandler;
    }

    // This handler is either undefined or has zero arguments, therefore it is
    // either synchronous or it will return a promise when called.
    return handler || nullFunction;
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
   * Execute the provided handler.
   */
  execute() {
    return this._preparedHandler.call(this);
  }

  _getTimer() {
    const start = new Date().getTime();
    return () => {
      return new Date().getTime() - start;
    };
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

module.exports = Hook;

