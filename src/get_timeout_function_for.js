
function getTimeoutFunctionFor(hook) {
  return function(opt_duration) {
    if (!isNaN(opt_duration)) {
      hook.timeout = opt_duration;
    }
    return hook.timeout;
  };
}

module.exports = getTimeoutFunctionFor;

