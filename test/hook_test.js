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
    assert.equal(instance.getLabel(), 'abcd');
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

  it('label includes parent if composed', () => {
    const root = new Hook('abcd');
    const one = new Hook('efgh');
    const two = new Hook('ijkl');
    const three = new Hook('mnop');

    root.addChild(one);
    one.addChild(two);
    two.addChild(three);

    assert.equal(root.getLabel(), 'abcd');
    assert.equal(one.getLabel(), 'abcd efgh');
    assert.equal(two.getLabel(), 'abcd efgh ijkl');
    assert.equal(three.getLabel(), 'abcd efgh ijkl mnop');
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
});
