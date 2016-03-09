var Suite = require('../../').Suite,
    assert = require('assert');

describe('Suite', () => {
  var instance;

  beforeEach(() => {
    instance = new Suite('abcd');
  });

  it('is instantiable', () => {
    assert(instance);
    assert.equal(instance.name, 'abcd');
    assert.equal(typeof instance.run, 'function');
  });
});

