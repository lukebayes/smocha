const Emitter = require('../').Emitter;
const assert = require('chai').assert;
const sinon = require('sinon');

describe('Emitter', () => {
  let instance;
  let handler;

  beforeEach(() => {
    instance = new Emitter([]);
    handler = sinon.spy();
  });

  it('is instantiable', () => {
    assert(instance);
  });

  it('throws on undefined subscription', () => {
    assert.throws(() => {
      instance.on(undefined, handler);
    }, /called with empty event name/);
  });

  it('dispatches to a subscriber', () => {
    instance.on('abcd', handler);
    instance.emit('abcd');
    assert.equal(handler.callCount, 1);
  });

  it('supports multiple subscribers', () => {
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

  it('calls all subscribers from the same event', () => {
    instance.on('abcd', handler);
    instance.on('abcd', handler);
    instance.on('abcd', handler);
    instance.emit('abcd');
    assert.equal(handler.callCount, 3);
  });

  it('returns unsubscribe function', () => {
    const unsubscribe = instance.on('abcd', handler);

    unsubscribe();
    instance.emit('abcd');
    assert.equal(handler.callCount, 0);
  });

  it('removes listener by handler reference and event name', () => {
    instance.on('abcd', handler);

    instance.remove('abcd', handler);
    const stopped = instance.emit('abcd');
    assert.equal(handler.callCount, 0);
    assert.isFalse(stopped);
  });

  it('halts progress if a handler returns true', () => {
    function stopper() { return true; };

    instance.on('abcd', handler);
    instance.on('abcd', stopper);
    instance.on('abcd', handler);
    const stopped = instance.emit('abcd');
    assert.equal(handler.callCount, 1);
    assert(stopped);
  });

  it('forwards provided payload', () => {
    let received;
    function handler(payload) {
      received = payload;
    }
    instance.on('abcd', handler);
    instance.emit('abcd', 'efgh');
    assert.equal(received, 'efgh');
  });

  it('notifies if it has a listener', () => {
    instance.on('abcd', sinon.spy());
    assert.isFalse(instance.hasListenerFor('efgh'));
    assert(instance.hasListenerFor('abcd'));
  });
});
