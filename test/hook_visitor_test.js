const Hook = require('../').Hook;
const HookVisitor = require('../').HookVisitor;
const Suite = require('../').Suite;
const assert = require('chai').assert;
const events = require('../').events;
const sinon = require('sinon');

describe('HookVisitor', () => {
  let instance;
  let handler;
  let hook;

  describe('active delegate', () => {
    beforeEach(() => {
      instance = new HookVisitor();
      handler = sinon.spy();
      hook = new Hook();
    });

    function assertHandlerCalledWith(handler, hook) {
      assert.equal(handler.callCount, 1);
      assert.equal(handler.getCall(0).args[0], hook);
    }

    it('emits onTest', () => {
      instance.on(events.TEST, handler);
      instance.visitTest(hook);
      assertHandlerCalledWith(handler, hook);
    });

    it('emits onBefore', () => {
      instance.on(events.BEFORE, handler);
      instance.visitBefore(hook);
      assertHandlerCalledWith(handler, hook);
    });

    it('emits onBeforeEach', () => {
      instance.on(events.BEFORE_EACH, handler);
      instance.visitBeforeEach(hook);
      assertHandlerCalledWith(handler, hook);
    });

    it('emits afterEach', () => {
      instance.on(events.AFTER_EACH, handler);
      instance.visitAfterEach(hook);
      assertHandlerCalledWith(handler, hook);
    });

    it('emits after', () => {
      instance.on(events.AFTER, handler);
      instance.visitAfter(hook);
      assertHandlerCalledWith(handler, hook);
    });

    it('emits suite', () => {
      hook = new Suite();
      instance.on(events.SUITE, handler);
      instance.visitSuite(hook);
      assertHandlerCalledWith(handler, hook);
    });
  });
});
