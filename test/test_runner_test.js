const FileLoader = require('../').FileLoader;
const TestRunner = require('../').TestRunner;
const assert = require('chai').assert;
const sinon = require('sinon');

describe('TestRunner', () => {
  let instance;

  beforeEach(() => {
    instance = new TestRunner();
  });

  it('is instantiable', () => {
    assert(instance);
  });

  it('calls load() on provided loaders', () => {
    const exec = sinon.stub().returns('abcd');
    const fakeLoaders = [{load: exec}];
    return new TestRunner(fakeLoaders)
      .load()
      .then((results) => {
        assert.equal(results.length, 1);
        assert.equal(results[0], 'abcd');
      });
  });

  it('works with real file loader', () => {
    const loaders = [new FileLoader('./test/fixtures/simple.js')];
    return new TestRunner(loaders)
      .load()
      .then((results) => {
        assert.equal(results.length, 1);
      });
  });
});

