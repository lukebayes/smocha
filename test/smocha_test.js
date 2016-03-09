var Smocha = require('../').Smocha,
    assert = require('assert');

describe('smocha', () => {
  var instance;

  beforeEach(() => {
    instance = new Smocha();
  });

  it('is instantiable', () => {
    assert(instance);
  });
});

