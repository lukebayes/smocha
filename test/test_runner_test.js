const TestRunner = require('../').TestRunner;
const assert = require('chai').assert;

describe('TestRunner', () => {
  var instance;

  beforeEach(() => {
    instance = new TestRunner();
  });

  it('is instantiable', () => {
    assert(instance);
  });

  it('runs provided file', () => {
    instance.run('test/fixtures/simple.js');
  });
});

