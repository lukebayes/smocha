var Test = require('../../').Test,
    assert = require('assert');

describe('Test', () => {
  var instance;

  beforeEach(() => {
    instance = new Test('abcd');
  });

  it('is instantiable', () => {
    assert(instance);
    assert.equal(instance.name, 'abcd');
    assert(typeof instance.handler === 'function');
  });

  it('accepts handler', () => {
    var handler = function() {};
    instance = new Test('efgh', handler);
    assert.equal(instance.handler, handler);
  });

  it('accepts name with no handler', () => {
    instance = new Test('ijkl');
    assert.equal(instance.name, 'ijkl');
    assert.equal(instance.handler, Test.DEFAULT_HANDLER);
  });
});

