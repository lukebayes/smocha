const hooks = require('../../').hooks;

describe('Test Hook', () => {
  let instance;

  beforeEach(() => {
    instance = new hooks.Test();
  });

  it('is instantiable', () => {
    assert(instance);
  });
});
