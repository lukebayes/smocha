var Smocha = require('../').Smocha,
    assert = require('assert');

describe('smocha 1', () => {
  var instance;

  beforeEach(() => {
    instance = new Smocha();
  });

  it('is instantiable', () => {
    assert(instance);
  });
});

