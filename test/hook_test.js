const Hook = require('../').Hook;
const assert = require('chai').assert;
const sinon = require('sinon');

describe('Hook', () => {
  it('is instantiable', () => {
    const instance = new Hook();
    assert(instance);
  });

  it('accepts label and handler', () => {
    const handler = sinon.spy();
    const instance = new Hook('abcd', handler);
    assert.equal(instance.getLabel(), 'abcd');
    assert.equal(instance.handler, handler);
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

  describe('promisify', () => {
    it('returns handler promise, if provided', () => {
      function handler() {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
      const instance = new Hook('abcd', handler);
      const result = instance.execute();
      assert(result);
      assert(result.then);
      return result;
    });
  });

  describe('async', () => {
    it('handles async handler', () => {
      const onAsync = sinon.spy();
      function handler(callback) {
        callback();
      }
      const instance = new Hook('abcd', handler);
      const result = instance.execute();
      assert(result);
      return result;
    });
  });
});
