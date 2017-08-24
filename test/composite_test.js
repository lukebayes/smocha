const Composite = require('../').Composite;
const assert = require('chai').assert;

describe('Composite', () => {
  let instance;

  beforeEach(() => {
    instance = new Composite();
  });

  it('is instantiable', () => {
    assert(instance);
  });
});
