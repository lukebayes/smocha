const Hook = require('../').Hook;
const assert = require('chai').assert;
const sinon = require('sinon');

describe('Hook', () => {
  it('is instantiable', () => {
    const instance = new Hook();
    assert(instance);
  });

  it('accepts label and handler', () => {
    const instance = new Hook('abcd');
    assert.equal(instance.getFullLabel(), 'abcd');
  });

  it('uses a null function if no handler is provided', () => {
    const instance = new Hook();
    assert.isUndefined(instance.execute());
  });

  it('executes provided handler', () => {
    const handler = sinon.spy();
    const instance = new Hook('abcd', handler);
    instance.execute();
    assert.equal(handler.callCount, 1);
  });

  it('receives the hook as this', () => {
    let receivedLabel;
    function handler() {
      receivedLabel = this.getFullLabel();
    }
    const instance = new Hook('abcd', handler);
    instance.execute();
    assert.equal(receivedLabel, 'abcd');
  });

  it('receives the hook as this when using callback', () => {
    let receivedLabel;
    function handler(callback) {
      receivedLabel = this.getFullLabel();
      callback();
    }
    const instance = new Hook('abcd', handler);
    instance.execute();
    assert.equal(receivedLabel, 'abcd');
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

  describe('promise', () => {
    it('returns handler promise, if provided', () => {
      function handler() {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
      const result = new Hook('abcd', handler).execute();
      assert(result);
      assert(result.then);
      return result;
    });
  });

  describe('async', () => {
    it('handles async handler', () => {
      function handler(callback) {
        callback();
      }
      const result = new Hook('abcd', handler).execute();
      assert(result);
      // Wraps callback handler in a returned promise
      assert(result.then);
      return result;
    });

    it('forwards async failure to promise rejection', () => {
      function handler(callback) {
        callback('fake error');
      }
      return new Hook('abcd', handler).execute()
        .catch((err) => {
          assert.equal(err, 'fake error');
        });
    });
  });

  it('accepts optional isOnly parameter', () => {
    const handler = sinon.spy();
    const instance = new Hook('abcd', handler, true);
    assert.isFalse(instance.isPending);
    assert(instance.isOnly);
  });

  it('accepts optional isPending parameter', () => {
    const handler = sinon.spy();
    const instance = new Hook('abcd', handler, null, true);
    assert.isFalse(instance.isOnly);
    assert(instance.isPending);
  });
});
