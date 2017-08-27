const {Hook} = require('../');
const {HookVisitor} = require('../');
const {assert} = require('chai');

class FakeDelegate {
}

describe('HookVisitor', () => {
  let delegate;
  let instance;

  beforeEach(() => {
    delegate = new FakeDelegate();
    instance = new HookVisitor(delegate);
  });

  it('is instantiable', () => {
    assert(instance);
  });

  it('visits a test', () => {
    const test = new Hook('abcd');
    instance.visitTest(test);
  });
});
