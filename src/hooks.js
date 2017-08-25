const Hook = require('./hook');
const events = require('./events');

/**
 * Default hook implementation that will bubble an event that matches the hook
 * label.
 */
function hookEmitter() {
  this.bubble(this.getLabel(), this);
}

/**
 * Create a hook for the provided event name and apply it to the hooks object.
 */
function createHookFactoryFor(hooks, eventName) {
  hooks[`create${eventName}`] = function() {
    return new Hook(eventName, hookEmitter);
  };

}

const hooks = {};

createHookFactoryFor(hooks, events.AFTER_BEGIN);
createHookFactoryFor(hooks, events.AFTER_EACH_BEGIN);
createHookFactoryFor(hooks, events.AFTER_EACH_END);
createHookFactoryFor(hooks, events.AFTER_END);
createHookFactoryFor(hooks, events.BEFORE_BEGIN);
createHookFactoryFor(hooks, events.BEFORE_EACH_BEGIN);
createHookFactoryFor(hooks, events.BEFORE_END);
createHookFactoryFor(hooks, events.FORK_BEGIN);
createHookFactoryFor(hooks, events.FORK_END);
createHookFactoryFor(hooks, events.RUNNER_BEGIN);
createHookFactoryFor(hooks, events.RUNNER_END);
createHookFactoryFor(hooks, events.SUITE_BEGIN);
createHookFactoryFor(hooks, events.SUITE_END);
createHookFactoryFor(hooks, events.TEST_BEGIN);
createHookFactoryFor(hooks, events.TEST_FAIL);
createHookFactoryFor(hooks, events.TEST_PASS);
createHookFactoryFor(hooks, events.TEST_TIMEOUT);

module.exports = hooks;

