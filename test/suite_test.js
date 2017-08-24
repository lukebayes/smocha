const Suite = require('../').Suite;
const assert = require('chai').assert;

describe('Suite', () => {
  let instance;

  beforeEach(() => {
    instance = new Suite();
  });

  it('is instantiable', () => {
    assert(instance);
  });
});
