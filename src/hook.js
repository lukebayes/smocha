const Composite = require('./composite');

// Shared stub function implementation, for hooks that have no handler.
function nullFunction() {};

/**
 * Hooks are the base wrapper around all test declarations including before,
 * after, beforeEach, afterEach, it and describe.
 *
 * These declarations have subtly different syntax expectations, but in general
 * they can be synchronous or they declare themselves as asynchronous by either
 * declaring a callback argument in the handler or returning a Promise when the
 * handler is called.
 */
class Hook extends Composite {
  constructor(label, handler) {
    super();
    this._label = label;
    this._handler = this._wrapHandler(handler);
  }

  _wrapHandler(handler) {
    // this looks like a declaration that expects an async callback.
    if (handler && handler.length > 0) {
      function asyncHandler() {
        return new Promise((resolve, reject) => {
          function callbackToPromise(err) {
            if (err) {
              reject(err);
            }
            resolve();
          }
          handler(callbackToPromise);
        });
      }
      return asyncHandler;
    }

    // This handler is either undefined or has zero arguments, therefore it is
    // either synchronous or it will return a promise when called.
    return handler || nullFunction;
  }

  execute() {
    return this._handler();
  }

  getLabel() {
    const base = this.parent ? this.parent.getLabel() + ' ' : '';
    return `${base}${this._label}`;
  }
}

module.exports = Hook;

