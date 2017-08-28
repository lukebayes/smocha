const CompositeIterator = require('./composite_iterator');
const Iterator = require('./iterator');

function nextHook(iterator, completeHandler) {
  if (iterator.hasNext()) {
    const maybePromise = iterator.next().execute();
    if (maybePromise) {
      maybePromise.then(() => {
        nextHook(iterator, completeHandler);
      });
    } else {
      nextHook(iterator, completeHandler);
    }
  } else {
    completeHandler();
  }
}


function executeTests(suiteIterator) {
  return new Promise((resolve, reject) => {
    nextHook(suiteIterator, () => {
      console.log('COMPLETE HANDLER CALLED!');
      resolve();
    });
  });
};

module.exports = executeTests;
