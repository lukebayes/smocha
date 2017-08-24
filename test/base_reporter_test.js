const BaseReporter = require('../').BaseReporter;
const assert = require('chai').assert;

describe('BaseReporter', () => {
  let instance;

  beforeEach(() => {
    instance = new BaseReporter();
  });

  it('is instantiable', () => {
    assert(instance);
  });
});
