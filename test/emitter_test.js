// NOTE(lbayes): This class is likely to be removed, but holding off for now.
const Emitter = require('../src/emitter');
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

  it('halts progress if a handler returns Emitter.CANCEL', () => {
    function stopper() { return Emitter.CANCEL; };
    function other() { return true; };

    instance.on('abcd', handler); // Should be called.
    instance.on('abcd', other); // Should be called.
    instance.on('abcd', stopper); // Stops subsequent.
    instance.on('abcd', handler); // Should NOT be called.

    const stopped = instance.emit('abcd');
    assert.equal(handler.callCount, 1);
    assert.isTrue(stopped);
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
