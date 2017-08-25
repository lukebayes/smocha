const events = require('../').events;
const hooks = require('../').hooks;
const assert = require('chai').assert;
const sinon = require('sinon');

describe('hooks', () => {
  let handler;

  beforeEach(() => {
    handler = sinon.spy();
  });

  it('is available', () => {
    assert(hooks);
  });

  function createTestFor(eventName) {
    it(`creates a hook factory for ${eventName}`, () => {
      const hook = hooks[`create${eventName}`]();
      hook.on(eventName, handler);
      hook.execute();
      assert.equal(handler.callCount, 1);
    });
  }

  createTestFor(events.AFTER_BEGIN);
  createTestFor(events.AFTER_EACH_BEGIN);
  createTestFor(events.AFTER_EACH_END);
  createTestFor(events.AFTER_END);
  createTestFor(events.BEFORE_BEGIN);
  createTestFor(events.BEFORE_EACH_BEGIN);
  createTestFor(events.BEFORE_END);
  createTestFor(events.FORK_BEGIN);
  createTestFor(events.FORK_END);
  createTestFor(events.RUNNER_BEGIN);
  createTestFor(events.RUNNER_END);
  createTestFor(events.SUITE_BEGIN);
  createTestFor(events.SUITE_END);
  createTestFor(events.TEST_BEGIN);
  createTestFor(events.TEST_FAIL);
  createTestFor(events.TEST_PASS);
  createTestFor(events.TEST_TIMEOUT);
});

