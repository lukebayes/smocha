const FileLoader = require('../').FileLoader;
const assert = require('chai').assert;

describe('FileLoader', () => {
  let instance;

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
});


