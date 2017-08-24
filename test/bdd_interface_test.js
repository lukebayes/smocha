const BddInterface = require('../').BddInterface;
const assert = require('chai').assert;

describe('BddInterface', () => {
  let instance;

  beforeEach(() => {
    instance = new BddInterface();
  });

  it('is instantiable', () => {
    assert(instance);
  });

  it('provides a describe implementation', () => {
  });
});

