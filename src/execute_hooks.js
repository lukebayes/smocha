const CompositeIterator = require('./composite_iterator');

/**
 * Execute all hooks present on the tree that is provided.
 *
 * Any synchronous hook blocks will be executed synchronously, any asynchronous
 * hooks will cause execution to wait until resolved or rejected. Declarations
 * that use the async (callback) style are already wrapped in a promise.
 */
function executeHooks(root) {
  const iterator = new CompositeIterator(root);

  return new Promise((resolve, reject) => {
    nextHook(iterator, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

/**
 * Get the next hook and execute it.
 *
 * If there are no more hooks in the iterator, call the provided complete
 * handler.
 */
function nextHook(iterator, completeHandler) {
  if (iterator.hasNext()) {
    const hook = iterator.next();


    try {
      const maybePromise = hook.execute();

      if (maybePromise) {
        maybePromise.then(() => {
          nextHook(iterator, completeHandler);
        });
      } else {
        nextHook(iterator, completeHandler);
      }
    } catch (err) {
      // noop
      console.log('ERROR:', err);
    } finally {
      // NOTE(lbayes): Ensure we continue iteration, even if a single hook
      // throws.
      nextHook(iterator, completeHandler);
    }
  } else {
    completeHandler();
  }
}


module.exports = executeHooks;
