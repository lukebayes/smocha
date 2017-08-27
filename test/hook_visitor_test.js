const Hook = require('../').Hook;
const HookVisitor = require('../').HookVisitor;
const assert = require('chai').assert;
const sinon = require('sinon');

class FakeDelegate {
  onTest(test) {
  }
}

describe('HookVisitor', () => {
  let delegate;
  let instance;

  describe('active delegate', () => {
    beforeEach(() => {
      delegate = new FakeDelegate();
      instance = new HookVisitor(delegate);
    });

    it('handles onTest', () => {
      const test = new Hook('abcd');
      sinon.spy(delegate, 'onTest');
      instance.visitTest(test);
      assert.equal(delegate.onTest.callCount, 1);
    });
  });

  describe('empty delegate', () => {
    beforeEach(() => {
      delegate = {};
      instance = new HookVisitor(delegate);
    });

    it('ignores onTest', () => {
      const test = new Hook('abcd');
      instance.visitTest(test);
    });
  });
});
