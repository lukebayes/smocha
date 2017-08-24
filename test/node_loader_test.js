const NodeLoader = require('../').NodeLoader;
const assert = require('chai').assert;

describe('NodeLoader', () => {
  let instance;

  beforeEach(() => {
    instance = new NodeLoader();
  });

  it('is instantiable', () => {
    assert(instance);
  });
});
