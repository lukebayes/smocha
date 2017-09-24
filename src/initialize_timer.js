
function initializeTimer() {
  const start = new Date().getTime();
  // Call this returned function to get duration since initializeTimer() was called.
  return function() {
    return new Date().getTime() - start;
  };
}

module.exports = initializeTimer;

