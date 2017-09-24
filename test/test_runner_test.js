const FakeStream = require('./fakes/fake_stream');
const Hook = require('../').Hook;
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

  /*
  it('is runnable', () => {
    return instance.run()
      .then((results) => {
        const tests = results.filter((result) => {
          return result.type === Hook.Types.Test;
        });
        assert.equal(tests.length, 6);
      });
  });
  */
});

