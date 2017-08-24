const FileLoader = require('../').FileLoader;
const TestRunner = require('../').TestRunner;
const assert = require('chai').assert;

describe('FileLoader', () => {
  var instance;

  beforeEach(() => {
    instance = new FileLoader('test/fixtures/simple.js');
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

  it('builds hooks from simple file', () => {
    instance.load()
      .then((loaders) => {
        return new TestRunner(loaders).run();
      });
  });
});

