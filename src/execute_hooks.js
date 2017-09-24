const AssertionError = require('chai').AssertionError;
const Hook = require('./hook');
const Iterator = require('./iterator');
const initializeTimer = require('./initialize_timer');
const nullFunction = require('./null_function');
const suiteToHooks = require('./suite_to_hooks');

/**
 * Execute all hooks in the provided Array serially.
 *
 * Any synchronous hook blocks will be executed synchronously, any asynchronous
 * hooks will cause execution to wait until resolved or rejected. Declarations
 * that use the async (callback) style will be wrapped in a promise.
 *
 * Call the provided onHookComplete handler after each hook is executed. This
 * handler will be provided with a results object that will include a reference
 * to the hook along with execution status fields.
 */
function executeHooks(root, onHookComplete) {
  const results = [];
  const iterator = new Iterator(root);

  return new Promise((resolve, reject) => {
    /**
     * Get the next hook and execute it.
     *
     * If there are no more hooks in the iterator, call the provided complete
     * handler.
     */
    function nextHook() {
      if (iterator.hasNext()) {
        executeHook(iterator.next(), (result) => {
          results.push(result);
          onHookComplete(result);
          nextHook();
        });
      } else {
        resolve(results);
      }
    }

    nextHook();
  });
}

/**
 * Wrap an async-style hook in a promise, or simply return the hook if it's
 * synchronous.
 */
function promisifyAsyncHook(handler) {
  if (handler.length > 0) {
    return function asyncHandler() {
      return new Promise((resolve, reject) => {
        function callbackToPromise(err) {
          if (err) {
            reject(err);
          }
          resolve();
        }
        // NOTE(lbayes): This outer function will be called with a context so
        // that 'this' refers to the HOOK instance.
        handler.call(this, callbackToPromise);
      });
    };
  }

  return handler;
}

/**
 * Handle hook failure as either an error or a test failure.
 */
function handleFailureOrError(err, onFailure, onError) {
  if (err instanceof AssertionError) {
    onFailure(err);
  } else {
    onError(err);
  }
}

function getHookExecutionContext(hook) {
  return {
    /**
     * This is here for backwards compatibility.
     */
    timeout: function(opt_duration) {
      if (!isNaN(opt_duration)) {
        hook.timeout = opt_duration;
      }
      return hook.timeout;
    }
  };
}

/**
 * Execute the provided hook, whether it's synchronous, async or returns a
 * promise.
 *
 * If the call causes a test failure, call onFailure.
 *
 * If the call causes an unexpected Error, call onError.
 *
 * When complete, call next().
 */
function executeHook(hook, onHookComplete) {
  let result;
  let handler = hook.handler;
  let failureResponse = null;
  let errorResponse = null;
  const getDuration = initializeTimer();

  function onFailure(failure) {
    failureResponse = failure;
  };

  function onError(err) {
    errorResponse = err;
  };

  function onComplete() {
    const result = {
      duration: getDuration(),
      error: errorResponse,
      failure: failureResponse,
      isOnly: hook.isOnly,
      isPassing: !!errorResponse && !!failureResponse,
      isPending: hook.isPending,
      label: hook.label,
      timeout: hook.timeout,
      type: hook.type,
    };
    onHookComplete(result);
  }

  try {
    // TODO(lbayes): Call the handler with some other context that allows for calls
    // to a timeout() function that mimics how mocha handles this.
    result = promisifyAsyncHook(handler).call(getHookExecutionContext(hook));
    if (result && typeof result.then === 'function') {
      return result
        .catch((err) => {
          handleFailureOrError(err, onFailure, onError);
        })
        .then(onComplete);
    } else {
      onComplete();
    }
  } catch (err) {
    handleFailureOrError(err, onFailure, onError);
    onComplete();
  }
}

module.exports = executeHooks;
