const Hook = require('../').Hook;
const assert = require('chai').assert;
const sinon = require('sinon');

describe('Hook', () => {
  it('is instantiable', () => {
    const instance = new Hook();
    assert(instance);
  });

  it('gets unique id when created', () => {
    const one = new Hook();
    const two = new Hook();
    assert.notEqual(one.id, two.id);
  });

  it('accepts label and handler', () => {
    const instance = new Hook('abcd');
    assert.equal(instance.getFullLabel(), 'abcd');
  });

  it('label includes parent if composed', () => {
    const root = new Hook('abcd');
    const one = new Hook('efgh');
    const two = new Hook('ijkl');
    const three = new Hook('mnop');

    root.addChild(one);
    one.addChild(two);
    two.addChild(three);

    assert.equal(root.getFullLabel(), 'abcd');
    assert.equal(one.getFullLabel(), 'abcd efgh');
    assert.equal(two.getFullLabel(), 'abcd efgh ijkl');
    assert.equal(three.getFullLabel(), 'abcd efgh ijkl mnop');
  });

  describe('toExecutable', () => {
    it('copies all keys', () => {
      const handler = sinon.spy();
      const root = new Hook('root');
      const parent = new Hook('abcd');
      const child = new Hook('efgh', handler, Hook.Types.Test);
      root.addChild(parent);
      parent.addChild(child);

      const copy = child.toExecutable();
      assert.equal(copy.label, 'root abcd efgh');
      assert.equal(copy.handler, handler);
      assert.equal(copy.type, Hook.Types.Test);
      assert.isFalse(copy.isOnly);
      assert.isFalse(copy.isPending);
    });
  });

  describe('timeout', () => {
    let instance;

    beforeEach(() => {
      instance = new Hook('abcd');
    });

    it('gets default timeout', () => {
      assert.equal(instance.timeout(), 2000);
    });

    it('sets timeout', () => {
      instance.timeout(3000);
      assert.equal(instance.timeout(), 3000);
    });

    it('does not accept 0 timeout', () => {
      instance.timeout(0);
      assert.equal(instance.timeout(), 2000);
    });

    it('gets timeout from parent', () => {
      const root = new Hook('abcd');
      const child = new Hook('efgh');
      root.addChild(child);

      root.timeout(50);
      assert.equal(child.timeout(), 50);
      assert.equal(root.timeout(), 50);
    });

    it('overrides timeout in child', () => {
      const root = new Hook('abcd');
      const child = new Hook('efgh');
      root.addChild(child);

      child.timeout(100);
      assert.equal(child.timeout(), 100);
      assert.equal(root.timeout(), 2000);
    });
  });

  it('accepts optional isOnly parameter', () => {
    const handler = sinon.spy();
    const instance = new Hook('abcd', handler, null, true);
    assert.isFalse(instance.isPending);
    assert(instance.isOnly);
  });

  it('accepts optional isPending parameter', () => {
    const handler = sinon.spy();
    const instance = new Hook('abcd', handler, null, null, true);
    assert.isFalse(instance.isOnly);
    assert(instance.isPending);
  });

  describe('isPending', () => {
    it('is not pending by default (if we have a handler)', () => {
      const instance = new Hook('abcd', () => {});
      assert.isFalse(instance.isPending);
    });

    it('isPending if no handler provided', () => {
      const instance = new Hook('abcd');
      assert(instance.isPending);
    });

    it('overrides default isPending if no handler, but isPending is true', () => {
      const instance = new Hook('abcd', null, null, null, false);
      assert.isFalse(instance.isPending);
    });
  });

  describe('type', () => {
    it('has a default', () => {
      const instance = new Hook();
      assert.equal(instance.type, Hook.Types.Default);
    });

    it('accepts a value', () => {
      const instance = new Hook('abcd', null, 'efgh');
      assert.equal(instance.type, 'efgh');
    });
  });
});
