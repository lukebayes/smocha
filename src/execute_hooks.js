const AssertionError = require('chai').AssertionError;
const CompositeIterator = require('./composite_iterator');
const events = require('./events');
const nullFunction = require('./null_function');
const suiteToHooks = require('./suite_to_hooks');

/**
 * Execute all hooks present on the tree that is provided.
 *
 * Any synchronous hook blocks will be executed synchronously, any asynchronous
 * hooks will cause execution to wait until resolved or rejected. Declarations
 * that use the async (callback) style are already wrapped in a promise.
 */
function executeHooks(rootDefinition, opt_onProgress) {
  const root = suiteToHooks(rootDefinition);
  root.start();

  const onProgress = opt_onProgress || nullFunction;
  const results = [];
  const iterator = new CompositeIterator(root);

  return new Promise((resolve, reject) => {
    nextHook(iterator, onProgress, results, (err) => {
      if (err) return reject(err);
      root.end();
      resolve(results);
    });
  });
};

/**
 * Get the next hook and execute it.
 *
 * If there are no more hooks in the iterator, call the provided complete
 * handler.
 */
function nextHook(iterator, onProgress, results, completeHandler) {
  if (iterator.hasNext()) {
    function onNext() {
      nextHook(iterator, onProgress, results, completeHandler);
    };

    executeHook(iterator.next(), onProgress, results, onNext);
  } else {
    completeHandler();
  }
}

function createTimer() {
  const start = new Date().getTime();
  // Call this returned function to get duraction since createTimer() was called.
  return function() {
    return new Date().getTime() - start;
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
function executeHook(hook, onProgress, results, onNext) {
  let result;
  let handler = hook.handler;
  let failureResponse = null;
  let errorResponse = null;
  const duration = createTimer();
  hook.bubble(events.HOOK_BEGIN, hook);

  function onFailure(failure) {
    // console.log('on failure:', failure);
    failureResponse = failure;
  };

  function onError(err) {
    // console.log('on error:', err);
    errorResponse = err;
  };

  function onComplete() {
    const result = {
      error: errorResponse,
      failure: failureResponse,
      hook: hook,
      duration: duration(),
    };
    results.push(result);
    onProgress(result);
    hook.bubble(events.HOOK_COMPLETE, result);
    onNext();
  }

  try {
    result = promisifyAsyncHook(handler).call(hook);
    if (result && typeof result.then === 'function') {
      return result
        .catch((err) => {
          handleFailureOrError(err, onFailure, onError);
        })
        .then(() => {
          onComplete();
        });
    } else {
      onComplete();
    }
  } catch (err) {
    handleFailureOrError(err, onFailure, onError);
    onComplete();
  }
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

module.exports = executeHooks;
