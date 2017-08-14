const TestRunner = require('../').TestRunner;
const assert = require('chai').assert;

describe('TestRunner', () => {
  var instance;

  beforeEach(() => {
    instance = new TestRunner('test/fixtures/simple.js');
  });

  it('is instantiable', () => {
    assert(instance);
  });

  it('accepts a single file', () => {
    assert.deepEqual(instance.files, ['test/fixtures/simple.js']);
  });

  it('loads a file', () => {
    return instance.load();
  });
});

