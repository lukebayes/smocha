const Emitter = require('../').Emitter;
const assert = require('chai').assert;
const sinon = require('sinon');

describe('Emitter', () => {
  it('is instantiable', () => {
    const instance = new Emitter([]);
    assert(instance);
  });

  it('dispatches to a subscriber', () => {
    const handler = sinon.spy();
    const instance = new Emitter();
    instance.on('abcd', handler);
    instance.emit('abcd');
    assert.equal(handler.callCount, 1);
  });

  it('supports multiple subscribers', () => {
    const instance = new Emitter();
    const handler = sinon.spy();
    instance.on('abcd', handler);
    instance.on('efgh', handler);
    instance.on('ijkl', handler);
    instance.emit('abcd');
    assert.equal(handler.callCount, 1);
    instance.emit('efgh');
    assert.equal(handler.callCount, 2);
    instance.emit('ijkl');
    assert.equal(handler.callCount, 3);
  });

  it('returns unsubscribe function', () => {
    const instance = new Emitter();
    const handler = sinon.spy();
    const unsubscribe = instance.on('abcd', handler);

    unsubscribe();
    instance.emit('abcd');
    assert.equal(handler.callCount, 0);
  });

  it('removes listener by handler reference and event name', () => {
    const instance = new Emitter();
    const handler = sinon.spy();
    instance.on('abcd', handler);

    instance.remove('abcd', handler);
    instance.emit('abcd');
    assert.equal(handler.callCount, 0);
  });
});
