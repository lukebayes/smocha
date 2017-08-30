const FakeStream = require('./fakes/fake_stream');
const TestRunner = require('../').TestRunner;
const assert = require('chai').assert;
const sinon = require('sinon');

describe('TestRunner', () => {
  let instance;

  beforeEach(() => {
    instance = new TestRunner({
      testDirectory: './test/fixtures',
      testExpression: '.*.js',
      stdout: new FakeStream(),
      stderr: new FakeStream(),
    });
  });

  it('is instantiable', () => {
    assert(instance);
  });

  it('is runnable', () => {
    return instance.run()
      .then((results) => {
        // assert(results.length >= 2);
        // console.log('>>> results:', results);
      });
  });
});

