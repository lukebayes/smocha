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

  it('calls execute on provided loaders', () => {
    const exec = sinon.stub().returns('abcd');
    const fakeLoaders = [{execute: exec}];
    const results = new TestRunner(fakeLoaders).run();

    assert.equal(results.length, 1);
    assert.equal(results[0], 'abcd');
  });
});

