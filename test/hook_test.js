const Hook = require('../').Hook;
const assert = require('chai').assert;

describe('Hook', () => {
  let instance;

  beforeEach(() => {
    instance = new Hook();
  });

  it('is instantiable', () => {
    assert(instance);
  });
});
