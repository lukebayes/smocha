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

  beforeEach(() => {
    instance = new HookVisitor();
    handler = sinon.spy();
    hook = new Hook();
  });

  describe('traversal', () => {
    let after;
    let afterEachOne;
    let afterEachTwo;
    let before;
    let beforeEachOne;
    let beforeEachTwo;
    let childOne;
    let childTwo;
    let testOne;
    let testTwo;

    beforeEach(() => {
      after = new Hook('after');
      afterEachOne = new Hook('afterEach');
      afterEachTwo = new Hook('afterEach');
      before = new Hook('before');
      beforeEachOne = new Hook('beforeEach');
      beforeEachTwo = new Hook('beforeEach');
      testOne = new Hook('test one');
      testTwo = new Hook('test two');

      root = new Suite('root');

      childOne = new Suite('child one');
      childOne.addBefore(before);
      childOne.addBeforeEach(beforeEachOne);
      childOne.addBeforeEach(beforeEachTwo);
      childOne.addAfterEach(afterEachOne);
      childOne.addAfterEach(afterEachTwo);
      childOne.addAfter(after);
      childOne.addTest(testOne);
      childOne.addTest(testTwo);
      root.addChild(childOne);

      childTwo = new Suite('child two');
      childTwo.addBeforeEach(new Hook('beforeEach'));
      childTwo.addTest(new Hook('test three'));
      childOne.addChild(childTwo);
    });

    it.skip('traverses provided suite', () => {
      const beforeHandler = sinon.spy();
      instance.on(events.BEFORE, beforeHandler);
      instance.visit(root);
      assert.equal(beforeHandler.callCount, 29);
    });
  });

  describe('active delegate', () => {
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
