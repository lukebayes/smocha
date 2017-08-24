const Composite = require('./composite');

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
  constructor(label, handler, onAsync) {
    super();
    this._label = label;
    this.handler = this._wrapHandler(handler);
    this.onAsync = onAsync;
  }

  _wrapHandler(handler) {
    if (handler && handler.length > 0) {
      // this looks like a declaration that expects an async callback.
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
    return handler;
  }

  execute() {
    return this.handler();
  }

  getLabel() {
    const base = this.parent ? this.parent.getLabel() + ' ' : '';
    return `${base}${this._label}`;
  }
}

module.exports = Hook;

