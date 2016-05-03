var moduleState = 0;

/**
 * Demonstration of a module that stores global state.
 *
 * Can be used by tests to ensure that we prevent this class of global
 * interactions.
 */
module.exports = {
  /**
   * Calling this method between two tests should always return 1.
   */
  incrModuleState: function() {
    return moduleState++;
  }
};

